"use client";

/**
 * MessagesTable Component
 *
 * Admin datatable for viewing platform communication activity.
 */

import {
	ArrowDownLeft,
	ArrowUpRight,
	Building2,
	Eye,
	Mail,
	MessageSquare,
	Phone,
} from "lucide-react";
import Link from "next/link";
import { Badge, RowActionsDropdown } from "@stratos/ui";
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { formatRelativeTime } from "@/lib/formatters";
import type { Message } from "@/types/entities";

type MessagesTableProps = {
	messages: Message[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onMessageClick?: (message: Message) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

function getTypeConfig(type: string): {
	icon: typeof Mail;
	label: string;
	className: string;
} {
	switch (type) {
		case "email":
			return {
				icon: Mail,
				label: "Email",
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
			};
		case "sms":
			return {
				icon: MessageSquare,
				label: "SMS",
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
			};
		case "call":
			return {
				icon: Phone,
				label: "Call",
				className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
			};
		default:
			return {
				icon: MessageSquare,
				label: type,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
			};
	}
}

function getStatusConfig(status: string): {
	label: string;
	className: string;
} {
	switch (status) {
		case "delivered":
			return {
				label: "Delivered",
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
			};
		case "sent":
			return {
				label: "Sent",
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
			};
		case "read":
			return {
				label: "Read",
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
			};
		case "failed":
			return {
				label: "Failed",
				className: "bg-red-500/10 text-red-600 border-red-500/20",
			};
		default:
			return {
				label: status,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
			};
	}
}

export function MessagesTable({
	messages,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onMessageClick,
	showRefresh = false,
	initialSearchQuery = "",
}: MessagesTableProps) {
	const columns: ColumnDef<Message>[] = [
		{
			key: "direction",
			header: "",
			width: "w-8",
			shrink: true,
			render: (message) =>
				message.direction === "inbound" ? (
					<ArrowDownLeft className="text-emerald-500 h-4 w-4" />
				) : (
					<ArrowUpRight className="text-blue-500 h-4 w-4" />
				),
		},
		{
			key: "message",
			header: "Message",
			width: "flex-1",
			render: (message) => {
				const typeConfig = getTypeConfig(message.type);
				const TypeIcon = typeConfig.icon;

				return (
					<Link
						className="block min-w-0"
						href={`/dashboard/communication/${message.type}/${message.id}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start gap-3">
							<div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
								<TypeIcon className="text-muted-foreground h-4 w-4" />
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium hover:underline truncate">
										{message.subject || message.preview?.slice(0, 40) || "No subject"}
									</span>
								</div>
								{message.preview && (
									<div className="text-muted-foreground mt-0.5 truncate text-xs">
										{message.preview.slice(0, 80)}...
									</div>
								)}
							</div>
						</div>
					</Link>
				);
			},
		},
		{
			key: "type",
			header: "Type",
			width: "w-24",
			shrink: true,
			hideable: true,
			render: (message) => {
				const config = getTypeConfig(message.type);
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
			key: "company",
			header: "Company",
			width: "w-40",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (message) => (
				<div className="flex items-center gap-1.5">
					<Building2 className="text-muted-foreground h-3.5 w-3.5" />
					<span className="text-sm truncate">
						{message.companyName || "—"}
					</span>
				</div>
			),
		},
		{
			key: "from",
			header: "From",
			width: "w-36",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (message) => (
				<span className="text-sm truncate">{message.from}</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-24",
			shrink: true,
			hideable: false,
			render: (message) => {
				const config = getStatusConfig(message.status);
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
			key: "created",
			header: "Time",
			width: "w-28",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (message) => (
				<span className="text-muted-foreground text-sm">
					{formatRelativeTime(message.createdAt)}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (message) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Details",
							icon: Eye,
							href: `/dashboard/communication/${message.type}/${message.id}`,
						},
						{
							label: "View Company",
							icon: Building2,
							href: `/dashboard/work/companies/${message.companyId}`,
							separatorBefore: true,
						},
					]}
				/>
			),
		},
	];

	const handleRowClick = (message: Message) => {
		if (onMessageClick) {
			onMessageClick(message);
		} else {
			window.location.href = `/dashboard/communication/${message.type}/${message.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<FullWidthDataTable
			columns={columns}
			data={messages}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyIcon={<MessageSquare className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No messages found"
			enableSelection={false}
			entity="admin-messages"
			getItemId={(message) => message.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search messages by subject, company..."
			showRefresh={showRefresh}
		/>
	);
}
