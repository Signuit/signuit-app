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
import { useAuditTrail } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/audit")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: audit, isLoading, error } = useAuditTrail();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center">
						<ShieldCheckIcon className="text-green-600 size-5" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">Audit Trail</h1>
						<p className="text-sm text-muted-foreground">
							Immutable records of collateral allocations on Canton Network
						</p>
					</div>
				</div>
				<Button variant="outline" className="gap-2">
					<DownloadIcon className="size-4" />
					Export CSV
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Canton Ledger History</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex h-32 items-center justify-center">
							<p className="text-muted-foreground animate-pulse">Loading ledger records...</p>
						</div>
					) : error ? (
						<div className="text-center py-8 text-destructive">
							<p>Error loading audit trail: {error.message}</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Route ID</TableHead>
									<TableHead>Assets Allocated</TableHead>
									<TableHead>Total Amount</TableHead>
									<TableHead>Cost (bps)</TableHead>
									<TableHead>Approved By</TableHead>
									<TableHead>Canton ID</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{audit?.map((a) => (
									<TableRow key={a.contractId}>
										<TableCell className="text-xs text-muted-foreground">
											{new Date(a.payload.executedAt).toLocaleString()}
										</TableCell>
										<TableCell className="font-bold">{a.payload.routeId}</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{a.payload.assetsSent.map((asset: string, i: number) => (
													<Badge key={i} variant="secondary">
														{asset}
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell className="font-medium">
											$
											{a.payload.amountsSent
												.reduce((sum: number, amt: string) => sum + parseFloat(amt), 0)
												.toLocaleString()}
										</TableCell>
										<TableCell>{parseFloat(a.payload.opportunityCostBps).toFixed(2)}</TableCell>
										<TableCell>
											<Badge variant="outline" className="bg-green-500/5 text-green-700">
												{a.payload.approvedBy.split("::")[0]}
											</Badge>
										</TableCell>
										<TableCell className="font-mono text-[10px] text-muted-foreground max-w-[100px] truncate">
											{a.contractId}
										</TableCell>
									</TableRow>
								))}
								{audit?.length === 0 && (
									<TableRow>
										<TableCell colSpan={7} className="h-32 text-center">
											<div className="flex flex-col items-center gap-2 text-muted-foreground">
												<HistoryIcon className="size-8 opacity-20" />
												<p>No allocation records found yet.</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
