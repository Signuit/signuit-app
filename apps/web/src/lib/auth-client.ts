import { createAuthClient } from "better-auth/react";
import { nexus } from "./nexus-client";

export const authClient = createAuthClient({
	baseURL: import.meta.env.BETTER_AUTH_URL,
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
		partyId: "SignUITOperator",
	},
} as const;

export async function demoLogin(role: keyof typeof DEMO_CREDENTIALS) {
	const credentials = DEMO_CREDENTIALS[role];

	// Always try signUp first (idempotent — user exists? 422 happens, we ignore it)
	await authClient.signUp.email({
		email: credentials.email,
		password: credentials.password,
		name: credentials.name,
	});

	// Then signIn
	const result = await authClient.signIn.email({
		email: credentials.email,
		password: credentials.password,
	});

	if (result.error) {
		throw new Error(result.error.message ?? "Demo login failed");
	}

	// Step 2: establish Canton nexus_session — basePath already configured in nexus-client.ts
	await nexus.auth.login(credentials.partyId);

	return result;
}

