"use client";

import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nexus/ui/components/popover";
import { Separator } from "@nexus/ui/components/separator";
import { SidebarTrigger } from "@nexus/ui/components/sidebar";
import { ThemeToggle } from "@nexus/ui/components/theme-toggle";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BellIcon } from "lucide-react";
import { useAuthRole } from "@/hooks/use-auth";
import { useAuditTrail, useMarginCalls } from "@/hooks/use-collateral-api";

const ROUTE_TITLES: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/dashboard/holdings": "Holdings",
	"/dashboard/suggestions": "Routing Suggestions",
	"/dashboard/generate": "Generate Route",
	"/dashboard/policy": "Policy",
	"/dashboard/audit": "Audit Trail",
	"/dashboard/margin-calls": "Margin Calls",
	"/dashboard/settings": "Settings",
};

function MarginCallNotifications() {
	const { role } = useAuthRole();
	const { data: marginCalls } = useMarginCalls();
	const { data: allocations } = useAuditTrail();
	const navigate = useNavigate();

	// Only institution role sees incoming margin calls
	if (role !== "institution") return null;

	// Build set of callIds that already have an AllocationRecord
	const respondedIds = new Set(
		(allocations ?? []).map((a) => a.payload?.marginCallId as string | undefined).filter(Boolean),
	);

	const pending = (marginCalls ?? []).filter((m) => {
		const callId = m.payload?.callId as string | undefined;
		const status = m.payload?.status as string | undefined;
		return status === "RoutePending" && !respondedIds.has(callId ?? "");
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative size-8">
					<BellIcon className="size-4" />
					{pending.length > 0 && (
						<span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
							{pending.length > 9 ? "9+" : pending.length}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
				<div className="flex items-center justify-between px-4 py-3 border-b">
					<p className="text-sm font-semibold">Notifications</p>
					{pending.length > 0 && (
						<Badge variant="secondary" className="text-[10px]">
							{pending.length} pending
						</Badge>
					)}
				</div>

				{pending.length === 0 ? (
					<div className="flex flex-col items-center py-8 text-center px-4">
						<BellIcon className="size-8 text-muted-foreground/30 mb-2" />
						<p className="text-sm text-muted-foreground">No pending margin calls</p>
						<p className="text-[11px] text-muted-foreground/60 mt-0.5">
							You'll be notified when a counterparty issues one
						</p>
					</div>
				) : (
					<div className="flex flex-col divide-y divide-border">
						{pending.map((m) => {
							const callId = m.payload?.callId as string | undefined;
							const amountRequired = m.payload?.amountRequired as string | undefined;
							const counterparty = m.payload?.counterparty as string | undefined;
							const currency = m.payload?.currency as string | undefined;
							const dueBy = m.payload?.dueBy as string | undefined;
							return (
								<div
									key={m.contractId}
									className="px-4 py-3 flex items-start justify-between gap-3"
								>
									<div className="flex flex-col gap-0.5 min-w-0">
										<div className="flex items-center gap-1.5">
											<div className="size-1.5 rounded-full bg-primary shrink-0" />
											<p className="text-xs font-semibold text-foreground truncate">
												Margin Call from {counterparty?.split("::")[0] ?? "counterparty"}
											</p>
										</div>
										<p className="text-sm font-bold">
											${(parseFloat(amountRequired || "0") / 1_000_000).toFixed(1)}M{" "}
											<span className="text-xs font-normal text-muted-foreground">{currency}</span>
										</p>
										<p className="font-mono text-[10px] text-muted-foreground">
											{callId ?? m.contractId.slice(0, 12)}
											{dueBy
												? ` · Due ${new Date(dueBy).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
												: ""}
										</p>
									</div>
									<Button
										size="sm"
										className="h-7 px-2.5 text-xs font-semibold shrink-0"
										onClick={() =>
											navigate({
												to: "/dashboard/generate",
												search: {
													marginCallId: callId ?? "",
													amount: amountRequired ?? "0",
													counterparty: counterparty?.split("::")[0] ?? "",
												},
											})
										}
									>
										Respond
									</Button>
								</div>
							);
						})}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

export function AppHeader() {
	const location = useRouterState({ select: (s) => s.location });
	const pageTitle = ROUTE_TITLES[location.pathname] ?? "SignUIT";

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
				<div className="flex items-center gap-1">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
					<span className="text-sm font-medium text-foreground/80">{pageTitle}</span>
				</div>
				<div className="flex items-center gap-1">
					<MarginCallNotifications />
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
