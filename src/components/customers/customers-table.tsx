"use client";

/**
 * CustomersTable Component
 * Full-width Gmail-style table for displaying customers
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Click to view customer details
 * - ✨ Auto-virtualization for >1,000 customers (100x faster!)
 *
 * Performance:
 * - <1,000 customers: Pagination mode (50 per page)
 * - >1,000 customers: Virtual scrolling (60fps smooth)
 * - Automatically switches based on dataset size
 */

import { Archive, Mail, Phone, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type BulkAction, type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import { CustomerStatusBadge } from "@/components/ui/status-badge";
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
	onCustomerClick?: (customer: Customer) => void;
};

export function CustomersTable({ customers, itemsPerPage = 50, onCustomerClick }: CustomersTableProps) {
	// Archive filter state
	const archiveFilter = useArchiveStore((state) => state.filters.customers);

	// Filter customers based on archive status
	const filteredCustomers = customers.filter((customer) => {
		const isArchived = Boolean(customer.archived_at || customer.deleted_at);
		if (archiveFilter === "active") {
			return !isArchived;
		}
		if (archiveFilter === "archived") {
			return isArchived;
		}
		return true; // "all"
	});

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
						<div className="truncate font-medium text-foreground text-sm leading-tight hover:underline">
							{customer.name}
						</div>
						<div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">{customer.contact}</div>
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
					<div className="flex items-center gap-1.5 text-foreground text-sm">
						<Mail className="h-3 w-3 text-muted-foreground" />
						<span className="truncate">{customer.email}</span>
					</div>
					<div className="flex items-center gap-1.5 text-foreground text-sm">
						<Phone className="h-3 w-3 text-muted-foreground" />
						<span className="tabular-nums">{customer.phone}</span>
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
					return <span className="text-muted-foreground text-sm italic">No address</span>;
				}
				return (
					<div className="space-y-1">
						{customer.address && <div className="truncate text-foreground text-sm">{customer.address}</div>}
						{(customer.city || customer.state || customer.zipCode) && (
							<div className="truncate text-muted-foreground text-xs">
								{[customer.city, customer.state, customer.zipCode].filter(Boolean).join(", ")}
							</div>
						)}
					</div>
				);
			},
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			sortable: true,
			hideable: false, // CRITICAL: Status essential for customer management
			render: (customer) => <CustomerStatusBadge status={customer.status} />,
		},
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
					<div className="text-foreground text-sm">
						Last: <span className="text-muted-foreground">{customer.lastService}</span>
					</div>
					<div className="text-foreground text-sm">
						Next: <span className="text-muted-foreground">{customer.nextService}</span>
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
				<span className="font-semibold tabular-nums">{formatCurrencyFromDollars(customer.totalValue)}</span>
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

	// Bulk actions
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

	// Search filter function
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
			bulkActions={bulkActions}
			columns={columns}
			data={filteredCustomers}
			emptyAction={
				<Button onClick={() => (window.location.href = "/dashboard/customers/new")} size="sm">
					<Users className="mr-2 size-4" />
					Add Customer
				</Button>
			}
			emptyIcon={<Users className="h-8 w-8 text-muted-foreground" />}
			emptyMessage="No customers found"
			enableSelection={true}
			entity="customers"
			getItemId={(customer) => customer.id}
			isArchived={(customer) => Boolean(customer.archived_at || customer.deleted_at)}
			itemsPerPage={itemsPerPage}
			onRefresh={() => window.location.reload()}
			onRowClick={handleRowClick}
			searchFilter={searchFilter}
			searchPlaceholder="Search customers by name, email, phone, address, or status..."
			showArchived={archiveFilter !== "active"}
		/>
	);
}
