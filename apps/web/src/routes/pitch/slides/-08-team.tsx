import { Card, CardContent } from "@nexus/ui/components/card";
import { GithubIcon, GlobeIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import { SlideLayout } from "../components/-slide-layout";

const members = [
	{
		name: "Mehmet Kar",
		github: "mehmetkr-31",
		role: "Smart Contracts & Architecture",
		desc: "Canton/Daml expert. Built the 8-template contract system and Nexus Framework core.",
	},
	{
		name: "Ali Tap",
		github: "aLjTap",
		role: "Frontend & Systems",
		desc: "Full-stack. Auth, Canton streaming, dashboard UX, system integration.",
	},
	{
		name: "Ahmet Eren Kayıkçı",
		github: "4hmeteren",
		role: "Backend & API",
		desc: "CTD engine, oRPC procedures, server-side Canton ledger interactions.",
	},
];

export function TeamSlide() {
	return (
		<SlideLayout
			title="Team"
			subtitle="Built SignUIT + Nexus Framework from scratch in 3 weeks"
			slideNumber={8}
			totalSlides={9}
		>
			<div className="grid grid-cols-3 gap-4">
				{members.map((m, i) => (
					<motion.div
						key={m.github}
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.12, duration: 0.4 }}
						whileHover={{ scale: 1.02 }}
					>
						<Card className="h-full">
							<CardContent className="p-5 flex flex-col gap-2 h-full">
								<div>
									<h3 className="font-bold text-sm">{m.name}</h3>
									<p className="text-[11px] text-primary font-medium">{m.role}</p>
								</div>
								<p className="text-xs text-muted-foreground leading-snug flex-1">{m.desc}</p>
								<a
									href={`https://github.com/${m.github}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-1"
								>
									<GithubIcon className="size-3.5" />@{m.github}
								</a>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			<motion.div
				className="mt-5 grid grid-cols-3 gap-4"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.45, duration: 0.4 }}
			>
				<a
					href="https://github.com/Signuit"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
				>
					<GithubIcon className="size-4 text-primary shrink-0" />
					<div>
						<p className="text-xs font-semibold">GitHub</p>
						<p className="text-[10px] text-muted-foreground">github.com/Signuit</p>
					</div>
				</a>
				<a
					href="https://signuit.com"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
				>
					<GlobeIcon className="size-4 text-primary shrink-0" />
					<div>
						<p className="text-xs font-semibold">Website</p>
						<p className="text-[10px] text-muted-foreground">signuit.com</p>
					</div>
				</a>
				<div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
					<MailIcon className="size-4 text-primary shrink-0" />
					<div>
						<p className="text-xs font-semibold">Email</p>
						<p className="text-[10px] text-muted-foreground">team@signuit.com</p>
					</div>
				</div>
			</motion.div>
		</SlideLayout>
	);
}
