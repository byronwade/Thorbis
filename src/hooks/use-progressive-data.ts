/**
 * Progressive Data Hook Factory
 *
 * Generic factory for creating on-demand data loading hooks for any entity relationship.
 * This hook factory enables lazy loading of related data (jobs, invoices, payments, etc.)
 * that should only be fetched when the user actually needs it.
 *
 * Usage Examples:
 *
 * 1. Load customer's jobs when "Jobs" tab opens:
 *    const { data: jobs } = useProgressiveData(
 *      ["customer-jobs", customerId],
 *      async () => supabase.from("jobs").select("*").eq("customer_id", customerId),
 *      isJobsTabActive
 *    );
 *
 * 2. Load invoice payments when "Payments" section expands:
 *    const { data: payments } = useProgressiveData(
 *      ["invoice-payments", invoiceId],
 *      async () => supabase.from("payments").select("*").eq("invoice_id", invoiceId),
 *      isPaymentsSectionExpanded
 *    );
 *
 * 3. Load property equipment when widget is visible:
 *    const { data: equipment } = useProgressiveData(
 *      ["property-equipment", propertyId],
 *      async () => supabase.from("equipment").select("*").eq("property_id", propertyId),
 *      isWidgetVisible
 *    );
 */

"use client";

import { useQuery, type QueryKey } from "@tanstack/react-query";

type FetcherFn<T> = () => Promise<{ data: T | null; error: Error | null }>;

interface ProgressiveDataOptions {
	/**
	 * Enable/disable the query (tied to tab/accordion/widget visibility)
	 */
	enabled?: boolean;

	/**
	 * Time in milliseconds to consider data fresh (default: 5 minutes)
	 */
	staleTime?: number;

	/**
	 * Time in milliseconds to keep data in cache (default: 10 minutes)
	 */
	gcTime?: number;

	/**
	 * Number of times to retry on error (default: 1)
	 */
	retry?: number;
}

export function useProgressiveData<T>(
	queryKey: QueryKey,
	fetcher: FetcherFn<T>,
	options: ProgressiveDataOptions = {},
) {
	const {
		enabled = true,
		staleTime = 5 * 60 * 1000, // 5 minutes
		gcTime = 10 * 60 * 1000, // 10 minutes
		retry = 1,
	} = options;

	return useQuery({
		queryKey,
		queryFn: async () => {
			const { data, error } = await fetcher();
			if (error) throw error;
			return data;
		},
		enabled,
		staleTime,
		gcTime,
		retry,
	});
}
