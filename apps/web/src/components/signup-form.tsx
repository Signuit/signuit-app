import { Link } from "@tanstack/react-router";
import { Building2, Landmark, Settings, ShieldCheck } from "lucide-react";

export function SignupForm() {
	return (
		<div className="w-full max-w-[480px] px-6 flex flex-col items-center">
			{/* Logo */}
			<div className="mb-8">
				<img
					src="/assets/logo_white.png"
					alt="SignUIT Logo"
					className="h-10 w-auto hidden dark:block"
				/>
				<img
					src="/assets/logo_black.png"
					alt="SignUIT Logo"
					className="h-10 w-auto block dark:hidden"
				/>
			</div>

			{/* Lock icon */}
			<div className="mb-6 flex items-center justify-center size-14 rounded-2xl bg-muted/20 border border-border/40">
				<ShieldCheck className="size-7 text-muted-foreground/60" />
			</div>

			{/* Title */}
			<h1 className="text-[26px] font-bold tracking-tight text-center mb-2">Private Beta</h1>
			<p className="text-muted-foreground text-[15px] text-center mb-8 max-w-[340px] leading-relaxed">
				SignUIT is currently invitation-only. Public registration is not yet available.
			</p>

			{/* Demo roles info */}
			<div className="w-full rounded-xl border border-border/40 bg-muted/5 p-5 mb-8">
				<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
					Available demo roles
				</p>
				<div className="flex flex-col gap-3">
					{[
						{
							icon: Building2,
							label: "Vantage Capital",
							role: "Institution",
							color: "text-blue-400",
						},
						{ icon: Landmark, label: "Prime Bank", role: "Counterparty", color: "text-amber-400" },
						{
							icon: Settings,
							label: "SignUIT Operator",
							role: "Operator",
							color: "text-emerald-400",
						},
					].map(({ icon: Icon, label, role, color }) => (
						<div key={role} className="flex items-center gap-3">
							<Icon className={`size-4 ${color}`} />
							<span className="text-sm font-medium">{label}</span>
							<span className="text-xs text-muted-foreground/50 ml-auto">{role}</span>
						</div>
					))}
				</div>
			</div>

			<Link
				to="/login"
				className="w-full flex items-center justify-center h-12 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all"
			>
				Access Demo →
			</Link>

			<p className="text-muted-foreground/50 text-xs mt-6 text-center">
				Interested in early access?{" "}
				<a
					href="mailto:ali@signuit.com"
					className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
				>
					Contact us
				</a>
			</p>
		</div>
	);
}
