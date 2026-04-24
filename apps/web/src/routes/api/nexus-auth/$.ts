import { createAuthHandler } from "@nexus-framework/core/server";
import { createFileRoute } from "@tanstack/react-router";
import { nexus, sandboxAuthOptions, sessionManager } from "@/lib/nexus-server";

const authHandler = createAuthHandler({
	nexusServer: nexus,
	sessionManager,
	basePath: "/api/nexus-auth",
	sandboxOptions: sandboxAuthOptions,
});

export const Route = createFileRoute("/api/nexus-auth/$")({
	server: {
		handlers: {
			GET: ({ request }) => {
				return authHandler(request);
			},
			POST: ({ request }) => {
				return authHandler(request);
			},
		},
	},
});
