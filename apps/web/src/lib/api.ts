import { baseAppRouter, o } from "@nexus/api";
import { createContext } from "@nexus/api/context";
import { collateralRouter } from "./collateral-router";
import { nexus, sessionManager } from "./nexus-server";

/**
 * Custom ledger procedure that injects both the ledger API and partyId.
 */
export const ledgerProcedure = o.use(async ({ context, next }) => {
	const ledger = await nexus.forRequest(context.req);
	const session = await sessionManager.requireSession(context.req);
	return next({ context: { ledger, partyId: session.partyId } });
});

export const appRouter = {
	...baseAppRouter,
	collateral: collateralRouter,
};

export type AppRouter = typeof appRouter;

export { createContext };
