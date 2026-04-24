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
import { ArrowRightIcon, FileTextIcon, TrendingUpIcon, WalletIcon, ZapIcon } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAuditTrail, useHoldings, useStats, useSuggestions } from "@/hooks/use-collateral-api";
import { useAuthRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/dashboard/")({
	component: RouteComponent,
});

const chartConfig = {
	desktop: {
		label: "Desktop",
		theme: {
			light: "hsl(var(--chart-1))",
			dark: "hsl(var(--chart-1))",
		},
	},
	mobile: {
		label: "Mobile",
		theme: {
			light: "hsl(var(--chart-2))",
			dark: "hsl(var(--chart-2))",
		},
	},
};

const chartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
];

function RoleBadge({ role }: { role: string }) {
	const config = {
		institution: { label: "Institution", color: "bg-blue-500", text: "Vantage Capital" },
		counterparty: { label: "Counterparty", color: "bg-amber-500", text: "Prime Bank" },
		operator: { label: "Operator", color: "bg-emerald-500", text: "SignUIT" },
	};
	const c = config[role as keyof typeof config] || config.institution;
	
	return (
		<Badge className={`${c.color} text-white hover:${c.color}`}>
			{c.text}
		</Badge>
	);
}

function HoldingsSummaryCard() {
	const { data: holdings } = useHoldings();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Collateral Holdings</CardTitle>
					<Link to="/dashboard/holdings">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1"
						>
							View all
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{holdings?.slice(0, 4).map((h, index: number) => (
					<div key={h.contractId}>
						<div className="flex items-center justify-between py-1">
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
									<span className="font-bold text-xs">{h.payload.asset}</span>
								</div>
								<div>
									<p className="font-medium">{h.payload.asset}</p>
									<p className="text-xs text-muted-foreground">
										{(parseFloat(h.payload.yield) * 100).toFixed(1)}% yield
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-medium">
									${(parseFloat(h.payload.amount) / 1_000_000).toFixed(1)}M
								</p>
								<p className="text-xs text-muted-foreground">
									LTV: {((1 - parseFloat(h.payload.haircut)) * 100).toFixed(0)}%
								</p>
							</div>
						</div>
						{index < Math.min(holdings.length, 4) - 1 && <Separator className="mt-4" />}
					</div>
				))}
				{holdings?.length === 0 && (
					<p className="text-sm text-muted-foreground text-center py-4">No holdings found</p>
				)}
			</CardContent>
		</Card>
	);
}

