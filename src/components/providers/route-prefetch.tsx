"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Route Prefetch Provider
 *
 * Prefetches common routes on mount to reduce "click twice" behavior
 * in Next.js development mode.
 *
 * This component helps warm up the Next.js compiler cache for frequently
 * accessed routes, making navigation feel more responsive during development.
 *
 * NOTE: This only affects development mode. In production, all routes are
 * pre-compiled during the build step.
 */

const COMMON_ROUTES = [
	// Dashboard
	"/dashboard",

	// Work section - all subroutes
	"/dashboard/work",
	"/dashboard/work/jobs",
	"/dashboard/work/invoices",
	"/dashboard/work/estimates",
	"/dashboard/work/contracts",
	"/dashboard/work/appointments",
	"/dashboard/work/payments",
	"/dashboard/work/equipment",
	"/dashboard/work/purchase-orders",
	"/dashboard/work/properties",
	"/dashboard/work/team",
	"/dashboard/work/vendors",
	"/dashboard/work/materials",
	"/dashboard/work/pricebook",
	"/dashboard/work/service-agreements",
	"/dashboard/work/maintenance-plans",

	// Customers
	"/dashboard/customers",

	// Communication
	"/dashboard/communication",

	// Schedule
	"/dashboard/schedule",

	// Reports (if accessed frequently)
	"/dashboard/reports",

	// Settings
	"/dashboard/settings",
	"/dashboard/settings/company",
	"/dashboard/settings/team",
];

export function RoutePrefetch() {
	const router = useRouter();

	useEffect(() => {
		// Only prefetch in development to avoid unnecessary work in production
		if (process.env.NODE_ENV !== "development") {
			return;
		}

		// Prefetch common routes after a delay to avoid blocking initial render
		// Stagger the prefetching to avoid overwhelming the compiler
		const timeout = setTimeout(() => {
			// Prefetch in batches to reduce load
			const batchSize = 3;
			let currentIndex = 0;

			const prefetchBatch = () => {
				const batch = COMMON_ROUTES.slice(
					currentIndex,
					currentIndex + batchSize,
				);
				batch.forEach((route) => {
					router.prefetch(route);
				});

				currentIndex += batchSize;
				if (currentIndex < COMMON_ROUTES.length) {
					// Delay between batches
					setTimeout(prefetchBatch, 500);
				}
			};

			prefetchBatch();
		}, 2000); // Wait 2 seconds before starting

		return () => clearTimeout(timeout);
	}, [router]);

	return null; // This component renders nothing
}
