import { Card, CardContent } from "@nexus/ui/components/card";
import { GithubIcon, GlobeIcon, MailIcon } from "lucide-react";
import { SlideLayout } from "../components/-slide-layout";

export function TeamSlide() {
	const members = [
		{
			name: "Mehmet Kar",
			github: "mehmetkr-31",
			desc: "Full-stack developer with expertise in TypeScript, React, and Daml smart contracts. Passionate about bridging traditional finance and blockchain technology.",
		},
		{
			name: "Ali Tap",
			github: "aLjTap",
			desc: "Core contributor with deep experience in system architecture and backend development. Active in the SignUIT codebase since inception.",
		},
		{
			name: "Ahmet Eren Kayıkçı",
			github: "4hmeteren",
			desc: "Software enthusiast and university student. Passionate about creating creative solutions, mastering new technologies, and contributing to open-source.",
		},
	];

	return (
		<SlideLayout
			title="Team"
			subtitle="Building the future of institutional collateral management"
			slideNumber={8}
			totalSlides={9}
		>
			<div className="grid grid-cols-3 gap-5">
				{members.map((member) => (
					<Card key={member.github} className="flex flex-col">
						<CardContent className="p-6 flex flex-col flex-1">
							<h3 className="font-bold text-lg mb-2">{member.name}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed flex-1">
								{member.desc}
							</p>
							<a
								href={`https://github.com/${member.github}`}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
							>
								<GithubIcon className="size-4" />
								@{member.github}
							</a>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="mt-6 grid grid-cols-2 gap-5">
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
								<span>Building open-source tooling for the Canton ecosystem</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-5">
					<Card>
						<CardContent className="p-6">
							<h3 className="font-bold text-lg mb-4">Project Links</h3>
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
									href="https://signuit.com"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<GlobeIcon className="size-5 text-primary" />
									<div>
										<p className="font-medium">Website</p>
										<p className="text-xs text-muted-foreground">signuit.com</p>
									</div>
								</a>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
									<MailIcon className="size-5 text-primary" />
									<div>
										<p className="font-medium">Email</p>
										<p className="text-xs text-muted-foreground">team@signuit.com</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</SlideLayout>
	);
}
