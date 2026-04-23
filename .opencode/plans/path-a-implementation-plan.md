# Path A Implementation Plan: Fix CTD Demo Story

**Status:** Ready for Execution  
**Estimated Time:** 35 minutes  
**Strategy:** Keep algorithm logic, fix narrative to match reality

---

## Executive Summary

The CTD engine is **economically correct** - it selects USDC first because it has zero opportunity cost (0% yield), which preserves yield-bearing assets (USYC, UST) earning income. 

**The problem:** README and documentation claim the opposite - that USYC+UST are selected instead of USDC.

**The solution:** Update documentation and field names to match actual algorithm behavior. Reframe value proposition around automation, compliance, and auditability (not fake savings).

---

## Change #1: Remove `savingsVsUSDC` from CTD Engine

### File: `/packages/api/src/engines/ctd-engine.ts`

#### Change 1.1: Update Interface (lines 16-22)

**BEFORE:**
```typescript
export interface CTDResult {
	selectedAssets: CTDSelection[];
	totalOpportunityCost: number;
	savingsVsUSDC: number;
	explanation: string;
	alternatives: CTDResult[];
}
```

**AFTER:**
```typescript
export interface CTDResult {
	selectedAssets: CTDSelection[];
	totalOpportunityCost: number;
	explanation: string;
	alternatives: CTDResult[];
}
```

#### Change 1.2: Remove Misleading Calculation (lines 98-124)

**BEFORE:**
```typescript
	if (remaining > 0) {
		// Could not satisfy requirement
		return {
			selectedAssets: [],
			totalOpportunityCost: 0,
			savingsVsUSDC: 0,
			explanation: "Insufficient eligible collateral to satisfy margin call.",
			alternatives: [],
		};
	}

	// 4. Calculate savings vs USDC baseline
	// USDC has 0 yield, so cost is 0.
	// Savings = (Cost of USDC - Cost of Selected) ... wait, if USDC is 0, savings will be negative?
	// Actually, usually "savings" in these demos implies that the "Yield Maximizer" rule
	// might be the one generating savings by using assets that have the lowest cost.
	// Let's just calculate the difference.
	const savingsVsUSDC = 0 - totalOpportunityCost;

	return {
		selectedAssets,
		totalOpportunityCost,
		savingsVsUSDC,
		explanation: `Selected ${selectedAssets.length} asset(s) with total opportunity cost of ${totalOpportunityCost.toFixed(2)} USD over ${durationDays} days.`,
		alternatives: [], // Could be populated with next best combinations
	};
```

**AFTER:**
```typescript
	if (remaining > 0) {
		// Could not satisfy requirement
		return {
			selectedAssets: [],
			totalOpportunityCost: 0,
			explanation: "Insufficient eligible collateral to satisfy margin call.",
			alternatives: [],
		};
	}

	// 4. Return result with total opportunity cost
	return {
		selectedAssets,
		totalOpportunityCost,
		explanation: `Selected ${selectedAssets.length} asset(s) with total opportunity cost of ${totalOpportunityCost.toFixed(2)} USD over ${durationDays} days.`,
		alternatives: [], // Could be populated with next best combinations
	};
```

#### Change 1.3: Add Yield Preservation Comments (after line 30)

