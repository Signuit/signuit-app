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
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon, SettingsIcon, ShieldCheckIcon } from "lucide-react";
import { usePolicies } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/policy")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: policies, isLoading, error } = usePolicies();
	const activePolicy = policies?.find((p) => p.payload.active);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
						<SettingsIcon className="text-primary size-5" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">Policy Management</h1>
						<p className="text-sm text-muted-foreground">
							Configure CTD rules and collateral constraints
						</p>
					</div>
				</div>
				<Button className="gap-2">
					<PlusIcon className="size-4" />
					Create Policy
				</Button>
			</div>

			{isLoading ? (
				<div className="h-64 flex items-center justify-center">
					<p className="animate-pulse text-muted-foreground">Loading policies...</p>
				</div>
			) : error ? (
				<div className="h-64 flex items-center justify-center text-destructive">
					<p>Error: {error.message}</p>
				</div>
			) : activePolicy ? (
				<div className="grid gap-6 lg:grid-cols-3">
					<Card className="lg:col-span-2 border-2 border-primary/20 shadow-lg">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<CardTitle className="flex items-center gap-2">
										<ShieldCheckIcon className="text-green-500" />
										Active Policy: {activePolicy.payload.policyId}
									</CardTitle>
									<CardDescription>Currently governing all routing suggestions</CardDescription>
								</div>
								<Badge variant="default" className="bg-green-600">
									Active
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-2 gap-8">
								<div className="space-y-4">
									<div>
										<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
											Rule Type
										</p>
										<p className="text-xl font-black text-primary">
											{activePolicy.payload.ruleType}
										</p>
									</div>
									<div>
										<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
											Priority List
										</p>
										<div className="flex flex-col gap-2">
											{activePolicy.payload.priorityList.map((asset, i) => (
												<div
													key={asset}
													className="flex items-center gap-2 bg-muted/50 p-2 rounded-md border border-border"
												>
													<span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
														{i + 1}
													</span>
													<span className="font-bold">{asset}</span>
												</div>
											))}
										</div>
									</div>
								</div>

								<div className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
												Min LTV
											</p>
											<p className="text-2xl font-bold">
												{(parseFloat(activePolicy.payload.minLtv) * 100).toFixed(0)}%
											</p>
										</div>
										<div>
											<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
												Max Haircut
											</p>
											<p className="text-2xl font-bold">
												{(parseFloat(activePolicy.payload.maxHaircut) * 100).toFixed(0)}%
											</p>
										</div>
									</div>

									<div>
										<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
											Auto-Approval Status
										</p>
										<div className="flex items-center gap-2">
											<Badge variant="outline" className="text-yellow-600 border-yellow-200">
												Phase 2 Feature
											</Badge>
											<span className="text-sm text-muted-foreground">
												{activePolicy.payload.autoApprove ? "Enabled" : "Disabled (Day 1 MVP)"}
											</span>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							<div>
								<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
									Counterparty-Specific Assets
								</p>
								<div className="space-y-2">
									{activePolicy.payload.counterpartyRules.map((rule) => (
										<div
											key={rule._1}
											className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-dashed border-border"
										>
											<span className="font-medium">{rule._1}</span>
											<div className="flex gap-1">
												{rule._2.map((asset: string) => (
													<Badge key={asset} variant="secondary" className="text-[10px]">
														{asset}
													</Badge>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="flex gap-3 pt-4">
								<Button className="flex-1">Edit Policy</Button>
								<Button variant="outline" className="flex-1">
									Deactivate
								</Button>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-col gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-sm">Policy History</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<div className="flex flex-col">
									{policies?.map((p, i: number) => (
										<div
											key={p.contractId}
											className={`flex flex-col p-4 gap-1 ${i !== policies.length - 1 ? "border-b" : ""} ${p.payload.active ? "bg-primary/5" : "opacity-50"}`}
										>
											<div className="flex items-center justify-between">
												<span className="font-bold text-sm">{p.payload.policyId}</span>
												<span className="text-[10px] text-muted-foreground">
													{new Date(p.payload.createdAt).toLocaleDateString()}
												</span>
											</div>
											<p className="text-xs text-muted-foreground">Type: {p.payload.ruleType}</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-primary text-primary-foreground">
							<CardHeader>
								<CardTitle className="text-sm font-bold">Optimization Engine</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-xs opacity-90 leading-relaxed">
									The SignUIT engine uses these policy constraints to compute the
									Cheapest-to-Deliver (CTD) route. It will never suggest a route that violates these
									rules.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<Card className="border-dashed border-2 p-12 text-center">
					<div className="flex flex-col items-center gap-4">
						<SettingsIcon className="size-12 text-muted-foreground opacity-20" />
						<div className="space-y-1">
							<h3 className="text-lg font-bold">No Active Policies</h3>
							<p className="text-muted-foreground max-w-sm mx-auto text-sm">
								You need an active policy for the CTD engine to generate routing suggestions.
							</p>
						</div>
						<Button className="mt-4">Create First Policy</Button>
					</div>
				</Card>
			)}
		</div>
	);
}
