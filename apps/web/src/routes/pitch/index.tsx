import { Button } from "@nexus/ui/components/button";
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProgressBar, SlideDots } from "./components/-progress-bar";
import { useKeyboardNav } from "./components/-keyboard-nav";
import { ProblemSlide } from "./slides/-01-problem";
import { SolutionSlide } from "./slides/-02-solution";
import { DemoSlide } from "./slides/-03-demo";
import { CantonSlide } from "./slides/-04-canton";
import { MarketSlide } from "./slides/-05-market";
import { BusinessSlide } from "./slides/-06-business";
import { RoadmapSlide } from "./slides/-07-roadmap";
import { TeamSlide } from "./slides/-08-team";
import { AskSlide } from "./slides/-09-ask";

const slides = [
	ProblemSlide,
	SolutionSlide,
	DemoSlide,
	CantonSlide,
	MarketSlide,
	BusinessSlide,
	RoadmapSlide,
	TeamSlide,
	AskSlide,
];

export const Route = createFileRoute("/pitch/")({
	component: PitchDeck,
});

function PitchDeck() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = slides.length;

	const goToNext = useCallback(() => {
		setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
	}, [totalSlides]);

	const goToPrev = useCallback(() => {
		setCurrentSlide((prev) => Math.max(prev - 1, 0));
	}, []);

	const goToFirst = useCallback(() => {
		setCurrentSlide(0);
	}, []);

	const goToLast = useCallback(() => {
		setCurrentSlide(totalSlides - 1);
	}, [totalSlides]);

	useKeyboardNav({
		onNext: goToNext,
		onPrev: goToPrev,
		onFirst: goToFirst,
		onLast: goToLast,
	})

	const CurrentSlideComponent = slides[currentSlide];

	return (
		<div className="relative h-screen w-full bg-background">
			{/* Slide Content */}
			<div className="h-full w-full">
				<CurrentSlideComponent />
			</div>

			{/* Navigation Overlay */}
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t">
				<div className="flex items-center justify-between px-4 py-3">
					{/* Left: Home + Progress */}
					<div className="flex items-center gap-4">
						<Link to="/">
							<Button variant="ghost" size="sm" className="gap-2">
								<HomeIcon className="size-4" />
								<span className="hidden sm:inline">Home</span>
							</Button>
						</Link>
						<div className="hidden sm:block w-32">
							<ProgressBar current={currentSlide + 1} total={totalSlides} />
						</div>
					</div>

					{/* Center: Dots */}
					<div className="hidden md:block">
						<SlideDots current={currentSlide + 1} total={totalSlides} />
					</div>

					{/* Right: Navigation */}
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={goToPrev}
							disabled={currentSlide === 0}
							className="gap-1"
						>
							<ChevronLeftIcon className="size-4" />
							<span className="hidden sm:inline">Prev</span>
						</Button>
						<span className="text-sm text-muted-foreground font-medium px-2">
							{currentSlide + 1} / {totalSlides}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={goToNext}
							disabled={currentSlide === totalSlides - 1}
							className="gap-1"
						>
							<span className="hidden sm:inline">Next</span>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Keyboard hint */}
			<div className="fixed top-4 right-4 z-50 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border hidden lg:block">
				Use arrow keys to navigate
			</div>
		</div>
	)
}
