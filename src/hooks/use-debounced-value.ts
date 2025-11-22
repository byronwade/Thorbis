/**
 * Debounced Value Hook
 * 
 * Returns a debounced value that updates after a delay
 * Useful for search inputs, API calls, etc.
 */

"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

