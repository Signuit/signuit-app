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
import { CheckIcon, FileTextIcon, HistoryIcon, InfoIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import {
	useApproveSuggestion,
	useRejectSuggestion,
	useSuggestions,
} from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/suggestions")({
	component: RouteComponent,
});

function RouteComponent() {
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

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
						<FileTextIcon className="text-primary size-5" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">Routing Suggestions</h1>
						<p className="text-sm text-muted-foreground">
							Manage pending collateral routing recommendations
						</p>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Pending Approvals</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex h-32 items-center justify-center">
							<p className="text-muted-foreground animate-pulse">Fetching suggestions...</p>
						</div>
					) : error ? (
						<div className="text-center py-8 text-destructive">
							<p>Error loading suggestions: {error.message}</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Route ID</TableHead>
									<TableHead>Margin Call</TableHead>
									<TableHead>Suggested Assets</TableHead>
									<TableHead>Cost (bps)</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{suggestions?.map((s) => (
									<TableRow key={s.contractId}>
										<TableCell className="font-mono text-xs">{s.payload.routeId}</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span className="font-medium">{s.payload.marginCallId}</span>
												<span className="text-xs text-muted-foreground">
													${parseFloat(s.payload.amountRequired).toLocaleString()}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{s.payload.suggestedAssets.map((asset: string, i: number) => (
													<Badge key={i} variant="outline" className="bg-primary/5">
														{asset} (${parseFloat(s.payload.suggestedAmounts[i]).toLocaleString()})
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell>
											<span className="font-medium">
												{parseFloat(s.payload.opportunityCostBps).toFixed(2)}
											</span>
										</TableCell>
										<TableCell>
											<Badge
												variant={s.payload.status === "Pending" ? "secondary" : "default"}
												className={
													s.payload.status === "Pending"
														? "bg-yellow-500/10 text-yellow-600 border-yellow-200"
														: s.payload.status === "Approved"
															? "bg-green-500/10 text-green-600 border-green-200"
															: "bg-red-500/10 text-red-600 border-red-200"
												}
											>
												{s.payload.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											{s.payload.status === "Pending" && (
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="sm"
														className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
														onClick={() => handleReject(s.contractId)}
													>
														<XIcon className="size-4" />
													</Button>
													<Button
														variant="default"
														size="sm"
														className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
														onClick={() => handleApprove(s.contractId)}
													>
														<CheckIcon className="size-4" />
													</Button>
												</div>
											)}
											{s.payload.status !== "Pending" && (
												<Button variant="ghost" size="sm" disabled>
													Processed
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
								{suggestions?.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} className="h-32 text-center">
											<div className="flex flex-col items-center gap-2 text-muted-foreground">
												<HistoryIcon className="size-8 opacity-20" />
												<p>
													No suggestions found. Use the "Generate Suggestion" tool to create one.
												</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card className="bg-primary/5 border-primary/10">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm flex items-center gap-2 text-primary">
							<InfoIcon className="size-4" />
							Day 1 MVP Protocol
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							In Day 1 MVP, all routing suggestions created by the CTD engine are stored as
							"Pending" contracts. Human approval is strictly required before any collateral is
							moved or records are finalized.
						</p>
					</CardContent>
				</Card>
				<Card className="bg-secondary/5 border-secondary/10">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm flex items-center gap-2 text-secondary-foreground">
							<HistoryIcon className="size-4" />
							Auto-Approval Roadmap
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
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
