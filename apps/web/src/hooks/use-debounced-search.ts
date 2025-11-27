import { useEffect, useRef, useState } from "react";

/**
 * useDebouncedSearch - Debounced search input hook
 *
 * Provides debounced search functionality with separate input and search values.
 * The search value only updates after the specified delay, preventing excessive
 * API calls while the user is typing.
 *
 * @param initialValue - Initial search value (default: "")
 * @param delay - Debounce delay in milliseconds (default: 300)
 *
 * @example
 * const { searchInput, searchQuery, setSearchInput, clearSearch } = useDebouncedSearch();
 *
 * // In your component:
 * <Input
 *   value={searchInput}
 *   onChange={(e) => setSearchInput(e.target.value)}
 *   placeholder="Search..."
 * />
 * {searchInput && <button onClick={clearSearch}>Clear</button>}
 *
 * // Use searchQuery for API calls (updates 300ms after typing stops)
 * useEffect(() => {
 *   if (searchQuery) fetchResults(searchQuery);
 * }, [searchQuery]);
 */
export function useDebouncedSearch(initialValue = "", delay = 300) {
	// The immediate input value (updates on every keystroke)
	const [searchInput, setSearchInput] = useState(initialValue);
	// The debounced search value (updates after delay)
	const [searchQuery, setSearchQuery] = useState(initialValue);
	// Timeout reference for cleanup
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Update debounced value after delay
	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setSearchQuery(searchInput);
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [searchInput, delay]);

	// Clear search helper
	const clearSearch = () => {
		setSearchInput("");
		setSearchQuery("");
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	return {
		searchInput,
		searchQuery,
		setSearchInput,
		clearSearch,
	};
}
