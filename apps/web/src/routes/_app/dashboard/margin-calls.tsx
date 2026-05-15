import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { Input } from "@nexus/ui/components/input";
import { Label } from "@nexus/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@nexus/ui/components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@nexus/ui/components/table";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangleIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuditTrail, useCreateMarginCall, useMarginCalls } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/margin-calls")({
	component: RouteComponent,
});

const STATUS_STYLES: Record<string, string> = {
	RoutePending: "bg-muted text-muted-foreground border-transparent",
	RouteExecuted: "bg-primary/10 text-primary border-transparent",
	RouteFailed: "bg-destructive/10 text-destructive border-transparent",
};

function RouteComponent() {
	const { data: marginCalls, isLoading, error } = useMarginCalls();
	const { data: allocations } = useAuditTrail();
	const createMutation = useCreateMarginCall();
	const navigate = useNavigate();

	// Build a set of margin call IDs that have been responded to (AllocationRecord exists)
	const respondedCallIds = new Set(
		(allocations ?? []).map((a) => a.payload?.marginCallId as string | undefined).filter(Boolean),
	);

	// A margin call is "responded" if an AllocationRecord references its callId
	const isResponded = (callId: string | undefined) =>
		callId ? respondedCallIds.has(callId) : false;

	const [amount, setAmount] = useState("15000000");
	const [currency, setCurrency] = useState("USD");
	const [dueInHours, setDueInHours] = useState("2");
	const [showForm, setShowForm] = useState(false);

	// Split: pending = not yet responded, fulfilled = responded or closed on-chain
	const pending = (marginCalls ?? []).filter((m) => {
		const callId = m.payload?.callId as string | undefined;
		const status = m.payload?.status as string | undefined;
		return status === "RoutePending" && !isResponded(callId);
	});
	const fulfilled = (marginCalls ?? []).filter((m) => {
		const callId = m.payload?.callId as string | undefined;
		const status = m.payload?.status as string | undefined;
		return status !== "RoutePending" || isResponded(callId);
	});

	const handleIssue = async () => {
		const amt = parseFloat(amount);
		if (!amt || amt <= 0) {
			toast.error("Enter a valid amount");
			return;
		}
		try {
			await createMutation.mutateAsync({
				amountRequired: amt,
				currency,
				institutionName: "VantageCapital",
				dueInHours: parseInt(dueInHours, 10) || 2,
			});
			toast.success("Margin call issued to VantageCapital");
			setShowForm(false);
			setAmount("15000000");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to issue margin call");
		}
	};

	return (
		<div className="flex flex-col gap-6 pb-12">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
						<AlertTriangleIcon className="text-muted-foreground size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Margin Calls</h1>
						<p className="text-muted-foreground text-sm">
							Issue and track collateral margin calls to institutions
						</p>
					</div>
				</div>
				<Button size="sm" className="gap-2" onClick={() => setShowForm((v) => !v)}>
					<PlusIcon className="size-4" />
					{showForm ? "Cancel" : "New Margin Call"}
				</Button>
			</div>

			{/* Issue Form */}
			{showForm && (
				<Card className="border-border bg-muted/30 shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-semibold">
							Issue Margin Call → VantageCapital
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-3">
							<div className="space-y-1.5">
								<Label className="text-xs font-medium">Amount Required</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
										$
									</span>
									<Input
										type="number"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="pl-7 h-9 text-sm"
										placeholder="15000000"
									/>
								</div>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs font-medium">Currency</Label>
								<Select value={currency} onValueChange={setCurrency}>
									<SelectTrigger className="h-9 text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="USD">USD</SelectItem>
										<SelectItem value="EUR">EUR</SelectItem>
										<SelectItem value="GBP">GBP</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs font-medium">Due In (hours)</Label>
								<Select value={dueInHours} onValueChange={setDueInHours}>
									<SelectTrigger className="h-9 text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">1 hour</SelectItem>
										<SelectItem value="2">2 hours</SelectItem>
										<SelectItem value="4">4 hours</SelectItem>
										<SelectItem value="8">8 hours</SelectItem>
										<SelectItem value="24">24 hours</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
							<p className="text-[11px] text-muted-foreground">
								To: <span className="font-semibold text-foreground">VantageCapital</span> · Canton
								ledger contract
							</p>
							<Button
								size="sm"
								className="bg-primary hover:bg-primary/90 text-primary-foreground"
								disabled={createMutation.isPending || !amount}
								onClick={handleIssue}
							>
								{createMutation.isPending ? "Issuing..." : "Issue Call"}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Pending Calls */}
			<Card className="shadow-sm">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Pending ({pending.length})
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="flex h-40 items-center justify-center">
							<div className="size-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
						</div>
					) : error ? (
						<div className="text-center py-8 text-destructive text-sm">{error.message}</div>
					) : pending.length === 0 ? (
						<div className="flex flex-col items-center py-12 text-muted-foreground/40 italic text-sm">
							<AlertTriangleIcon className="size-8 mb-2 opacity-20" />
							No pending margin calls
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-muted/50">
									<TableHead className="text-[10px] font-bold uppercase py-2 pl-6">
										Call ID
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">
										Institution
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
										Amount
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
										Due By
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
										Status
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right pr-6">
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pending.map((m) => {
									const callId = m.payload?.callId as string | undefined;
									const institution = m.payload?.institution as string | undefined;
									const amountRequired = m.payload?.amountRequired as string | undefined;
									const cur = m.payload?.currency as string | undefined;
									const dueBy = m.payload?.dueBy as string | undefined;
									const status = m.payload?.status as string | undefined;
									return (
										<TableRow key={m.contractId} className="border-muted/30">
											<TableCell className="font-mono text-xs text-muted-foreground pl-6">
												{callId ?? m.contractId.slice(0, 8)}
											</TableCell>
											<TableCell className="text-sm font-medium">
												{institution?.split("::")[0] ?? "—"}
											</TableCell>
											<TableCell className="text-sm font-semibold text-right">
												${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M{" "}
												<span className="text-muted-foreground text-[10px]">{cur}</span>
											</TableCell>
											<TableCell className="text-xs text-muted-foreground text-right">
												{dueBy
													? new Date(dueBy).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})
													: "—"}
											</TableCell>
											<TableCell className="text-right pr-6">
												<Badge
													variant="secondary"
													className={STATUS_STYLES[status ?? ""] ?? "border-transparent"}
												>
													{status ?? "—"}
												</Badge>
											</TableCell>
											<TableCell className="text-right pr-6">
												<Button
													size="sm"
													variant="outline"
													className="h-7 text-xs gap-1"
													onClick={() =>
														navigate({
															to: "/dashboard/generate",
															search: {
																marginCallId: callId ?? "",
																amount: amountRequired ?? "15000000",
																counterparty: "PrimeBank",
															},
														})
													}
												>
													Respond
													<ArrowRightIcon className="size-3" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Fulfilled Calls */}
			{fulfilled.length > 0 && (
				<Card className="shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Fulfilled / Closed ({fulfilled.length})
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-muted/50">
									<TableHead className="text-[10px] font-bold uppercase py-2 pl-6">
										Call ID
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right">
										Amount
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2 text-right pr-6">
										Status
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{fulfilled.map((m) => {
									const callId = m.payload?.callId as string | undefined;
									const amountRequired = m.payload?.amountRequired as string | undefined;
									const status = m.payload?.status as string | undefined;
									const responded = isResponded(callId);
									return (
										<TableRow key={m.contractId} className="border-muted/30 opacity-70">
											<TableCell className="font-mono text-xs text-muted-foreground pl-6">
												{callId ?? m.contractId.slice(0, 8)}
											</TableCell>
											<TableCell className="text-sm font-semibold text-right">
												${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M
											</TableCell>
											<TableCell className="text-right pr-6">
												<Badge
													variant="secondary"
													className={
														responded
															? "bg-primary/10 text-primary border-transparent"
															: (STATUS_STYLES[status ?? ""] ?? "border-transparent")
													}
												>
													{responded ? "Responded" : (status ?? "—")}
												</Badge>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
