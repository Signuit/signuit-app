import { LightbulbIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { motion } from "motion/react";
import CountUp from "@/components/CountUp";
import { SlideLayout } from "../components/-slide-layout";

const PILLARS = [
	{
		icon: ZapIcon,
		title: "3-Second CTD",
		desc: "Cheapest-to-Deliver algorithm ranks assets by opportunity cost. Picks non-yielding first.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Human Approval",
		desc: "Ops team reviews the suggestion and clicks approve. Operator cannot override.",
	},
	{
		icon: LightbulbIcon,
		title: "Yield Preservation",
		desc: "USDC goes first — $0 opportunity cost. High-yield USYC & UST stay deployed.",
	},
];

const STATS = [
	{ value: 600, suffix: "x", label: "Faster decisions" },
	{ prefix: "$", value: 0, suffix: "", label: "Opportunity cost (USDC)" },
	{ prefix: "$", value: 2300, suffix: "/day", label: "Yield preserved" },
];

const STEPS = [
	"Margin call arrives from counterparty",
	"CTD engine evaluates all holdings in 3 sec",
	"Optimal suggestion recorded on Canton",
	"Ops team reviews and approves",
	"Immutable AllocationRecord created on-ledger",
];

export function SolutionSlide() {
	return (
		<SlideLayout
			title="The Solution"
			subtitle="SignUIT CollateralRouter — policy-based recommendation engine on Canton"
			slideNumber={2}
			totalSlides={9}
		>
			{/* Three pillars */}
			<div className="grid grid-cols-3 gap-4">
				{PILLARS.map((p, i) => (
					<motion.div
						key={p.title}
						className="flex flex-col items-center text-center gap-3 p-5 rounded-xl border border-primary/20 bg-card"
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.12, duration: 0.4 }}
						whileHover={{ scale: 1.03, borderColor: "hsl(var(--primary) / 0.5)" }}
					>
						<div className="size-11 rounded-full bg-primary/10 flex items-center justify-center">
							<p.icon className="size-5 text-primary" />
						</div>
						<h3 className="font-bold text-sm">{p.title}</h3>
						<p className="text-xs text-muted-foreground leading-snug">{p.desc}</p>
					</motion.div>
				))}
			</div>

			<div className="mt-5 grid grid-cols-2 gap-5">
				{/* How it works — numbered steps */}
				<motion.div
					className="p-4 rounded-xl border border-border bg-muted/20"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
				>
					<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
						How It Works
					</p>
					<div className="space-y-2">
						{STEPS.map((step, i) => (
							<div key={step} className="flex items-start gap-2.5">
								<span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
									{i + 1}
								</span>
								<span className="text-xs text-muted-foreground leading-snug">{step}</span>
							</div>
						))}
					</div>
				</motion.div>

				{/* Big stats */}
				<motion.div
					className="grid grid-cols-1 gap-3"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.5, duration: 0.4 }}
				>
					{STATS.map((s, i) => (
						<div
							key={s.label}
							className="flex items-center justify-between px-5 py-3 rounded-xl border border-border bg-card"
						>
							<span className="text-xs text-muted-foreground">{s.label}</span>
							<span className="text-2xl font-black text-primary">
								{s.prefix ?? ""}
								<CountUp to={s.value} duration={1.4} delay={0.6 + i * 0.1} separator="," />
								{s.suffix}
							</span>
						</div>
					))}
					<div className="flex items-center justify-between px-5 py-3 rounded-xl border border-primary/30 bg-primary/5">
						<span className="text-xs text-muted-foreground">Canton-native routing engines</span>
						<span className="text-2xl font-black text-primary">
							<CountUp to={0} duration={0.5} delay={0.9} /> existing → 1 now
						</span>
					</div>
				</motion.div>
			</div>
		</SlideLayout>
	);
}
