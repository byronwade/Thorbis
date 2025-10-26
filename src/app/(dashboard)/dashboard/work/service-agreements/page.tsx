"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";

interface ServiceAgreement extends Record<string, unknown> {
  id: string;
  agreementNumber: string;
  customer: string;
  type: string;
  startDate: string;
  endDate: string;
  value: string;
  status: string;
}

const mockAgreements: ServiceAgreement[] = [
  {
    id: "1",
    agreementNumber: "SLA-2025-001",
    customer: "Acme Corp",
    type: "Service Level Agreement",
    startDate: "Jan 1, 2025",
    endDate: "Dec 31, 2025",
    value: "$25,000",
    status: "active",
  },
  {
    id: "2",
    agreementNumber: "SLA-2025-002",
    customer: "Tech Solutions",
    type: "Extended Warranty",
    startDate: "Jan 5, 2025",
    endDate: "Jan 4, 2027",
    value: "$12,500",
    status: "active",
  },
  {
    id: "3",
    agreementNumber: "SLA-2025-003",
    customer: "Global Industries",
    type: "Maintenance Contract",
    startDate: "Feb 1, 2025",
    endDate: "Jan 31, 2026",
    value: "$18,750",
    status: "pending",
  },
  {
    id: "4",
    agreementNumber: "SLA-2025-004",
    customer: "Summit LLC",
    type: "Service Level Agreement",
    startDate: "Mar 1, 2025",
    endDate: "Feb 28, 2026",
    value: "$35,000",
    status: "active",
  },
];

function getStatusBadge(status: string) {
  return status === "active" ? <Badge>Active</Badge> : <Badge variant="secondary">Pending</Badge>;
}

export default function ServiceAgreementsPage() {
  usePageLayout({
    maxWidth: "7xl",
    paddingY: "lg",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const columns: DataTableColumn<ServiceAgreement>[] = [
    {
      key: "agreementNumber",
      header: "Agreement #",
      sortable: true,
      filterable: true,
      render: (agreement) => <span className="font-medium">{agreement.agreementNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
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
      key: "startDate",
      header: "Start Date",
      sortable: true,
    },
    {
      key: "endDate",
      header: "End Date",
      sortable: true,
    },
    {
      key: "value",
      header: "Value",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (agreement) => getStatusBadge(agreement.status),
    },
  ];

  return (
    <WorkPageLayout
      title="Service Agreements"
      description="Manage customer service contracts and warranties"
      actionLabel="Create Agreement"
      actionHref="/dashboard/work/service-agreements/new"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Active Agreements" value="156" subtext="+8 this month" trend="up" />
        <StatCard label="Pending Signatures" value="12" subtext="Awaiting customer" />
        <StatCard label="Expiring Soon" value="8" subtext="Within 30 days" trend="down" />
        <StatCard label="Total Value" value="$485,200" subtext="Annual contract value" trend="up" />
      </div>

      <DataTable
        data={mockAgreements}
        columns={columns}
        keyField="id"
        itemsPerPage={10}
        searchPlaceholder="Search agreements by number, customer, type, or status..."
        emptyMessage="No service agreements found."
      />
    </WorkPageLayout>
  );
}
