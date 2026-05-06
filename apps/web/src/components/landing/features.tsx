import { FileCheck, LayoutGrid, Route, Shield, UserCheck, Zap } from "lucide-react";

import AnimatedContent from "@/components/AnimatedContent";
import MagicBento from "@/components/MagicBento";
import ShinyText from "@/components/ShinyText";

const featureCards = [
	{
		icon: Route,
		title: "Smart Policy Routing",
		description:
			"CTD algorithm routes margin calls through the most capital-efficient path while enforcing institutional policy constraints.",
		footer: (
			<ShinyText
				text="Enterprise-ready"
				className="text-xs uppercase tracking-[0.15em] text-blue-200"
				speed={3}
			/>
		),
	},
	{
		icon: Shield,
		title: "Institutional Privacy",
		description:
			"Transactions are cryptographically isolated. Only involved counterparties can view routing details and allocations.",
		footer: (
			<ShinyText
				text="Enterprise-ready"
				className="text-xs uppercase tracking-[0.15em] text-blue-200"
				speed={3}
			/>
		),
	},
	{
		icon: Zap,
		title: "Live Optimization",
		description:
			"Continuous monitoring of collateral pools with real-time rebalancing suggestions and instant execution triggers.",
		footer: (
			<ShinyText
				text="Enterprise-ready"
				className="text-xs uppercase tracking-[0.15em] text-blue-200"
				speed={3}
			/>
		),
	},
	{
		icon: LayoutGrid,
		title: "Unified Command",
		description:
			"Manage collateral policies, margin calls, and asset routing from a single institutional-grade dashboard.",
		footer: (
			<ShinyText
				text="Enterprise-ready"
				className="text-xs uppercase tracking-[0.15em] text-blue-200"
				speed={3}
			/>
		),
	},
	{
		icon: FileCheck,
		title: "Verifiable Audit",
		description:
			"Every routing decision, approval, and settlement is permanently recorded on the Canton ledger for full traceability.",
		footer: (
			<ShinyText
				text="Enterprise-ready"
				className="text-xs uppercase tracking-[0.15em] text-blue-200"
				speed={3}
			/>
		),
	},
	{
		icon: UserCheck,
		title: "Governed Execution",
		description:
			"Automated suggestions are policy-bounded. Critical routing decisions require explicit institutional sign-off.",
		footer: (
			<ShinyText
				text="Enterprise-ready"
				className="text-xs uppercase tracking-[0.15em] text-blue-200"
				speed={3}
			/>
		),
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
					<div className="w-full flex items-center">
						<MagicBento
							enableMagnetism
							clickEffect
							enableTilt={false}
							glowColor="59, 130, 246"
							cards={featureCards}
						/>
					</div>
				</AnimatedContent>
			</div>
		</section>
	);
}
