import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangleIcon, ClockIcon, TrendingUpIcon } from "lucide-react";
import { Bullet, JudgingCard, JudgingLayout, JudgingSection, Stat } from "./-layout";

export const Route = createFileRoute("/judging/value")({
	component: ValuePage,
});

function ValuePage() {
	return (
		<JudgingLayout
			title="Value / Problem Statement"
			subtitle="The problem SignUIT solves, the value it creates, and why it matters now."
			section="1 of 6"
		>
			{/* Executive Summary */}
			<JudgingSection title="Executive Summary">
				<JudgingCard>
					<p className="text-lg leading-relaxed text-foreground">
						<strong>SignUIT CollateralRouter</strong> is a policy-based collateral routing
						recommendation engine built on Canton Network. It solves a critical gap in
						institutional finance: <strong>treasury teams still manage collateral with Excel
						spreadsheets and manual phone coordination</strong>, leading to slow margin call
						response times, inconsistent decisions, and idle assets earning less than they
						could.
					</p>
					<p className="text-lg leading-relaxed mt-6 text-foreground">
						SignUIT replaces 30+ minute manual processes with <strong>3-second automated
						recommendations</strong>, enforces policy compliance automatically, and creates an
						<strong>immutable audit trail</strong> on Canton — all while preserving human oversight.
					</p>
				</JudgingCard>
			</JudgingSection>

			{/* The Problem */}
			<JudgingSection title="The Problem: Collateral Management is Broken">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
					<Stat value="70%" label="Firms with delivery challenges" />
					<Stat value="30+" label="Minutes per manual decision" />
					<Stat value="$6T+" label="Tokenized assets on Canton" />
					<Stat value="0" label="Native routing engines" />
				</div>

				<JudgingCard title="Current State: Manual, Error-Prone, Slow">
					<div className="space-y-4">
						<Bullet>
							<strong>Excel-based asset selection:</strong> Treasury teams open spreadsheets,
							manually calculate eligible collateral, and cross-reference policy rules.
							This takes 30+ minutes per margin call and introduces human error.
						</Bullet>
						<Bullet>
							<strong>No automated policy compliance:</strong> Institutions must manually check
							if selected assets meet counterparty-specific eligibility rules, LTV limits,
							and haircut thresholds. A single error can result in regulatory penalties.
						</Bullet>
						<Bullet>
							<strong>No immutable audit trail:</strong> When regulators ask "who decided
							what and when," firms rely on email chains and phone logs — neither of which
							are tamper-proof or systematically searchable.
						</Bullet>
						<Bullet>
							<strong>After-hours margin calls:</strong> Markets operate 24/7. A margin call
							at 2 AM requires waking up ops teams, coordinating across time zones, and
							hoping the right people are available.
						</Bullet>
						<Bullet>
							<strong>Yield leakage:</strong> Without intelligent optimization, institutions
							inadvertently send yield-bearing assets as collateral, sacrificing thousands
							of dollars in daily income.
						</Bullet>
					</div>
				</JudgingCard>

				<div className="mt-8 p-6 bg-destructive/5 border border-destructive/10 rounded-lg">
					<div className="flex items-start gap-4">
						<AlertTriangleIcon className="size-6 text-destructive shrink-0 mt-0.5" />
						<div>
							<p className="font-semibold text-destructive/90 mb-2">The Human Cost</p>
							<p className="text-muted-foreground leading-relaxed">
								Treasury teams at large asset managers process 50-100+ margin calls per day.
								At 30 minutes per call, that's <strong className="text-foreground">25-50 hours of manual work daily</strong> —
								just for collateral selection. Errors cost millions. Regulatory pressure is
								increasing. There has to be a better way.
							</p>
						</div>
					</div>
				</div>
			</JudgingSection>

			{/* The Canton Gap */}
			<JudgingSection title="The Canton Gap: Infrastructure Without Tooling">
				<JudgingCard>
					<p className="text-muted-foreground mb-6 leading-relaxed">
						Canton Network is the leading institutional blockchain for tokenized real-world
						assets. However, it faces a critical tooling gap:
					</p>
					<div className="space-y-4">
						<Bullet>
							<strong>$6T+ in tokenized assets</strong> on Canton Network (U.S. Treasuries,
							repos, money market funds, bonds)
						</Bullet>
						<Bullet>
							<strong>$4T+ in monthly transaction volume</strong> — growing rapidly
						</Bullet>
						<Bullet>
							<strong>Zero native collateral routing engines</strong> exist on Canton
						</Bullet>
						<Bullet>
							<strong>Institutions need tooling, not just infrastructure.</strong> Canton
							provides settlement and privacy, but institutions still need applications to
							manage their collateral workflows.
						</Bullet>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* The Solution */}
			<JudgingSection title="The Solution: SignUIT CollateralRouter">
				<JudgingCard title="How SignUIT Works">
					<div className="space-y-4">
						{[
							{ num: "1", title: "Trigger", desc: "Margin call received from counterparty (e.g., PrimeBank requests $15M)" },
							{ num: "2", title: "Compute", desc: "CTD engine analyzes all holdings in 3 seconds — opportunity cost, LTV, haircut, counterparty rules" },
							{ num: "3", title: "Recommend", desc: "Optimal collateral suggestion recorded as immutable RoutingSuggestion on Canton" },
							{ num: "4", title: "Approve", desc: "Ops team reviews and clicks approve (human-in-the-loop, Day 1 MVP)" },
							{ num: "5", title: "Audit", desc: "AllocationRecord created on Canton — immutable, tamper-proof, regulator-ready", highlight: true },
						].map((step) => (
							<div key={step.num} className="flex items-start gap-4 p-5 bg-muted/30 rounded-lg">
								<div className={`size-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${step.highlight ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`}>
									{step.num}
								</div>
								<div>
									<p className="font-semibold text-foreground">{step.title}</p>
									<p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Value Proposition */}
			<JudgingSection title="Value Proposition: Why SignUIT Matters">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<JudgingCard title="600x Faster">
						<ClockIcon className="size-6 text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground leading-relaxed">
							3 seconds vs. 30+ minutes per margin call. Treasury teams reclaim hours daily.
						</p>
					</JudgingCard>
					<JudgingCard title="Zero Opportunity Cost">
						<TrendingUpIcon className="size-6 text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground leading-relaxed">
							Yield-preserving algorithm sends non-yielding assets first. Saves ~$2,300/day
							on a $20M portfolio.
						</p>
					</JudgingCard>
					<JudgingCard title="Immutable Audit">
						<AlertTriangleIcon className="size-6 text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground leading-relaxed">
							Every decision recorded on Canton. Regulators see exactly who decided what,
							when, and why.
						</p>
					</JudgingCard>
				</div>
			</JudgingSection>

			{/* Why Now */}
			<JudgingSection title="Why Now?">
				<JudgingCard>
					<div className="space-y-4">
						<Bullet>
							<strong>DTCC tokenizing Treasuries on Canton (2026):</strong> On-chain collateral
							demand is surging. Institutions need tools to manage it.
						</Bullet>
						<Bullet>
							<strong>T+5 to T+0 settlement now possible:</strong> Speed is the new competitive
							advantage. Manual processes can't keep up.
						</Bullet>
						<Bullet>
							<strong>$3M+ annual savings per repo participant:</strong> Canton Network's own
							data proves the economic value of on-chain collateral optimization.
						</Bullet>
						<Bullet>
							<strong>No competitors:</strong> SignUIT is the first and only Canton-native
							collateral routing engine.
						</Bullet>
					</div>
				</JudgingCard>
			</JudgingSection>
		</JudgingLayout>
	);
}
