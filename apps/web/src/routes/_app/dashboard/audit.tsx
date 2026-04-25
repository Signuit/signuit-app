import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@nexus/ui/components/table";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon, HistoryIcon, ShieldCheckIcon } from "lucide-react";
import { useAuthRole } from "@/hooks/use-auth";
import { useAuditTrail } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/audit")({
	component: RouteComponent,
});

function RouteComponent() {
	const { role } = useAuthRole();
	const { data: audit, isLoading, error } = useAuditTrail();

	const title = role === "operator" ? "Network Audit" : "Audit Trail";
	const description =
		role === "operator"
			? "Comprehensive view of all multi-party collateral movements on Canton"
			: "Immutable records of your collateral allocations on Canton Network";

	return (
		<div className="flex flex-col gap-6 pb-12">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
						<ShieldCheckIcon className="text-muted-foreground size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
						<p className="text-muted-foreground text-sm">{description}</p>
					</div>
				</div>
				<Button variant="outline" size="sm" className="gap-2">
					<DownloadIcon className="size-4" />
					Export Ledger
				</Button>
			</div>

			<Card className="shadow-sm overflow-hidden">
				<CardHeader className="pb-3 text-sm">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Canton Ledger Records
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="flex h-64 flex-col items-center justify-center gap-4">
							<div className="size-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
							<p className="text-muted-foreground text-sm font-medium animate-pulse">
								Scanning ledger nodes...
							</p>
						</div>
					) : error ? (
						<div className="text-center py-12 text-destructive bg-destructive/5 m-4 rounded-lg">
							<p className="font-medium text-sm">Sync Error: {error.message}</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent border-muted/50">
										<TableHead className="text-[10px] font-bold uppercase py-2 pl-6">
											Timestamp
										</TableHead>
										<TableHead className="text-[10px] font-bold uppercase py-2">ID</TableHead>
										<TableHead className="text-[10px] font-bold uppercase py-2">
											Allocation Plan
										</TableHead>
										<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
											Net Amount
										</TableHead>
										<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
											Eff. Cost
										</TableHead>
										<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
											Approver
										</TableHead>
										<TableHead className="text-[10px] font-bold uppercase py-2 pr-6 text-right">
											Contract
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{audit?.map((a) => (
										<TableRow
											key={a.contractId}
											className="border-muted/30 hover:bg-muted/10 transition-colors"
										>
											<TableCell className="text-[11px] font-medium text-muted-foreground/80 pl-6">
												{new Date(a.payload.executedAt).toLocaleDateString()}
												<br />
												<span className="opacity-50 font-mono text-[9px]">
													{new Date(a.payload.executedAt).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</TableCell>
											<TableCell className="font-semibold text-xs text-muted-foreground">
												{a.payload.routeId}
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{a.payload.assetsSent.map((asset: string, i: number) => (
														<Badge
															key={i}
															variant="outline"
															className="text-[10px] font-medium py-0 px-1.5 border-muted-foreground/20"
														>
															{asset}
														</Badge>
													))}
												</div>
											</TableCell>
											<TableCell className="font-semibold text-sm text-right">
												$
												{(
													a.payload.amountsSent.reduce(
														(sum: number, amt: string) => sum + parseFloat(amt),
														0,
													) / 1_000_000
												).toFixed(1)}
												M
											</TableCell>
											<TableCell className="text-right">
												<span className="font-semibold text-sm">
													{parseFloat(a.payload.opportunityCostBps).toFixed(1)}
												</span>
												<span className="text-[9px] font-bold text-muted-foreground ml-1">Bps</span>
											</TableCell>
											<TableCell className="text-right">
												<Badge
													variant="secondary"
													className="text-[10px] font-medium bg-green-500/5 text-green-700 dark:text-green-400 border-transparent"
												>
													{a.payload.approvedBy.split("::")[0]}
												</Badge>
											</TableCell>
											<TableCell className="pr-6 text-right">
												<span className="font-mono text-[9px] text-muted-foreground opacity-50">
													{a.contractId.slice(-8)}
												</span>
											</TableCell>
										</TableRow>
									))}
									{(!audit || audit.length === 0) && (
										<TableRow>
											<TableCell
												colSpan={7}
												className="h-64 text-center text-muted-foreground italic py-12"
											>
												<div className="flex flex-col items-center gap-3">
													<HistoryIcon className="size-8 opacity-20" />
													<p className="font-medium text-sm">No ledger activity detected</p>
												</div>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
