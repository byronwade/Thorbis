/**
 * VendorsSkeleton - Loading Skeleton
 *
 * Uses the shared DataTableListSkeleton for consistent UX across all list pages.
 * Displays while vendors data is loading with search bar.
 * Provides visual feedback during streaming.
 */

import { DataTableListSkeleton } from "@/components/ui/skeletons";

export function VendorsSkeleton() {
	return <DataTableListSkeleton showSearchBar />;
}
