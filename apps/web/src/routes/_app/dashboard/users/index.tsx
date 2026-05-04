import { Badge } from "@nexus/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { BuildingIcon, NetworkIcon, ShieldIcon } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/users/")({
	component: RouteComponent,
});

const NETWORK_PARTICIPANTS = [
	{
		name: "Vantage Capital",
		email: "demo-vantage@signuit.app",
		partyId: "VantageCapital",
		role: "institution" as const,
		description: "Asset owner — initiates CTD routing and approves allocation decisions.",
		icon: BuildingIcon,
		status: "Active",
	},
	{
		name: "Prime Bank",
		email: "demo-primebank@signuit.app",
		partyId: "PrimeBank",
		role: "counterparty" as const,
		description: "Issues margin calls and monitors allocation responses on the ledger.",
		icon: BuildingIcon,
		status: "Active",
	},
	{
		name: "SignUIT Operator",
		email: "demo-operator@signuit.app",
		partyId: "SignUIT",
		role: "operator" as const,
		description: "Network orchestrator — infrastructure party that observes all contracts.",
		icon: ShieldIcon,
		status: "Active",
	},
];

const roleBadgeClass: Record<string, string> = {
	institution: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-transparent",
	counterparty:
		"bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-transparent",
	operator:
		"bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-transparent",
};

function RouteComponent() {
	return (
		<div className="flex flex-col gap-6 pb-12">
			<div className="flex items-center gap-3">
				<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
					<NetworkIcon className="text-muted-foreground size-5" />
				</div>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Network Participants</h1>
					<p className="text-muted-foreground text-sm">
						Canton party identities registered on the SignUIT network
					</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{NETWORK_PARTICIPANTS.map((p) => {
					const Icon = p.icon;
					return (
						<Card key={p.partyId} className="shadow-sm">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
											<Icon className="text-muted-foreground size-5" />
										</div>
										<div>
											<CardTitle className="text-base font-bold tracking-tight">{p.name}</CardTitle>
											<p className="text-[11px] text-muted-foreground font-medium">{p.email}</p>
										</div>
									</div>
									<Badge
										variant="secondary"
										className={`text-[10px] font-semibold capitalize ${roleBadgeClass[p.role]}`}
									>
										{p.role}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
								<div className="rounded-md bg-muted/40 px-3 py-2 border border-muted">
									<p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
										Canton Party ID
									</p>
									<p className="font-mono text-xs font-semibold">{p.partyId}</p>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="size-1.5 rounded-full bg-green-500" />
									<span className="text-[11px] font-medium text-muted-foreground">{p.status}</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<Card className="bg-muted/5 border-dashed shadow-none">
				<CardContent className="pt-6">
					<p className="text-[11px] text-muted-foreground leading-relaxed font-medium text-center max-w-xl mx-auto">
						In the Canton multi-party model, each participant holds their own Canton party identity.
						SignUIT acts as network infrastructure (operator), observing contracts without
						gatekeeping institution decisions.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
