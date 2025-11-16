"use client";

/**
 * Price Book Table - Industry Best Practices
 *
 * Based on ServiceTitan, Housecall Pro, and Jobber patterns:
 * - Three item types: Services, Materials, Equipment
 * - Hierarchical categories with subcategories
 * - Image thumbnails for visual identification
 * - Pricing tiers (Good/Better/Best)
 * - Labor hours for services
 * - Flat-rate and tiered pricing support
 *
 * Features:
 * - Full-width datatable layout
 * - Row selection with bulk actions
 * - Advanced filtering (type, category, status, tier)
 * - Search across all fields
 * - Inline quick actions
 * - Visual category hierarchy display
 */

import {
	Archive,
	Box,
	Copy,
	DollarSign,
	Edit,
	Eye,
	Image,
	MoreHorizontal,
	Package,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { formatCurrency } from "@/lib/formatters";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";
import { cn } from "@/lib/utils";

// Enhanced item type based on ServiceTitan pattern
export type PriceBookItemType = "service" | "material" | "equipment";

// Pricing tiers (Good/Better/Best pattern from industry)
export type PricingTier = "standard" | "good" | "better" | "best";

export type PriceBookItem = {
	id: string;
	itemType: PriceBookItemType;
	name: string;
	description?: string;
	sku: string;

	// Hierarchical categories (ServiceTitan pattern)
	category: string; // e.g., "HVAC"
	subcategory: string | null; // e.g., "Heating" or "Heating > Furnaces"

	// Pricing (supports flat-rate and tiered pricing)
	cost: number; // In cents
	price: number; // In cents (base price)
	priceTier?: PricingTier; // Optional tier (Good/Better/Best)
	markupPercent: number;

	// Service-specific fields
	laborHours?: number; // For services only

	// Display
	unit: string;
	imageUrl?: string | null; // Thumbnail image (Housecall Pro pattern)

	// Status
	isActive: boolean;
	isFlatRate: boolean; // Flat rate vs. hourly+materials

	// Integration
	supplierName: string | null;
	supplierSku?: string | null;

	// Metadata
	tags?: string[];
	lastUpdated?: Date;
};

export function PriceBookTable({
	items,
	itemsPerPage = 50,
	onRefresh,
}: {
	items: PriceBookItem[];
	itemsPerPage?: number;
	onRefresh?: () => void;
}) {
	// Get filters from store
	const itemTypeFilter = usePriceBookStore((state) => state.itemTypeFilter);
	const categoryFilter = usePriceBookStore((state) => state.categoryFilter);
	const getFilterSummary = usePriceBookStore((state) => state.getFilterSummary);

	// Apply filters to items
	const filteredItems = items.filter((item) => {
		// Item type filter
		if (itemTypeFilter !== "all" && item.itemType !== itemTypeFilter) {
			return false;
		}

		// Category filter
		if (categoryFilter.category) {
			if (item.category !== categoryFilter.category) {
				return false;
			}

			// Subcategory filter (if specified)
			if (categoryFilter.subcategory) {
				// Check if item's subcategory matches or starts with the filter
				if (!item.subcategory?.includes(categoryFilter.subcategory)) {
					return false;
				}
			}
		}

		return true;
	});
	const columns: ColumnDef<PriceBookItem>[] = [
		// Thumbnail image column (Housecall Pro pattern)
		{
			key: "image",
			header: "",
			width: "w-12",
			shrink: true,
			hideOnMobile: true,
			render: (item) => (
				<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-muted">
					{item.imageUrl ? (
						<img
							alt={item.name}
							className="h-full w-full object-cover"
							src={item.imageUrl}
						/>
					) : (
						<Image className="h-4 w-4 text-muted-foreground" />
					)}
				</div>
			),
		},
		// Item name with SKU
		{
			key: "name",
			header: "Item Name",
			width: "flex-1",
			render: (item) => (
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<Link
							className="truncate font-medium text-foreground text-sm leading-tight hover:underline"
							href={`/dashboard/work/pricebook/${item.id}`}
							onClick={(e) => e.stopPropagation()}
						>
							{item.name}
						</Link>
						{/* Inline pricing tier as text */}
						{item.priceTier && item.priceTier !== "standard" && (
							<span className="text-muted-foreground text-xs">
								- {item.priceTier === "good" && "Good"}
								{item.priceTier === "better" && "Better"}
								{item.priceTier === "best" && "Best"}
							</span>
						)}
					</div>
					{/* SKU, Type, and Flat Rate all on one line */}
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<span className="truncate font-mono">SKU: {item.sku}</span>
						<span>•</span>
						<span>
							{item.itemType === "service"
								? "Service"
								: item.itemType === "material"
									? "Material"
									: "Equipment"}
						</span>
						{item.isFlatRate && (
							<>
								<span>•</span>
								<span>Flat Rate</span>
							</>
						)}
					</div>
				</div>
			),
		},
		// Category with subcategory hierarchy (simplified text)
		{
			key: "category",
			header: "Category",
			width: "w-48",
			shrink: true,
			hideOnMobile: true,
			render: (item) => {
				const displayText = item.subcategory
					? `${item.category} › ${item.subcategory}`
					: item.category;
				return (
					<div className="truncate text-muted-foreground text-sm">
						{displayText}
					</div>
				);
			},
		},
		// Labor hours (for services only)
		{
			key: "labor",
			header: "Labor",
			width: "w-20",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			render: (item) =>
				item.itemType === "service" && item.laborHours ? (
					<div className="flex items-center gap-1 text-muted-foreground text-sm">
						<span className="font-medium">{item.laborHours}</span>
						<span className="text-xs">hrs</span>
					</div>
				) : (
					<div className="text-muted-foreground text-xs">—</div>
				),
		},
		// Cost
		{
			key: "cost",
			header: "Cost",
			width: "w-24",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			render: (item) => (
				<div className="font-medium text-muted-foreground text-sm">
					{formatCurrency(item.cost)}
				</div>
			),
		},
		// Price (base selling price)
		{
			key: "price",
			header: "Price",
			width: "w-28",
			shrink: true,
			align: "right",
			render: (item) => (
				<div>
					<div className="font-semibold text-foreground text-sm">
						{formatCurrency(item.price)}
					</div>
					{/* Show unit below price */}
					<div className="text-muted-foreground text-xs">{item.unit}</div>
				</div>
			),
		},
		// Markup percentage
		{
			key: "markup",
			header: "Markup",
			width: "w-20",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			render: (item) => (
				<div className="font-medium text-sm text-success dark:text-success">
					{item.markupPercent}%
				</div>
			),
		},
		// Status (only show if inactive)
		{
			key: "status",
			header: "Status",
			width: "w-24",
			shrink: true,
			hideOnMobile: true,
			render: (item) =>
				item.isActive ? null : (
					<Badge
						className={cn(
							"font-medium text-xs",
							"border-border/50 bg-background text-muted-foreground",
						)}
						variant="outline"
					>
						Inactive
					</Badge>
				),
		},
		// Actions dropdown
		{
			key: "actions",
			header: "",
			width: "w-12",
			shrink: true,
			align: "right",
			render: (item) => (
				<div data-no-row-click>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="h-8 w-8 p-0" variant="ghost">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
								<Link href={`/dashboard/work/pricebook/${item.id}`}>
									<Eye className="mr-2 h-4 w-4" />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
								<Link href={`/dashboard/work/pricebook/${item.id}/edit`}>
									<Edit className="mr-2 h-4 w-4" />
									Edit Item
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={(e) => e.stopPropagation()}>
								<Copy className="mr-2 h-4 w-4" />
								Duplicate
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-warning dark:text-warning"
								onClick={(e) => e.stopPropagation()}
							>
								<Archive className="mr-2 h-4 w-4" />
								{item.isActive ? "Deactivate" : "Activate"}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={(e) => e.stopPropagation()}>
								<Archive className="mr-2 h-4 w-4" />
								Archive
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Mass Price Update",
			icon: <TrendingUp className="h-4 w-4" />,
			onClick: () => {
				/* TODO: implement mass price update */
			},
		},
		{
			label: "Change Category",
			icon: <Package className="h-4 w-4" />,
			onClick: () => {
				/* TODO: implement change category */
			},
		},
		{
			label: "Bulk Export",
			icon: <DollarSign className="h-4 w-4" />,
			onClick: () => {
				/* TODO: implement bulk export */
			},
		},
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: () => {
				/* TODO: implement archive selected */
			},
			variant: "destructive",
		},
	];

	const searchFilter = (item: PriceBookItem, query: string): boolean => {
		const searchLower = query.toLowerCase();
		return (
			item.name.toLowerCase().includes(searchLower) ||
			item.sku.toLowerCase().includes(searchLower) ||
			item.category.toLowerCase().includes(searchLower) ||
			(item.subcategory?.toLowerCase() || "").includes(searchLower) ||
			(item.description?.toLowerCase() || "").includes(searchLower) ||
			(item.supplierName?.toLowerCase() || "").includes(searchLower) ||
			(item.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ??
				false)
		);
	};

	// Show filter summary if filters are active
	const filterSummary = getFilterSummary();
	const emptyMessage =
		filterSummary !== "All Items"
			? `No items found for: ${filterSummary}`
			: "No price book items found";

	return (
		<div className="flex h-full flex-col">
			{/* Filter Summary Banner */}
			{filterSummary !== "All Items" && (
				<div className="shrink-0 border-b bg-muted/30 px-6 py-3">
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-sm">Showing:</span>
						<Badge className="font-medium" variant="secondary">
							{filterSummary}
						</Badge>
						<span className="text-muted-foreground text-sm">
							({filteredItems.length}{" "}
							{filteredItems.length === 1 ? "item" : "items"})
						</span>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-hidden">
				<FullWidthDataTable
					bulkActions={bulkActions}
					columns={columns}
					data={filteredItems}
					emptyIcon={<Box className="h-8 w-8 text-muted-foreground" />}
					emptyMessage={emptyMessage}
					getItemId={(item) => item.id}
					itemsPerPage={itemsPerPage}
					onRefresh={onRefresh}
					onRowClick={(item) => {
						window.location.href = `/dashboard/work/pricebook/${item.id}`;
					}}
					searchFilter={searchFilter}
					searchPlaceholder="Search by name, SKU, category, or tags..."
					showPagination
					showRefresh
				/>
			</div>
		</div>
	);
}
