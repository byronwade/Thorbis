/**
 * CustomersSkeleton - Loading Skeleton
 *
 * Uses the shared DataTableListSkeleton for consistent UX across all list pages.
 * Displays while customers data is loading.
 * Matches the exact layout of the customers table to prevent layout shifts.
 */

import { DataTableListSkeleton } from "@/components/ui/skeletons";

export function CustomersSkeleton() {
	return <DataTableListSkeleton />;
}