function PendingSuggestionsCard() {
	const { data: suggestions } = useSuggestions();
	const pending = suggestions?.filter((s) => s.payload.status === "RoutePending");

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Pending Approvals</CardTitle>
					<Link to="/dashboard/suggestions">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1"
						>
							Review all
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{pending?.length === 0 ? (
					<p className="text-sm text-muted-foreground text-center py-4">No pending suggestions</p>
				) : (
					pending?.slice(0, 3).map((s, index: number) => (
						<div key={s.contractId}>
							<div className="flex justify-between items-start">
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<FileTextIcon className="size-4 text-primary" />
										<p className="font-medium text-sm">Route #{s.payload.routeId}</p>
									</div>
									<p className="text-xs text-muted-foreground">
										Margin Call: {s.payload.marginCallId}
									</p>
									<p className="text-xs font-medium">
										Suggests: {s.payload.suggestedAssets.join(" + ")}
									</p>
								</div>
								<Link to="/dashboard/suggestions">
									<Button size="sm" variant="outline" className="h-8 text-xs">
										Review
									</Button>
								</Link>
							</div>
							{index < Math.min(pending.length, 3) - 1 && <Separator className="mt-4" />}
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
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Recent Allocations</CardTitle>
					<Link to="/dashboard/audit">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1"
						>
							View full trail
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Route ID</TableHead>
							<TableHead>Assets Sent</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Cost (bps)</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recent?.map((a) => (
							<TableRow key={a.contractId}>
								<TableCell className="font-mono text-xs">{a.payload.routeId}</TableCell>
								<TableCell>{a.payload.assetsSent.join(", ")}</TableCell>
								<TableCell>
									$
									{a.payload.amountsSent
										.reduce((sum: number, amt: string) => sum + parseFloat(amt), 0)
										.toLocaleString()}
								</TableCell>
								<TableCell>{parseFloat(a.payload.opportunityCostBps).toFixed(2)}</TableCell>
								<TableCell>
									<Badge
										variant="default"
										className="bg-green-500/10 text-green-600 dark:text-green-400"
									>
										{a.payload.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
						{(!recent || recent.length === 0) && (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
		<Card>
			<CardHeader>
				<CardTitle>Cost Optimization (Opportunity Cost)</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[240px] w-full">
					<RechartsPrimitive.AreaChart data={chartData}>
						<RechartsPrimitive.XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 12 }}
							tickMargin={8}
						/>
						<RechartsPrimitive.YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => `$${value}`}
						/>
						<RechartsPrimitive.Tooltip content={<ChartTooltipContent indicator="dot" />} />
						<RechartsPrimitive.CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							className="stroke-border/50"
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="desktop"
							fill="hsl(var(--chart-1))"
							fillOpacity={0.4}
							stroke="hsl(var(--chart-1))"
							strokeWidth={2}
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="mobile"
							fill="hsl(var(--chart-2))"
							fillOpacity={0.4}
							stroke="hsl(var(--chart-2))"
							strokeWidth={2}
						/>
						<ChartLegendContent />
					</RechartsPrimitive.AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function CounterpartyView() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Margin Call Actions</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<p className="text-sm text-muted-foreground">
					As Prime Bank (Counterparty), you can issue margin calls to institutions.
				</p>
				<Link to="/dashboard/generate">
					<Button>
						<ZapIcon className="size-4 mr-2" />
						Issue Margin Call
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}

function OperatorView() {
	const { totalHoldingsValue, pendingSuggestions, totalAllocations, isLoading } = useStats();
	
	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Network Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground mb-4">
						As SignUIT Operator, you can observe the entire network.
					</p>
					<div className="grid gap-4 md:grid-cols-3">
						<StatCard
							title="Total Collateral"
							value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
							icon={WalletIcon}
							trend="up"
							trendValue="+2.5%"
							loading={isLoading}
						/>
						<StatCard
							title="Pending Suggestions"
							value={pendingSuggestions}
							icon={FileTextIcon}
							trend={pendingSuggestions > 0 ? "up" : "down"}
							trendValue={pendingSuggestions > 0 ? "Requires action" : "All clear"}
							loading={isLoading}
						/>
						<StatCard
							title="Total Allocations"
							value={totalAllocations}
							icon={TrendingUpIcon}
							trend="up"
							trendValue="+12 this month"
							loading={isLoading}
						/>
					</div>
				</CardContent>
			</Card>
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
			case "institution":
			default:
				return (
					<>
						<div className="grid gap-4 md:grid-cols-3">
							<StatCard
								title="Total Collateral"
								value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
								icon={WalletIcon}
								trend="up"
								trendValue="+2.5%"
								loading={isLoading}
							/>
							<StatCard
								title="Pending Approvals"
								value={pendingSuggestions}
								icon={FileTextIcon}
								trend={pendingSuggestions > 0 ? "up" : "down"}
								trendValue={pendingSuggestions > 0 ? "Requires action" : "All clear"}
								loading={isLoading}
							/>
							<StatCard
								title="Routes Executed"
								value={totalAllocations}
								icon={TrendingUpIcon}
								trend="up"
								trendValue="+12 this month"
								loading={isLoading}
							/>
						</div>

						<div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
							<div className="flex flex-col gap-6">
								<HoldingsSummaryCard />
								<PendingSuggestionsCard />
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
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap gap-3 items-center justify-between">
				<div className="flex flex-wrap gap-3">
					<Link to="/dashboard/generate">
						<Button size="sm" variant="default" className="bg-primary hover:bg-primary/90 shadow-lg">
							<ZapIcon className="size-4 mr-2" />⚡ Generate Suggestion
						</Button>
					</Link>
				</div>
				<RoleBadge role={role} />
			</div>

			{renderByRole()}
		</div>
	);
}