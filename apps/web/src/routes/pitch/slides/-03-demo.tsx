import { Badge } from "@nexus/ui/components/badge";
import { Card, CardContent } from "@nexus/ui/components/card";
import {
	ArrowRightIcon,
	CheckCircleIcon,
	LayoutDashboardIcon,
	ShieldCheckIcon,
	ZapIcon,
} from "lucide-react";
import { SlideLayout } from "../components/-slide-layout";

export function DemoSlide() {
	return (
		<SlideLayout
			title="Live Demo"
			subtitle="6-page dashboard with real-time Canton sandbox data"
			slideNumber={3}
			totalSlides={9}
		>
			<div className="grid grid-cols-3 gap-4">
				<Card className="border-2 border-primary/20">
					<CardContent className="p-4 flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<LayoutDashboardIcon className="size-5 text-primary" />
							<h3 className="font-bold">Dashboard</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							$45.2M total collateral, pending approvals, recent allocations
						</p>
						<Badge variant="secondary" className="w-fit">
							Live
						</Badge>
					</CardContent>
				</Card>

				<Card className="border-2 border-primary/20">
					<CardContent className="p-4 flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<ZapIcon className="size-5 text-primary" />
							<h3 className="font-bold">Generate Suggestion</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							4-step wizard: margin call → CTD → recommendation → approval
						</p>
						<Badge variant="secondary" className="w-fit">
							3 sec
						</Badge>
					</CardContent>
				</Card>

				<Card className="border-2 border-primary/20">
					<CardContent className="p-4 flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<ShieldCheckIcon className="size-5 text-primary" />
							<h3 className="font-bold">Audit Trail</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							Immutable AllocationRecord on Canton ledger
						</p>
						<Badge variant="secondary" className="w-fit">
							On-chain
						</Badge>
					</CardContent>
				</Card>
			</div>

			<div className="mt-6 p-6 bg-muted/30 rounded-lg border border-dashed">
				<h3 className="font-bold text-lg mb-4">Demo Scenario: $15M Margin Call</h3>
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-center gap-2">
						<div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
							1
						</div>
						<span className="text-xs font-medium">PrimeBank calls</span>
						<span className="text-xs text-muted-foreground">$15M required</span>
					</div>
					<ArrowRightIcon className="size-4 text-muted-foreground" />
					<div className="flex flex-col items-center gap-2">
						<div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
							2
						</div>
						<span className="text-xs font-medium">CTD Engine</span>
						<span className="text-xs text-muted-foreground">3 seconds</span>
					</div>
					<ArrowRightIcon className="size-4 text-muted-foreground" />
					<div className="flex flex-col items-center gap-2">
						<div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
							3
						</div>
						<span className="text-xs font-medium">Recommends</span>
						<span className="text-xs text-muted-foreground">$15M USDC</span>
					</div>
					<ArrowRightIcon className="size-4 text-muted-foreground" />
					<div className="flex flex-col items-center gap-2">
						<div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
							4
						</div>
						<span className="text-xs font-medium">Human Approves</span>
						<span className="text-xs text-muted-foreground">Ops team</span>
					</div>
					<ArrowRightIcon className="size-4 text-muted-foreground" />
					<div className="flex flex-col items-center gap-2">
						<div className="size-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
							5
						</div>
						<span className="text-xs font-medium">Immutable Record</span>
						<span className="text-xs text-muted-foreground">On Canton</span>
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<CheckCircleIcon className="size-4 text-green-500" />
				<span>Multi-party demo available: Institution + Counterparty + Operator views</span>
			</div>
		</SlideLayout>
	);
}
