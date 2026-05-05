import { Badge } from "@nexus/ui/components/badge";
import { createFileRoute } from "@tanstack/react-router";
import {
	Building2Icon,
	GlobeIcon,
	TargetIcon,
	TrendingUpIcon,
	UsersIcon,
} from "lucide-react";
import { JudgingCard, JudgingLayout, JudgingSection, Stat } from "./-layout";

export const Route = createFileRoute("/judging/icp")({
	component: IcpPage,
});

function IcpPage() {
	return (
		<JudgingLayout
			title="ICP / Audience Definition"
			subtitle="Ideal customer profiles, target segments, and the 'Alex' persona."
			section="2 of 6"
		>
			{/* Overview */}
			<JudgingSection title="Target Audience Overview">
				<JudgingCard>
					<p className="text-lg leading-relaxed text-foreground">
						SignUIT serves <strong>institutional financial firms</strong> that manage
						tokenized or traditional collateral on Canton Network or are planning to
						migrate on-chain. Our audience ranges from early Canton adopters to
						independent institutions exploring tokenized asset management.
					</p>
				</JudgingCard>
			</JudgingSection>

			{/* Tier A */}
			<JudgingSection title="Tier A: Canton Ecosystem Partners">
				<p className="text-muted-foreground mb-8 leading-relaxed">
					Organizations already building on or partnering with Canton Network.
					These are high-priority targets due to their existing commitment.
				</p>

				<div className="space-y-6">
					<JudgingCard title="DTCC (Depository Trust & Clearing Corporation)">
						<div className="flex items-start gap-5">
							<div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
								<Building2Icon className="size-6 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
									<strong className="text-foreground">Role:</strong> Settlement & custody infrastructure provider
								</p>
								<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
									<strong className="text-foreground">Canton Connection:</strong> Partnered with Digital Asset to
									explore tokenization of DTC-custodied securities on Canton
								</p>
								<p className="text-sm text-muted-foreground mb-3 leading-relaxed">
									<strong className="text-foreground">Why SignUIT:</strong> As DTCC explores on-chain assets, automated
									collateral management becomes essential for repo and margin operations.
								</p>
								<div className="flex gap-2 flex-wrap">
									<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Use Case: On-chain repo</Badge>
								</div>
							</div>
						</div>
					</JudgingCard>

					<JudgingCard title="Digital Asset">
						<div className="flex items-start gap-5">
							<div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
								<GlobeIcon className="size-6 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
									<strong className="text-foreground">Role:</strong> Canton Network developer and enterprise blockchain solutions provider
								</p>
								<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
									<strong className="text-foreground">Canton Connection:</strong> Built and maintains Canton Network;
									raised $135M to accelerate ecosystem growth
								</p>
								<p className="text-sm text-muted-foreground mb-3 leading-relaxed">
									<strong className="text-foreground">Why SignUIT:</strong> Digital Asset needs ecosystem tooling to
									attract developers. Nexus Framework (powering SignUIT) addresses the #1
									pain point from their developer survey.
								</p>
								<div className="flex gap-2 flex-wrap">
									<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Use Case: Developer tooling</Badge>
								</div>
							</div>
						</div>
					</JudgingCard>

					<JudgingCard title="Canton Pilot Participants">
						<div className="flex items-start gap-5">
							<div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
								<UsersIcon className="size-6 text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
									<strong className="text-foreground">Includes:</strong> Major banks (BNP Paribas, Bank of America, Citi),
									asset managers, stablecoin issuers, insurance companies
								</p>
								<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
									<strong className="text-foreground">Canton Connection:</strong> Actively testing repo, securities lending,
									and tokenized fund management on Canton
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									<strong className="text-foreground">Why SignUIT:</strong> These institutions are already committed to Canton
									and need production-ready collateral tooling.
								</p>
							</div>
						</div>
					</JudgingCard>
				</div>
			</JudgingSection>

			{/* Tier B */}
			<JudgingSection title="Tier B: Independent Financial Institutions">
				<p className="text-muted-foreground mb-8 leading-relaxed">
					Organizations managing significant collateral operations.
					These represent the broader market expansion opportunity.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<JudgingCard title="Large Asset Managers">
						<div className="flex items-center gap-2 mb-4">
							<TargetIcon className="size-4 text-muted-foreground" />
							<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">AUM &gt;$10B</Badge>
						</div>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Daily Volume:</strong> High volume of margin calls
						</p>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Pain:</strong> Excel fatigue, after-hours coordination, manual policy checking
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							<strong className="text-foreground">Value:</strong> Automate 30-min process to 3 seconds, preserve yield
						</p>
					</JudgingCard>

					<JudgingCard title="Prime Brokers">
						<div className="flex items-center gap-2 mb-4">
							<UsersIcon className="size-4 text-muted-foreground" />
							<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Multi-client</Badge>
						</div>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Daily Volume:</strong> Very high volume across multiple clients
						</p>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Pain:</strong> Counterparty-specific rules, high operational cost, client reporting
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							<strong className="text-foreground">Value:</strong> Built-in counterparty eligibility, multi-tenant deployment
						</p>
					</JudgingCard>

					<JudgingCard title="Hedge Funds">
						<div className="flex items-center gap-2 mb-4">
							<TrendingUpIcon className="size-4 text-muted-foreground" />
							<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">High-frequency</Badge>
						</div>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Daily Volume:</strong> Variable, volatility-driven
						</p>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Pain:</strong> Speed-critical, regulatory pressure, operational risk
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							<strong className="text-foreground">Value:</strong> 3-second response, human approval for comfort
						</p>
					</JudgingCard>

					<JudgingCard title="Clearinghouses & CCPs">
						<div className="flex items-center gap-2 mb-4">
							<Building2Icon className="size-4 text-muted-foreground" />
							<Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/50">Systemic</Badge>
						</div>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Daily Volume:</strong> System-wide scale
						</p>
						<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
							<strong className="text-foreground">Pain:</strong> Automated compliance, immutable audit, systemic risk
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							<strong className="text-foreground">Value:</strong> Regulatory-ready audit trail, policy enforcement
						</p>
					</JudgingCard>
				</div>
			</JudgingSection>

			{/* Persona */}
			<JudgingSection title="Target Persona: 'Alex, Treasury Ops Manager'">
				<JudgingCard>
					<div className="flex items-start gap-5">
						<div className="size-16 rounded-full bg-muted flex items-center justify-center shrink-0">
							<span className="text-2xl font-semibold text-muted-foreground">A</span>
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-lg mb-6">Alex, Treasury Ops Manager <span className="text-sm font-normal text-muted-foreground">(Representative Persona)</span></h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
								<div>
									<p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Profile</p>
									<ul className="space-y-1.5 leading-relaxed">
										<li>Manages collateral for large asset manager</li>
										<li>High daily volume of margin calls</li>
										<li>Leads a team of traders</li>
									</ul>
								</div>
								<div>
									<p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Daily Pain</p>
									<ul className="space-y-1.5 leading-relaxed">
										<li>Margin calls flood in after market close</li>
										<li>Opens Excel, checks eligibility manually</li>
										<li>Coordinates with counterparties by phone</li>
										<li>Hopes nothing breaks</li>
									</ul>
								</div>
								<div>
									<p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">By End of Day</p>
									<ul className="space-y-1.5 leading-relaxed">
										<li>Exhausted</li>
										<li>Worried about audit trail gaps</li>
										<li>Hoping no errors surface tomorrow</li>
									</ul>
								</div>
								<div>
									<p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">With SignUIT</p>
									<ul className="space-y-1.5 leading-relaxed">
										<li>Dashboard shows all calls</li>
										<li>CTD recommends in 3 seconds</li>
										<li>Clicks approve</li>
										<li>Immutable record on Canton</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Summary Stats */}
			<JudgingSection title="Market Size Summary">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Stat value="$10bn+" label="Tokenized Treasuries globally" />
					<Stat value="450+" label="Projects in Canton ecosystem" />
					<Stat value="Trillions" label="Monthly UST repo (Broadridge)" />
					<Stat value="0" label="Competitors on Canton" />
				</div>
			</JudgingSection>
		</JudgingLayout>
	);
}
