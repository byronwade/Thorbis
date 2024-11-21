import { useState, useEffect } from "react";
import { useKeyPress } from "@/hooks/useKeyPress";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { SlideDots } from "./SlideDots";
import { TableOfContents } from "./TableOfContents";

interface PresentationProps {
	children: React.ReactNode;
	animationsEnabled?: boolean;
	slideTransitions?: boolean;
}

type SlideComponent = {
	displayName?: string;
	name?: string;
};

export const Presentation = ({ children, animationsEnabled = true, slideTransitions = true }: PresentationProps) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const slides = React.Children.toArray(children);

	const slideNames = slides.map((slide) => {
		const component = slide as React.ReactElement;
		const type = component.type as SlideComponent;
		return type.displayName || type.name || "Unnamed Slide";
	});

	useEffect(() => {
		console.log("Current slide:", currentSlide);
		console.log("Number of slides:", slides.length);
	}, [currentSlide, slides.length]);

	useKeyPress("ArrowLeft", () => {
		setCurrentSlide((prev) => Math.max(0, prev - 1));
	});

	useKeyPress("ArrowRight", () => {
		setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
	});

	return (
		<div className="relative w-screen h-screen overflow-hidden bg-black">
			<TableOfContents slideNames={slideNames} currentSlide={currentSlide} onSlideSelect={setCurrentSlide} />

			{slideTransitions ? (
				<AnimatePresence mode="wait">
					{slides.map((slide, index) => {
						if (index !== currentSlide) return null;
						return React.cloneElement(slide as React.ReactElement, {
							key: index,
							isActive: true,
							animationsEnabled,
						});
					})}
				</AnimatePresence>
			) : (
				slides.map((slide, index) => {
					if (index !== currentSlide) return null;
					return React.cloneElement(slide as React.ReactElement, {
						key: index,
						isActive: true,
						animationsEnabled,
					});
				})
			)}

			<SlideDots totalSlides={slides.length} currentSlide={currentSlide} slideNames={slideNames} onDotClick={setCurrentSlide} />
		</div>
	);
};
