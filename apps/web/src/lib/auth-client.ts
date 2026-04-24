import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.BETTER_AUTH_URL,
});

export const DEMO_CREDENTIALS = {
	institution: { email: "demo-vantage@signuit.app", password: "demo-password-123" },
	counterparty: { email: "demo-primebank@signuit.app", password: "demo-password-123" },
	operator: { email: "demo-operator@signuit.app", password: "demo-password-123" },
} as const;

export async function demoLogin(role: keyof typeof DEMO_CREDENTIALS) {
	const credentials = DEMO_CREDENTIALS[role];

	const result = await authClient.signIn.email({
		email: credentials.email,
		password: credentials.password,
	});

	if (result.error) {
		throw new Error(result.error.message ?? "Demo login failed");
	}

	return result;
}
