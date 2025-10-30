/**
 * Service Agreements Page - Seamless Datatable Layout
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
  type ServiceAgreement,
  ServiceAgreementsTable,
} from "@/components/work/service-agreements-table";

// Mock data - replace with real data from database
const mockAgreements: ServiceAgreement[] = [
  {
    id: "1",
    agreementNumber: "SLA-2025-001",
    customer: "Acme Corp",
    type: "Service Level Agreement",
    startDate: "Jan 1, 2025",
    endDate: "Dec 31, 2025",
    value: 2_500_000,
    status: "active",
  },
  {
    id: "2",
    agreementNumber: "SLA-2025-002",
    customer: "Tech Solutions",
    type: "Extended Warranty",
    startDate: "Jan 5, 2025",
    endDate: "Jan 4, 2027",
    value: 1_250_000,
    status: "active",
  },
  {
    id: "3",
    agreementNumber: "SLA-2025-003",
    customer: "Global Industries",
    type: "Maintenance Contract",
    startDate: "Feb 1, 2025",
    endDate: "Jan 31, 2026",
    value: 1_875_000,
    status: "pending",
  },
  {
    id: "4",
    agreementNumber: "SLA-2025-004",
    customer: "Summit LLC",
    type: "Service Level Agreement",
    startDate: "Mar 1, 2025",
    endDate: "Feb 28, 2026",
    value: 3_500_000,
    status: "active",
  },
  {
    id: "5",
    agreementNumber: "SLA-2025-005",
    customer: "Downtown Retail LLC",
    type: "Support Contract",
    startDate: "Jan 15, 2025",
    endDate: "Jan 14, 2026",
    value: 950_000,
    status: "active",
  },
];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function ServiceAgreementsPage() {
  // Calculate stats from data
  const totalAgreements = mockAgreements.length;
  const activeAgreements = mockAgreements.filter(
    (a) => a.status === "active"
  ).length;
  const pendingSignatures = mockAgreements.filter(
    (a) => a.status === "pending"
  ).length;
  const totalValue = mockAgreements
    .filter((a) => a.status === "active")
    .reduce((sum, a) => sum + a.value, 0);

  // Mock values
  const expiringSoon = 8; // Agreements expiring in next 30 days

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
            <Button size="sm" variant="outline">
              <Upload className="mr-2 size-4" />
              Import
            </Button>
            <Button size="sm" variant="outline">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard/work/service-agreements/new">
                <Plus className="mr-2 size-4" />
                Create Agreement
              </Link>
            </Button>
          </>
        }
        description="Manage customer service contracts and warranties"
        stats={
          <div className="mt-4 grid gap-3 md:grid-cols-4">
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

      <div className="flex-1 overflow-hidden">
        <ServiceAgreementsTable agreements={mockAgreements} itemsPerPage={50} />
      </div>
    </div>
  );
}
