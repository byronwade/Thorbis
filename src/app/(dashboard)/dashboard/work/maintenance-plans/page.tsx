"use client";

import { usePageLayout } from "@/hooks/use-page-layout";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Wrench, Users, Calendar, DollarSign } from "lucide-react";

interface MaintenancePlan {
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

export default function MaintenancePlansPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const columns: DataTableColumn<MaintenancePlan>[] = [
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
      title="Maintenance Plans"
      description="Manage recurring maintenance contracts and schedules"
      actionLabel="Create Plan"
      actionHref="/dashboard/work/maintenance-plans/new"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Plans</CardTitle>
            <Wrench className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">247</div>
            <p className="text-muted-foreground text-xs">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Enrolled Customers</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">189</div>
            <p className="text-muted-foreground text-xs">76% of active customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">This Month</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">45</div>
            <p className="text-muted-foreground text-xs">Scheduled visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Monthly Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$28,450</div>
            <p className="text-muted-foreground text-xs">Recurring revenue</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={mockPlans as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        keyField="id"
        itemsPerPage={10}
        searchPlaceholder="Search plans by name, customer, service type, or status..."
        emptyMessage="No maintenance plans found."
      />
    </WorkPageLayout>
  );
}
