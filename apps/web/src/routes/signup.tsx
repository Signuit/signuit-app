import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignupForm } from "@/components/signup-form";

export const Route = createFileRoute("/signup")({
	beforeLoad: async ({ context }) => {
		if (context.session) {
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
