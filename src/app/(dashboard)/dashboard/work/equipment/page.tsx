"use client";

import { ArrowLeft, BookOpen, Box, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { usePageLayout } from "@/hooks/use-page-layout";

interface Equipment extends Record<string, unknown> {
  id: string;
  assetId: string;
  name: string;
  type: string;
  assignedTo: string;
  lastService: string;
  nextService: string;
  status: string;
}

const mockEquipment: Equipment[] = [
  {
    id: "1",
    assetId: "EQP-001",
    name: "2023 Ford F-150 (Truck #1)",
    type: "Vehicle",
    assignedTo: "John Smith",
    lastService: "Jan 5, 2025",
    nextService: "Apr 5, 2025",
    status: "available",
  },
  {
    id: "2",
    assetId: "EQP-002",
    name: "Pipe Threading Machine",
    type: "Tool",
    assignedTo: "Workshop",
    lastService: "Dec 15, 2024",
    nextService: "Mar 15, 2025",
    status: "available",
  },
  {
    id: "3",
    assetId: "EQP-003",
    name: "Ladder 32ft Extension",
    type: "Equipment",
    assignedTo: "Mike Johnson",
    lastService: "Jan 10, 2025",
    nextService: "—",
    status: "in-use",
  },
  {
    id: "4",
    assetId: "EQP-004",
    name: "Power Drill Set",
    type: "Tool",
    assignedTo: "Sarah Williams",
    lastService: "Jan 1, 2025",
    nextService: "—",
    status: "maintenance",
  },
];

function getStatusBadge(status: string) {
  if (status === "available") {
    return <Badge>Available</Badge>;
  }
  if (status === "in-use") {
    return <Badge variant="secondary">In Use</Badge>;
  }
  return <Badge variant="destructive">Maintenance</Badge>;
}

export default function EquipmentPage() {
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

  const columns: DataTableColumn<Equipment>[] = [
    {
      key: "assetId",
      header: "Asset ID",
      sortable: true,
      filterable: true,
      render: (equipment) => (
        <span className="font-medium">{equipment.assetId}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      filterable: true,
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      sortable: true,
      filterable: true,
    },
    {
      key: "lastService",
      header: "Last Service",
      sortable: true,
    },
    {
      key: "nextService",
      header: "Next Service",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (equipment) => getStatusBadge(equipment.status),
    },
  ];

  return (
    <WorkPageLayout
      actionHref="/dashboard/work/equipment/new"
      actionLabel="Add Equipment"
      description="Track company equipment, tools, and vehicles"
      title="Equipment & Tools"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Equipment" subtext="Company assets" value="87" />
        <StatCard
          label="Available"
          subtext="Ready for use"
          trend="up"
          value="72"
        />
        <StatCard label="In Maintenance" subtext="Under service" value="8" />
        <StatCard
          label="Needs Attention"
          subtext="Requires service"
          trend="down"
          value="7"
        />
      </div>

      <DataTable
        columns={columns}
        data={mockEquipment}
        emptyMessage="No equipment found."
        itemsPerPage={10}
        keyField="id"
        searchPlaceholder="Search equipment by asset ID, name, type, assigned to, or status..."
      />
    </WorkPageLayout>
  );
}
