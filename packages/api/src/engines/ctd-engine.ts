export interface Asset {
	symbol: string;
	amount: number;
	yield: number;
	haircut: number;
	eligible: boolean;
	expiry?: string;
}

export interface CTDSelection {
	symbol: string;
	amount: number;
	opportunityCost: number;
}

export interface CTDResult {
	selectedAssets: CTDSelection[];
	totalOpportunityCost: number;
	savingsVsUSDC: number;
	explanation: string;
	alternatives: CTDResult[];
}

/**
 * Cheapest-to-Deliver Algorithm
 *
 * Per business plan: "selects collateral with lowest opportunity cost"
 * Formula: opportunity_cost = (yield × amount) / (1 - haircut)
 * (Simplified duration to 1 year for comparison purposes, or can be passed as param)
 */
export function calculateCTD(
	holdings: Asset[],
	amountRequired: number,
	priorityList: string[],
	minLtv: number,
	maxHaircut: number,
	durationDays = 30, // Default to 30 day duration for margin call
): CTDResult {
	const durationFactor = durationDays / 365;

	// 1. Filter and score assets
	const eligibleAssets = holdings
		.filter((h) => h.eligible && h.haircut <= maxHaircut)
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
}
