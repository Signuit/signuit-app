import { createAuthClient } from "better-auth/react";
import { nexus } from "./nexus-client";

export const authClient = createAuthClient({
	baseURL:
		typeof window !== "undefined"
			? window.location.origin
			: (import.meta.env.VITE_BETTER_AUTH_URL ?? "https://signuit.com"),
});

export const DEMO_CREDENTIALS = {
	institution: {
		email: "demo-vantage@signuit.app",
		password: "demo-password-123",
		name: "Vantage Capital",
		partyId: "VantageCapital",
	},
	counterparty: {
		email: "demo-primebank@signuit.app",
		password: "demo-password-123",
		name: "Prime Bank",
		partyId: "PrimeBank",
	},
	operator: {
		email: "demo-operator@signuit.app",
		password: "demo-password-123",
		name: "SignUIT Operator",
		partyId: "SignUIT",
	},
} as const;

export async function demoLogin(role: keyof typeof DEMO_CREDENTIALS) {
	const credentials = DEMO_CREDENTIALS[role];

	// Step 1: Better Auth — try signUp first (idempotent), fall back to signIn
	const signUp = await authClient.signUp.email({
		email: credentials.email,
		password: credentials.password,
		name: credentials.name,
	});

	let result: { data: any; error: any };

	if (signUp.data) {
		result = signUp;
	} else {
		result = await authClient.signIn.email({
			email: credentials.email,
			password: credentials.password,
		});
	}

	if (result.error) {
		throw new Error(result.error.message ?? "Demo login failed");
	}

	// Step 2: Canton nexus session — non-blocking, log error but don't throw
	try {
		await nexus.auth.login(credentials.partyId);
	} catch (err) {
		console.warn("[demoLogin] Canton session failed (non-blocking):", err);
	}

	return result;
}
