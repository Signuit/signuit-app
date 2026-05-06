import { SidebarInset, SidebarProvider } from "@nexus/ui/components/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ensureSession } from "@/functions/ensure-session";

export const Route = createFileRoute("/_app")({
	ssr: false,
	head: () => ({
		meta: [
			{
				name: "robots",
				content: "noindex, nofollow",
			},
		],
	}),
	component: AppLayout,
	beforeLoad: async () => {
		const session = await ensureSession();
		return { session };
	},
});

function AppLayout() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "16rem",
					"--header-height": "3rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<AppHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col p-8">
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
