import { type CounterpartyRules, calculateCTD } from "@nexus/api/engines/ctd-engine";
import {
	ApproveSuggestionSchema,
	CollateralQuerySchema,
	CreateHoldingSchema,
	CreateMarginCallSchema,
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

	listPolicies: ledgerProcedure.input(CollateralQuerySchema).handler(async ({ input, context }) => {
		const all = await context.ledger.CollateralPolicy.findMany({ limit: input.limit });
		// Canton ACS does not support payload field filtering — filter client-side
		return all.filter(
			(p) => p.payload.institution === context.partyId && p.payload.active === true,
		);
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
			// 1. Fetch all policies and find by policyId in memory
			// (Canton ACS does not support payload field filtering without PQS)
			const allPolicies = await context.ledger.CollateralPolicy.findMany({});
			const policyContract = allPolicies.find(
				(p) => p.payload.policyId === input.policyId && p.payload.institution === context.partyId,
			);
			if (!policyContract) {
				throw new Error(`Policy not found: ${input.policyId}`);
			}
			const policy = policyContract.payload;

			// 2. Fetch holdings scoped to this institution
			const allHoldings = await context.ledger.CollateralHolding.findMany({});
			const holdings = allHoldings.filter((h) => h.payload.institution === context.partyId);

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

			// 5. Resolve counterparty party ID for observer visibility
			let counterpartyPartyId: string | null = null;
			if (input.counterpartyName) {
				try {
					const cantonUrl = process.env.CANTON_API_URL ?? "http://canton-sandbox:7575";
					const res = await fetch(`${cantonUrl}/v2/parties`);
					if (res.ok) {
						const data = (await res.json()) as { partyDetails?: { party: string }[] };
						const match = (data.partyDetails ?? []).find((p) =>
							p.party.split("::")[0].startsWith(input.counterpartyName ?? ""),
						);
						if (match) counterpartyPartyId = match.party;
					}
				} catch {
					// Non-fatal — counterparty won't be an observer if lookup fails
				}
			}

			// 6. Create RoutingSuggestion contract on Canton
			// All Decimal fields are rounded to 6dp — Daml Numeric(10) accepts up to 10dp
			// but JavaScript float arithmetic can produce 15+ significant digits.
			const round6 = (n: number) => parseFloat(n.toFixed(6));
			return context.ledger.RoutingSuggestion.create({
				routeId: `ROUTE-${Date.now()}`,
				institution: context.partyId,
				operator: context.operatorPartyId,
				counterparty: counterpartyPartyId,
				marginCallId: input.marginCallId,
				amountRequired: round6(input.amountRequired).toString(),
				suggestedAssets: ctdResult.selectedAssets.map((a) => a.symbol),
				suggestedAmounts: ctdResult.selectedAssets.map((a) => round6(a.amount).toString()),
				estimatedOpportunityCost: round6(ctdResult.totalOpportunityCost).toString(),
				opportunityCostBps: round6(
					(ctdResult.totalOpportunityCost / input.amountRequired) * 10000,
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

	// ─── Margin Calls (Counterparty) ────────────────────────────────────────

	createMarginCall: ledgerProcedure
		.input(CreateMarginCallSchema)
		.handler(async ({ input, context }) => {
			const cantonUrl = process.env.CANTON_API_URL ?? "http://canton-sandbox:7575";

			// Resolve operator and institution parties from Canton
			const operatorPartyId = context.operatorPartyId;

			// Look up the target institution party — never fall back to caller's own party
			// since the caller is the counterparty (PrimeBank), not the institution.
			let institutionPartyId: string | null = null;
			try {
				const res = await fetch(`${cantonUrl}/v2/parties`);
				if (res.ok) {
					const data = (await res.json()) as { partyDetails?: { party: string }[] };
					const parties = data.partyDetails ?? [];
					const institution = parties.find((p) =>
						p.party.split("::")[0].startsWith(input.institutionName),
					);
					if (institution) institutionPartyId = institution.party;
				}
			} catch {
				// Non-fatal
			}

			if (!institutionPartyId) {
				throw new Error(
					`Institution party not found: "${input.institutionName}". Make sure they have logged in at least once.`,
				);
			}

			const now = new Date();
			const dueBy = new Date(now.getTime() + (input.dueInHours ?? 2) * 60 * 60 * 1000);

			return context.ledger.MarginCall.create({
				callId: `MC-${Date.now()}`,
				operator: operatorPartyId,
				institution: institutionPartyId,
				counterparty: context.partyId,
				amountRequired: input.amountRequired.toString(),
				currency: input.currency,
				dueBy: dueBy.toISOString(),
				status: "RoutePending",
				createdAt: now.toISOString(),
			});
		}),

	listMarginCalls: ledgerProcedure
		.input(CollateralQuerySchema)
		.handler(async ({ input, context }) => {
			const all = await context.ledger.MarginCall.findMany({ limit: input.limit });
			// Filter by role: institution sees calls addressed to them,
			// counterparty sees calls they issued, operator sees all
			return all.filter((mc) => {
				const { institution, counterparty } = mc.payload;
				if (institution === context.partyId) return true; // addressed to me
				if (counterparty === context.partyId) return true; // issued by me
				// Operator sees everything — operator is neither institution nor counterparty
				// but will still see all contracts as an observer
				return false;
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

		// For seeding, use institution as operator so the contract can be created
		// with actAs = [institution] only. CollateralPolicy requires both operator
		// and institution as signatories — using the same party for both satisfies
		// this with a single actAs entry. This is safe for demo/dev mode.
		const operatorPartyId = partyId;

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

		// 4. Create USDC holding ($5M @ 0% yield — intentionally small so CTD
		// must combine multiple assets, producing a non-zero opportunity cost
		// and a more interesting routing result in the demo.
		await ledger.CollateralHolding.create({
			operator: operatorPartyId,
			holdingId: "HOLD-USDC-001",
			institution: partyId,
			asset: "USDC",
			amount: "5000000.0",
			yield: "0.0",
			haircut: "0.0",
			expiry: null,
		});

		return { success: true, policyId: "POLICY-001", holdingsCreated: 3, operatorPartyId };
	}),
};
