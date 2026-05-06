import { Button } from "@nexus/ui/components/button";
import { Card, CardContent } from "@nexus/ui/components/card";
import { HeartIcon, MessageCircleIcon, RocketIcon, UsersIcon } from "lucide-react";
import { SlideLayout } from "../components/-slide-layout";

export function AskSlide() {
	return (
		<SlideLayout
			title="The Ask"
			subtitle="How you can help SignUIT grow"
			slideNumber={9}
			totalSlides={9}
		>
			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-4">
					<Card className="border-2 border-primary/20">
						<CardContent className="p-6">
							<div className="flex items-start gap-4">
								<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
									<MessageCircleIcon className="size-5 text-primary" />
								</div>
								<div>
									<h3 className="font-bold text-lg mb-2">Feedback</h3>
									<p className="text-sm text-muted-foreground">
										We value your expertise. Help us refine the CTD algorithm, policy engine, and
										user experience for institutional users.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-primary/20">
						<CardContent className="p-6">
							<div className="flex items-start gap-4">
								<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
									<UsersIcon className="size-5 text-primary" />
								</div>
								<div>
									<h3 className="font-bold text-lg mb-2">Connections</h3>
									<p className="text-sm text-muted-foreground">
										Introductions to asset managers, prime brokers, or Canton ecosystem partners who
										could benefit from automated collateral routing.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-primary/20">
						<CardContent className="p-6">
							<div className="flex items-start gap-4">
								<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
									<RocketIcon className="size-5 text-primary" />
								</div>
								<div>
									<h3 className="font-bold text-lg mb-2">Pilot Interest</h3>
									<p className="text-sm text-muted-foreground">
										Looking for 3-5 institutions to join our Phase 2 beta program with zero fees for
										90 days.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col justify-center">
					<Card className="bg-primary/5 border-primary/20">
						<CardContent className="p-8 text-center">
							<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
								<HeartIcon className="size-8 text-primary" />
							</div>
							<h3 className="text-2xl font-bold mb-2">Thank You</h3>
							<p className="text-muted-foreground mb-6">
								SignUIT is building the future of institutional collateral management on Canton. We
								are not replacing humans. We are replacing Excel.
							</p>
							<div className="space-y-2">
								<Button className="w-full" size="lg">
									View Live Demo
								</Button>
								<Button variant="outline" className="w-full" size="lg">
									GitHub Repository
								</Button>
							</div>
							<div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
								<p>signuit.com</p>
								<p>github.com/Signuit</p>
								<p>@signuit</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</SlideLayout>
	);
}
