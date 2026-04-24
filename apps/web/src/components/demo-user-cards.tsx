import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Landmark, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { demoLogin } from "@/lib/auth-client";

const DEMO_USERS = [
	{
		id: "institution",
		role: "Institution",
		company: "Vantage Capital",
		description: "Asset owner managing collateral",
		icon: Building2,
		color: "bg-blue-500",
		roleKey: "institution" as const,
	},
	{
		id: "counterparty",
		role: "Counterparty",
		company: "Prime Bank",
		description: "Issues margin calls",
		icon: Landmark,
		color: "bg-amber-500",
		roleKey: "counterparty" as const,
	},
	{
		id: "operator",
		role: "Operator",
		company: "SignUIT",
		description: "Network orchestrator",
		icon: Settings,
		color: "bg-emerald-500",
		roleKey: "operator" as const,
	},
] as const;

export default function DemoUserCards() {
	const navigate = useNavigate({ from: "/" });
	const [isLoading, setIsLoading] = useState<string | null>(null);

	const handleDemoLogin = async (roleKey: "institution" | "counterparty" | "operator") => {
		setIsLoading(roleKey);
		try {
			await demoLogin(roleKey);
			toast.success(`Welcome, ${roleKey}!`);
			navigate({ to: "/dashboard" });
		} catch (_error) {
			toast.error("Demo login failed. Please try again.");
		} finally {
			setIsLoading(null);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold mb-2">Demo olarak giriş yapın</h2>
				<p className="text-muted-foreground">Hızlı demo için aşağıdan bir rol seçin</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{DEMO_USERS.map((user) => {
					const Icon = user.icon;
					return (
						<button
							type="button"
							key={user.id}
							onClick={() => handleDemoLogin(user.roleKey)}
							disabled={isLoading !== null}
							className="group relative flex flex-col items-center p-6 rounded-xl border bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
						>
							<div className={`${user.color} p-3 rounded-lg text-white mb-4`}>
								<Icon className="w-6 h-6" />
							</div>
							<h3 className="font-semibold text-lg mb-1">{user.company}</h3>
							<p className="text-sm text-muted-foreground mb-4">{user.description}</p>
							<span className="inline-flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
								{isLoading === user.id ? (
									<span className="animate-pulse">Giriş yapılıyor...</span>
								) : (
									<>
										Giriş yap
										<ArrowRight className="w-4 h-4 ml-1" />
									</>
								)}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
