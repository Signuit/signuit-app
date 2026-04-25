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
import { TeamSwitcher } from "@nexus/ui/components/team-switcher";
import { Link, linkOptions } from "@tanstack/react-router";
import {
	FileTextIcon,
	HistoryIcon,
	LayoutDashboardIcon,
	SettingsIcon,
	WalletIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type * as React from "react";
import { useEffect, useState } from "react";

const organizations = [
	{ id: "nexus", name: "Nexus Tech" },
	{ id: "finance", name: "Finance Team" },
	{ id: "dev", name: "Development" },
];

// Define navigation items with linkOptions for type safety
const mainNavItems = linkOptions([
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: <LayoutDashboardIcon />,
		activeOptions: { exact: true },
	},
	{
		to: "/dashboard/holdings",
		label: "Holdings",
		icon: <WalletIcon />,
		activeOptions: { exact: true },
	},
	{
		to: "/dashboard/suggestions",
		label: "Suggestions",
		icon: <FileTextIcon />,
		activeOptions: { exact: true },
	},
	{
		to: "/dashboard/policy",
		label: "Policy",
		icon: <SettingsIcon />,
		activeOptions: { exact: true },
	},
	{
		to: "/dashboard/audit",
		label: "Audit Trail",
		icon: <HistoryIcon />,
		activeOptions: { exact: true },
	},
]);

function TeamSwitcherGroup({
	organizations,
	currentOrganization,
	onOrganizationChange,
}: {
	organizations: { id: string; name: string }[];
	currentOrganization: { id: string; name: string };
	onOrganizationChange: (org: { id: string; name: string }) => void;
}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Teams</SidebarGroupLabel>
			<SidebarGroupContent>
				<TeamSwitcher
					organizations={organizations}
					currentOrganization={currentOrganization}
					onOrganizationChange={onOrganizationChange}
				/>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavMainItems() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Main</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{mainNavItems.map((item) => (
						<SidebarMenuItem key={item.label}>
							<Link {...item} preload="intent">
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
	const user = {
		name: "User",
		email: "user@example.com",
		avatar: "/avatars/user.jpg",
	};
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [currentOrganization, setCurrentOrganization] = useState(organizations[0]);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && resolvedTheme === "dark";

	const handleOrganizationChange = (org: { id: string; name: string }) => {
		setCurrentOrganization(org);
	};

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
				<TeamSwitcherGroup
					organizations={organizations}
					currentOrganization={currentOrganization}
					onOrganizationChange={handleOrganizationChange}
				/>
				<NavMainItems />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
