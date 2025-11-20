"use client";

/**
 * CustomersTable Component
 * Standardized full-width table for displaying customers
 *
 * Features:
 * - Full-width responsive layout with design system variant
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Click to view customer details
 * - Auto-virtualization for >1,000 customers
 */

import { Archive, Mail, Phone, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import { useCustomerStatusColumn } from "@/lib/datatable/common-columns";
import { getRowHighlight } from "@/lib/datatable/rowHighlight";
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatCurrencyFromDollars } from "@/lib/formatters";
import { useArchiveStore } from "@/lib/stores/archive-store";

export type Customer = {
	id: string;
	name: string;
	contact: string;
	email: string;
	phone: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	status: "active" | "inactive" | "prospect";
	lastService: string;
	nextService: string;
	totalValue: number;
	archived_at?: string | null;
	deleted_at?: string | null;
};

type CustomersTableProps = {
	customers: Customer[];
	itemsPerPage?: number;
	totalCount?: number;
	currentPage?: number;
	onCustomerClick?: (customer: Customer) => void;
	enableVirtualization?: boolean | "auto";
	showRefresh?: boolean;
};

export function CustomersTable({
	customers,
	itemsPerPage = 50,
	totalCount,
	currentPage = 1,
	onCustomerClick,
	enableVirtualization = "auto",
	showRefresh = false,
}: CustomersTableProps) {
	const router = useRouter();
	const archiveFilter = useArchiveStore((state) => state.filters.customers);

	// Filter customers based on archive status
	const filteredCustomers = customers.filter((customer) => {
		const isArchived = Boolean(customer.archived_at || customer.deleted_at);
		if (archiveFilter === "active") return !isArchived;
		if (archiveFilter === "archived") return isArchived;
		return true;
	});

	// Define columns using standardized hooks and patterns
	const columns: ColumnDef<Customer>[] = [
		{
			key: "customer",
			header: "Customer",
			width: "flex-1",
			sortable: true,
			render: (customer) => (
				<Link
					className="flex items-center gap-3"
					href={`/dashboard/customers/${customer.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs">
							{customer.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.slice(0, 2)
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<div className="text-foreground truncate font-medium leading-tight hover:underline">
							{customer.name}
						</div>
						<div className="text-muted-foreground mt-0.5 truncate text-xs leading-tight">
							{customer.contact}
						</div>
					</div>
				</Link>
			),
		},
		{
			key: "contact",
			header: "Contact",
			width: "w-56",
			shrink: true,
			sortable: true,
			hideOnMobile: true,
			hideable: true,
			render: (customer) => (
				<div className="space-y-1">
					<div className="text-foreground flex items-center gap-1.5">
						<Mail className="text-muted-foreground h-3 w-3" />
						<span className="truncate text-xs">{customer.email}</span>
					</div>
					<div className="text-foreground flex items-center gap-1.5">
						<Phone className="text-muted-foreground h-3 w-3" />
						<span className="text-xs tabular-nums">{customer.phone}</span>
					</div>
				</div>
			),
		},
		{
			key: "address",
			header: "Address",
			width: "w-56",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (customer) => {
				if (!(customer.address || customer.city || customer.state)) {
					return (
						<span className="text-muted-foreground text-xs italic">
							No address
						</span>
					);
				}
				return (
					<div className="space-y-1">
						{customer.address && (
							<div className="text-foreground truncate text-xs">
								{customer.address}
							</div>
						)}
						{(customer.city || customer.state || customer.zipCode) && (
							<div className="text-muted-foreground truncate text-xs">
								{[customer.city, customer.state, customer.zipCode]
									.filter(Boolean)
									.join(", ")}
							</div>
						)}
					</div>
				);
			},
		},
		// Use standardized status column hook
		useCustomerStatusColumn<Customer>(
			"status",
			"Status",
			(customer) => customer.status,
			{
				width: "w-28",
			},
		),
		{
			key: "service",
			header: "Service",
			sortable: true,
			width: "w-48",
			shrink: true,
			hideOnMobile: true,
			hideable: true,
			render: (customer) => (
				<div className="space-y-1">
					<div className="text-foreground text-xs">
						Last:{" "}
						<span className="text-muted-foreground">
							{customer.lastService}
						</span>
					</div>
					<div className="text-foreground text-xs">
						Next:{" "}
						<span className="text-muted-foreground">
							{customer.nextService}
						</span>
					</div>
				</div>
			),
		},
		{
			key: "value",
			header: "Total Value",
			width: "w-32",
			shrink: true,
			align: "right",
			render: (customer) => (
				<span className="text-xs font-semibold tabular-nums">
					{formatCurrencyFromDollars(customer.totalValue)}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			render: (customer) => (
				<RowActionsDropdown
					actions={[
						{
							label: "View Details",
							icon: Users,
							href: `/dashboard/customers/${customer.id}`,
						},
						{
							label: "Send Email",
							icon: Mail,
							href: `mailto:${customer.email}`,
						},
						{
							label: "Call Customer",
							icon: Phone,
							href: `tel:${customer.phone}`,
						},
						{
							label: "Delete Customer",
							icon: Trash2,
							variant: "destructive",
							separatorBefore: true,
							onClick: () => {
								// TODO: Implement delete functionality
							},
						},
					]}
				/>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Export",
			icon: <Archive className="h-4 w-4" />,
			onClick: (_selectedIds) => {
				// TODO: Implement export functionality
			},
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: (_selectedIds) => {
				// TODO: Implement delete functionality
			},
			variant: "destructive",
		},
	];

	const searchFilter = (customer: Customer, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			customer.name.toLowerCase().includes(searchStr) ||
			customer.contact.toLowerCase().includes(searchStr) ||
			customer.email.toLowerCase().includes(searchStr) ||
			customer.phone.toLowerCase().includes(searchStr) ||
			customer.status.toLowerCase().includes(searchStr) ||
			(customer.address?.toLowerCase().includes(searchStr) ?? false) ||
			(customer.city?.toLowerCase().includes(searchStr) ?? false) ||
			(customer.state?.toLowerCase().includes(searchStr) ?? false) ||
			(customer.zipCode?.toLowerCase().includes(searchStr) ?? false)
		);
	};

	const handleRowClick = (customer: Customer) => {
		if (onCustomerClick) {
			onCustomerClick(customer);
		} else {
			window.location.href = `/dashboard/customers/${customer.id}`;
		}
	};

	return (
		<FullWidthDataTable
			{...TablePresets.fullList({
				entity: "customers",
				enableSelection: true,
				searchPlaceholder:
					"Search customers by name, email, phone, address, or status...",
				itemsPerPage,
				showRefresh,
			})}
			data={filteredCustomers}
			columns={columns}
			getItemId={(customer) => customer.id}
			bulkActions={bulkActions}
			searchFilter={searchFilter}
			onRowClick={handleRowClick}
			totalCount={totalCount ?? filteredCustomers.length}
			currentPageFromServer={currentPage}
			serverPagination
			onRefresh={() => router.refresh()}
			emptyMessage="No customers found"
			emptyIcon={<Users className="text-muted-foreground h-8 w-8" />}
			emptyAction={
				<Button
					onClick={() => (window.location.href = "/dashboard/customers/new")}
					size="sm"
				>
					<Users className="mr-2 size-4" />
					Add Customer
				</Button>
			}
			isArchived={(customer) =>
				Boolean(customer.archived_at || customer.deleted_at)
			}
			showArchived={archiveFilter !== "active"}
			isHighlighted={(customer) => {
				const { isHighlighted, highlightClass } = getRowHighlight(customer);
				if (highlightClass.includes("bg-success")) return false;
				return isHighlighted;
			}}
			getHighlightClass={(customer) => getRowHighlight(customer).highlightClass}
			enableVirtualization={enableVirtualization}
		/>
	);
}
