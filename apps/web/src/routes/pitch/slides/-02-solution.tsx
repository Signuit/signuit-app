import { LightbulbIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { BulletPoint, SlideCard, SlideLayout, StatBox } from "../components/-slide-layout";

export function SolutionSlide() {
	return (
		<SlideLayout
			title="The Solution"
			subtitle="SignUIT CollateralRouter — Policy-based recommendation engine on Canton"
			slideNumber={2}
			totalSlides={9}
		>
			<div className="grid grid-cols-3 gap-6">
				<SlideCard className="border-primary/20">
					<div className="flex flex-col items-center text-center gap-3 py-4">
						<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
							<ZapIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-bold text-lg">3-Second CTD</h3>
						<p className="text-sm text-muted-foreground">
							Cheapest-to-Deliver algorithm computes optimal collateral in 3 seconds
						</p>
					</div>
				</SlideCard>

				<SlideCard className="border-primary/20">
					<div className="flex flex-col items-center text-center gap-3 py-4">
						<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
							<ShieldCheckIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-bold text-lg">Human Approval</h3>
						<p className="text-sm text-muted-foreground">
							Day 1 MVP requires ops team approval before execution
						</p>
					</div>
				</SlideCard>

				<SlideCard className="border-primary/20">
					<div className="flex flex-col items-center text-center gap-3 py-4">
						<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
							<LightbulbIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-bold text-lg">Yield Preservation</h3>
						<p className="text-sm text-muted-foreground">
							Sends non-yielding assets first, preserving income-generating positions
						</p>
					</div>
				</SlideCard>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-6">
				<SlideCard title="How It Works">
					<div className="space-y-2">
						<BulletPoint>
							<strong>1. Trigger:</strong> Margin call received from counterparty
						</BulletPoint>
						<BulletPoint>
							<strong>2. Compute:</strong> CTD engine analyzes all holdings in 3 seconds
						</BulletPoint>
						<BulletPoint>
							<strong>3. Recommend:</strong> Optimal collateral suggestion recorded on Canton
						</BulletPoint>
						<BulletPoint>
							<strong>4. Approve:</strong> Human reviews and clicks approve
						</BulletPoint>
						<BulletPoint>
							<strong>5. Audit:</strong> Immutable AllocationRecord created on-ledger
						</BulletPoint>
					</div>
				</SlideCard>

				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<StatBox value="600x" label="Faster than manual" />
						<StatBox value="$0" label="Opportunity cost (USDC)" />
						<StatBox value="$2,300" label="Daily yield preserved" />
						<StatBox value="100%" label="Type-safe end-to-end" />
					</div>
				</div>
			</div>
		</SlideLayout>
	);
}
