/**
 * Client-side auth plugin for Nexus Framework.
 * 
 * Provides React hooks for authentication operations:
 * - useLogin()  - Login with userId
 * - useLogout() - Clear session
 * - useSession() - Get current session info
 * 
 * Also exports standalone async functions for use outside React components:
 * - login(userId, basePath?) - Login without hooks
 * - logout(basePath?)        - Logout without hooks
 * - getSession(basePath?)    - Get session without hooks
 * 
 * Works with the server-side auth handler created by `createAuthHandler()`.
 *
 * @example
 * ```typescript
 * // lib/nexus-client.ts
 * import { createNexusClient } from "@nexus-framework/react";
 * import { authPlugin } from "@nexus-framework/react/plugins";
 * 
 * export const nexus = createNexusClient({
 *   ledgerApiUrl: "...",
 *   plugins: [authPlugin({ basePath: "/api/auth" })],
 * });
 * 
 * // components/LoginForm.tsx (hook usage)
 * const login = nexus.auth.useLogin();
 * login.mutate({ userId: "alice" });
 * 
 * // lib/auth-client.ts (standalone usage)
 * import { login } from "@nexus-framework/react/plugins";
 * await login("alice", "/api/nexus-auth");
 * ```
 */

import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSessionRefresh } from "../hooks/use-session-refresh";
import type { NexusClientPlugin } from "./tanstack-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthPluginConfig {
	/**
	 * Base path where auth routes are mounted.
	 * Must match the path used in your catch-all route.
	 * @default "/api/auth"
	 */
	basePath?: string;

	/**
	 * Callback invoked after successful login.
	 * Useful for analytics or side effects.
	 */
	onLoginSuccess?: (data: LoginResponse) => void | Promise<void>;

	/**
	 * Callback invoked after successful logout.
	 */
	onLogoutSuccess?: () => void | Promise<void>;

	/**
	 * Callback invoked when login fails.
	 */
	onLoginError?: (error: Error) => void;

	/**
	 * Callback invoked when logout fails.
	 */
	onLogoutError?: (error: Error) => void;

	/**
	 * Automatically refresh the session cookie before it expires.
	 * @default true
	 */
	autoRefresh?: boolean;

	/**
	 * How many ms before expiry to trigger auto-refresh.
	 * @default 5 * 60 * 1000 (5 minutes)
	 */
	refreshBeforeExpiryMs?: number;

	/**
	 * How often (ms) to check if a refresh is needed.
	 * @default 60 * 1000 (1 minute)
	 */
	refreshCheckIntervalMs?: number;
}

export interface LoginRequest {
	userId: string;
}

export interface LoginResponse {
	success: boolean;
	userId: string;
	partyId: string;
}

export interface LogoutResponse {
	success: boolean;
	message: string;
}

export interface SessionResponse {
	authenticated: boolean;
	userId?: string;
	partyId?: string;
	expiresAt?: number;
}

// ─── Auth Actions ─────────────────────────────────────────────────────────────

export interface AuthActions {
	/**
	 * Hook for logging in with a userId.
	 * Returns a TanStack Query mutation that handles the login request.
	 * 
	 * @example
	 * ```tsx
	 * const login = nexus.auth.useLogin();
	 * 
	 * <button
	 *   onClick={() => login.mutate({ userId: "alice" })}
	 *   disabled={login.isPending}
	 * >
	 *   {login.isPending ? "Logging in..." : "Login as Alice"}
	 * </button>
	 * ```
	 */
	useLogin: () => UseMutationResult<LoginResponse, Error, LoginRequest>;

	/**
	 * Hook for logging out.
	 * Clears the session cookie and invalidates session query.
	 * 
	 * @example
	 * ```tsx
	 * const logout = nexus.auth.useLogout();
	 * 
	 * <button onClick={() => logout.mutate()}>
	 *   Logout
	 * </button>
	 * ```
	 */
	useLogout: () => UseMutationResult<LogoutResponse, Error, void>;

