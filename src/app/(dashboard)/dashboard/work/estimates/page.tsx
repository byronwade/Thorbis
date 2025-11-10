import { Download, Package, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type Estimate,
  EstimatesTable,
} from "@/components/work/estimates-table";
import { EstimatesKanban } from "@/components/work/estimates-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Estimates Page - Server Component
 *
 * Performance optimizations:
 * - Server Component calculates statistics before rendering (no loading flash)
 * - Only EstimatesTable component is client-side for sorting/filtering/pagination
 * - Better SEO and initial page load performance
 *
 * Seamless datatable layout with inline statistics
 */

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function EstimatesPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Fetch estimates from database
  const { data: estimatesRaw, error } = await supabase
    .from("estimates")
    .select(
      `
      id,
      estimate_number,
      title,
      status,
      total_amount,
      created_at,
      valid_until,
      customers!customer_id(display_name, first_name, last_name)
    `
    )
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching estimates:", error);
  }

  // Transform data for table component
  const estimates: Estimate[] = (estimatesRaw || []).map((est: any) => {
    const customer = Array.isArray(est.customers)
      ? est.customers[0]
      : est.customers;

    return {
      id: est.id,
      estimateNumber: est.estimate_number,
      customer:
        customer?.display_name ||
        `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
        "Unknown Customer",
      project: est.title,
      date: new Date(est.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      validUntil: est.valid_until
        ? new Date(est.valid_until).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      amount: est.total_amount || 0,
      status: est.status as "accepted" | "sent" | "draft" | "declined",
    };
  });

  // Calculate stats from data
  const totalValue = estimates.reduce((sum, est) => sum + est.amount, 0);
  const accepted = estimates
    .filter((est) => est.status === "accepted")
    .reduce((sum, est) => sum + est.amount, 0);
  const pending = estimates
    .filter((est) => est.status === "sent")
    .reduce((sum, est) => sum + est.amount, 0);
  const declined = estimates
    .filter((est) => est.status === "declined")
    .reduce((sum, est) => sum + est.amount, 0);

  const pendingCount = estimates.filter((est) => est.status === "sent").length;
  const declinedCount = estimates.filter((est) => est.status === "declined")
    .length;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <div className="flex items-center gap-2">
            <WorkViewSwitcher section="estimates" />
            <Button
              asChild
              className="md:hidden"
              size="sm"
              title="Create PO"
              variant="outline"
            >
              <Link href="/dashboard/work/purchase-orders/new">
                <Package className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Link href="/dashboard/work/purchase-orders/new">
                <Package className="mr-2 size-4" />
                Create PO
              </Link>
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
              <Link href="/dashboard/work/estimates/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">New Estimate</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        }
        description="Create and manage project estimates and quotes"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<EstimatesKanban estimates={estimates} />}
          section="estimates"
          table={<EstimatesTable estimates={estimates} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
