/**
 * Class Name Utility
 *
 * Combines clsx and tailwind-merge for conditional class names
 * This is the standard utility used across all apps
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * cn("px-2 py-1", "px-4") // "py-1 px-4" (px-2 is overridden by px-4)
 * cn("bg-red-500", condition && "bg-blue-500") // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

