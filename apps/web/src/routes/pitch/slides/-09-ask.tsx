import { Button } from "@nexus/ui/components/button";
import { Card, CardContent } from "@nexus/ui/components/card";
import {
	GithubIcon,
	HeartIcon,
	MessageCircleIcon,
	PlayIcon,
	RocketIcon,
	UsersIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DemoLaunchModal } from "../components/-demo-launch-modal";
import { SlideLayout } from "../components/-slide-layout";

const ASKS = [
	{
		icon: MessageCircleIcon,
		title: "Feedback",
		desc: "Help us refine the CTD algorithm, policy engine, and UX for institutional users.",
	},
	{
		icon: UsersIcon,
		title: "Connections",
		desc: "Introductions to asset managers, prime brokers, or Canton partners who need automated routing.",
	},
	{
		icon: RocketIcon,
		title: "Pilot Interest",
		desc: "3–5 institutions for Phase 2 beta. Zero fees for 90 days.",
	},
];

export function AskSlide() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<SlideLayout
			title="The Ask"
			subtitle="How you can help SignUIT grow"
			slideNumber={9}
			totalSlides={9}
		>
			<div className="grid grid-cols-2 gap-6">
				{/* Left — ask cards */}
				<div className="space-y-3">
					{ASKS.map((ask, i) => (
						<motion.div
							key={ask.title}
							initial={{ opacity: 0, x: -16 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.12, duration: 0.4 }}
						>
							<Card className="border-primary/20">
								<CardContent className="p-4 flex items-start gap-3">
									<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
										<ask.icon className="size-4 text-primary" />
									</div>
									<div>
										<h3 className="font-bold text-sm mb-1">{ask.title}</h3>
										<p className="text-xs text-muted-foreground leading-snug">{ask.desc}</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Right — thank you */}
				<motion.div
					initial={{ opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.35, duration: 0.4 }}
				>
					<Card className="bg-primary/5 border-primary/20 h-full">
						<CardContent className="p-7 flex flex-col items-center justify-center text-center h-full gap-4">
							<div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
								<HeartIcon className="size-7 text-primary" />
							</div>
							<div>
								<h3 className="text-xl font-bold mb-1">Thank You</h3>
								<p className="text-sm text-muted-foreground leading-snug">
									We are not replacing humans.
									<br />
									<strong className="text-foreground">We are replacing Excel.</strong>
								</p>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<Button className="w-full gap-2" size="sm" onClick={() => setModalOpen(true)}>
									<PlayIcon className="size-3.5" />
									View Live Demo
								</Button>
								<Button variant="outline" className="w-full gap-2" size="sm" asChild>
									<a href="https://github.com/Signuit" target="_blank" rel="noopener noreferrer">
										<GithubIcon className="size-3.5" />
										GitHub Repository
									</a>
								</Button>
							</div>
							<div className="text-[11px] text-muted-foreground border-t border-border pt-3 w-full text-center space-y-0.5">
								<p>signuit.com · github.com/Signuit</p>
								<p>team@signuit.com</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			<DemoLaunchModal open={modalOpen} onClose={() => setModalOpen(false)} />
		</SlideLayout>
	);
}
