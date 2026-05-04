import { Card, CardContent, CardHeader, CardTitle } from "@nexus/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	BarChart3Icon,
	ChevronLeft,
	FileTextIcon,
	PresentationIcon,
	RocketIcon,
	TargetIcon,
	UsersIcon,
} from "lucide-react";

export const Route = createFileRoute("/presentations/")({
	component: PresentationsIndex,
});

const presentationItems = [
	{
		title: "Value Proposition",
		description:
			"Problem statement and the unique value SignUIT provides to the collateral network.",
		icon: <TargetIcon className="size-8" />,
		to: "/presentations/value-prop",
		color: "from-blue-500/20 to-indigo-500/20",
	},
	{
		title: "ICP & Audience",
		description: "Defining the ideal customer profile and the target audience for the project.",
		icon: <UsersIcon className="size-8" />,
		to: "/presentations/icp",
		color: "from-purple-500/20 to-pink-500/20",
	},
	{
		title: "Metrics & Validation",
		description:
			"Traction, validation evidence, and core efficiency metrics from the Canton ledger.",
		icon: <BarChart3Icon className="size-8" />,
		to: "/presentations/metrics",
		color: "from-green-500/20 to-emerald-500/20",
	},
	{
		title: "GTM Strategy",
		description: "Go-to-market plan, channels, and supporting materials for global adoption.",
		icon: <RocketIcon className="size-8" />,
		to: "/presentations/gtm",
		color: "from-orange-500/20 to-red-500/20",
	},
	{
		title: "MVP Materials",
		description: "Demos, prototypes, and walkthroughs demonstrating the minimum viable product.",
		icon: <FileTextIcon className="size-8" />,
		to: "/presentations/mvp",
		color: "from-cyan-500/20 to-blue-500/20",
	},
	{
		title: "Investor Pitch",
		description: "The complete pitch deck presenting the future of automated collateral routing.",
		icon: <PresentationIcon className="size-8" />,
		to: "/presentations/pitch",
		color: "from-yellow-500/20 to-amber-500/20",
	},
];

function PresentationsIndex() {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center mb-4">
				<Link
					to="/dashboard"
					className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2"
				>
					<ChevronLeft className="size-4" aria-hidden="true" />
					Back to Dashboard
				</Link>
			</div>
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
					<PresentationIcon className="size-10 text-primary" />
					Project Presentations
				</h1>
				<p className="text-muted-foreground text-lg max-w-2xl">
					Explore the core pillars of SignUIT through interactive, high-performance presentations.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{presentationItems.map((item, index) => (
					<motion.div
						key={item.to}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Link to={item.to}>
							<Card className="group relative overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer h-full">
								<div
									className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
								/>
								<CardHeader className="relative z-10">
									<div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-500">
										{item.icon}
									</div>
									<CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
										{item.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="relative z-10">
									<p className="text-muted-foreground leading-relaxed">{item.description}</p>
								</CardContent>
							</Card>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	);
}
