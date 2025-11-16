"use client";

/**
 * Shared Search Input Component
 *
 * Reusable search input with URL param handling.
 * Works with server-side search via searchParams.
 *
 * Features:
 * - Debounced input for performance
 * - URL param synchronization
 * - Clear button
 * - Keyboard shortcuts (Cmd+K)
 *
 * Usage:
 * ```typescript
 * <SearchInput placeholder="Search invoices..." />
 * ```
 */

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchInputProps = {
	placeholder?: string;
	className?: string;
	debounceMs?: number;
};

export function SearchInput({ placeholder = "Search...", className = "max-w-sm", debounceMs = 300 }: SearchInputProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());

			if (searchTerm) {
				params.set("q", searchTerm);
			} else {
				params.delete("q");
			}

			router.push(`?${params.toString()}`, { scroll: false });
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [searchTerm, debounceMs, router, searchParams]);

	const clearSearch = useCallback(() => {
		setSearchTerm("");
	}, []);

	// Keyboard shortcut (Cmd+K)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				document.getElementById("search-input")?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className={`relative ${className}`}>
			<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				id="search-input"
				type="search"
				placeholder={placeholder}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="pl-9 pr-9"
			/>
			{searchTerm && (
				<Button
					variant="ghost"
					size="sm"
					onClick={clearSearch}
					className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
				>
					<X className="size-4" />
				</Button>
			)}
			<kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
				<span className="text-xs">⌘</span>K
			</kbd>
		</div>
	);
}

/**
 * Hook to get current search term from URL
 */
export function useSearchTerm(): string {
	const searchParams = useSearchParams();
	return searchParams.get("q") || "";
}
