"use client";

import { Building2, Download, Mail, MoreHorizontal, Phone, Pause } from "lucide-react";
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
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { formatCurrency } from "@/lib/formatters";

export type Vendor = {
  id: string;
  name: string;
  display_name: string;
  vendor_number: string;
  email: string | null;
  phone: string | null;
  category: string | null;
  status: "active" | "inactive";
  created_at: string;
};

const statusConfig: Record<
  "active" | "inactive",
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
};

const categoryConfig: Record<string, { label: string; className: string }> = {
  supplier: {
    label: "Supplier",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  distributor: {
    label: "Distributor",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  manufacturer: {
    label: "Manufacturer",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  },
  service_provider: {
    label: "Service Provider",
    className: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
  },
  other: {
    label: "Other",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
};

const columns: ColumnDef<Vendor>[] = [
  {
    key: "vendor_number",
    header: "Vendor #",
    width: "w-32",
    shrink: true,
    render: (vendor) => (
      <Link
        className="font-medium text-primary hover:underline"
        href={`/dashboard/inventory/vendors/${vendor.id}`}
      >
        {vendor.vendor_number}
      </Link>
    ),
  },
  {
    key: "name",
    header: "Name",
    width: "flex-1",
    render: (vendor) => (
      <div className="flex flex-col">
        <Link
          className="font-medium text-primary hover:underline"
          href={`/dashboard/inventory/vendors/${vendor.id}`}
        >
          {vendor.display_name || vendor.name}
        </Link>
        {vendor.category && (
          <Badge
            className={`mt-1 w-fit ${categoryConfig[vendor.category]?.className || categoryConfig.other.className}`}
            variant="outline"
          >
            {categoryConfig[vendor.category]?.label || vendor.category}
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    width: "w-64",
    shrink: true,
    hideOnMobile: true,
    render: (vendor) => (
      <div className="flex flex-col gap-1 text-sm">
        {vendor.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <a
              className="text-primary hover:underline"
              href={`mailto:${vendor.email}`}
              onClick={(e) => e.stopPropagation()}
            >
              {vendor.email}
            </a>
          </div>
        )}
        {vendor.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <a
              className="text-primary hover:underline"
              href={`tel:${vendor.phone}`}
              onClick={(e) => e.stopPropagation()}
            >
              {vendor.phone}
            </a>
          </div>
        )}
        {!vendor.email && !vendor.phone && (
          <span className="text-muted-foreground text-xs">No contact info</span>
        )}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "w-24",
    shrink: true,
    align: "center",
    render: (vendor) => {
      const config = statusConfig[vendor.status];
      return (
        <Badge className={config.className} variant="outline">
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    header: "",
    width: "w-12",
    shrink: true,
    align: "right",
    render: (vendor) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/inventory/vendors/${vendor.id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/inventory/vendors/${vendor.id}/edit`}>
              Edit Vendor
            </Link>
          </DropdownMenuItem>
          {vendor.email && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={`mailto:${vendor.email}`}>Send Email</a>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/work/purchase-orders?vendorId=${vendor.id}`}>
              View Purchase Orders
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const bulkActions: BulkAction[] = [
  {
    label: "Export Selected",
    icon: <Download className="size-4" />,
    onClick: (ids) => {
      console.log("Export vendors:", ids);
    },
  },
  {
    label: "Mark as Inactive",
    icon: <Pause className="size-4" />,
    onClick: (ids) => {
      console.log("Deactivate vendors:", ids);
    },
    variant: "ghost",
  },
];

export function VendorTable({
  vendors,
  itemsPerPage = 50,
}: {
  vendors: Vendor[];
  itemsPerPage?: number;
}) {
  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={vendors}
      emptyAction={
        <Button asChild>
          <Link href="/dashboard/inventory/vendors/new">
            <Building2 className="mr-2 size-4" />
            Add Vendor
          </Link>
        </Button>
      }
      emptyIcon={<Building2 className="h-12 w-12 text-muted-foreground" />}
      emptyMessage="No vendors found. Create your first vendor to get started."
      getItemId={(vendor) => vendor.id}
      itemsPerPage={itemsPerPage}
      onRowClick={(vendor) => {
        window.location.href = `/dashboard/inventory/vendors/${vendor.id}`;
      }}
      searchFilter={(vendor, query) => {
        const searchable = [
          vendor.name,
          vendor.display_name,
          vendor.vendor_number,
          vendor.email,
          vendor.phone,
          vendor.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(query);
      }}
      searchPlaceholder="Search vendors by name, number, email..."
    />
  );
}

