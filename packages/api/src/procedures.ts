import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

export const protectedProcedure = o.use(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({ context: { session: context.session } });
});

export function createLedgerProcedure<TLedger>(extractor: (req: Request) => Promise<TLedger>) {
	return o.use(async ({ context, next }) => {
		let ledger: TLedger;
		try {
			ledger = await extractor(context.req);
		} catch {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid or missing Nexus session.",
			});
		}
		return next({ context: { ledger } });
	});
}
