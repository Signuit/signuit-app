import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import DemoUserCards from "@/components/demo-user-cards";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const [showSignIn, setShowSignIn] = useState(false);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
			<DemoUserCards />

			<div className="my-8 flex items-center gap-4">
				<div className="h-px w-16 bg-border" />
				<span className="text-sm text-muted-foreground">veya</span>
				<div className="h-px w-16 bg-border" />
			</div>

			{showSignIn ? (
				<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
			) : (
				<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
			)}
		</div>
	);
}
