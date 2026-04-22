import { describe, expect, test } from "bun:test";
import { calculateCTD } from "../../../packages/api/src/engines/ctd-engine";

describe("CTD Engine", () => {
	const holdings = [
		{
			symbol: "USYC",
			amount: 8200000,
			yield: 0.045,
			haircut: 0.02,
			eligible: true,
		},
		{
			symbol: "UST",
			amount: 12000000,
			yield: 0.042,
			haircut: 0.05,
			eligible: true,
		},
		{
			symbol: "USDC",
			amount: 25000000,
			yield: 0,
			haircut: 0,
			eligible: true,
		},
	];

	test("should select USDC as cheapest (lowest opportunity cost)", () => {
		const result = calculateCTD(holdings, 15000000, ["USYC", "UST", "USDC"], 0.9, 0.1);

		expect(result.selectedAssets).toHaveLength(1);
		expect(result.selectedAssets[0].symbol).toBe("USDC");
		expect(result.totalOpportunityCost).toBe(0);
	});

	test("should select UST when USDC is not available", () => {
		const holdingsWithoutUSDC = holdings.filter((h) => h.symbol !== "USDC");
		const result = calculateCTD(holdingsWithoutUSDC, 15000000, ["USYC", "UST", "USDC"], 0.9, 0.1);

		// UST unit cost: (0.042 * 30/365) / 0.95 = 0.0036
		// USYC unit cost: (0.045 * 30/365) / 0.98 = 0.0037
		// UST is cheaper!
		expect(result.selectedAssets[0].symbol).toBe("UST");
	});

	test("should handle insufficient liquidity", () => {
		const result = calculateCTD(holdings, 100000000, ["USYC", "UST", "USDC"], 0.9, 0.1);
		expect(result.selectedAssets).toHaveLength(0);
		expect(result.explanation).toContain("Insufficient");
	});
});