**ADD THIS COMMENT BLOCK:**
```typescript
/**
 * Cheapest-to-Deliver Algorithm
 *
 * STRATEGY: Yield Preservation
 * 
 * How it works:
 * 1. Calculate opportunity cost for each asset = (yield × duration) / LTV
 * 2. Sort ASCENDING (lowest cost first)
 * 3. Select assets starting from lowest opportunity cost
 * 
 * Result:
 * - Non-yielding assets (USDC at 0% yield) have $0 opportunity cost → sent first
 * - Yield-bearing assets (USYC, UST) are preserved to continue earning income
 * - Institutions maximize capital efficiency by keeping high-yield assets deployed
 * 
 * Example:
 * - USDC (0% yield) → cost = $0 → selected first ✓
 * - UST (4.2% yield) → cost = ~$52/day on $15M → fallback
 * - USYC (4.5% yield) → cost = ~$55/day on $15M → last resort
 * 
 * This is the economically rational default for margin call responses.
 * 
 * @param holdings - Available collateral assets
 * @param amountRequired - Collateral amount needed
 * @param priorityList - Institutional preference order (tie-breaker only)
 * @param minLtv - Minimum loan-to-value ratio (e.g., 0.90 = 90%)
 * @param maxHaircut - Maximum acceptable haircut (e.g., 0.10 = 10%)
 * @param durationDays - Time horizon for opportunity cost calculation (default: 30)
 */
```

---

## Change #2: Rename Fields in Daml Contract

### File: `/sandbox/daml/CollateralRouter.daml`

#### Change 2.1: RoutingSuggestion Template (line 142)

**BEFORE:**
```daml
    ctdSavings       : Decimal     -- Estimated savings vs USDC baseline
```

**AFTER:**
```daml
    estimatedOpportunityCost : Decimal  -- Opportunity cost over duration (in USD)
```

#### Change 2.2: Update ApproveSuggestion Choice (lines 153-175)

**BEFORE:**
```daml
    choice ApproveSuggestion : ContractId AllocationRecord
      controller institution
      do
        now <- getTime
        create AllocationRecord with
          allocationId = routeId <> "-ALLOC"
          institution = institution
          marginCallId = marginCallId
          assetsAllocated = suggestedAssets
          amountsAllocated = suggestedAmounts
          ruleTypeApplied = "CTD"
          ctdSavingsBps = ctdSavings * 10000.0  -- Convert to bps
          approvedBy = institution
          executionStatus = Executed
          createdAt = now
```

**AFTER:**
```daml
    choice ApproveSuggestion : ContractId AllocationRecord
      controller institution
      do
        now <- getTime
        create AllocationRecord with
          allocationId = routeId <> "-ALLOC"
          institution = institution
          marginCallId = marginCallId
          assetsAllocated = suggestedAssets
          amountsAllocated = suggestedAmounts
          ruleTypeApplied = "CTD"
          opportunityCostBps = (estimatedOpportunityCost / amountRequired) * 10000.0  -- Cost in basis points
          approvedBy = institution
          executionStatus = Executed
          createdAt = now
```

#### Change 2.3: AllocationRecord Template (line 200)

**BEFORE:**
```daml
    ctdSavingsBps    : Decimal     -- Estimated savings in basis points
```

**AFTER:**
```daml
    opportunityCostBps : Decimal   -- Opportunity cost in basis points
```

---

## Change #3: Update API Router

### File: `/apps/web/src/lib/collateral-router.ts`

#### Change 3.1: generateSuggestion Handler (lines 121-138)

**BEFORE:**
```typescript
			// 4. Create RoutingSuggestion contract on Canton
			return context.ledger.RoutingSuggestion.create({
				routeId: `ROUTE-${Date.now()}`,
				institution: context.partyId,
				marginCallId: input.marginCallId,
				amountRequired: input.amountRequired.toString(),
				suggestedAssets: ctdResult.selectedAssets.map((a) => a.symbol),
				suggestedAmounts: ctdResult.selectedAssets.map((a) => a.amount.toString()),
				ctdSavings: ctdResult.savingsVsUSDC.toString(),
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
```

**AFTER:**
```typescript
			// 4. Create RoutingSuggestion contract on Canton
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
```

---

## Change #4: Rewrite README Demo Story

### File: `/README.md`

#### Change 4.1: Demo Walkthrough Section (lines 147-172)

**BEFORE:**
```markdown
## Demo Walkthrough

### Scenario: $15M Margin Call (5 minutes)

```
Step 1 — Trigger Fires
  Margin call #MC-4821 received: $15M required
  
