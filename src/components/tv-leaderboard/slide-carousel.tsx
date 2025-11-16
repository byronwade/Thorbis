"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect } from "react";
import {
	LazyAnimatePresence as AnimatePresence,
	LazyMotionDiv as motion_div,
} from "@/components/lazy/framer-motion";

// Alias for backward compatibility
const motion = {
	div: motion_div,
};

import { DraggableGrid } from "./draggable-grid";
import type { Slide } from "./slide-types";
import type { Widget } from "./widget-types";

type SlideCarouselProps = {
	slides: Slide[];
	currentSlide: number;
	onSlideChange: (index: number) => void;
	data: any;
	isEditMode: boolean;
	onWidgetsChange?: (slideId: string, widgets: Widget[]) => void;
};

export function SlideCarousel({
	slides,
	currentSlide,
	onSlideChange,
	data,
	isEditMode,
	onWidgetsChange,
}: SlideCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		skipSnaps: false,
		duration: 25,
		startIndex: currentSlide,
	});

	// Sync Embla with external slide changes
	useEffect(() => {
		if (emblaApi && emblaApi.selectedScrollSnap() !== currentSlide) {
			emblaApi.scrollTo(currentSlide);
		}
	}, [emblaApi, currentSlide]);

	// Listen to Embla slide changes
	const onSelect = useCallback(() => {
		if (!emblaApi) {
			return;
		}
		const index = emblaApi.selectedScrollSnap();
		if (index !== currentSlide) {
			onSlideChange(index);
		}
	}, [emblaApi, currentSlide, onSlideChange]);

	useEffect(() => {
		if (!emblaApi) {
			return;
		}
		emblaApi.on("select", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, onSelect]);

	const handleWidgetChange = useCallback(
		(slideId: string, widgets: Widget[]) => {
			onWidgetsChange?.(slideId, widgets);
		},
		[onWidgetsChange],
	);

	if (slides.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground">No widgets to display</p>
					<p className="text-muted-foreground text-sm">
						Add widgets to get started
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full" ref={emblaRef}>
			<div className="flex h-full">
				{slides.map((slide, index) => (
					<div className="relative min-w-0 flex-[0_0_100%]" key={slide.id}>
						<AnimatePresence mode="wait">
							{index === currentSlide && (
								<motion.div
									animate={{ opacity: 1, scale: 1 }}
									className="h-full"
									exit={{ opacity: 0, scale: 0.95 }}
									initial={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.3, ease: "easeInOut" }}
								>
									<DraggableGrid
										data={data}
										isEditMode={isEditMode}
										onWidgetsChange={(widgets) => {
											handleWidgetChange(slide.id, widgets);
										}}
										widgets={slide.widgets}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))}
			</div>
		</div>
	);
}
