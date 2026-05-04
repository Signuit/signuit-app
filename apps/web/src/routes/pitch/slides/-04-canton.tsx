import { EyeIcon, FileCheckIcon, NetworkIcon, ShieldCheckIcon } from "lucide-react";
import { BulletPoint, SlideCard, SlideLayout, StatBox } from "../components/-slide-layout";

export function CantonSlide() {
	return (
		<SlideLayout
			title="Why Canton Network?"
			subtitle="The only public blockchain with institutional-grade privacy"
			slideNumber={4}
			totalSlides={9}
		>
			<div className="grid grid-cols-3 gap-6">
				<SlideCard className="border-primary/20">
					<div className="flex flex-col items-center text-center gap-3 py-4">
						<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
							<EyeIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-bold text-lg">Privacy-Preserving</h3>
						<p className="text-sm text-muted-foreground">
							Sub-transaction privacy ensures sensitive positions are only visible to relevant parties
						</p>
					</div>
				</SlideCard>

				<SlideCard className="border-primary/20">
					<div className="flex flex-col items-center text-center gap-3 py-4">
						<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
							<FileCheckIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-bold text-lg">Immutable Audit</h3>
						<p className="text-sm text-muted-foreground">
							Every routing decision is a smart contract that cannot be altered or deleted
						</p>
					</div>
				</SlideCard>

				<SlideCard className="border-primary/20">
					<div className="flex flex-col items-center text-center gap-3 py-4">
						<div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
							<NetworkIcon className="size-6 text-primary" />
						</div>
						<h3 className="font-bold text-lg">Atomic Settlement</h3>
						<p className="text-sm text-muted-foreground">
							Cross-institutional coordination with guaranteed settlement finality
						</p>
					</div>
				</SlideCard>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-6">
				<SlideCard title="Canton Network Growth">
					<div className="grid grid-cols-2 gap-4">
						<StatBox value="$6T+" label="Tokenized RWA" />
						<StatBox value="$4T+" label="Monthly volume" />
						<StatBox value="$12B+" label="Digital securities" />
						<StatBox value="$3M" label="Savings per repo participant" />
					</div>
				</SlideCard>

				<SlideCard title="Key Partnerships">
					<div className="space-y-3">
						<BulletPoint>
							<strong>DTCC</strong> — Tokenizing DTC-custodied Treasuries on Canton (2026)
						</BulletPoint>
						<BulletPoint>
							<strong>Digital Asset</strong> — $135M raised for Canton growth
						</BulletPoint>
						<BulletPoint>
							<strong>Global Synchronizer</strong> — Decentralized interoperability backbone
						</BulletPoint>
						<BulletPoint>
							<strong>Major Banks</strong> — Active pilots for repo and securities lending
						</BulletPoint>
					</div>
				</SlideCard>
			</div>
		</SlideLayout>
	);
}
