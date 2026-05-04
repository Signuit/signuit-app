import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { Input } from "@nexus/ui/components/input";
import { Label } from "@nexus/ui/components/label";
import { Progress } from "@nexus/ui/components/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@nexus/ui/components/select";
import { Separator } from "@nexus/ui/components/separator";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	CheckCircleIcon,
	CheckIcon,
	ChevronRightIcon,
	InfoIcon,
	LightbulbIcon,
	ShieldAlertIcon,
	ZapIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	useApproveSuggestion,
	useGenerateSuggestion,
	useHoldings,
	usePolicies,
} from "@/hooks/use-collateral-api";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/dashboard/generate")({
	validateSearch: (search: Record<string, unknown>) => ({
		marginCallId: typeof search.marginCallId === "string" ? search.marginCallId : undefined,
		amount: typeof search.amount === "string" ? search.amount : undefined,
		counterparty: typeof search.counterparty === "string" ? search.counterparty : undefined,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { marginCallId: prefilledMcId, amount: prefilledAmount, counterparty: prefilledCounterparty } = Route.useSearch();
	const [step, setStep] = useState(1);

	// Form State — pre-filled from URL params when coming from "Respond" button
	const [marginCallId, setMarginCallId] = useState(
		prefilledMcId ?? `MC-${Math.floor(Math.random() * 9000) + 1000}`,
	);
	const [amountRequired, setAmountRequired] = useState(
		prefilledAmount ? parseFloat(prefilledAmount) : 15000000,
	);
	const [durationDays, setDurationDays] = useState(30);
	const [counterpartyName, setCounterpartyName] = useState(prefilledCounterparty ?? "PrimeBank");
	const [policyId, setPolicyId] = useState("");

	// Result State
	const [suggestionResult, setSuggestionResult] = useState<any>(null);
	const [loadingProgress, setLoadingProgress] = useState(0);

	const { data: policies } = usePolicies();
	const { data: holdings } = useHoldings();
	const generateMutation = useGenerateSuggestion();
	const approveMutation = useApproveSuggestion();

	const handleGenerate = async () => {
		if (!policyId) {
			toast.error("Please select a policy first");
			return;
		}

		setStep(2);
		setLoadingProgress(0);

		// Simulate calculation progress
		const interval = setInterval(() => {
			setLoadingProgress((prev) => {
				if (prev >= 95) {
					clearInterval(interval);
					return 95;
				}
				return prev + 5;
			});
		}, 150);

		try {
			// Real API call — creates RoutingSuggestion on Canton
			const result = await generateMutation.mutateAsync({
				marginCallId,
				amountRequired,
				policyId,
				durationDays,
				counterpartyName,
			});

			clearInterval(interval);
			setLoadingProgress(100);

			// Re-fetch suggestions from ACS to get the real contractId.
			// The create() response only contains the transaction ID (updateId),
			// not the actual contract ID needed for ApproveSuggestion exercise.
			const routeId = result.payload?.routeId as string | undefined;
			let resolvedResult = result;
			if (routeId) {
				try {
					const fresh = await queryClient.fetchQuery(
					orpc.collateral.listSuggestions.queryOptions({ input: { limit: 100 } }),
				);
				// Only match contracts that have a routeId string — this guards against
				// MarginCall or other non-RoutingSuggestion contracts that may appear
				// in the ACS if the template filter is not strictly enforced.
				const match = fresh?.find(
					(s) =>
						typeof (s.payload?.routeId as unknown) === "string" &&
						(s.payload?.routeId as string) === routeId,
				);
				if (match) resolvedResult = match;
				} catch {
					// Fallback to original result if re-fetch fails
				}
			}

			// Small delay for effect
			setTimeout(() => {
				setSuggestionResult(resolvedResult);
				setStep(3);
			}, 500);
		} catch (error) {
			clearInterval(interval);
			toast.error(
				`Calculation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
			setStep(1);
		}
	};

	return (
		<div className="mx-auto max-w-2xl flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<ZapIcon className="text-primary size-8" />
					Generate Routing Suggestion
				</h1>
				<p className="text-muted-foreground">
					{prefilledMcId
						? "Responding to an incoming margin call — fields pre-filled from the ledger."
						: "Simulate a margin call and let the SignUIT engine compute the optimal collateral route."}
				</p>
			</div>

			{/* Pre-fill banner */}
			{prefilledMcId && step === 1 && (
				<div className="flex items-center gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-3">
					<div className="size-2 rounded-full bg-orange-500 shrink-0" />
					<p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
						Responding to margin call{" "}
						<span className="font-mono">{prefilledMcId}</span>
						{prefilledAmount && ` · $${(parseFloat(prefilledAmount) / 1_000_000).toFixed(1)}M from ${prefilledCounterparty ?? "counterparty"}`}
					</p>
				</div>
			)}

			{/* Step Indicator */}
			<div className="flex items-center justify-between px-4">
				{[1, 2, 3, 4].map((s) => (
					<div key={s} className="flex items-center">
						<div
							className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${
								step === s
									? "bg-primary text-primary-foreground shadow-lg scale-110"
									: step > s
										? "bg-green-500 text-white"
										: "bg-muted text-muted-foreground"
							} transition-all duration-300`}
						>
							{step > s ? <CheckIcon className="size-4" /> : s}
						</div>
						{s < 4 && (
							<div
								className={`h-1 w-12 md:w-24 mx-2 rounded-full ${
									step > s ? "bg-green-500" : "bg-muted"
								} transition-all duration-500`}
							/>
						)}
					</div>
				))}
			</div>

			{/* Step 1: Input Form */}
			{step === 1 && (
				<Card className="border-2 border-primary/20 shadow-xl">
					<CardHeader>
						<CardTitle>Step 1: Margin Call Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="marginCallId">Margin Call ID</Label>
								<Input
									id="marginCallId"
									value={marginCallId}
									onChange={(e) => setMarginCallId(e.target.value)}
									placeholder="MC-4821"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="counterparty">Counterparty</Label>
								<Select value={counterpartyName} onValueChange={setCounterpartyName}>
									<SelectTrigger id="counterparty">
										<SelectValue placeholder="Select counterparty" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PrimeBank">PrimeBank</SelectItem>
										<SelectItem value="GlobalInvest">GlobalInvest</SelectItem>
										<SelectItem value="DexCapital">DexCapital</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount">Amount Required (USD)</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
									$
								</span>
								<Input
									id="amount"
									type="number"
									className="pl-7 text-lg font-bold"
									value={amountRequired}
									onChange={(e) => setAmountRequired(Number(e.target.value))}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="duration">Duration (Days)</Label>
								<Input
									id="duration"
									type="number"
									value={durationDays}
									onChange={(e) => setDurationDays(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="policy">CTD Policy</Label>
								<Select value={policyId} onValueChange={setPolicyId}>
									<SelectTrigger id="policy">
										<SelectValue placeholder="Select active policy" />
									</SelectTrigger>
									<SelectContent>
										{policies?.map((p) => (
											<SelectItem key={p.contractId} value={p.payload.policyId}>
												{p.payload.policyId} ({p.payload.ruleType})
											</SelectItem>
										))}
										{policies?.length === 0 && (
											<SelectItem value="none" disabled>
												No policies found
											</SelectItem>
										)}
									</SelectContent>
								</Select>
							</div>
						</div>

						<Button className="w-full h-12 text-lg" onClick={handleGenerate} disabled={!policyId}>
							Generate Best Route
							<ChevronRightIcon className="ml-2" />
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Step 2: Calculation Animation */}
			{step === 2 && (
				<Card className="py-12 flex flex-col items-center justify-center text-center gap-8 shadow-2xl">
					<div className="relative">
						<div className="size-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
						<ZapIcon className="size-12 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
					</div>
					<div className="space-y-4 w-full max-w-md px-8">
						<h3 className="text-2xl font-bold animate-pulse">Computing Optimal Route...</h3>
						<div className="space-y-2">
							<Progress value={loadingProgress} className="h-2" />
							<p className="text-sm text-muted-foreground">
								{loadingProgress < 30 && "Fetching holdings from Canton..."}
								{loadingProgress >= 30 && loadingProgress < 60 && "Analyzing counterparty rules..."}
								{loadingProgress >= 60 && loadingProgress < 90 && "Computing opportunity cost..."}
								{loadingProgress >= 90 && "Finalizing RoutingSuggestion contract..."}
							</p>
						</div>

						<div className="grid grid-cols-1 gap-2 text-left bg-muted/50 p-4 rounded-lg">
							{holdings && holdings.length > 0 ? (
								holdings.map((h) => (
									<div key={h.contractId} className="flex items-center gap-2 text-xs">
										<div className="size-2 rounded-full bg-green-500" />
										<span>
											{h.payload.asset}: ${(parseFloat(h.payload.amount) / 1_000_000).toFixed(1)}M
											(Available)
										</span>
									</div>
								))
							) : (
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<div className="size-2 rounded-full bg-primary animate-pulse" />
									<span>Loading holdings from Canton...</span>
								</div>
							)}
						</div>
					</div>
				</Card>
			)}

			{/* Step 3: Recommendation Result */}
			{step === 3 &&
				suggestionResult &&
				(() => {
					const assets: string[] =
						(suggestionResult.payload?.suggestedAssets as string[] | undefined) ?? [];
					const amounts: string[] =
						(suggestionResult.payload?.suggestedAmounts as string[] | undefined) ?? [];
					const oppCost = parseFloat(
						(suggestionResult.payload?.estimatedOpportunityCost as string | undefined) ?? "0",
					);
					const oppBps = parseFloat(
						(suggestionResult.payload?.opportunityCostBps as string | undefined) ?? "0",
					);
					const hasStablecoin = assets.some((a) => ["USDC", "USDT"].includes(a));
					const isMultiAsset = assets.length > 1;

					const reasons = [
						{
							title: isMultiAsset ? "Multi-Asset Optimisation" : "Optimal Single-Asset Selection",
							body: isMultiAsset
								? `The engine combined ${assets.join(" + ")} to cover the full margin call while minimising yield sacrifice across your portfolio.`
								: `${assets[0]} alone satisfies the full requirement — no unnecessary fragmentation of positions.`,
						},
						{
							title: hasStablecoin ? "Stablecoin-First Strategy" : "Yield-Ranked Selection",
							body: hasStablecoin
								? `${assets.filter((a) => ["USDC", "USDT"].includes(a)).join(", ")} has 0% APY — sending it costs nothing in yield. Your high-yield positions remain untouched.`
								: `Assets are ranked by opportunity cost. Lower-yield holdings are consumed first, preserving high-yield positions as long as possible.`,
						},
						{
							title:
								oppCost < 1
									? "Near-Zero Opportunity Cost"
									: `${oppBps.toFixed(1)} bps Saved vs Baseline`,
							body:
								oppCost < 1
									? "The selected route has essentially zero yield sacrifice — this is the theoretical optimum for this portfolio."
									: `Compared to sending your highest-yield asset (USYC) in full, this route saves $${(oppCost > 0 ? oppCost : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} in annual yield opportunity cost.`,
						},
					];

					return (
						<Card className="border-2 border-green-500 shadow-2xl overflow-hidden">
							<div className="bg-green-500 px-6 py-4 flex items-center justify-between text-white">
								<div className="flex items-center gap-2">
									<LightbulbIcon className="size-6" />
									<h3 className="text-xl font-bold">Cheapest-to-Deliver Found</h3>
								</div>
								<Badge variant="secondary" className="bg-white/20 text-white border-none">
									Success
								</Badge>
							</div>

							<CardContent className="p-8 space-y-8">
								<div className="flex flex-col items-center gap-4 py-4">
									<span className="text-sm uppercase tracking-widest text-muted-foreground font-bold">
										Recommended Assets
									</span>
									<div className="flex flex-wrap justify-center gap-4">
										{assets.map((asset, i) => (
											<div
												key={asset}
												className="flex flex-col items-center p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm"
											>
												<span className="text-4xl font-black text-primary">{asset}</span>
												<span className="text-sm text-muted-foreground">
													${parseFloat(amounts[i] ?? "0").toLocaleString()}
												</span>
											</div>
										))}
									</div>
								</div>

								<Separator />

								<div className="space-y-4">
									<h4 className="font-bold text-lg flex items-center gap-2">
										<ShieldAlertIcon className="text-yellow-500 size-5" />
										Why this route?
									</h4>
									<div className="grid gap-3">
										{reasons.map((r) => (
											<div
												key={r.title}
												className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg"
											>
												<CheckCircleIcon className="text-green-500 size-5 mt-0.5 shrink-0" />
												<p className="text-sm">
													<span className="font-bold">{r.title}:</span> {r.body}
												</p>
											</div>
										))}
									</div>
								</div>

								<div className="bg-primary/10 rounded-xl p-6 flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Total Opportunity Cost</p>
										<p className="text-3xl font-black text-primary">${oppCost.toFixed(2)}</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-muted-foreground">Cost in Basis Points</p>
										<p className="text-xl font-bold">{oppBps.toFixed(2)} bps</p>
									</div>
								</div>

								<div className="flex gap-4">
									<Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
										Back
									</Button>
									<Button className="flex-1 h-12" onClick={() => setStep(4)}>
										Continue to Review
										<ChevronRightIcon className="ml-2" />
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})()}

			{/* Step 4: Final Review & Approval */}
			{step === 4 && (
				<Card className="border-2 border-primary shadow-2xl overflow-hidden">
					<CardHeader className="bg-muted pb-8 pt-8">
						<div className="flex flex-col items-center text-center gap-4">
							<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
								<ShieldAlertIcon className="size-8 text-primary" />
							</div>
							<div className="space-y-1">
								<CardTitle className="text-2xl font-bold">Canton Contract Approval</CardTitle>
								<p className="text-muted-foreground max-w-md">
									Final check before committing this routing suggestion to the ledger.
								</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-8 space-y-6">
						<Alert className="bg-primary/5 border-primary/20">
							<InfoIcon className="size-4" />
							<AlertTitle>Day 1 MVP Protocol</AlertTitle>
							<AlertDescription>
								Human-in-the-loop is active. All suggested routes require explicit human review
								before execution record is created.
							</AlertDescription>
						</Alert>

						<div className="bg-muted/50 rounded-xl p-6 space-y-4 font-mono text-sm border border-border">
							<div className="flex justify-between border-b border-border/50 pb-2">
								<span className="text-muted-foreground">Contract ID:</span>
								<span className="font-bold truncate max-w-[200px]">
									{suggestionResult?.contractId}
								</span>
							</div>
							<div className="flex justify-between border-b border-border/50 pb-2">
								<span className="text-muted-foreground">Margin Call:</span>
								<span className="font-bold">{suggestionResult?.payload.marginCallId}</span>
							</div>
							<div className="flex justify-between border-b border-border/50 pb-2">
								<span className="text-muted-foreground">Amount:</span>
								<span className="font-bold">
									${parseFloat(suggestionResult?.payload.amountRequired).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between border-b border-border/50 pb-2">
								<span className="text-muted-foreground">Assets:</span>
								<span className="font-bold">
									{suggestionResult?.payload.suggestedAssets.join(", ")}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Status:</span>
								<Badge className="bg-yellow-500 hover:bg-yellow-600">Pending Approval</Badge>
							</div>
						</div>

						<div className="flex gap-4 pt-4">
							<Button variant="outline" className="flex-1 h-14" onClick={() => setStep(3)}>
								Back
							</Button>
							<Button
								className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 shadow-xl"
								disabled={approveMutation.isPending}
								onClick={async () => {
									try {
										await approveMutation.mutateAsync({
											suggestionCid: suggestionResult.contractId,
										});
										toast.success(
											"Routing suggestion approved — allocation record created on Canton",
										);
										navigate({ to: "/dashboard/audit" });
									} catch (err) {
										toast.error(
											`Approval failed: ${err instanceof Error ? err.message : "Unknown error"}`,
										);
									}
								}}
							>
								{approveMutation.isPending ? (
									<>
										<div className="mr-2 size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Approving on Canton...
									</>
								) : (
									<>
										<CheckCircleIcon className="mr-2 size-5" />
										Approve & Execute
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
