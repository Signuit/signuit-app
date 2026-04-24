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

	// Step 1: signIn — if user doesn't exist yet, sign up first
	let result = await authClient.signIn.email({
		email: credentials.email,
		password: credentials.password,
	});

	if (result.error?.status === 401 || result.error?.status === 404) {
		const signUpResult = await authClient.signUp.email({
			email: credentials.email,
			password: credentials.password,
			name: credentials.name,
		});
		if (signUpResult.error) {
			throw new Error(signUpResult.error.message ?? "Demo signup failed");
		}
		result = await authClient.signIn.email({
			email: credentials.email,
			password: credentials.password,
		});
	}

	if (result.error) {
		throw new Error(result.error.message ?? "Demo login failed");
	}

	// Step 2: establish Canton nexus_session — basePath already configured in nexus-client.ts
	await nexus.auth.login(credentials.partyId);

	return result;
}
