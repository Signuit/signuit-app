"use client";

import { Button } from "@nexus/ui/components/button";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface PresentationStageProps {
	children: React.ReactNode[];
	title: string;
}

export function PresentationStage({ children, title }: PresentationStageProps) {
	const [currentSlide, setCurrentSlide] = useState(0);

	const nextSlide = () => {
		if (currentSlide < children.length - 1) {
			setCurrentSlide(currentSlide + 1);
		}
	};

	const prevSlide = () => {
		if (currentSlide > 0) {
			setCurrentSlide(currentSlide - 1);
		}
	};

	return (
		<div className="relative flex flex-col h-[calc(100vh-12rem)] w-full overflow-hidden bg-background/50 backdrop-blur-xl border-2 border-primary/10 rounded-3xl shadow-2xl">
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-primary/5 bg-background/40">
				<div className="flex items-center gap-4">
					<Link to="/judging">
						<Button variant="ghost" size="icon" className="rounded-full">
							<Home className="size-5" />
						</Button>
					</Link>
					<h2 className="text-xl font-bold tracking-tight text-primary/80">{title}</h2>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm font-mono text-muted-foreground mr-4">
						{currentSlide + 1} / {children.length}
					</span>
					<Button
						variant="outline"
						size="icon"
						onClick={prevSlide}
						disabled={currentSlide === 0}
						className="rounded-full border-primary/20 hover:bg-primary/5"
					>
						<ChevronLeft className="size-5" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={nextSlide}
						disabled={currentSlide === children.length - 1}
						className="rounded-full border-primary/20 hover:bg-primary/5"
					>
						<ChevronRight className="size-5" />
					</Button>
				</div>
			</div>

			{/* Slide Content */}
			<div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 md:p-12">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentSlide}
						initial={{ opacity: 0, x: 20, scale: 0.98 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: -20, scale: 1.02 }}
						transition={{ duration: 0.4, ease: "circOut" }}
						className="w-full h-full flex flex-col items-center justify-center"
					>
						{children[currentSlide]}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Progress Bar */}
			<div className="h-1.5 w-full bg-primary/5">
				<motion.div
					className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
					initial={{ width: 0 }}
					animate={{ width: `${((currentSlide + 1) / children.length) * 100}%` }}
					transition={{ duration: 0.5, ease: "easeInOut" }}
				/>
			</div>
		</div>
	);
}
