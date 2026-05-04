import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/presentations")({
	component: PresentationsLayout,
});

function PresentationsLayout() {
	return (
		<div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
			<div className="flex flex-1 flex-col w-full max-w-[1400px] mx-auto relative">
				<Outlet />
			</div>
		</div>
	);
}
