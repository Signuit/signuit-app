"use client";

import { cn } from "@nexus/ui/lib/utils";
import type React from "react";

interface PresentationSlideProps {
	children: React.ReactNode;
	title?: string;
	description?: string;
	className?: string;
}

export function PresentationSlide({
	children,
	title,
	description,
	className,
}: PresentationSlideProps) {
	return (
		<div className={cn("flex flex-col items-center text-center w-full max-w-4xl", className)}>
			{(title || description) && (
				<div className="mb-12 space-y-4">
					{title && (
						<h3 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/40 uppercase">
							{title}
						</h3>
					)}
					{description && (
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							{description}
						</p>
					)}
				</div>
			)}
			<div className="w-full flex-1 flex flex-col items-center justify-center">{children}</div>
		</div>
	);
}
