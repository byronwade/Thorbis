"use client";

/**
 * Drill-Down View Component
 *
 * Handles navigation through category hierarchy:
 * - Root: Show main categories (HVAC, Plumbing, Electrical)
 * - Any Level: Can show BOTH subcategories (as cards) AND items (as table/grid)
 * - Items are shown for the exact current level (not deeper subcategories)
 * - Subcategory cards appear at top, items table/grid below
 * - Empty state shown when no categories or items at current level
 */

import { useRouter } from "next/navigation";
import type { PriceBookItem } from "@/components/work/price-book-table";
import { PriceBookTable } from "@/components/work/price-book-table";
import { buildCategoryUrl } from "@/lib/pricebook/utils";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";
import { CategoryCard } from "./category-card";
import { PriceBookCardGrid } from "./price-book-card-grid";

export type CategoryNode = {
	name: string;
	count: number;
	imageUrl?: string;
	children?: CategoryNode[];
};

type DrillDownViewProps = {
	items: PriceBookItem[];
	categories?: CategoryNode[];
	itemsPerPage?: number;
};

export function DrillDownView({
	items,
	categories = [],
	itemsPerPage = 50,
}: DrillDownViewProps) {
	const router = useRouter();
	const navigationPath = usePriceBookStore((state) => state.navigationPath);
	const viewMode = usePriceBookStore((state) => state.viewMode);

	// Get current level categories based on navigation path
	const getCurrentCategories = (): CategoryNode[] => {
		let current = categories;

		for (const segment of navigationPath) {
			const found = current.find((cat) => cat.name === segment);
			if (found?.children) {
				current = found.children;
			} else {
				// Reached leaf node - return empty to show items
				return [];
			}
		}

		return current;
	};

	// Filter items that belong EXACTLY to the current navigation path
	// (not deeper in subcategories)
	const getFilteredItems = (): PriceBookItem[] => {
		if (navigationPath.length === 0) {
			return [];
		}

		return items.filter((item) => {
			// Build category path from item
			const itemPath = item.subcategory
				? `${item.category} › ${item.subcategory}`.split(" › ")
				: [item.category];

			// Item must match current path exactly (not deeper)
			if (itemPath.length !== navigationPath.length) {
				return false;
			}

			return navigationPath.every(
				(segment, index) => itemPath[index] === segment,
			);
		});
	};

	const currentCategories = getCurrentCategories();
	const filteredItems = getFilteredItems();

	// Show both categories (as cards) and items (as table/grid)
	const hasCategories = currentCategories.length > 0;
	const hasItems = filteredItems.length > 0;

	return (
		<>
			{/* Category Cards Section */}
			{hasCategories && (
				<div className="px-6 py-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{currentCategories.map((category) => (
							<CategoryCard
								count={category.count}
								imageUrl={category.imageUrl}
								key={category.name}
								name={category.name}
								onClick={() => {
									const newPath = [...navigationPath, category.name];
									const url = buildCategoryUrl(newPath);
									router.push(url);
								}}
								variant="default"
							/>
						))}

						{/* Add New Card */}
						<CategoryCard
							count={0}
							description="Create a new category"
							name={
								navigationPath.length === 0 ? "Add Category" : "Add Subcategory"
							}
							onClick={() => {}}
							variant="add"
						/>
					</div>
				</div>
			)}

			{/* Items Section (Table or Grid) */}
			{hasItems &&
				(viewMode === "table" ? (
					// Table view - full width, no padding
					<PriceBookTable items={filteredItems} itemsPerPage={itemsPerPage} />
				) : (
					// Grid view - with padding
					<div className="px-6 py-6">
						<PriceBookCardGrid
							emptyMessage="No items found in this category"
							items={filteredItems}
						/>
					</div>
				))}

			{/* Empty State */}
			{!(hasCategories || hasItems) && navigationPath.length > 0 && (
				<div className="flex min-h-[calc(100vh-20rem)] items-center justify-center px-6 py-12">
					<div className="text-center">
						<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
							<svg
								className="size-8 text-muted-foreground"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg">
							No items yet
						</h3>
						<p className="mx-auto mb-6 max-w-sm text-muted-foreground text-sm">
							This category is empty. Start building your price book by adding
							items or creating subcategories.
						</p>
						<div className="flex items-center justify-center gap-3">
							<button
								className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
								onClick={() => {}}
							>
								<svg
									className="size-4"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 4v16m8-8H4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Add Item
							</button>
							<button
								className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted"
								onClick={() => {}}
							>
								<svg
									className="size-4"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Add Subcategory
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
