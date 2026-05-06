"use client";

import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { ChartContainer, ChartTooltipContent } from "@nexus/ui/components/chart";
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
	AlertTriangleIcon,
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	DatabaseIcon,
	FileTextIcon,
	ShieldCheckIcon,
	WalletIcon,
} from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { toast } from "sonner";
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
		theme: { light: "hsl(var(--chart-1))", dark: "hsl(var(--chart-1))" },
	},
	saved: {
		label: "Cost Saved (bps)",
		theme: { light: "hsl(var(--chart-2))", dark: "hsl(var(--chart-2))" },
	},
};

// ─── Mini sparkline for metric cards ──────────────────────────────────────────
function Sparkline({ data, color = "#22c55e" }: { data: number[]; color?: string }) {
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	const w = 80;
	const h = 28;
	const pts = data.map((v, i) => {
		const x = (i / (data.length - 1)) * w;
		const y = h - ((v - min) / range) * h;
		return `${x},${y}`;
	});
	return (
		<svg aria-hidden="true" width={w} height={h} className="overflow-visible">
			<polyline
				points={pts.join(" ")}
				fill="none"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				opacity={0.8}
			/>
		</svg>
	);
}

// ─── Metric card (IRSForge style) ─────────────────────────────────────────────
function MetricCard({
	title,
	value,
	sub,
	trend,
	sparkData,
	sparkColor,
	badge,
	badgeVariant = "secondary",
	loading,
}: {
	title: string;
	value: string | number;
	sub?: string;
	trend?: { dir: "up" | "down" | "neutral"; label: string };
	sparkData?: number[];
	sparkColor?: string;
	badge?: string;
	badgeVariant?: "secondary" | "destructive" | "outline";
	loading?: boolean;
}) {
	return (
		<Card className="shadow-sm border-border/60 bg-card">
			<CardContent className="pt-5 pb-4 px-5">
				<div className="flex items-start justify-between mb-3">
					<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
						{title}
					</p>
					{badge && (
						<Badge
							variant={badgeVariant}
							className="text-[9px] px-1.5 py-0 h-4 font-semibold uppercase tracking-wide"
						>
							{badge}
						</Badge>
					)}
				</div>
				{loading ? (
					<div className="h-8 w-24 rounded bg-muted/30 animate-pulse" />
				) : (
					<p className="text-[26px] font-bold tracking-tight leading-none font-mono">{value}</p>
				)}
				<div className="flex items-end justify-between mt-3">
					<div className="flex items-center gap-1.5">
						{trend && !loading && (
							<>
								{trend.dir === "up" && <ArrowUpIcon className="size-3 text-emerald-500" />}
								{trend.dir === "down" && <ArrowDownIcon className="size-3 text-red-500" />}
								<span
									className={`text-[11px] font-medium ${
										trend.dir === "up"
											? "text-emerald-500"
											: trend.dir === "down"
												? "text-red-500"
												: "text-muted-foreground/60"
									}`}
								>
									{trend.label}
								</span>
							</>
						)}
						{sub && !loading && <span className="text-[11px] text-muted-foreground/50">{sub}</span>}
					</div>
					{sparkData && sparkData.length > 1 && <Sparkline data={sparkData} color={sparkColor} />}
				</div>
			</CardContent>
		</Card>
	);
}

