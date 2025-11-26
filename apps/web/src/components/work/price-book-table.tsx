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
	Image as ImageIcon,
	MoreHorizontal,
	Package,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { archivePriceBookItem } from "@/actions/price-book";
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";
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
import { useTableActions } from "@/hooks/use-table-actions";
import { TablePresets } from "@/lib/datatable/table-presets";
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

	// Table actions hook
	const { handleRefresh } = useTableActions({ entityType: "price_book" });

	// Archive dialog
	const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
		onConfirm: async (id) => {
			const result = await archivePriceBookItem(id);
			if (result.success) {
				handleRefresh();
			}
		},
		title: "Archive Price Book Item?",
		description:
			"This item will be archived and can be restored within 90 days.",
	});

	// Bulk archive state
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	// Bulk archive dialog
	const {
		openArchiveDialog: openBulkArchiveDialog,
		ArchiveDialogComponent: BulkArchiveDialogComponent,
	} = useArchiveDialog({
		onConfirm: async () => {
			let archived = 0;
			for (const id of selectedIds) {
				const result = await archivePriceBookItem(id);
				if (result.success) {
					archived++;
				}
			}
			if (archived > 0) {
				handleRefresh();
			}
		},
		title: `Archive ${selectedIds.size} Item(s)?`,
		description: `${selectedIds.size} item(s) will be archived and can be restored within 90 days.`,
	});

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
				<div className="bg-muted flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
					{item.imageUrl ? (
						<Image
							alt={item.name}
							className="h-full w-full object-cover"
							src={item.imageUrl}
							width={40}
							height={40}
						/>
					) : (
						<Package className="text-muted-foreground h-4 w-4" />
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
							className="text-foreground truncate text-xs leading-tight font-medium hover:underline"
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
					<div className="text-muted-foreground flex items-center gap-2 text-xs">
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
					<div className="text-muted-foreground truncate text-xs">
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
					<div className="text-muted-foreground flex items-center gap-1 text-xs">
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
				<div className="text-muted-foreground text-xs font-medium">
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
					<div className="text-foreground text-xs font-semibold">
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
				<div className="text-success dark:text-success text-xs font-medium">
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
							"text-xs font-medium",
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
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									openArchiveDialog(item.id);
								}}
							>
								<Archive className="mr-2 size-4" />
								Archive Item
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
			variant: "destructive",
			onClick: async (selectedIds) => {
				setSelectedIds(selectedIds);
				openBulkArchiveDialog("");
			},
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
		<>
			<div className="flex h-full flex-col">
				{/* Filter Summary Banner */}
				{filterSummary !== "All Items" && (
					<div className="bg-muted/30 shrink-0 border-b px-6 py-3">
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground text-xs">Showing:</span>
							<Badge className="font-medium" variant="secondary">
								{filterSummary}
							</Badge>
							<span className="text-muted-foreground text-xs">
								({filteredItems.length}{" "}
								{filteredItems.length === 1 ? "item" : "items"})
							</span>
						</div>
					</div>
				)}

				<div className="flex-1 overflow-hidden">
					<FullWidthDataTable
						{...TablePresets.fullList()}
						bulkActions={bulkActions}
						columns={columns}
						data={filteredItems}
						emptyIcon={<Box className="text-muted-foreground h-8 w-8" />}
						emptyMessage={emptyMessage}
						getItemId={(item) => item.id}
						onRefresh={handleRefresh}
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

			<ArchiveDialogComponent />
			<BulkArchiveDialogComponent />
		</>
	);
}
