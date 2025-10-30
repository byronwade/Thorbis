import { Download, Package, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type Estimate,
  EstimatesTable,
} from "@/components/work/estimates-table";

/**
 * Estimates Page - Server Component
 *
 * Performance optimizations:
 * - Server Component calculates statistics before rendering (no loading flash)
 * - Mock data and calculations stay on server (will be replaced with real DB queries)
 * - Only EstimatesTable component is client-side for sorting/filtering/pagination
 * - Better SEO and initial page load performance
 *
 * Seamless datatable layout with inline statistics
 */

const mockEstimates: Estimate[] = [
  {
    id: "1",
    estimateNumber: "EST-2025-045",
    customer: "Acme Corp",
    project: "HVAC Installation",
    date: "Jan 10, 2025",
    validUntil: "Feb 10, 2025",
    amount: 1_250_000,
    status: "accepted",
  },
  {
    id: "2",
    estimateNumber: "EST-2025-046",
    customer: "Tech Solutions",
    project: "Electrical Upgrade",
    date: "Jan 12, 2025",
    validUntil: "Feb 12, 2025",
    amount: 875_000,
    status: "sent",
  },
  {
    id: "3",
    estimateNumber: "EST-2025-047",
    customer: "Global Industries",
    project: "Plumbing Repair",
    date: "Jan 15, 2025",
    validUntil: "Feb 15, 2025",
    amount: 320_000,
    status: "draft",
  },
  {
    id: "4",
    estimateNumber: "EST-2025-048",
    customer: "Summit LLC",
    project: "Roof Replacement",
    date: "Jan 18, 2025",
    validUntil: "Feb 18, 2025",
    amount: 2_500_000,
    status: "sent",
  },
  {
    id: "5",
    estimateNumber: "EST-2025-049",
    customer: "Peak Industries",
    project: "Generator Installation",
    date: "Jan 20, 2025",
    validUntil: "Feb 20, 2025",
    amount: 450_000,
    status: "declined",
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function EstimatesPage() {
  // Server-side calculations - no client-side computation needed
  // TODO: Replace with real database query and calculations
  // const estimates = await db.select().from(estimatesTable).where(...);

  const totalValue = mockEstimates.reduce((sum, est) => sum + est.amount, 0);
  const accepted = mockEstimates
    .filter((est) => est.status === "accepted")
    .reduce((sum, est) => sum + est.amount, 0);
  const pending = mockEstimates
    .filter((est) => est.status === "sent")
    .reduce((sum, est) => sum + est.amount, 0);
  const declined = mockEstimates
    .filter((est) => est.status === "declined")
    .reduce((sum, est) => sum + est.amount, 0);

  const pendingCount = mockEstimates.filter(
    (est) => est.status === "sent"
  ).length;
  const declinedCount = mockEstimates.filter(
    (est) => est.status === "declined"
  ).length;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/work/purchase-orders/new">
                <Package className="mr-2 size-4" />
                Create PO
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard/work/estimates/new">
                <Plus className="mr-2 size-4" />
                New Estimate
              </Link>
            </Button>
          </>
        }
        description="Create and manage project estimates and quotes"
        stats={
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {formatCurrency(totalValue)}
                </div>
                <p className="text-muted-foreground text-xs">
                  All active estimates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Accepted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {formatCurrency(accepted)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {Math.round((accepted / totalValue) * 100)}% conversion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {formatCurrency(pending)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {pendingCount} estimates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Declined</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {formatCurrency(declined)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {declinedCount} estimates
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Estimates"
      />

      {/* EstimatesTable - Client component handles interactive features */}
      <div className="flex-1 overflow-hidden">
        <EstimatesTable estimates={mockEstimates} itemsPerPage={50} />
      </div>
    </div>
  );
}
