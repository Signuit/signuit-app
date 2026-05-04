import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

/**
 * Custom hooks for SignUIT CollateralRouter API
 * Uses oRPC queryOptions and mutationOptions for TanStack Query v5
 */

// ─── Holdings ───────────────────────────────────────────────────

export function useHoldings() {
	return useQuery(
		orpc.collateral.listHoldings.queryOptions({
			input: { limit: 100 },
			staleTime: 30000,
		}),
	);
}

export function useCreateHolding() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.collateral.createHolding.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.collateral.listHoldings.key(),
				});
			},
		}),
	);
}

// ─── Policies ───────────────────────────────────────────────────

export function usePolicies() {
	return useQuery(
		orpc.collateral.listPolicies.queryOptions({
			input: { limit: 100 },
		}),
	);
}

export function useCreatePolicy() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.collateral.createPolicy.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.collateral.listPolicies.key(),
				});
			},
		}),
	);
}

// ─── Suggestions (Routing Recommendations) ──────────────────────

export function useSuggestions() {
	return useQuery(
		orpc.collateral.listSuggestions.queryOptions({
			input: { limit: 100 },
			refetchInterval: 5000,
		}),
	);
}

export function useGenerateSuggestion() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.collateral.generateSuggestion.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.collateral.listSuggestions.key(),
				});
			},
		}),
	);
}

export function useApproveSuggestion() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.collateral.approveSuggestion.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.collateral.listSuggestions.key(),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.collateral.listAllocations.key(),
				});
			},
		}),
	);
}

export function useRejectSuggestion() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.collateral.rejectSuggestion.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.collateral.listSuggestions.key(),
				});
			},
		}),
	);
}

// ─── Audit Trail ────────────────────────────────────────────────

export function useAuditTrail() {
	return useQuery(
		orpc.collateral.listAllocations.queryOptions({
			input: { limit: 100 },
		}),
	);
}

// ─── Demo Setup ─────────────────────────────────────────────────

export function useSeedDemoData() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.collateral.seedDemoData.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.collateral.listHoldings.key() });
				queryClient.invalidateQueries({ queryKey: orpc.collateral.listPolicies.key() });
			},
		}),
	);
}

// ─── Utility Hooks ──────────────────────────────────────────────

export function useStats() {
	const holdingsQuery = useHoldings();
	const suggestionsQuery = useSuggestions();
	const auditQuery = useAuditTrail();

	const holdings = holdingsQuery.data;
	const suggestions = suggestionsQuery.data;
	const audit = auditQuery.data;

	return {
		totalHoldingsValue: holdings?.reduce((sum, h) => sum + parseFloat(h.payload.amount), 0) || 0,

		pendingSuggestions: suggestions?.filter((s) => s.payload.status === "RoutePending").length || 0,

		totalAllocations: audit?.length || 0,

		isLoading: holdingsQuery.isLoading || suggestionsQuery.isLoading || auditQuery.isLoading,
	};
}
