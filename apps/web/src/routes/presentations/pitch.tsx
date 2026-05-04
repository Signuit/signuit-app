import { createFileRoute } from "@tanstack/react-router";
import { stagger } from "animejs";
import { motion } from "framer-motion";
import { DollarSign, Globe, LayoutDashboard, Rocket, Zap } from "lucide-react";
import { AnimeEl, AnimeWrapper } from "@/components/presentation/AnimeWrapper";
import { PresentationSlide } from "@/components/presentation/PresentationSlide";
import { PresentationStage } from "@/components/presentation/PresentationStage";

export const Route = createFileRoute("/presentations/pitch")({
	component: PitchPresentation,
});

function PitchPresentation() {
	return (
		<PresentationStage title="Investor Pitch Deck">
			{/* Slide 1: The Vision */}
			<PresentationSlide
				title="The Future of Collateral"
				description="SignUIT: The intelligent routing layer for the global collateral network."
			>
				<AnimeWrapper
					animationConfig={{
						scale: [0.5, 1],
						opacity: [0, 1],
						duration: 2000,
						easing: "easeOutElastic(1, .5)",
					}}
					className="flex flex-col items-center gap-12"
				>
					<div className="relative">
						<div className="size-48 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.3)] border-8 border-white/10 animate-pulse">
							<Rocket className="size-24 text-white" />
						</div>
						<AnimeWrapper
							animationConfig={{
								rotate: "1turn",
								duration: 15000,
								loop: true,
								easing: "linear",
							}}
							className="absolute -inset-12 border-2 border-dashed border-yellow-500/20 rounded-full"
						>
							<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 rounded-full bg-white flex items-center justify-center shadow-lg">
								<Zap className="size-4 text-yellow-500" />
							</div>
						</AnimeWrapper>
					</div>

					<div className="text-center space-y-4">
						<h4 className="text-5xl font-black tracking-tighter uppercase italic">
							100x Efficiency
						</h4>
						<p className="text-xl text-muted-foreground font-mono">From Hours to Milliseconds</p>
					</div>
				</AnimeWrapper>
			</PresentationSlide>

			{/* Slide 2: Market Opportunity */}
			<PresentationSlide
				title="A $20 Trillion Opportunity"
				description="Targeting the global repo and securities lending market."
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
					<div className="flex flex-col justify-center text-left space-y-6">
						<div className="space-y-2">
							<h5 className="text-sm font-bold text-yellow-500 uppercase tracking-[0.2em]">
								The Problem
							</h5>
							<p className="text-2xl font-bold leading-tight">
								Fragmentation and manual processes lead to trillions in trapped liquidity.
							</p>
						</div>
						<div className="space-y-2">
							<h5 className="text-sm font-bold text-green-500 uppercase tracking-[0.2em]">
								The SignUIT Edge
							</h5>
							<p className="text-2xl font-bold leading-tight">
								Unified policy engine that works across any Canton-enabled ledger.
							</p>
						</div>
					</div>

					<AnimeWrapper
						animationConfig={{
							translateY: [40, 0],
							opacity: [0, 1],
							duration: 1200,
							easing: "easeOutBack",
						}}
						className="p-10 rounded-[3rem] bg-background border-2 border-primary/10 shadow-2xl flex flex-col items-center gap-8"
					>
						<div className="text-center">
							<div className="text-7xl font-black text-primary">$20T</div>
							<p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">
								TAM (Total Addressable Market)
							</p>
						</div>
						<div className="w-full space-y-4">
							<div className="h-4 w-full bg-primary/10 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: "75%" }}
									transition={{ duration: 2, delay: 1 }}
									className="h-full bg-primary"
								/>
							</div>
							<div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
								<span>Current Manual</span>
								<span className="text-primary">SignUIT Potential</span>
							</div>
						</div>
					</AnimeWrapper>
				</div>
			</PresentationSlide>

			{/* Slide 3: The Ask & Call to Action */}
			<PresentationSlide
				title="Join the Revolution"
				description="We are seeking strategic partners and investors to scale SignUIT."
			>
				<AnimeWrapper
					animationConfig={{
						translateY: [20, 0],
						opacity: [0, 1],
						delay: stagger(150),
						duration: 1000,
						easing: "easeOutExpo",
					}}
					className="flex flex-wrap justify-center gap-6 w-full"
				>
					<AnimeEl className="flex-1 min-w-[250px] p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
						<DollarSign className="size-10 text-green-500 mx-auto" />
						<h5 className="text-2xl font-bold">$2.5M Seed</h5>
						<p className="text-sm text-muted-foreground">
							To build out the full CTD engine and expand network integrations.
						</p>
					</AnimeEl>

					<AnimeEl className="flex-1 min-w-[250px] p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
						<Globe className="size-10 text-blue-500 mx-auto" />
						<h5 className="text-2xl font-bold">Global Pilots</h5>
						<p className="text-sm text-muted-foreground">
							Seeking 5 additional Tier-1 institutions for our Q3 '26 beta phase.
						</p>
					</AnimeEl>

					<AnimeEl className="flex-1 min-w-[250px] p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
						<LayoutDashboard className="size-10 text-purple-500 mx-auto" />
						<h5 className="text-2xl font-bold">Try the MVP</h5>
						<p className="text-sm text-muted-foreground">
							Open sandbox access for qualified financial institutions today.
						</p>
					</AnimeEl>
				</AnimeWrapper>

				<div className="mt-16 flex flex-col items-center gap-6">
					<h4 className="text-3xl font-black tracking-tighter">
						Ready to optimize your collateral?
					</h4>
					<div className="flex gap-4">
						<button
							type="button"
							className="px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-primary/20"
						>
							Contact Us
						</button>
						<button
							type="button"
							className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
						>
							Download Pitch
						</button>
					</div>
				</div>
			</PresentationSlide>
		</PresentationStage>
	);
}
