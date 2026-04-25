import { Skeleton } from "@nexus/ui/components/skeleton";
import { cn } from "@nexus/ui/lib/utils";
import { type LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend?: "up" | "down" | null;
	trendValue?: string;
	className?: string;
	loading?: boolean;
}

export function StatCard({
	title,
	value,
	icon: Icon,
	trend,
	trendValue,
	className,
	loading,
}: StatCardProps) {
	if (loading) {
		return (
			<div className={cn("flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm", className)}>
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="size-8 rounded-lg" />
				</div>
				<div className="flex items-end justify-between">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-4 w-12" />
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/5",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-muted-foreground">{title}</span>
				<div className="flex size-8 items-center justify-center rounded-lg bg-muted/50">
					<Icon className="size-4 text-muted-foreground" />
				</div>
			</div>
			<div className="flex items-end justify-between">
				<span className="text-2xl font-bold tracking-tight tabular-nums">{value}</span>
				{trendValue && (
					<div
						className={cn(
							"flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border",
							trend === "up"
								? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20"
								: trend === "down"
									? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20"
									: "bg-muted text-muted-foreground border-transparent",
						)}
					>
						{trend === "up" && <TrendingUpIcon className="size-3" />}
						{trend === "down" && <TrendingDownIcon className="size-3" />}
						{trendValue}
					</div>
				)}
			</div>
		</div>
	);
}
