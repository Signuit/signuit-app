import { type SandboxAuthOptions, SessionManager, sandboxAuth } from "@nexus-framework/core";
import { createNexusServer } from "@nexus-framework/core/server";
import { nexusTypes } from "./nexus-types";

const CANTON_API_URL = process.env.CANTON_API_URL ?? "http://127.0.0.1:7575";
const SESSION_SECRET = process.env.SESSION_SECRET;
const SANDBOX_USER_ID = process.env.SANDBOX_USER_ID ?? "alice";
const SANDBOX_SECRET = process.env.SANDBOX_SECRET ?? "secret";

// The compiled nexus-example package ID — must match daml.js/nexus-example-0.0.1
const NEXUS_PACKAGE_ID = "e216534d47383af7bde77fa62bf3376654f24226bca8fb82a6a5fa6532e54a2d";

// Session TTL: configurable via NEXUS_SESSION_TTL_HOURS
// Default: 24h in development, 2h in production
const SESSION_TTL_HOURS = process.env.NEXUS_SESSION_TTL_HOURS
	? Number.parseInt(process.env.NEXUS_SESSION_TTL_HOURS, 10)
	: process.env.NODE_ENV === "production"
		? 2
		: 24;

// Only use encryption if the key is a valid hex string and not the placeholder
const isValidHex = (s?: string) => s && /^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0;
const isPlaceholder = SESSION_SECRET === "generate_a_32_byte_hex_key_here";
const encryptionKey =
	SESSION_SECRET && !isPlaceholder && isValidHex(SESSION_SECRET) ? SESSION_SECRET : undefined;

/**
 * Automatically upload the nexus-example DAR to the Canton sandbox if it is
 * missing. Called once at server startup so every `pnpm dev` restart works
 * without manual intervention.
 */
async function ensureDarUploaded() {
	try {
		// 1. Check if package is already present
		const res = await fetch(`${CANTON_API_URL}/v2/packages`);
		if (!res.ok) return; // Sandbox not reachable yet
		const { packageIds = [] } = (await res.json()) as { packageIds?: string[] };
		if (packageIds.includes(NEXUS_PACKAGE_ID)) return; // Already uploaded

		// 2. Locate DAR file relative to this source file
		const darPath = new URL(
			"../../../../sandbox/.daml/dist/nexus-example-0.0.1.dar",
			import.meta.url,
		).pathname;

		if (!(await Bun.file(darPath).exists())) {
			console.warn("[Nexus] DAR not found at", darPath, "— run `daml build` in sandbox/");
			return;
		}

		// 3. Find daml binary
		const damlBin =
			(await Bun.file(`${process.env.HOME}/.daml/bin/daml`).exists())
				? `${process.env.HOME}/.daml/bin/daml`
				: "daml";

		// 4. Upload with up to 3 retries
		console.log("[Nexus] Uploading nexus-example DAR to Canton sandbox...");
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				await Bun.$`${damlBin} ledger upload-dar --host localhost --port 6865 ${darPath}`.quiet();
				console.log(`[Nexus] DAR uploaded successfully (attempt ${attempt})`);
				return;
			} catch {
				if (attempt < 3) {
					console.warn(`[Nexus] DAR upload attempt ${attempt} failed, retrying in 3s...`);
					await Bun.sleep(3000);
				}
			}
		}
		console.warn("[Nexus] DAR upload failed after 3 attempts — seed button will show an error");
	} catch {
		// Non-fatal: sandbox might not be running yet
	}
}

// Auto-upload DAR before creating the Nexus server instance
await ensureDarUploaded();

export const sandboxAuthOptions: SandboxAuthOptions = {
	userId: SANDBOX_USER_ID,
	secret: SANDBOX_SECRET,
	getUserId: (ctx) => ctx.headers.get("X-Canton-User-Id") || SANDBOX_USER_ID,
};

export const sessionManager = new SessionManager({
	encryptionKey,
	ttlMs: SESSION_TTL_HOURS * 60 * 60 * 1000,
});

export const nexus = await createNexusServer({
	ledgerApiUrl: CANTON_API_URL,
	// pqsUrl: PQS_URL,
	auth: sandboxAuth(sandboxAuthOptions),
	types: nexusTypes,
	sessionManager,
});
