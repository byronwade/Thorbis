"use client";

import { ArrowLeft, BookOpen, Box, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { usePageLayout } from "@/hooks/use-page-layout";

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
    description: 'Copper Pipe 3/4"',
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
    description: 'PVC Pipe 2"',
    category: "Plumbing",
    quantity: "0 ft",
    unitCost: "$1.75/ft",
    totalValue: "$0.00",
    status: "out-of-stock",
  },
];

function getStatusBadge(status: string) {
  if (status === "in-stock") {
    return <Badge>In Stock</Badge>;
  }
  if (status === "low-stock") {
    return <Badge variant="destructive">Low Stock</Badge>;
  }
  return <Badge variant="outline">Out of Stock</Badge>;
}

export default function MaterialsPage() {
  usePageLayout({
    maxWidth: "7xl",
    paddingY: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
    sidebar: {
      groups: [
        {
          label: undefined,
          items: [
            {
              mode: "link" as const,
              title: "Back to Work",
              url: "/dashboard/work",
              icon: ArrowLeft,
            },
          ],
        },
        {
          label: "Company Resources",
          items: [
            {
              mode: "link" as const,
              title: "Price Book",
              url: "/dashboard/work/pricebook",
              icon: BookOpen,
            },
            {
              mode: "link" as const,
              title: "Materials Inventory",
              url: "/dashboard/work/materials",
              icon: Box,
            },
            {
              mode: "link" as const,
              title: "Equipment & Tools",
              url: "/dashboard/work/equipment",
              icon: Package,
            },
          ],
        },
      ],
    },
  });

  const columns: DataTableColumn<Material>[] = [
    {
      key: "itemCode",
      header: "Item Code",
      sortable: true,
      filterable: true,
      render: (material) => (
        <span className="font-medium">{material.itemCode}</span>
      ),
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
      actionHref="/dashboard/work/materials/new"
      actionLabel="Add Material"
      description="Track and manage company materials, parts, and supplies"
      title="Materials Inventory"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Total Items"
          subtext="Across all categories"
          value="1,284"
        />
        <StatCard
          label="In Stock"
          subtext="90% availability"
          trend="up"
          value="1,156"
        />
        <StatCard
          label="Low Stock"
          subtext="Needs reorder"
          trend="down"
          value="45"
        />
        <StatCard
          label="Inventory Value"
          subtext="Current stock value"
          value="$145,890"
        />
      </div>

      <DataTable
        columns={columns}
        data={mockMaterials}
        emptyMessage="No materials found."
        itemsPerPage={10}
        keyField="id"
        searchPlaceholder="Search materials by code, description, category, or status..."
      />
    </WorkPageLayout>
  );
}
