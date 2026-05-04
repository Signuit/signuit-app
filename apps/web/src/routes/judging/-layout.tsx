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
			<header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
				<div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link to="/judging">
							<Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
								<ArrowLeftIcon className="size-4" />
								Back
							</Button>
						</Link>
						<Separator orientation="vertical" className="h-4 bg-border/50" />
						<div className="flex items-center gap-2.5">
							<img
								src="/assets/logo.png"
								alt="SignUIT"
								className="h-6 w-auto object-contain"
							/>
							<span className="text-xs text-muted-foreground">
								Judging Panel · {section}
							</span>
						</div>
					</div>
					<Link to="/pitch" target="_blank">
						<Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
							<ExternalLinkIcon className="size-3.5" />
							Pitch Deck
						</Button>
					</Link>
				</div>
			</header>

			{/* Content */}
			<main className="mx-auto max-w-6xl px-6 py-16 md:py-20">
				<div className="mb-16 md:mb-20">
					<h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
						{title}
					</h1>
					{subtitle && (
						<p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
							{subtitle}
						</p>
					)}
				</div>
				{children}
			</main>

			{/* Footer */}
			<footer className="border-t border-border/50">
				<div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
					<span>SignUIT CollateralRouter — Hackathon Submission 2026</span>
					<span>signuit.org</span>
				</div>
			</footer>
		</div>
	);
}

export function JudgingSection({
	title,
	children,
	className,
}: {
	title: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("mb-20 md:mb-24", className)}>
			<h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">
				{title}
			</h2>
			<div className="space-y-6">{children}</div>
		</section>
	);
}

export function JudgingCard({
	title,
	children,
	className,
}: {
	title?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<Card className={cn("border border-border/50 bg-card/50 backdrop-blur-sm", className)}>
			{title && (
				<CardHeader className="pb-4">
					<CardTitle className="text-base font-semibold text-muted-foreground tracking-wide uppercase text-xs">
						{title}
					</CardTitle>
				</CardHeader>
			)}
			<CardContent className={title ? "pt-0" : "pt-6"}>
				{children}
			</CardContent>
		</Card>
	);
}

export function Bullet({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-start gap-4">
			<div className="size-1 rounded-full bg-muted-foreground/50 mt-2.5 shrink-0" />
			<span className="text-muted-foreground leading-relaxed">{children}</span>
		</div>
	);
}

export function Stat({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col items-start p-5 bg-card/50 border border-border/50 rounded-lg">
			<span className="text-3xl font-semibold tracking-tight text-foreground">{value}</span>
			<span className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">{label}</span>
		</div>
	);
}
