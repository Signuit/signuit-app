import { type SandboxAuthOptions, SessionManager, sandboxAuth } from "@nexus-framework/core";
import { createNexusServer } from "@nexus-framework/core/server";
import { nexusTypes } from "./nexus-types";

const CANTON_API_URL = process.env.CANTON_API_URL ?? "http://127.0.0.1:7575";
const SESSION_SECRET = process.env.SESSION_SECRET;
const SANDBOX_USER_ID = process.env.SANDBOX_USER_ID ?? "alice";
const SANDBOX_SECRET = process.env.SANDBOX_SECRET ?? "secret";

// Only use encryption if the key is a valid hex string and not the placeholder
const isValidHex = (s?: string) => s && /^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0;
const isPlaceholder = SESSION_SECRET === "generate_a_32_byte_hex_key_here";
const encryptionKey =
	SESSION_SECRET && !isPlaceholder && isValidHex(SESSION_SECRET) ? SESSION_SECRET : undefined;

export const sandboxAuthOptions: SandboxAuthOptions = {
	userId: SANDBOX_USER_ID,
	secret: SANDBOX_SECRET,
	getUserId: (ctx) => ctx.headers.get("X-Canton-User-Id") || SANDBOX_USER_ID,
};

export const sessionManager = new SessionManager({
	encryptionKey,
});

export const nexus = await createNexusServer({
	ledgerApiUrl: CANTON_API_URL,
	// pqsUrl: PQS_URL,
	auth: sandboxAuth(sandboxAuthOptions),
	types: nexusTypes,
	sessionManager,
});
