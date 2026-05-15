import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@nexus/ui/components/dialog";
import { BuildingIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { useState } from "react";
import { demoLogin } from "@/lib/auth-client";

interface DemoLaunchModalProps {
	open: boolean;
	onClose: () => void;
	/** If provided, skips role selection and logs in directly as this role */
	targetRole?: "institution" | "counterparty" | "operator";
	/** If provided, opens this URL after login instead of the role default */
	targetHref?: string;
	/** Optional context label shown in the modal header */
	stepHint?: string;
}

const ROLES = [
	{
		key: "institution" as const,
		label: "VantageCapital",
		sublabel: "Institution",
		desc: "Holdings, margin calls, approve routing suggestions",
		icon: BuildingIcon,
		href: "/dashboard/holdings",
	},
	{
		key: "counterparty" as const,
		label: "PrimeBank",
		sublabel: "Counterparty",
		desc: "Issue margin calls, view audit trail",
		icon: ZapIcon,
		href: "/dashboard/margin-calls",
	},
	{
		key: "operator" as const,
		label: "SignUIT",
		sublabel: "Operator",
		desc: "Network-wide view of all activity",
		icon: ShieldCheckIcon,
		href: "/dashboard",
	},
] as const;

export function DemoLaunchModal({
	open,
	onClose,
	targetRole,
	targetHref,
	stepHint,
}: DemoLaunchModalProps) {
	const [loadingRole, setLoadingRole] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleLaunch = async (
		roleKey: "institution" | "counterparty" | "operator",
		href: string,
	) => {
		setLoadingRole(roleKey);
		setError(null);
		try {
			await demoLogin(roleKey);
			window.open(href, "_blank");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed — is the app running?");
		} finally {
			setLoadingRole(null);
		}
	};

	// Which roles to show — if targetRole given, show only that one
	const visibleRoles = targetRole ? ROLES.filter((r) => r.key === targetRole) : ROLES;

	const isDirectLaunch = !!targetRole;

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						{isDirectLaunch ? (stepHint ?? "Open Demo") : "Launch Live Demo"}
					</DialogTitle>
					<DialogDescription>
						{isDirectLaunch
							? "Click to log in and open this step instantly."
							: "Select a role to log in — no password needed."}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3 mt-2">
					{visibleRoles.map((role) => {
						const Icon = role.icon;
						const isLoading = loadingRole === role.key;
						const dest = targetHref ?? role.href;
						return (
							<button
								type="button"
								key={role.key}
								onClick={() => handleLaunch(role.key, dest)}
								disabled={!!loadingRole}
								className="flex items-center gap-4 p-4 rounded-xl border text-left transition-all bg-muted/40 hover:bg-muted/70 border-border disabled:opacity-60 disabled:cursor-not-allowed"
							>
								<div className="size-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border">
									{isLoading ? (
										<div className="size-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
									) : (
										<Icon className="size-5 text-primary" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline gap-2">
										<span className="font-bold text-sm">{role.label}</span>
										<span className="text-xs text-muted-foreground">{role.sublabel}</span>
									</div>
									<p className="text-xs text-muted-foreground mt-0.5">
										{isDirectLaunch ? dest : role.desc}
									</p>
								</div>
								<span className="text-xs font-medium text-primary">
									{isLoading ? "Opening..." : "Open →"}
								</span>
							</button>
						);
					})}
				</div>

				{error && (
					<p className="text-sm text-destructive mt-2 text-center bg-destructive/10 rounded-lg p-3">
						{error}
					</p>
				)}

				<p className="text-xs text-center text-muted-foreground mt-2">
					Opens in a new tab · Canton sandbox must be running
				</p>
			</DialogContent>
		</Dialog>
	);
}
