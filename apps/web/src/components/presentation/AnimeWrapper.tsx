"use client";

import { animate } from "animejs";
import type React from "react";
import { useEffect, useRef } from "react";

interface AnimeWrapperProps {
	children?: React.ReactNode;
	animationConfig?: any; // v4 types are complex, using any for now to fix the build quickly
	className?: string;
}

export function AnimeWrapper({ children, animationConfig, className }: AnimeWrapperProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current && animationConfig) {
			const elements = containerRef.current.querySelectorAll(".anime-el");
			if (elements.length > 0) {
				animate(elements, animationConfig);
			} else {
				// Fallback if no specific children have the class, animate the container itself
				animate(containerRef.current, animationConfig);
			}
		}
	}, [animationConfig]);

	return (
		<div ref={containerRef} className={className}>
			{children}
		</div>
	);
}

// Utility component to mark elements for animation
export function AnimeEl({
	children,
	className,
	as: Component = "div",
}: {
	children: React.ReactNode;
	className?: string;
	as?: any;
}) {
	return <Component className={`anime-el ${className || ""}`}>{children}</Component>;
}
