import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export type UserRole = "institution" | "counterparty" | "operator";

export function useAuthRole() {
	const { data: session, isLoading } = useQuery(orpc.auth.getSession.queryOptions());

	const userEmail = session?.user?.email;

	const role: UserRole = userEmail?.includes("demo-vantage@signuit.app")
		? "institution"
		: userEmail?.includes("demo-primebank@signuit.app")
			? "counterparty"
			: userEmail?.includes("demo-operator@signuit.app")
				? "operator"
				: "institution";

	return { role, userEmail, isLoading };
}

export function useIsDemo() {
	const { data: session } = useQuery(orpc.auth.getSession.queryOptions());

	return session?.user?.email?.includes("@signuit.app") ?? false;
}