Step 2 — CTD Calculation
  Available holdings:
    USYC:  $8.2M (yield: 4.5%, haircut: 2%)
    UST:  $12.0M (yield: 4.2%, haircut: 5%)
    USDC: $25.0M (yield: 0%, haircut: 0%)
    
  CTD Result:
    $8.2M USYC + $7.3M UST = $15.0M ✓
    Savings vs USDC: $1,849/night

Step 3 — User Approves
  Click "Approve" on suggestion screen
  Settlement executes on Canton

Step 4 — Audit Trail
  AllocationRecord #88341 created
  Chain: policy used → assets chosen → timestamp
```
```

**AFTER:**
```markdown
## Demo Walkthrough

### Scenario: $15M Margin Call

**Context:** VantageCapital receives a $15M margin call from PrimeBank at 3:47 PM ET. Required by 4:00 PM ET.

```
Step 1 — Margin Call Trigger
  Margin call #MC-4821 received
  Amount required: $15.0M USD
  Deadline: 13 minutes
  
Step 2 — CTD Engine Analyzes Holdings
  Available collateral:
    • USDC:  $25.0M (yield: 0%, LTV: 100%, expires: never)
    • UST:   $12.0M (yield: 4.2%, LTV: 95%, expires: 2027-06-15)
    • USYC:  $8.2M (yield: 4.5%, LTV: 98%, expires: 2027-09-20)
    
  Opportunity cost calculation:
    • USDC → $0.00/day (no yield to lose)
    • UST  → $51.70/day (lost yield on $15M equivalent)
    • USYC → $55.48/day (lost yield on $15M equivalent)

Step 3 — CTD Recommendation
  ✓ Selected: $15.0M USDC
  
  Why USDC?
    ✓ Zero opportunity cost (no yield sacrificed)
    ✓ 100% LTV (no over-collateralization needed)
    ✓ Instant settlement, maximum liquidity
    ✓ Preserves $20.2M of yield-bearing assets
    ✓ Keeps USYC + UST earning ~$2,300/day combined
    
  Value delivered:
    • Decision time: 3 seconds (vs 30-minute manual process)
    • Policy compliance: automatic eligibility checking
    • Audit trail: immutable record on Canton
    • Capital efficiency: yield-bearing assets preserved

Step 4 — User Approves
  Ops team reviews suggestion
  Clicks "Approve" at 3:48 PM ET
  Settlement initiated on Canton ledger

Step 5 — Audit Trail Created
  AllocationRecord created on-chain
  Contract ID: #00c4f1e8b3a2...
  Traceable: policy used → assets selected → approver → timestamp
  Immutable: cannot be altered or deleted
```

**What if USDC wasn't available?**

If USDC holdings were insufficient:
```
Scenario: $30M margin call, but only $25M USDC available

CTD Result:
  $25.0M USDC (exhaust non-yielding first)
  + $5.26M UST (next cheapest: 4.2% yield, 95% LTV)
  = $30.0M ✓

This proves the algorithm is intelligent, not just "always USDC."
It falls back to yield-bearing assets only when necessary.
```
```

#### Change 4.2: Update Architecture Description (line 58)

**BEFORE:**
```markdown
| **Cheapest-to-Deliver (CTD)** | Selects collateral with lowest opportunity cost |
```

**AFTER:**
```markdown
| **Cheapest-to-Deliver (CTD)** | Preserves yield by sending non-yielding assets first |
```

---

## Change #5: Add Eligibility Filtering to CTD Engine

### File: `/packages/api/src/engines/ctd-engine.ts`

#### Change 5.1: Update Interface to Support Counterparty Rules (line 1)

**ADD NEW INTERFACE AFTER LINE 8:**
```typescript
export interface CounterpartyRules {
	counterpartyName: string;
	acceptableAssets: string[];
}
```

#### Change 5.2: Add counterpartyRules Parameter (line 31)

