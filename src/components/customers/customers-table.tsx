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
 */

import {
  Archive,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";

export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "prospect";
  lastService: string;
  nextService: string;
  totalValue: number;
};

type CustomersTableProps = {
  customers: Customer[];
  itemsPerPage?: number;
  onCustomerClick?: (customer: Customer) => void;
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatusBadge(status: string) {
  const config = {
    active: {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      label: "Active",
    },
    inactive: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Inactive",
    },
    prospect: {
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      label: "Prospect",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.prospect;

  return (
    <Badge
      className={`font-medium text-xs ${statusConfig.className}`}
      variant="outline"
    >
      {statusConfig.label}
    </Badge>
  );
}

export function CustomersTable({
  customers,
  itemsPerPage = 50,
  onCustomerClick,
}: CustomersTableProps) {
  const columns: ColumnDef<Customer>[] = [
    {
      key: "customer",
      header: "Customer",
      width: "flex-1",
      render: (customer) => (
        <div className="flex items-center gap-3">
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
            <div className="truncate font-medium text-foreground text-sm leading-tight">
              {customer.name}
            </div>
            <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
              {customer.contact}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      width: "w-56",
      shrink: true,
      hideOnMobile: true,
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
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (customer) => getStatusBadge(customer.status),
    },
    {
      key: "service",
      header: "Service",
      width: "w-48",
      shrink: true,
      hideOnMobile: true,
      render: (customer) => (
        <div className="space-y-1">
          <div className="text-foreground text-sm">
            Last:{" "}
            <span className="text-muted-foreground">
              {customer.lastService}
            </span>
          </div>
          <div className="text-foreground text-sm">
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
        <span className="font-semibold tabular-nums">
          {formatCurrency(customer.totalValue)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (customer) => (
        <div data-no-row-click>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/customers/${customer.id}`}>
                  <Users className="mr-2 size-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`mailto:${customer.email}`}>
                  <Mail className="mr-2 size-4" />
                  Send Email
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`tel:${customer.phone}`}>
                  <Phone className="mr-2 size-4" />
                  Call Customer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Export",
      icon: <Archive className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Export customers:", Array.from(selectedIds));
        // TODO: Implement export functionality
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedIds) => {
        console.log("Delete customers:", Array.from(selectedIds));
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
      customer.status.toLowerCase().includes(searchStr)
    );
  };

  const handleRowClick = (customer: Customer) => {
    if (onCustomerClick) {
      onCustomerClick(customer);
    } else {
      window.location.href = `/dashboard/customers/${customer.id}`;
    }
  };

  // Highlight active customers
  const isHighlighted = (customer: Customer) => customer.status === "active";

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={customers}
      emptyIcon={<Users className="mx-auto h-12 w-12 text-muted-foreground" />}
      emptyMessage="No customers found"
      enableSelection={true}
      getHighlightClass={() => "bg-green-50/30 dark:bg-green-950/10"}
      getItemId={(customer) => customer.id}
      isHighlighted={isHighlighted}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={handleRowClick}
      searchFilter={searchFilter}
      searchPlaceholder="Search customers by name, email, phone, or status..."
      showRefresh={true}
    />
  );
}
