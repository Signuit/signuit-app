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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function demoLogin(role: keyof typeof DEMO_CREDENTIALS) {
	const credentials = DEMO_CREDENTIALS[role];

	// Step 1: Better Auth — try signIn first, fall back to signUp
	let result: { data: any; error: any };

	result = await authClient.signIn.email({
		email: credentials.email,
		password: credentials.password,
	});

	if (result.error) {
		// User doesn't exist yet — sign up
		result = await authClient.signUp.email({
			email: credentials.email,
			password: credentials.password,
			name: credentials.name,
		});
	}

	if (result.error) {
		throw new Error(result.error.message ?? "Demo login failed");
	}

	// Step 2: Canton nexus session — retry up to 5 times with backoff
	let lastError: unknown;
	for (let attempt = 1; attempt <= 5; attempt++) {
		try {
			await nexus.auth.login(credentials.partyId);
			lastError = null;
			break;
		} catch (err) {
			lastError = err;
			console.warn(`[demoLogin] Canton session attempt ${attempt}/5 failed:`, err);
			if (attempt < 5) await sleep(800 * attempt);
		}
	}

	if (lastError) {
		throw new Error(
			`Canton session could not be established after 5 attempts. Is the sandbox running? (${lastError instanceof Error ? lastError.message : String(lastError)})`,
		);
	}

	return result;
}
