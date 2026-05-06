import { TrendingUpIcon, UsersIcon, Building2Icon, GlobeIcon } from "lucide-react";
import { BulletPoint, SlideCard, SlideLayout, StatBox } from "../components/-slide-layout";

export function MarketSlide() {
	return (
		<SlideLayout
			title="Market Opportunity"
			subtitle="Tokenized finance is growing — tooling is the bottleneck"
			slideNumber={5}
			totalSlides={9}
		>
			<div className="grid grid-cols-4 gap-4">
				<StatBox value="$10bn+" label="Tokenized Treasuries globally" />
				<StatBox value="$1.4B" label="Tokenized on Canton (Ctrl Alt)" />
				<StatBox value="450+" label="Projects in Canton ecosystem" />
				<StatBox value="0" label="Native routing competitors" />
			</div>

			<div className="mt-6 grid grid-cols-2 gap-6">
				<SlideCard title="Target Segments">
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
								<Building2Icon className="size-4 text-primary" />
							</div>
							<div>
								<p className="font-semibold">Large Asset Managers</p>
								<p className="text-sm text-muted-foreground">AUM &gt;$10B, high daily margin call volume</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
								<UsersIcon className="size-4 text-primary" />
							</div>
							<div>
								<p className="font-semibold">Prime Brokers</p>
								<p className="text-sm text-muted-foreground">Multi-client, very high call volume</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
								<TrendingUpIcon className="size-4 text-primary" />
							</div>
							<div>
								<p className="font-semibold">Hedge Funds</p>
								<p className="text-sm text-muted-foreground">Speed-critical, volatility-driven calls</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="size-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
								<GlobeIcon className="size-4 text-primary" />
							</div>
							<div>
								<p className="font-semibold">Clearinghouses & CCPs</p>
								<p className="text-sm text-muted-foreground">Systemic risk management, regulatory audit</p>
							</div>
						</div>
					</div>
				</SlideCard>

				<SlideCard title="Market Timing">
					<div className="space-y-3">
						<BulletPoint>
							<strong>DTCC exploring tokenization</strong> on Canton — on-chain collateral demand surging
						</BulletPoint>
						<BulletPoint>
							<strong>T+0 settlement now possible</strong> — speed is the new competitive advantage
						</BulletPoint>
						<BulletPoint>
							<strong>71% of Canton developers</strong> come from Ethereum — they expect modern tooling
						</BulletPoint>
						<BulletPoint>
							<strong>"Typed SDKs"</strong> most requested missing tool — Nexus Framework fills this gap
						</BulletPoint>
						<BulletPoint>
							<strong>No competitors</strong> — SignUIT is the first Canton-native collateral routing engine
						</BulletPoint>
					</div>
				</SlideCard>
			</div>
		</SlideLayout>
	);
}
