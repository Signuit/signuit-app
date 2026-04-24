import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "@/components/login-form";
import { getSession } from "@/functions/ensure-session";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background text-foreground">
			<LoginForm />
		</div>
	);
}
