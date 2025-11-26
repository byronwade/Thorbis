/**
 * MaterialsSkeleton - Loading Skeleton
 *
 * Uses the shared DataTableListSkeleton for consistent UX across all list pages.
 * Displays while materials inventory data is loading with search bar.
 * Provides visual feedback during streaming.
 */

import { DataTableListSkeleton } from "@/components/ui/skeletons";

export function MaterialsSkeleton() {
	return <DataTableListSkeleton showSearchBar />;
}
