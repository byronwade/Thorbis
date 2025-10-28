/**
 * Work > Maintenance Plans Page - Client Component
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
interface MaintenancePlan extends Record<string, unknown> {
  id: string;
  planName: string;
  customer: string;
  serviceType: string;
  frequency: string;
  nextVisit: string;
  monthlyFee: string;
  status: string;
}

const mockPlans: MaintenancePlan[] = [
  {
    id: "1",
    planName: "HVAC Premium",
    customer: "Acme Corp",
    serviceType: "HVAC Maintenance",
    frequency: "Quarterly",
    nextVisit: "Feb 15, 2025",
    monthlyFee: "$199/mo",
    status: "active",
  },
  {
    id: "2",
    planName: "Electrical Plus",
    customer: "Tech Solutions",
    serviceType: "Electrical Inspection",
    frequency: "Monthly",
    nextVisit: "Feb 1, 2025",
    monthlyFee: "$149/mo",
    status: "active",
  },
  {
    id: "3",
    planName: "Plumbing Basic",
    customer: "Global Industries",
    serviceType: "Plumbing Check",
    frequency: "Bi-Annual",
    nextVisit: "Mar 10, 2025",
    monthlyFee: "$79/mo",
    status: "pending",
  },
  {
    id: "4",
    planName: "Fire Safety Pro",
    customer: "Summit LLC",
    serviceType: "Fire System Inspection",
    frequency: "Annual",
    nextVisit: "Apr 5, 2025",
    monthlyFee: "$249/mo",
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

export default function MaintenancePlansPage() {  const columns: DataTableColumn<MaintenancePlan>[] = [
    {
      key: "planName",
      header: "Plan Name",
      sortable: true,
      filterable: true,
      render: (plan) => <span className="font-medium">{plan.planName}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      filterable: true,
    },
    {
      key: "serviceType",
      header: "Service Type",
      sortable: true,
      filterable: true,
    },
    {
      key: "frequency",
      header: "Frequency",
      sortable: true,
      filterable: true,
    },
    {
      key: "nextVisit",
      header: "Next Visit",
      sortable: true,
    },
    {
      key: "monthlyFee",
      header: "Monthly Fee",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      render: (plan) => getStatusBadge(plan.status),
    },
  ];

  return (
    <WorkPageLayout
      actionHref="/dashboard/work/maintenance-plans/new"
      actionLabel="Create Plan"
      description="Manage recurring maintenance contracts and schedules"
      title="Maintenance Plans"
    >
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          label="Active Plans"
          subtext="+12 this month"
          trend="up"
          value="247"
        />
        <StatCard
          label="Enrolled Customers"
          subtext="76% of active customers"
          value="189"
        />
        <StatCard label="This Month" subtext="Scheduled visits" value="45" />
        <StatCard
          label="Monthly Revenue"
          subtext="Recurring revenue"
          trend="up"
          value="$28,450"
        />
      </div>

      <DataTable
        columns={
          columns as unknown as DataTableColumn<Record<string, unknown>>[]
        }
        data={mockPlans as unknown as Record<string, unknown>[]}
        emptyMessage="No maintenance plans found."
        itemsPerPage={10}
        keyField="id"
        searchPlaceholder="Search plans by name, customer, service type, or status..."
      />
    </WorkPageLayout>
  );
}
