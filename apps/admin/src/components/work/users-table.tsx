"use client";

/**
 * UsersTable Component
 *
 * Admin datatable for managing users across all companies.
 */

import { Ban, Edit, Eye, Mail, Plus, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Button, RowActionsDropdown } from "@stratos/ui";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { UserStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatRelativeTime } from "@/lib/formatters";
import type { User as UserType } from "@/types/entities";

type UsersTableProps = {
	users: UserType[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onUserClick?: (user: UserType) => void;
	showRefresh?: boolean;
	initialSearchQuery?: string;
};

function getInitials(user: UserType): string {
	if (user.firstName && user.lastName) {
		return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
	}
	if (user.fullName) {
		const parts = user.fullName.split(" ");
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return parts[0][0].toUpperCase();
	}
	return user.email[0].toUpperCase();
}

function getDisplayName(user: UserType): string {
	if (user.fullName) return user.fullName;
	if (user.firstName && user.lastName) {
		return `${user.firstName} ${user.lastName}`;
	}
	return user.email.split("@")[0];
}

export function UsersTable({
	users,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onUserClick,
	showRefresh = false,
	initialSearchQuery = "",
}: UsersTableProps) {
	const columns: ColumnDef<UserType>[] = [
		{
			key: "user",
			header: "User",
			width: "flex-1",
			render: (user) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/users/${user.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center gap-3">
						<Avatar className="h-9 w-9">
							<AvatarImage src={user.avatarUrl} alt={getDisplayName(user)} />
							<AvatarFallback className="text-xs">
								{getInitials(user)}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<div className="truncate text-sm font-medium hover:underline">
								{getDisplayName(user)}
							</div>
							<div className="text-muted-foreground truncate text-xs">
								{user.email}
							</div>
						</div>
					</div>
				</Link>
			),
		},
		{
			key: "company",
			header: "Company",
			width: "w-44",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (user) => (
				<span className="text-sm">
					{user.companyName || (
						<span className="text-muted-foreground">—</span>
					)}
				</span>
			),
		},
		{
			key: "role",
			header: "Role",
			width: "w-28",
			shrink: true,
			hideable: true,
			render: (user) => (
				<span className="text-sm capitalize">{user.role}</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			hideable: false,
			render: (user) => <UserStatusBadge status={user.status} />,
		},
		{
			key: "lastLogin",
			header: "Last Login",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (user) => (
				<span className="text-muted-foreground text-sm">
					{user.lastLogin ? formatRelativeTime(user.lastLogin) : "Never"}
				</span>
			),
		},
		{
			key: "created",
			header: "Created",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (user) => (
				<span className="text-muted-foreground text-sm tabular-nums">
					{formatDate(user.createdAt, "short")}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (user) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Details",
							icon: Eye,
							href: `/dashboard/work/users/${user.id}`,
						},
						{
							label: "Edit User",
							icon: Edit,
							href: `/dashboard/work/users/${user.id}/edit`,
						},
						{
							label: "Send Email",
							icon: Mail,
							onClick: () => {
								window.location.href = `mailto:${user.email}`;
							},
							separatorBefore: true,
						},
						{
							label: "Suspend User",
							icon: Ban,
							variant: "destructive",
							separatorBefore: true,
							onClick: () => {
								console.log("Suspend user:", user.id);
							},
						},
					]}
				/>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Suspend Selected",
			icon: <Ban className="h-4 w-4" />,
			onClick: (selectedIds) => {
				console.log("Suspend users:", selectedIds);
			},
			variant: "destructive",
		},
	];

	const handleRowClick = (user: UserType) => {
		if (onUserClick) {
			onUserClick(user);
		} else {
			window.location.href = `/dashboard/work/users/${user.id}`;
		}
	};

	const handleRefresh = () => {
		window.location.reload();
	};

	const handleAddUser = () => {
		window.location.href = "/dashboard/work/users/new";
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={users}
			totalCount={totalCount}
			currentPageFromServer={currentPage}
			initialSearchQuery={initialSearchQuery}
			serverPagination
			emptyAction={
				<Button onClick={handleAddUser} size="sm">
					<Plus className="mr-2 size-4" />
					Add User
				</Button>
			}
			emptyIcon={<User className="text-muted-foreground h-8 w-8" />}
			emptyMessage="No users found"
			enableSelection={true}
			entity="admin-users"
			getItemId={(user) => user.id}
			itemsPerPage={itemsPerPage}
			onRefresh={handleRefresh}
			onRowClick={handleRowClick}
			serverSearch
			searchParamKey="search"
			searchPlaceholder="Search users by name, email, company..."
			showRefresh={showRefresh}
		/>
	);
}
