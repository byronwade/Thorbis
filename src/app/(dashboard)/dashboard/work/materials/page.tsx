"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";

interface Material extends Record<string, unknown> {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  quantity: string;
  unitCost: string;
  totalValue: string;
  status: string;
}

const mockMaterials: Material[] = [
  {
    id: "1",
    itemCode: "MAT-001",
    description: "Copper Pipe 3/4\"",
    category: "Plumbing",
    quantity: "250 ft",
    unitCost: "$2.50/ft",
    totalValue: "$625.00",
    status: "in-stock",
  },
  {
    id: "2",
    itemCode: "MAT-002",
    description: "Circuit Breaker 20A",
    category: "Electrical",
    quantity: "45 units",
    unitCost: "$12.50",
    totalValue: "$562.50",
    status: "in-stock",
  },
  {
    id: "3",
    itemCode: "MAT-003",
    description: "HVAC Filter 20x25x1",
    category: "HVAC",
    quantity: "8 units",
    unitCost: "$15.00",
    totalValue: "$120.00",
    status: "low-stock",
  },
  {
    id: "4",
    itemCode: "MAT-004",
    description: "PVC Pipe 2\"",
    category: "Plumbing",
    quantity: "0 ft",
    unitCost: "$1.75/ft",
    totalValue: "$0.00",
    status: "out-of-stock",
  },
];

function getStatusBadge(status: string) {
  if (status === "in-stock") return <Badge>In Stock</Badge>;
  if (status === "low-stock") return <Badge variant="destructive">Low Stock</Badge>;
  return <Badge variant="outline">Out of Stock</Badge>;
}

export default function MaterialsPage() {
  usePageLayout({
    maxWidth: "7xl",
    paddingY: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const columns: DataTableColumn<Material>[] = [
    {
      key: "itemCode",
      header: "Item Code",
      sortable: true,
      filterable: true,
      render: (material) => <span className="font-medium">{material.itemCode}</span>,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
      filterable: true,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      filterable: true,
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
    },
    {
      key: "unitCost",
      header: "Unit Cost",
      sortable: true,
    },
    {
      key: "totalValue",
      header: "Total Value",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (material) => getStatusBadge(material.status),
    },
  ];

  return (
    <WorkPageLayout
      title="Materials Inventory"
      description="Track and manage company materials, parts, and supplies"
      actionLabel="Add Material"
      actionHref="/dashboard/work/materials/new"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Items" value="1,284" subtext="Across all categories" />
        <StatCard label="In Stock" value="1,156" subtext="90% availability" trend="up" />
        <StatCard label="Low Stock" value="45" subtext="Needs reorder" trend="down" />
        <StatCard label="Inventory Value" value="$145,890" subtext="Current stock value" />
      </div>

      <DataTable
        data={mockMaterials}
        columns={columns}
        keyField="id"
        itemsPerPage={10}
        searchPlaceholder="Search materials by code, description, category, or status..."
        emptyMessage="No materials found."
      />
    </WorkPageLayout>
  );
}
