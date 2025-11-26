"use client";

/**
 * useSidebarScroll - Preserve sidebar scroll position across navigation
 *
 * Automatically saves and restores sidebar scroll position when navigating
 * between pages, providing a better UX by maintaining scroll context.
 *
 * Features:
 * - Saves scroll position before navigation
 * - Restores scroll position on mount
 * - Uses sessionStorage (persists during session)
 * - Debounced scroll saves (performance)
 * - Per-pathname scroll positions
 *
 * Usage:
 * ```tsx
 * function AppSidebar() {
 *   const scrollRef = useSidebarScroll();
 *   return (
 *     <SidebarContent ref={scrollRef}>
 *       ...
 *     </SidebarContent>
 *   );
 * }
 * ```
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "sidebar-scroll-positions";
const DEBOUNCE_MS = 150;

/**
 * Hook to preserve sidebar scroll position across navigation
 *
 * @returns Ref to attach to scrollable sidebar element
 */
export function useSidebarScroll<T extends HTMLElement = HTMLDivElement>() {
	const scrollRef = useRef<T>(null);
	const pathname = usePathname();
	const scrollTimeoutRef = useRef<NodeJS.Timeout>();

	// Restore scroll position on mount/pathname change
	useEffect(() => {
		const element = scrollRef.current;
		if (!element || !pathname) return;

		// Small delay to ensure DOM is ready
		const timeoutId = setTimeout(() => {
			try {
				const stored = sessionStorage.getItem(STORAGE_KEY);
				if (stored) {
					const positions = JSON.parse(stored) as Record<string, number>;
					const savedPosition = positions[pathname];

					if (savedPosition !== undefined) {
						element.scrollTop = savedPosition;
					}
				}
			} catch (error) {
				console.error("Failed to restore sidebar scroll position:", error);
			}
		}, 50);

		return () => clearTimeout(timeoutId);
	}, [pathname]);

	// Save scroll position on scroll (debounced)
	useEffect(() => {
		const element = scrollRef.current;
		if (!element || !pathname) return;

		const handleScroll = () => {
			// Clear existing timeout
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}

			// Debounce scroll saves
			scrollTimeoutRef.current = setTimeout(() => {
				try {
					const stored = sessionStorage.getItem(STORAGE_KEY);
					const positions = stored ? JSON.parse(stored) : {};

					positions[pathname] = element.scrollTop;

					sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
				} catch (error) {
					console.error("Failed to save sidebar scroll position:", error);
				}
			}, DEBOUNCE_MS);
		};

		element.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			element.removeEventListener("scroll", handleScroll);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [pathname]);

	// Save scroll position before unmount
	useEffect(() => {
		return () => {
			const element = scrollRef.current;
			if (!element || !pathname) return;

			try {
				const stored = sessionStorage.getItem(STORAGE_KEY);
				const positions = stored ? JSON.parse(stored) : {};

				positions[pathname] = element.scrollTop;

				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
			} catch (error) {
				console.error(
					"Failed to save sidebar scroll position on unmount:",
					error,
				);
			}
		};
	}, [pathname]);

	return scrollRef;
}
