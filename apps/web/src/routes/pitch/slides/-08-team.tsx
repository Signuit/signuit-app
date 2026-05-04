import { Card, CardContent } from "@nexus/ui/components/card";
import { GithubIcon, GlobeIcon, LinkedinIcon, MailIcon } from "lucide-react";
import { SlideLayout } from "../components/-slide-layout";

export function TeamSlide() {
	return (
		<SlideLayout
			title="Team"
			subtitle="Building the future of institutional collateral management"
			slideNumber={8}
			totalSlides={9}
		>
			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-4">
								<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
									<span className="text-2xl font-bold text-primary">MK</span>
								</div>
								<div>
									<h3 className="font-bold text-lg">Mehmet Kar</h3>
									<p className="text-sm text-muted-foreground">Founder & Lead Developer</p>
									<p className="text-sm text-muted-foreground mt-1">
										Full-stack developer with expertise in TypeScript, React, and Daml smart contracts.
										Passionate about bridging traditional finance and blockchain technology.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<h3 className="font-bold text-lg mb-4">Team Background</h3>
							<div className="space-y-3 text-sm text-muted-foreground">
								<div className="flex items-start gap-3">
									<div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
									<span>Deep expertise in Canton Network and Daml smart contracts</span>
								</div>
								<div className="flex items-start gap-3">
									<div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
									<span>Modern frontend development (React 19, TanStack, Tailwind)</span>
								</div>
								<div className="flex items-start gap-3">
									<div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
									<span>Financial markets domain knowledge (collateral, repo, margin)</span>
								</div>
								<div className="flex items-start gap-3">
									<div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
									<span>Open-source contributors to Canton ecosystem tooling</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-4">
					<Card>
						<CardContent className="p-6">
							<h3 className="font-bold text-lg mb-4">Links & Resources</h3>
							<div className="space-y-3">
								<a
									href="https://github.com/Signuit"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<GithubIcon className="size-5 text-primary" />
									<div>
										<p className="font-medium">GitHub</p>
										<p className="text-xs text-muted-foreground">github.com/Signuit</p>
									</div>
								</a>
								<a
									href="https://signuit.org"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<GlobeIcon className="size-5 text-primary" />
									<div>
										<p className="font-medium">Website</p>
										<p className="text-xs text-muted-foreground">signuit.org</p>
									</div>
								</a>
								<a
									href="https://x.com/signuit"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<svg className="size-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
									<div>
										<p className="font-medium">X (Twitter)</p>
										<p className="text-xs text-muted-foreground">@signuit</p>
									</div>
								</a>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
									<MailIcon className="size-5 text-primary" />
									<div>
										<p className="font-medium">Email</p>
										<p className="text-xs text-muted-foreground">team@signuit.org</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<h3 className="font-bold text-lg mb-4">Tech Stack</h3>
							<div className="grid grid-cols-2 gap-2 text-sm">
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-blue-500" />
									<span>React 19</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-cyan-500" />
									<span>TanStack Router</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-purple-500" />
									<span>Daml 3.4.11</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-green-500" />
									<span>Canton Network</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-orange-500" />
									<span>Nexus Framework</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="size-2 rounded-full bg-pink-500" />
									<span>Tailwind CSS</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</SlideLayout>
	);
}
