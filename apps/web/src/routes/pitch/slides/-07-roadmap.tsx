import { Badge } from "@nexus/ui/components/badge";
import { CheckCircleIcon, CircleIcon, RocketIcon } from "lucide-react";
import { motion } from "motion/react";
import { SlideLayout } from "../components/-slide-layout";

const phases = [
	{
		quarter: "Q2 2026",
		title: "Hackathon MVP",
		status: "Live",
		badgeClass: "bg-green-500 text-white",
		dotClass: "bg-green-500",
		icon: CheckCircleIcon,
		items: ["6-page dashboard", "CTD engine (3 sec)", "Human approval flow", "Immutable audit trail"],
	},
	{
		quarter: "Q3 2026",
		title: "Phase 2 Beta",
		status: "Next",
		badgeClass: "bg-yellow-500 text-white",
		dotClass: "bg-yellow-500",
		icon: RocketIcon,
		items: ["Optional auto-execution", "3–5 pilot institutions", "Auto-approve rules", "Advanced analytics"],
	},
	{
		quarter: "Q4 2026",
		title: "Mainnet",
		status: "Future",
		badgeClass: "bg-primary text-primary-foreground",
		dotClass: "bg-primary",
		icon: CircleIcon,
		items: ["General availability", "20+ paying institutions", "Enterprise tier", "Cross-border collateral"],
	},
	{
		quarter: "2027",
		title: "Scale",
		status: "Vision",
		badgeClass: "bg-muted text-muted-foreground",
		dotClass: "bg-muted-foreground",
		icon: CircleIcon,
		items: ["50+ institutions", "Chainlink oracle", "DAO governance", "Multi-chain expansion"],
	},
];

export function RoadmapSlide() {
	return (
		<SlideLayout
			title="Roadmap"
			subtitle="From Hackathon MVP to Mainnet"
			slideNumber={7}
			totalSlides={9}
		>
			<div className="flex items-stretch gap-3">
				{phases.map((phase, i) => (
					<motion.div
						key={phase.quarter}
						className="flex-1 flex flex-col min-w-0"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.13, duration: 0.4, ease: "easeOut" }}
					>
						{/* Timeline dot + connector */}
						<div className="flex items-center mb-3">
							<div className={`size-8 rounded-full ${phase.dotClass} flex items-center justify-center shrink-0`}>
								<phase.icon className="size-4 text-white" />
							</div>
							{i < phases.length - 1 && (
								<motion.div
									className="h-px flex-1 bg-border ml-2"
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									transition={{ delay: 0.2 + i * 0.13, duration: 0.4 }}
									style={{ transformOrigin: "left" }}
								/>
							)}
						</div>

						{/* Card */}
						<div className="flex-1 border rounded-xl p-4 bg-card flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
									{phase.quarter}
								</span>
								<Badge className={`${phase.badgeClass} text-[9px] px-1.5 py-0 h-4`}>
									{phase.status}
								</Badge>
							</div>
							<h3 className="font-bold text-sm">{phase.title}</h3>
							<ul className="space-y-1.5 flex-1">
								{phase.items.map((item) => (
									<li key={item} className="flex items-start gap-1.5">
										<div className="size-1 rounded-full bg-primary mt-1.5 shrink-0" />
										<span className="text-[11px] text-muted-foreground leading-snug">{item}</span>
									</li>
								))}
							</ul>
						</div>
					</motion.div>
				))}
			</div>
		</SlideLayout>
	);
}
