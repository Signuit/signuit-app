import { AlertTriangleIcon, ClockIcon, FileSpreadsheetIcon, ShieldAlertIcon } from "lucide-react";
import { BulletPoint, SlideCard, SlideLayout, StatBox } from "../components/-slide-layout";

export function ProblemSlide() {
	return (
		<SlideLayout
			title="The Problem"
			subtitle="Collateral management is still stuck in the 1990s"
			slideNumber={1}
			totalSlides={9}
		>
			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-4">
					<SlideCard title="Manual Process Pain">
						<div className="space-y-3">
							<BulletPoint>
								<strong>70% of institutions</strong> report collateral delivery challenges
							</BulletPoint>
							<BulletPoint>
								<strong>30+ minutes</strong> per margin call using Excel + phone coordination
							</BulletPoint>
							<BulletPoint>
								<strong>After-hours calls</strong> require human coordination around the clock
							</BulletPoint>
							<BulletPoint>
								<strong>No immutable audit trail</strong> — regulatory reporting is manual
							</BulletPoint>
						</div>
					</SlideCard>

					<SlideCard title="The Canton Gap">
						<div className="space-y-3">
							<BulletPoint>
								<strong>$6T+</strong> tokenized assets on Canton Network
							</BulletPoint>
							<BulletPoint>
								<strong>$4T+/month</strong> transaction volume
							</BulletPoint>
							<BulletPoint>
								<strong>Zero</strong> native collateral routing engines exist
							</BulletPoint>
							<BulletPoint>
								Institutions need <strong>tooling, not just infrastructure</strong>
							</BulletPoint>
						</div>
					</SlideCard>
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<StatBox value="70%" label="Firms with delivery challenges" />
						<StatBox value="30+" label="Minutes per manual decision" />
						<StatBox value="$6T+" label="Tokenized assets on Canton" />
						<StatBox value="0" label="Native routing engines" />
					</div>

					<SlideCard className="bg-destructive/5 border-destructive/20">
						<div className="flex items-start gap-4">
							<AlertTriangleIcon className="size-8 text-destructive shrink-0" />
							<div>
								<p className="font-semibold text-destructive mb-1">The Human Cost</p>
								<p className="text-sm text-muted-foreground">
									Treasury teams spend hours daily on manual collateral decisions.
									Errors cost millions. Regulatory pressure is increasing.
									There has to be a better way.
								</p>
							</div>
						</div>
					</SlideCard>
				</div>
			</div>
		</SlideLayout>
	);
}