**BEFORE:**
```typescript
export function calculateCTD(
	holdings: Asset[],
	amountRequired: number,
	priorityList: string[],
	minLtv: number,
	maxHaircut: number,
	durationDays = 30, // Default to 30 day duration for margin call
): CTDResult {
```

**AFTER:**
```typescript
export function calculateCTD(
	holdings: Asset[],
	amountRequired: number,
	priorityList: string[],
	minLtv: number,
	maxHaircut: number,
	durationDays = 30, // Default to 30 day duration for margin call
	counterpartyRules?: CounterpartyRules, // Optional: filter by counterparty eligibility
): CTDResult {
```

#### Change 5.3: Add Eligibility Filter (after line 42)

**BEFORE:**
```typescript
	// 1. Filter and score assets
	const eligibleAssets = holdings
		.filter((h) => h.eligible && h.haircut <= maxHaircut)
```

**AFTER:**
```typescript
	// 1. Filter by general eligibility and counterparty-specific rules
	const eligibleAssets = holdings
		.filter((h) => {
			// Basic eligibility checks
			if (!h.eligible || h.haircut > maxHaircut) return false;
			
			// Counterparty-specific eligibility
			if (counterpartyRules) {
				if (!counterpartyRules.acceptableAssets.includes(h.symbol)) {
					return false;
				}
			}
			
			return true;
		})
```

---

## Change #6: Update Tests

### File: `/apps/web/tests/collateral-api.test.ts`

#### Change 6.1: Update First Test (lines 29-35)

**BEFORE:**
```typescript
	test("should select USDC as cheapest (lowest opportunity cost)", () => {
		const result = calculateCTD(holdings, 15000000, ["USYC", "UST", "USDC"], 0.9, 0.1);

		expect(result.selectedAssets).toHaveLength(1);
		expect(result.selectedAssets[0].symbol).toBe("USDC");
		expect(result.totalOpportunityCost).toBe(0);
	});
```

**AFTER:**
```typescript
	test("should select USDC first (yield preservation strategy)", () => {
		const result = calculateCTD(holdings, 15000000, ["USYC", "UST", "USDC"], 0.9, 0.1);

		expect(result.selectedAssets).toHaveLength(1);
		expect(result.selectedAssets[0].symbol).toBe("USDC");
		expect(result.selectedAssets[0].amount).toBe(15000000);
		expect(result.totalOpportunityCost).toBe(0); // USDC has 0% yield
		expect(result.explanation).toContain("1 asset");
	});
```

#### Change 6.2: Add New Test Case (after line 52)

**ADD THIS TEST:**
```typescript
	test("should use yield-bearing assets when USDC insufficient", () => {
		const result = calculateCTD(holdings, 30000000, ["USYC", "UST", "USDC"], 0.9, 0.1);

		// Should exhaust USDC first, then use UST (cheaper than USYC)
		expect(result.selectedAssets).toHaveLength(2);
		expect(result.selectedAssets[0].symbol).toBe("USDC");
		expect(result.selectedAssets[0].amount).toBe(25000000);
		expect(result.selectedAssets[1].symbol).toBe("UST");
		
		// UST amount: need $5M more, at 95% LTV = $5.26M UST
		expect(result.selectedAssets[1].amount).toBeCloseTo(5263157.89, 2);
		
		// Should have non-zero opportunity cost now
		expect(result.totalOpportunityCost).toBeGreaterThan(0);
	});

	test("should respect counterparty eligibility rules", () => {
		const counterpartyRules = {
			counterpartyName: "PrimeBank",
			acceptableAssets: ["USYC", "UST"], // USDC NOT accepted
		};

		const result = calculateCTD(
			holdings,
			15000000,
			["USYC", "UST", "USDC"],
			0.9,
			0.1,
			30,
			counterpartyRules,
		);

		// Should NOT select USDC (not in acceptable list)
		expect(result.selectedAssets.every((a) => a.symbol !== "USDC")).toBe(true);
		
		// Should select UST (cheaper than USYC)
		expect(result.selectedAssets[0].symbol).toBe("UST");
	});
```

