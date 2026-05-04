import { createFileRoute } from "@tanstack/react-router";
import { stagger } from "animejs";
import { Code2, Database, Layout, ShieldCheck } from "lucide-react";
import { AnimeEl, AnimeWrapper } from "@/components/presentation/AnimeWrapper";
import { PresentationSlide } from "@/components/presentation/PresentationSlide";
import { PresentationStage } from "@/components/presentation/PresentationStage";

export const Route = createFileRoute("/presentations/mvp")({
	component: MVPPresentation,
});

function MVPPresentation() {
	return (
		<PresentationStage title="MVP Materials & Prototypes">
			{/* Slide 1: Core Architecture */}
			<PresentationSlide
				title="Battle-Tested Architecture"
				description="Built on industrial-grade technologies for financial stability."
			>
				<AnimeWrapper
					animationConfig={{
						translateY: [20, 0],
						opacity: [0, 1],
						delay: stagger(150),
						duration: 1000,
						easing: "easeOutCubic",
					}}
					className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
				>
					<AnimeEl className="p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-6 text-left">
						<Database className="size-10 text-cyan-500 shrink-0" />
						<div>
							<h4 className="font-bold">Canton Sandbox</h4>
							<p className="text-sm text-muted-foreground">
								Full ledger simulation with multi-party DAML contracts.
							</p>
						</div>
					</AnimeEl>

					<AnimeEl className="p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-6 text-left">
						<Layout className="size-10 text-cyan-500 shrink-0" />
						<div>
							<h4 className="font-bold">TanStack Start</h4>
							<p className="text-sm text-muted-foreground">
								High-performance full-stack React framework for rapid iteration.
							</p>
						</div>
					</AnimeEl>

					<AnimeEl className="p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-6 text-left">
						<Code2 className="size-10 text-cyan-500 shrink-0" />
						<div>
							<h4 className="font-bold">DAML 3.4</h4>
							<p className="text-sm text-muted-foreground">
								Smart contracts with formal verification for routing logic.
							</p>
						</div>
					</AnimeEl>

					<AnimeEl className="p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-6 text-left">
						<ShieldCheck className="size-10 text-cyan-500 shrink-0" />
						<div>
							<h4 className="font-bold">Better Auth</h4>
							<p className="text-sm text-muted-foreground">
								Secure, role-based access control for all network participants.
							</p>
						</div>
					</AnimeEl>
				</AnimeWrapper>
			</PresentationSlide>

			{/* Slide 2: Demo Walkthrough */}
			<PresentationSlide
				title="The 3-Party Live Demo"
				description="Witness the full collateral lifecycle in real-time."
			>
				<div className="relative w-full max-w-3xl flex flex-col gap-4">
					<div className="flex gap-4">
						<div className="flex-1 p-6 rounded-2xl bg-muted/50 border border-primary/10 text-center">
							<h5 className="font-black text-primary">Institution</h5>
							<p className="text-xs text-muted-foreground uppercase mt-1">Approver</p>
						</div>
						<div className="flex-1 p-6 rounded-2xl bg-muted/50 border border-primary/10 text-center">
							<h5 className="font-black text-primary">Counterparty</h5>
							<p className="text-xs text-muted-foreground uppercase mt-1">Initiator</p>
						</div>
						<div className="flex-1 p-6 rounded-2xl bg-muted/50 border border-primary/10 text-center">
							<h5 className="font-black text-primary">Operator</h5>
							<p className="text-xs text-muted-foreground uppercase mt-1">Observer</p>
						</div>
					</div>

					<div className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-center">
						<h4 className="text-2xl font-black mb-4">Complete End-to-End Flow</h4>
						<p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
							From margin call creation by the Counterparty to the automated routing calculation and
							final Institution approval.
						</p>
						<div className="mt-8 flex justify-center gap-4">
							<div className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20">
								Watch Full Demo
							</div>
							<div className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors">
								View Source
							</div>
						</div>
					</div>
				</div>
			</PresentationSlide>
		</PresentationStage>
	);
}
