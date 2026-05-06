import { cn } from "@nexus/ui/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Landmark, LockIcon, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { demoLogin } from "@/lib/auth-client";

const DEMO_ACCOUNTS = [
	{
		role: "institution" as const,
		label: "Vantage Capital",
		sublabel: "Institution",
		icon: Building2,
		color: "text-blue-400",
		description: "Asset owner — approve collateral routes",
	},
	{
		role: "counterparty" as const,
		label: "Prime Bank",
		sublabel: "Counterparty",
		icon: Landmark,
		color: "text-amber-400",
		description: "Issues margin calls to institutions",
	},
	{
		role: "operator" as const,
		label: "SignUIT Operator",
		sublabel: "Operator",
		icon: Settings,
		color: "text-emerald-400",
		description: "Network orchestrator — full visibility",
	},
] as const;

export function LoginForm() {
	const navigate = useNavigate();
	const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);

	const handleDemoLogin = async (role: "institution" | "counterparty" | "operator") => {
		setIsDemoLoading(role);
		try {
			await demoLogin(role);
			toast.success("Welcome to SignUIT");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Demo login failed");
		} finally {
			setIsDemoLoading(null);
		}
	};

	return (
		<div className="w-full max-w-[420px] flex flex-col items-center px-4">
			{/* Logo */}
			<div className="mb-8">
				<img src="/assets/logo_white.png" alt="SignUIT" className="h-9 w-auto hidden dark:block" />
				<img src="/assets/logo_black.png" alt="SignUIT" className="h-9 w-auto dark:hidden" />
			</div>

			{/* Title */}
			<h1 className="text-2xl font-bold tracking-tight text-center mb-1">Welcome back</h1>
			<p className="text-muted-foreground text-sm text-center mb-7">Sign in to your account</p>

			{/* Email/Password — disabled (private beta) */}
			<div className="w-full flex flex-col gap-3 mb-4 opacity-50 pointer-events-none select-none">
				<div className="flex flex-col gap-1">
					<label htmlFor="disabled-email" className="text-sm font-medium text-foreground">
						Email
					</label>
					<input
						id="disabled-email"
						type="email"
						placeholder="m@example.com"
						disabled
						className="h-12 rounded-xl bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground/50 text-sm px-4 cursor-not-allowed w-full"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="disabled-password" className="text-sm font-medium text-foreground">
						Password
					</label>
					<input
						id="disabled-password"
						type="password"
						placeholder="••••••••"
						disabled
						className="h-12 rounded-xl bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground/50 text-sm px-4 cursor-not-allowed w-full"
					/>
				</div>
				<button
					type="button"
					disabled
					className="w-full h-12 mt-1 bg-foreground text-background rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed flex items-center justify-center gap-2"
				>
					<LockIcon className="size-3.5" />
					Sign in — Private Beta
				</button>
			</div>

			{/* Separator */}
			<div className="w-full flex items-center gap-3 my-5">
				<div className="flex-1 h-px bg-border/50" />
				<span className="text-xs text-muted-foreground/50 font-medium">Demo Access</span>
				<div className="flex-1 h-px bg-border/50" />
			</div>

			{/* Demo accounts */}
			<div className="w-full flex flex-col gap-2.5">
				{DEMO_ACCOUNTS.map(({ role, label, sublabel, icon: Icon, color, description }) => (
					<button
						key={role}
						type="button"
						onClick={() => handleDemoLogin(role)}
						disabled={isDemoLoading !== null}
						className={cn(
							"group flex items-center gap-4 p-3.5 rounded-xl border border-border/50 bg-muted/5",
							"hover:bg-muted/15 hover:border-border transition-all text-left w-full",
							"active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed",
						)}
					>
						<div className="p-2 rounded-lg bg-muted/20 shrink-0 group-hover:bg-background transition-colors">
							<Icon className={cn("w-4 h-4", color)} />
						</div>
						<div className="flex flex-col min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<span className="text-sm font-bold tracking-tight">{label}</span>
								<span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider border border-border/40 rounded px-1.5 py-0.5">
									{sublabel}
								</span>
							</div>
							<span className="text-xs text-muted-foreground/60 mt-0.5">{description}</span>
						</div>
						<div className="shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
							{isDemoLoading === role ? (
								<div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
							) : (
								<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
									<path
										d="M6 3l5 5-5 5"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							)}
						</div>
					</button>
				))}
			</div>

			{/* Footer */}
			<p className="text-muted-foreground/40 text-xs mt-7 text-center leading-relaxed">
				Multiple users can log in simultaneously with the same demo role.
			</p>
		</div>
	);
}
