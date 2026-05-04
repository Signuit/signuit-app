import { createFileRoute } from "@tanstack/react-router";
import { stagger } from "animejs";
import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { AnimeEl, AnimeWrapper } from "@/components/presentation/AnimeWrapper";
import { PresentationSlide } from "@/components/presentation/PresentationSlide";
import { PresentationStage } from "@/components/presentation/PresentationStage";

export const Route = createFileRoute("/presentations/value-prop")({
	component: ValuePropPresentation,
});

function ValuePropPresentation() {
	return (
		<PresentationStage title="Value Proposition & Problem Statement">
			{/* Slide 1: The Problem */}
			<PresentationSlide
				title="The Trillion Dollar Friction"
				description="Institutional collateral routing is currently broken, manual, and expensive."
			>
				<AnimeWrapper
					animationConfig={{
						translateY: [20, 0],
						opacity: [0, 1],
						delay: stagger(100),
						duration: 1000,
						easing: "easeOutExpo",
					}}
					className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8"
				>
					<AnimeEl className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col items-center gap-4 text-center">
						<AlertTriangle className="size-12 text-red-500" />
						<h4 className="text-xl font-bold">Manual Selection</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Treasury teams spend 45+ minutes manually selecting assets via Excel.
						</p>
					</AnimeEl>
					<AnimeEl className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col items-center gap-4 text-center">
						<Zap className="size-12 text-red-500" />
						<h4 className="text-xl font-bold">Opportunity Cost</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Inefficient routing wastes 10-15bps in yield per transaction.
						</p>
					</AnimeEl>
					<AnimeEl className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col items-center gap-4 text-center">
						<CheckCircle2 className="size-12 text-red-500" />
						<h4 className="text-xl font-bold">Audit Gaps</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Lack of on-chain transparency leads to high reconciliation overhead.
						</p>
					</AnimeEl>
				</AnimeWrapper>
			</PresentationSlide>

			{/* Slide 2: The Solution */}
			<PresentationSlide
				title="The SignUIT Solution"
				description="Policy-based collateral routing automation on the Canton Network."
			>
				<div className="relative w-full max-w-2xl aspect-video rounded-3xl border-2 border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden">
					<AnimeWrapper
						animationConfig={{
							scale: [0.8, 1],
							opacity: [0, 1],
							duration: 1500,
							easing: "easeOutElastic(1, .8)",
						}}
					>
						<div className="flex flex-col items-center gap-6">
							<div className="size-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.3)] animate-pulse">
								<Zap className="size-12 text-primary-foreground" />
							</div>
							<div className="text-center">
								<h4 className="text-2xl font-black">CTD Engine</h4>
								<p className="text-muted-foreground font-mono">Cheapest-To-Deliver Optimization</p>
							</div>
						</div>
					</AnimeWrapper>

					{/* Decorative floating particles */}
					<AnimeWrapper
						animationConfig={{
							translateY: [-20, 20],
							opacity: [0.2, 0.5],
							duration: 3000,
							direction: "alternate",
							loop: true,
							easing: "easeInOutSine",
						}}
						className="absolute inset-0 pointer-events-none"
					>
						{[...Array(10)].map((_, i) => (
							<div
								key={i}
								className="absolute size-2 bg-primary/20 rounded-full"
								style={{
									top: `${Math.random() * 100}%`,
									left: `${Math.random() * 100}%`,
								}}
							/>
						))}
					</AnimeWrapper>
				</div>
			</PresentationSlide>

			{/* Slide 3: Key Value Props */}
			<PresentationSlide
				title="Why SignUIT?"
				description="Unlocking liquidity and efficiency for the next generation of finance."
			>
				<AnimeWrapper
					animationConfig={{
						translateX: [-50, 0],
						opacity: [0, 1],
						delay: stagger(200),
						duration: 800,
						easing: "easeOutBack",
					}}
					className="flex flex-col gap-4 w-full max-w-xl"
				>
					{[
						{
							label: "Real-time Policy Compliance",
							sub: "Instant validation against counterparty rules",
						},
						{
							label: "Optimal Asset Selection",
							sub: "Maximize yield while meeting margin requirements",
						},
						{
							label: "Immutable Audit Trail",
							sub: "Every routing decision recorded on the Canton ledger",
						},
					].map((item, i) => (
						<AnimeEl
							key={i}
							className="flex items-center gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-left"
						>
							<div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
								<CheckCircle2 className="size-6 text-primary" />
							</div>
							<div>
								<h5 className="font-bold text-lg">{item.label}</h5>
								<p className="text-sm text-muted-foreground">{item.sub}</p>
							</div>
						</AnimeEl>
					))}
				</AnimeWrapper>
			</PresentationSlide>
		</PresentationStage>
	);
}
