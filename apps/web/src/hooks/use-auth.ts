import type { SessionUser } from "@nexus/auth";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export type UserRole = "institution" | "counterparty" | "operator";

export function useAuthRole() {
	const { data: session, isLoading } = useQuery(orpc.auth.getSession.queryOptions());

	const user = session?.user as SessionUser | undefined;
	const role = user?.role as UserRole | undefined;

	return { role, isLoading };
}

export function useIsDemo() {
	const { data: session } = useQuery(orpc.auth.getSession.queryOptions());
	const user = session?.user as SessionUser | undefined;
	return user?.email?.includes("@signuit.app") ?? false;
}
