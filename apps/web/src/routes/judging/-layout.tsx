import { Button } from "@nexus/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { Separator } from "@nexus/ui/components/separator";
import { cn } from "@nexus/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";

interface JudgingLayoutProps {
	children: ReactNode;
	title: string;
	subtitle?: string;
	section: string;
	className?: string;
}

export function JudgingLayout({
	children,
	title,
	subtitle,
	section,
	className,
}: JudgingLayoutProps) {
	return (
		<div className={cn("min-h-screen bg-background antialiased", className)}>
			{/* Header */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40">
				<div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link to="/judging">
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
							>
								<ArrowLeftIcon className="size-4" />
								Back
							</Button>
						</Link>
						<Separator orientation="vertical" className="h-4 bg-border/40" />
						<div className="flex items-center gap-2.5">
							<img src="/assets/logo.png" alt="SignUIT" className="h-5 w-auto object-contain" />
							<span className="text-[10px] text-muted-foreground uppercase tracking-widest">
								Judging Panel · {section}
							</span>
						</div>
					</div>
					<Link to="/pitch" target="_blank">
						<Button
							variant="ghost"
							size="sm"
							className="gap-1.5 text-muted-foreground hover:text-foreground"
						>
							<ExternalLinkIcon className="size-3.5" />
							Pitch Deck
						</Button>
					</Link>
				</div>
			</header>

			{/* Content */}
			<main className="mx-auto max-w-6xl px-6 py-20 md:py-28">
				<div className="mb-20 md:mb-28 animate-fade-in">
					<h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-5 text-balance">
						{title}
					</h1>
					{subtitle && (
						<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed text-balance">
							{subtitle}
						</p>
					)}
				</div>
				{children}
			</main>

			{/* Footer */}
			<footer className="border-t border-border/40">
				<div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
					<span>SignUIT CollateralRouter — Hackathon Submission 2026</span>
					<span>signuit.com</span>
				</div>
			</footer>
		</div>
	);
}

export function JudgingSection({
	title,
	children,
	className,
	stagger = false,
}: {
	title: string;
	children: ReactNode;
	className?: string;
	stagger?: boolean;
}) {
	return (
		<section className={cn("mb-28 md:mb-36", className)}>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 text-balance">
				{title}
			</h2>
			<div className={cn("space-y-6", stagger && "stagger-children")}>{children}</div>
		</section>
	);
}

export function JudgingCard({
	title,
	children,
	className,
	index = 0,
}: {
	title?: string;
	children: ReactNode;
	className?: string;
	index?: number;
}) {
	const staggerClass = index > 0 ? `stagger-${Math.min(index, 8)}` : "";
	return (
		<Card
			className={cn(
				"border border-border/40 bg-card/40 backdrop-blur-sm animate-fade-in-up",
				staggerClass,
				"hover:-translate-y-0.5 hover:border-primary/15 transition-all duration-500",
				className,
			)}
		>
			{title && (
				<CardHeader className="pb-4">
					<CardTitle className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
						{title}
					</CardTitle>
				</CardHeader>
			)}
			<CardContent className={title ? "pt-0" : "pt-6"}>{children}</CardContent>
		</Card>
	);
}

export function Bullet({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-start gap-4">
			<div className="size-1 rounded-full bg-muted-foreground/40 mt-2.5 shrink-0" />
			<span className="text-muted-foreground leading-[1.7]">{children}</span>
		</div>
	);
}

export function Stat({
	value,
	label,
	index = 0,
}: {
	value: string;
	label: string;
	index?: number;
}) {
	const staggerClass = index > 0 ? `stagger-${Math.min(index, 8)}` : "";
	return (
		<div
			className={cn(
				"flex flex-col items-start p-6 bg-card/40 border border-border/40 rounded-xl animate-fade-in-up",
				staggerClass,
				"hover:border-primary/10 transition-all duration-500",
			)}
		>
			<span className="text-4xl font-semibold tracking-tighter text-foreground">{value}</span>
			<div className="w-8 h-px bg-border mt-3 mb-2" />
			<span className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</span>
		</div>
	);
}
