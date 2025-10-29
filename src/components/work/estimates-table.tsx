"use client";

import { Archive, Download, FileText, MoreHorizontal, Send, Trash2 } from "lucide-react";
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

export type Estimate = {
	id: string;
	estimateNumber: string;
	customer: string;
	project: string;
	date: string;
	validUntil: string;
	amount: number;
	status: "accepted" | "sent" | "draft" | "declined";
};

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function getStatusBadge(status: string) {
	const config = {
		accepted: {
			className: "bg-green-500 hover:bg-green-600 text-white",
			label: "Accepted",
		},
		sent: {
			className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			label: "Sent",
		},
		draft: {
			className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			label: "Draft",
		},
		declined: {
			className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
			label: "Declined",
		},
	};

	const statusConfig = config[status as keyof typeof config] || config.draft;

	return (
		<Badge className={statusConfig.className} variant="outline">
			{statusConfig.label}
		</Badge>
	);
}

export function EstimatesTable({
	estimates,
	itemsPerPage = 50,
}: {
	estimates: Estimate[];
	itemsPerPage?: number;
}) {
	const columns: ColumnDef<Estimate>[] = [
		{
			key: "estimateNumber",
			header: "Estimate #",
			width: "w-36",
			shrink: true,
			render: (estimate) => (
				<Link
					className="font-semibold hover:underline"
					href={`/dashboard/work/estimates/${estimate.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{estimate.estimateNumber}
				</Link>
			),
		},
		{
			key: "customer",
			header: "Customer",
			width: "w-48",
			shrink: true,
			render: (estimate) => (
				<span className="font-medium text-sm">{estimate.customer}</span>
			),
		},
		{
			key: "project",
			header: "Project",
			width: "flex-1",
			render: (estimate) => <span className="text-sm">{estimate.project}</span>,
		},
		{
			key: "date",
			header: "Date",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			render: (estimate) => <span className="text-sm">{estimate.date}</span>,
		},
		{
			key: "validUntil",
			header: "Valid Until",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			render: (estimate) => (
				<span className="text-sm">{estimate.validUntil}</span>
			),
		},
		{
			key: "amount",
			header: "Amount",
			width: "w-32",
			shrink: true,
			align: "right",
			render: (estimate) => (
				<span className="font-semibold text-sm">
					{formatCurrency(estimate.amount)}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			render: (estimate) => getStatusBadge(estimate.status),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (estimate) => (
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
								<Send className="mr-2 size-4" />
								Send to Customer
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Download className="mr-2 size-4" />
								Download PDF
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
			label: "Send",
			icon: <Send className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Send:", selectedIds),
		},
		{
			label: "Download",
			icon: <Download className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Download:", selectedIds),
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (selectedIds) => console.log("Delete:", selectedIds),
			variant: "destructive",
		},
	];

	const searchFilter = (estimate: Estimate, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			estimate.estimateNumber.toLowerCase().includes(searchStr) ||
			estimate.customer.toLowerCase().includes(searchStr) ||
			estimate.project.toLowerCase().includes(searchStr) ||
			estimate.status.toLowerCase().includes(searchStr)
		);
	};

	return (
		<FullWidthDataTable
			data={estimates}
			columns={columns}
			getItemId={(estimate) => estimate.id}
			onRowClick={(estimate) =>
				(window.location.href = `/dashboard/work/estimates/${estimate.id}`)
			}
			bulkActions={bulkActions}
			searchFilter={searchFilter}
			searchPlaceholder="Search estimates by number, customer, project, or status..."
			emptyMessage="No estimates found"
			emptyIcon={<FileText className="mx-auto h-12 w-12 text-muted-foreground" />}
			itemsPerPage={itemsPerPage}
			enableSelection={true}
			showRefresh={true}
			onRefresh={() => window.location.reload()}
			isHighlighted={(estimate) => estimate.status === "accepted"}
			getHighlightClass={() => "bg-green-50/30 dark:bg-green-950/10"}
		/>
	);
}
