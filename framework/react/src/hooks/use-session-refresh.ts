/**
 * useSessionRefresh
 *
 * Automatically refreshes the session cookie before it expires.
 * Polls at a configurable interval and calls GET /refresh when the
 * session is within `refreshBeforeExpiryMs` of expiring.
 *
 * @example
 * ```tsx
 * // In your root layout or auth provider:
 * useSessionRefresh({
 *   basePath: "/api/nexus-auth",
 *   expiresAt: session.data?.expiresAt,
 * });
 * ```
 */

import { useCallback, useEffect, useRef } from "react";

export interface UseSessionRefreshOptions {
	/**
	 * Base path for auth routes. Must match your catch-all route.
	 * @default "/api/auth"
	 */
	basePath?: string;

	/**
	 * Unix timestamp (ms) when the current session expires.
	 * Obtained from session.data.expiresAt.
	 * If undefined, auto-refresh is disabled.
	 */
	expiresAt?: number;

	/**
	 * How many ms before expiry to trigger a refresh.
	 * @default 5 * 60 * 1000 (5 minutes)
	 */
	refreshBeforeExpiryMs?: number;

	/**
	 * How often (ms) to poll and check if refresh is needed.
	 * @default 60 * 1000 (1 minute)
	 */
	checkIntervalMs?: number;

	/**
	 * Enable or disable auto-refresh.
	 * @default true
	 */
	enabled?: boolean;

	/**
	 * Called after a successful refresh with the new expiresAt timestamp.
	 */
	onRefreshSuccess?: (newExpiresAt: number) => void;

	/**
	 * Called when a refresh attempt fails.
	 */
	onRefreshError?: (error: Error) => void;
}

/**
 * Hook for automatic session refresh.
 *
 * Place this in your root layout or auth provider so it runs for the
 * entire authenticated lifetime of the user.
 */
export function useSessionRefresh({
	basePath = "/api/auth",
	expiresAt,
	refreshBeforeExpiryMs = 5 * 60 * 1000,
	checkIntervalMs = 60 * 1000,
	enabled = true,
	onRefreshSuccess,
	onRefreshError,
}: UseSessionRefreshOptions): void {
	const refreshing = useRef(false);

	const refresh = useCallback(async () => {
		if (refreshing.current) return;
		refreshing.current = true;

		try {
			console.log("[useSessionRefresh] Refreshing session...");
			const response = await fetch(`${basePath}/refresh`, {
				method: "GET",
				credentials: "include",
			});

			if (!response.ok) {
				const body = await response.json().catch(() => ({ error: "Refresh failed" })) as { error?: string };
				throw new Error(body.error || `HTTP ${response.status}: Refresh failed`);
			}

			const data = await response.json() as { expiresAt?: number };
			console.log("[useSessionRefresh] Session refreshed successfully.");
			onRefreshSuccess?.(data.expiresAt ?? Date.now() + 60 * 60 * 1000);
		} catch (error) {
			console.warn("[useSessionRefresh] Session refresh failed:", error);
			onRefreshError?.(error instanceof Error ? error : new Error(String(error)));
		} finally {
			refreshing.current = false;
		}
	}, [basePath, onRefreshSuccess, onRefreshError]);

	useEffect(() => {
		if (!enabled || !expiresAt) return;

		const check = () => {
			const msUntilExpiry = expiresAt - Date.now();

			if (msUntilExpiry <= 0) {
				// Already expired — nothing to refresh
				console.debug("[useSessionRefresh] Session already expired, skipping refresh.");
				return;
			}

			if (msUntilExpiry <= refreshBeforeExpiryMs) {
				console.log(
					`[useSessionRefresh] Session expires in ${Math.round(msUntilExpiry / 1000)}s, triggering refresh.`,
				);
				refresh();
			}
		};

		// Check immediately on mount / when expiresAt changes
		check();

		const intervalId = setInterval(check, checkIntervalMs);
		return () => clearInterval(intervalId);
	}, [enabled, expiresAt, refreshBeforeExpiryMs, checkIntervalMs, refresh]);
}
