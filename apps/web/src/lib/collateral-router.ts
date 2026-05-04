import { type CounterpartyRules, calculateCTD } from "@nexus/api/engines/ctd-engine";
import {
	ApproveSuggestionSchema,
	CollateralQuerySchema,
	CreateHoldingSchema,
	CreatePolicySchema,
	GenerateSuggestionSchema,
	RejectSuggestionSchema,
	UpdatePolicySchema,
} from "@nexus/api/schemas/collateral";
import { ledgerProcedure } from "./procedures";

/**
 * Collateral Router for SignUIT.
 *
 * Manages collateral policies, holdings, and routing suggestions.
 * Uses ledgerProcedure for full type inference from Daml.
 */
export const collateralRouter = {
	// ─── Policy Management ─────────────────────────────────────────────────

	createPolicy: ledgerProcedure.input(CreatePolicySchema).handler(({ input, context }) => {
		return context.ledger.CollateralPolicy.create({
			operator: context.operatorPartyId,
			institution: context.partyId,
			policyId: input.policyId,
			ruleType: input.ruleType,
			priorityList: input.priorityList,
			minLtv: input.minLtv.toString(),
			maxHaircut: input.maxHaircut.toString(),
			counterpartyRules: (input.counterpartyRules ?? []).map(([name, assets]) => ({
				_1: name,
				_2: assets,
			})),
			autoApprove: input.autoApprove,
			notificationEmail: input.notificationEmail ?? null,
			active: true,
			createdAt: new Date().toISOString(),
		});
	}),

	listPolicies: ledgerProcedure.input(CollateralQuerySchema).handler(({ input, context }) => {
		return context.ledger.CollateralPolicy.findMany({
			limit: input.limit,
		});
	}),

	updatePolicy: ledgerProcedure.input(UpdatePolicySchema).handler(({ input, context }) => {
		return context.ledger.CollateralPolicy.exercise(input.contractId, "UpdateCollateralPolicy", {
			newRuleType: input.ruleType,
			newPriorityList: input.priorityList,
			newMinLtv: input.minLtv.toString(),
			newMaxHaircut: input.maxHaircut.toString(),
			newCounterpartyRules: (input.counterpartyRules ?? []).map(([name, assets]) => ({
				_1: name,
				_2: assets,
			})),
			newAutoApprove: input.autoApprove,
			newNotificationEmail: input.notificationEmail ?? null,
			newActive: input.active,
		});
	}),

	// ─── Holdings Management ───────────────────────────────────────────────

	createHolding: ledgerProcedure.input(CreateHoldingSchema).handler(({ input, context }) => {
		return context.ledger.CollateralHolding.create({
			operator: context.operatorPartyId,
			holdingId: input.holdingId,
			institution: context.partyId,
			asset: input.asset,
			amount: input.amount.toString(),
			yield: input.yield.toString(),
			haircut: input.haircut.toString(),
			expiry: input.expiry ?? null,
		});
	}),

	listHoldings: ledgerProcedure.input(CollateralQuerySchema).handler(({ input, context }) => {
		return context.ledger.CollateralHolding.findMany({
			limit: input.limit,
		});
	}),

	// ─── Routing Operations ────────────────────────────────────────────────

	/**
	 * Generate CTD routing recommendation.
	 *
	 * Day 1 MVP: Creates a RoutingSuggestion that requires human approval.
	 * The ops team must review and click "Approve" before execution.
	 *
	 * Flow:
	 * 1. Fetch policy and holdings from Canton
	 * 2. Run off-chain CTD algorithm (3-second calculation)
	 * 3. Create RoutingSuggestion contract on Canton (recommendation)
	 * 4. Wait for human to approve/reject
	 *
	 * Phase 2: When policy.autoApprove = true, approval can be automatic.
	 */
	generateSuggestion: ledgerProcedure
		.input(GenerateSuggestionSchema)
		.handler(async ({ input, context }) => {
			// 1. Fetch policy
			const policies = await context.ledger.CollateralPolicy.findMany({
				where: { policyId: input.policyId },
			});
			if (policies.length === 0) {
				throw new Error(`Policy not found: ${input.policyId}`);
			}
			const policy = policies[0].payload;

			// 2. Fetch holdings
			const holdings = await context.ledger.CollateralHolding.findMany({});

			// 3. Extract counterparty rules if specified
			let counterpartyRules: CounterpartyRules | undefined;
			if (input.counterpartyName && policy.counterpartyRules) {
				const rule = policy.counterpartyRules.find((r) => r._1 === input.counterpartyName);
				if (rule) {
					counterpartyRules = {
						counterpartyName: rule._1,
						acceptableAssets: rule._2,
					};
				}
			}

			// 4. Run CTD calculation (off-chain)
			// NOTE: ExpiryFirst and YieldMax rule types are planned for Phase 2.
			// All policy.ruleType values currently execute the CTD (cheapest-to-deliver) algorithm.
			const ctdResult = calculateCTD(
				holdings.map((h) => ({
					symbol: h.payload.asset,
					amount: parseFloat(h.payload.amount),
					yield: parseFloat(h.payload.yield),
					haircut: parseFloat(h.payload.haircut),
					eligible: true,
					expiry: h.payload.expiry ?? undefined,
				})),
				input.amountRequired,
				policy.priorityList,
				parseFloat(policy.minLtv),
				parseFloat(policy.maxHaircut),
				input.durationDays,
				counterpartyRules,
			);

			if (ctdResult.selectedAssets.length === 0) {
				throw new Error(ctdResult.explanation);
			}

			// 5. Create RoutingSuggestion contract on Canton
			return context.ledger.RoutingSuggestion.create({
				routeId: `ROUTE-${Date.now()}`,
				institution: context.partyId,
				operator: context.operatorPartyId,
				marginCallId: input.marginCallId,
				amountRequired: input.amountRequired.toString(),
				suggestedAssets: ctdResult.selectedAssets.map((a) => a.symbol),
				suggestedAmounts: ctdResult.selectedAssets.map((a) => a.amount.toString()),
				estimatedOpportunityCost: ctdResult.totalOpportunityCost.toString(),
				opportunityCostBps: (
					(ctdResult.totalOpportunityCost / input.amountRequired) *
					10000
				).toString(),
				alternativeOptions: [],
				expiryWarnings: [],
				explanation: ctdResult.explanation,
				status: "RoutePending",
				createdAt: new Date().toISOString(),
			});
		}),

	approveSuggestion: ledgerProcedure
		.input(ApproveSuggestionSchema)
		.handler(({ input, context }) => {
			return context.ledger.RoutingSuggestion.exercise(input.suggestionCid, "ApproveSuggestion", {
				approvedBy: context.partyId,
			});
		}),

	rejectSuggestion: ledgerProcedure.input(RejectSuggestionSchema).handler(({ input, context }) => {
		return context.ledger.RoutingSuggestion.exercise(input.suggestionCid, "RejectSuggestion", {});
	}),

	listSuggestions: ledgerProcedure.input(CollateralQuerySchema).handler(({ input, context }) => {
		return context.ledger.RoutingSuggestion.findMany({
			limit: input.limit,
		});
	}),

	// ─── Audit Trail ───────────────────────────────────────────────────────

	listAllocations: ledgerProcedure.input(CollateralQuerySchema).handler(({ input, context }) => {
		return context.ledger.AllocationRecord.findMany({
			limit: input.limit,
		});
	}),

	// ─── Demo Setup ────────────────────────────────────────────────────────

	/**
	 * One-click demo initialization.
	 * Creates POLICY-001 (CTD) + 3 collateral holdings (USYC / UST / USDC).
	 * Idempotent-ish: will fail gracefully if contracts already exist.
	 */
	seedDemoData: ledgerProcedure.handler(async ({ context }) => {
		const now = new Date().toISOString();
		const { partyId, ledger } = context;

		// Resolve operator party ID — use dynamic lookup, fall back to own party
		// so self-signed contracts work even before SignUIT logs in.
		const { resolveOperatorPartyId } = await import("./procedures");
		const resolvedOperator = await resolveOperatorPartyId();
		// If operator is still just the hint string (e.g. "SignUIT" without fingerprint),
		// fall back to using the institution's own party as operator.
		const operatorPartyId =
			resolvedOperator.includes("::") ? resolvedOperator : partyId;

		// 1. Create CTD policy
		await ledger.CollateralPolicy.create({
			operator: operatorPartyId,
			institution: partyId,
			policyId: "POLICY-001",
			ruleType: "CTD",
			priorityList: ["USYC", "UST", "USDC"],
			minLtv: "0.95",
			maxHaircut: "0.10",
			counterpartyRules: [{ _1: "PrimeBank", _2: ["USYC", "UST", "USDC"] }],
			autoApprove: false,
			notificationEmail: null,
			active: true,
			createdAt: now,
		});

		// 2. Create USYC holding ($8.2M @ 4.5% APY, 2% haircut)
		await ledger.CollateralHolding.create({
			operator: operatorPartyId,
			holdingId: "HOLD-USYC-001",
			institution: partyId,
			asset: "USYC",
			amount: "8200000.0",
			yield: "0.045",
			haircut: "0.02",
			expiry: null,
		});

		// 3. Create UST holding ($12M @ 4.2% APY, 5% haircut)
		await ledger.CollateralHolding.create({
			operator: operatorPartyId,
			holdingId: "HOLD-UST-001",
			institution: partyId,
			asset: "UST",
			amount: "12000000.0",
			yield: "0.042",
			haircut: "0.05",
			expiry: null,
		});

		// 4. Create USDC holding ($25M @ 0% yield, 0% haircut)
		await ledger.CollateralHolding.create({
			operator: operatorPartyId,
			holdingId: "HOLD-USDC-001",
			institution: partyId,
			asset: "USDC",
			amount: "25000000.0",
			yield: "0.0",
			haircut: "0.0",
			expiry: null,
		});

		return { success: true, policyId: "POLICY-001", holdingsCreated: 3, operatorPartyId };
	}),
};
