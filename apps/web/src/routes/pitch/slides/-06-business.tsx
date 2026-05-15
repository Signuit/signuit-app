import { CoinsIcon, NetworkIcon, UsersIcon } from "lucide-react";
import { motion } from "motion/react";
import CountUp from "@/components/CountUp";
import { SlideLayout } from "../components/-slide-layout";

const REVENUE = [
	{
		icon: CoinsIcon,
		title: "Allocation Fee",
		range: "0.01–0.05%",
		desc: "Per executed AllocationRecord",
		example: "$15M × 0.03% = $4,500",
	},
	{
		icon: NetworkIcon,
		title: "Membership Fee",
		range: "$500–$2,000",
		desc: "Monthly base access fee",
		example: "Basic / Pro / Enterprise",
	},
	{
		icon: UsersIcon,
		title: "Validator Rewards",
		range: "40–50%",
		desc: "Of protocol fees to validators",
		example: "Ecosystem alignment",
	},
];

const PROJECTION = [
	{ period: "Q3 2026", lo: 5, hi: 10, unit: "K/mo" },
	{ period: "Q4 2026", lo: 25, hi: 50, unit: "K/mo" },
	{ period: "2027", lo: 150, hi: 300, unit: "K/mo" },
];

export function BusinessSlide() {
	return (
		<SlideLayout
			title="Business Model"
			subtitle="Protocol-native revenue on Canton Network"
			slideNumber={6}
			totalSlides={9}
		>
			{/* Revenue streams */}
			<div className="grid grid-cols-3 gap-4">
				{REVENUE.map((r, i) => (
					<motion.div
						key={r.title}
						className="flex flex-col gap-3 p-5 rounded-xl border border-primary/20 bg-card"
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.12, duration: 0.4 }}
						whileHover={{ scale: 1.02 }}
					>
						<div className="flex items-center gap-2">
							<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
								<r.icon className="size-4 text-primary" />
							</div>
							<span className="font-bold text-sm">{r.title}</span>
						</div>
						<div className="text-2xl font-black text-primary">{r.range}</div>
						<p className="text-xs text-muted-foreground">{r.desc}</p>
						<span className="text-[11px] bg-muted/50 px-2 py-1 rounded-md text-muted-foreground w-fit">
							{r.example}
						</span>
					</motion.div>
				))}
			</div>

			{/* Revenue projection */}
			<motion.div
				className="mt-5 p-5 rounded-xl border border-border bg-muted/20"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.45, duration: 0.4 }}
			>
				<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
					Revenue Projection
				</p>
				<div className="grid grid-cols-4 gap-4">
					{PROJECTION.map((p, i) => (
						<div key={p.period} className="flex flex-col items-center gap-1">
							<span className="text-xs text-muted-foreground">{p.period}</span>
							<span className="text-xl font-black text-primary">
								$<CountUp to={p.lo} duration={1.2} delay={0.5 + i * 0.1} />
								–
								<CountUp to={p.hi} duration={1.2} delay={0.5 + i * 0.1} />
								{p.unit}
							</span>
						</div>
					))}
					<div className="flex flex-col items-center gap-1">
						<span className="text-xs text-muted-foreground">Target</span>
						<span className="text-xl font-black text-primary">
							<CountUp to={50} duration={1.2} delay={0.8} />
							+ institutions
						</span>
					</div>
				</div>
			</motion.div>
		</SlideLayout>
	);
}
