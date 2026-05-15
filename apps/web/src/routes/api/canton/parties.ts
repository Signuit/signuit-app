import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start/server";

export const Route = createFileRoute("/api/canton/parties")({
	component: () => null,
});

export const ServerRoute = {
	GET: async () => {
		const cantonUrl = process.env.CANTON_API_URL ?? "http://canton-sandbox:7575";
		try {
			const res = await fetch(`${cantonUrl}/v2/parties`);
			if (!res.ok) return json({ partyDetails: [] }, { status: 200 });
			const data = await res.json();
			return json(data, { status: 200 });
		} catch {
			return json({ partyDetails: [] }, { status: 200 });
		}
	},
};
