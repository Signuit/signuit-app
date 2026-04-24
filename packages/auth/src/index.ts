import { expo } from "@better-auth/expo";
import { db } from "@nexus/db";
import { env } from "@nexus/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { DEMO_USERS } from "@nexus/db/seed/demo-users";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	trustedOrigins: [
		env.CORS_ORIGIN,
		"nexus-framework://",
		...(env.NODE_ENV === "development"
			? ["exp://", "exp://**", "exp://192.168.*.*:*/**", "http://localhost:8081"]
			: []),
	],
	emailAndPassword: {
		enabled: true,
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	additionalFields: {
		user: {
			role: {
				type: "string",
				required: true,
				defaultValue: "institution",
				input: false,
			},
			cantonPartyId: {
				type: "string",
				required: false,
				input: false,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const isDemo = DEMO_USERS.some((u) => u.email === user.email);
					if (!isDemo) {
						return { data: user };
					}

					const role = DEMO_USERS.find((u) => u.email === user.email)?.role ?? "institution";
					const partyId = DEMO_USERS.find((u) => u.email === user.email)?.partyId ?? "Unknown";

					return {
						data: {
							...user,
							role,
							cantonPartyId: partyId,
						},
					};
				},
			},
		},
	},
	plugins: [tanstackStartCookies(), expo()],
});
