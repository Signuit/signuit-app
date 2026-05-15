import { Building2Icon, GlobeIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { motion } from "motion/react";
import CountUp from "@/components/CountUp";
import { SlideLayout } from "../components/-slide-layout";

const STATS = [
	{ prefix: "$", value: 10, suffix: "bn+", label: "Tokenized Treasuries globally" },
	{ prefix: "$", value: 1.4, suffix: "B", label: "Tokenized on Canton" },
	{ value: 450, suffix: "+", label: "Canton ecosystem projects" },
	{ value: 0, suffix: "", label: "Native routing competitors" },
];

const SEGMENTS = [
	{ icon: Building2Icon, label: "Large Asset Managers", sub: "AUM >$10B, high daily margin call volume" },
	{ icon: UsersIcon, label: "Prime Brokers", sub: "Multi-client, very high call volume" },
	{ icon: TrendingUpIcon, label: "Hedge Funds", sub: "Speed-critical, volatility-driven calls" },
	{ icon: GlobeIcon, label: "Clearinghouses & CCPs", sub: "Systemic risk management, regulatory audit" },
];

const TIMING = [
	"DTCC exploring tokenization on Canton — on-chain collateral demand surging",
	"T+0 settlement now possible — speed is the new competitive edge",
	"71% of Canton developers come from Ethereum — they expect modern tooling",
	"No competitors — SignUIT is the first Canton-native collateral routing engine",
];

export function MarketSlide() {
	return (
		<SlideLayout
			title="Market Opportunity"
			subtitle="Tokenized finance is growing — tooling is the bottleneck"
			slideNumber={5}
			totalSlides={9}
		>
			{/* Big stats */}
			<div className="grid grid-cols-4 gap-3">
				{STATS.map((s, i) => (
					<motion.div
						key={s.label}
						className="flex flex-col items-center p-4 rounded-xl border border-border bg-muted/30 gap-1"
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.1, duration: 0.35 }}
					>
						<span className="text-2xl font-black text-primary">
							{s.prefix ?? ""}
							<CountUp to={s.value} duration={1.4} delay={0.2 + i * 0.1} />
							{s.suffix}
						</span>
						<span className="text-[11px] text-muted-foreground text-center leading-tight">
							{s.label}
						</span>
					</motion.div>
				))}
			</div>

			<div className="mt-5 grid grid-cols-2 gap-5">
				{/* Target segments */}
				<motion.div
					className="p-4 rounded-xl border border-border bg-muted/20"
					initial={{ opacity: 0, x: -16 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.45, duration: 0.4 }}
				>
					<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
						Target Segments
					</p>
					<div className="space-y-3">
						{SEGMENTS.map((seg) => (
							<div key={seg.label} className="flex items-center gap-3">
								<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
									<seg.icon className="size-4 text-primary" />
								</div>
								<div>
									<p className="text-xs font-semibold">{seg.label}</p>
									<p className="text-[11px] text-muted-foreground">{seg.sub}</p>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Market timing */}
				<motion.div
					className="p-4 rounded-xl border border-border bg-muted/20"
					initial={{ opacity: 0, x: 16 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.55, duration: 0.4 }}
				>
					<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
						Why Now
					</p>
					<div className="space-y-2.5">
						{TIMING.map((t) => (
							<div key={t} className="flex items-start gap-2">
								<div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
								<span className="text-xs text-muted-foreground leading-snug">{t}</span>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</SlideLayout>
	);
}
