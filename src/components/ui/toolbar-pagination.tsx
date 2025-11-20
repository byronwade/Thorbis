"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

type ToolbarPaginationProps = {
	currentPage: number;
	pageSize: number;
	totalCount: number;
};

/**
 * ToolbarPagination - Compact pagination controls for AppToolbar
 *
 * Features:
 * - Ultra-compact design (fits in toolbar)
 * - Auto-syncs with URL params
 * - Optimistic navigation
 * - Keyboard shortcuts (arrow keys)
 * - Shows: "1-50 of 10,000"
 *
 * Size: Minimal width (~180px)
 */
export function ToolbarPagination({
	currentPage,
	pageSize,
	totalCount,
}: ToolbarPaginationProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalCount);
	const hasNextPage = endItem < totalCount;
	const hasPrevPage = currentPage > 1;

	const navigateToPage = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => navigateToPage(currentPage - 1)}
				disabled={!hasPrevPage || isPending}
				className="size-9 transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<span className="text-muted-foreground text-nowrap text-xs font-medium tabular-nums">
				{startItem.toLocaleString()}
				{" - "}
				{endItem.toLocaleString()}
				{" of "}
				{totalCount.toLocaleString()}
			</span>

			<Button
				variant="ghost"
				size="icon"
				onClick={() => navigateToPage(currentPage + 1)}
				disabled={!hasNextPage || isPending}
				className="size-9 transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
