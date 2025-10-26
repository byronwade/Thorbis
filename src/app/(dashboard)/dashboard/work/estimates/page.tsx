"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";

interface Estimate {
  id: string;
  estimateNumber: string;
  customer: string;
  project: string;
  date: string;
  validUntil: string;
  amount: number;
  status: string;
}

const mockEstimates: Estimate[] = [
  {
    id: "1",
    estimateNumber: "EST-2025-045",
    customer: "Acme Corp",
    project: "HVAC Installation",
    date: "Jan 10, 2025",
    validUntil: "Feb 10, 2025",
    amount: 1250000,
    status: "accepted",
  },
  {
    id: "2",
    estimateNumber: "EST-2025-046",
    customer: "Tech Solutions",
    project: "Electrical Upgrade",
    date: "Jan 12, 2025",
    validUntil: "Feb 12, 2025",
    amount: 875000,
    status: "sent",
  },
  {
    id: "3",
    estimateNumber: "EST-2025-047",
    customer: "Global Industries",
    project: "Plumbing Repair",
    date: "Jan 15, 2025",
    validUntil: "Feb 15, 2025",
    amount: 320000,
    status: "draft",
  },
  {
    id: "4",
    estimateNumber: "EST-2025-048",
    customer: "Summit LLC",
    project: "Roof Replacement",
    date: "Jan 18, 2025",
    validUntil: "Feb 18, 2025",
    amount: 2500000,
    status: "sent",
  },
  {
    id: "5",
    estimateNumber: "EST-2025-049",
    customer: "Peak Industries",
    project: "Generator Installation",
    date: "Jan 20, 2025",
    validUntil: "Feb 20, 2025",
    amount: 450000,
    status: "declined",
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
    accepted: { variant: "default" },
    sent: { variant: "secondary" },
    draft: { variant: "outline" },
    declined: { variant: "destructive" },
  };

  const config = variants[status] || { variant: "outline" };

  return (
    <Badge variant={config.variant} className={status === "accepted" ? "bg-green-500 hover:bg-green-600" : ""}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function EstimatesPage() {
  usePageLayout({
    maxWidth: "7xl",
    paddingY: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const columns: DataTableColumn<Estimate>[] = [
    {
      key: "estimateNumber",
      header: "Estimate #",
      sortable: true,
      filterable: true,
      render: (estimate) => <span className="font-medium">{estimate.estimateNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      filterable: true,
    },
    {
      key: "project",
      header: "Project",
      sortable: true,
      filterable: true,
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "validUntil",
      header: "Valid Until",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (estimate) => <span className="font-medium">{formatCurrency(estimate.amount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (estimate) => getStatusBadge(estimate.status),
    },
  ];

  return (
    <WorkPageLayout
      title="Estimates"
      description="Create and manage project estimates and quotes"
      actionLabel="Create Estimate"
      actionHref="/dashboard/work/estimates/new"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Total Value" value="$125,890.00" subtext="All active estimates" />
        <StatCard label="Accepted" value="$78,450.00" subtext="62% conversion rate" trend="up" />
        <StatCard label="Pending" value="$35,440.00" subtext="15 estimates" />
        <StatCard label="Declined" value="$12,000.00" subtext="5 estimates" trend="down" />
      </div>

      <DataTable
        data={mockEstimates as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        keyField="id"
        itemsPerPage={10}
        searchPlaceholder="Search estimates by number, customer, project, or status..."
        emptyMessage="No estimates found."
      />
    </WorkPageLayout>
  );
}
