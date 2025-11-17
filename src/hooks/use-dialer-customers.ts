/**
 * Dialer Customers Hook - Client-Side Lazy Loading
 *
 * PERFORMANCE CRITICAL:
 * Previously, AppHeader fetched ALL customers on EVERY page load (~400-800ms).
 * Now customers are only fetched when the dialer is opened.
 *
 * Features:
 * - Lazy load on first dialer open
 * - 5-minute cache in memory
 * - No server-side overhead on page loads
 *
 * Expected savings: 400-800ms per page load
 */

import { useEffect, useState } from "react";
import { getCustomersForDialer } from "@/actions/customers";

type DialerCustomer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	company_name: string | null;
};

// In-memory cache with 5-minute TTL
let cachedCustomers: DialerCustomer[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useDialerCustomers(shouldFetch = false) {
	const [customers, setCustomers] = useState<DialerCustomer[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Only fetch if explicitly requested (e.g., dialer opened)
		if (!shouldFetch) {
			return;
		}

		// Check cache first
		const now = Date.now();
		if (cachedCustomers && now - cacheTimestamp < CACHE_TTL) {
			setCustomers(cachedCustomers);
			return;
		}

		// Fetch from server
		const fetchCustomers = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await getCustomersForDialer();

				if (result.success && result.data) {
					cachedCustomers = result.data;
					cacheTimestamp = now;
					setCustomers(result.data);
				} else {
					setError(result.error || "Failed to load customers");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load customers");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCustomers();
	}, [shouldFetch]);

	return { customers, isLoading, error };
}

// Helper to invalidate cache (call after creating/updating customers)
export function invalidateDialerCustomersCache() {
	cachedCustomers = null;
	cacheTimestamp = 0;
}
