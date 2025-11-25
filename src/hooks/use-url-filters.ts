"use client";

/**
 * useUrlFilters - Sync filter state with URL search params
 *
 * Syncs Zustand filter store with URL query parameters, enabling:
 * - Shareable filter states via URL
 * - Filter persistence across page reloads
 * - Browser back/forward navigation
 * - Bookmarkable filtered views
 *
 * Usage:
 * ```tsx
 * // In your table component
 * useUrlFilters(useInvoiceFiltersStore);
 * ```
 *
 * URL format:
 * /invoices?status=paid&archiveStatus=active&amountMin=100
 */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type FilterStore<T> = {
	getState: () => {
		filters: T;
		setFilters: (filters: Partial<T>) => void;
	};
	subscribe: (listener: () => void) => () => void;
};

/**
 * Syncs a Zustand filter store with URL search parameters
 *
 * @param store - Zustand store with filters object and setFilters method
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function InvoicesTable() {
 *   useUrlFilters(useInvoiceFiltersStore);
 *   const filters = useInvoiceFiltersStore((state) => state.filters);
 *   // filters are now synced with URL
 * }
 * ```
 */
export function useUrlFilters<T extends Record<string, any>>(
	store: FilterStore<T>,
	options: {
		/** Filter keys to exclude from URL sync */
		excludeKeys?: (keyof T)[];
		/** Debounce delay for URL updates (ms) */
		debounceMs?: number;
	} = {},
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isInitialMount = useRef(true);
	const { excludeKeys = [], debounceMs = 300 } = options;

	// Read filters from URL on mount
	useEffect(() => {
		if (!isInitialMount.current) return;
		isInitialMount.current = false;

		const urlFilters: Partial<T> = {};
		const currentFilters = store.getState().filters;

		// Parse URL params into filter object
		searchParams.forEach((value, key) => {
			if (excludeKeys.includes(key as keyof T)) return;

			// Only update if the key exists in the filter schema
			if (key in currentFilters) {
				// Parse value based on current filter type
				const currentValue = currentFilters[key as keyof T];
				if (typeof currentValue === "number") {
					urlFilters[key as keyof T] = Number.parseFloat(value) as T[keyof T];
				} else if (typeof currentValue === "boolean") {
					urlFilters[key as keyof T] = (value === "true") as T[keyof T];
				} else {
					urlFilters[key as keyof T] = value as T[keyof T];
				}
			}
		});

		// Apply URL filters to store if any were found
		if (Object.keys(urlFilters).length > 0) {
			store.getState().setFilters(urlFilters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync filter changes to URL
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const unsubscribe = store.subscribe(() => {
			clearTimeout(timeoutId);

			timeoutId = setTimeout(() => {
				const filters = store.getState().filters;
				const params = new URLSearchParams(searchParams.toString());

				// Update URL params with current filters
				Object.entries(filters).forEach(([key, value]) => {
					if (excludeKeys.includes(key as keyof T)) return;

					// Remove param if value is empty/default
					if (
						value === "" ||
						value === null ||
						value === undefined ||
						value === "all" ||
						value === "active"
					) {
						params.delete(key);
					} else {
						params.set(key, String(value));
					}
				});

				const newUrl =
					params.toString() === ""
						? pathname
						: `${pathname}?${params.toString()}`;

				// Only update if URL actually changed
				const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
				if (newUrl !== currentUrl) {
					router.push(newUrl, { scroll: false });
				}
			}, debounceMs);
		});

		return () => {
			clearTimeout(timeoutId);
			unsubscribe();
		};
	}, [store, router, pathname, searchParams, excludeKeys, debounceMs]);
}
