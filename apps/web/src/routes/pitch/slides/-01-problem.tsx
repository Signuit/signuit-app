import { AlertTriangleIcon, ClockIcon, DatabaseIcon, TrendingDownIcon, ZapIcon } from "lucide-react";
import { motion } from "motion/react";
import CountUp from "@/components/CountUp";
import { SlideLayout } from "../components/-slide-layout";

const STATS = [
	{
		value: 30,
		suffix: "+ min",
		label: "Per margin call today",
		icon: ClockIcon,
		highlight: true,
	},
	{
		value: 3,
		suffix: " sec",
		label: "With SignUIT",
		icon: ZapIcon,
		highlight: false,
	},
	{
		value: 10,
		prefix: "$",
		suffix: "bn+",
		label: "Tokenized Treasuries",
		icon: TrendingDownIcon,
		highlight: false,
	},
	{
		value: 0,
		suffix: "",
		label: "Native routing engines",
		icon: DatabaseIcon,
		highlight: true,
	},
];

const PAINS = [
	"Excel spreadsheets + phone calls for every decision",
	"No immutable audit trail — regulators demand one",
	"Yield leakage — sending high-yield assets first",
	"$10bn+ tokenized Treasuries with zero native tooling",
];

export function ProblemSlide() {
	return (
		<SlideLayout
			title="The Problem"
			subtitle="Collateral management is stuck in the 1990s"
			slideNumber={1}
			totalSlides={9}
		>
			<div className="grid grid-cols-2 gap-8 items-start">
				{/* Left — big stat numbers */}
				<div className="grid grid-cols-2 gap-4">
					{STATS.map((stat, i) => (
						<motion.div
							key={stat.label}
							className={`flex flex-col gap-1 p-5 rounded-xl border ${stat.highlight ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1, duration: 0.4 }}
						>
							<stat.icon className={`size-4 mb-1 ${stat.highlight ? "text-destructive" : "text-primary"}`} />
							<div className={`text-3xl font-black tracking-tight ${stat.highlight ? "text-destructive" : "text-primary"}`}>
								{stat.prefix ?? ""}
								<CountUp to={stat.value} duration={1.5} delay={0.3 + i * 0.1} />
								{stat.suffix}
							</div>
							<span className="text-xs text-muted-foreground leading-tight">{stat.label}</span>
						</motion.div>
					))}
				</div>

				{/* Right — pain points */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2 mb-1">
						<AlertTriangleIcon className="size-5 text-destructive shrink-0" />
						<h3 className="font-bold text-base text-destructive">Manual Process Pain</h3>
					</div>
					{PAINS.map((pain, i) => (
						<motion.div
							key={pain}
							className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 + i * 0.1, duration: 0.35 }}
						>
							<div className="size-1.5 rounded-full bg-destructive mt-2 shrink-0" />
							<span className="text-sm text-muted-foreground leading-snug">{pain}</span>
						</motion.div>
					))}
				</div>
			</div>
		</SlideLayout>
	);
}
