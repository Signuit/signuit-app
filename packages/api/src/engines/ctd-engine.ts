export interface Asset {
	symbol: string;
	amount: number;
	yield: number;
	haircut: number;
	eligible: boolean;
	expiry?: string;
}

export interface CounterpartyRules {
	counterpartyName: string;
	acceptableAssets: string[];
}

export interface CTDSelection {
	symbol: string;
	amount: number;
	opportunityCost: number;
}

export interface CTDResult {
	selectedAssets: CTDSelection[];
	totalOpportunityCost: number;
	explanation: string;
	alternatives: CTDResult[];
}

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
 * @param counterpartyRules - Optional: filter by counterparty eligibility
 */
export function calculateCTD(
	holdings: Asset[],
	amountRequired: number,
	priorityList: string[],
	minLtv: number,
	maxHaircut: number,
	durationDays = 30, // Default to 30 day duration for margin call
	counterpartyRules?: CounterpartyRules, // Optional: filter by counterparty eligibility
): CTDResult {
	const durationFactor = durationDays / 365;

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
		.map((h) => {
			const ltv = 1 - h.haircut;
			if (ltv < minLtv) return null;

			// Opportunity cost per $1 of required collateral
			// cost = (yield * (1/ltv) * duration)
			const unitOpportunityCost = (h.yield * durationFactor) / ltv;

			return {
				...h,
				unitOpportunityCost,
				maxDeliverable: h.amount * ltv,
			};
		})
		.filter((h): h is NonNullable<typeof h> => h !== null);

	// 2. Sort by unit opportunity cost (lowest cost first = CTD)
	// If costs are equal, follow priorityList
	const sortedAssets = eligibleAssets.sort((a, b) => {
		if (Math.abs(a.unitOpportunityCost - b.unitOpportunityCost) > 0.00001) {
			return a.unitOpportunityCost - b.unitOpportunityCost;
		}
		// Priority list fallback
		const aIdx = priorityList.indexOf(a.symbol);
		const bIdx = priorityList.indexOf(b.symbol);
		if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
		if (aIdx !== -1) return -1;
		if (bIdx !== -1) return 1;
		return 0;
	});

	// 3. Select assets to fill requirement
	let remaining = amountRequired;
	const selectedAssets: CTDSelection[] = [];
	let totalOpportunityCost = 0;

	for (const asset of sortedAssets) {
		if (remaining <= 0) break;

		const amountToTakeFromAsset = Math.min(remaining / (1 - asset.haircut), asset.amount);
		const collateralValueProvided = amountToTakeFromAsset * (1 - asset.haircut);

		const cost = amountToTakeFromAsset * asset.yield * durationFactor;

		selectedAssets.push({
			symbol: asset.symbol,
			amount: amountToTakeFromAsset,
			opportunityCost: cost,
		});

		totalOpportunityCost += cost;
		remaining -= collateralValueProvided;
	}

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
}
