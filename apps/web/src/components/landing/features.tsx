import { CheckCheck, Fingerprint, LockKeyhole, ShieldCheck, UserRoundCheck, WalletCards } from "lucide-react";

import AnimatedContent from "@/components/AnimatedContent";
import MagicBento from "@/components/MagicBento";
import ShinyText from "@/components/ShinyText";

const featureItems = [
	{
		icon: LockKeyhole,
		title: "Policy-Based Routing",
		desc: "CTD algorithm that optimizes capital efficiency while adhering to institutional policies.",
	},
	{
		icon: ShieldCheck,
		title: "Privacy by Design",
		desc: "Transactions are visible only to involved parties, leveraging Canton's privacy layer.",
	},
	{
		icon: CheckCheck,
		title: "Real-time Optimization",
		desc: "Monitor your collateral pool in real-time and capture optimization opportunities instantly.",
	},
	{
		icon: WalletCards,
		title: "Asset Allocation",
		desc: "Manage your collateral pool, margin calls, and asset allocation in a single dashboard.",
	},
	{
		icon: Fingerprint,
		title: "Immutable Audit Trail",
		desc: "Every recommendation and approval leaves a verifiable and auditable record on the Canton ledger.",
	},
	{
		icon: UserRoundCheck,
		title: "Human-in-the-loop",
		desc: "All automated suggestions are securely executed only with the operations team's approval.",
	},
];

export function LandingFeatures() {
	return (
		<section id="features" className="relative px-6 py-24">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
				<AnimatedContent distance={60}>
					<div className="space-y-4 text-center">
						<p className="text-sm uppercase tracking-[0.2em] text-blue-300">Why SignUIT</p>
						<h2 className="text-3xl font-semibold text-blue-50 sm:text-5xl">
							Intelligent collateral routing for institutional finance
						</h2>
					</div>
				</AnimatedContent>

				<AnimatedContent distance={80}>
					<div className="rounded-3xl border border-slate-800/70 bg-slate-900/20 py-4">
						<MagicBento enableMagnetism clickEffect enableTilt={false} />
					</div>
				</AnimatedContent>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{featureItems.map(({ icon: Icon, title, desc }) => (
						<AnimatedContent key={title} distance={32}>
							<article className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5">
								<div className="mb-3 inline-flex rounded-lg border border-blue-400/35 bg-blue-500/10 p-2">
									<Icon size={18} className="text-blue-300" />
								</div>
								<h3 className="text-lg font-medium text-slate-100">{title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
								<div className="mt-4">
									<ShinyText
										text="Enterprise-ready"
										className="text-xs uppercase tracking-[0.15em] text-blue-200"
										speed={3}
									/>
								</div>
							</article>
						</AnimatedContent>
					))}
				</div>
			</div>
		</section>
	);
}
