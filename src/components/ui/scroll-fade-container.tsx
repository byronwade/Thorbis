"use client";

/**
 * ScrollFadeContainer - Horizontal scroll indicators with fade gradients
 *
 * Provides visual feedback for horizontally scrollable content on mobile devices.
 * Shows fade gradients on the left/right edges to indicate more content is available.
 *
 * Features:
 * - Auto-detects if content is scrollable
 * - Updates gradients based on scroll position
 * - Hides gradients when at start/end of scroll
 * - Optimized with RAF for smooth 60fps updates
 * - Mobile-first (only shows on small screens by default)
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ScrollFadeContainerProps = {
	children: React.ReactNode;
	className?: string;
	/** Show fade gradients on desktop too (default: mobile only) */
	showOnDesktop?: boolean;
	/** Gradient color (default: from-background) */
	gradientFrom?: string;
	/** Gradient size in pixels (default: 40) */
	gradientSize?: number;
};

export function ScrollFadeContainer({
	children,
	className,
	showOnDesktop = false,
	gradientFrom = "from-background",
	gradientSize = 40,
}: ScrollFadeContainerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [showLeftGradient, setShowLeftGradient] = useState(false);
	const [showRightGradient, setShowRightGradient] = useState(false);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const checkScroll = () => {
			const { scrollLeft, scrollWidth, clientWidth } = container;
			const isScrollable = scrollWidth > clientWidth;

			// Show left gradient if scrolled right
			setShowLeftGradient(isScrollable && scrollLeft > 10);

			// Show right gradient if not at end
			setShowRightGradient(
				isScrollable && scrollLeft < scrollWidth - clientWidth - 10,
			);
		};

		// Initial check
		checkScroll();

		// Optimized scroll handler with RAF
		const handleScroll = () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
			rafRef.current = requestAnimationFrame(checkScroll);
		};

		// Also check on resize
		const resizeObserver = new ResizeObserver(checkScroll);
		resizeObserver.observe(container);

		container.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			container.removeEventListener("scroll", handleScroll);
			resizeObserver.disconnect();
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	const visibilityClass = showOnDesktop ? "" : "lg:hidden";

	return (
		<div className="relative">
			{/* Left fade gradient */}
			{showLeftGradient && (
				<div
					className={cn(
						"pointer-events-none absolute left-0 top-0 bottom-0 z-10",
						visibilityClass,
					)}
					style={{ width: `${gradientSize}px` }}
				>
					<div
						className={cn(
							"h-full w-full bg-gradient-to-r to-transparent",
							gradientFrom,
						)}
					/>
				</div>
			)}

			{/* Right fade gradient */}
			{showRightGradient && (
				<div
					className={cn(
						"pointer-events-none absolute right-0 top-0 bottom-0 z-10",
						visibilityClass,
					)}
					style={{ width: `${gradientSize}px` }}
				>
					<div
						className={cn(
							"h-full w-full bg-gradient-to-l to-transparent",
							gradientFrom,
						)}
					/>
				</div>
			)}

			{/* Scrollable content */}
			<div ref={containerRef} className={cn("overflow-x-auto", className)}>
				{children}
			</div>
		</div>
	);
}
