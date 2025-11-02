/**
 * Maintenance Plans Page - Seamless Datatable Layout
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
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

// Mock data - replace with real data from database
const mockPlans: MaintenancePlan[] = [
  {
    id: "1",
    planName: "HVAC Premium",
    customer: "Acme Corp",
    serviceType: "HVAC Maintenance",
    frequency: "Quarterly",
    nextVisit: "Feb 15, 2025",
    monthlyFee: 19_900,
    status: "active",
  },
  {
    id: "2",
    planName: "Electrical Plus",
    customer: "Tech Solutions",
    serviceType: "Electrical Inspection",
    frequency: "Monthly",
    nextVisit: "Feb 1, 2025",
    monthlyFee: 14_900,
    status: "active",
  },
  {
    id: "3",
    planName: "Plumbing Basic",
    customer: "Global Industries",
    serviceType: "Plumbing Check",
    frequency: "Bi-Annual",
    nextVisit: "Mar 10, 2025",
    monthlyFee: 7900,
    status: "pending",
  },
  {
    id: "4",
    planName: "Fire Safety Pro",
    customer: "Summit LLC",
    serviceType: "Fire System Inspection",
    frequency: "Annual",
    nextVisit: "Apr 5, 2025",
    monthlyFee: 24_900,
    status: "active",
  },
  {
    id: "5",
    planName: "Comprehensive Care",
    customer: "Downtown Retail LLC",
    serviceType: "Multi-System Maintenance",
    frequency: "Monthly",
    nextVisit: "Feb 10, 2025",
    monthlyFee: 39_900,
    status: "active",
  },
  {
    id: "6",
    planName: "Seasonal Check",
    customer: "Medical Plaza Group",
    serviceType: "HVAC Seasonal Service",
    frequency: "Bi-Annual",
    nextVisit: "Mar 1, 2025",
    monthlyFee: 12_900,
    status: "active",
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function MaintenancePlansPage() {
  // Calculate stats from data
  const totalPlans = mockPlans.length;
  const activePlans = mockPlans.filter((p) => p.status === "active").length;
  const enrolledCustomers = 189; // Mock value
  const monthlyRevenue = mockPlans
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.monthlyFee, 0);

  // Count visits this month (mock calculation)
  const visitsThisMonth = 45; // Mock value

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
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
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </>
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
        <MaintenancePlansTable itemsPerPage={50} plans={mockPlans} />
      </div>
    </div>
  );
}
