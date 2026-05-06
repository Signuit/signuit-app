import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<HomeLayout {...baseOptions()}>
			<main className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center gap-6">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium text-fd-muted-foreground">
					Canton Ledger × React × TanStack Query
				</div>

				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl max-w-2xl">
					Build Canton dApps without the{" "}
					<span className="text-fd-primary">Integration Tax</span>
				</h1>

				<p className="text-fd-muted-foreground max-w-xl text-lg">
					Nexus Framework is a type-safe SDK that bridges the Canton JSON Ledger API v2 with React
					and TanStack Query. Powering{" "}
					<a
						href="https://signuit.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-fd-primary underline underline-offset-4"
					>
						SignUIT
					</a>{" "}
					— institutional collateral routing on Canton Network.
				</p>

				<div className="flex flex-wrap gap-3 justify-center">
					<Link
						to="/docs/$"
						params={{ _splat: "getting-started/installation" }}
						className="px-5 py-2.5 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm"
					>
						Get Started →
					</Link>
					<Link
						to="/docs/$"
						params={{ _splat: "" }}
						className="px-5 py-2.5 rounded-lg border font-medium text-sm hover:bg-fd-muted"
					>
						Read the Docs
					</Link>
				</div>

				{/* Framework feature cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl w-full text-left">
					<FeatureCard
						icon="⚡"
						title="Zero Boilerplate Auth"
						description="Sandbox HMAC256, JWT, and OIDC in one config line. Auto-refresh included."
					/>
					<FeatureCard
						icon="🔄"
						title="TanStack Query Integration"
						description="Type-safe queryOptions, smart cache invalidation by Daml template ID."
					/>
					<FeatureCard
						icon="🖥️"
						title="SSR Ready"
						description="Server Components, Server Actions, and HydrationBoundary — out of the box."
					/>
				</div>

				{/* SignUIT real-world section */}
				<div className="mt-16 w-full max-w-3xl">
					<div className="rounded-2xl border bg-fd-card px-8 py-10 text-left">
						<div className="flex items-center gap-3 mb-4">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
								Real-world example
							</span>
						</div>
						<h2 className="text-xl font-bold mb-2">
							SignUIT — Collateral Routing on Canton
						</h2>
						<p className="text-sm text-fd-muted-foreground leading-relaxed mb-6">
							SignUIT uses Nexus Framework to power its institutional collateral routing engine.
							VantageCapital queries <code className="text-fd-primary">CollateralHolding</code>{" "}
							contracts, PrimeBank issues <code className="text-fd-primary">MarginCall</code>{" "}
							commands, and all routing decisions are institution-approved on the Canton ledger —
							without any centralized gatekeeper.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
							<UseCaseCard
								label="CollateralHolding"
								description="Institution-owned assets queried via useContracts"
							/>
							<UseCaseCard
								label="MarginCall"
								description="Counterparty-issued calls streamed in real-time via streamingPlugin"
							/>
							<UseCaseCard
								label="AllocationRecord"
								description="Institution-approved decisions written as ledger commands"
							/>
						</div>

						<div className="flex flex-wrap gap-3">
							<Link
								to="/docs/$"
								params={{ _splat: "contracts/querying" }}
								className="text-sm text-fd-primary hover:underline underline-offset-4"
							>
								Contract queries →
							</Link>
							<Link
								to="/docs/$"
								params={{ _splat: "react/streaming" }}
								className="text-sm text-fd-primary hover:underline underline-offset-4"
							>
								Real-time streaming →
							</Link>
							<Link
								to="/docs/$"
								params={{ _splat: "contracts/commands" }}
								className="text-sm text-fd-primary hover:underline underline-offset-4"
							>
								Commands →
							</Link>
						</div>
					</div>
				</div>
			</main>
		</HomeLayout>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: string;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-xl border p-5 flex flex-col gap-2">
			<span className="text-2xl">{icon}</span>
			<h3 className="font-semibold text-sm">{title}</h3>
			<p className="text-xs text-fd-muted-foreground leading-relaxed">{description}</p>
		</div>
	);
}

function UseCaseCard({ label, description }: { label: string; description: string }) {
	return (
		<div className="rounded-lg border border-fd-border/60 bg-fd-background/50 p-4 flex flex-col gap-1.5">
			<code className="text-xs font-mono font-semibold text-fd-primary">{label}</code>
			<p className="text-xs text-fd-muted-foreground leading-relaxed">{description}</p>
		</div>
	);
}
