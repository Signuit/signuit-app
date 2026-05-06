import { Badge } from "@nexus/ui/components/badge";
import { Card, CardContent } from "@nexus/ui/components/card";
import { ArrowRightIcon, CoinsIcon, NetworkIcon, UsersIcon } from "lucide-react";
import { SlideLayout, StatBox } from "../components/-slide-layout";

export function BusinessSlide() {
	return (
		<SlideLayout
			title="Business Model"
			subtitle="Protocol-native revenue on Canton Network"
			slideNumber={6}
			totalSlides={9}
		>
			<div className="grid grid-cols-3 gap-6">
				<Card className="border-2 border-primary/20">
					<CardContent className="p-6 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
								<CoinsIcon className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-bold">Allocation Fee</h3>
								<p className="text-sm text-muted-foreground">Primary revenue</p>
							</div>
						</div>
						<div className="text-3xl font-bold text-primary">0.01% - 0.05%</div>
						<p className="text-sm text-muted-foreground">
							Per executed AllocationRecord. Institutions pay only when value is created.
						</p>
						<Badge variant="secondary" className="w-fit">$15M × 0.03% = $4,500</Badge>
					</CardContent>
				</Card>

				<Card className="border-2 border-primary/20">
					<CardContent className="p-6 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
								<NetworkIcon className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-bold">Membership Fee</h3>
								<p className="text-sm text-muted-foreground">Base access</p>
							</div>
						</div>
						<div className="text-3xl font-bold text-primary">$500 - $2,000</div>
						<p className="text-sm text-muted-foreground">
							Monthly base fee for network access, unlimited suggestions, policy management.
						</p>
						<Badge variant="secondary" className="w-fit">Basic / Pro / Enterprise</Badge>
					</CardContent>
				</Card>

				<Card className="border-2 border-primary/20">
					<CardContent className="p-6 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
								<UsersIcon className="size-5 text-primary" />
							</div>
							<div>
								<h3 className="font-bold">Validator Rewards</h3>
								<p className="text-sm text-muted-foreground">Network alignment</p>
							</div>
						</div>
						<div className="text-3xl font-bold text-primary">40% - 50%</div>
						<p className="text-sm text-muted-foreground">
							Of protocol fees distributed to Canton validators for network security.
						</p>
						<Badge variant="secondary" className="w-fit">Ecosystem incentive</Badge>
					</CardContent>
				</Card>
			</div>

			<div className="mt-6 p-6 bg-muted/30 rounded-lg border">
				<h3 className="font-bold text-lg mb-4">Revenue Projection (Forward-Looking)</h3>
				<div className="grid grid-cols-4 gap-4">
					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-1">Q3 2026</p>
						<p className="text-2xl font-bold">$5-10K</p>
						<p className="text-xs text-muted-foreground">/month target</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-1">Q4 2026</p>
						<p className="text-2xl font-bold">$25-50K</p>
						<p className="text-xs text-muted-foreground">/month target</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-1">2027</p>
						<p className="text-2xl font-bold">$150-300K</p>
						<p className="text-xs text-muted-foreground">/month target</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-1">Target</p>
						<p className="text-2xl font-bold text-primary">50+</p>
						<p className="text-xs text-muted-foreground">institutions (projection)</p>
					</div>
				</div>
			</div>
		</SlideLayout>
	);
}
