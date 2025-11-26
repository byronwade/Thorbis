/**
 * AI Caching Layer
 *
 * Universal caching for AI SDK tools using @ai-sdk-tools/cache
 * Supports LRU in-memory caching with optional Redis backend
 */

import { type CachedTool, cached, createCached } from "@ai-sdk-tools/cache";
import type { Tool } from "ai";

/**
 * Default cache configuration
 */
const DEFAULT_CACHE_CONFIG = {
	ttl: 5 * 60 * 1000, // 5 minutes
	maxSize: 1000, // Max 1000 entries
	debug: process.env.NODE_ENV === "development",
};

/**
 * Create a cached version of an AI tool
 *
 * @param tool - The AI SDK tool to cache
 * @param options - Cache options
 * @returns Cached tool with statistics
 *
 * @example
 * ```ts
 * import { cacheAITool } from '@/lib/ai/cache';
 * import { searchCustomers } from './tools';
 *
 * const cachedSearch = cacheAITool(searchCustomers, {
 *   ttl: 60000, // 1 minute cache
 * });
 *
 * // Use like normal tool
 * const results = await cachedSearch.execute({ query: 'john' });
 *
 * // Get cache stats
 * console.log(cachedSearch.getStats());
 * // { hits: 5, misses: 2, hitRate: 0.71, size: 7, maxSize: 1000 }
 * ```
 */
export function cacheAITool<T extends Tool>(
	tool: T,
	options?: {
		ttl?: number;
		maxSize?: number;
		keyGenerator?: (params: unknown, context?: unknown) => string;
		shouldCache?: (params: unknown, result: unknown) => boolean;
		onHit?: (key: string) => void;
		onMiss?: (key: string) => void;
	},
): CachedTool<T> {
	return cached(tool, {
		...DEFAULT_CACHE_CONFIG,
		...options,
	});
}

/**
 * Create a cached tool factory with shared configuration
 *
 * Useful for caching multiple tools with the same backend (e.g., Redis)
 *
 * @param options - Shared cache options
 * @returns Function to create cached tools
 *
 * @example
 * ```ts
 * import { createCachedToolFactory } from '@/lib/ai/cache';
 * import { Redis } from '@upstash/redis';
 *
 * // Create factory with Redis backend
 * const cacheTool = createCachedToolFactory({
 *   cache: Redis.fromEnv(),
 *   keyPrefix: 'ai:tools:',
 *   ttl: 300000, // 5 minutes
 * });
 *
 * // Cache multiple tools
 * const cachedSearchCustomers = cacheTool(searchCustomers);
 * const cachedGetJobDetails = cacheTool(getJobDetails);
 * ```
 */
export function createCachedToolFactory(options?: {
	cache?: unknown; // Redis client or similar
	keyPrefix?: string;
	ttl?: number;
	debug?: boolean;
	onHit?: (key: string) => void;
	onMiss?: (key: string) => void;
}) {
	return createCached({
		...DEFAULT_CACHE_CONFIG,
		...options,
	});
}

/**
 * Pre-configured cache factory for Stratos AI tools
 *
 * Uses in-memory LRU cache by default
 * Can be upgraded to Redis for production
 */
export const stratosCache = createCachedToolFactory({
	keyPrefix: "stratos:ai:",
	ttl: DEFAULT_CACHE_CONFIG.ttl,
	debug: DEFAULT_CACHE_CONFIG.debug,
	onHit: (key) => {
		if (process.env.NODE_ENV === "development") {
			console.log(`[Cache HIT] ${key}`);
		}
	},
	onMiss: (key) => {
		if (process.env.NODE_ENV === "development") {
			console.log(`[Cache MISS] ${key}`);
		}
	},
});

/**
 * Cache key generators for common patterns
 */
export const cacheKeyGenerators = {
	/**
	 * Generate cache key from customer ID
	 */
	byCustomerId: (params: { customerId?: string }) =>
		params.customerId ? `customer:${params.customerId}` : "customer:unknown",

	/**
	 * Generate cache key from job ID
	 */
	byJobId: (params: { jobId?: string }) =>
		params.jobId ? `job:${params.jobId}` : "job:unknown",

	/**
	 * Generate cache key from invoice ID
	 */
	byInvoiceId: (params: { invoiceId?: string }) =>
		params.invoiceId ? `invoice:${params.invoiceId}` : "invoice:unknown",

	/**
	 * Generate cache key from search query
	 */
	bySearchQuery: (params: { query?: string; limit?: number }) =>
		`search:${params.query || ""}:${params.limit || 10}`,

	/**
	 * Generate cache key from date range
	 */
	byDateRange: (params: { startDate?: string; endDate?: string }) =>
		`range:${params.startDate || ""}:${params.endDate || ""}`,
};

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
	/**
	 * Invalidate all cached data for a customer
	 */
	invalidateCustomer: (cachedTool: CachedTool<Tool>, customerId: string) => {
		cachedTool.clearCache(`customer:${customerId}`);
	},

	/**
	 * Invalidate all cached data for a job
	 */
	invalidateJob: (cachedTool: CachedTool<Tool>, jobId: string) => {
		cachedTool.clearCache(`job:${jobId}`);
	},

	/**
	 * Clear all cache entries
	 */
	clearAll: (cachedTool: CachedTool<Tool>) => {
		cachedTool.clearCache();
	},
};

/**
 * Conditional caching predicates
 */
export const shouldCachePredicates = {
	/**
	 * Only cache successful results
	 */
	onSuccess: (_params: unknown, result: unknown) => {
		if (typeof result === "object" && result !== null) {
			const r = result as { error?: unknown; success?: boolean };
			return !r.error && r.success !== false;
		}
		return true;
	},

	/**
	 * Only cache results with data
	 */
	hasData: (_params: unknown, result: unknown) => {
		if (typeof result === "object" && result !== null) {
			const r = result as { data?: unknown };
			return r.data !== undefined && r.data !== null;
		}
		return false;
	},

	/**
	 * Only cache non-empty arrays
	 */
	nonEmptyArray: (_params: unknown, result: unknown) => {
		if (Array.isArray(result)) {
			return result.length > 0;
		}
		if (typeof result === "object" && result !== null) {
			const r = result as { data?: unknown[] };
			return Array.isArray(r.data) && r.data.length > 0;
		}
		return false;
	},
};
