/**
 * Server-Side Pagination Hook
 *
 * USE THIS FOR:
 * - 100,000+ rows (too large for client-side)
 * - Real-time data that changes frequently
 * - Data requiring authorization checks per row
 * - Database queries with complex joins
 *
 * PERFORMANCE:
 * - Only fetches current page (e.g., 50 rows instead of 100,000)
 * - Filtering/sorting happens in database (fast indexes)
 * - Low memory usage on client
 * - Fast initial page load
 *
 * EXAMPLE:
 * ```tsx
 * const { data, isLoading, pagination, filters, sorting } = useServerPagination({
 *   fetchFn: async (params) => {
 *     const { data, count } = await fetchJobs(params);
 *     return { data, totalCount: count };
 *   },
 *   pageSize: 50,
 * });
 * ```
 */

"use client";

import { useCallback, useEffect, useState } from "react";

export type SortDirection = "asc" | "desc";

export type SortConfig = {
	column: string;
	direction: SortDirection;
};

export type FilterConfig = Record<string, any>;

export type PaginationParams = {
	page: number;
	pageSize: number;
	sortBy?: string;
	sortDirection?: SortDirection;
	filters?: FilterConfig;
	search?: string;
};

export type PaginationResponse<T> = {
	data: T[];
	totalCount: number;
};

export type UseServerPaginationOptions<T> = {
	/** Function to fetch data from server */
	fetchFn: (params: PaginationParams) => Promise<PaginationResponse<T>>;
	/** Initial page size (default: 50) */
	pageSize?: number;
	/** Initial page number (default: 1) */
	initialPage?: number;
	/** Initial sort configuration */
	initialSort?: SortConfig;
	/** Initial filters */
	initialFilters?: FilterConfig;
	/** Debounce delay for search in ms (default: 300) */
	searchDebounce?: number;
	/** Enable automatic refetching on params change (default: true) */
	autoFetch?: boolean;
};

export type UseServerPaginationReturn<T> = {
	// Data
	data: T[];
	isLoading: boolean;
	error: Error | null;
	totalCount: number;

	// Pagination
	pagination: {
		page: number;
		pageSize: number;
		totalPages: number;
		goToPage: (page: number) => void;
		nextPage: () => void;
		previousPage: () => void;
		setPageSize: (size: number) => void;
	};

	// Sorting
	sorting: {
		sortBy?: string;
		sortDirection?: SortDirection;
		setSort: (column: string, direction?: SortDirection) => void;
		clearSort: () => void;
	};

	// Filtering
	filters: {
		current: FilterConfig;
		setFilter: (key: string, value: any) => void;
		setFilters: (filters: FilterConfig) => void;
		clearFilter: (key: string) => void;
		clearAllFilters: () => void;
	};

	// Search
	search: {
		query: string;
		setQuery: (query: string) => void;
		clearQuery: () => void;
	};

	// Actions
	refetch: () => Promise<void>;
	reset: () => void;
};

export function useServerPagination<T>({
	fetchFn,
	pageSize = 50,
	initialPage = 1,
	initialSort,
	initialFilters = {},
	searchDebounce = 300,
	autoFetch = true,
}: UseServerPaginationOptions<T>): UseServerPaginationReturn<T> {
	// State
	const [data, setData] = useState<T[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [totalCount, setTotalCount] = useState(0);

	const [page, setPage] = useState(initialPage);
	const [currentPageSize, setCurrentPageSize] = useState(pageSize);
	const [sortBy, setSortBy] = useState<string | undefined>(initialSort?.column);
	const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
		initialSort?.direction
	);
	const [filterConfig, setFilterConfig] = useState<FilterConfig>(initialFilters);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
			setPage(1); // Reset to first page on search
		}, searchDebounce);

		return () => clearTimeout(timer);
	}, [searchQuery, searchDebounce]);

	// Fetch data
	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const params: PaginationParams = {
				page,
				pageSize: currentPageSize,
				sortBy,
				sortDirection,
				filters: filterConfig,
				search: debouncedSearch || undefined,
			};

			const response = await fetchFn(params);

			setData(response.data);
			setTotalCount(response.totalCount);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to fetch data"));
			setData([]);
			setTotalCount(0);
		} finally {
			setIsLoading(false);
		}
	}, [page, currentPageSize, sortBy, sortDirection, filterConfig, debouncedSearch, fetchFn]);

	// Auto-fetch when params change
	useEffect(() => {
		if (autoFetch) {
			fetchData();
		}
	}, [fetchData, autoFetch]);

	// Pagination controls
	const totalPages = Math.ceil(totalCount / currentPageSize);

	const goToPage = useCallback(
		(newPage: number) => {
			setPage(Math.max(1, Math.min(newPage, totalPages || 1)));
		},
		[totalPages]
	);

	const nextPage = useCallback(() => {
		goToPage(page + 1);
	}, [page, goToPage]);

	const previousPage = useCallback(() => {
		goToPage(page - 1);
	}, [page, goToPage]);

	const setPageSizeAndReset = useCallback((size: number) => {
		setCurrentPageSize(size);
		setPage(1);
	}, []);

	// Sorting controls
	const setSort = useCallback(
		(column: string, direction?: SortDirection) => {
			if (sortBy === column && !direction) {
				// Toggle direction
				if (sortDirection === "asc") {
					setSortDirection("desc");
				} else if (sortDirection === "desc") {
					// Clear sort
					setSortBy(undefined);
					setSortDirection(undefined);
				} else {
					setSortDirection("asc");
				}
			} else {
				setSortBy(column);
				setSortDirection(direction || "asc");
			}
			setPage(1);
		},
		[sortBy, sortDirection]
	);

	const clearSort = useCallback(() => {
		setSortBy(undefined);
		setSortDirection(undefined);
		setPage(1);
	}, []);

	// Filter controls
	const setFilter = useCallback((key: string, value: any) => {
		setFilterConfig((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	}, []);

	const setFilters = useCallback((filters: FilterConfig) => {
		setFilterConfig(filters);
		setPage(1);
	}, []);

	const clearFilter = useCallback((key: string) => {
		setFilterConfig((prev) => {
			const newFilters = { ...prev };
			delete newFilters[key];
			return newFilters;
		});
		setPage(1);
	}, []);

	const clearAllFilters = useCallback(() => {
		setFilterConfig({});
		setPage(1);
	}, []);

	// Search controls
	const clearSearchQuery = useCallback(() => {
		setSearchQuery("");
		setDebouncedSearch("");
	}, []);

	// Reset all
	const reset = useCallback(() => {
		setPage(initialPage);
		setCurrentPageSize(pageSize);
		setSortBy(initialSort?.column);
		setSortDirection(initialSort?.direction);
		setFilterConfig(initialFilters);
		setSearchQuery("");
		setDebouncedSearch("");
	}, [initialPage, pageSize, initialSort, initialFilters]);

	return {
		// Data
		data,
		isLoading,
		error,
		totalCount,

		// Pagination
		pagination: {
			page,
			pageSize: currentPageSize,
			totalPages,
			goToPage,
			nextPage,
			previousPage,
			setPageSize: setPageSizeAndReset,
		},

		// Sorting
		sorting: {
			sortBy,
			sortDirection,
			setSort,
			clearSort,
		},

		// Filtering
		filters: {
			current: filterConfig,
			setFilter,
			setFilters,
			clearFilter,
			clearAllFilters,
		},

		// Search
		search: {
			query: searchQuery,
			setQuery: setSearchQuery,
			clearQuery: clearSearchQuery,
		},

		// Actions
		refetch: fetchData,
		reset,
	};
}
