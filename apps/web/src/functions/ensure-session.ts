import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/middleware/auth";

/**
 * Returns session or null — use in public routes to redirect already-logged-in users.
 */
export const getSession = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context.session;
	});

/**
 * Throws redirect to /login if not authenticated — use in protected routes.
 */
export const ensureSession = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		if (!context.session) {
			throw redirect({ to: "/login" });
		}
		return context.session;
	});
