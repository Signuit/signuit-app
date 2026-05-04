"use client";

import { NavUser } from "@nexus/ui/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@nexus/ui/components/sidebar";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	FileTextIcon,
	LayoutDashboardIcon,
	PresentationIcon,
	SettingsIcon,
	ShieldCheckIcon,
	WalletIcon,
	ZapIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuthRole } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { nexus } from "@/lib/nexus-client";

// Navigation Items Mapping
function getNavItemsForRole(role: string) {
	const baseItems = [
		{
			to: "/dashboard" as const,
			label: "Dashboard",
			icon: <LayoutDashboardIcon />,
			activeOptions: { exact: true },
		},
		{
			to: "/presentations" as const,
			label: "Presentations",
			icon: <PresentationIcon />,
			activeOptions: { exact: false },
		},
	];

	if (role === "institution") {
		return [
			...baseItems,
			{
				to: "/dashboard/holdings" as const,
				label: "Holdings",
				icon: <WalletIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/suggestions" as const,
				label: "Suggestions",
				icon: <FileTextIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/generate" as const,
				label: "Generate Route",
				icon: <ZapIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/policy" as const,
				label: "Policy",
				icon: <SettingsIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/audit" as const,
				label: "Audit Trail",
				icon: <ShieldCheckIcon />,
				activeOptions: { exact: true },
			},
		];
	}

	if (role === "counterparty") {
		return [
			...baseItems,
			{
				to: "/dashboard/suggestions" as const,
				label: "Margin Calls",
				icon: <FileTextIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/audit" as const,
				label: "Audit Trail",
				icon: <ShieldCheckIcon />,
				activeOptions: { exact: true },
			},
		];
	}

	if (role === "operator") {
		return [
			...baseItems,
			{
				to: "/dashboard/holdings" as const,
				label: "Network Holdings",
				icon: <WalletIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/suggestions" as const,
				label: "All Suggestions",
				icon: <FileTextIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/policy" as const,
				label: "All Policies",
				icon: <SettingsIcon />,
				activeOptions: { exact: true },
			},
			{
				to: "/dashboard/audit" as const,
				label: "Network Audit",
				icon: <ShieldCheckIcon />,
				activeOptions: { exact: true },
			},
		];
	}

	return baseItems;
}

function NavMainItems({ role }: { role: string }) {
	const items = useMemo(() => getNavItemsForRole(role), [role]);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Main</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.label}>
							<Link {...(item as any)} preload="intent">
								{({ isActive }) => (
									<SidebarMenuButton tooltip={item.label} isActive={isActive}>
										{item.icon}
										<span>{item.label}</span>
									</SidebarMenuButton>
								)}
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: sessionData } = nexus.auth.useSession() as any;
	const { role } = useAuthRole();
	const logout = nexus.auth.useLogout();
	const navigate = useNavigate();

	const user = {
		name: sessionData?.user?.name || "Guest",
		email: sessionData?.user?.email || "",
		avatar: sessionData?.user?.image || "/avatars/user.jpg",
		role: (sessionData?.user?.role as string) || role || "institution",
	};

	const handleLogout = async () => {
		// Step 1: Sign out from Better Auth
		await authClient.signOut();

		// Step 2: Clear Nexus session
		logout.mutate(undefined, {
			onSuccess: () => {
				navigate({ to: "/login" });
			},
		});
	};

	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && resolvedTheme === "dark";

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Link to="/">
							{({ isActive }) => (
								<SidebarMenuButton isActive={isActive} className="py-5">
									<img
										src={isDark ? "/assets/logo_white.png" : "/assets/logo_black.png"}
										alt="Nexus Logo"
										className="h-10 w-auto object-contain"
									/>
								</SidebarMenuButton>
							)}
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMainItems role={user.role} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={user}
					onLogout={handleLogout}
					onAccountClick={() => navigate({ to: "/dashboard/settings" })}
					onBillingClick={() => navigate({ to: "/dashboard/settings" })}
					onNotificationsClick={() => navigate({ to: "/dashboard/settings" })}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
