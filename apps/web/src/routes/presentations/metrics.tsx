import { createFileRoute } from "@tanstack/react-router";
import { stagger } from "animejs";
import { ArrowUpRight, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { AnimeEl, AnimeWrapper } from "@/components/presentation/AnimeWrapper";
import { PresentationSlide } from "@/components/presentation/PresentationSlide";
import { PresentationStage } from "@/components/presentation/PresentationStage";

export const Route = createFileRoute("/presentations/metrics")({
	component: MetricsPresentation,
});

function MetricsPresentation() {
	return (
		<PresentationStage title="Metrics & Validation Evidence">
			{/* Slide 1: Core Performance */}
			<PresentationSlide
				title="Quantifiable Efficiency"
				description="Direct impact on operational speed and capital optimization."
			>
				<AnimeWrapper
					animationConfig={{
						translateY: [20, 0],
						opacity: [0, 1],
						delay: stagger(200),
						duration: 1000,
						easing: "easeOutElastic(1, .8)",
					}}
					className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
				>
					<AnimeEl className="p-8 rounded-[2rem] bg-emerald-500/5 border-2 border-emerald-500/10 flex flex-col items-center gap-4 text-center">
						<div className="text-6xl font-black text-emerald-500">95%</div>
						<h4 className="text-xl font-bold">Time Reduction</h4>
						<p className="text-sm text-muted-foreground">
							From 45 minutes of manual Excel work to &lt;2 seconds of automated routing.
						</p>
					</AnimeEl>

					<AnimeEl className="p-8 rounded-[2rem] bg-blue-500/5 border-2 border-blue-500/10 flex flex-col items-center gap-4 text-center">
						<div className="text-6xl font-black text-blue-500">12bps</div>
						<h4 className="text-xl font-bold">Average Savings</h4>
						<p className="text-sm text-muted-foreground">
							Direct yield optimization per transaction by selecting cheaper-to-deliver assets.
						</p>
					</AnimeEl>
				</AnimeWrapper>
			</PresentationSlide>

			{/* Slide 2: Ledger Validation */}
			<PresentationSlide
				title="On-Chain Validation"
				description="Real-world data tracked and verified on the Canton Network."
			>
				<div className="w-full bg-muted/30 rounded-[2rem] p-8 border border-primary/10 space-y-8">
					<div className="flex items-center justify-between border-b border-primary/10 pb-6">
						<div className="flex items-center gap-4">
							<div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
								<CheckCircle2 className="size-6 text-primary" />
							</div>
							<h4 className="text-xl font-bold">Current Sandbox Metrics</h4>
						</div>
						<div className="flex items-center gap-2 text-primary font-bold">
							<TrendingUp className="size-5" />
							Live Data
						</div>
					</div>

					<AnimeWrapper
						animationConfig={{
							translateX: [-20, 0],
							opacity: [0, 1],
							delay: stagger(100),
							duration: 800,
							easing: "easeOutCubic",
						}}
						className="space-y-4"
					>
						{[
							{ label: "Active Nodes", value: "3 (Institution, CP, Operator)" },
							{ label: "Successful Allocations", value: "150+ Simulated" },
							{ label: "Total Assets Tracked", value: "$45.2M USD" },
							{ label: "Average Latency", value: "320ms" },
						].map((item, i) => (
							<AnimeEl
								key={i}
								className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-primary/5"
							>
								<span className="text-muted-foreground font-medium">{item.label}</span>
								<span className="font-mono font-bold text-primary">{item.value}</span>
							</AnimeEl>
						))}
					</AnimeWrapper>
				</div>
			</PresentationSlide>

			{/* Slide 3: Growth Opportunity */}
			<PresentationSlide
				title="The Scalability Path"
				description="Moving from sandbox validation to production-scale automation."
			>
				<div className="relative w-full flex items-center justify-center py-12">
					<AnimeWrapper
						animationConfig={{
							width: ["0%", "100%"],
							duration: 2000,
							easing: "easeInOutQuad",
						}}
						className="absolute h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10 top-1/2 -translate-y-1/2"
					>
						<div />
					</AnimeWrapper>

					<div className="relative flex justify-between w-full max-w-2xl">
						{[
							{ label: "Pilot", val: "Q2 '26", icon: <Zap /> },
							{ label: "Beta", val: "Q3 '26", icon: <TrendingUp /> },
							{ label: "Production", val: "Q4 '26", icon: <ArrowUpRight /> },
						].map((step, i) => (
							<div
								key={i}
								className="flex flex-col items-center gap-4 bg-background p-4 rounded-2xl border border-primary/20 z-10"
							>
								<div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
									{step.icon}
								</div>
								<div className="text-center">
									<p className="text-xs font-bold uppercase text-muted-foreground">{step.val}</p>
									<p className="font-black text-lg">{step.label}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</PresentationSlide>
		</PresentationStage>
	);
}
