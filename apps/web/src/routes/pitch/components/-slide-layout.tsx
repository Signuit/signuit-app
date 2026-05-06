import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { cn } from "@nexus/ui/lib/utils";
import type { ReactNode } from "react";

interface SlideLayoutProps {
	children: ReactNode;
	title: string;
	subtitle?: string;
	slideNumber: number;
	totalSlides: number;
	className?: string;
}

export function SlideLayout({
	children,
	title,
	subtitle,
	slideNumber,
	totalSlides,
	className,
}: SlideLayoutProps) {
	return (
		<div
			className={cn(
				"flex flex-col h-screen w-full bg-background text-foreground",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between px-8 py-4 border-b">
				<div className="flex items-center gap-3">
					<img
						src="/assets/logo.png"
						alt="SignUIT"
						className="h-8 w-auto object-contain"
					/>
				</div>
				<div className="text-xs text-muted-foreground font-medium">
					{slideNumber} / {totalSlides}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col items-center justify-center px-12 py-8">
				<div className="w-full max-w-5xl">
					<div className="mb-8 text-center">
						<h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
						{subtitle && (
							<p className="text-lg text-muted-foreground">{subtitle}</p>
						)}
					</div>
					{children}
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between px-8 py-4 border-t text-xs text-muted-foreground">
				<span>signuit.com</span>
				<span>Hackathon Submission 2026</span>
			</div>
		</div>
	);
}

export function SlideCard({
	children,
	className,
	title,
}: {
	children: ReactNode;
	className?: string;
	title?: string;
}) {
	return (
		<Card className={cn("shadow-sm", className)}>
			{title && (
				<CardHeader className="pb-3">
					<CardTitle className="text-lg font-semibold">{title}</CardTitle>
				</CardHeader>
			)}
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export function StatBox({
	value,
	label,
}: {
	value: string;
	label: string;
}) {
	return (
		<div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg border">
			<span className="text-3xl font-bold text-primary">{value}</span>
			<span className="text-sm text-muted-foreground mt-1">{label}</span>
		</div>
	);
}

export function BulletPoint({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-start gap-3">
			<div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
			<span className="text-muted-foreground">{children}</span>
		</div>
	);
}
