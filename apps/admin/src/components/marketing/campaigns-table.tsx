"use client";

/**
 * CampaignsTable Component
 *
 * Admin datatable for managing email marketing campaigns.
 * Displays campaign stats including open rates, click rates, and revenue.
 */

import {
	Archive,
	BarChart3,
	Copy,
	Edit,
	Eye,
	Mail,
	MoreHorizontal,
	Pause,
	Play,
	Plus,
	Send,
	Trash2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Button, RowActionsDropdown } from "@stratos/ui";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import {
	AudienceTypeBadge,
	CampaignStatusBadge,
} from "@/components/ui/status-badge";
import { formatDate, formatNumber, formatRate, formatCurrency } from "@/lib/formatters";
import type { EmailCampaign } from "@/types/campaigns";

type CampaignsTableProps = {
	campaigns: EmailCampaign[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onCampaignClick?: (campaign: EmailCampaign) => void;
	onDuplicate?: (campaign: EmailCampaign) => void;
	onPause?: (campaign: EmailCampaign) => void;
	onResume?: (campaign: EmailCampaign) => void;
	onDelete?: (campaign: EmailCampaign) => void;
	onSend?: (campaign: EmailCampaign) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

export function CampaignsTable({
	campaigns,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onCampaignClick,
	onDuplicate,
	onPause,
	onResume,
	onDelete,
	onSend,
	showRefresh = false,
	initialSearchQuery = "",
}: CampaignsTableProps) {
	const columns: ColumnDef<EmailCampaign>[] = [
		{
			key: "name",
			header: "Campaign",
			width: "flex-1",
			render: (campaign) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/marketing/campaigns/${campaign.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center gap-3">
						<div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
							<Mail className="text-muted-foreground h-4 w-4" />
						</div>
						<div className="min-w-0">
							<div className="truncate text-sm font-medium hover:underline">
								{campaign.name}
							</div>
							<div className="text-muted-foreground truncate text-xs">
								{campaign.subject}
							</div>
						</div>
					</div>
				</Link>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false,
			render: (campaign) => <CampaignStatusBadge status={campaign.status} />,
		},
		{
			key: "audience",
			header: "Audience",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (campaign) => (
				<div className="flex flex-col gap-1">
					<AudienceTypeBadge audienceType={campaign.audienceType} />
					<span className="text-muted-foreground flex items-center gap-1 text-[10px]">
						<Users className="h-3 w-3" />
						{formatNumber(campaign.totalRecipients)}
					</span>
				</div>
			),
		},
		{
			key: "delivered",
			header: "Delivered",
			width: "w-24",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			hideable: true,
			render: (campaign) => (
				<div className="text-right">
					<span className="font-mono text-sm tabular-nums">
						{formatNumber(campaign.deliveredCount)}
					</span>
					<span className="text-muted-foreground block text-[10px]">
						{formatRate(campaign.deliveredCount, campaign.sentCount)}
					</span>
				</div>
			),
		},
		{
			key: "opens",
			header: "Opens",
			width: "w-24",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			hideable: true,
			render: (campaign) => (
				<div className="text-right">
					<span className="font-mono text-sm tabular-nums">
						{formatNumber(campaign.uniqueOpens)}
					</span>
					<span className="text-muted-foreground block text-[10px]">
						{formatRate(campaign.uniqueOpens, campaign.deliveredCount)}
					</span>
				</div>
			),
		},
		{
			key: "clicks",
			header: "Clicks",
			width: "w-24",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			hideable: true,
			render: (campaign) => (
				<div className="text-right">
					<span className="font-mono text-sm tabular-nums">
						{formatNumber(campaign.uniqueClicks)}
					</span>
					<span className="text-muted-foreground block text-[10px]">
						{formatRate(campaign.uniqueClicks, campaign.deliveredCount)}
					</span>
				</div>
			),
		},
		{
			key: "revenue",
			header: "Revenue",
			width: "w-28",
			shrink: true,
			align: "right",
			hideOnMobile: true,
			hideable: true,
			render: (campaign) => (
				<span className="font-mono text-sm tabular-nums text-emerald-600">
					{formatCurrency(campaign.revenueAttributed, { decimals: 0 })}
				</span>
			),
		},
		{
			key: "date",
			header: "Date",
			width: "w-28",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (campaign) => {
				const displayDate = campaign.sentAt || campaign.scheduledFor || campaign.createdAt;
				const label = campaign.sentAt
					? "Sent"
					: campaign.scheduledFor
						? "Scheduled"
						: "Created";
				return (
					<div className="text-right">
						<span className="text-muted-foreground text-sm tabular-nums">
							{formatDate(displayDate, "short")}
						</span>
						<span className="text-muted-foreground block text-[10px]">{label}</span>
					</div>
				);
			},
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (campaign) => {
				type RowActionItem = {
					label: string;
					icon: typeof Eye;
					href?: string;
					onClick?: () => void;
					variant?: "default" | "destructive";
					separatorBefore?: boolean;
				};

				const actions: RowActionItem[] = [
					{
						label: "View Details",
						icon: Eye,
						href: `/dashboard/marketing/campaigns/${campaign.id}`,
					},
					{
						label: "View Analytics",
						icon: BarChart3,
						href: `/dashboard/marketing/campaigns/${campaign.id}/analytics`,
					},
				];

				// Add edit for draft campaigns
				if (campaign.status === "draft") {
					actions.push({
						label: "Edit Campaign",
						icon: Edit,
						href: `/dashboard/marketing/campaigns/${campaign.id}/edit`,
					});
				}

				// Add send action for draft campaigns
				if (campaign.status === "draft" && onSend) {
					actions.push({
						label: "Send Now",
						icon: Send,
						onClick: () => onSend(campaign),
						separatorBefore: true,
					});
				}

				// Add pause/resume for sending campaigns
				if (campaign.status === "sending" && onPause) {
					actions.push({
						label: "Pause Sending",
						icon: Pause,
						onClick: () => onPause(campaign),
						separatorBefore: true,
					});
				}
				if (campaign.status === "paused" && onResume) {
					actions.push({
						label: "Resume Sending",
						icon: Play,
						onClick: () => onResume(campaign),
						separatorBefore: true,
					});
				}

				// Always show duplicate
				if (onDuplicate) {
					actions.push({
						label: "Duplicate",
						icon: Copy,
						onClick: () => onDuplicate(campaign),
						separatorBefore: !actions.some((a) => a.separatorBefore),
					});
				}

				// Add delete for draft campaigns
				if (campaign.status === "draft" && onDelete) {
					actions.push({
						label: "Delete",
						icon: Trash2,
						variant: "destructive",
						onClick: () => onDelete(campaign),
						separatorBefore: true,
					});
				}

				return <RowActionsDropdown actions={actions} />;
			},
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: (selectedIds) => {
				console.log("Archive campaigns:", selectedIds);
			},
			variant: "destructive",
		},
	];

	const handleRowClick = (campaign: EmailCampaign) => {
		if (onCampaignClick) {
			onCampaignClick(campaign);
		} else {
			window.location.href = `/dashboard/marketing/campaigns/${campaign.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	const handleAddCampaign = () => {
		window.location.href = "/dashboard/marketing/campaigns/new";
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={campaigns}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyAction={
				<Button onClick={handleAddCampaign} size="sm">
					<Plus className="mr-2 size-4" />
					Create Campaign
				</Button>
			}
			emptyIcon={<Mail className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No campaigns found"
			enableSelection={true}
			entity="email-campaigns"
			getItemId={(campaign) => campaign.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search campaigns by name, subject..."
			showRefresh={showRefresh}
		/>
	);
}
