import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@nexus/ui/components/dialog";
import { Input } from "@nexus/ui/components/input";
import { Label } from "@nexus/ui/components/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@nexus/ui/components/table";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthRole } from "@/hooks/use-auth";
import { useCreateHolding, useHoldings } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/holdings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { role } = useAuthRole();
	const { data: holdings, isLoading, error } = useHoldings();
	const createHolding = useCreateHolding();
	const [dialogOpen, setDialogOpen] = useState(false);

	// Add Holding form state
	const [asset, setAsset] = useState("");
	const [amount, setAmount] = useState("");
	const [yieldPct, setYieldPct] = useState("");
	const [haircut, setHaircut] = useState("");

	const handleAddHolding = async () => {
		if (!asset || !amount || !yieldPct || !haircut) {
			toast.error("All fields are required");
			return;
		}
		try {
			await createHolding.mutateAsync({
				holdingId: `HOLD-${Date.now()}`,
				asset: asset.toUpperCase().trim(),
				amount: parseFloat(amount),
				yield: parseFloat(yieldPct) / 100,
				haircut: parseFloat(haircut) / 100,
			});
			toast.success(`Holding ${asset.toUpperCase()} added to Canton ledger`);
			setDialogOpen(false);
			setAsset("");
			setAmount("");
			setYieldPct("");
			setHaircut("");
		} catch (err) {
			toast.error(`Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
	};

	const p = (val: unknown) => parseFloat((val as string | undefined) || "0");

	const totalValue = holdings?.reduce((sum, h) => sum + p(h.payload.amount), 0) || 0;

	const maxYield =
		holdings && holdings.length > 0
			? Math.max(...holdings.map((h) => p(h.payload.yield))) * 100
			: null;

	const avgLtv =
		holdings && holdings.length > 0
			? (holdings.reduce((sum, h) => sum + (1 - p(h.payload.haircut)), 0) / holdings.length) * 100
			: null;

	const title = role === "operator" ? "Network Holdings" : "Collateral Holdings";
	const description =
		role === "operator"
			? "Network-wide view of collateral assets and utilization"
			: "Manage your collateral positions and monitor real-time yields";

	return (
		<div className="flex flex-col gap-6 pb-12">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
						<WalletIcon className="text-muted-foreground size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
						<p className="text-muted-foreground text-sm">{description}</p>
					</div>
				</div>
				{role !== "operator" && (
					<Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
						<PlusIcon className="size-4" />
						Add Holding
					</Button>
				)}
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card className="shadow-sm">
					<CardHeader className="pb-3 text-sm">
						<CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
							Total Assets
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight">
							${(totalValue / 1_000_000).toFixed(1)}M
						</div>
						<div className="flex items-center gap-1.5 mt-1">
							<Badge
								variant="secondary"
								className="text-[9px] bg-primary/10 text-primary border-transparent font-medium py-0"
							>
								{holdings?.length ?? 0} positions
							</Badge>
							<p className="text-[10px] text-muted-foreground font-medium">on Canton ledger</p>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-sm">
					<CardHeader className="pb-3 text-sm">
						<CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
							Yield Opportunities
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight">
							{maxYield !== null ? `${maxYield.toFixed(2)}%` : "—"}
						</div>
						<p className="text-[10px] text-muted-foreground font-medium mt-1">
							Max APY across holdings
						</p>
					</CardContent>
				</Card>

				<Card className="shadow-sm">
					<CardHeader className="pb-3 text-sm">
						<CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
							Avg Eligible LTV
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight text-primary">
							{avgLtv !== null ? `${avgLtv.toFixed(0)}%` : "—"}
						</div>
						<p className="text-[10px] text-muted-foreground font-medium mt-1">
							Avg (1 − haircut) across positions
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className="shadow-sm overflow-hidden">
				<CardHeader className="pb-3 text-sm">
					<CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Collateral Positions
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="flex h-64 flex-col items-center justify-center gap-4">
							<div className="size-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
							<p className="text-muted-foreground text-sm font-medium animate-pulse">
								Syncing holdings...
							</p>
						</div>
					) : error ? (
						<div className="text-center py-12 text-destructive bg-destructive/5 m-4 rounded-lg">
							<p className="font-medium text-sm">Sync Error: {error.message}</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-muted/50">
									<TableHead className="text-[10px] font-bold uppercase py-2 pl-6">Asset</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">
										Total Amount
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">
										Yield (APY)
									</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">Haircut</TableHead>
									<TableHead className="text-[10px] font-bold uppercase py-2">LTV Limit</TableHead>
									{role !== "operator" && (
										<TableHead className="text-[10px] font-bold uppercase py-2 pr-6 text-right">
											Action
										</TableHead>
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{holdings?.map((h) => {
									const asset = h.payload.asset as string | undefined;
									const amount = p(h.payload.amount);
									const yieldVal = p(h.payload.yield);
									const haircut = p(h.payload.haircut);
									return (
										<TableRow
											key={h.contractId}
											className="border-muted/30 group hover:bg-muted/10 transition-colors"
										>
											<TableCell className="pl-6">
												<div className="flex items-center gap-3">
													<div className="size-7 rounded bg-muted flex items-center justify-center font-bold text-[9px] text-muted-foreground">
														{asset}
													</div>
													<span className="font-semibold text-sm">{asset}</span>
												</div>
											</TableCell>
											<TableCell className="font-semibold text-sm">
												${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
											</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className="bg-primary/5 text-primary border-transparent font-medium text-[10px] py-0 px-1.5"
												>
													{(yieldVal * 100).toFixed(2)}%
												</Badge>
											</TableCell>
											<TableCell className="text-xs font-medium text-muted-foreground">
												{(haircut * 100).toFixed(1)}%
											</TableCell>
											<TableCell className="text-xs font-semibold">
												{((1 - haircut) * 100).toFixed(0)}%
											</TableCell>
											{role !== "operator" && (
												<TableCell className="pr-6 text-right">
													<Button
														variant="ghost"
														size="sm"
														className="h-7 text-xs font-medium"
														disabled
														title="Individual position management coming in Phase 2"
													>
														Manage
													</Button>
												</TableCell>
											)}
										</TableRow>
									);
								})}
								{holdings?.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="h-64 text-center text-muted-foreground italic py-12"
										>
											<div className="flex flex-col items-center gap-3">
												<WalletIcon className="size-8 opacity-20" />
												<p className="font-medium text-sm">No positions found</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Add Holding Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Add Collateral Holding</DialogTitle>
						<DialogDescription>
							Register a new tokenized asset position on the Canton ledger.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<Label htmlFor="asset">Asset Symbol</Label>
							<Input
								id="asset"
								placeholder="e.g. USYC"
								value={asset}
								onChange={(e) => setAsset(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="amount">Amount (USD)</Label>
							<Input
								id="amount"
								type="number"
								placeholder="e.g. 5000000"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="yield">Yield (APY %)</Label>
								<Input
									id="yield"
									type="number"
									step="0.01"
									placeholder="e.g. 4.5"
									value={yieldPct}
									onChange={(e) => setYieldPct(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="haircut">Haircut (%)</Label>
								<Input
									id="haircut"
									type="number"
									step="0.1"
									placeholder="e.g. 2"
									value={haircut}
									onChange={(e) => setHaircut(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddHolding} disabled={createHolding.isPending}>
							{createHolding.isPending ? "Adding..." : "Add to Ledger"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
