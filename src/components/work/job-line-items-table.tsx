"use client";

/**
 * JobLineItemsTable Component - Client Component
 *
 * Client-side features:
 * - Renders line items with custom render functions in columns
 * - Handles DataTable component which requires client-side interactivity
 * - Extracted from Server Component to isolate client-side rendering
 */

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

interface LineItem extends Record<string, unknown> {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

type JobLineItemsTableProps = {
  lineItems: LineItem[];
  itemsPerPage?: number;
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function JobLineItemsTable({
  lineItems,
  itemsPerPage = 10,
}: JobLineItemsTableProps) {
  const columns: DataTableColumn<LineItem>[] = [
    {
      key: "description",
      header: "Description",
      sortable: true,
      filterable: true,
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
    },
    {
      key: "unitPrice",
      header: "Unit Price",
      sortable: true,
      render: (item) => (
        <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (item) => (
        <span className="font-medium">{formatCurrency(item.amount)}</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={lineItems}
      emptyMessage="No line items found."
      itemsPerPage={itemsPerPage}
      keyField="id"
      searchPlaceholder="Search line items..."
    />
  );
}
