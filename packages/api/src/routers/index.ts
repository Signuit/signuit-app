import type { SessionUser } from "@nexus/auth";
import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../procedures";

// ─── Base app router ──────────────────────────────────────────────────────────
//
// Ledger routes are NOT included here — they are domain-specific and must be
// wired in each app using `createLedgerProcedure(nexus.forRequest)`.
//
// Example:
//
//   // apps/my-app/src/lib/api.ts
//   import { createLedgerProcedure, baseAppRouter } from "@nexus/api"
//   import { createIouRouter } from "~/routers/iou"
//   import { nexus } from "~/lib/nexus-server"
//
//   export const appRouter = {
//     ...baseAppRouter,
//     iou: createIouRouter(createLedgerProcedure(nexus.forRequest)),
//   }
//
//   export type AppRouter = typeof appRouter

export const baseAppRouter = {
	healthCheck: publicProcedure.input(z.void()).handler(() => "OK" as const),

	getSession: protectedProcedure.input(z.void()).handler(({ context }) => ({
		// Cast to SessionUser which includes additionalFields (role, cantonPartyId).
		// Better Auth stores these in the DB and returns them at runtime; the base
		// User type just doesn't reflect them without the $Infer cast.
		user: context.session?.user as SessionUser | undefined,
	})),

	me: protectedProcedure.input(z.void()).handler(({ context }) => ({
		id: context.session?.user.id,
		email: context.session?.user.email,
		name: context.session?.user.name,
	})),
};

export const appRouter = baseAppRouter;

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
