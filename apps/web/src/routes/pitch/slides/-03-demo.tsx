import { Button } from "@nexus/ui/components/button";
import { motion, AnimatePresence } from "motion/react";
import {
	CheckCircleIcon,
	ExternalLinkIcon,
	PlayIcon,
} from "lucide-react";
import { useState } from "react";
import DecryptedText from "@/components/DecryptedText";
import BlurText from "@/components/BlurText";
import { demoLogin } from "@/lib/auth-client";
import { SlideLayout } from "../components/-slide-layout";

const STEPS = [
	{
		label: "New Margin Call",
		sub: "$15M · 2hr deadline",
		icon: "1",
		role: "counterparty" as const,
		href: "/dashboard/margin-calls",
		who: "PrimeBank",
		desc: "PrimeBank issues a $15M margin call to VantageCapital with a 2-hour deadline.",
	},
	{
		label: "CTD Engine",
		sub: "3 seconds",
		icon: "2",
		role: "institution" as const,
		href: "/dashboard/generate",
		who: "VantageCapital",
		desc: "Cheapest-to-Deliver algorithm evaluates all holdings. Picks $15M USDC — zero yield cost.",
	},
	{
		label: "Suggestion",
		sub: "$15M USDC",
		icon: "3",
		role: "institution" as const,
		href: "/dashboard/suggestions",
		who: "VantageCapital",
		desc: "RoutingSuggestion contract recorded on Canton. $2,300/day yield preserved by keeping USYC & UST.",
	},
	{
		label: "Human Approves",
		sub: "Ops team",
		icon: "4",
		role: "institution" as const,
		href: "/dashboard/suggestions",
		who: "VantageCapital",
		desc: "Ops team reviews and clicks Approve. No operator override possible — institution controls this.",
	},
	{
		label: "Audit Trail",
		sub: "On Canton",
		icon: "✓",
		role: "institution" as const,
		href: "/dashboard/audit",
		who: "VantageCapital",
		desc: "Immutable AllocationRecord created on-ledger. Who approved, when, what assets, cost in bps.",
		final: true,
	},
];

type StepState = "idle" | "loading" | "done" | "error";

