/**
 * Supabase Server-Side Pagination Utilities
 *
 * Helper functions to build efficient Supabase queries with:
 * - Pagination
 * - Sorting
 * - Filtering
 * - Searching
 * - RLS (Row Level Security) compliant
 *
 * PERFORMANCE:
 * - Uses database indexes for fast sorting/filtering
 * - COUNT query optimized for performance
 * - Supports partial text search with database indexes
 * - RLS policies enforced at database level
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PaginationParams } from "@/lib/hooks/use-server-pagination";

/**
 * Build a paginated Supabase query
 *
 * @example
 * ```ts
 * const supabase = await createClient();
 * const { data, count } = await buildPaginatedQuery(
 *   supabase.from('jobs'),
 *   {
 *     page: 1,
 *     pageSize: 50,
 *     sortBy: 'created_at',
 *     sortDirection: 'desc',
 *     filters: { status: 'active' },
 *     search: 'plumbing',
 *   },
 *   ['title', 'description'] // Searchable columns
 * );
 * ```
 */
export async function buildPaginatedQuery<T>(
	query: any,
	params: PaginationParams,
	searchColumns?: string[]
): Promise<{ data: T[]; count: number }> {
	const { page, pageSize, sortBy, sortDirection, filters, search } = params;

	// Start with base query
	let queryBuilder = query;

	// Apply filters
	if (filters) {
		for (const [key, value] of Object.entries(filters)) {
			if (value !== undefined && value !== null && value !== "") {
				if (Array.isArray(value)) {
					queryBuilder = queryBuilder.in(key, value);
				} else {
					queryBuilder = queryBuilder.eq(key, value);
				}
			}
		}
	}

	// Apply search
	if (search && searchColumns && searchColumns.length > 0) {
		// Build OR condition for searching across multiple columns
		const searchConditions = searchColumns.map((col) => `${col}.ilike.%${search}%`).join(",");
		queryBuilder = queryBuilder.or(searchConditions);
	}

	// Get total count (before pagination)
	const countQuery = queryBuilder;
	const { count } = await countQuery.select("*", {
		count: "exact",
		head: true,
	});

	// Apply sorting
	if (sortBy) {
		queryBuilder = queryBuilder.order(sortBy, {
			ascending: sortDirection === "asc",
		});
	}

	// Apply pagination
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;
	queryBuilder = queryBuilder.range(from, to);

	// Execute query
	const { data, error } = await queryBuilder;

	if (error) {
		throw new Error(`Database query failed: ${error.message}`);
	}

	return {
		data: data || [],
		count: count || 0,
	};
}

/**
 * Build advanced filters for complex queries
 *
 * @example
 * ```ts
 * const filters = buildAdvancedFilters({
 *   status: { operator: 'in', value: ['active', 'pending'] },
 *   created_at: { operator: 'gte', value: '2024-01-01' },
 *   total: { operator: 'gt', value: 1000 },
 * });
 * ```
 */
export type FilterOperator =
	| "eq" // equals
	| "neq" // not equals
	| "gt" // greater than
	| "gte" // greater than or equal
	| "lt" // less than
	| "lte" // less than or equal
	| "in" // in array
	| "is" // is null/not null
	| "like" // pattern match
	| "ilike"; // case-insensitive pattern match

export type AdvancedFilter = {
	operator: FilterOperator;
	value: any;
};

export type AdvancedFilters = Record<string, AdvancedFilter>;

export function applyAdvancedFilters(query: any, filters: AdvancedFilters): any {
	let queryBuilder = query;

	for (const [column, filter] of Object.entries(filters)) {
		const { operator, value } = filter;

		switch (operator) {
			case "eq":
				queryBuilder = queryBuilder.eq(column, value);
				break;
			case "neq":
				queryBuilder = queryBuilder.neq(column, value);
				break;
			case "gt":
				queryBuilder = queryBuilder.gt(column, value);
				break;
			case "gte":
				queryBuilder = queryBuilder.gte(column, value);
				break;
			case "lt":
				queryBuilder = queryBuilder.lt(column, value);
				break;
			case "lte":
				queryBuilder = queryBuilder.lte(column, value);
				break;
			case "in":
				queryBuilder = queryBuilder.in(column, value);
				break;
			case "is":
				queryBuilder = queryBuilder.is(column, value);
				break;
			case "like":
				queryBuilder = queryBuilder.like(column, value);
				break;
			case "ilike":
				queryBuilder = queryBuilder.ilike(column, value);
				break;
		}
	}

	return queryBuilder;
}

/**
 * Fetch paginated data with automatic retry and error handling
 *
 * @example
 * ```ts
 * const fetchJobs = async (params: PaginationParams) => {
 *   const supabase = await createClient();
 *   return fetchPaginatedData(
 *     supabase,
 *     'jobs',
 *     params,
 *     ['title', 'description'],
 *     { retries: 3 }
 *   );
 * };
 * ```
 */
export async function fetchPaginatedData<T>(
	supabase: SupabaseClient,
	tableName: string,
	params: PaginationParams,
	searchColumns?: string[],
	options: {
		retries?: number;
		retryDelay?: number;
		select?: string;
	} = {}
): Promise<{ data: T[]; totalCount: number }> {
	const { retries = 0, retryDelay = 1000, select = "*" } = options;

	let lastError: Error | null = null;
	let attempt = 0;

	while (attempt <= retries) {
		try {
			const query = supabase.from(tableName).select(select, { count: "exact" });

			const result = await buildPaginatedQuery<T>(query, params, searchColumns);

			return {
				data: result.data,
				totalCount: result.count,
			};
		} catch (error) {
			lastError = error instanceof Error ? error : new Error("Unknown error");
			attempt++;

			if (attempt <= retries) {
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}
	}

	throw lastError || new Error("Failed to fetch data");
}

/**
 * Create a reusable fetch function for a specific table
 *
 * @example
 * ```ts
 * // Create fetch function once
 * const fetchJobs = createTableFetcher<Job>(
 *   'jobs',
 *   ['title', 'description', 'notes']
 * );
 *
 * // Use in component with useServerPagination
 * const pagination = useServerPagination({
 *   fetchFn: async (params) => {
 *     const supabase = await createClient();
 *     return fetchJobs(supabase, params);
 *   },
 *   pageSize: 50,
 * });
 * ```
 */
export function createTableFetcher<T>(
	tableName: string,
	searchColumns?: string[],
	options?: {
		select?: string;
		retries?: number;
	}
) {
	return async (supabase: SupabaseClient, params: PaginationParams): Promise<{ data: T[]; totalCount: number }> =>
		fetchPaginatedData<T>(supabase, tableName, params, searchColumns, options);
}

/**
 * Performance optimizations for COUNT queries
 *
 * For tables with millions of rows, exact COUNT can be slow.
 * Use estimated count for better performance.
 */
export async function getEstimatedCount(
	supabase: SupabaseClient,
	tableName: string,
	filters?: Record<string, any>
): Promise<number> {
	let query = supabase.from(tableName).select("*", {
		count: "estimated",
		head: true,
	});

	// Apply filters
	if (filters) {
		for (const [key, value] of Object.entries(filters)) {
			if (value !== undefined && value !== null && value !== "") {
				query = query.eq(key, value);
			}
		}
	}

	const { count } = await query;
	return count || 0;
}
