import { Badge } from "@nexus/ui/components/badge";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircleIcon, CodeIcon, GitPullRequestIcon, LayoutIcon, ZapIcon } from "lucide-react";
import { Bullet, JudgingCard, JudgingLayout, JudgingSection, Stat } from "./-layout";

export const Route = createFileRoute("/judging/metrics")({
	component: MetricsPage,
});

function MetricsPage() {
	return (
		<JudgingLayout
			title="Metrics / Validation Evidence"
			subtitle="Technical metrics, Nexus Framework capabilities, and market validation data."
			section="3 of 6"
		>
			{/* Nexus Framework */}
			<JudgingSection title="Nexus Framework: Separate but Connected">
				<JudgingCard>
					<p className="text-lg leading-relaxed mb-6 text-foreground">
						<strong>Nexus Framework</strong> is our type-safe full-stack SDK for building
						applications on Canton Network. While developed as a separate open-source project
						(Apache 2.0), it serves as the technical foundation powering SignUIT
						CollateralRouter — connecting Daml smart contracts to modern React frontends
						with end-to-end type safety.
					</p>
					<div className="flex items-center gap-2 flex-wrap mb-6">
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Open Source</Badge>
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Apache 2.0</Badge>
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Early Stage</Badge>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 bg-muted/30 rounded-lg">
							<p className="font-semibold text-foreground mb-2">Type-Safe Ledger Operations</p>
							<p className="text-sm text-muted-foreground">
								Auto-generated TypeScript bindings from Daml contracts.
								Zero runtime errors when calling ledger templates.
							</p>
						</div>
						<div className="p-4 bg-muted/30 rounded-lg">
							<p className="font-semibold text-foreground mb-2">React 19 + TanStack Native</p>
							<p className="text-sm text-muted-foreground">
								Native TanStack Query integration with typed query keys,
								optimistic mutations, and streaming updates.
							</p>
						</div>
						<div className="p-4 bg-muted/30 rounded-lg">
							<p className="font-semibold text-foreground mb-2">PQS SQL Acceleration</p>
							<p className="text-sm text-muted-foreground">
								Routes reads to Participant Query Store (SQL) for 10x faster
								queries, falling back to Canton HTTP when needed.
							</p>
						</div>
						<div className="p-4 bg-muted/30 rounded-lg">
							<p className="font-semibold text-foreground mb-2">Secure Session Management</p>
							<p className="text-sm text-muted-foreground">
								AES-GCM encrypted, HttpOnly, SameSite=Lax cookies with
								automatic silent refresh before expiry.
							</p>
						</div>
					</div>
				</JudgingCard>

				<div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
					<div className="flex items-start gap-4">
						<CheckCircleIcon className="size-6 text-primary shrink-0 mt-0.5" />
						<div>
							<p className="font-semibold text-foreground mb-2">Canton Developer Survey 2026 Alignment</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Nexus Framework directly addresses the <strong>#1 most requested missing tool</strong>
								from the Canton Network Developer Experience &amp; Tooling Survey (2026):
								<em>"Typed SDKs &amp; language bindings."</em> With 71% of Canton developers coming
								from an Ethereum background, they expect the same DX maturity as wagmi/viem.
								Nexus brings that to Canton.
							</p>
						</div>
					</div>
				</div>
			</JudgingSection>

			{/* Technical Metrics */}
			<JudgingSection title="Technical Metrics">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
					<Stat value="3s" label="CTD computation time" />
					<Stat value="600x" label="Speed improvement" />
					<Stat value="&lt;1s" label="Policy check per asset" />
					<Stat value="100%" label="Policy compliance rate" />
				</div>

				<div className="space-y-6">
					<JudgingCard title="Performance Benchmarks">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-5 bg-muted/30 rounded-lg text-center">
								<p className="text-3xl font-semibold tracking-tight text-foreground">3s</p>
								<p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">CTD computation (1,000+ assets)</p>
							</div>
							<div className="p-5 bg-muted/30 rounded-lg text-center">
								<p className="text-3xl font-semibold tracking-tight text-foreground">&lt;1s</p>
								<p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Policy eligibility check per asset</p>
							</div>
							<div className="p-5 bg-muted/30 rounded-lg text-center">
								<p className="text-3xl font-semibold tracking-tight text-foreground">100%</p>
								<p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Policy compliance enforcement</p>
							</div>
						</div>
						<p className="text-sm text-muted-foreground mt-6 leading-relaxed">
							<strong className="text-foreground">Baseline:</strong> Manual collateral selection takes 30+ minutes per
							margin call. SignUIT reduces this to 3 seconds — a 600x improvement.
							Benchmarked against the demo scenario in <code>DEMO.md</code>.
						</p>
					</JudgingCard>

					<JudgingCard title="Technology Stack & Architecture">
						<div className="space-y-4">
							<Bullet>
								<strong>Nexus Framework:</strong> Type-safe full-stack SDK for Canton
								(runtime, auth, data layer, UI components, Daml integration)
							</Bullet>
							<Bullet>
								<strong>Canton Network:</strong> Institutional blockchain for atomic
								settlement with sub-transaction privacy
							</Bullet>
							<Bullet>
								<strong>Daml Smart Contracts:</strong> Financial-grade contracts for
								CollateralPolicy, CollateralHolding, MarginCall, RoutingSuggestion,
								AllocationRecord
							</Bullet>
							<Bullet>
								<strong>React 19 + TanStack:</strong> Modern frontend with real-time query
								management and optimistic updates
							</Bullet>
							<Bullet>
								<strong>Bun + SQLite:</strong> High-performance runtime with built-in
								database, WebSocket support, and CSS bundling
							</Bullet>
						</div>
					</JudgingCard>
				</div>
			</JudgingSection>

			{/* Market Validation */}
			<JudgingSection title="Market Validation Data">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
					<Stat value="$10bn+" label="Tokenized Treasuries globally" />
					<Stat value="$1.4B" label="Tokenized on Canton (Ctrl Alt)" />
					<Stat value="450+" label="Projects in Canton ecosystem" />
					<Stat value="0" label="Canton-native competitors" />
				</div>

				<JudgingCard title="Canton Network Growth & Ecosystem">
					<div className="space-y-4">
						<Bullet>
							<strong>Broadridge DLR:</strong> Processes <strong>trillions in tokenized UST repo</strong>
							every month on Canton Network — validating institutional demand for
							on-chain collateral operations.
						</Bullet>
						<Bullet>
							<strong>Tokenized Treasuries surpass $10bn globally</strong> (Markets Media,
							January 2026) — on-chain collateral market is growing rapidly.
						</Bullet>
						<Bullet>
							<strong>Ctrl Alt:</strong> Tokenized over <strong>$1.4 billion in assets</strong> on Canton
							(April 2026) — spanning real estate, private credit, funds, and commodities.
						</Bullet>
						<Bullet>
							<strong>CCTools:</strong> 23,000+ registered users in the Canton ecosystem
							community platform.
						</Bullet>
						<Bullet>
							<strong>DTCC partnership:</strong> Exploring tokenization of DTC-custodied
							U.S. Treasury securities on Canton — a signal of growing institutional
							commitment to on-chain assets.
						</Bullet>
						<Bullet>
							<strong>Digital Asset $135M funding:</strong> Validates long-term investment
							in Canton Network ecosystem growth and developer tooling.
						</Bullet>
						<Bullet>
							<strong>Zero native collateral routing engines</strong> currently exist on
							Canton — SignUIT addresses a clear tooling gap.
						</Bullet>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Competition */}
			<JudgingSection title="Competitive Landscape">
				<JudgingCard>
					<p className="text-muted-foreground mb-6 leading-relaxed">
						SignUIT's competitive position is unique — no other solution offers
						<strong className="text-foreground"> Canton-native, policy-based collateral routing</strong>:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-5 bg-muted/30 rounded-lg">
							<p className="font-semibold text-foreground mb-2">Traditional SaaS (e.g., FIS, Calypso)</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Legacy on-premise or generic cloud. No Canton integration.
								No sub-transaction privacy. High implementation cost.
							</p>
						</div>
						<div className="p-5 bg-muted/30 rounded-lg">
							<p className="font-semibold text-foreground mb-2">On-chain Platforms (e.g., Centrifuge)</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Focus on asset tokenization, not collateral routing.
								No policy engine. No CTD algorithm. Public blockchains.
							</p>
						</div>
						<div className="p-5 bg-primary/5 border border-primary/10 rounded-lg md:col-span-2">
							<p className="font-semibold text-foreground mb-2">SignUIT CollateralRouter</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<strong className="text-foreground">Canton-native, sub-transaction privacy, policy engine,
								yield-preserving CTD algorithm, human-in-the-loop approval,</strong> and
								immutable audit trail. First and only.
							</p>
						</div>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Open Source & Community */}
			<JudgingSection title="Open Source & Community">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="flex flex-col items-center p-5 bg-card/50 border border-border/50 rounded-lg text-center">
						<CodeIcon className="size-6 text-muted-foreground mx-auto mb-3" />
						<p className="text-2xl font-semibold tracking-tight">Apache 2.0</p>
						<p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">Open Source License</p>
					</div>
					<div className="flex flex-col items-center p-5 bg-card/50 border border-border/50 rounded-lg text-center">
						<LayoutIcon className="size-6 text-muted-foreground mx-auto mb-3" />
						<p className="text-2xl font-semibold tracking-tight">Modular</p>
						<p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">Plugin Architecture</p>
					</div>
					<div className="flex flex-col items-center p-5 bg-card/50 border border-border/50 rounded-lg text-center">
						<ZapIcon className="size-6 text-muted-foreground mx-auto mb-3" />
						<p className="text-2xl font-semibold tracking-tight">Early Stage</p>
						<p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">Growing Ecosystem</p>
					</div>
					<div className="flex flex-col items-center p-5 bg-card/50 border border-border/50 rounded-lg text-center">
						<GitPullRequestIcon className="size-6 text-muted-foreground mx-auto mb-3" />
						<p className="text-2xl font-semibold tracking-tight">Open</p>
						<p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">Contributions Welcome</p>
					</div>
				</div>
				<p className="text-sm text-muted-foreground mt-4 leading-relaxed text-center">
					<strong className="text-foreground">Nexus Framework</strong> is early stage and actively developed.
					Post-launch targets: 500+ weekly npm downloads, 200+ GitHub stars, 2+ community integrations.
				</p>
			</JudgingSection>
		</JudgingLayout>
	);
}
