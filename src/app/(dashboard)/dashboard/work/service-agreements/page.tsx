/**
 * Service Agreements Page - Seamless Datatable Layout
 */

/**
 * Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Only interactive table/chart components are client-side
 * - Better SEO and initial page load performance
 *
 * Note: Service agreements table (service_level_agreements) exists but structure may differ.
 * Page shows empty state until table structure is confirmed.
 */

import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type ServiceAgreement,
  ServiceAgreementsTable,
} from "@/components/work/service-agreements-table";
import { ServiceAgreementsKanban } from "@/components/work/service-agreements-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function ServiceAgreementsPage() {
  // Service agreements table (service_level_agreements) exists but structure may differ
  // For now, show empty state until table structure is confirmed
  const mockAgreements: ServiceAgreement[] = [];
  const totalAgreements = 0;
  const activeAgreements = 0;
  const pendingSignatures = 0;
  const totalValue = 0;
  const expiringSoon = 0;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <div className="flex items-center gap-2">
            <WorkViewSwitcher section="serviceAgreements" />
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
              <Link href="/dashboard/work/service-agreements/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">Create Agreement</span>
                <span className="sm-hidden">New</span>
              </Link>
            </Button>
          </div>
        }
        description="Manage customer service contracts and warranties"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Active Agreements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{activeAgreements}</div>
                <p className="text-muted-foreground text-xs">
                  {totalAgreements - activeAgreements} pending or expired
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Pending Signatures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{pendingSignatures}</div>
                <p className="text-muted-foreground text-xs">
                  Awaiting customer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{expiringSoon}</div>
                <p className="text-muted-foreground text-xs">Within 30 days</p>
              </CardContent>
            </Card>
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
                  Annual contract value
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Service Agreements"
      />

      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<ServiceAgreementsKanban agreements={mockAgreements} />}
          section="serviceAgreements"
          table={<ServiceAgreementsTable agreements={mockAgreements} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
