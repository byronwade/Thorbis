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
 *      "customer-jobs-" + customerId,
 *      async () => supabase.from("jobs").select("*").eq("customer_id", customerId),
 *      isJobsTabActive
 *    );
 *
 * 2. Load invoice payments when "Payments" section expands:
 *    const { data: payments } = useProgressiveData(
 *      "invoice-payments-" + invoiceId,
 *      async () => supabase.from("payments").select("*").eq("invoice_id", invoiceId),
 *      isPaymentsSectionExpanded
 *    );
 *
 * 3. Load property equipment when widget is visible:
 *    const { data: equipment } = useProgressiveData(
 *      "property-equipment-" + propertyId,
 *      async () => supabase.from("equipment").select("*").eq("property_id", propertyId),
 *      isWidgetVisible
 *    );
 */

"use client";

import { useEffect, useState } from "react";

type FetcherFn<T> = () => Promise<{ data: T | null; error: Error | null }>;

interface ProgressiveDataOptions {
	/**
	 * Enable/disable the query (tied to tab/accordion/widget visibility)
	 */
	enabled?: boolean;
}

export function useProgressiveData<T>(
	_queryKey: string,
	fetcher: FetcherFn<T>,
	options: ProgressiveDataOptions = {},
) {
	const { enabled = true } = options;

	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const fetchData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await fetcher();
				if (result.error) throw result.error;
				setData(result.data);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch data"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled]);

	return { data, error, isLoading };
}
