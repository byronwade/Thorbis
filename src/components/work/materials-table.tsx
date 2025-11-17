"use client";

import { Archive, Download, MoreHorizontal, Package, ShoppingCart } from "lucide-react";
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
import { useArchiveStore } from "@/lib/stores/archive-store";

export type Material = {
	id: string;
	itemCode: string;
	description: string;
	category: string;
	quantity: number;
	unit: string;
	unitCost: number;
	totalValue: number;
	status: "in-stock" | "low-stock" | "out-of-stock" | "on-order";
	archived_at?: string | null;
	deleted_at?: string | null;
};

const MATERIAL_STATUS_CONFIG = {
	"in-stock": {
		className: "bg-success hover:bg-success text-white",
		label: "In Stock",
	},
	"low-stock": {
		className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
		label: "Low Stock",
	},
	"out-of-stock": {
		className: "bg-destructive hover:bg-destructive text-white",
		label: "Out of Stock",
	},
	"on-order": {
		className: "bg-primary text-primary dark:bg-primary/20 dark:text-primary",
		label: "On Order",
	},
} as const;

function renderStatusBadge(status: Material["status"]) {
	const fallback = {
		className: "bg-muted text-muted-foreground",
		label: status.replace(/[-_]/g, " "),
	};
	const config = MATERIAL_STATUS_CONFIG[status as keyof typeof MATERIAL_STATUS_CONFIG] ?? fallback;
	return (
		<Badge className={`text-xs ${config.className}`} variant="outline">
			{config.label}
		</Badge>
	);
}

export function MaterialsTable({
	materials,
	itemsPerPage = 50,
}: {
	materials: Material[];
	itemsPerPage?: number;
}) {
	// Archive filter state
	const archiveFilter = useArchiveStore((state) => state.filters.materials);

	// Filter materials based on archive status
	const filteredMaterials = materials.filter((material) => {
		const isArchived = Boolean(material.archived_at || material.deleted_at);
		if (archiveFilter === "active") {
			return !isArchived;
		}
		if (archiveFilter === "archived") {
			return isArchived;
		}
		return true; // "all"
	});

	const columns: ColumnDef<Material>[] = [
		{
			key: "itemCode",
			header: "Item Code",
			width: "w-32",
			sortable: true,
			shrink: true,
			render: (material) => (
				<Link
					className="text-foreground text-sm leading-tight font-medium hover:underline"
					href={`/dashboard/work/materials/${material.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{material.itemCode}
				</Link>
			),
		},
		{
			key: "description",
			sortable: true,
			header: "Description",
			width: "flex-1",
			render: (material) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/materials/${material.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="text-foreground truncate text-sm leading-tight font-medium hover:underline">
						{material.description}
					</div>
					<div className="text-muted-foreground mt-0.5 truncate text-xs leading-tight">
						{material.category}
					</div>
				</Link>
			),
		},
		{
			key: "quantity",
			header: "Quantity",
			width: "w-28",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			render: (material) => (
				<span className="text-foreground text-sm tabular-nums">
					{material.quantity} {material.unit}
				</span>
			),
		},
		{
			key: "unitCost",
			header: "Unit Cost",
			width: "w-28",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			render: (material) => (
				<span className="text-foreground text-sm tabular-nums">
					{formatCurrency(material.unitCost)}
				</span>
			),
		},
		{
			key: "totalValue",
			header: "Total Value",
			width: "w-32",
			shrink: true,
			align: "right",
			render: (material) => (
				<span className="font-semibold tabular-nums">{formatCurrency(material.totalValue)}</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-32",
			shrink: true,
			render: (material) => renderStatusBadge(material.status),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (_material) => (
				<div data-no-row-click>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<ShoppingCart className="mr-2 size-4" />
								Reorder
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Package className="mr-2 size-4" />
								Adjust Stock
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Archive className="mr-2 size-4" />
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
			label: "Reorder",
			icon: <ShoppingCart className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Archive",
			icon: <Archive className="h-4 w-4" />,
			variant: "destructive",
			onClick: (_selectedIds) => {},
		},
	];

	const searchFilter = (material: Material, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			material.itemCode.toLowerCase().includes(searchStr) ||
			material.description.toLowerCase().includes(searchStr) ||
			material.category.toLowerCase().includes(searchStr) ||
			material.status.toLowerCase().includes(searchStr)
		);
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={filteredMaterials}
			emptyIcon={<Package className="text-muted-foreground mx-auto h-12 w-12" />}
			emptyMessage="No materials found"
			enableSelection={true}
			entity="materials"
			getHighlightClass={() => "bg-destructive/30 dark:bg-destructive/10"}
			getItemId={(material) => material.id}
			isArchived={(material) => Boolean(material.archived_at || material.deleted_at)}
			isHighlighted={(material) => material.status === "out-of-stock"}
			itemsPerPage={itemsPerPage}
			onRefresh={() => window.location.reload()}
			onRowClick={(material) => (window.location.href = `/dashboard/work/materials/${material.id}`)}
			searchFilter={searchFilter}
			searchPlaceholder="Search materials by code, description, category, or status..."
			showArchived={archiveFilter !== "active"}
			showRefresh={false}
		/>
	);
}
