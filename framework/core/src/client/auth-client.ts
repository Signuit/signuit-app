/**
 * Standalone Canton auth client functions.
 *
 * Pure fetch — no React, no hooks, no framework dependency.
 * Works in components, utility functions, server actions, or anywhere else.
 *
 * Mirror of the server-side `createAuthHandler()` endpoints.
 *
 * @example
 * ```ts
 * import { nexusLogin, nexusLogout, nexusGetSession } from "@nexus-framework/core";
 *
 * // In an auth utility (no React needed):
 * await nexusLogin("VantageCapital", "/api/nexus-auth");
 *
 * // In a component (prefer nexus.auth.useLogin() hook instead):
 * await nexusLogin("alice");
 * ```
 */

export interface NexusLoginResponse {
	success: boolean;
	userId: string;
	partyId: string;
}

export interface NexusLogoutResponse {
	success: boolean;
	message: string;
}

export interface NexusSessionResponse {
	authenticated: boolean;
	userId?: string;
	partyId?: string;
	expiresAt?: number;
}

/**
 * Establish a Canton nexus_session for the given userId.
 * Provisions the Canton party if it doesn't exist yet (sandbox mode).
 *
 * @param userId  - Canton user ID (e.g. "VantageCapital", "alice")
 * @param basePath - Base path where nexus auth routes are mounted (default: "/api/auth")
 */
export async function nexusLogin(
	userId: string,
	basePath = "/api/auth",
): Promise<NexusLoginResponse> {
	const response = await fetch(`${basePath}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ userId }),
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({})) as { error?: string };
		throw new Error(err.error ?? `Canton login failed (HTTP ${response.status})`);
	}

	return response.json() as Promise<NexusLoginResponse>;
}

/**
 * Destroy the current Canton nexus_session.
 *
 * @param basePath - Base path where nexus auth routes are mounted (default: "/api/auth")
 */
export async function nexusLogout(basePath = "/api/auth"): Promise<NexusLogoutResponse> {
	const response = await fetch(`${basePath}/logout`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({})) as { error?: string };
		throw new Error(err.error ?? `Canton logout failed (HTTP ${response.status})`);
	}

	return response.json() as Promise<NexusLogoutResponse>;
}

/**
 * Fetch the current Canton session without React hooks.
 * Returns `{ authenticated: false }` when no session exists — never throws.
 *
 * @param basePath - Base path where nexus auth routes are mounted (default: "/api/auth")
 */
export async function nexusGetSession(basePath = "/api/auth"): Promise<NexusSessionResponse> {
	const response = await fetch(`${basePath}/session`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		return { authenticated: false };
	}

	return response.json() as Promise<NexusSessionResponse>;
}