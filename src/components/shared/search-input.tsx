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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
	placeholder?: string;
	className?: string;
	debounceMs?: number;
};

export function SearchInput({
	placeholder = "Search...",
	className = "max-w-sm",
	debounceMs = 300,
}: SearchInputProps) {
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
			<Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
			<Input
				className="pr-9 pl-9"
				id="search-input"
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder={placeholder}
				type="search"
				value={searchTerm}
			/>
			{searchTerm && (
				<Button
					className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7 p-0"
					onClick={clearSearch}
					size="sm"
					variant="ghost"
				>
					<X className="size-4" />
				</Button>
			)}
			<kbd className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 hidden select-none gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex">
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
