import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import {
	CheckCircleIcon,
	LayoutDashboardIcon,
	PlayIcon,
	ShieldCheckIcon,
	ZapIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DemoLaunchModal } from "../components/-demo-launch-modal";
import { SlideLayout } from "../components/-slide-layout";

const STEPS = [
	{
		label: "New Margin Call",
		sub: "$15M required",
		icon: "1",
		hint: "Issue a $15M margin call",
		href: "/dashboard/margin-calls",
		role: "institution" as const,
	},
	{
		label: "CTD Engine",
		sub: "3 seconds",
		icon: "2",
		hint: "Generate routing suggestion",
		href: "/dashboard/generate",
		role: "institution" as const,
	},
	{
		label: "Recommends",
		sub: "$15M USDC",
		icon: "3",
		hint: "Review the suggestion",
		href: "/dashboard/suggestions",
		role: "institution" as const,
	},
	{
		label: "Human Approves",
		sub: "Ops team",
		icon: "4",
		hint: "Approve the allocation",
		href: "/dashboard/suggestions",
		role: "institution" as const,
	},
	{
		label: "On-Chain Record",
		sub: "Immutable",
		icon: "✓",
		hint: "View audit trail",
		href: "/dashboard/audit",
		role: "institution" as const,
		final: true,
	},
];

const CARDS = [
	{
		icon: LayoutDashboardIcon,
		title: "Dashboard",
		desc: "$45.2M total collateral, pending approvals, recent allocations",
		badge: "Live",
	},
	{
		icon: ZapIcon,
		title: "Generate Suggestion",
		desc: "4-step wizard: margin call → CTD → recommendation → approval",
		badge: "3 sec",
	},
	{
		icon: ShieldCheckIcon,
		title: "Audit Trail",
		desc: "Immutable AllocationRecord on Canton ledger",
		badge: "On-chain",
	},
];

export function DemoSlide() {
	const [modalOpen, setModalOpen] = useState(false);
	const [hoveredStep, setHoveredStep] = useState<number | null>(null);
	const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

	const openStep = (i: number) => {
		setActiveStepIndex(i);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setActiveStepIndex(null);
	};

	const activeStep = activeStepIndex !== null ? STEPS[activeStepIndex] : null;

	return (
		<SlideLayout
			title="Live Demo"
			subtitle="6-page dashboard · Real-time Canton sandbox data"
			slideNumber={3}
			totalSlides={9}
		>
			{/* Top cards */}
			<div className="grid grid-cols-3 gap-4">
				{CARDS.map((card) => (
					<button
						key={card.title}
						type="button"
						onClick={() => {
							setActiveStepIndex(null);
							setModalOpen(true);
						}}
						className="group flex flex-col gap-3 p-5 rounded-xl border-2 border-primary/20 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left cursor-pointer"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<card.icon className="size-5 text-primary" />
								<h3 className="font-bold text-sm">{card.title}</h3>
							</div>
							<PlayIcon className="size-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
						</div>
						<p className="text-xs text-muted-foreground leading-snug">{card.desc}</p>
						<Badge variant="secondary" className="w-fit text-xs">
							{card.badge}
						</Badge>
					</button>
				))}
			</div>

			{/* Scenario flow */}
			<div className="mt-5 p-5 bg-muted/30 rounded-xl border border-dashed">
				<div className="flex items-center justify-between mb-6">
					<h3 className="font-bold text-base">Demo Scenario: $15M Margin Call</h3>
					<Button
						size="sm"
						onClick={() => {
							setActiveStepIndex(null);
							setModalOpen(true);
						}}
						className="gap-2 text-xs h-8"
					>
						<PlayIcon className="size-3" />
						Launch Live Demo
					</Button>
				</div>

				{/*
				  Step flow — 5 columns for circles, 4 connectors between them.
				  grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] keeps each
				  circle in its own fixed column and connectors between them.
				*/}
				<div
					className="grid items-center"
					style={{ gridTemplateColumns: "1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr" }}
				>
					{STEPS.map((step, i) => (
						<>
							{/* Circle */}
							<div key={`circle-${i}`} className="flex justify-center">
								<motion.button
									type="button"
									onClick={() => openStep(i)}
									onHoverStart={() => setHoveredStep(i)}
									onHoverEnd={() => setHoveredStep(null)}
									whileHover={{ scale: 1.15, y: -4 }}
									transition={{ type: "spring", stiffness: 380, damping: 20 }}
									className={`size-12 rounded-full flex items-center justify-center font-black text-base border-2 shrink-0 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary ${
										step.final
											? "bg-green-500 border-green-400 text-white"
											: hoveredStep === i
												? "bg-primary border-primary text-white"
												: "bg-card border-primary/50 text-primary"
									}`}
									title={step.hint}
								>
									{step.icon}
								</motion.button>
							</div>

							{/* Connector — only between circles, not after last */}
							{i < STEPS.length - 1 && (
								<div
									key={`line-${i}`}
									className={`h-px w-full transition-colors duration-300 ${
										hoveredStep !== null && hoveredStep > i ? "bg-primary" : "bg-border"
									}`}
								/>
							)}
						</>
					))}
				</div>

				{/* Labels row — same grid so labels align under circles */}
				<div
					className="grid mt-3"
					style={{ gridTemplateColumns: "1fr 40px 1fr 40px 1fr 40px 1fr 40px 1fr" }}
				>
					{STEPS.map((step, i) => (
						<>
							<button
								key={`label-${i}`}
								type="button"
								onClick={() => openStep(i)}
								onMouseEnter={() => setHoveredStep(i)}
								onMouseLeave={() => setHoveredStep(null)}
								className="flex flex-col items-center gap-0.5 px-1 cursor-pointer"
							>
								<span className="text-xs font-semibold text-center leading-tight">
									{step.label}
								</span>
								<span
									className={`text-[11px] text-center transition-colors duration-200 ${
										hoveredStep === i ? "text-primary font-semibold" : "text-muted-foreground"
									}`}
								>
									{step.sub}
								</span>
							</button>
							{/* Empty spacer for connector columns */}
							{i < STEPS.length - 1 && <div key={`spacer-${i}`} />}
						</>
					))}
				</div>
			</div>

			<div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
				<CheckCircleIcon className="size-3.5 text-green-500" />
				<span>Click any step to open that part of the demo · Multi-party views available</span>
			</div>

			<DemoLaunchModal
				open={modalOpen}
				onClose={closeModal}
				targetRole={activeStep?.role}
				targetHref={activeStep?.href}
				stepHint={activeStep?.hint}
			/>
		</SlideLayout>
	);
}
