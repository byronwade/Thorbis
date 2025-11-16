"use client";

/**
 * Price Book Card Grid Component
 *
 * Responsive grid layout for price book items:
 * - 4 columns on desktop (1280px+)
 * - 3 columns on laptop (1024px+)
 * - 2 columns on tablet (768px+)
 * - 1 column on mobile
 * - Empty state handling
 * - Loading states
 */

import { Package } from "lucide-react";
import type { PriceBookItem } from "@/components/work/price-book-table";
import { PriceBookCard } from "./price-book-card";

type PriceBookCardGridProps = {
	items: PriceBookItem[];
	isLoading?: boolean;
	emptyMessage?: string;
	onEdit?: (id: string) => void;
	onAddToEstimate?: (id: string) => void;
};

export function PriceBookCardGrid({
	items,
	isLoading = false,
	emptyMessage = "No items found",
	onEdit,
	onAddToEstimate,
}: PriceBookCardGridProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						className="aspect-square animate-pulse rounded-lg bg-muted"
						key={i}
					/>
				))}
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
				<Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
				<h3 className="mb-2 font-semibold text-lg">{emptyMessage}</h3>
				<p className="text-muted-foreground text-sm">
					Try adjusting your filters or search term
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{items.map((item) => (
				<PriceBookCard
					item={item}
					key={item.id}
					onAddToEstimate={onAddToEstimate}
					onEdit={onEdit}
				/>
			))}
		</div>
	);
}
