"use client";

import { Archive, Download, FileText, MoreHorizontal, Package, ShoppingCart, Trash2 } from "lucide-react";
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
	FullWidthDataTable,
	type ColumnDef,
	type BulkAction,
} from "@/components/ui/full-width-datatable";

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
};

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function getStatusBadge(status: string) {
	const config = {
		"in-stock": {
			className: "bg-green-500 hover:bg-green-600 text-white",
			label: "In Stock",
		},
		"low-stock": {
			className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
			label: "Low Stock",
		},
		"out-of-stock": {
			className: "bg-red-500 hover:bg-red-600 text-white",
			label: "Out of Stock",
		},
		"on-order": {
			className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			label: "On Order",
		},
	};

	const statusConfig = config[status as keyof typeof config] || config["in-stock"];

	return (
		<Badge className={statusConfig.className} variant="outline">
			{statusConfig.label}
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
	const columns: ColumnDef<Material>[] = [
		{
			key: "itemCode",
			header: "Item Code",
			width: "w-32",
			shrink: true,
			render: (material) => (
				<Link
					className="font-semibold hover:underline"
					href={`/dashboard/work/materials/${material.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{material.itemCode}
				</Link>
			),
		},
		{
			key: "description",
			header: "Description",
			width: "flex-1",
			render: (material) => (
				<div className="min-w-0">
					<div className="truncate font-medium text-sm">{material.description}</div>
					<div className="truncate text-muted-foreground text-xs">
						{material.category}
					</div>
				</div>
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
				<span className="text-sm">
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
				<span className="text-sm">{formatCurrency(material.unitCost)}</span>
			),
		},
		{
			key: "totalValue",
			header: "Total Value",
			width: "w-32",
			shrink: true,
			align: "right",
			render: (material) => (
				<span className="font-semibold text-sm">
					{formatCurrency(material.totalValue)}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-32",
			shrink: true,
			render: (material) => getStatusBadge(material.status),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (material) => (
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
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="mr-2 size-4" />
								Delete
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
			onClick: (selectedIds) => console.log("Reorder:", selectedIds),
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Export:", selectedIds),
		},
		{
			label: "Archive",
			icon: <Archive className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Archive:", selectedIds),
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Delete:", selectedIds),
			variant: "destructive",
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
			data={materials}
			columns={columns}
			getItemId={(material) => material.id}
			onRowClick={(material) =>
				(window.location.href = `/dashboard/work/materials/${material.id}`)
			}
			bulkActions={bulkActions}
			searchFilter={searchFilter}
			searchPlaceholder="Search materials by code, description, category, or status..."
			emptyMessage="No materials found"
			emptyIcon={<Package className="mx-auto h-12 w-12 text-muted-foreground" />}
			itemsPerPage={itemsPerPage}
			enableSelection={true}
			showRefresh={true}
			onRefresh={() => window.location.reload()}
			isHighlighted={(material) => material.status === "out-of-stock"}
			getHighlightClass={() => "bg-red-50/30 dark:bg-red-950/10"}
		/>
	);
}
