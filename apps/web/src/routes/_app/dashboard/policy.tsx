import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@nexus/ui/components/card";
import { Separator } from "@nexus/ui/components/separator";
import { cn } from "@nexus/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { InfoIcon, PlusIcon, SettingsIcon, ShieldCheckIcon } from "lucide-react";
import { useAuthRole } from "@/hooks/use-auth";
import { usePolicies } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/policy")({
	component: RouteComponent,
});

function RouteComponent() {
	const { role } = useAuthRole();
	const { data: policies, isLoading, error } = usePolicies();
	const activePolicy = policies?.find((p) => p.payload.active);

	const isReadOnly = role === "operator";

	return (
		<div className="flex flex-col gap-6 pb-12">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
						<SettingsIcon className="text-muted-foreground size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							{isReadOnly ? "All Policies" : "Policy Management"}
						</h1>
						<p className="text-muted-foreground text-sm">
							{isReadOnly
								? "Observing active collateral constraints across the network"
								: "Configure CTD rules and collateral constraints"}
						</p>
					</div>
				</div>
			{!isReadOnly && (
					<Button size="sm" className="gap-2" disabled title="Policy creation coming in Phase 2">
						<PlusIcon className="size-4" />
						Create Policy
					</Button>
				)}
			</div>

			{isLoading ? (
				<div className="h-64 flex flex-col items-center justify-center gap-4">
					<div className="size-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
					<p className="text-muted-foreground text-sm font-medium animate-pulse">
						Syncing policy engine...
					</p>
				</div>
			) : error ? (
				<div className="h-64 flex items-center justify-center text-destructive bg-destructive/5 rounded-lg border border-destructive/10">
					<p className="font-medium text-sm">Sync Error: {error.message}</p>
				</div>
			) : activePolicy ? (
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="lg:col-span-2 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
										<ShieldCheckIcon className="text-green-600 dark:text-green-400 size-5" />
										{activePolicy.payload.policyId}
									</CardTitle>
									<CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
										Active Routing Protocol
									</CardDescription>
								</div>
								<Badge
									variant="secondary"
									className="bg-green-500/10 text-green-700 dark:text-green-400 border-transparent font-semibold"
								>
									Active
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-8">
							<div className="grid grid-cols-2 gap-8">
								<div className="space-y-6">
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
											Rule Type
										</p>
										<p className="text-2xl font-bold text-primary tracking-tight">
											{activePolicy.payload.ruleType}
										</p>
									</div>
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
											Priority List
										</p>
										<div className="flex flex-col gap-1.5">
											{activePolicy.payload.priorityList.map((asset, i) => (
												<div
													key={asset}
													className="flex items-center gap-3 bg-muted/30 px-3 py-2 rounded-md border border-muted"
												>
													<span className="size-5 rounded bg-foreground text-background text-[10px] flex items-center justify-center font-bold">
														{i + 1}
													</span>
													<span className="font-semibold text-sm">{asset}</span>
													<div className="ml-auto">
														<Badge
															variant="outline"
															className="text-[9px] font-medium h-4 border-muted-foreground/30"
														>
															Tier {i + 1}
														</Badge>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>

								<div className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<div className="p-4 rounded-lg bg-muted/20 border border-muted">
											<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
												Min LTV
											</p>
											<p className="text-xl font-bold">
												{(parseFloat(activePolicy.payload.minLtv) * 100).toFixed(0)}%
											</p>
										</div>
										<div className="p-4 rounded-lg bg-muted/20 border border-muted">
											<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
												Max Haircut
											</p>
											<p className="text-xl font-bold">
												{(parseFloat(activePolicy.payload.maxHaircut) * 100).toFixed(0)}%
											</p>
										</div>
									</div>

									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
											Auto-Approval
										</p>
										<div className="flex flex-col gap-2">
											<div className="flex items-center gap-2">
												<Badge
													variant="outline"
													className="text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 font-semibold"
												>
													Day 1 MVP
												</Badge>
												<span className="text-xs text-muted-foreground font-medium italic">
													{activePolicy.payload.autoApprove ? "Active" : "Disabled"}
												</span>
											</div>
											<p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
												Manual approval required for all routing suggestions.
											</p>
										</div>
									</div>
								</div>
							</div>

							<Separator className="opacity-50" />

							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
									Counterparty Eligibility
								</p>
								<div className="grid gap-2">
									{activePolicy.payload.counterpartyRules.map((rule) => (
										<div
											key={rule._1}
											className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-dashed border-muted"
										>
											<div className="flex items-center gap-2">
												<div className="size-1.5 rounded-full bg-primary/40" />
												<span className="font-semibold text-sm">{rule._1}</span>
											</div>
											<div className="flex gap-1">
												{rule._2.map((asset: string) => (
													<Badge
														key={asset}
														variant="secondary"
														className="text-[9px] font-medium border-transparent"
													>
														{asset}
													</Badge>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

						{!isReadOnly && (
							<div className="flex gap-3 pt-2">
								<Button variant="outline" className="flex-1 font-semibold" disabled title="Policy editing coming in Phase 2">
									Edit Settings
								</Button>
								<Button
									variant="ghost"
									className="flex-1 font-semibold text-destructive hover:text-destructive hover:bg-destructive/10"
									disabled
									title="Policy deactivation coming in Phase 2"
								>
									Deactivate
								</Button>
							</div>
						)}
						</CardContent>
					</Card>

					<div className="flex flex-col gap-4">
						<Card className="shadow-sm overflow-hidden">
							<CardHeader className="pb-3 text-sm">
								<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Ledger Versions
								</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<div className="flex flex-col">
									{policies?.map((p) => (
										<div
											key={p.contractId}
											className={cn(
												"flex flex-col p-4 gap-1 transition-colors border-b last:border-0",
												p.payload.active ? "bg-accent/50" : "opacity-50 grayscale",
											)}
										>
											<div className="flex items-center justify-between">
												<span className="font-semibold text-sm">{p.payload.policyId}</span>
												<span className="text-[10px] font-medium text-muted-foreground">
													{new Date(p.payload.createdAt).toLocaleDateString()}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<p className="text-[10px] font-bold text-primary/70 uppercase">
													{p.payload.ruleType}
												</p>
												{p.payload.active && <div className="size-1.5 rounded-full bg-green-500" />}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-muted shadow-sm border-none">
							<CardHeader className="pb-2">
								<CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
									<InfoIcon className="size-3" />
									CTD Engine
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">
									"The SignUIT engine uses these multi-party constraints to compute the immutable
									Cheapest-to-Deliver route."
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<Card className="border-dashed border-2 border-muted border-muted-foreground/20 p-24 text-center bg-muted/5 rounded-3xl">
					<div className="flex flex-col items-center gap-6">
						<div className="size-16 rounded-full bg-muted flex items-center justify-center">
							<SettingsIcon className="size-8 text-muted-foreground opacity-30" />
						</div>
						<div className="space-y-1">
							<h3 className="text-xl font-bold tracking-tight">No Active Policies</h3>
							<p className="text-muted-foreground max-w-xs mx-auto text-sm">
								Required for CTD routing engine recommendations.
							</p>
						</div>
					{!isReadOnly && (
						<Button size="sm" className="mt-2 font-semibold" disabled title="Create a policy to initialize the engine">
							Initialize Engine
						</Button>
					)}
					</div>
				</Card>
			)}
		</div>
	);
}
