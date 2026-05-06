import { useEffect } from "react";

interface KeyboardNavProps {
	onNext: () => void;
	onPrev: () => void;
	onFirst: () => void;
	onLast: () => void;
}

export function useKeyboardNav({ onNext, onPrev, onFirst, onLast }: KeyboardNavProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger if user is typing in an input
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLSelectElement
			) {
				return;
			}

			switch (e.key) {
				case "ArrowRight":
				case "ArrowDown":
				case " ":
					case "PageDown":
					e.preventDefault();
					onNext();
					break;
				case "ArrowLeft":
				case "ArrowUp":
				case "PageUp":
					e.preventDefault();
					onPrev();
					break;
				case "Home":
					e.preventDefault();
					onFirst();
					break;
				case "End":
					e.preventDefault();
					onLast();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onNext, onPrev, onFirst, onLast]);
}
