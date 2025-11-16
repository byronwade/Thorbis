"use client";

/**
 * React Query Provider - Data Fetching & Caching
 *
 * Provides React Query (TanStack Query) for:
 * - Client-side data fetching with automatic caching
 * - Automatic refetching and background updates
 * - Optimistic updates and mutations
 * - Loading and error states
 *
 * Use for client components that need to fetch data.
 * Prefer Server Components for initial data loading.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Stale time: How long data is considered fresh (5 minutes)
						staleTime: 5 * 60 * 1000,
						// Refetch on window focus to keep data fresh
						refetchOnWindowFocus: true,
						// Retry failed requests
						retry: 1,
						// Keep unused data in cache for 10 minutes
						gcTime: 10 * 60 * 1000,
					},
					mutations: {
						// Retry failed mutations once
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}
