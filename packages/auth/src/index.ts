import { expo } from "@better-auth/expo";
import { db } from "@nexus/db";
import type { user as userTable } from "@nexus/db/schema/auth";
import { DEMO_USERS } from "@nexus/db/seed/demo-users";
import { env } from "@nexus/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

/**
 * Fully-typed session user derived from the Drizzle schema.
 * Includes all DB columns: id, name, email, role, cantonPartyId, etc.
 */
export type SessionUser = typeof userTable.$inferSelect;

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
				required: false,
				defaultValue: "institution",
				// Note: input:false can interfere with databaseHooks in some BA versions.
				// We rely on databaseHooks.user.create.before for role assignment.
			},
			cantonPartyId: {
				type: "string",
				required: false,
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
