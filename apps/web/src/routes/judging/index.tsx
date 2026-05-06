import { Badge } from "@nexus/ui/components/badge";
import { Button } from "@nexus/ui/components/button";
import { Card, CardContent } from "@nexus/ui/components/card";
import { cn } from "@nexus/ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BarChart3Icon,
	BoxIcon,
	BriefcaseIcon,
	GlobeIcon,
	MegaphoneIcon,
	TargetIcon,
	UsersIcon,
} from "lucide-react";

export const Route = createFileRoute("/judging/")({
	component: JudgingIndex,
});

function JudgingIndex() {
	const sections = [
		{
			title: "Value / Problem Statement",
			description: "The problem SignUIT solves, the value it creates, and why it matters now.",
			icon: TargetIcon,
			to: "/judging/value",
		},
		{
			title: "ICP / Audience Definition",
			description: "Ideal customer profiles, target segments, and the 'Alex' persona.",
			icon: UsersIcon,
			to: "/judging/icp",
		},
		{
			title: "Metrics / Validation Evidence",
			description: "Technical metrics, market validation data, and competitive landscape.",
			icon: BarChart3Icon,
			to: "/judging/metrics",
		},
		{
			title: "GTM Materials",
			description:
				"Go-to-market strategy, protocol-native business model, and revenue projections.",
			icon: MegaphoneIcon,
			to: "/judging/gtm",
		},
		{
			title: "MVP Materials",
			description: "Live dashboard, demo scenarios, technical stack, and artifact links.",
			icon: BoxIcon,
			to: "/judging/mvp",
		},
		{
			title: "Pitch",
			description: "Dynamic pitch deck with 9 slides. Navigate with arrow keys.",
			icon: BriefcaseIcon,
			to: "/pitch",
			external: true,
		},
	];

	return (
		<div className="min-h-screen bg-background antialiased">
			{/* Hero */}
			<section className="border-b border-border/40">
				<div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
					<div className="flex items-center gap-3 mb-6 animate-fade-in">
						<img src="/assets/logo.png" alt="SignUIT" className="h-8 w-auto object-contain" />
						<Badge
							variant="outline"
							className="text-[10px] uppercase tracking-widest ml-1 border-border/40"
						>
							Hackathon 2026
						</Badge>
					</div>
					<h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 max-w-3xl text-balance animate-fade-in-up stagger-1">
						Judging Panel Submission
					</h1>
					<p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed text-balance animate-fade-in-up stagger-2">
						SignUIT CollateralRouter — a policy-based collateral routing recommendation engine on
						Canton Network.
					</p>
					<div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up stagger-3">
						<Button
							variant="outline"
							size="sm"
							className="rounded-full border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-500"
							asChild
						>
							<a
								href="https://github.com/Signuit/signuit-app"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="rounded-full border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-500"
							asChild
						>
							<a href="https://signuit.com" target="_blank" rel="noopener noreferrer">
								Website
							</a>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="rounded-full border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-500"
							asChild
						>
							<a href="https://x.com/signuit" target="_blank" rel="noopener noreferrer">
								X / Twitter
							</a>
						</Button>
					</div>
				</div>
			</section>

			{/* Navigation Grid */}
			<section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{sections.map((section, i) => {
						const Icon = section.icon;
						const CardWrapper = section.external ? "a" : Link;
						const cardProps = section.external
							? { href: section.to, target: "_blank", rel: "noopener noreferrer" }
							: { to: section.to };
						const staggerClass = `stagger-${Math.min(i + 1, 8)}`;

						return (
							<CardWrapper key={section.title} {...cardProps} className="block no-underline group">
								<Card
									className={cn(
										"h-full border border-border/40 bg-card/30 animate-fade-in-up",
										staggerClass,
										"hover:bg-card/50 hover:border-primary/15 hover:-translate-y-0.5 transition-all duration-500 cursor-pointer",
									)}
								>
									<CardContent className="p-6 flex flex-col h-full">
										<div className="flex items-center justify-between mb-6">
											<div className="size-10 rounded-lg bg-muted flex items-center justify-center">
												<Icon className="size-5 text-muted-foreground" />
											</div>
											{section.external && (
												<GlobeIcon className="size-4 text-muted-foreground/40" />
											)}
										</div>
										<h3 className="font-semibold text-lg mb-2 tracking-tight group-hover:text-foreground transition-colors duration-500">
											{section.title}
										</h3>
										<p className="text-sm text-muted-foreground flex-1 leading-relaxed">
											{section.description}
										</p>
										<div className="mt-5 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-500">
											<span>View</span>
											<svg
												aria-hidden="true"
												className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
												/>
											</svg>
										</div>
									</CardContent>
								</Card>
							</CardWrapper>
						);
					})}
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border/40">
				<div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
					<span>SignUIT CollateralRouter</span>
					<span>Built on Canton Network</span>
				</div>
			</footer>
		</div>
	);
}
