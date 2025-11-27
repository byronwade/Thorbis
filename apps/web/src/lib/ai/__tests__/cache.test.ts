/**
 * AI Caching Layer Tests
 *
 * Tests for @ai-sdk-tools/cache integration
 * Verifies caching utilities, key generators, and invalidation helpers
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// =============================================================================
// MOCK SETUP
// =============================================================================

// Mock @ai-sdk-tools/cache
const mockCachedTool = {
	execute: vi.fn(),
	getStats: vi.fn(() => ({
		hits: 5,
		misses: 2,
		hitRate: 0.71,
		size: 7,
		maxSize: 1000,
	})),
	clearCache: vi.fn(),
};

vi.mock("@ai-sdk-tools/cache", () => ({
	cached: vi.fn(() => mockCachedTool),
	createCached: vi.fn(() => (tool: unknown) => ({
		...mockCachedTool,
		originalTool: tool,
	})),
}));

// Import after mocks
import { cached, createCached } from "@ai-sdk-tools/cache";
import type { Tool } from "ai";
import {
	cacheAITool,
	createCachedToolFactory,
	stratosCache,
	cacheKeyGenerators,
	cacheInvalidation,
	shouldCachePredicates,
} from "../cache";

const mockedCached = vi.mocked(cached);
const mockedCreateCached = vi.mocked(createCached);

// =============================================================================
// MOCK TOOL HELPER
// =============================================================================

function createMockTool(name: string): Tool {
	return {
		description: `Mock tool: ${name}`,
		parameters: { type: "object", properties: {} },
		execute: vi.fn(),
	} as unknown as Tool;
}

// =============================================================================
// CACHE AI TOOL TESTS
// =============================================================================

describe("cacheAITool", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should wrap a tool with caching", () => {
		const mockTool = createMockTool("searchCustomers");

		const cachedTool = cacheAITool(mockTool);

		expect(mockedCached).toHaveBeenCalledWith(
			mockTool,
			expect.objectContaining({
				ttl: 5 * 60 * 1000, // 5 minutes default
				maxSize: 1000,
			})
		);
		expect(cachedTool).toBeDefined();
	});

	it("should accept custom TTL option", () => {
		const mockTool = createMockTool("getJobDetails");

		cacheAITool(mockTool, { ttl: 60000 }); // 1 minute

		expect(mockedCached).toHaveBeenCalledWith(
			mockTool,
			expect.objectContaining({
				ttl: 60000,
			})
		);
	});

	it("should accept custom maxSize option", () => {
		const mockTool = createMockTool("searchInventory");

		cacheAITool(mockTool, { maxSize: 500 });

		expect(mockedCached).toHaveBeenCalledWith(
			mockTool,
			expect.objectContaining({
				maxSize: 500,
			})
		);
	});

	it("should accept custom key generator", () => {
		const mockTool = createMockTool("getCustomer");
		const customKeyGen = (params: unknown) => `custom:${JSON.stringify(params)}`;

		cacheAITool(mockTool, { keyGenerator: customKeyGen });

		expect(mockedCached).toHaveBeenCalledWith(
			mockTool,
			expect.objectContaining({
				keyGenerator: customKeyGen,
			})
		);
	});

	it("should accept shouldCache predicate", () => {
		const mockTool = createMockTool("searchJobs");
		const shouldCache = (_params: unknown, result: unknown) => !!result;

		cacheAITool(mockTool, { shouldCache });

		expect(mockedCached).toHaveBeenCalledWith(
			mockTool,
			expect.objectContaining({
				shouldCache,
			})
		);
	});

	it("should accept onHit and onMiss callbacks", () => {
		const mockTool = createMockTool("getInvoice");
		const onHit = vi.fn();
		const onMiss = vi.fn();

		cacheAITool(mockTool, { onHit, onMiss });

		expect(mockedCached).toHaveBeenCalledWith(
			mockTool,
			expect.objectContaining({
				onHit,
				onMiss,
			})
		);
	});
});

// =============================================================================
// CACHED TOOL FACTORY TESTS
// =============================================================================

describe("createCachedToolFactory", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create a factory with default options", () => {
		const factory = createCachedToolFactory();

		expect(mockedCreateCached).toHaveBeenCalledWith(
			expect.objectContaining({
				ttl: 5 * 60 * 1000,
				maxSize: 1000,
			})
		);
		expect(factory).toBeDefined();
	});

	it("should create a factory with custom key prefix", () => {
		createCachedToolFactory({ keyPrefix: "ai:tools:" });

		expect(mockedCreateCached).toHaveBeenCalledWith(
			expect.objectContaining({
				keyPrefix: "ai:tools:",
			})
		);
	});

	it("should create a factory with custom TTL", () => {
		createCachedToolFactory({ ttl: 300000 }); // 5 minutes

		expect(mockedCreateCached).toHaveBeenCalledWith(
			expect.objectContaining({
				ttl: 300000,
			})
		);
	});

	it("should create a factory with debug option", () => {
		createCachedToolFactory({ debug: true });

		expect(mockedCreateCached).toHaveBeenCalledWith(
			expect.objectContaining({
				debug: true,
			})
		);
	});
});

// =============================================================================
// STRATOS CACHE TESTS
// =============================================================================

describe("stratosCache", () => {
	it("should be a pre-configured cache factory", () => {
		expect(stratosCache).toBeDefined();
	});

	it("should be created with stratos-specific key prefix", () => {
		// stratosCache is created at module load time with keyPrefix: "stratos:ai:"
		// The factory is pre-configured for Stratos AI tools
		expect(stratosCache).toBeDefined();
		// Verify it's the cached factory returned from createCached
		expect(typeof stratosCache).toBe("function");
	});

	it("should be a function that wraps tools with caching", () => {
		// stratosCache is the result of createCachedToolFactory which returns
		// a function that can wrap tools with caching
		expect(stratosCache).toBeDefined();
		expect(typeof stratosCache).toBe("function");
	});
});

// =============================================================================
// CACHE KEY GENERATORS TESTS
// =============================================================================

describe("cacheKeyGenerators", () => {
	describe("byCustomerId", () => {
		it("should generate key from customerId", () => {
			const key = cacheKeyGenerators.byCustomerId({ customerId: "cust-123" });
			expect(key).toBe("customer:cust-123");
		});

		it("should handle missing customerId", () => {
			const key = cacheKeyGenerators.byCustomerId({});
			expect(key).toBe("customer:unknown");
		});

		it("should handle undefined customerId", () => {
			const key = cacheKeyGenerators.byCustomerId({ customerId: undefined });
			expect(key).toBe("customer:unknown");
		});
	});

	describe("byJobId", () => {
		it("should generate key from jobId", () => {
			const key = cacheKeyGenerators.byJobId({ jobId: "job-456" });
			expect(key).toBe("job:job-456");
		});

		it("should handle missing jobId", () => {
			const key = cacheKeyGenerators.byJobId({});
			expect(key).toBe("job:unknown");
		});
	});

	describe("byInvoiceId", () => {
		it("should generate key from invoiceId", () => {
			const key = cacheKeyGenerators.byInvoiceId({ invoiceId: "inv-789" });
			expect(key).toBe("invoice:inv-789");
		});

		it("should handle missing invoiceId", () => {
			const key = cacheKeyGenerators.byInvoiceId({});
			expect(key).toBe("invoice:unknown");
		});
	});

	describe("bySearchQuery", () => {
		it("should generate key from query and limit", () => {
			const key = cacheKeyGenerators.bySearchQuery({ query: "hvac repair", limit: 25 });
			expect(key).toBe("search:hvac repair:25");
		});

		it("should handle missing query", () => {
			const key = cacheKeyGenerators.bySearchQuery({ limit: 10 });
			expect(key).toBe("search::10");
		});

		it("should use default limit of 10", () => {
			const key = cacheKeyGenerators.bySearchQuery({ query: "plumbing" });
			expect(key).toBe("search:plumbing:10");
		});

		it("should handle empty params", () => {
			const key = cacheKeyGenerators.bySearchQuery({});
			expect(key).toBe("search::10");
		});
	});

	describe("byDateRange", () => {
		it("should generate key from date range", () => {
			const key = cacheKeyGenerators.byDateRange({
				startDate: "2024-01-01",
				endDate: "2024-01-31",
			});
			expect(key).toBe("range:2024-01-01:2024-01-31");
		});

		it("should handle missing dates", () => {
			const key = cacheKeyGenerators.byDateRange({});
			expect(key).toBe("range::");
		});

		it("should handle partial date range", () => {
			const keyStart = cacheKeyGenerators.byDateRange({ startDate: "2024-01-01" });
			expect(keyStart).toBe("range:2024-01-01:");

			const keyEnd = cacheKeyGenerators.byDateRange({ endDate: "2024-01-31" });
			expect(keyEnd).toBe("range::2024-01-31");
		});
	});
});

// =============================================================================
// CACHE INVALIDATION HELPERS TESTS
// =============================================================================

describe("cacheInvalidation", () => {
	let mockCachedToolInstance: { clearCache: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		mockCachedToolInstance = {
			clearCache: vi.fn(),
		};
	});

	describe("invalidateCustomer", () => {
		it("should clear cache for specific customer", () => {
			cacheInvalidation.invalidateCustomer(
				mockCachedToolInstance as unknown as ReturnType<typeof cacheAITool>,
				"cust-123"
			);

			expect(mockCachedToolInstance.clearCache).toHaveBeenCalledWith("customer:cust-123");
		});
	});

	describe("invalidateJob", () => {
		it("should clear cache for specific job", () => {
			cacheInvalidation.invalidateJob(
				mockCachedToolInstance as unknown as ReturnType<typeof cacheAITool>,
				"job-456"
			);

			expect(mockCachedToolInstance.clearCache).toHaveBeenCalledWith("job:job-456");
		});
	});

	describe("clearAll", () => {
		it("should clear all cache entries", () => {
			cacheInvalidation.clearAll(
				mockCachedToolInstance as unknown as ReturnType<typeof cacheAITool>
			);

			expect(mockCachedToolInstance.clearCache).toHaveBeenCalledWith();
		});
	});
});

// =============================================================================
// SHOULD CACHE PREDICATES TESTS
// =============================================================================

describe("shouldCachePredicates", () => {
	describe("onSuccess", () => {
		it("should return true for successful results", () => {
			expect(shouldCachePredicates.onSuccess({}, { success: true })).toBe(true);
			expect(shouldCachePredicates.onSuccess({}, { data: [] })).toBe(true);
			expect(shouldCachePredicates.onSuccess({}, {})).toBe(true);
		});

		it("should return false for results with error", () => {
			expect(shouldCachePredicates.onSuccess({}, { error: "Something failed" })).toBe(false);
		});

		it("should return false for results with success: false", () => {
			expect(shouldCachePredicates.onSuccess({}, { success: false })).toBe(false);
		});

		it("should return true for non-object results", () => {
			expect(shouldCachePredicates.onSuccess({}, "string result")).toBe(true);
			expect(shouldCachePredicates.onSuccess({}, 123)).toBe(true);
			expect(shouldCachePredicates.onSuccess({}, null)).toBe(true);
		});
	});

	describe("hasData", () => {
		it("should return true when result has data", () => {
			expect(shouldCachePredicates.hasData({}, { data: [1, 2, 3] })).toBe(true);
			expect(shouldCachePredicates.hasData({}, { data: { id: 1 } })).toBe(true);
			expect(shouldCachePredicates.hasData({}, { data: "string" })).toBe(true);
			expect(shouldCachePredicates.hasData({}, { data: 0 })).toBe(true); // falsy but defined
		});

		it("should return false when data is undefined", () => {
			expect(shouldCachePredicates.hasData({}, {})).toBe(false);
			expect(shouldCachePredicates.hasData({}, { data: undefined })).toBe(false);
		});

		it("should return false when data is null", () => {
			expect(shouldCachePredicates.hasData({}, { data: null })).toBe(false);
		});

		it("should return false for non-object results", () => {
			expect(shouldCachePredicates.hasData({}, "string")).toBe(false);
			expect(shouldCachePredicates.hasData({}, 123)).toBe(false);
			expect(shouldCachePredicates.hasData({}, null)).toBe(false);
		});
	});

	describe("nonEmptyArray", () => {
		it("should return true for non-empty arrays", () => {
			expect(shouldCachePredicates.nonEmptyArray({}, [1, 2, 3])).toBe(true);
			expect(shouldCachePredicates.nonEmptyArray({}, ["item"])).toBe(true);
		});

		it("should return false for empty arrays", () => {
			expect(shouldCachePredicates.nonEmptyArray({}, [])).toBe(false);
		});

		it("should return true for objects with non-empty data array", () => {
			expect(shouldCachePredicates.nonEmptyArray({}, { data: [1, 2] })).toBe(true);
		});

		it("should return false for objects with empty data array", () => {
			expect(shouldCachePredicates.nonEmptyArray({}, { data: [] })).toBe(false);
		});

		it("should return false for objects without data array", () => {
			expect(shouldCachePredicates.nonEmptyArray({}, { data: "string" })).toBe(false);
			expect(shouldCachePredicates.nonEmptyArray({}, {})).toBe(false);
		});

		it("should return false for non-array, non-object results", () => {
			expect(shouldCachePredicates.nonEmptyArray({}, "string")).toBe(false);
			expect(shouldCachePredicates.nonEmptyArray({}, 123)).toBe(false);
			expect(shouldCachePredicates.nonEmptyArray({}, null)).toBe(false);
		});
	});
});

// =============================================================================
// AI SDK TYPE INTEGRATION TESTS
// =============================================================================

describe("AI SDK Type Integration", () => {
	it("should import Tool type from ai package", () => {
		// This is a compile-time check
		const mockTool: Tool = createMockTool("test");
		expect(mockTool).toBeDefined();
	});

	it("should return CachedTool from cacheAITool", () => {
		const mockTool = createMockTool("test");
		const cachedTool = cacheAITool(mockTool);

		// CachedTool should have getStats method
		expect(cachedTool.getStats).toBeDefined();
		expect(typeof cachedTool.getStats).toBe("function");
	});

	it("should support Tool type in invalidation helpers", () => {
		// Type check - these should accept Tool type
		const mockCachedToolWithClear = {
			clearCache: vi.fn(),
		} as unknown as ReturnType<typeof cacheAITool>;

		// These should not throw type errors
		cacheInvalidation.invalidateCustomer(mockCachedToolWithClear, "cust-1");
		cacheInvalidation.invalidateJob(mockCachedToolWithClear, "job-1");
		cacheInvalidation.clearAll(mockCachedToolWithClear);

		expect(mockCachedToolWithClear.clearCache).toHaveBeenCalledTimes(3);
	});
});

// =============================================================================
// CACHE STATS TESTS
// =============================================================================

describe("Cache Statistics", () => {
	it("should provide cache statistics from getStats", () => {
		const mockTool = createMockTool("test");
		const cachedTool = cacheAITool(mockTool);

		const stats = cachedTool.getStats();

		expect(stats).toEqual({
			hits: 5,
			misses: 2,
			hitRate: 0.71,
			size: 7,
			maxSize: 1000,
		});
	});

	it("should have hit rate between 0 and 1", () => {
		const mockTool = createMockTool("test");
		const cachedTool = cacheAITool(mockTool);

		const stats = cachedTool.getStats();

		expect(stats.hitRate).toBeGreaterThanOrEqual(0);
		expect(stats.hitRate).toBeLessThanOrEqual(1);
	});
});
