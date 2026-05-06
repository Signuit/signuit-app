import ClickSpark from "@/components/ClickSpark";

import { LandingFeatures } from "./features";
import { LandingFinalCta } from "./final-cta";
import { LandingFlow } from "./flow";
import { LandingFooter } from "./footer";
import { LandingHero } from "./hero";
import { LandingNav } from "./nav";
import { LandingStats } from "./stats";

import { LandingTrustBar } from "./trust-bar";
import { LandingUseCases } from "./use-cases";

export function LandingPage() {
	return (
		<ClickSpark sparkColor="#7dd3fc" sparkRadius={26} sparkSize={10}>
			<div className="relative overflow-x-clip bg-slate-950 text-slate-50">
				<LandingNav />
				<main>
					<LandingHero />
					<LandingTrustBar />
					<LandingFeatures />
					<LandingFlow />
					<LandingStats />
					<LandingUseCases />
					<LandingFinalCta />
				</main>
				<LandingFooter />
			</div>
		</ClickSpark>
	);
}
