import { Badge } from "@nexus/ui/components/badge";
import { CheckCircleIcon, CircleIcon, RocketIcon } from "lucide-react";
import { SlideLayout } from "../components/-slide-layout";

export function RoadmapSlide() {
	const phases = [
		{
			quarter: "Q2 2026",
			title: "Hackathon MVP",
			status: "Live",
			badge: "bg-green-500",
			icon: <CheckCircleIcon className="size-4 text-white" />,
			bg: "bg-green-500",
			items: [
				"6-page dashboard",
				"CTD engine (3 sec)",
				"Human approval flow",
				"Immutable audit trail",
			],
		},
		{
			quarter: "Q3 2026",
			title: "Phase 2 Beta",
			status: "Next",
			badge: "bg-yellow-500",
			icon: <RocketIcon className="size-4 text-white" />,
			bg: "bg-yellow-500",
			items: [
				"Optional auto-execution",
				"3-5 pilot institutions",
				"Auto-approve rules",
				"Advanced analytics",
			],
		},
		{
			quarter: "Q4 2026",
			title: "Mainnet",
			status: "Future",
			badge: "bg-primary",
			icon: <CircleIcon className="size-4 text-primary" />,
			bg: "bg-primary/20",
			items: [
				"General availability",
				"20+ paying institutions",
				"Enterprise tier launch",
				"Cross-border collateral",
			],
		},
		{
			quarter: "2027",
			title: "Scale",
			status: "Vision",
			badge: "bg-muted",
			icon: <CircleIcon className="size-4 text-muted-foreground" />,
			bg: "bg-muted",
			items: [
				"50+ institutions (target)",
				"Chainlink oracle integration",
				"DAO governance (Phase 3)",
				"Multi-chain expansion",
			],
		},
	];

	return (
		<SlideLayout
			title="Roadmap"
			subtitle="From Hackathon MVP to Mainnet"
			slideNumber={7}
			totalSlides={9}
		>
			<div className="flex items-stretch gap-3 h-full">
				{phases.map((phase, i) => (
					<div key={phase.quarter} className="flex-1 flex flex-col min-w-0">
						{/* Connector line */}
						<div className="flex items-center mb-3">
							<div className={`size-8 rounded-full ${phase.bg} flex items-center justify-center shrink-0`}>
								{phase.icon}
							</div>
							{i < phases.length - 1 && (
								<div className="h-0.5 flex-1 bg-muted ml-2" />
							)}
						</div>

						{/* Content */}
						<div className="flex-1 border rounded-xl p-4 bg-card flex flex-col">
							<div className="flex items-center gap-2 mb-2">
								<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
									{phase.quarter}
								</span>
								<Badge className={`${phase.badge} text-[10px] px-1.5 py-0`}>
									{phase.status}
								</Badge>
							</div>
							<h3 className="font-bold text-base mb-3">{phase.title}</h3>
							<ul className="space-y-2 text-sm text-muted-foreground flex-1">
								{phase.items.map((item) => (
									<li key={item} className="flex items-start gap-2">
										<div className="size-1 rounded-full bg-primary mt-1.5 shrink-0" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</SlideLayout>
	);
}
