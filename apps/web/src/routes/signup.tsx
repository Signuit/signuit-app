import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignupForm } from "@/components/signup-form";
import { getSession } from "@/functions/ensure-session";

export const Route = createFileRoute("/signup")({
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
			<SignupForm />
		</div>
	);
}
