import { Toaster } from "@nexus/ui/components/sonner";
import { ThemeProvider } from "@nexus/ui/components/theme-provider";
import { TooltipProvider } from "@nexus/ui/components/tooltip";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { orpc } from "@/utils/orpc";

import "../index.css";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
	session: { user: { id: string; email: string; role?: string } } | null;
}

export async function getSession(context: RouterAppContext) {
	return context.queryClient.ensureQueryData(context.orpc.auth.getSession.queryOptions());
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "SignUIT - Collateral Routing Recommendation Engine",
			},
			{
				name: "description",
				content:
					"SignUIT is a policy-based collateral routing recommendation engine on Canton Network, enabling institutional-grade efficiency with human-in-the-loop oversight.",
			},
		],
		links: [],
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<TooltipProvider>
						<div className="">
							<Outlet />
						</div>
						<Toaster richColors />
						<TanStackRouterDevtools position="bottom-right" />
						<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
						<Scripts />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
