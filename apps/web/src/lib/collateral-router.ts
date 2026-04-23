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
			operator: context.partyId,
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
		return context.ledger.CollateralPolicy.exercise(input.contractId, "UpdatePolicy", {
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
				marginCallId: input.marginCallId,
				amountRequired: input.amountRequired.toString(),
				suggestedAssets: ctdResult.selectedAssets.map((a) => a.symbol),
				suggestedAmounts: ctdResult.selectedAssets.map((a) => a.amount.toString()),
				estimatedOpportunityCost: ctdResult.totalOpportunityCost.toString(),
				opportunityCostBps: (
					(ctdResult.totalOpportunityCost / input.amountRequired) *
					10000
				).toString(),
				alternativeOptions: [], // Could be populated if engine supports it
				expiryWarnings: [],
				explanation: ctdResult.explanation,
				status: "Pending",
				createdAt: new Date().toISOString(),
			});
		}),

	approveSuggestion: ledgerProcedure
		.input(ApproveSuggestionSchema)
		.handler(({ input, context }) => {
			return context.ledger.RoutingSuggestion.exercise(
				input.suggestionCid,
				"ApproveSuggestion",
				{},
			);
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
};
