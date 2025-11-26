"use client";

/**
 * SkipLink - Accessibility helper for keyboard navigation
 *
 * Allows keyboard users to skip directly to main content,
 * bypassing navigation and header elements.
 * Meets WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 */
export function SkipLink() {
	return (
		<a
			href="#main-content"
			className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:transition-all"
		>
			Skip to main content
		</a>
	);
}
