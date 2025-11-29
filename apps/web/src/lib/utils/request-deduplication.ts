/**
 * Request Deduplication Utility
 * 
 * Prevents duplicate concurrent requests by caching pending promises.
 * If multiple components request the same data simultaneously, they share
 * the same promise instead of making multiple API calls.
 * 
 * Usage:
 * ```ts
 * const fetchData = deduplicateRequest(async () => {
 *   return await api.fetchData();
 * });
 * 
 * // Multiple calls share the same promise
 * const result1 = await fetchData("key");
 * const result2 = await fetchData("key"); // Uses cached promise
 * ```
 */

interface PendingRequest<T> {
	promise: Promise<T>;
	timestamp: number;
}

class RequestDeduplication {
	private pendingRequests = new Map<string, PendingRequest<unknown>>();
	private readonly TTL = 60000; // 60 seconds TTL for cached requests

	/**
	 * Deduplicate a request function
	 * 
	 * @param requestFn - Async function that makes the request
	 * @param key - Unique key for this request (typically based on request params)
	 * @returns Promise that resolves when the request completes
	 */
	async deduplicate<T>(
		requestFn: () => Promise<T>,
		key: string,
	): Promise<T> {
		// Check if there's already a pending request for this key
		const existing = this.pendingRequests.get(key);

		if (existing) {
			// Check if request is still valid (not expired)
			const age = Date.now() - existing.timestamp;
			if (age < this.TTL) {
				// Return existing promise
				return existing.promise as Promise<T>;
			} else {
				// Request expired, remove it
				this.pendingRequests.delete(key);
			}
		}

		// Create new request
		const promise = requestFn().finally(() => {
			// Clean up after request completes (with delay to allow concurrent requests)
			setTimeout(() => {
				this.pendingRequests.delete(key);
			}, 1000);
		});

		// Cache the promise
		this.pendingRequests.set(key, {
			promise: promise as Promise<unknown>,
			timestamp: Date.now(),
		});

		return promise;
	}

	/**
	 * Clear a specific request from cache
	 */
	clear(key: string): void {
		this.pendingRequests.delete(key);
	}

	/**
	 * Clear all cached requests
	 */
	clearAll(): void {
		this.pendingRequests.clear();
	}

	/**
	 * Get the number of pending requests
	 */
	size(): number {
		return this.pendingRequests.size;
	}
}

// Singleton instance
const requestDeduplication = new RequestDeduplication();

/**
 * Create a deduplicated request function
 * 
 * @param requestFn - Async function that makes the request
 * @returns A function that deduplicates requests based on a key
 * 
 * @example
 * ```ts
 * const fetchData = deduplicateRequest(async (params) => {
 *   return await api.fetchData(params);
 * });
 * 
 * const key = JSON.stringify({ id: 123 });
 * const result = await fetchData(key, () => api.fetchData({ id: 123 }));
 * ```
 */
export function deduplicateRequest<T>(
	requestFn: () => Promise<T>,
	key: string,
): Promise<T> {
	return requestDeduplication.deduplicate(requestFn, key);
}

/**
 * Clear a deduplicated request
 */
export function clearDeduplicatedRequest(key: string): void {
	requestDeduplication.clear(key);
}

/**
 * Clear all deduplicated requests
 */
export function clearAllDeduplicatedRequests(): void {
	requestDeduplication.clearAll();
}

