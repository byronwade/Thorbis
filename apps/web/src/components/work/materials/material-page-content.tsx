"use client";

import {
	BadgeInfo,
	Boxes,
	DollarSign,
	MapPin,
	Package,
	Tag,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { formatCurrency } from "@/lib/formatters";

type MaterialStatus =
	| "in-stock"
	| "low-stock"
	| "out-of-stock"
	| "on-order"
	| "inactive";

type MaterialDetail = {
	id: string;
	name: string;
	sku?: string | null;
	description?: string | null;
	status: MaterialStatus;
	quantityOnHand: number;
	quantityReserved: number;
	quantityAvailable: number;
	minimumQuantity: number;
	maximumQuantity?: number | null;
	reorderPoint?: number | null;
	reorderQuantity?: number | null;
	costPerUnit: number;
	totalCostValue: number;
	lastPurchaseCost?: number | null;
	warehouseLocation?: string | null;
	primaryLocation?: string | null;
	notes?: string | null;
	isLowStock?: boolean;
	lowStockAlertSent?: boolean;
	createdAt: string;
	updatedAt: string;
};

type PriceBookItem = {
	id: string;
	name?: string | null;
	description?: string | null;
	sku?: string | null;
	unit?: string | null;
	category?: string | null;
	subcategory?: string | null;
};

type MaterialActivity = {
	id: string;
	entityType?: string | null;
	entityId?: string | null;
	action?: string | null;
	description?: string | null;
	createdAt: string;
	user?: {
		id: string | null;
		name?: string | null;
		avatar?: string | null;
	} | null;
};

type MaterialNote = {
	id: string;
	content?: string | null;
	created_at: string;
	user?: {
		id: string | null;
		name?: string | null;
		avatar?: string | null;
	} | null;
};

type MaterialAttachment = {
	id: string;
	file_name?: string | null;
	file_size?: number | null;
	file_type?: string | null;
	url?: string | null;
	created_at: string;
};

type RelatedItem = {
	id: string;
	title: string;
	subtitle?: string;
	href?: string;
	icon?: React.ReactNode;
	badge?: {
		label: string;
		variant?: "default" | "secondary" | "outline";
	};
};

const STATUS_CONFIG: Record<
	MaterialStatus,
	{ label: string; className: string }
> = {
	"in-stock": {
		label: "In Stock",
		className: "bg-success text-white",
	},
	"low-stock": {
		label: "Low Stock",
		className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
	},
	"out-of-stock": {
		label: "Out of Stock",
		className: "bg-destructive text-white",
	},
	"on-order": {
		label: "On Order",
		className: "bg-primary text-primary dark:bg-primary/20 dark:text-primary",
	},
	inactive: {
		label: "Inactive",
		className: "bg-muted text-muted-foreground",
	},
};

type MaterialPageContentProps = {
	entityData: {
		material: MaterialDetail;
		priceBookItem?: PriceBookItem;
		activities: MaterialActivity[];
		notes: MaterialNote[];
		attachments: MaterialAttachment[];
	};
};

function formatUnitLabel(unit?: string | null): string {
	if (!unit) {
		return "Unit";
	}
	return unit.charAt(0).toUpperCase() + unit.slice(1);
}

export function MaterialPageContent({ entityData }: MaterialPageContentProps) {
	const { material, priceBookItem, activities, notes, attachments } =
		entityData;

	const headerBadges = useMemo(() => {
		const badges: React.ReactNode[] = [];
		const statusConfig =
			STATUS_CONFIG[material.status] ?? STATUS_CONFIG["in-stock"];
		badges.push(
			<Badge className={statusConfig.className} key="status" variant="outline">
				{statusConfig.label}
			</Badge>,
		);

		if (material.isLowStock) {
			badges.push(
				<Badge
					className="bg-warning text-warning"
					key="low-stock"
					variant="outline"
				>
					Low Stock Alert
				</Badge>,
			);
		}

		if (priceBookItem?.sku) {
			badges.push(
				<Badge key="sku" variant="outline">
					SKU: {priceBookItem.sku}
				</Badge>,
			);
		}

		return badges;
	}, [material.isLowStock, material.status, priceBookItem?.sku]);

	const customHeader = (
		<div className="w-full px-2 sm:px-0">
			<div className="bg-muted/50 rounded-md shadow-sm">
				<div className="flex flex-col gap-4 p-4 sm:p-6">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center gap-2">
								{headerBadges}
							</div>
							<div className="flex flex-col gap-2">
								<h1 className="text-2xl font-semibold sm:text-3xl">
									{material.name}
								</h1>
								{material.description && (
									<p className="text-muted-foreground text-sm sm:text-base">
										{material.description}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
							<Boxes className="text-muted-foreground size-4" />
							<span className="font-medium">
								{material.quantityAvailable} available
							</span>
						</div>
						<div className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
							<Package className="text-muted-foreground size-4" />
							<span className="font-medium">
								Min {material.minimumQuantity}
							</span>
						</div>
						<div className="bg-muted inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm">
							<DollarSign className="text-muted-foreground size-4" />
							<span className="font-medium">
								{formatCurrency(material.costPerUnit)} per{" "}
								{formatUnitLabel(priceBookItem?.unit)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const relatedItems = useMemo<RelatedItem[]>(() => {
		const items: RelatedItem[] = [];

		if (priceBookItem) {
			items.push({
				id: priceBookItem.id,
				title: priceBookItem.name ?? "Price Book Item",
				subtitle: priceBookItem.sku ? `SKU ${priceBookItem.sku}` : undefined,
				href: `/dashboard/work/pricebook/${priceBookItem.id}`,
				icon: <Tag className="size-4" />,
				badge: priceBookItem.unit
					? { label: priceBookItem.unit, variant: "outline" }
					: undefined,
			});
		}

		return items;
	}, [priceBookItem]);

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [];

		sections.push({
			id: "inventory-overview",
			title: "Inventory Overview",
			icon: <Boxes className="size-4" />,
			defaultOpen: true,
			content: (
				<UnifiedAccordionContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="bg-background space-y-2 rounded-lg border p-4 shadow-sm">
							<Label>Quantity on Hand</Label>
							<p className="text-foreground text-xl font-semibold tabular-nums">
								{material.quantityOnHand} {formatUnitLabel(priceBookItem?.unit)}
							</p>
							<p className="text-muted-foreground text-sm">
								{material.quantityReserved} reserved •{" "}
								{material.quantityAvailable} available
							</p>
						</div>
						<div className="bg-background space-y-2 rounded-lg border p-4 shadow-sm">
							<Label>Reorder Threshold</Label>
							<p className="text-foreground text-xl font-semibold tabular-nums">
								{material.reorderPoint ?? 0}
							</p>
							<p className="text-muted-foreground text-sm">
								Reorder {material.reorderQuantity ?? 0} when at minimum
							</p>
						</div>
						<div className="bg-background space-y-2 rounded-lg border p-4 shadow-sm">
							<Label>Inventory Value</Label>
							<p className="text-foreground text-xl font-semibold tabular-nums">
								{formatCurrency(material.totalCostValue)}
							</p>
							<p className="text-muted-foreground text-sm">
								Last purchase cost{" "}
								{formatCurrency(material.lastPurchaseCost ?? 0)}
							</p>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		});

		sections.push({
			id: "locations",
			title: "Stock Locations",
			icon: <MapPin className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label>Primary Location</Label>
							<Input
								readOnly
								value={material.primaryLocation ?? "Not specified"}
							/>
						</div>
						<div className="space-y-2">
							<Label>Warehouse / Bin</Label>
							<Input
								readOnly
								value={material.warehouseLocation ?? "Not specified"}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label>Notes</Label>
							<p className="bg-muted/20 text-muted-foreground rounded-md border p-3 text-sm">
								{material.notes?.trim() || "No internal notes"}
							</p>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		});

		if (priceBookItem) {
			sections.push({
				id: "price-book-item",
				title: "Price Book Item",
				icon: <Package className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-4">
							<div>
								<Label>Item Name</Label>
								<p className="text-foreground text-sm">
									{priceBookItem.name ?? "Unnamed item"}
								</p>
							</div>
							<div>
								<Label>Description</Label>
								<p className="text-muted-foreground text-sm">
									{priceBookItem.description || "No description provided"}
								</p>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Category</Label>
									<p className="text-muted-foreground text-sm">
										{priceBookItem.category || "Uncategorized"}
									</p>
								</div>
								<div>
									<Label>Subcategory</Label>
									<p className="text-muted-foreground text-sm">
										{priceBookItem.subcategory || "—"}
									</p>
								</div>
							</div>
							<div>
								<Label>Manage Item</Label>
								<Link
									className="text-primary text-sm font-medium hover:underline"
									href={`/dashboard/work/pricebook/${priceBookItem.id}`}
								>
									View price book item &rarr;
								</Link>
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		sections.push({
			id: "alerts",
			title: "Alerts & Monitoring",
			icon: <BadgeInfo className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label>Low Stock Alert</Label>
							<p className="text-muted-foreground text-sm">
								{material.isLowStock
									? "Alert triggered"
									: "No alerts triggered"}
							</p>
						</div>
						<div className="space-y-2">
							<Label>Alert Status</Label>
							<p className="text-muted-foreground text-sm">
								{material.lowStockAlertSent
									? "Notification sent"
									: "No notifications sent"}
							</p>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		});

		return sections;
	}, [
		material.isLowStock,
		material.lowStockAlertSent,
		material.notes,
		material.primaryLocation,
		material.quantityAvailable,
		material.quantityOnHand,
		material.quantityReserved,
		material.reorderPoint,
		material.reorderQuantity,
		material.totalCostValue,
		material.warehouseLocation,
		priceBookItem?.category,
		priceBookItem?.description,
		priceBookItem?.id,
		priceBookItem?.name,
		priceBookItem?.subcategory,
		priceBookItem?.unit,
		priceBookItem,
		material.lastPurchaseCost,
	]);

	return (
		<DetailPageContentLayout
			activities={activities}
			attachments={attachments}
			customHeader={customHeader}
			customSections={customSections}
			defaultOpenSection="inventory-overview"
			notes={notes}
			relatedItems={relatedItems}
			showStandardSections={{
				activities: true,
				notes: true,
				attachments: true,
				relatedItems: relatedItems.length > 0,
			}}
		/>
	);
}
