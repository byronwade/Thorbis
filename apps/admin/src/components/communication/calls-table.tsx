"use client";

/**
 * CallsTable Component
 *
 * Admin datatable for viewing call history.
 */

import {
	ArrowDownLeft,
	ArrowUpRight,
	Building2,
	Eye,
	Phone,
	PhoneMissed,
	PlayCircle,
	Voicemail,
} from "lucide-react";
import Link from "next/link";
import { Badge, RowActionsDropdown } from "@stratos/ui";
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { formatRelativeTime } from "@/lib/formatters";
import type { Call } from "@/types/entities";

type CallsTableProps = {
	calls: Call[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onCallClick?: (call: Call) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

function getStatusConfig(status: string): {
	icon: typeof Phone;
	label: string;
	className: string;
} {
	switch (status) {
		case "completed":
			return {
				icon: Phone,
				label: "Completed",
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
			};
		case "missed":
			return {
				icon: PhoneMissed,
				label: "Missed",
				className: "bg-red-500/10 text-red-600 border-red-500/20",
			};
		case "voicemail":
			return {
				icon: Voicemail,
				label: "Voicemail",
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
			};
		case "busy":
			return {
				icon: PhoneMissed,
				label: "Busy",
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
			};
		default:
			return {
				icon: Phone,
				label: status,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
			};
	}
}

function formatDuration(seconds?: number): string {
	if (!seconds) return "—";
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	if (mins > 0) {
		return `${mins}m ${secs}s`;
	}
	return `${secs}s`;
}

export function CallsTable({
	calls,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onCallClick,
	showRefresh = false,
	initialSearchQuery = "",
}: CallsTableProps) {
	const columns: ColumnDef<Call>[] = [
		{
			key: "direction",
			header: "",
			width: "w-8",
			shrink: true,
			render: (call) =>
				call.direction === "inbound" ? (
					<ArrowDownLeft className="text-emerald-500 h-4 w-4" />
				) : (
					<ArrowUpRight className="text-blue-500 h-4 w-4" />
				),
		},
		{
			key: "call",
			header: "Call",
			width: "flex-1",
			render: (call) => {
				const statusConfig = getStatusConfig(call.status);

				return (
					<Link
						className="block min-w-0"
						href={`/dashboard/communication/calls/${call.id}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start gap-3">
							<div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
								<Phone className="text-muted-foreground h-4 w-4" />
							</div>
							<div className="min-w-0 flex-1">
								<div className="text-sm font-medium hover:underline">
									{call.direction === "inbound"
										? `From: ${call.from}`
										: `To: ${call.to}`}
								</div>
								<div className="text-muted-foreground text-xs">
									{call.direction === "inbound"
										? `To: ${call.to}`
										: `From: ${call.from}`}
								</div>
							</div>
						</div>
					</Link>
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
			render: (call) => (
				<div className="flex items-center gap-1.5">
					<Building2 className="text-muted-foreground h-3.5 w-3.5" />
					<span className="text-sm truncate">
						{call.companyName || "—"}
					</span>
				</div>
			),
		},
		{
			key: "duration",
			header: "Duration",
			width: "w-24",
			shrink: true,
			hideable: true,
			render: (call) => (
				<span className="text-sm font-mono tabular-nums">
					{formatDuration(call.duration)}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false,
			render: (call) => {
				const config = getStatusConfig(call.status);
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
			key: "recording",
			header: "Recording",
			width: "w-24",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (call) =>
				call.recordingUrl ? (
					<button
						className="text-primary flex items-center gap-1 text-sm hover:underline"
						onClick={(e) => {
							e.stopPropagation();
							window.open(call.recordingUrl, "_blank");
						}}
					>
						<PlayCircle className="h-3.5 w-3.5" />
						Play
					</button>
				) : (
					<span className="text-muted-foreground text-sm">—</span>
				),
		},
		{
			key: "created",
			header: "Time",
			width: "w-28",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (call) => (
				<span className="text-muted-foreground text-sm">
					{formatRelativeTime(call.createdAt)}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (call) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Details",
							icon: Eye,
							href: `/dashboard/communication/calls/${call.id}`,
						},
						...(call.recordingUrl
							? [
									{
										label: "Play Recording",
										icon: PlayCircle,
										onClick: () => {
											window.open(call.recordingUrl, "_blank");
										},
									},
								]
							: []),
						{
							label: "View Company",
							icon: Building2,
							href: `/dashboard/work/companies/${call.companyId}`,
							separatorBefore: true,
						},
					]}
				/>
			),
		},
	];

	const handleRowClick = (call: Call) => {
		if (onCallClick) {
			onCallClick(call);
		} else {
			window.location.href = `/dashboard/communication/calls/${call.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<FullWidthDataTable
			columns={columns}
			data={calls}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyIcon={<Phone className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No calls found"
			enableSelection={false}
			entity="admin-calls"
			getItemId={(call) => call.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search calls by phone number, company..."
			showRefresh={showRefresh}
		/>
	);
}
