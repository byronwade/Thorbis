"use client";

/**
 * SupportTicketsTable Component
 *
 * Admin datatable for managing support tickets.
 */

import {
	AlertCircle,
	Building2,
	CheckCircle,
	Edit,
	Eye,
	MessageSquare,
	Plus,
	Ticket,
	User,
} from "lucide-react";
import Link from "next/link";
import { Badge, Button, RowActionsDropdown } from "@stratos/ui";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { TicketStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatRelativeTime } from "@/lib/formatters";
import type { SupportTicket } from "@/types/entities";

type SupportTicketsTableProps = {
	tickets: SupportTicket[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onTicketClick?: (ticket: SupportTicket) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

function getPriorityConfig(priority: string): {
	label: string;
	className: string;
} {
	switch (priority?.toLowerCase()) {
		case "urgent":
			return {
				label: "Urgent",
				className: "bg-red-500/10 text-red-600 border-red-500/20",
			};
		case "high":
			return {
				label: "High",
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
			};
		case "medium":
			return {
				label: "Medium",
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
			};
		case "low":
		default:
			return {
				label: "Low",
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
			};
	}
}

export function SupportTicketsTable({
	tickets,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onTicketClick,
	showRefresh = false,
	initialSearchQuery = "",
}: SupportTicketsTableProps) {
	const columns: ColumnDef<SupportTicket>[] = [
		{
			key: "ticket",
			header: "Ticket",
			width: "flex-1",
			render: (ticket) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/communication/tickets/${ticket.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-start gap-3">
						<div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
							<Ticket className="text-muted-foreground h-4 w-4" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground text-xs font-mono">
									#{ticket.ticketNumber}
								</span>
							</div>
							<div className="truncate text-sm font-medium hover:underline">
								{ticket.subject}
							</div>
							{ticket.description && (
								<div className="text-muted-foreground mt-0.5 truncate text-xs">
									{ticket.description.slice(0, 80)}...
								</div>
							)}
						</div>
					</div>
				</Link>
			),
		},
		{
			key: "company",
			header: "Company",
			width: "w-40",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (ticket) => (
				<div className="flex items-center gap-1.5">
					<Building2 className="text-muted-foreground h-3.5 w-3.5" />
					<span className="text-sm truncate">
						{ticket.companyName || "—"}
					</span>
				</div>
			),
		},
		{
			key: "priority",
			header: "Priority",
			width: "w-24",
			shrink: true,
			hideable: true,
			render: (ticket) => {
				const config = getPriorityConfig(ticket.priority);
				return (
					<Badge
						className={`px-2 py-0.5 text-[11px] font-medium ${config.className}`}
						variant="outline"
					>
						{config.label}
					</Badge>
				);
			},
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false,
			render: (ticket) => <TicketStatusBadge status={ticket.status} />,
		},
		{
			key: "assignee",
			header: "Assignee",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (ticket) => (
				<div className="flex items-center gap-1.5">
					<User className="text-muted-foreground h-3.5 w-3.5" />
					<span className="text-sm truncate">
						{ticket.assignedTo || "Unassigned"}
					</span>
				</div>
			),
		},
		{
			key: "created",
			header: "Created",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (ticket) => (
				<span className="text-muted-foreground text-sm">
					{formatRelativeTime(ticket.createdAt)}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (ticket) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Ticket",
							icon: Eye,
							href: `/dashboard/communication/tickets/${ticket.id}`,
						},
						{
							label: "Edit Ticket",
							icon: Edit,
							href: `/dashboard/communication/tickets/${ticket.id}/edit`,
						},
						{
							label: "Add Reply",
							icon: MessageSquare,
							onClick: () => {
								console.log("Reply to ticket:", ticket.id);
							},
							separatorBefore: true,
						},
						{
							label: "Mark Resolved",
							icon: CheckCircle,
							onClick: () => {
								console.log("Resolve ticket:", ticket.id);
							},
						},
					]}
				/>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Mark Resolved",
			icon: <CheckCircle className="h-4 w-4" />,
			onClick: (selectedIds) => {
				console.log("Resolve tickets:", selectedIds);
			},
		},
		{
			label: "Assign to Me",
			icon: <User className="h-4 w-4" />,
			onClick: (selectedIds) => {
				console.log("Assign tickets:", selectedIds);
			},
		},
	];

	const handleRowClick = (ticket: SupportTicket) => {
		if (onTicketClick) {
			onTicketClick(ticket);
		} else {
			window.location.href = `/dashboard/communication/tickets/${ticket.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	const handleNewTicket = () => {
		window.location.href = "/dashboard/communication/tickets/new";
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={tickets}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyAction={
				<Button onClick={handleNewTicket} size="sm">
					<Plus className="mr-2 size-4" />
					Create Ticket
				</Button>
			}
			emptyIcon={<Ticket className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No support tickets found"
			enableSelection={true}
			entity="admin-support-tickets"
			getItemId={(ticket) => ticket.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search tickets by subject, company..."
			showRefresh={showRefresh}
		/>
	);
}
