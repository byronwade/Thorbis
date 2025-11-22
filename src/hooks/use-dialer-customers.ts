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

type DialerCustomer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	company_name: string | null;
	secondary_phone?: string | null;
	address: string | null;
	address2: string | null;
	city: string | null;
	state: string | null;
	zip_code: string | null;
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

		// Serve from cache when available
		const now = Date.now();
		if (cachedCustomers && now - cacheTimestamp < CACHE_TTL) {
			setCustomers(cachedCustomers);
			return;
		}

		const controller = new AbortController();
		const fetchCustomers = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/dialer/customers", {
					signal: controller.signal,
					cache: "no-store",
				});

				if (!response.ok) {
					const payload = await response.json().catch(() => ({}));
					throw new Error(payload.error || "Failed to load customers");
				}

				const payload = (await response.json()) as {
					customers: DialerCustomer[];
				};
				cachedCustomers = payload.customers;
				cacheTimestamp = Date.now();
				setCustomers(payload.customers);
			} catch (err) {
				if (controller.signal.aborted) {
					return;
				}
				setError(
					err instanceof Error ? err.message : "Failed to load customers",
				);
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		fetchCustomers();

		return () => {
			controller.abort();
		};
	}, [shouldFetch]);

	return { customers, isLoading, error };
}

// Helper to invalidate cache (call after creating/updating customers)
function invalidateDialerCustomersCache() {
	cachedCustomers = null;
	cacheTimestamp = 0;
}
