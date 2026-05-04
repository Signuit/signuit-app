import { createFileRoute, Navigate } from "@tanstack/react-router";

// This route is not in use. Redirect to the Network Participants page.
export const Route = createFileRoute("/_app/dashboard/users/settings")({
	component: () => <Navigate to="/dashboard/users" />,
});
