"use client";

import { LazyMotionButton as motion_button, LazyMotionDiv as motion_div } from "@/components/lazy/framer-motion";
import { cn } from "@/lib/utils";

// Alias for backward compatibility
const motion = {
	div: motion_div,
	button: motion_button,
};

type SlideIndicatorsProps = {
	slideCount: number;
	currentSlide: number;
	onSlideClick: (index: number) => void;
	className?: string;
};

export function SlideIndicators({ slideCount, currentSlide, onSlideClick, className }: SlideIndicatorsProps) {
	if (slideCount <= 1) {
		return null;
	}

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className={cn("-translate-x-1/2 fixed bottom-6 left-1/2 z-40", className)}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
				{Array.from({ length: slideCount }).map((_, index) => {
					const isActive = index === currentSlide;
					return (
						<motion.button
							animate={{
								width: isActive ? 24 : 8,
								backgroundColor: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)",
							}}
							className="h-2 rounded-full transition-colors hover:bg-primary/60"
							key={index}
							onClick={(e) => {
								e.stopPropagation();
								onSlideClick(index);
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							type="button"
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
						/>
					);
				})}
			</div>
		</motion.div>
	);
}
