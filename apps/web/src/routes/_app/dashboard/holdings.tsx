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
import { useHoldings } from "@/hooks/use-collateral-api";

export const Route = createFileRoute("/_app/dashboard/holdings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: holdings, isLoading, error } = useHoldings();

	const totalValue =
		holdings?.reduce((sum: number, h) => sum + parseFloat(h.payload.amount), 0) || 0;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Holdings</h1>
				<Button className="gap-2">
					<PlusIcon className="size-4" />
					Add Holding
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
						<WalletIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${(totalValue / 1_000_000).toFixed(1)}M</div>
						<p className="text-xs text-muted-foreground">+2.5% from last month</p>
					</CardContent>
				</Card>
				{/* You could add more cards here like "Yield-bearing Assets", "Available Liquidity" etc. */}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Collateral Positions</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex h-32 items-center justify-center">
							<p className="text-muted-foreground animate-pulse">Loading holdings from Canton...</p>
						</div>
					) : error ? (
						<div className="flex h-32 items-center justify-center text-destructive">
							<p>Error loading holdings: {error.message}</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Asset</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Yield</TableHead>
									<TableHead>Haircut</TableHead>
									<TableHead>LTV</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{holdings?.map((h) => (
									<TableRow key={h.contractId}>
										<TableCell className="font-medium">{h.payload.asset}</TableCell>
										<TableCell>${parseFloat(h.payload.amount).toLocaleString()}</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{(parseFloat(h.payload.yield) * 100).toFixed(1)}%
											</Badge>
										</TableCell>
										<TableCell>{(parseFloat(h.payload.haircut) * 100).toFixed(1)}%</TableCell>
										<TableCell>{((1 - parseFloat(h.payload.haircut)) * 100).toFixed(0)}%</TableCell>
										<TableCell className="text-right">
											<Button variant="ghost" size="sm">
												Edit
											</Button>
										</TableCell>
									</TableRow>
								))}
								{holdings?.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
											No holdings found. Seed the sandbox with demo data.
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
