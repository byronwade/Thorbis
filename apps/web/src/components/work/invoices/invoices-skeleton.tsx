/**
 * InvoicesSkeleton - Loading Skeleton
 *
 * Uses the shared DataTableListSkeleton for consistent UX across all list pages.
 * Displays while invoices data is loading.
 * Matches the exact layout of the invoices table to prevent layout shifts.
 */

import { DataTableListSkeleton } from "@/components/ui/skeletons";

export function InvoicesSkeleton() {
	return <DataTableListSkeleton />;
}
