import { EyeIcon, FileCheckIcon, NetworkIcon } from "lucide-react";
import { motion } from "motion/react";
import CountUp from "@/components/CountUp";
import { SlideLayout } from "../components/-slide-layout";

const REASONS = [
	{
		icon: EyeIcon,
		title: "Privacy-Preserving",
		desc: "Sub-transaction privacy. VantageCapital's positions are only visible to relevant counterparties — not broadcast to the whole network.",
	},
	{
		icon: FileCheckIcon,
		title: "Immutable Audit",
		desc: "Every routing decision is a smart contract. Cannot be altered. Cannot be deleted. Regulators get a perfect trail.",
	},
	{
		icon: NetworkIcon,
		title: "Atomic Settlement",
		desc: "Phase 2: multi-party routing with guaranteed settlement finality across institutions. Only possible on Canton.",
	},
];

const STATS = [
	{ prefix: "$", value: 10, suffix: "bn+", label: "Tokenized Treasuries" },
	{ prefix: "$", value: 1.4, suffix: "B", label: "Tokenized on Canton" },
	{ value: 450, suffix: "+", label: "Ecosystem projects" },
	{ value: 0, suffix: "", label: "Native routing engines" },
];

export function CantonSlide() {
	return (
		<SlideLayout
			title="Why Canton Network?"
			subtitle="The only public blockchain with institutional-grade privacy + auditability"
			slideNumber={4}
			totalSlides={9}
		>
			{/* Spotlight cards */}
			<div className="grid grid-cols-3 gap-4">
				{REASONS.map((r, i) => (
					<motion.div
						key={r.title}
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.12, duration: 0.4 }}
					>
						<div className="flex flex-col gap-3 h-full rounded-xl p-5 border border-border bg-card hover:border-primary/40 transition-colors">
							<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
								<r.icon className="size-5 text-primary" />
							</div>
							<h3 className="font-bold text-sm">{r.title}</h3>
							<p className="text-xs text-muted-foreground leading-snug">{r.desc}</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Stats row */}
			<motion.div
				className="mt-5 grid grid-cols-4 gap-3"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.45, duration: 0.4 }}
			>
				{STATS.map((s, i) => (
					<div
						key={s.label}
						className="flex flex-col items-center p-4 rounded-xl border border-border bg-muted/30 gap-1"
					>
						<span className="text-2xl font-black text-primary">
							{s.prefix ?? ""}
							<CountUp to={s.value} duration={1.4} delay={0.5 + i * 0.1} />
							{s.suffix}
						</span>
						<span className="text-[11px] text-muted-foreground text-center leading-tight">
							{s.label}
						</span>
					</div>
				))}
			</motion.div>

			{/* Partners */}
			<motion.div
				className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.7, duration: 0.4 }}
			>
				{["DTCC", "Digital Asset", "BNP Paribas", "Bank of America", "Citi"].map((p) => (
					<span key={p} className="px-3 py-1 rounded-full border border-border bg-card font-medium">
						{p}
					</span>
				))}
			</motion.div>
		</SlideLayout>
	);
}
