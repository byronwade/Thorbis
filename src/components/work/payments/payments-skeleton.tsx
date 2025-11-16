/**
 * PaymentsSkeleton - Loading Skeleton
 *
 * Uses the shared DataTableListSkeleton for consistent UX across all list pages.
 * Displays while payments data is loading.
 * Provides visual feedback during streaming.
 */

import { DataTableListSkeleton } from "@/components/ui/skeletons";

export function PaymentsSkeleton() {
	return <DataTableListSkeleton />;
}
