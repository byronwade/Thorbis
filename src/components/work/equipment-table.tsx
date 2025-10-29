"use client";

import { Archive, Download, MoreHorizontal, Settings, Trash2, Truck, Wrench } from "lucide-react";
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

export type Equipment = {
	id: string;
	assetId: string;
	name: string;
	type: "Vehicle" | "Tool" | "Equipment";
	assignedTo: string;
	lastService: string;
	nextService: string;
	status: "available" | "in-use" | "maintenance" | "retired";
};

function getStatusBadge(status: string) {
	const config = {
		available: {
			className: "bg-green-500 hover:bg-green-600 text-white",
			label: "Available",
		},
		"in-use": {
			className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			label: "In Use",
		},
		maintenance: {
			className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
			label: "Maintenance",
		},
		retired: {
			className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			label: "Retired",
		},
	};

	const statusConfig = config[status as keyof typeof config] || config.available;

	return (
		<Badge className={statusConfig.className} variant="outline">
			{statusConfig.label}
		</Badge>
	);
}

export function EquipmentTable({
	equipment,
	itemsPerPage = 50,
}: {
	equipment: Equipment[];
	itemsPerPage?: number;
}) {
	const columns: ColumnDef<Equipment>[] = [
		{
			key: "assetId",
			header: "Asset ID",
			width: "w-32",
			shrink: true,
			render: (item) => (
				<Link
					className="font-semibold hover:underline"
					href={`/dashboard/work/equipment/${item.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{item.assetId}
				</Link>
			),
		},
		{
			key: "name",
			header: "Name",
			width: "flex-1",
			render: (item) => (
				<div className="min-w-0">
					<div className="truncate font-medium text-sm">{item.name}</div>
					<div className="truncate text-muted-foreground text-xs">
						{item.type}
					</div>
				</div>
			),
		},
		{
			key: "assignedTo",
			header: "Assigned To",
			width: "w-40",
			shrink: true,
			hideOnMobile: true,
			render: (item) => (
				<span className="text-sm">{item.assignedTo}</span>
			),
		},
		{
			key: "lastService",
			header: "Last Service",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			render: (item) => (
				<span className="text-sm">{item.lastService}</span>
			),
		},
		{
			key: "nextService",
			header: "Next Service",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			render: (item) => (
				<span className="text-sm">{item.nextService}</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-32",
			shrink: true,
			render: (item) => getStatusBadge(item.status),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (item) => (
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
								<Wrench className="mr-2 size-4" />
								Schedule Service
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 size-4" />
								Update Status
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
			label: "Schedule Service",
			icon: <Wrench className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Schedule Service:", selectedIds),
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

	const searchFilter = (item: Equipment, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			item.assetId.toLowerCase().includes(searchStr) ||
			item.name.toLowerCase().includes(searchStr) ||
			item.type.toLowerCase().includes(searchStr) ||
			item.assignedTo.toLowerCase().includes(searchStr) ||
			item.status.toLowerCase().includes(searchStr)
		);
	};

	return (
		<FullWidthDataTable
			data={equipment}
			columns={columns}
			getItemId={(item) => item.id}
			onRowClick={(item) =>
				(window.location.href = `/dashboard/work/equipment/${item.id}`)
			}
			bulkActions={bulkActions}
			searchFilter={searchFilter}
			searchPlaceholder="Search equipment by asset ID, name, type, assigned to, or status..."
			emptyMessage="No equipment found"
			emptyIcon={<Truck className="mx-auto h-12 w-12 text-muted-foreground" />}
			itemsPerPage={itemsPerPage}
			enableSelection={true}
			showRefresh={true}
			onRefresh={() => window.location.reload()}
			isHighlighted={(item) => item.status === "maintenance"}
			getHighlightClass={() => "bg-yellow-50/30 dark:bg-yellow-950/10"}
		/>
	);
}
