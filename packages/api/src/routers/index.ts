import type { RouterClient } from "@orpc/server";
import type { SessionUser } from "@nexus/auth";
import { db } from "@nexus/db";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../procedures";

// ─── Base app router ──────────────────────────────────────────────────────────

export const baseAppRouter = {
	healthCheck: publicProcedure.input(z.void()).handler(() => "OK" as const),

	getSession: protectedProcedure.input(z.void()).handler(async ({ context }) => {
		const sessionUser = context.session?.user;
		if (!sessionUser) return { user: null };

		// Always fetch fresh from DB so additionalFields (role, cantonPartyId)
		// are included — Better Auth's session object may not carry them.
		const dbUser = await db.query.user.findFirst({
			where: (u, { eq: eqFn }) => eqFn(u.id, sessionUser.id),
		});

		return { user: (dbUser ?? null) as SessionUser | null };
	}),

	me: protectedProcedure.input(z.void()).handler(({ context }) => ({
		id: context.session?.user.id,
		email: context.session?.user.email,
		name: context.session?.user.name,
	})),
};

export const appRouter = baseAppRouter;

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
