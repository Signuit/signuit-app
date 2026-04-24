import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export type UserRole = "institution" | "counterparty" | "operator";

export function useAuthRole() {
	const { data: session, isLoading } = useQuery(orpc.auth.getSession.queryOptions());

	const user = session?.user as { role?: UserRole } | undefined;
	const role: UserRole = user?.role ?? "institution";

	return { role, isLoading };
}

export function useIsDemo() {
	const { data: session } = useQuery(orpc.auth.getSession.queryOptions());

	return session?.user?.email?.includes("@signuit.app") ?? false;
}
