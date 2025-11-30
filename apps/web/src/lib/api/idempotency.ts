/**
 * Idempotency Key Management
 *
 * Provides idempotency support for API endpoints to prevent duplicate operations.
 * Uses in-memory storage for development, can be swapped with Redis for production.
 *
 * Usage:
 * ```typescript
 * const result = await withIdempotency(
 *   request,
 *   'payments',
 *   async () => {
 *     return await processPayment(...)
 *   }
 * );
 * ```
 */

import { NextRequest } from "next/server";

// Simple in-memory idempotency cache
// For production, replace with Redis/Upstash
class IdempotencyStore {
	private cache: Map<string, { response: unknown; expiresAt: number }>;
	private readonly ttlMs: number;

	constructor(ttlMs = 24 * 60 * 60 * 1000) {
		// 24 hour TTL
		this.cache = new Map();
		this.ttlMs = ttlMs;

		// Cleanup expired entries every hour
		setInterval(() => this.cleanup(), 60 * 60 * 1000);
	}

	async get(key: string): Promise<unknown | null> {
		const entry = this.cache.get(key);

		if (!entry) {
			return null;
		}

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return entry.response;
	}

	async set(key: string, response: unknown): Promise<void> {
		this.cache.set(key, {
			response,
			expiresAt: Date.now() + this.ttlMs,
		});
	}

	private cleanup() {
		const now = Date.now();
		const entries = Array.from(this.cache.entries());
		for (const [key, entry] of entries) {
			if (now > entry.expiresAt) {
				this.cache.delete(key);
			}
		}
	}

	clear() {
		this.cache.clear();
	}
}

// Singleton instance
const idempotencyStore = new IdempotencyStore();

/**
 * Extract idempotency key from request headers
 *
 * Supports both standard header names:
 * - Idempotency-Key (recommended)
 * - X-Idempotency-Key
 */
export function getIdempotencyKey(request: NextRequest): string | null {
	return (
		request.headers.get("Idempotency-Key") ||
		request.headers.get("X-Idempotency-Key") ||
		null
	);
}

/**
 * Generate a namespaced idempotency key
 *
 * Combines scope and key to prevent collisions across different operations
 */
function generateCacheKey(scope: string, key: string): string {
	return `idempotency:${scope}:${key}`;
}

export interface IdempotencyResult<T> {
	response: T;
	wasIdempotent: boolean; // true if this was a cached response
}

/**
 * Execute an operation with idempotency protection
 *
 * If an idempotency key is provided and we've seen it before,
 * return the cached response. Otherwise execute the operation
 * and cache the result.
 *
 * @param request - Next.js request object
 * @param scope - Operation scope (e.g., 'payments', 'emails')
 * @param operation - Async function to execute
 * @returns Result with wasIdempotent flag
 */
export async function withIdempotency<T>(
	request: NextRequest,
	scope: string,
	operation: () => Promise<T>,
): Promise<IdempotencyResult<T>> {
	const idempotencyKey = getIdempotencyKey(request);

	// If no idempotency key provided, just execute the operation
	if (!idempotencyKey) {
		const response = await operation();
		return { response, wasIdempotent: false };
	}

	const cacheKey = generateCacheKey(scope, idempotencyKey);

	// Check if we've processed this key before
	const cachedResponse = await idempotencyStore.get(cacheKey);
	if (cachedResponse) {
		return { response: cachedResponse as T, wasIdempotent: true };
	}

	// Execute the operation
	const response = await operation();

	// Cache the result
	await idempotencyStore.set(cacheKey, response);

	return { response, wasIdempotent: false };
}

/**
 * Clear all idempotency cache (useful for testing)
 */
export function clearIdempotencyCache(): void {
	idempotencyStore.clear();
}

/**
 * Production Setup Instructions
 *
 * For production, replace in-memory store with Redis:
 *
 * 1. Install dependencies:
 *    ```bash
 *    pnpm add ioredis
 *    ```
 *
 * 2. Create Redis client:
 *    ```typescript
 *    import Redis from 'ioredis';
 *
 *    const redis = new Redis(process.env.REDIS_URL);
 *
 *    class RedisIdempotencyStore {
 *      async get(key: string) {
 *        const data = await redis.get(key);
 *        return data ? JSON.parse(data) : null;
 *      }
 *
 *      async set(key: string, value: unknown) {
 *        await redis.setex(key, 86400, JSON.stringify(value)); // 24 hour TTL
 *      }
 *    }
 *    ```
 */
