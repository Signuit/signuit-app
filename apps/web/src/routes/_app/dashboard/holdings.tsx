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
import { PlusIcon, WalletIcon } from "lucide-react";
import { useAuthRole } from "@/hooks/use-auth";
import { useHoldings } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/holdings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { role } = useAuthRole();
	const { data: holdings, isLoading, error } = useHoldings();

	const totalValue =
		holdings?.reduce((sum: number, h) => sum + parseFloat(h.payload.amount), 0) || 0;

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
					<Button size="sm" className="gap-2">
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
								className="text-[9px] bg-green-500/10 text-green-700 dark:text-green-400 border-transparent font-medium py-0"
							>
								+2.5%
							</Badge>
							<p className="text-[10px] text-muted-foreground font-medium">vs last month</p>
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
						<div className="text-3xl font-bold tracking-tight">4.5%</div>
						<p className="text-[10px] text-muted-foreground font-medium mt-1">
							Max available APY (USYC)
						</p>
					</CardContent>
				</Card>

				<Card className="shadow-sm">
					<CardHeader className="pb-3 text-sm">
						<CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
							Liquidity Index
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold tracking-tight text-primary">92%</div>
						<p className="text-[10px] text-muted-foreground font-medium mt-1">
							Net LTV across positions
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
								{holdings?.map((h) => (
									<TableRow
										key={h.contractId}
										className="border-muted/30 group hover:bg-muted/10 transition-colors"
									>
										<TableCell className="pl-6">
											<div className="flex items-center gap-3">
												<div className="size-7 rounded bg-muted flex items-center justify-center font-bold text-[9px] text-muted-foreground">
													{h.payload.asset}
												</div>
												<span className="font-semibold text-sm">{h.payload.asset}</span>
											</div>
										</TableCell>
										<TableCell className="font-semibold text-sm">
											$
											{parseFloat(h.payload.amount).toLocaleString(undefined, {
												minimumFractionDigits: 0,
											})}
										</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className="bg-green-500/5 text-green-700 dark:text-green-400 border-transparent font-medium text-[10px] py-0 px-1.5"
											>
												{(parseFloat(h.payload.yield) * 100).toFixed(2)}%
											</Badge>
										</TableCell>
										<TableCell className="text-xs font-medium text-muted-foreground">
											{(parseFloat(h.payload.haircut) * 100).toFixed(1)}%
										</TableCell>
										<TableCell className="text-xs font-semibold">
											{((1 - parseFloat(h.payload.haircut)) * 100).toFixed(0)}%
										</TableCell>
										{role !== "operator" && (
											<TableCell className="pr-6 text-right">
												<Button variant="ghost" size="sm" className="h-7 text-xs font-medium">
													Manage
												</Button>
											</TableCell>
										)}
									</TableRow>
								))}
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
		</div>
	);
}