---

## Change #7: Update API Router to Pass Counterparty Rules

### File: `/apps/web/src/lib/collateral-router.ts`

#### Change 7.1: Extract Counterparty Rules from Policy (after line 94)

**ADD AFTER LINE 94:**
```typescript
			const policy = policies[0].payload;

			// Extract counterparty rules if specified
			let counterpartyRules: CounterpartyRules | undefined;
			if (input.counterpartyName && policy.counterpartyRules) {
				const rule = policy.counterpartyRules.find(
					([name]) => name === input.counterpartyName
				);
				if (rule) {
					counterpartyRules = {
						counterpartyName: rule[0],
						acceptableAssets: rule[1],
					};
				}
			}
```

#### Change 7.2: Pass to CTD Engine (line 100)

**BEFORE:**
```typescript
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
			);
```

**AFTER:**
```typescript
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
				counterpartyRules, // Pass counterparty-specific eligibility
			);
```

#### Change 7.3: Update Schema to Accept Counterparty (import needed)

**File:** `/packages/api/src/schemas/collateral.ts`

Find `GenerateSuggestionSchema` and add:

**BEFORE:**
```typescript
export const GenerateSuggestionSchema = z.object({
	policyId: z.string(),
	marginCallId: z.string(),
	amountRequired: z.number().positive(),
	durationDays: z.number().int().positive().default(30),
});
```

**AFTER:**
```typescript
export const GenerateSuggestionSchema = z.object({
	policyId: z.string(),
	marginCallId: z.string(),
	amountRequired: z.number().positive(),
	durationDays: z.number().int().positive().default(30),
	counterpartyName: z.string().optional(), // For counterparty-specific eligibility
});
```

---

## Build & Test Commands

After making all changes above, run these commands:

### Step 1: Rebuild Daml Contracts
```bash
cd sandbox
~/.daml/bin/daml build
~/.daml/bin/daml codegen js -o ./daml.js .daml/dist/nexus-example-0.0.1.dar
```

### Step 2: Install TypeScript Dependencies
```bash
cd ..
pnpm install
```

### Step 3: Run Tests
```bash
cd apps/web
bun test
```

### Step 4: Start Canton Sandbox
```bash
cd ../../sandbox
~/.daml/bin/daml start
```

### Step 5: Load Seed Data (in separate terminal)
```bash
cd sandbox
~/.daml/bin/daml script \
  --dar .daml/dist/nexus-example-0.0.1.dar \
  --script-name SeedData:seed_demo_scenario \
  --ledger-host localhost \
  --ledger-port 6865
```

### Step 6: Start Web App (in separate terminal)
```bash
cd apps/web
pnpm dev
```

### Step 7: Manual Testing
Navigate to `http://localhost:3001` and:
1. Create a policy with priority order: ["USYC", "UST", "USDC"]
2. Create holdings (or use seed data)
3. Generate suggestion for $15M margin call
4. Verify: Result should be $15M USDC selected
5. Check: Explanation should say "0 USD opportunity cost"
6. Approve the suggestion
7. View audit trail - AllocationRecord should show USDC

---

## Success Criteria Checklist

After implementation, verify:

- [ ] ✅ `bun test` passes all tests
- [ ] ✅ CTD engine selects USDC for $15M margin call
- [ ] ✅ No references to "savingsVsUSDC" anywhere in code
- [ ] ✅ Daml contracts compile without errors
- [ ] ✅ TypeScript bindings regenerate successfully
- [ ] ✅ README demo story matches actual algorithm behavior
- [ ] ✅ Field names are honest (`estimatedOpportunityCost` not "savings")
- [ ] ✅ Comments explain yield preservation strategy clearly
- [ ] ✅ Counterparty eligibility filtering works
- [ ] ✅ Test case for insufficient USDC passes
- [ ] ✅ Manual demo workflow runs end-to-end

---

## Value Proposition (Updated)

