/**
 * Performance-related utility functions for throttling, debouncing, and timing operations
 */

// Cache Intl.DateTimeFormat instance for reuse
const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	fractionalSecondDigits: 3,
	hour12: false,
});

/**
 * Debounces a function call, ensuring it only executes after a period of inactivity
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, options: { leading?: boolean; maxWait?: number } = {}): (...args: Parameters<T>) => ReturnType<T> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let lastCallTime = 0;

	return function executedFunction(this: any, ...args: Parameters<T>): ReturnType<T> {
		const currentTime = Date.now();

		// Handle leading edge call
		if (options.leading && !timeoutId) {
			return func.apply(this, args);
		}

		// Clear existing timeout
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Handle maximum wait time
		if (options.maxWait && currentTime - lastCallTime >= options.maxWait) {
			lastCallTime = currentTime;
			return func.apply(this, args);
		}

		// Set new timeout
		return new Promise((resolve) => {
			timeoutId = setTimeout(() => {
				const result = func.apply(this, args);
				timeoutId = undefined;
				lastCallTime = Date.now();
				resolve(result);
			}, wait);
		}) as ReturnType<T>;
	};
}

/**
 * Throttles a function call, ensuring it executes at most once per specified interval
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => ReturnType<T> {
	let inThrottle = false;
	let lastFunc: ReturnType<typeof setTimeout>;
	let lastRan: number;

	return function throttled(this: any, ...args: Parameters<T>): ReturnType<T> {
		if (!inThrottle) {
			inThrottle = true;
			lastRan = Date.now();
			return func.apply(this, args);
		}

		clearTimeout(lastFunc);
		return new Promise((resolve) => {
			lastFunc = setTimeout(() => {
				if (Date.now() - lastRan >= limit) {
					lastRan = Date.now();
					resolve(func.apply(this, args));
				}
			}, limit - (Date.now() - lastRan));
		}) as ReturnType<T>;
	};
}

/**
 * Formats a timestamp using cached formatter for better performance
 */
export function formatTimestamp(timestamp: number): string {
	return timeFormatter.format(new Date(timestamp));
}

/**
 * Measures execution time of a function
 */
export function measureExecutionTime<T>(fn: () => T): [T, number] {
	const start = performance.now();
	const result = fn();
	const duration = performance.now() - start;
	return [result, duration];
}

/**
 * Creates a memoized version of a function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T, options: { maxSize?: number; ttl?: number } = {}): T {
	const cache = new Map<string, { value: any; timestamp: number }>();
	const { maxSize = 1000, ttl } = options;

	return function memoized(this: any, ...args: Parameters<T>): ReturnType<T> {
		const key = JSON.stringify(args);
		const cached = cache.get(key);

		if (cached) {
			if (!ttl || Date.now() - cached.timestamp < ttl) {
				return cached.value;
			}
			cache.delete(key);
		}

		const result = fn.apply(this, args);

		if (cache.size >= maxSize) {
			const firstKey = cache.keys().next().value;
			if (firstKey) {
				cache.delete(firstKey);
			}
		}

		cache.set(key, { value: result, timestamp: Date.now() });
		return result;
	} as T;
}

/**
 * Batches multiple function calls into a single execution
 */
export function batch<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
	let batch: Parameters<T>[] = [];
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function batched(...args: Parameters<T>) {
		batch.push(args);

		if (!timeoutId) {
			timeoutId = setTimeout(() => {
				const currentBatch = batch;
				batch = [];
				timeoutId = null;
				fn.apply(this, [currentBatch]);
			}, wait);
		}
	};
}

/**
 * RAF-based debounce for animation-related operations
 */
export function rafDebounce<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
	let rafId: number | null = null;

	return function debounced(...args: Parameters<T>) {
		if (rafId) {
			cancelAnimationFrame(rafId);
		}

		rafId = requestAnimationFrame(() => {
			fn.apply(this, args);
			rafId = null;
		});
	};
}
