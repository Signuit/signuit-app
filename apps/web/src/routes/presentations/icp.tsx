import { createFileRoute } from "@tanstack/react-router";
import { stagger } from "animejs";
import { Banknote, Building2, Landmark, ShieldCheck } from "lucide-react";
import { AnimeEl, AnimeWrapper } from "@/components/presentation/AnimeWrapper";
import { PresentationSlide } from "@/components/presentation/PresentationSlide";
import { PresentationStage } from "@/components/presentation/PresentationStage";

export const Route = createFileRoute("/presentations/icp")({
	component: ICPPresentation,
});

function ICPPresentation() {
	return (
		<PresentationStage title="ICP & Audience Definition">
			{/* Slide 1: Primary Target - The Buy Side */}
			<PresentationSlide
				title="The Buy-Side Powerhouse"
				description="Asset managers and hedge funds with large, underutilized collateral pools."
			>
				<AnimeWrapper
					animationConfig={{
						scale: [0.9, 1],
						opacity: [0, 1],
						delay: stagger(150),
						duration: 1200,
						easing: "easeOutElastic(1, .5)",
					}}
					className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
				>
					<AnimeEl className="p-10 rounded-[3rem] bg-indigo-500/5 border-2 border-indigo-500/10 flex flex-col items-start gap-6 text-left">
						<div className="size-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center">
							<Landmark className="size-8 text-indigo-500" />
						</div>
						<div className="space-y-2">
							<h4 className="text-2xl font-black">Asset Managers</h4>
							<p className="text-muted-foreground leading-relaxed">
								Firms like BlackRock, Vanguard, and Fidelity who need to optimize yield on trillions
								in AUM.
							</p>
						</div>
						<ul className="space-y-2 text-sm font-medium text-indigo-400">
							<li className="flex items-center gap-2">
								<ShieldCheck className="size-4" /> Treasury Operations Managers
							</li>
							<li className="flex items-center gap-2">
								<ShieldCheck className="size-4" /> Collateral Desk Leads
							</li>
						</ul>
					</AnimeEl>

					<AnimeEl className="p-10 rounded-[3rem] bg-pink-500/5 border-2 border-pink-500/10 flex flex-col items-start gap-6 text-left">
						<div className="size-16 rounded-3xl bg-pink-500/20 flex items-center justify-center">
							<Building2 className="size-8 text-pink-500" />
						</div>
						<div className="space-y-2">
							<h4 className="text-2xl font-black">Custodians & Banks</h4>
							<p className="text-muted-foreground leading-relaxed">
								Market infrastructure providers like BNY Mellon and State Street seeking to offer
								value-added services.
							</p>
						</div>
						<ul className="space-y-2 text-sm font-medium text-pink-400">
							<li className="flex items-center gap-2">
								<ShieldCheck className="size-4" /> Digital Asset Strategy Leads
							</li>
							<li className="flex items-center gap-2">
								<ShieldCheck className="size-4" /> Post-Trade Innovation Teams
							</li>
						</ul>
					</AnimeEl>
				</AnimeWrapper>
			</PresentationSlide>

			{/* Slide 2: User Persona */}
			<PresentationSlide
				title="The End-User Practitioner"
				description="Solving daily workflows for the people actually moving the collateral."
			>
				<AnimeWrapper
					animationConfig={{
						translateY: [30, 0],
						opacity: [0, 1],
						duration: 1000,
						easing: "easeOutCubic",
					}}
					className="w-full max-w-2xl p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-8"
				>
					<div className="size-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center border-4 border-primary/30">
						<Banknote className="size-12 text-primary" />
					</div>
					<div className="space-y-4">
						<h5 className="text-3xl font-black tracking-tight">The Treasury Ops Manager</h5>
						<p className="text-lg text-muted-foreground">
							"I spend my morning in Excel, cross-referencing haircuts and yields. I want an
							automated engine that follows my policy and gives me the best route in seconds."
						</p>
					</div>
					<div className="flex justify-center gap-4">
						<div className="px-4 py-2 rounded-full bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20">
							Decision Maker
						</div>
						<div className="px-4 py-2 rounded-full bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary border border-primary/20">
							Power User
						</div>
					</div>
				</AnimeWrapper>
			</PresentationSlide>
		</PresentationStage>
	);
}
