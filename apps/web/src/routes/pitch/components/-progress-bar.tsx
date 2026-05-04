import { cn } from "@nexus/ui/lib/utils";

interface ProgressBarProps {
	current: number;
	total: number;
	className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
	const progress = total > 0 ? (current / total) * 100 : 0;

	return (
		<div className={cn("w-full h-1 bg-muted rounded-full overflow-hidden", className)}>
			<div
				className="h-full bg-primary transition-all duration-500 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}

interface SlideDotsProps {
	current: number;
	total: number;
	className?: string;
}

export function SlideDots({ current, total, className }: SlideDotsProps) {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			{Array.from({ length: total }, (_, i) => (
				<button
					key={i}
					type="button"
					className={cn(
						"size-2 rounded-full transition-all duration-300",
						i + 1 === current
							? "bg-primary w-6"
							: i + 1 < current
								? "bg-primary/50"
								: "bg-muted-foreground/20",
					)}
					aria-label={`Go to slide ${i + 1}`}
				/>
			))}
		</div>
	);
}