	/**
	 * Hook for fetching the current session.
	 * Returns session data if authenticated, or { authenticated: false } otherwise.
	 * 
	 * @example
	 * ```tsx
	 * const session = nexus.auth.useSession();
	 * 
	 * if (session.data?.authenticated) {
	 *   return <div>Logged in as {session.data.userId}</div>;
	 * }
	 * 
	 * return <div>Not authenticated</div>;
	 * ```
	 */
	useSession: (options?: { enabled?: boolean; refetchInterval?: number | false }) => UseQueryResult<SessionResponse>;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

const authKeys = {
	session: ["auth", "session"] as const,
};

// ─── Auth Plugin ──────────────────────────────────────────────────────────────

/**
 * Client-side plugin that adds authentication hooks to the Nexus client.
 * 
 * Provides `useLogin()`, `useLogout()`, and `useSession()` hooks.
 * Works with the server-side `createAuthHandler()`.
 * 
 * @example
 * ```typescript
 * import { createNexusClient } from "@nexus-framework/react";
 * import { authPlugin } from "@nexus-framework/react/plugins";
 * 
 * export const nexus = createNexusClient({
 *   ledgerApiUrl: process.env.NEXT_PUBLIC_LEDGER_API_URL!,
 *   plugins: [
 *     authPlugin({
 *       basePath: "/api/auth",
 *       onLoginSuccess: (data) => console.log("Logged in:", data.userId),
 *     }),
 *   ],
 * });
 * ```
 */
export function authPlugin(config: AuthPluginConfig = {}): NexusClientPlugin<{
	auth: AuthActions;
}> & { $authBasePath: string } {
	const basePath = config.basePath || "/api/auth";

	return {
		$authBasePath: basePath,
		id: "auth-client",

		getActions: () => ({
			auth: {
				useLogin: () => {
					const queryClient = useQueryClient();

					return useMutation<LoginResponse, Error, LoginRequest>({
						mutationFn: async (variables: LoginRequest): Promise<LoginResponse> => {
							const response = await fetch(`${basePath}/login`, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify(variables),
								credentials: "include", // Important: include cookies
							});

							if (!response.ok) {
								const error = await response.json().catch(() => ({ error: "Login failed" })) as { error?: string };
								throw new Error(error.error || `HTTP ${response.status}: Login failed`);
							}

							return response.json() as Promise<LoginResponse>;
						},
						onSuccess: async (data) => {
							// Invalidate session query to trigger refetch
							await queryClient.invalidateQueries({ queryKey: authKeys.session });

							// Invoke user callback
							await config.onLoginSuccess?.(data);
						},
						onError: (error) => {
							config.onLoginError?.(error);
						},
					});
				},

				useLogout: () => {
					const queryClient = useQueryClient();

					return useMutation<LogoutResponse, Error, void>({
						mutationFn: async (): Promise<LogoutResponse> => {
							const response = await fetch(`${basePath}/logout`, {
								method: "POST",
								credentials: "include",
							});

							if (!response.ok) {
								const error = await response.json().catch(() => ({ error: "Logout failed" })) as { error?: string };
								throw new Error(error.error || `HTTP ${response.status}: Logout failed`);
							}

							return response.json() as Promise<LogoutResponse>;
						},
						onSuccess: async () => {
							// Clear session query
							queryClient.setQueryData(authKeys.session, { authenticated: false });

							// Invalidate to trigger refetch
							await queryClient.invalidateQueries({ queryKey: authKeys.session });

							// Invoke user callback
							await config.onLogoutSuccess?.();
						},
						onError: (error) => {
							config.onLogoutError?.(error);
						},
					});
				},

				useSession: (options?: { enabled?: boolean; refetchInterval?: number | false }) => {
					const query = useQuery<SessionResponse>({
						queryKey: authKeys.session,
						queryFn: async (): Promise<SessionResponse> => {
							const response = await fetch(`${basePath}/session`, {
								method: "GET",
								credentials: "include",
							});

							if (!response.ok) {
								// If session check fails, return unauthenticated
								return { authenticated: false };
							}

							return response.json() as Promise<SessionResponse>;
						},
						staleTime: 5 * 60 * 1000, // 5 minutes
						refetchInterval: options?.refetchInterval ?? false,
						enabled: options?.enabled ?? true,
						retry: false, // Don't retry failed session checks
					});

					// Auto-refresh: wire up session expiry to useSessionRefresh
					useSessionRefresh({
						basePath,
						expiresAt: query.data?.authenticated ? query.data.expiresAt : undefined,
						enabled: config.autoRefresh ?? true,
						refreshBeforeExpiryMs: config.refreshBeforeExpiryMs,
						checkIntervalMs: config.refreshCheckIntervalMs,
					});

					return query;
				},
			},
		}),
	};
}

// ─── Standalone async functions — re-exported from core (no React dependency) ─
export { nexusGetSession, nexusLogin, nexusLogout } from "@nexus-framework/core";
