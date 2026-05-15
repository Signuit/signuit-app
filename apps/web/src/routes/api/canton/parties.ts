import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/canton/parties")({
	server: {
		handlers: {
			GET: async () => {
				const cantonUrl = process.env.CANTON_API_URL ?? "http://canton-sandbox:7575";
				try {
					const res = await fetch(`${cantonUrl}/v2/parties`);
					if (!res.ok)
						return new Response(JSON.stringify({ partyDetails: [] }), {
							status: 200,
							headers: { "Content-Type": "application/json" },
						});
					const data = await res.json();
					return new Response(JSON.stringify(data), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch {
					return new Response(JSON.stringify({ partyDetails: [] }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
		},
	},
});
