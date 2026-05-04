"use client";

import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import {
	ChartContainer,
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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
	useMarginCalls,
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

// chartData is now computed live inside TransactionChart from Canton allocations.

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
			await seedMutation.mutateAsync(undefined);
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
				pending?.slice(0, 3).map((s, index: number) => {
					const marginCallId = s.payload.marginCallId as string | undefined;
					const suggestedAssets = (s.payload.suggestedAssets as string[] | undefined) ?? [];
					const amountRequired = s.payload.amountRequired as string | undefined;
					const status = s.payload.status as string | undefined;
					return (
					<div key={s.contractId} className="group">
						<div className="flex justify-between items-start">
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<div className="size-1.5 rounded-full bg-primary/70" />
									<p className="font-semibold text-sm tracking-tight text-foreground">
										{marginCallId ?? "—"}
									</p>
								</div>
								<p className="text-[10px] text-muted-foreground uppercase truncate max-w-[150px]">
									{suggestedAssets.length > 0 ? suggestedAssets.join(" + ") : "—"}
								</p>
								<p className="text-[11px] font-semibold text-primary">
									${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M
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
									{status ?? "—"}
								</Badge>
							)}
						</div>
						{index < Math.min(pending.length, 3) - 1 && <Separator className="mt-4 opacity-50" />}
					</div>
					);
				})
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
												className="text-[10px] font-medium px-1.5 py-0 border-transparent bg-primary/10 text-primary"
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

// chartData is now computed live inside TransactionChart from Canton allocations.

function TransactionChart() {
	const { data: audit } = useAuditTrail();

	// Build per-month aggregation from real Canton AllocationRecords
	const chartData = (() => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const now = new Date();
		// Show last 6 months
		const buckets: Record<string, { routed: number; saved: number }> = {};
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			buckets[months[d.getMonth()]] = { routed: 0, saved: 0 };
		}

		if (audit) {
			for (const a of audit) {
				const executedAt = a.payload?.executedAt as string | undefined;
				if (!executedAt) continue;
				const d = new Date(executedAt);
				const key = months[d.getMonth()];
				if (!(key in buckets)) continue;
				const amounts = (a.payload?.amountsSent as string[] | undefined) ?? [];
				const total = amounts.reduce((s, v) => s + parseFloat(v || "0"), 0) / 1_000_000;
				const bps = parseFloat((a.payload?.opportunityCostBps as string | undefined) ?? "0");
				buckets[key].routed += total;
				buckets[key].saved += bps;
			}
		}

		return Object.entries(buckets).map(([month, v]) => ({
			month,
			routed: Math.round(v.routed * 10) / 10,
			saved: Math.round(v.saved * 10) / 10,
		}));
	})();

	const hasData = chartData.some((d) => d.routed > 0);

	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-2 text-sm">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Routing Activity
					</CardTitle>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1.5">
							<div className="size-2.5 rounded-full bg-[var(--color-routed)]" />
							<span className="text-[10px] text-muted-foreground font-medium">Routed ($M)</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="size-2.5 rounded-full bg-[var(--color-saved)]" />
							<span className="text-[10px] text-muted-foreground font-medium">Cost (bps)</span>
						</div>
						{!hasData && (
							<span className="text-[10px] text-muted-foreground/50 italic">Awaiting data</span>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0 pb-4">
				<ChartContainer config={chartConfig} className="h-[220px] w-full">
					<RechartsPrimitive.AreaChart
						data={chartData}
						margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
					>
						<defs>
							<linearGradient id="gradRoutedM" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="var(--color-routed)" stopOpacity={0.5} />
								<stop offset="100%" stopColor="var(--color-routed)" stopOpacity={0.03} />
							</linearGradient>
							<linearGradient id="gradSavedM" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="var(--color-saved)" stopOpacity={0.5} />
								<stop offset="100%" stopColor="var(--color-saved)" stopOpacity={0.03} />
							</linearGradient>
						</defs>
						<RechartsPrimitive.CartesianGrid
							vertical={false}
							strokeDasharray="4 4"
							stroke="var(--border)"
							strokeOpacity={0.5}
						/>
						<RechartsPrimitive.XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 11, fill: "var(--muted-foreground)", opacity: 0.8 }}
							tickMargin={10}
						/>
						<RechartsPrimitive.YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 11, fill: "var(--muted-foreground)", opacity: 0.8 }}
							tickFormatter={(v: number) => v === 0 ? "0" : v >= 1 ? `${v}` : v.toFixed(1)}
							width={32}
						/>
						<RechartsPrimitive.Tooltip
							content={<ChartTooltipContent indicator="dot" />}
							cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }}
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="routed"
							stroke="var(--color-routed)"
							strokeWidth={2.5}
							fillOpacity={1}
							fill="url(#gradRoutedM)"
							dot={false}
							activeDot={{ r: 4, strokeWidth: 0 }}
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="saved"
							stroke="var(--color-saved)"
							strokeWidth={2.5}
							fillOpacity={1}
							fill="url(#gradSavedM)"
							dot={false}
							activeDot={{ r: 4, strokeWidth: 0 }}
						/>
					</RechartsPrimitive.AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function IncomingMarginCallsCard() {
	const { data: marginCalls } = useMarginCalls();
	const { data: allocations } = useAuditTrail();
	const navigate = useNavigate();

	// Exclude calls that already have a matching AllocationRecord
	const respondedIds = new Set(
		(allocations ?? [])
			.map((a) => a.payload?.marginCallId as string | undefined)
			.filter(Boolean),
	);

	const pending = (marginCalls ?? []).filter((m) => {
		const callId = m.payload?.callId as string | undefined;
		const status = m.payload?.status as string | undefined;
		return status === "RoutePending" && !respondedIds.has(callId ?? "");
	});

	if (pending.length === 0) return null;

	return (
		<Card className="shadow-sm border-primary/20 bg-primary/5">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<div className="size-2 rounded-full bg-primary animate-pulse" />
					<CardTitle className="text-sm font-semibold text-primary">
						{pending.length} Incoming Margin Call{pending.length > 1 ? "s" : ""}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				{pending.map((m) => {
					const callId = m.payload?.callId as string | undefined;
					const amountRequired = m.payload?.amountRequired as string | undefined;
					const counterparty = m.payload?.counterparty as string | undefined;
					const currency = m.payload?.currency as string | undefined;
					const dueBy = m.payload?.dueBy as string | undefined;
					return (
						<div
							key={m.contractId}
							className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2.5"
						>
							<div className="flex flex-col gap-0.5">
								<span className="font-mono text-[11px] text-muted-foreground">
									{callId ?? m.contractId.slice(0, 10)}
								</span>
								<span className="text-sm font-bold">
									${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M{" "}
									<span className="text-xs font-normal text-muted-foreground">{currency}</span>
								</span>
								<span className="text-[10px] text-muted-foreground">
									From: {counterparty?.split("::")[0] ?? "—"}
									{dueBy ? ` · Due ${new Date(dueBy).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
								</span>
							</div>
							<Button
								size="sm"
								className="h-8 px-3 text-xs font-semibold shrink-0"
								onClick={() =>
									navigate({
										to: "/dashboard/generate",
										search: {
											marginCallId: callId ?? "",
											amount: amountRequired ?? "0",
											counterparty: counterparty?.split("::")[0] ?? "",
										},
									})
								}
							>
								Respond
							</Button>
						</div>
					);
				})}
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
							<IncomingMarginCallsCard />
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
