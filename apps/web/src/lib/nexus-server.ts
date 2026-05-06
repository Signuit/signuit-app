// Import package ID directly from codegen — always stays in sync with daml.js
import { packageId as NEXUS_PACKAGE_ID } from "@daml.js/nexus-example-0.0.1";
import { type SandboxAuthOptions, SessionManager, sandboxAuth } from "@nexus-framework/core";
import { createNexusServer } from "@nexus-framework/core/server";
import { nexusTypes } from "./nexus-types";

const CANTON_API_URL = process.env.CANTON_API_URL ?? "http://127.0.0.1:7575";
const SESSION_SECRET = process.env.SESSION_SECRET;
const SANDBOX_USER_ID = process.env.SANDBOX_USER_ID ?? "alice";
const SANDBOX_SECRET = process.env.SANDBOX_SECRET ?? "secret";

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
 * missing. Tries daml CLI (gRPC) first, falls back to HTTP upload.
 * Works both in local dev and in production Docker containers.
 */
async function ensureDarUploaded() {
	try {
		// 1. Check if package is already present
		const res = await fetch(`${CANTON_API_URL}/v2/packages`);
		if (!res.ok) return; // Sandbox not reachable yet
		const { packageIds = [] } = (await res.json()) as { packageIds?: string[] };
		if (packageIds.includes(NEXUS_PACKAGE_ID)) return; // Already uploaded

		// 2. Locate DAR — check multiple candidate paths
		const candidates = [
			// Local dev: source tree layout
			new URL("../../../../sandbox/.daml/dist/nexus-example-0.0.1.dar", import.meta.url).pathname,
			// Production Docker: shared volume from canton-sandbox container
			"/dar/nexus-example-0.0.1.dar",
			// Production Docker: bind-mounted workspace
			"/workspace/.daml/dist/nexus-example-0.0.1.dar",
		];

		let darPath: string | null = null;
		for (const candidate of candidates) {
			if (await Bun.file(candidate).exists()) {
				darPath = candidate;
				break;
			}
		}

		if (!darPath) {
			console.warn("[Nexus] DAR not found — run `daml build` in sandbox/");
			return;
		}

		console.log("[Nexus] Uploading nexus-example DAR...");

		// 3. Try daml CLI (gRPC) first — most reliable
		const damlCandidates = [`${process.env.HOME}/.daml/bin/daml`, "/root/.daml/bin/daml", "daml"];
		for (const damlBin of damlCandidates) {
			try {
				const binExists = damlBin === "daml" || (await Bun.file(damlBin).exists());
				if (!binExists) continue;

				const cantonHost = new URL(CANTON_API_URL).hostname;
				await Bun.$`${damlBin} ledger upload-dar --host ${cantonHost} --port 6865 ${darPath}`.quiet();
				console.log("[Nexus] DAR uploaded via daml CLI.");
				return;
			} catch {
				// Try next candidate
			}
		}

		// 4. Fallback: HTTP upload
		const darBytes = await Bun.file(darPath).arrayBuffer();
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				const uploadRes = await fetch(`${CANTON_API_URL}/v2/packages`, {
					method: "POST",
					headers: { "Content-Type": "application/octet-stream" },
					body: darBytes,
				});
				if (uploadRes.ok) {
					console.log("[Nexus] DAR uploaded via HTTP.");
					return;
				}
				const body = await uploadRes.text();
				if (body.includes("KNOWN_PACKAGE_VERSION")) {
					console.log("[Nexus] DAR already registered on ledger.");
					return;
				}
				throw new Error(`HTTP ${uploadRes.status}: ${body}`);
			} catch (err) {
				if (attempt < 3) {
					console.warn(`[Nexus] DAR upload attempt ${attempt} failed, retrying...`, err);
					await Bun.sleep(3000);
				}
			}
		}
		console.warn("[Nexus] DAR upload failed after all attempts.");
	} catch {
		// Non-fatal
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
