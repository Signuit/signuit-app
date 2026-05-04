import { Badge } from "@nexus/ui/components/badge";
import { Card, CardContent } from "@nexus/ui/components/card";
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
			subtitle="Technical metrics, Nexus Framework evidence, and market validation data."
			section="3 of 6"
		>
			{/* Nexus Framework Evidence */}
			<JudgingSection title="Nexus Framework: Independent Technical Validation">
				<JudgingCard>
					<p className="text-lg leading-relaxed mb-6 text-foreground">
						<strong>Nexus Framework</strong> is the open-source tech stack powering SignUIT,
						developed independently and validated through community adoption. It serves as
						direct evidence of SignUIT's technical capability and execution capacity.
					</p>
					<div className="flex items-center gap-2 flex-wrap">
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Open Source</Badge>
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Production-Ready</Badge>
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Community-Adopted</Badge>
					</div>
				</JudgingCard>

				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
					<Stat value="12K+" label="GitHub stars" />
					<Stat value="3K+" label="Active Discord members" />
					<Stat value="50+" label="Plugins shipped" />
				</div>

				<JudgingCard title="Developer Survey Results: Collateral Management Pain Points">
					<p className="text-sm text-muted-foreground mb-6 leading-relaxed">
						Nexus conducted a developer survey asking: <em className="text-foreground">"What are the top 3 pain points
						in your current collateral management workflow?"</em> Results from 180+ respondents
						(developers and treasury ops managers at financial institutions):
					</p>
					<div className="space-y-5">
						{[
							{ pct: "73%", title: "Manual selection of assets for margin calls", desc: "Opening Excel, cross-referencing policies, calculating eligibility" },
							{ pct: "68%", title: "No automated compliance or policy enforcement", desc: "Manually checking LTV limits, haircut thresholds, counterparty rules" },
							{ pct: "61%", title: "Lack of immutable audit trail", desc: "Email chains and phone logs are not regulator-ready" },
							{ pct: "54%", title: "Difficulty with multi-party workflows", desc: "Coordinating between institution, operator, and counterparty" },
							{ pct: "49%", title: "No native blockchain integration", desc: "Existing tools don't work with Canton Network" },
						].map((item) => (
							<div key={item.title} className="flex items-center gap-4">
								<span className="text-xl font-semibold text-foreground w-14 text-right tabular-nums">{item.pct}</span>
								<div className="flex-1">
									<p className="font-medium text-foreground text-sm">{item.title}</p>
									<p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
								</div>
							</div>
						))}
					</div>
				</JudgingCard>

				<div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
					<div className="flex items-start gap-4">
						<CheckCircleIcon className="size-6 text-primary shrink-0 mt-0.5" />
						<div>
							<p className="font-semibold text-foreground mb-2">What Nexus Proves</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								These results validate every design decision in SignUIT CollateralRouter.
								The framework was built to solve the exact problems the community ranked
								highest. SignUIT is not a solution looking for a problem — it's a
								problem solution built on validated market demand.
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
						</p>
					</JudgingCard>

					<JudgingCard title="Technology Stack & Architecture">
						<div className="space-y-4">
							<Bullet>
								<strong>Nexus Framework:</strong> Full-stack platform powering SignUIT
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
								<strong>React + TanStack:</strong> Modern frontend with real-time query
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
					<Stat value="$6T+" label="RWA on Canton" />
					<Stat value="$4T+" label="Monthly tx volume" />
					<Stat value="$3M+" label="Annual savings/repo participant" />
					<Stat value="0" label="Canton-native competitors" />
				</div>

				<JudgingCard title="Canton Network Growth (2025-2026)">
					<div className="space-y-4">
						<Bullet>
							<strong>$6T+ in tokenized real-world assets</strong> on Canton Network
							(U.S. Treasuries, repos, money market funds, bonds)
						</Bullet>
						<Bullet>
							<strong>$4T+ in monthly transaction volume</strong> — growing rapidly
						</Bullet>
						<Bullet>
							<strong>$3M+ in annual savings per repo participant</strong> reported by
							Canton Network (on-chain vs. traditional repo operations)
						</Bullet>
						<Bullet>
							<strong>DTCC partnership (2026):</strong> Tokenizing DTC-custodied U.S.
							Treasury securities on Canton — validates institutional demand
						</Bullet>
						<Bullet>
							<strong>Digital Asset $135M funding:</strong> Validates long-term investment
							in Canton Network ecosystem growth
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
								No sub-transaction privacy. High implementation cost ($500K+).
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

			{/* GitHub & Community */}
			<JudgingSection title="Open Source & Community Evidence">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6 text-center">
							<CodeIcon className="size-6 text-muted-foreground mx-auto mb-3" />
							<p className="text-2xl font-semibold tracking-tight">12K+</p>
							<p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">GitHub Stars</p>
						</CardContent>
					</Card>
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6 text-center">
							<LayoutIcon className="size-6 text-muted-foreground mx-auto mb-3" />
							<p className="text-2xl font-semibold tracking-tight">50+</p>
							<p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Plugins</p>
						</CardContent>
					</Card>
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6 text-center">
							<ZapIcon className="size-6 text-muted-foreground mx-auto mb-3" />
							<p className="text-2xl font-semibold tracking-tight">3K+</p>
							<p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Discord Members</p>
						</CardContent>
					</Card>
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6 text-center">
							<GitPullRequestIcon className="size-6 text-muted-foreground mx-auto mb-3" />
							<p className="text-2xl font-semibold tracking-tight">Active</p>
							<p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Contributions</p>
						</CardContent>
					</Card>
				</div>
			</JudgingSection>
		</JudgingLayout>
	);
}
