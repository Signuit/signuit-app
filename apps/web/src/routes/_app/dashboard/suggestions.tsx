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
import { cn } from "@nexus/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, FileTextIcon, HistoryIcon, InfoIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuthRole } from "@/hooks/use-auth";
import {
	useApproveSuggestion,
	useRejectSuggestion,
	useSuggestions,
} from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/suggestions")({
	component: RouteComponent,
});

function RouteComponent() {
	const { role } = useAuthRole();
	const { data: suggestions, isLoading, error } = useSuggestions();
	const approveMutation = useApproveSuggestion();
	const rejectMutation = useRejectSuggestion();

	const handleApprove = async (cid: string) => {
		try {
			await approveMutation.mutateAsync({ suggestionCid: cid });
			toast.success("Suggestion approved successfully");
		} catch (err) {
			toast.error(`Approval failed: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
	};

	const handleReject = async (cid: string) => {
		try {
			await rejectMutation.mutateAsync({ suggestionCid: cid });
			toast.success("Suggestion rejected");
		} catch (err) {
			toast.error(`Rejection failed: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
	};

	const title =
		role === "institution"
			? "Routing Suggestions"
			: role === "counterparty"
				? "Margin Calls"
				: "Network Suggestions";
	const description =
		role === "institution"
			? "Manage pending collateral routing recommendations"
			: role === "counterparty"
				? "Monitor status of issued margin calls"
				: "Observe system-wide collateral routing activity";

	return (
		<div className="flex flex-col gap-6 pb-12">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
						<FileTextIcon className="text-muted-foreground size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
						<p className="text-muted-foreground text-sm">{description}</p>
					</div>
				</div>
			</div>

			<Card className="shadow-sm">
				<CardHeader className="pb-3 text-sm">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{role === "institution" ? "Pending Approvals" : "Active Ledger Records"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex h-64 flex-col items-center justify-center gap-4">
							<div className="size-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
							<p className="text-muted-foreground text-sm font-medium animate-pulse">
								Syncing with Canton...
							</p>
						</div>
					) : error ? (
						<div className="text-center py-12 bg-destructive/5 rounded-lg border border-destructive/10">
							<p className="text-destructive font-medium">Failed to load ledger: {error.message}</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-muted/50">
									<TableHead className="text-[10px] font-bold uppercase py-2">Route ID</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">
										Margin Call
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">
										Allocation Plan
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
										Cost (bps)
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
										Status
									</TableHead>
									{role === "institution" && (
										<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
											Decision
										</TableHead>
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{suggestions?.map((s) => {
									const routeId = s.payload.routeId as string | undefined;
									const marginCallId = s.payload.marginCallId as string | undefined;
									const amountRequired = s.payload.amountRequired as string | undefined;
									const suggestedAssets = (s.payload.suggestedAssets as string[] | undefined) ?? [];
									const suggestedAmounts = (s.payload.suggestedAmounts as string[] | undefined) ?? [];
									const opportunityCostBps = s.payload.opportunityCostBps as string | undefined;
									const status = s.payload.status as string | undefined;
									return (
									<TableRow
										key={s.contractId}
										className="group border-muted/30 hover:bg-muted/10 transition-colors"
									>
										<TableCell className="font-mono text-[10px] text-muted-foreground">
											{routeId ?? s.contractId.slice(0, 8)}
										</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span className="font-semibold text-sm">{marginCallId ?? "—"}</span>
												<span className="text-[11px] font-medium text-primary">
													${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M
												</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1.5">
												{suggestedAssets.length > 0
													? suggestedAssets.map((asset: string, i: number) => (
															<Badge
																key={i}
																variant="outline"
																className="text-[10px] h-5 font-medium border-muted-foreground/20"
															>
																{asset}{" "}
																<span className="ml-1 opacity-60">
																	(${(parseFloat(suggestedAmounts[i] || "0") / 1_000_000).toFixed(1)}
																	M)
																</span>
															</Badge>
														))
													: <span className="text-muted-foreground">—</span>}
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex flex-col items-end">
												<span className="font-semibold text-sm">
													{parseFloat(opportunityCostBps || "0").toFixed(1)}
												</span>
												<span className="text-[9px] font-medium text-muted-foreground uppercase">
													Bps
												</span>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<Badge
												variant="secondary"
												className={cn(
													"border-transparent font-semibold text-[10px] px-2 py-0",
													status === "RoutePending"
														? "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
														: status === "RouteApproved"
															? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
															: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
												)}
											>
												{status ?? "—"}
											</Badge>
										</TableCell>
										{role === "institution" && (
											<TableCell className="text-right">
												{status === "RoutePending" && (
													<div className="flex justify-end gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
															onClick={() => handleReject(s.contractId)}
														>
															<XIcon className="size-4 mr-1" />
															Reject
														</Button>
														<Button
															variant="default"
															size="sm"
															className="h-7 px-3 text-[11px] font-semibold"
															onClick={() => handleApprove(s.contractId)}
														>
															<CheckIcon className="size-4 mr-1" />
															Approve
														</Button>
													</div>
												)}
												{status !== "RoutePending" && (
													<span className="text-[10px] font-medium text-muted-foreground italic uppercase">
														Processed
													</span>
												)}
											</TableCell>
										)}
									</TableRow>
									);
								})}
								{suggestions?.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={role === "institution" ? 6 : 5}
											className="h-48 text-center"
										>
											<div className="flex flex-col items-center gap-3 text-muted-foreground">
												<HistoryIcon className="size-8 opacity-20" />
												<p className="font-medium text-sm">No suggestions found</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Card className="bg-muted/5 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
							<InfoIcon className="size-3" />
							Day 1 MVP Protocol
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
							In Day 1 MVP, all routing suggestions created by the CTD engine are stored as
							"Pending" contracts. Human approval is strictly required before any collateral is
							moved or records are finalized.
						</p>
					</CardContent>
				</Card>
				<Card className="bg-muted/5 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
							<HistoryIcon className="size-3" />
							Auto-Approval Roadmap
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
							Phase 2 will allow policies to enable `autoApprove: true`. In this mode, the CTD
							engine will automatically approve and execute suggestions that meet all policy
							constraints without human intervention.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