// ─── Book Risk summary (top bar IRSForge style) ───────────────────────────────
function BookRiskBar({
	totalValue,
	pendingCalls,
	totalAllocations,
	isLoading,
}: {
	totalValue: number;
	pendingCalls: number;
	totalAllocations: number;
	isLoading: boolean;
}) {
	const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
	const npv = totalValue;
	const dv01 = totalValue * 0.00375; // ~37.5 bps approximation
	const utilization = totalAllocations > 0 ? Math.min(totalAllocations * 12, 94) : 0;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{/* Book Risk */}
			<Card className="border-border/60 shadow-sm bg-card">
				<CardContent className="pt-4 pb-4 px-5">
					<div className="flex items-center justify-between mb-3">
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							Book Risk
						</p>
						<span className="text-[10px] text-muted-foreground/40 font-mono">as of {now} UTC</span>
					</div>
					<div className="flex items-end gap-8">
						<div>
							<p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-1">
								NPV
							</p>
							{isLoading ? (
								<div className="h-8 w-20 rounded bg-muted/30 animate-pulse" />
							) : (
								<p className="text-[26px] font-bold font-mono text-emerald-400 leading-none">
									${(npv / 1_000_000).toFixed(1)}M
								</p>
							)}
						</div>
						<div>
							<p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-1">
								DV01
							</p>
							{isLoading ? (
								<div className="h-8 w-16 rounded bg-muted/30 animate-pulse" />
							) : (
								<p className="text-[26px] font-bold font-mono text-emerald-400 leading-none">
									${(dv01 / 1_000).toFixed(1)}K
								</p>
							)}
						</div>
					</div>
					<p className="text-[10px] text-muted-foreground/40 mt-2">USD · parallel · 1bp</p>
				</CardContent>
			</Card>

			{/* Book Size */}
			<Card className="border-border/60 shadow-sm bg-card">
				<CardContent className="pt-4 pb-4 px-5">
					<div className="flex items-center justify-between mb-3">
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							Book Size
						</p>
						<span className="text-[10px] text-muted-foreground/40 font-mono">as of {now} UTC</span>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between rounded-md bg-muted/20 px-3 py-2">
							<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
								Notional
							</span>
							{isLoading ? (
								<div className="h-5 w-12 rounded bg-muted/30 animate-pulse" />
							) : (
								<span className="font-bold font-mono text-sm">
									${(npv / 1_000_000).toFixed(0)}M
								</span>
							)}
						</div>
						<div className="flex items-center justify-between rounded-md bg-muted/20 px-3 py-2">
							<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
								Allocations
							</span>
							{isLoading ? (
								<div className="h-5 w-8 rounded bg-muted/30 animate-pulse" />
							) : (
								<span className="font-bold font-mono text-sm">{totalAllocations}</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Collateral Health */}
			<Card
				className={`border-border/60 shadow-sm ${pendingCalls > 0 ? "border-amber-500/30 bg-amber-500/5" : "bg-card"}`}
			>
				<CardContent className="pt-4 pb-4 px-5">
					<div className="flex items-center justify-between mb-3">
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							Collateral Health
						</p>
						{pendingCalls > 0 ? (
							<Badge
								variant="destructive"
								className="text-[9px] px-1.5 py-0 h-4 font-bold animate-pulse"
							>
								{pendingCalls} Margin Call{pendingCalls > 1 ? "s" : ""}
							</Badge>
						) : (
							<Badge
								variant="secondary"
								className="text-[9px] px-1.5 py-0 h-4 font-bold text-emerald-500 bg-emerald-500/10"
							>
								Healthy
							</Badge>
						)}
					</div>
					{isLoading ? (
						<div className="h-8 w-16 rounded bg-muted/30 animate-pulse" />
					) : (
						<>
							<p
								className={`text-[26px] font-bold font-mono leading-none ${pendingCalls > 0 ? "text-amber-400" : "text-emerald-400"}`}
							>
								{utilization.toFixed(0)}%
							</p>
							<div className="mt-2 h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
								<div
									className={`h-full rounded-full transition-all ${pendingCalls > 0 ? "bg-amber-400" : "bg-emerald-400"}`}
									style={{ width: `${utilization}%` }}
								/>
							</div>
							<p className="text-[10px] text-muted-foreground/40 mt-1.5">Utilization rate</p>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// ─── Holdings Summary ─────────────────────────────────────────────────────────
function HoldingsSummaryCard({ userRole }: { userRole: string }) {
	const { data: holdings } = useHoldings();

	return (
		<Card className="shadow-sm border-border/60">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
						{userRole === "operator" ? "Network Holdings" : "Collateral Holdings"}
					</CardTitle>
					<Link to="/dashboard/holdings">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1 hover:text-primary"
						>
							View all <ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{holdings?.length === 0 && (
					<div className="flex flex-col items-center py-8 text-muted-foreground/40 italic text-sm">
						<WalletIcon className="size-8 mb-2 opacity-30" />
						<p>No holdings reported</p>
					</div>
				)}
				{holdings?.slice(0, 4).map((h, i) => {
					const pct =
						(parseFloat(h.payload.amount) /
							(holdings.reduce((s, x) => s + parseFloat(x.payload.amount), 0) || 1)) *
						100;
					return (
						<div key={h.contractId}>
							<div className="flex items-center justify-between mb-1">
								<div className="flex items-center gap-2.5">
									<div className="size-8 rounded-md bg-muted/30 flex items-center justify-center">
										<span className="font-bold text-[9px] text-foreground/80">
											{h.payload.asset}
										</span>
									</div>
									<div>
										<p className="text-sm font-semibold">{h.payload.asset}</p>
										<p className="text-[10px] text-muted-foreground/50 font-mono">
											Yield {(parseFloat(h.payload.yield) * 100).toFixed(2)}%
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="font-bold text-sm font-mono">
										${(parseFloat(h.payload.amount) / 1_000_000).toFixed(1)}M
									</p>
									<p className="text-[10px] text-muted-foreground/50">
										{(100 - parseFloat(h.payload.haircut) * 100).toFixed(0)}% LTV
									</p>
								</div>
							</div>
							<div className="h-1 w-full rounded-full bg-muted/20 overflow-hidden">
								<div className="h-full rounded-full bg-primary/40" style={{ width: `${pct}%` }} />
							</div>
							{i < Math.min(holdings.length, 4) - 1 && <Separator className="mt-3 opacity-30" />}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}

// ─── Pending Suggestions ──────────────────────────────────────────────────────
function PendingSuggestionsCard({ userRole }: { userRole: string }) {
	const { data: suggestions } = useSuggestions();
	const pending = suggestions?.filter((s) => s.payload.status === "RoutePending");

	return (
		<Card className="shadow-sm border-border/60">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
						{userRole === "institution"
							? "Pending Approvals"
							: userRole === "counterparty"
								? "Active Margin Calls"
								: "System Suggestions"}
					</CardTitle>
					<Link to="/dashboard/suggestions">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1 hover:text-primary"
						>
							{userRole === "institution" ? "Review all" : "View all"}{" "}
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{!pending || pending.length === 0 ? (
					<div className="flex flex-col items-center py-8 text-muted-foreground/40 italic text-sm text-center">
						<FileTextIcon className="size-8 mb-2 opacity-30" />
						<p>No pending {userRole === "counterparty" ? "calls" : "routes"}</p>
					</div>
				) : (
					pending.slice(0, 3).map((s, i) => {
						const marginCallId = s.payload.marginCallId as string | undefined;
						const suggestedAssets = (s.payload.suggestedAssets as string[] | undefined) ?? [];
						const amountRequired = s.payload.amountRequired as string | undefined;
						return (
							<div key={s.contractId}>
								<div className="flex justify-between items-center">
									<div>
										<div className="flex items-center gap-2 mb-0.5">
											<div className="size-1.5 rounded-full bg-primary animate-pulse" />
											<p className="font-semibold text-sm">{marginCallId ?? "—"}</p>
										</div>
										<p className="text-[10px] text-muted-foreground/50 uppercase truncate max-w-[150px]">
											{suggestedAssets.length > 0 ? suggestedAssets.join(" + ") : "—"}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-bold text-sm font-mono text-primary">
											${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M
										</span>
										{userRole === "institution" && (
											<Link to="/dashboard/suggestions">
												<Button
													size="sm"
													variant="outline"
													className="h-7 text-[10px] font-semibold"
												>
													Review
												</Button>
											</Link>
										)}
									</div>
								</div>
								{i < Math.min(pending.length, 3) - 1 && <Separator className="mt-3 opacity-30" />}
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}

// ─── Recent Allocations ───────────────────────────────────────────────────────
function RecentAllocationsCard() {
	const { data: audit } = useAuditTrail();
	const recent = audit?.slice(0, 6);

	return (
		<Card className="shadow-sm border-border/60">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
						Finalized Allocations
					</CardTitle>
					<Link to="/dashboard/audit">
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground h-auto p-0 gap-1 hover:text-primary"
						>
							Audit Trail <ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-muted/30">
							<TableHead className="text-[10px] font-bold uppercase py-2 px-4">ID</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2">Collateral</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
								Amount
							</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
								Saving
							</TableHead>
							<TableHead className="text-[10px] font-bold uppercase py-2 text-right px-4">
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{recent?.map((a) => {
							const routeId = a.payload.routeId as string | undefined;
							const assetsSent = (a.payload.assetsSent as string[] | undefined) ?? [];
							const amountsSent = (a.payload.amountsSent as string[] | undefined) ?? [];
							const bps = parseFloat((a.payload.opportunityCostBps as string | undefined) ?? "0");
							const status = a.payload.status as string | undefined;
							const displayId = routeId?.replace("ROUTE-", "") ?? a.contractId.slice(0, 8);
							const totalAmt =
								amountsSent.reduce((s, v) => s + parseFloat(v || "0"), 0) / 1_000_000;
							return (
								<TableRow key={a.contractId} className="border-muted/20 hover:bg-muted/5">
									<TableCell className="font-mono text-[10px] text-muted-foreground/60 px-4">
										#{displayId}
									</TableCell>
									<TableCell className="text-[11px] font-semibold">
										{assetsSent.join(", ") || "—"}
									</TableCell>
									<TableCell className="text-[11px] font-bold text-right font-mono">
										${totalAmt.toFixed(1)}M
									</TableCell>
									<TableCell className="text-[11px] text-right font-mono text-emerald-500">
										{bps > 0 ? `${bps.toFixed(1)}bps` : "—"}
									</TableCell>
									<TableCell className="text-right px-4">
										<Badge
											variant="secondary"
											className="text-[9px] font-bold px-1.5 py-0 bg-primary/10 text-primary border-0"
										>
											{status ?? "—"}
										</Badge>
									</TableCell>
								</TableRow>
							);
						})}
						{(!recent || recent.length === 0) && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center text-muted-foreground/40 py-10 italic text-sm"
								>
									No allocation records yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

// ─── Routing Activity Chart ───────────────────────────────────────────────────
function TransactionChart() {
	const { data: audit } = useAuditTrail();
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

	const chartData = (() => {
		const buckets: Record<string, { routed: number; saved: number; count: number }> = {};
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			buckets[months[d.getMonth()]] = { routed: 0, saved: 0, count: 0 };
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
				buckets[key].count += 1;
			}
		}
		return Object.entries(buckets).map(([month, v]) => ({
			month,
			routed: Math.round(v.routed * 10) / 10,
			saved: Math.round(v.saved * 10) / 10,
			count: v.count,
		}));
	})();

	const hasData = chartData.some((d) => d.routed > 0);
	const totalRouted = chartData.reduce((s, d) => s + d.routed, 0);
	const totalSaved = chartData.reduce((s, d) => s + d.saved, 0);

	return (
		<Card className="shadow-sm border-border/60">
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between">
					<div>
						<CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
							Routing Activity — Last 6 Months
						</CardTitle>
						{hasData ? (
							<div className="flex gap-6">
								<div>
									<p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
										Total Routed
									</p>
									<p className="text-xl font-bold font-mono">${totalRouted.toFixed(1)}M</p>
								</div>
								<div>
									<p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
										Cost Saved
									</p>
									<p className="text-xl font-bold font-mono text-emerald-400">
										{totalSaved.toFixed(1)}bps
									</p>
								</div>
							</div>
						) : (
							<p className="text-sm text-muted-foreground/40 italic">
								Awaiting first allocation data
							</p>
						)}
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1.5">
							<div className="size-2 rounded-full bg-[var(--color-routed)]" />
							<span className="text-[10px] text-muted-foreground/60">Routed ($M)</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="size-2 rounded-full bg-[var(--color-saved)]" />
							<span className="text-[10px] text-muted-foreground/60">Cost (bps)</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-2 pb-4">
				<ChartContainer config={chartConfig} className="h-[200px] w-full">
					<RechartsPrimitive.AreaChart
						data={chartData}
						margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
					>
						<defs>
							<linearGradient id="gradRouted" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="var(--color-routed)" stopOpacity={0.4} />
								<stop offset="100%" stopColor="var(--color-routed)" stopOpacity={0.02} />
							</linearGradient>
							<linearGradient id="gradSaved" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="var(--color-saved)" stopOpacity={0.4} />
								<stop offset="100%" stopColor="var(--color-saved)" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<RechartsPrimitive.CartesianGrid
							vertical={false}
							strokeDasharray="4 4"
							stroke="var(--border)"
							strokeOpacity={0.4}
						/>
						<RechartsPrimitive.XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10, fill: "var(--muted-foreground)", opacity: 0.6 }}
							tickMargin={8}
						/>
						<RechartsPrimitive.YAxis
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 10, fill: "var(--muted-foreground)", opacity: 0.6 }}
							width={28}
						/>
						<RechartsPrimitive.Tooltip
							content={<ChartTooltipContent indicator="dot" />}
							cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="routed"
							stroke="var(--color-routed)"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#gradRouted)"
							dot={false}
							activeDot={{ r: 3, strokeWidth: 0 }}
						/>
						<RechartsPrimitive.Area
							type="monotone"
							dataKey="saved"
							stroke="var(--color-saved)"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#gradSaved)"
							dot={false}
							activeDot={{ r: 3, strokeWidth: 0 }}
						/>
					</RechartsPrimitive.AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

// ─── Asset Allocation Donut ───────────────────────────────────────────────────
function AssetAllocationChart() {
	const { data: holdings } = useHoldings();

	const COLORS = [
		"hsl(var(--chart-1))",
		"hsl(var(--chart-2))",
		"hsl(var(--chart-3))",
		"hsl(var(--chart-4))",
		"hsl(var(--chart-5))",
	];
	const data = (holdings ?? []).map((h, i) => ({
		name: h.payload.asset,
		value: parseFloat(h.payload.amount) / 1_000_000,
		color: COLORS[i % COLORS.length],
	}));
	const total = data.reduce((s, d) => s + d.value, 0);

	return (
		<Card className="shadow-sm border-border/60">
			<CardHeader className="pb-2">
				<CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
					Asset Allocation
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-[160px] text-muted-foreground/30 text-sm italic">
						<WalletIcon className="size-8 mb-2 opacity-30" />
						No holdings data
					</div>
				) : (
					<div className="flex items-center gap-6">
						<div className="relative shrink-0">
							<RechartsPrimitive.PieChart width={130} height={130}>
								<RechartsPrimitive.Pie
									data={data}
									cx={60}
									cy={60}
									innerRadius={38}
									outerRadius={60}
									paddingAngle={2}
									dataKey="value"
									strokeWidth={0}
								>
									{data.map((entry, i) => (
										<RechartsPrimitive.Cell key={i} fill={entry.color} opacity={0.85} />
									))}
								</RechartsPrimitive.Pie>
							</RechartsPrimitive.PieChart>
							<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
								<p className="text-[11px] font-bold font-mono">${total.toFixed(0)}M</p>
								<p className="text-[9px] text-muted-foreground/50">Total</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 flex-1">
							{data.map((d, i) => (
								<div key={i} className="flex items-center gap-2">
									<div
										className="size-2 rounded-full shrink-0"
										style={{ backgroundColor: d.color }}
									/>
									<span className="text-[11px] font-medium flex-1 truncate">{d.name}</span>
									<span className="text-[11px] font-bold font-mono text-right">
										${d.value.toFixed(1)}M
									</span>
									<span className="text-[10px] text-muted-foreground/50 w-8 text-right">
										{total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// ─── Incoming margin calls alert ──────────────────────────────────────────────
function IncomingMarginCallsCard() {
	const { data: marginCalls } = useMarginCalls();
	const { data: allocations } = useAuditTrail();
	const navigate = useNavigate();

	const respondedIds = new Set(
		(allocations ?? []).map((a) => a.payload?.marginCallId as string | undefined).filter(Boolean),
	);
	const pending = (marginCalls ?? []).filter((m) => {
		const callId = m.payload?.callId as string | undefined;
		const status = m.payload?.status as string | undefined;
		return status === "RoutePending" && !respondedIds.has(callId ?? "");
	});

	if (pending.length === 0) return null;

	return (
		<Card className="shadow-sm border-amber-500/30 bg-amber-500/5">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<AlertTriangleIcon className="size-4 text-amber-500" />
					<CardTitle className="text-sm font-bold text-amber-500">
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
					return (
						<div
							key={m.contractId}
							className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-background/50 px-3 py-2.5"
						>
							<div>
								<span className="font-mono text-[11px] text-muted-foreground">
									{callId ?? m.contractId.slice(0, 10)}
								</span>
								<div className="text-sm font-bold">
									${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M{" "}
									<span className="text-xs font-normal text-muted-foreground">{currency}</span>
								</div>
								<span className="text-[10px] text-muted-foreground">
									From: {counterparty?.split("::")[0] ?? "—"}
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

// ─── Welcome ──────────────────────────────────────────────────────────────────
function WelcomeCard({ userRole }: { userRole: string }) {
	const { data: holdings, isLoading: holdingsLoading } = useHoldings();
	const seedMutation = useSeedDemoData();
	const isEmpty = !holdingsLoading && holdings?.length === 0;

	const titles: Record<string, string> = {
		institution: "Institution Dashboard",
		counterparty: "Counterparty Terminal",
		operator: "Network Control Center",
	};

	const handleSeed = async () => {
		try {
			await seedMutation.mutateAsync(undefined);
			toast.success("Demo data initialized — POLICY-001 + 3 holdings created on Canton");
		} catch (err) {
			toast.error(`Setup failed: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
	};

	return (
		<div className="flex items-center justify-between">
			<div>
				<h2 className="text-xl font-bold tracking-tight">{titles[userRole] ?? "Dashboard"}</h2>
				<p className="text-muted-foreground/60 text-sm flex items-center gap-1.5 mt-0.5">
					<ShieldCheckIcon className="size-3 text-emerald-500" />
					Live from Canton ledger
				</p>
			</div>
			<div className="flex items-center gap-2">
				{userRole === "institution" && isEmpty && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleSeed}
						disabled={seedMutation.isPending}
						className="border-primary/30 text-primary hover:bg-primary/5"
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
				<Link to="/dashboard/holdings">
					<Button size="sm" variant="ghost" className="gap-1 text-muted-foreground">
						Holdings <ArrowRightIcon className="size-3" />
					</Button>
				</Link>
				<Link to="/dashboard/suggestions">
					<Button size="sm" variant="ghost" className="gap-1 text-muted-foreground">
						Suggestions <ArrowRightIcon className="size-3" />
					</Button>
				</Link>
			</div>
		</div>
	);
}

// ─── Views ────────────────────────────────────────────────────────────────────
function InstitutionView({
	totalHoldingsValue,
	pendingSuggestions,
	totalAllocations,
	isLoading,
}: any) {
	const holdingsSpark = [0.8, 1.2, 1.1, 1.4, 1.6, 1.5, totalHoldingsValue / 1_000_000 || 1.8];
	const routesSpark = [0, 0, 1, 2, 1, 3, pendingSuggestions || 2];

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 md:grid-cols-4">
				<MetricCard
					title="Available Collateral"
					value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
					trend={{ dir: totalHoldingsValue > 0 ? "up" : "neutral", label: "Live from Canton" }}
					sparkData={holdingsSpark}
					sparkColor="#22c55e"
					loading={isLoading}
				/>
				<MetricCard
					title="Actionable Routes"
					value={pendingSuggestions}
					trend={{
						dir: pendingSuggestions > 0 ? "up" : "neutral",
						label: pendingSuggestions > 0 ? "Approval Required" : "All Clear",
					}}
					sparkData={routesSpark}
					sparkColor="#f59e0b"
					badge={pendingSuggestions > 0 ? "Action" : undefined}
					badgeVariant={pendingSuggestions > 0 ? "destructive" : "secondary"}
					loading={isLoading}
				/>
				<MetricCard
					title="Deployed Value"
					value={totalAllocations}
					sub={`${totalAllocations} on-ledger`}
					trend={{ dir: totalAllocations > 0 ? "up" : "neutral", label: "allocations" }}
					sparkData={[0, 0, 0, 1, 1, 2, totalAllocations || 2]}
					sparkColor="#6366f1"
					loading={isLoading}
				/>
				<MetricCard
					title="Network Status"
					value="Online"
					sub="Canton ledger"
					badge="Live"
					badgeVariant="secondary"
					loading={isLoading}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
				<div className="flex flex-col gap-5">
					<IncomingMarginCallsCard />
					<HoldingsSummaryCard userRole="institution" />
					<AssetAllocationChart />
				</div>
				<div className="flex flex-col gap-5">
					<TransactionChart />
					<PendingSuggestionsCard userRole="institution" />
					<RecentAllocationsCard />
				</div>
			</div>
		</div>
	);
}

function CounterpartyView({
	totalHoldingsValue,
	pendingSuggestions,
	totalAllocations,
	isLoading,
}: any) {
	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 md:grid-cols-3">
				<MetricCard
					title="Network Exposure"
					value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
					sub="Locked collateral"
					sparkData={[0.5, 0.8, 1.2, 1.1, 1.4, 1.6, totalHoldingsValue / 1_000_000 || 1.5]}
					sparkColor="#22c55e"
					loading={isLoading}
				/>
				<MetricCard
					title="Active Margin Calls"
					value={pendingSuggestions}
					trend={{
						dir: pendingSuggestions > 0 ? "up" : "neutral",
						label: pendingSuggestions > 0 ? "Pending action" : "Fulfilled",
					}}
					badge={pendingSuggestions > 0 ? "Pending" : undefined}
					badgeVariant="destructive"
					loading={isLoading}
				/>
				<MetricCard
					title="Cumulative Fulfillments"
					value={totalAllocations}
					sub={`${totalAllocations} on-ledger`}
					sparkData={[0, 0, 1, 1, 2, 2, totalAllocations || 3]}
					sparkColor="#6366f1"
					loading={isLoading}
				/>
			</div>
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-5">
					<PendingSuggestionsCard userRole="counterparty" />
					<AssetAllocationChart />
				</div>
				<div className="flex flex-col gap-5">
					<TransactionChart />
					<RecentAllocationsCard />
				</div>
			</div>
		</div>
	);
}

function OperatorView({
	totalHoldingsValue,
	pendingSuggestions,
	totalAllocations,
	isLoading,
}: any) {
	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 md:grid-cols-4">
				<MetricCard
					title="Network Assets"
					value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
					trend={{ dir: totalHoldingsValue > 0 ? "up" : "neutral", label: "Live from Canton" }}
					sparkData={[0.5, 1.0, 1.5, 1.2, 1.8, 2.0, totalHoldingsValue / 1_000_000 || 2.2]}
					sparkColor="#22c55e"
					loading={isLoading}
				/>
				<MetricCard
					title="Suggestion Queue"
					value={pendingSuggestions}
					trend={{ dir: pendingSuggestions > 0 ? "up" : "neutral", label: "Observer active" }}
					sparkData={[0, 1, 0, 2, 1, 3, pendingSuggestions || 2]}
					sparkColor="#f59e0b"
					loading={isLoading}
				/>
				<MetricCard
					title="Executed Routes"
					value={totalAllocations}
					trend={{
						dir: totalAllocations > 0 ? "up" : "neutral",
						label: `${totalAllocations} allocations`,
					}}
					sparkData={[0, 0, 1, 2, 2, 3, totalAllocations || 3]}
					sparkColor="#6366f1"
					loading={isLoading}
				/>
				<MetricCard
					title="Network Health"
					value="100%"
					badge="All Systems"
					badgeVariant="secondary"
					loading={isLoading}
				/>
			</div>
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="flex flex-col gap-5">
					<HoldingsSummaryCard userRole="operator" />
					<AssetAllocationChart />
				</div>
				<div className="lg:col-span-2 flex flex-col gap-5">
					<TransactionChart />
					<RecentAllocationsCard />
				</div>
			</div>
		</div>
	);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function RouteComponent() {
	const { role } = useAuthRole();
	const { totalHoldingsValue, pendingSuggestions, totalAllocations, isLoading } = useStats();

	const viewProps = { totalHoldingsValue, pendingSuggestions, totalAllocations, isLoading };

	return (
		<div className="flex flex-col gap-6 pb-12">
			<WelcomeCard userRole={role} />
			<BookRiskBar
				totalValue={totalHoldingsValue}
				pendingCalls={pendingSuggestions}
				totalAllocations={totalAllocations}
				isLoading={isLoading}
			/>
			{role === "operator" && <OperatorView {...viewProps} />}
			{role === "counterparty" && <CounterpartyView {...viewProps} />}
			{role !== "operator" && role !== "counterparty" && <InstitutionView {...viewProps} />}
		</div>
	);
}
