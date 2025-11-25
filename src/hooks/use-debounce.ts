import { useEffect, useState } from "react";

/**
 * useDebounce Hook
 *
 * Debounces a value by delaying updates until after a specified delay.
 * Useful for search inputs, auto-save, and other scenarios where
 * you want to wait for user input to settle before triggering actions.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState("");
 * const debouncedQuery = useDebounce(searchQuery, 300);
 *
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     // Trigger server search only after user stops typing
 *     searchServer(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 300): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set timeout to update debounced value after delay
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup timeout if value changes before delay completes
		return () => {
			clearTimeout(timeoutId);
		};
	}, [value, delay]);

	return debouncedValue;
}
