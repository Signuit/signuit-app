"use client";

import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import {
	ChartContainer,
	ChartLegendContent,
	ChartTooltipContent,
} from "@nexus/ui/components/chart";
import { Separator } from "@nexus/ui/components/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@nexus/ui/components/table";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	DatabaseIcon,
	FileTextIcon,
	TrendingUpIcon,
	WalletIcon,
} from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuthRole } from "@/hooks/use-auth";
import {
	useAuditTrail,
	useHoldings,
	useSeedDemoData,
	useStats,
	useSuggestions,
} from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/")({
	component: RouteComponent,
});

const chartConfig = {
	routed: {
		label: "Routed ($M)",
		theme: {
			light: "hsl(var(--chart-1))",
			dark: "hsl(var(--chart-1))",
		},
	},
	saved: {
		label: "Cost Saved (bps)",
		theme: {
			light: "hsl(var(--chart-2))",
			dark: "hsl(var(--chart-2))",
		},
	},
};

// Static reference data — represents the expected efficiency curve for the demo.
// Will be replaced with live aggregation in Phase 2 when PQS is enabled.
const chartData = [
	{ month: "Nov", routed: 0, saved: 0 },
	{ month: "Dec", routed: 0, saved: 0 },
	{ month: "Jan", routed: 8.5, saved: 3.2 },
	{ month: "Feb", routed: 12.0, saved: 4.8 },
	{ month: "Mar", routed: 9.5, saved: 3.9 },
	{ month: "Apr", routed: 15.0, saved: 6.1 },
];