**Before (misleading):**
> "SignUIT selects USYC + UST to save $1,849/night vs USDC"

**After (honest and defensible):**
> "SignUIT automatically selects the cheapest eligible collateral (USDC) in 3 seconds, preserving $20.2M of yield-bearing assets earning ~$2,300/day. Value = automation + compliance + auditability, not magic."

---

## Demo Talking Points for Judges

1. **Problem:** Manual collateral decisions take 30+ minutes, require Excel, cause operational risk
2. **Solution:** Automated policy-based selection in 3 seconds with immutable audit trail
3. **How CTD Works:** "We calculate opportunity cost for each asset. USDC has 0% yield so it costs $0 to send. This preserves your USYC and UST earning income."
4. **Why Canton:** Immutable audit trail, cross-institutional coordination, programmable compliance
5. **Business Model:** Usage-based pricing, institutions pay per routing decision
6. **Roadmap:** Phase 2 = fully automated execution (no human approval needed)

---

## Time Estimate

| Task | Time |
|------|------|
| Change #1: CTD Engine | 5 min |
| Change #2: Daml Contract | 5 min |
| Change #3: API Router | 3 min |
| Change #4: README | 8 min |
| Change #5: Eligibility Filter | 6 min |
| Change #6: Update Tests | 4 min |
| Change #7: API Counterparty | 4 min |
| **Total Implementation** | **35 min** |
| Build & Test | +10 min |
| **Grand Total** | **45 min** |

---

## Risk Mitigation

**What could go wrong?**

1. **Daml contract changes break TypeScript bindings**
   - Mitigation: Regenerate bindings immediately after Daml changes
   
2. **Tests fail after removing savingsVsUSDC**
   - Mitigation: Update test assertions to match new interface
   
3. **API router can't find new field names**
   - Mitigation: Ensure exact field name match between Daml and TypeScript

4. **Judge asks "Why don't you optimize yield?"**
   - Answer: "We do! By sending USDC first, we preserve yield-bearing assets earning income. That IS yield optimization."

---

## Post-Implementation Verification

Run this complete verification script:

```bash
#!/bin/bash
set -e

echo "=== Path A Implementation Verification ==="

echo "1. Running TypeScript tests..."
cd apps/web && bun test

echo "2. Building Daml contracts..."
cd ../../sandbox
~/.daml/bin/daml build

echo "3. Checking for 'savingsVsUSDC' references..."
if grep -r "savingsVsUSDC" ../packages ../apps --include="*.ts" --include="*.tsx"; then
  echo "❌ ERROR: Found savingsVsUSDC references!"
  exit 1
else
  echo "✅ No savingsVsUSDC references found"
fi

echo "4. Checking for 'ctdSavings' references in Daml..."
if grep "ctdSavings" daml/CollateralRouter.daml; then
  echo "❌ ERROR: Found ctdSavings in Daml contract!"
  exit 1
else
  echo "✅ No ctdSavings references found"
fi

echo "5. Verifying README mentions USDC selection..."
if grep -q "Selected: \$15.0M USDC" ../README.md; then
  echo "✅ README correctly shows USDC selection"
else
  echo "❌ ERROR: README doesn't mention USDC selection!"
  exit 1
fi

echo ""
echo "=== ✅ ALL VERIFICATIONS PASSED ==="
echo ""
echo "Next steps:"
echo "1. Start Canton: daml start"
echo "2. Load seed data: daml script --dar .daml/dist/*.dar --script-name SeedData:seed_demo_scenario"
echo "3. Start web app: cd ../apps/web && pnpm dev"
echo "4. Test manually at http://localhost:3001"
```

---

## Notes

- All line numbers are approximate and may shift as changes are made
- Test each change incrementally rather than all at once
- Keep a backup of original files before making changes
- If judges ask about yield optimization, the answer is: "We preserve yield by sending non-yielding assets first"

---

**END OF IMPLEMENTATION PLAN**
