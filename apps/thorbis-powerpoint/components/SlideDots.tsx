import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SlideDotsProps {
	totalSlides: number;
	currentSlide: number;
	slideNames: string[];
	onDotClick: (index: number) => void;
}

export const SlideDots = ({ totalSlides, currentSlide, slideNames, onDotClick }: SlideDotsProps) => {
	return (
		<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
			<TooltipProvider>
				{Array.from({ length: totalSlides }).map((_, index) => (
					<Tooltip key={index}>
						<TooltipTrigger asChild>
							<button onClick={() => onDotClick(index)} className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-primary scale-110" : "bg-muted hover:bg-primary/50"}`} aria-label={`Go to slide ${index + 1}`} />
						</TooltipTrigger>
						<TooltipContent>
							<p>{slideNames[index] || `Slide ${index + 1}`}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</TooltipProvider>
		</div>
	);
};
