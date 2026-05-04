import { createFileRoute } from "@tanstack/react-router";
import { stagger } from "animejs";
import { Globe, MessageSquare, Network, Share2 } from "lucide-react";
import { AnimeEl, AnimeWrapper } from "@/components/presentation/AnimeWrapper";
import { PresentationSlide } from "@/components/presentation/PresentationSlide";
import { PresentationStage } from "@/components/presentation/PresentationStage";

export const Route = createFileRoute("/presentations/gtm")({
	component: GTMPresentation,
});

function GTMPresentation() {
	return (
		<PresentationStage title="Go-To-Market Strategy">
			{/* Slide 1: Phase 1 - Ecosystem Integration */}
			<PresentationSlide
				title="Phase 1: Ecosystem Infiltration"
				description="Leveraging the existing Canton Network community and active pilot participants."
			>
				<AnimeWrapper
					animationConfig={{
						translateY: [20, 0],
						opacity: [0, 1],
						delay: stagger(200),
						duration: 1000,
						easing: "easeOutExpo",
					}}
					className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
				>
					<AnimeEl className="p-8 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex flex-col items-start gap-4 text-left">
						<Network className="size-10 text-orange-500" />
						<h4 className="text-xl font-bold uppercase tracking-tight">Canton Pilots</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Direct outreach to the 30+ institutions already participating in collateral mobility
							pilots.
						</p>
					</AnimeEl>

					<AnimeEl className="p-8 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex flex-col items-start gap-4 text-left">
						<MessageSquare className="size-10 text-orange-500" />
						<h4 className="text-xl font-bold uppercase tracking-tight">Direct Validation</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							1:1 practitioners interviews with Treasury Ops Managers to refine feature
							prioritization.
						</p>
					</AnimeEl>

					<AnimeEl className="p-8 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex flex-col items-start gap-4 text-left">
						<Globe className="size-10 text-orange-500" />
						<h4 className="text-xl font-bold uppercase tracking-tight">Public Demo</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Showcasing the multi-window 3-party demo at industry conferences and Canton meetups.
						</p>
					</AnimeEl>
				</AnimeWrapper>
			</PresentationSlide>

			{/* Slide 2: Growth Loop */}
			<PresentationSlide
				title="The Network Growth Loop"
				description="As more counterparties join, the value of automated routing compounds."
			>
				<div className="relative size-64 rounded-full border-4 border-primary/20 flex items-center justify-center p-8">
					<AnimeWrapper
						animationConfig={{
							rotate: "1turn",
							duration: 10000,
							loop: true,
							easing: "linear",
						}}
						className="absolute inset-0"
					>
						<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-primary flex items-center justify-center">
							<Share2 className="size-6 text-primary-foreground" />
						</div>
					</AnimeWrapper>

					<div className="text-center">
						<h5 className="text-2xl font-black">Viral Adoption</h5>
						<p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
							Counterparty Network Effect
						</p>
					</div>

					<AnimeWrapper
						animationConfig={{
							scale: [1, 1.1],
							opacity: [0.5, 1],
							duration: 2000,
							direction: "alternate",
							loop: true,
							easing: "easeInOutSine",
						}}
						className="absolute -inset-4 border-2 border-dashed border-primary/30 rounded-full"
					>
						<div />
					</AnimeWrapper>
				</div>

				<div className="mt-12 max-w-md text-center">
					<p className="text-muted-foreground italic">
						"Every margin call issued by a counterparty on SignUIT creates a direct incentive for
						the receiving institution to adopt our routing engine."
					</p>
				</div>
			</PresentationSlide>
		</PresentationStage>
	);
}
