import { useCallback, useEffect, useState } from "react";

type UseSlideNavigationProps = {
	slideCount: number;
	onInteraction?: () => void;
};

export function useSlideNavigation({
	slideCount,
	onInteraction,
}: UseSlideNavigationProps) {
	const [currentSlide, setCurrentSlide] = useState(0);

	const goToSlide = useCallback(
		(index: number) => {
			if (index >= 0 && index < slideCount) {
				setCurrentSlide(index);
				onInteraction?.();
			}
		},
		[slideCount, onInteraction],
	);

	const nextSlide = useCallback(() => {
		const next = (currentSlide + 1) % slideCount;
		goToSlide(next);
	}, [currentSlide, slideCount, goToSlide]);

	const previousSlide = useCallback(() => {
		const prev = (currentSlide - 1 + slideCount) % slideCount;
		goToSlide(prev);
	}, [currentSlide, slideCount, goToSlide]);

	// Keyboard navigation
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "ArrowLeft") {
				previousSlide();
			} else if (event.key === "ArrowRight") {
				nextSlide();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [nextSlide, previousSlide]);

	// Reset to first slide if current slide becomes invalid
	useEffect(() => {
		if (currentSlide >= slideCount && slideCount > 0) {
			setCurrentSlide(0);
		}
	}, [currentSlide, slideCount]);

	return {
		currentSlide,
		goToSlide,
		nextSlide,
		previousSlide,
		setCurrentSlide,
	};
}
