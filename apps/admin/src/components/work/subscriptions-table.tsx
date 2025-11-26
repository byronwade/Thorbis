"use client";

/**
 * SubscriptionsTable Component
 *
 * Admin datatable for managing subscriptions.
 */

import { Building2, CreditCard, Edit, Eye, Pause, Plus } from "lucide-react";
import Link from "next/link";
import { Button, RowActionsDropdown } from "@stratos/ui";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import {
	PlanBadge,
	SubscriptionStatusBadge,
} from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Subscription } from "@/types/entities";

type SubscriptionsTableProps = {
	subscriptions: Subscription[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onSubscriptionClick?: (subscription: Subscription) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

export function SubscriptionsTable({
	subscriptions,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onSubscriptionClick,
	showRefresh = false,
	initialSearchQuery = "",
}: SubscriptionsTableProps) {
	const columns: ColumnDef<Subscription>[] = [
		{
			key: "company",
			header: "Company",
			width: "flex-1",
			render: (subscription) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/subscriptions/${subscription.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center gap-3">
						<div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
							<Building2 className="text-muted-foreground h-4 w-4" />
						</div>
						<div className="min-w-0">
							<div className="truncate text-sm font-medium hover:underline">
								{subscription.companyName}
							</div>
							<div className="text-muted-foreground truncate text-xs">
								ID: {subscription.id.slice(0, 8)}...
							</div>
						</div>
					</div>
				</Link>
			),
		},
		{
			key: "plan",
			header: "Plan",
			width: "w-32",
			shrink: true,
			hideable: true,
			render: (subscription) => <PlanBadge plan={subscription.plan} />,
		},
		{
			key: "amount",
			header: "Amount",
			width: "w-28",
			shrink: true,
			align: "right",
			hideable: true,
			render: (subscription) => (
				<div className="text-right">
					<span className="font-mono text-sm font-semibold tabular-nums">
						{formatCurrency(subscription.amount, { decimals: 0 })}
					</span>
					<span className="text-muted-foreground text-xs">
						/{subscription.interval === "yearly" ? "yr" : "mo"}
					</span>
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false,
			render: (subscription) => (
				<SubscriptionStatusBadge status={subscription.status} />
			),
		},
		{
			key: "periodEnd",
			header: "Renews",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (subscription) => (
				<div>
					<span className="text-muted-foreground text-sm tabular-nums">
						{formatDate(subscription.currentPeriodEnd, "short")}
					</span>
					{subscription.cancelAtPeriodEnd && (
						<div className="text-destructive text-xs">Cancels</div>
					)}
				</div>
			),
		},
		{
			key: "created",
			header: "Started",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (subscription) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{formatDate(subscription.createdAt, "short")}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (subscription) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Details",
							icon: Eye,
							href: `/dashboard/work/subscriptions/${subscription.id}`,
						},
						{
							label: "Edit Subscription",
							icon: Edit,
							href: `/dashboard/work/subscriptions/${subscription.id}/edit`,
						},
						{
							label: "View Company",
							icon: Building2,
							href: `/dashboard/work/companies/${subscription.companyId}`,
							separatorBefore: true,
						},
						{
							label: "Cancel Subscription",
							icon: Pause,
							variant: "destructive",
							separatorBefore: true,
							onClick: () => {
								console.log("Cancel subscription:", subscription.id);
							},
						},
					]}
				/>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Cancel Selected",
			icon: <Pause className="h-4 w-4" />,
			onClick: (selectedIds) => {
				console.log("Cancel subscriptions:", selectedIds);
			},
			variant: "destructive",
		},
	];

	const handleRowClick = (subscription: Subscription) => {
		if (onSubscriptionClick) {
			onSubscriptionClick(subscription);
		} else {
			window.location.href = `/dashboard/work/subscriptions/${subscription.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={subscriptions}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyIcon={<CreditCard className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No subscriptions found"
			enableSelection={true}
			entity="admin-subscriptions"
			getItemId={(subscription) => subscription.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search subscriptions by company, plan..."
			showRefresh={showRefresh}
		/>
	);
}