function WelcomeCard({ userRole }: { userRole: string }) {
	const { data: holdings, isLoading: holdingsLoading } = useHoldings();
	const seedMutation = useSeedDemoData();
	const isEmpty = !holdingsLoading && holdings?.length === 0;

	const content: Record<
		string,
		{ title: string; description: string; actions: { label: string; to: any }[] }
	> = {
		institution: {
			title: "Institution Dashboard",
			description: "Optimize your collateral utilization and manage liquidity across the network.",
			actions: [
				{ label: "View Holdings", to: "/dashboard/holdings" },
				{ label: "Review Suggestions", to: "/dashboard/suggestions" },
			],
		},
		counterparty: {
			title: "Counterparty Terminal",
			description: "Issue margin calls and monitor allocation responses from institutions.",
			actions: [
				{ label: "View Margin Calls", to: "/dashboard/suggestions" },
				{ label: "Check Audit Trail", to: "/dashboard/audit" },
			],
		},
		operator: {
			title: "Network Control Center",
			description: "Observing network-wide collateral health and policy compliance.",
			actions: [
				{ label: "Network Stats", to: "/dashboard" },
				{ label: "All Suggestions", to: "/dashboard/suggestions" },
			],
		},
	};

	const config = content[userRole] || content.institution;

	const handleSeed = async () => {
		try {
			await seedMutation.mutateAsync(undefined as any);
			toast.success("Demo data initialized — POLICY-001 + 3 holdings created on Canton");
		} catch (err) {
			toast.error(`Setup failed: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
	};

	return (
		<Card className="relative overflow-hidden border bg-accent/5 shadow-sm">
			<div className="absolute top-0 right-0 p-8 opacity-5">
				<TrendingUpIcon className="size-24" />
			</div>
			<CardHeader className="relative z-10">
				<CardTitle className="text-2xl font-bold tracking-tight">{config.title}</CardTitle>
				<p className="text-muted-foreground text-base max-w-2xl">{config.description}</p>
			</CardHeader>
			<CardContent className="relative z-10">
				<div className="flex flex-wrap gap-2">
					{config.actions.map((action) => (
						<Link key={action.to} to={action.to}>
							<Button variant="default" size="sm" className="rounded-md">
								{action.label}
								<ArrowRightIcon className="ml-2 size-4" />
							</Button>
						</Link>
					))}
					{userRole === "institution" && isEmpty && (
						<Button
							variant="outline"
							size="sm"
							className="rounded-md border-primary/30 text-primary hover:bg-primary/5"
							onClick={handleSeed}
							disabled={seedMutation.isPending}
						>
							{seedMutation.isPending ? (
								<>
									<div className="mr-2 size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
									Initializing...
								</>
							) : (
								<>
									<DatabaseIcon className="mr-2 size-4" />
									Initialize Demo Data
								</>
							)}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function HoldingsSummaryCard({ userRole }: { userRole: string }) {
	const { data: holdings } = useHoldings();

	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-3 text-sm">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{userRole === "operator" ? "Network Holdings" : "Collateral Holdings"}
					</CardTitle>
					<Link to="/dashboard/holdings">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1 hover:text-primary transition-colors"
						>
							View all
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{holdings?.slice(0, 4).map((h, index: number) => (
					<div key={h.contractId} className="group">
						<div className="flex items-center justify-between py-1">
							<div className="flex items-center gap-3">
								<div className="size-9 rounded-md bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
									<span className="font-semibold text-[10px] text-foreground">
										{h.payload.asset}
									</span>
								</div>
								<div>
									<p className="font-semibold text-sm tracking-tight">{h.payload.asset}</p>
									<p className="text-[10px] text-muted-foreground uppercase">
										Yield: {(parseFloat(h.payload.yield) * 100).toFixed(2)}%
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold text-sm">
									${(parseFloat(h.payload.amount) / 1_000_000).toFixed(1)}M
								</p>
								<p className="text-[10px] text-muted-foreground font-medium">
									{(100 - parseFloat(h.payload.haircut) * 100).toFixed(0)}% LTV
								</p>
							</div>
						</div>
						{index < Math.min(holdings.length, 4) - 1 && <Separator className="mt-4 opacity-50" />}
					</div>
				))}
				{holdings?.length === 0 && (
					<div className="flex flex-col items-center py-6 text-muted-foreground/50 italic text-sm">
						<WalletIcon className="size-8 mb-2 opacity-20" />
						<p>No holdings reported</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function PendingSuggestionsCard({ userRole }: { userRole: string }) {
	const { data: suggestions } = useSuggestions();
	const pending = suggestions?.filter((s) => s.payload.status === "RoutePending");

	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-3 text-sm">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{userRole === "institution"
							? "Pending Approvals"
							: userRole === "counterparty"
								? "Active Margin Calls"
								: "System suggestions"}
					</CardTitle>
					<Link to="/dashboard/suggestions">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1 hover:text-primary transition-colors"
						>
							{userRole === "institution" ? "Review all" : "View all"}
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{pending?.length === 0 ? (
					<div className="flex flex-col items-center py-6 text-muted-foreground/50 italic text-sm text-center">
						<FileTextIcon className="size-8 mb-2 opacity-20" />
						<p>No pending {userRole === "counterparty" ? "calls" : "routes"}</p>
					</div>
				) : (
					pending?.slice(0, 3).map((s, index: number) => (
						<div key={s.contractId} className="group">
							<div className="flex justify-between items-start">
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<div className="size-1.5 rounded-full bg-yellow-500" />
										<p className="font-semibold text-sm tracking-tight text-foreground">
											{s.payload.marginCallId}
										</p>
									</div>
									<p className="text-[10px] text-muted-foreground uppercase truncate max-w-[150px]">
										{s.payload.suggestedAssets.join(" + ")}
									</p>
									<p className="text-[11px] font-semibold text-primary">
										${(parseFloat(s.payload.amountRequired) / 1_000_000).toFixed(1)}M
									</p>
								</div>
								{userRole === "institution" ? (
									<Link to="/dashboard/suggestions">
										<Button size="sm" variant="outline" className="h-7 text-[10px] font-medium">
											Review
										</Button>
									</Link>
								) : (
									<Badge
										variant="outline"
										className="text-[10px] font-medium border-muted-foreground/20"
									>
										{s.payload.status}
									</Badge>
								)}
							</div>
							{index < Math.min(pending.length, 3) - 1 && <Separator className="mt-4 opacity-50" />}
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}

function RecentAllocationsCard() {
	const { data: audit } = useAuditTrail();
	const recent = audit?.slice(0, 5);

	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-3 text-sm">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Finalized Allocations
					</CardTitle>
					<Link to="/dashboard/audit">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1 hover:text-primary transition-colors"
						>
							Audit Trail
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-muted/50">
							<TableHead className="text-[10px] font-bold uppercase py-2">ID</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2">Collateral</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
								Amount
							</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
								Saving
							</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recent?.map((a) => {
							const routeId = a.payload.routeId as string | undefined;
							const assetsSent = (a.payload.assetsSent as string[] | undefined) ?? [];
							const amountsSent = (a.payload.amountsSent as string[] | undefined) ?? [];
							const opportunityCostBps = a.payload.opportunityCostBps as string | undefined;
							const status = a.payload.status as string | undefined;
							const displayId = routeId?.replace("ROUTE-", "") ?? a.contractId.slice(0, 8);
							const totalAmount =
								amountsSent.reduce((sum, amt) => sum + parseFloat(amt || "0"), 0) / 1_000_000;
							return (
								<TableRow key={a.contractId} className="group border-muted/30">
									<TableCell className="font-mono text-[10px] font-medium text-muted-foreground">
										#{displayId}
									</TableCell>
									<TableCell className="text-[11px] font-medium">
										{assetsSent.length > 0 ? assetsSent.join(", ") : "—"}
									</TableCell>
									<TableCell className="text-[11px] font-semibold text-right">
										${totalAmount.toFixed(1)}M
									</TableCell>
									<TableCell className="text-[11px] font-medium text-muted-foreground text-right">
										{parseFloat(opportunityCostBps || "0").toFixed(1)}bps
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end">
											<Badge
												variant="secondary"
												className="text-[10px] font-medium px-1.5 py-0 border-transparent bg-green-500/10 text-green-700 dark:text-green-400"
											>
												{status ?? "—"}
											</Badge>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
						{(!recent || recent.length === 0) && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center text-muted-foreground py-10 italic text-sm"
								>
									No allocation records found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

function TransactionChart() {
	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-3 text-sm">
				<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Efficiency Metrics
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[240px] w-full">
					<RechartsPrimitive.AreaChart data={chartData}>
						<defs>
							<linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
								<stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
								<stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
							</linearGradient>
						</defs>
						<RechartsPrimitive.XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
							tickMargin={8}
						/>
						<RechartsPrimitive.YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
							tickFormatter={(value) => `${value}`}
						/>
						<RechartsPrimitive.Tooltip content={<ChartTooltipContent indicator="line" />} />
						<RechartsPrimitive.CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							className="stroke-muted"
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="routed"
							stroke="hsl(var(--chart-1))"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorDesktop)"
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="saved"
							stroke="hsl(var(--chart-2))"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorMobile)"
						/>
						<ChartLegendContent />
					</RechartsPrimitive.AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function CounterpartyView() {
	const { totalHoldingsValue, pendingSuggestions, totalAllocations, isLoading } = useStats();

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard
					title="Network Exposure"
					value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
					icon={TrendingUpIcon}
					trend={null}
					trendValue="Locked"
					loading={isLoading}
				/>
				<StatCard
					title="Active Margin Calls"
					value={pendingSuggestions}
					icon={FileTextIcon}
					trend={pendingSuggestions > 0 ? "up" : "down"}
					trendValue={pendingSuggestions > 0 ? "Pending action" : "Fulfilled"}
					loading={isLoading}
				/>
				<StatCard
					title="Cumulative Fulfillments"
					value={totalAllocations}
					icon={WalletIcon}
					trend={totalAllocations > 0 ? "up" : null}
					trendValue={`${totalAllocations} on-ledger`}
					loading={isLoading}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<PendingSuggestionsCard userRole="counterparty" />
				<RecentAllocationsCard />
			</div>
		</div>
	);
}

function OperatorView() {
	const { totalHoldingsValue, pendingSuggestions, totalAllocations, isLoading } = useStats();

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard
					title="Network Assets"
					value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
					icon={WalletIcon}
					trend={totalHoldingsValue > 0 ? "up" : null}
					trendValue="Live from Canton"
					loading={isLoading}
				/>
				<StatCard
					title="Global Suggestion Queue"
					value={pendingSuggestions}
					icon={FileTextIcon}
					trend={pendingSuggestions > 0 ? "up" : "down"}
					trendValue={pendingSuggestions > 0 ? "Observer active" : "Silent"}
					loading={isLoading}
				/>
				<StatCard
					title="Executed Routes"
					value={totalAllocations}
					icon={TrendingUpIcon}
					trend={totalAllocations > 0 ? "up" : null}
					trendValue={`${totalAllocations} allocations`}
					loading={isLoading}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<HoldingsSummaryCard userRole="operator" />
				<div className="lg:col-span-2">
					<RecentAllocationsCard />
				</div>
			</div>
		</div>
	);
}

function RouteComponent() {
	const { role } = useAuthRole();
	const { totalHoldingsValue, pendingSuggestions, totalAllocations, isLoading } = useStats();

	const renderByRole = () => {
		switch (role) {
			case "operator":
				return <OperatorView />;
			case "counterparty":
				return <CounterpartyView />;
			default:
				return (
					<>
						<div className="grid gap-4 md:grid-cols-3">
							<StatCard
								title="Available Collateral"
								value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
								icon={WalletIcon}
								trend={totalHoldingsValue > 0 ? "up" : null}
								trendValue="Live from Canton"
								loading={isLoading}
							/>
							<StatCard
								title="Actionable Routes"
								value={pendingSuggestions}
								icon={FileTextIcon}
								trend={pendingSuggestions > 0 ? "up" : "down"}
								trendValue={pendingSuggestions > 0 ? "Approval Required" : "All Clear"}
								loading={isLoading}
							/>
							<StatCard
								title="Deployed Value"
								value={totalAllocations}
								icon={TrendingUpIcon}
								trend={totalAllocations > 0 ? "up" : null}
								trendValue={`${totalAllocations} allocations`}
								loading={isLoading}
							/>
						</div>

						<div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col gap-6">
								<HoldingsSummaryCard userRole={role} />
								<PendingSuggestionsCard userRole={role} />
							</div>
							<div className="flex flex-col gap-6">
								<TransactionChart />
								<RecentAllocationsCard />
							</div>
						</div>
					</>
				);
		}
	};

	return (
		<div className="flex flex-col gap-8 pb-12">
			<WelcomeCard userRole={role} />
			{renderByRole()}
		</div>
	);
}
