import { Badge } from "@nexus/ui/components/badge";
import { Card, CardContent } from "@nexus/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCardIcon, GlobeIcon, LayersIcon, RocketIcon, TrendingUpIcon, WalletIcon } from "lucide-react";
import { Bullet, JudgingCard, JudgingLayout, JudgingSection, Stat } from "./-layout";

export const Route = createFileRoute("/judging/gtm")({
	component: GtmPage,
});

function GtmPage() {
	return (
		<JudgingLayout
			title="GTM Materials"
			subtitle="Go-to-market strategy, protocol-native business model, and revenue projections."
			section="4 of 6"
		>
			{/* Business Model */}
			<JudgingSection title="Business Model: Model C — Protocol/Network Fee">
				<JudgingCard>
					<p className="text-lg leading-relaxed mb-6 text-foreground">
						SignUIT CollateralRouter operates on a <strong>protocol fee model</strong>,
						aligning incentives with Canton Network's core economic model.
						Revenue is generated per-transaction, with tiered pricing based on usage volume.
					</p>
					<div className="flex items-center gap-2 flex-wrap">
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Protocol Fee</Badge>
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">B2B SaaS</Badge>
						<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Enterprise License</Badge>
					</div>
				</JudgingCard>

				<JudgingCard title="Protocol Fee Structure">
					<div className="space-y-4">
						<div className="flex items-start gap-5 p-5 bg-muted/30 rounded-lg">
							<div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
								<TrendingUpIcon className="size-5 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-foreground">Per-Allocation Fee</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									<strong className="text-foreground">0.01% - 0.05%</strong> per collateral allocation, based on
									allocation amount and complexity
								</p>
								<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
									Example: $15M margin call → $1,500 - $7,500 fee
								</p>
							</div>
						</div>
						<div className="flex items-start gap-5 p-5 bg-muted/30 rounded-lg">
							<div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
								<LayersIcon className="size-5 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-foreground">Tiered Volume Discounts</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									Higher volumes unlock lower per-transaction rates, incentivizing
									deep platform adoption
								</p>
								<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
									Example: &gt;$1B/month → 0.01% rate
								</p>
							</div>
						</div>
						<div className="flex items-start gap-5 p-5 bg-muted/30 rounded-lg">
							<div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
								<CreditCardIcon className="size-5 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-foreground">Membership Tiers</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									Standard ($5K/mo), Professional ($15K/mo), Enterprise ($50K+/mo)
									with increasing feature sets
								</p>
							</div>
						</div>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Revenue Projections */}
			<JudgingSection title="Revenue Projections">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
					<Stat value="$1.2M" label="Year 1 Revenue" />
					<Stat value="$5.8M" label="Year 2 Revenue" />
					<Stat value="$18M" label="Year 3 Revenue" />
					<Stat value="$45M" label="Year 5 Revenue" />
				</div>

				<JudgingCard title="Financial Model Summary">
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-5 border border-border/50 rounded-lg">
								<p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider text-xs">Year 1</p>
								<p className="text-3xl font-semibold tracking-tight text-foreground">$1.2M</p>
								<p className="text-xs text-muted-foreground mt-2">
									5 pilot clients × $20K/mo avg
								</p>
							</div>
							<div className="p-5 border border-border/50 rounded-lg">
								<p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider text-xs">Year 2</p>
								<p className="text-3xl font-semibold tracking-tight text-foreground">$5.8M</p>
								<p className="text-xs text-muted-foreground mt-2">
									20 clients × $24K/mo avg + volume fees
								</p>
							</div>
							<div className="p-5 border border-border/50 rounded-lg">
								<p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider text-xs">Year 3</p>
								<p className="text-3xl font-semibold tracking-tight text-foreground">$18M</p>
								<p className="text-xs text-muted-foreground mt-2">
									50 clients × $30K/mo avg + protocol fees
								</p>
							</div>
							<div className="p-5 border border-border/50 rounded-lg">
								<p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider text-xs">Year 5</p>
								<p className="text-3xl font-semibold tracking-tight text-foreground">$45M</p>
								<p className="text-xs text-muted-foreground mt-2">
									100+ clients × $37K/mo avg + enterprise deals
								</p>
							</div>
						</div>
						<p className="text-sm text-muted-foreground mt-6 leading-relaxed">
							<strong className="text-foreground">Assumptions:</strong> Average allocation size $15M, average 50
							allocations/month per client, 0.03% blended fee rate, 15% annual churn.
							Year 5 includes 2-3 enterprise deals at $500K+/year.
						</p>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Go-to-Market Strategy */}
			<JudgingSection title="Go-to-Market Strategy">
				<JudgingCard title="Phase 1: Canton Ecosystem Entry (Q2 2026)">
					<div className="space-y-4">
						<Bullet>
							<strong>Target:</strong> DTCC, Digital Asset, Canton pilot participants
						</Bullet>
						<Bullet>
							<strong>Approach:</strong> Direct outreach through Canton Network community
							channels, hackathon visibility, partner introductions
						</Bullet>
						<Bullet>
							<strong>Goal:</strong> 3-5 pilot clients, validate product-market fit
						</Bullet>
						<Bullet>
							<strong>Pricing:</strong> Freemium for pilot clients, then $5K-15K/month
						</Bullet>
					</div>
				</JudgingCard>

				<JudgingCard title="Phase 2: Institutional Expansion (Q3-Q4 2026)" className="mt-6">
					<div className="space-y-4">
						<Bullet>
							<strong>Target:</strong> Independent asset managers, prime brokers, hedge funds
						</Bullet>
						<Bullet>
							<strong>Channels:</strong> Conference presentations (Sibos, Money20/20),
							financial media, case studies from Phase 1 pilots
						</Bullet>
						<Bullet>
							<strong>Goal:</strong> 15-20 paying clients, $2-3M ARR
						</Bullet>
						<Bullet>
							<strong>Pricing:</strong> $15K-50K/month + volume fees
						</Bullet>
					</div>
				</JudgingCard>

				<JudgingCard title="Phase 3: Enterprise Scale (2027+)" className="mt-6">
					<div className="space-y-4">
						<Bullet>
							<strong>Target:</strong> Clearinghouses, CCPs, sovereign wealth funds, large banks
						</Bullet>
						<Bullet>
							<strong>Channels:</strong> RFP responses, consulting partnerships,
							Canton Network co-marketing
						</Bullet>
						<Bullet>
							<strong>Goal:</strong> 50+ clients, $18M+ ARR
						</Bullet>
						<Bullet>
							<strong>Pricing:</strong> Enterprise licenses $500K+/year
						</Bullet>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Distribution Channels */}
			<JudgingSection title="Distribution Channels">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6">
							<div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
								<GlobeIcon className="size-5 text-muted-foreground" />
							</div>
							<p className="font-semibold text-foreground mb-2">Canton Network Channel</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Leverage Canton community events, Digital Asset partnerships,
								and ecosystem developer programs for initial traction.
							</p>
						</CardContent>
					</Card>
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6">
							<div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
								<RocketIcon className="size-5 text-muted-foreground" />
							</div>
							<p className="font-semibold text-foreground mb-2">Financial Conferences</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Sibos, Money20/20, Blockchain for Finance conferences.
								Demo stations, speaking slots, white paper distribution.
							</p>
						</CardContent>
					</Card>
					<Card className="border border-border/50 bg-card/30">
						<CardContent className="pt-6">
							<div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
								<WalletIcon className="size-5 text-muted-foreground" />
							</div>
							<p className="font-semibold text-foreground mb-2">Consulting Partners</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Partner with systems integrators (Deloitte, Accenture) for
								enterprise deployment and regulatory compliance consulting.
							</p>
						</CardContent>
					</Card>
				</div>
			</JudgingSection>

			{/* Key Milestones */}
			<JudgingSection title="Key Milestones">
				<div className="space-y-4">
					{[
						{ q: "Q2 2026", title: "MVP Launch + 3 Pilot Clients", desc: "Canton sandbox, human-in-the-loop, $1.2M revenue" },
						{ q: "Q3 2026", title: "Beta Release + Auto-Approve", desc: "Policy-bounded automation, 15 clients, $3M revenue" },
						{ q: "Q4 2026", title: "Mainnet Deployment", desc: "Canton production, 20+ clients, $5.8M revenue" },
						{ q: "2027", title: "Enterprise Scale", desc: "50+ clients, multi-tenancy, $18M revenue" },
					].map((m) => (
						<div key={m.q} className="flex items-start gap-4">
							<div className="w-24 shrink-0">
								<Badge variant="outline" className="w-full justify-center text-[10px] uppercase tracking-wider border-border/50">{m.q}</Badge>
							</div>
							<div className="flex-1 p-4 bg-muted/30 rounded-lg">
								<p className="font-semibold text-foreground">{m.title}</p>
								<p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
							</div>
						</div>
					))}
				</div>
			</JudgingSection>
		</JudgingLayout>
	);
}
