import { cn } from "@nexus/ui/lib/utils";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent } from "@nexus/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BoxIcon,
	CheckCircleIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	LayersIcon,
	MonitorIcon,
	PlayIcon,
	ShieldIcon,
	TerminalIcon,
	ZapIcon,
} from "lucide-react";
import { Bullet, JudgingCard, JudgingLayout, JudgingSection, Stat } from "./-layout";

export const Route = createFileRoute("/judging/mvp")({
	component: MvpPage,
});

function MvpPage() {
	return (
		<JudgingLayout
			title="MVP Materials"
			subtitle="Artifacts that demonstrate the minimum viable product — demos, prototypes, walkthroughs, and technical stack."
			section="5 of 6"
		>
			{/* Live Demo */}
			<JudgingSection title="Live Demo">
				<JudgingCard index={1}>
					<div className="flex items-start gap-6">
						<div className="size-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
							<MonitorIcon className="size-8 text-primary/70" />
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-semibold mb-2 tracking-tight">SignUIT Dashboard</h3>
							<p className="text-muted-foreground mb-6 leading-[1.7] max-w-prose">
								A live, interactive dashboard demonstrating the full collateral routing
								workflow. Built with React + TanStack Query + Nexus Framework.
							</p>
							<div className="flex flex-wrap gap-3">
								<Button asChild>
									<Link to="/dashboard">
										<PlayIcon className="size-4 mr-2" />
										Open Live Dashboard
									</Link>
								</Button>
								<Button variant="outline" className="border-border/40 hover:border-primary/30 transition-all duration-500" asChild>
									<a href="https://github.com/Signuit/signuit-app" target="_blank" rel="noopener noreferrer">
										<GitBranchIcon className="size-4 mr-2" />
										GitHub Repository
									</a>
								</Button>
							</div>
						</div>
					</div>
				</JudgingCard>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
					<Stat value="9" label="Pitch slides" index={1} />
					<Stat value="1,000+" label="Test holdings" index={2} />
					<Stat value="3s" label="CTD compute" index={3} />
					<Stat value="100%" label="Policy compliance" index={4} />
				</div>
			</JudgingSection>

			{/* Demo Scenarios */}
			<JudgingSection title="Demo Scenarios">
				<JudgingCard title="Scenario 1: Basic Margin Call Routing" index={1}>
					<div className="max-w-prose space-y-4">
						<Bullet>
							<strong>Trigger:</strong> PrimeBank issues a $15M margin call to VantageCapital
						</Bullet>
						<Bullet>
							<strong>System Response:</strong> SignUIT scans 1,000+ holdings, filters by
							counterparty eligibility (PrimeBank accepts T-Bills, Corporate Bonds, ETFs),
							checks LTV limits (&lt;70%), and excludes restricted assets
						</Bullet>
						<Bullet>
							<strong>CTD Selection:</strong> Algorithm prioritizes lowest opportunity cost
							(3.2% yield-bearing assets last), sends $10M T-Bills + $5M Corporate Bonds
						</Bullet>
						<Bullet>
							<strong>Human Approval:</strong> Treasury ops reviews suggestion in dashboard,
							clicks "Approve"
						</Bullet>
						<Bullet>
							<strong>Audit:</strong> AllocationRecord created on Canton with full
							recommendation trail, timestamp, and approver identity
						</Bullet>
					</div>
					<div className="mt-5 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3 animate-fade-in-up stagger-3">
						<CheckCircleIcon className="size-5 text-primary shrink-0 mt-0.5" />
						<span className="text-sm text-muted-foreground leading-[1.7]">
							<strong className="text-foreground">Result:</strong> 3 seconds vs. 30 minutes. $15M routed. $2,300/day
							yield preserved. Immutable audit created.
						</span>
					</div>
				</JudgingCard>

				<JudgingCard title="Scenario 2: After-Hours Emergency" className="mt-6" index={2}>
					<div className="max-w-prose space-y-4">
						<Bullet>
							<strong>Trigger:</strong> 2:47 AM — flash crash triggers $50M margin call
							from 3 counterparties simultaneously
						</Bullet>
						<Bullet>
							<strong>System Response:</strong> SignUIT processes all 3 calls in parallel,
							no human intervention required for first-pass recommendations
						</Bullet>
						<Bullet>
							<strong>CTD Selection:</strong> Optimizes across all 3 calls to minimize
							total opportunity cost, avoids sending same asset to multiple counterparties
						</Bullet>
						<Bullet>
							<strong>Human Review:</strong> On-call manager receives mobile notification,
							reviews batch approval, clicks confirm
						</Bullet>
					</div>
					<div className="mt-5 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3 animate-fade-in-up stagger-4">
						<CheckCircleIcon className="size-5 text-primary shrink-0 mt-0.5" />
						<span className="text-sm text-muted-foreground leading-[1.7]">
							<strong className="text-foreground">Result:</strong> All 3 calls resolved in &lt;10 seconds. No overnight
							team wake-ups. Zero errors.
						</span>
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* Technical Architecture */}
			<JudgingSection title="Technical Architecture">
				<JudgingCard index={1}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{[
							{ icon: LayersIcon, title: "Frontend", items: ["React 19 + TypeScript", "TanStack Router + Query", "Tailwind CSS + shadcn/ui", "Real-time WebSocket updates"] },
							{ icon: ZapIcon, title: "Backend", items: ["Bun runtime (high-performance)", "SQLite (bun:sqlite)", "Better Auth (authentication)", "WebSocket server"] },
							{ icon: ShieldIcon, title: "Blockchain", items: ["Canton Network (sub-transaction privacy)", "Daml smart contracts", "Ledger API integration", "Immutable audit trail"] },
							{ icon: BoxIcon, title: "Smart Contracts", items: ["CollateralPolicy (institution-controlled)", "CollateralHolding (asset registry)", "MarginCall (counterparty-triggered)", "RoutingSuggestion + AllocationRecord"] },
						].map((section, i) => (
							<div key={section.title} className={cn("animate-fade-in-up", `stagger-${Math.min(i + 1, 8)}`)}>
								<div className="flex items-center gap-2 mb-4">
									<section.icon className="size-5 text-primary/70" />
									<h4 className="font-semibold text-foreground">{section.title}</h4>
								</div>
								<ul className="space-y-2.5 text-sm text-muted-foreground">
									{section.items.map((item) => (
										<li key={item} className="flex items-center gap-2">
											<CheckCircleIcon className="size-3.5 text-primary" />
											{item}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</JudgingCard>
			</JudgingSection>

			{/* MVP Feature Checklist */}
			<JudgingSection title="MVP Feature Checklist">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card className={cn(
						"border border-border/40 bg-card/30 animate-fade-in-up stagger-1",
						"hover:border-primary/10 transition-all duration-500"
					)}>
						<CardContent className="pt-6">
							<div className="flex items-center gap-2 mb-4">
								<CheckCircleIcon className="size-5 text-primary" />
								<h4 className="font-semibold text-foreground">Implemented (Day 1 MVP)</h4>
							</div>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>CollateralPolicy template (institution-controlled)</li>
								<li>CollateralHolding template (asset registry)</li>
								<li>MarginCall template (counterparty-triggered)</li>
								<li>RoutingSuggestion template (CTD recommendation)</li>
								<li>AllocationRecord template (immutable audit)</li>
								<li>CTD algorithm (yield-preserving optimization)</li>
								<li>Policy compliance engine (eligibility, LTV, haircut)</li>
								<li>Human-in-the-loop approval</li>
								<li>Canton sandbox integration</li>
								<li>Interactive dashboard</li>
							</ul>
						</CardContent>
					</Card>
					<Card className={cn(
						"border border-border/40 bg-card/30 animate-fade-in-up stagger-2",
						"hover:border-primary/10 transition-all duration-500"
					)}>
						<CardContent className="pt-6">
							<div className="flex items-center gap-2 mb-4">
								<TerminalIcon className="size-5 text-muted-foreground" />
								<h4 className="font-semibold text-foreground">Phase 2 (Post-MVP)</h4>
							</div>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li>Auto-approve (policy-bounded)</li>
								<li>Multi-tenancy (institution isolation)</li>
								<li>REST API for third-party integration</li>
								<li>Real-time market data feeds</li>
								<li>Mobile app (iOS/Android)</li>
								<li>Advanced analytics & reporting</li>
								<li>Custom policy rule builder</li>
								<li>Bulk allocation processing</li>
								<li>Integration with DTCC DTC</li>
								<li>Canton mainnet deployment</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</JudgingSection>

			{/* Artifacts & Links */}
			<JudgingSection title="Artifacts & Links">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						{ icon: MonitorIcon, title: "Live Dashboard", desc: "Interactive demo with real CTD computation, policy checks, and approval workflow.", link: "/dashboard", external: false },
						{ icon: GitBranchIcon, title: "GitHub Repository", desc: "Full source code: Daml smart contracts, React frontend, Nexus Framework integration.", link: "https://github.com/Signuit/signuit-app", external: true },
						{ icon: PlayIcon, title: "Pitch Deck", desc: "9-slide dynamic pitch deck. Navigate with arrow keys. Built with React + Tailwind.", link: "/pitch", external: false },
						{ icon: TerminalIcon, title: "Daml Contracts", desc: "Smart contract templates: CollateralRouter.daml, SeedData.daml demo script.", link: "https://github.com/Signuit/signuit-app/tree/main/sandbox/daml", external: true },
					].map((item, i) => {
						const Wrapper = item.external ? "a" : Link;
						const props = item.external
							? { href: item.link, target: "_blank", rel: "noopener noreferrer" }
							: { to: item.link };
						return (
							<Card key={item.title} className={cn(
								"border border-border/40 bg-card/30 animate-fade-in-up",
								`stagger-${Math.min(i + 1, 8)}`,
								"hover:bg-card/50 hover:border-primary/15 hover:-translate-y-0.5 transition-all duration-500"
							)}>
								<CardContent className="pt-6">
									<div className="flex items-start gap-4">
										<div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
											<item.icon className="size-5 text-primary/70" />
										</div>
										<div>
											<p className="font-semibold text-foreground mb-1">{item.title}</p>
											<p className="text-sm text-muted-foreground mb-4 leading-[1.7]">{item.desc}</p>
											<Button variant="outline" size="sm" className="border-border/40 hover:border-primary/30 transition-all duration-500" asChild>
												<Wrapper {...props}>
													<ExternalLinkIcon className="size-3 mr-1.5" />
													{item.external ? "View Code" : "Open"}
												</Wrapper>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</JudgingSection>
		</JudgingLayout>
	);
}
