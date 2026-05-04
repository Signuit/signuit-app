import { o } from "@nexus/api";
import { nexus, sessionManager } from "./nexus-server";

const CANTON_API_URL = process.env.CANTON_API_URL ?? "http://127.0.0.1:7575";
const OPERATOR_PARTY_HINT = process.env.OPERATOR_PARTY_ID ?? "SignUIT";
const SANDBOX_SECRET = process.env.SANDBOX_SECRET ?? "secret";

// Cache operator party ID to avoid per-request lookups (invalidated every 60s)
let _cachedOperatorId: string | null = null;
let _cacheTs = 0;

/** Generate a simple HMAC-HS256 admin JWT for Canton sandbox party lookup */
async function makeAdminToken(): Promise<string> {
	const enc = (s: string) => btoa(s).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
	const header = enc(JSON.stringify({ alg: "HS256", typ: "JWT" }));
	const now = Math.floor(Date.now() / 1000);
	const payload = enc(
		JSON.stringify({
			sub: "admin",
			aud: "https://daml.com/jwt/aud/participant/admin",
			scope: "daml_ledger_api",
			iat: now,
			exp: now + 3600,
		}),
	);
	const sigInput = new TextEncoder().encode(`${header}.${payload}`);
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(SANDBOX_SECRET),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign("HMAC", key, sigInput);
	const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
	return `${header}.${payload}.${sigB64}`;
}

/**
 * Dynamically resolve the full operator party ID from Canton.
 * Looks for a party whose name matches the OPERATOR_PARTY_HINT (exact or prefix match).
 * Falls back to the hint string if not found.
 */
export async function resolveOperatorPartyId(): Promise<string> {
	const now = Date.now();
	if (_cachedOperatorId && now - _cacheTs < 60_000) return _cachedOperatorId;

	try {
		const token = await makeAdminToken();
		const res = await fetch(`${CANTON_API_URL}/v2/parties`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) return OPERATOR_PARTY_HINT;
		const data = (await res.json()) as { partyDetails?: { party: string }[] };
		const parties = data.partyDetails ?? [];
		const found =
			parties.find((p) => p.party.split("::")[0] === OPERATOR_PARTY_HINT) ??
			parties.find((p) => p.party.split("::")[0].startsWith(`${OPERATOR_PARTY_HINT}-`));
		const result = found?.party ?? OPERATOR_PARTY_HINT;
		_cachedOperatorId = result;
		_cacheTs = now;
		return result;
	} catch {
		return OPERATOR_PARTY_HINT;
	}
}

/**
 * Custom ledger procedure that injects the ledger API, partyId, and operatorPartyId.
 * The operatorPartyId is resolved dynamically from the Canton party list.
 */
export const ledgerProcedure = o.use(async ({ context, next }) => {
	const ledger = await nexus.forRequest(context.req);
	const session = await sessionManager.requireSession(context.req);
	const resolvedOperator = await resolveOperatorPartyId();
	// If the operator party doesn't exist on the sandbox yet (no "::" fingerprint),
	// fall back to the institution's own party so no bare hint strings reach Canton.
	const operatorPartyId = resolvedOperator.includes("::") ? resolvedOperator : session.partyId;
	return next({ context: { ledger, partyId: session.partyId, operatorPartyId } });
});
