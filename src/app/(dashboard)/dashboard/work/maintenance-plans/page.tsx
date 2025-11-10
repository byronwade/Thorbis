/**
 * Maintenance Plans Page - Seamless Datatable Layout
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 *
 * Note: Service plans table exists but structure may differ from page requirements.
 * Page shows empty state until table structure is confirmed.
 */

import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type MaintenancePlan,
  MaintenancePlansTable,
} from "@/components/work/maintenance-plans-table";
import { MaintenancePlansKanban } from "@/components/work/maintenance-plans-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function MaintenancePlansPage() {
  // Service plans table exists but structure may differ from mock data
  // For now, show empty state until table structure is confirmed
  const mockPlans: MaintenancePlan[] = [];
  const totalPlans = 0;
  const activePlans = 0;
  const enrolledCustomers = 0;
  const monthlyRevenue = 0;
  const visitsThisMonth = 0;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <div className="flex items-center gap-2">
            <WorkViewSwitcher section="maintenancePlans" />
            <Button
              className="md:hidden"
              size="sm"
              title="Import"
              variant="outline"
            >
              <Upload className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Upload className="mr-2 size-4" />
              Import
            </Button>

            <Button
              className="md:hidden"
              size="sm"
              title="Export"
              variant="outline"
            >
              <Download className="size-4" />
            </Button>
            <Button
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Download className="mr-2 size-4" />
              Export
            </Button>

            <Button asChild size="sm">
              <Link href="/dashboard/work/maintenance-plans/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">Create Plan</span>
                <span className="sm-hidden">New</span>
              </Link>
            </Button>
          </div>
        }
        description="Manage recurring maintenance contracts and schedules"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Active Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{activePlans}</div>
                <p className="text-muted-foreground text-xs">
                  {totalPlans - activePlans} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Enrolled Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{enrolledCustomers}</div>
                <p className="text-muted-foreground text-xs">
                  76% of active customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{visitsThisMonth}</div>
                <p className="text-muted-foreground text-xs">
                  Scheduled visits
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {formatCurrency(monthlyRevenue)}
                </div>
                <p className="text-muted-foreground text-xs">
                  Recurring revenue
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Maintenance Plans"
      />

      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<MaintenancePlansKanban plans={mockPlans} />}
          section="maintenancePlans"
          table={<MaintenancePlansTable plans={mockPlans} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
