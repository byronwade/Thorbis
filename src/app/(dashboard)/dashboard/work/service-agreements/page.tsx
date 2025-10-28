/**
 * Work > Service Agreements Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { ArrowLeft, ShieldCheck, Ticket, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatCard } from "@/components/work/stat-card";
import { WorkPageLayout } from "@/components/work/work-page-layout";

export const revalidate = 300; // Revalidate every 5 minutes
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
  return status === "active" ? (
    <Badge>Active</Badge>
  ) : (
    <Badge variant="secondary">Pending</Badge>
  );
}

export default function ServiceAgreementsPage() {  const columns: DataTableColumn<ServiceAgreement>[] = [
    {
      key: "agreementNumber",
      header: "Agreement #",
      sortable: true,
      filterable: true,
      render: (agreement) => (
        <span className="font-medium">{agreement.agreementNumber}</span>
      ),
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
      actionHref="/dashboard/work/service-agreements/new"
      actionLabel="Create Agreement"
      description="Manage customer service contracts and warranties"
      title="Service Agreements"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Active Agreements"
          subtext="+8 this month"
          trend="up"
          value="156"
        />
        <StatCard
          label="Pending Signatures"
          subtext="Awaiting customer"
          value="12"
        />
        <StatCard
          label="Expiring Soon"
          subtext="Within 30 days"
          trend="down"
          value="8"
        />
        <StatCard
          label="Total Value"
          subtext="Annual contract value"
          trend="up"
          value="$485,200"
        />
      </div>

      <DataTable
        columns={columns}
        data={mockAgreements}
        emptyMessage="No service agreements found."
        itemsPerPage={10}
        keyField="id"
        searchPlaceholder="Search agreements by number, customer, type, or status..."
      />
    </WorkPageLayout>
  );
}