export function DemoSlide() {
	const [stepStates, setStepStates] = useState<Record<number, StepState>>({});
	const [hoveredStep, setHoveredStep] = useState<number | null>(null);
	const [selectedStep, setSelectedStep] = useState<number | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const setStepState = (i: number, state: StepState) =>
		setStepStates((prev) => ({ ...prev, [i]: state }));

	// Daire tıklanınca: sadece login yap + detay paneli aç, sekme açma
	const handleStepClick = async (i: number) => {
		const step = STEPS[i];
		if (stepStates[i] === "loading") return;

		setSelectedStep(i);
		setErrorMsg(null);
		setStepState(i, "loading");

		try {
			await demoLogin(step.role);
			setStepState(i, "done");
		} catch (err) {
			setStepState(i, "error");
			setErrorMsg(err instanceof Error ? err.message : "Login failed");
			setTimeout(() => setStepState(i, "idle"), 3000);
		}
	};

	// Detay panelindeki "Open as ..." butonu: sekmeyi açar
	const handleOpenTab = (i: number) => {
		const step = STEPS[i];
		window.open(step.href, "_blank");
	};

	const activeStep = selectedStep !== null ? STEPS[selectedStep] : null;

	return (
		<SlideLayout
			title=""
			subtitle=""
			slideNumber={3}
			totalSlides={9}
		>
			{/* Custom title with DecryptedText */}
			<div className="mb-6 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-2">
					<DecryptedText
						text="Live Demo"
						animateOn="view"
						speed={40}
						maxIterations={8}
						sequential
						revealDirection="start"
						className="text-foreground"
						encryptedClassName="text-primary/40"
					/>
				</h1>
				<BlurText
					text="Click any step — opens instantly in a new tab"
					className="text-lg text-muted-foreground"
					delay={60}
					animateBy="words"
					direction="top"
				/>
			</div>

			{/* Step flow */}
			<div className="p-6 bg-muted/20 rounded-2xl border border-border">

				{/* Circles + connectors */}
				<div
					className="grid items-center"
					style={{ gridTemplateColumns: "1fr 48px 1fr 48px 1fr 48px 1fr 48px 1fr" }}
				>
					{STEPS.map((step, i) => {
						const state = stepStates[i] ?? "idle";
						const isHovered = hoveredStep === i;
						return (
							<>
								<div key={`c-${i}`} className="flex justify-center">
									<motion.button
										type="button"
										onClick={() => handleStepClick(i)}
										onHoverStart={() => setHoveredStep(i)}
										onHoverEnd={() => setHoveredStep(null)}
										whileHover={{ scale: 1.12, y: -4 }}
										whileTap={{ scale: 0.95 }}
										transition={{ type: "spring", stiffness: 400, damping: 20 }}
										disabled={state === "loading"}
										className={`size-16 rounded-full flex items-center justify-center font-black text-lg border-2 shrink-0 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-wait ${
											state === "error"
												? "bg-destructive/10 border-destructive text-destructive"
												: state === "done"
													? "bg-green-500/20 border-green-500 text-green-500"
													: step.final
														? "bg-green-500 border-green-400 text-white"
														: isHovered || selectedStep === i
															? "bg-primary border-primary text-white"
															: "bg-card border-primary/50 text-primary"
										}`}
									>
										{state === "loading" ? (
											<div className="size-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
										) : state === "done" && !step.final ? (
											<CheckCircleIcon className="size-6" />
										) : (
											step.icon
										)}
									</motion.button>
								</div>

								{i < STEPS.length - 1 && (
									<motion.div
										key={`l-${i}`}
										className="h-0.5 w-full rounded-full transition-colors duration-300"
										style={{
											backgroundColor:
												stepStates[i] === "done"
													? "hsl(var(--primary))"
													: isHovered
														? "hsl(var(--primary) / 0.5)"
														: "hsl(var(--border))",
										}}
									/>
								)}
							</>
						);
					})}
				</div>

				{/* Labels */}
				<div
					className="grid mt-3"
					style={{ gridTemplateColumns: "1fr 48px 1fr 48px 1fr 48px 1fr 48px 1fr" }}
				>
					{STEPS.map((step, i) => (
						<>
							<button
								key={`lb-${i}`}
								type="button"
								onClick={() => handleStepClick(i)}
								onMouseEnter={() => setHoveredStep(i)}
								onMouseLeave={() => setHoveredStep(null)}
								className="flex flex-col items-center gap-0.5 cursor-pointer group"
							>
								<span className={`text-xs font-bold text-center leading-tight transition-colors duration-200 ${selectedStep === i || hoveredStep === i ? "text-primary" : "text-foreground"}`}>
									{step.label}
								</span>
								<span className="text-[11px] text-muted-foreground text-center">{step.sub}</span>
								<span className={`text-[10px] font-medium transition-colors duration-200 ${step.role === "counterparty" ? "text-orange-400" : "text-primary/70"}`}>
									{step.who}
								</span>
							</button>
							{i < STEPS.length - 1 && <div key={`sp-${i}`} />}
						</>
					))}
				</div>

				{/* Detail panel */}
				<AnimatePresence mode="wait">
					{activeStep && (
						<motion.div
							key={selectedStep}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={{ duration: 0.2 }}
							className="mt-5 flex items-start justify-between gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5"
						>
							<div className="flex items-start gap-3">
								<div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0 mt-0.5">
									{activeStep.icon}
								</div>
								<div>
									<p className="text-sm font-bold mb-0.5">{activeStep.label}
										<span className={`ml-2 text-xs font-medium ${activeStep.role === "counterparty" ? "text-orange-400" : "text-primary/70"}`}>
											— {activeStep.who}
										</span>
									</p>
									<p className="text-xs text-muted-foreground leading-snug">{activeStep.desc}</p>
								</div>
							</div>
							<Button
								size="sm"
								variant="outline"
								className="shrink-0 gap-1.5 text-xs"
								onClick={() => handleOpenTab(selectedStep!)}
								disabled={stepStates[selectedStep!] === "loading"}
							>
								{stepStates[selectedStep!] === "loading" ? (
									<div className="size-3 border-2 border-primary border-t-transparent animate-spin rounded-full" />
								) : (
									<ExternalLinkIcon className="size-3" />
								)}
								Open as {activeStep.who}
							</Button>
						</motion.div>
					)}

					{!activeStep && (
						<motion.p
							key="hint"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="mt-5 text-center text-xs text-muted-foreground/50 italic"
						>
							Click any step above to open that part of the demo
						</motion.p>
					)}
				</AnimatePresence>

				{errorMsg && (
					<p className="mt-3 text-xs text-destructive text-center bg-destructive/10 rounded-lg p-2">
						{errorMsg} — is the Canton sandbox running?
					</p>
				)}
			</div>

			{/* Footer row */}
			<div className="mt-4 flex items-center justify-between">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<CheckCircleIcon className="size-3.5 text-green-500" />
					<span>Multi-party: Institution + Counterparty + Operator</span>
				</div>
				<Button
					size="sm"
					variant="ghost"
					className="gap-2 text-xs h-7"
					onClick={() => window.open("/dashboard", "_blank")}
				>
					<PlayIcon className="size-3" />
					Open Full Dashboard
				</Button>
			</div>
		</SlideLayout>
	);
}
