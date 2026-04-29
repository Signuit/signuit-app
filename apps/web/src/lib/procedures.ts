import { o } from "@nexus/api";
import { nexus, sessionManager } from "./nexus-server";

const OPERATOR_PARTY_ID = process.env.OPERATOR_PARTY_ID ?? "SignUIT";

/**
 * Custom ledger procedure that injects both the ledger API and partyId.
 */
export const ledgerProcedure = o.use(async ({ context, next }) => {
	const ledger = await nexus.forRequest(context.req);
	const session = await sessionManager.requireSession(context.req);
	return next({ context: { ledger, partyId: session.partyId, operatorPartyId: OPERATOR_PARTY_ID } });
});
