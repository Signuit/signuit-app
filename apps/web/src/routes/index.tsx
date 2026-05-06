import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { LandingPage } from "@/components/landing/landing-page";

export const Route = createFileRoute("/")({
	loader: async () => {
		return {
			title: "SignUIT | Policy-Based Collateral Routing Recommendation Engine",
			description:
				"SignUIT is a policy-based collateral routing recommendation engine on Canton Network, enabling institutional-grade efficiency with human-in-the-loop oversight.",
			image: "https://signuit.com/assets/logo.png",
			url: "https://signuit.com",
		};
	},
	head: ({ loaderData }) => {
		const title = loaderData?.title ?? "SignUIT";
		const description =
			loaderData?.description ?? "SignUIT - Collateral Routing Recommendation Engine";
		const image = loaderData?.image ?? "https://signuit.com/assets/logo.png";
		const url = loaderData?.url ?? "https://signuit.com";

		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				// Open Graph
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:image", content: image },
				{ property: "og:url", content: url },
				{ property: "og:type", content: "website" },
				// Twitter
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: image },
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "SignUIT",
						url: "https://signuit.com",
						logo: "https://signuit.com/assets/logo.png",
						description: description,
						sameAs: ["https://twitter.com/signuit", "https://linkedin.com/company/signuit"],
					}),
				},
			],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { setTheme } = useTheme();

	useEffect(() => {
		setTheme("dark");
	}, [setTheme]);

	return <LandingPage />;
}
