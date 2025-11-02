import { Download, FileSignature, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type Contract,
  ContractsTable,
} from "@/components/work/contracts-table";

/**
 * Contracts Page - Server Component
 *
 * Performance optimizations:
 * - Server Component calculates statistics before rendering (no loading flash)
 * - Mock data and calculations stay on server (will be replaced with real DB queries)
 * - Only ContractsTable component is client-side for sorting/filtering/pagination
 * - Better SEO and initial page load performance
 *
 * Seamless datatable layout with inline statistics
 */

const mockContracts: Contract[] = [
  {
    id: "1",
    contractNumber: "CNT-2025-001",
    customer: "Acme Corp",
    title: "HVAC Service Agreement",
    date: "Jan 10, 2025",
    validUntil: "Jan 10, 2026",
    status: "signed",
    contractType: "service",
    signerName: "John Smith",
  },
  {
    id: "2",
    contractNumber: "CNT-2025-002",
    customer: "Tech Solutions",
    title: "Maintenance Contract",
    date: "Jan 12, 2025",
    validUntil: "Jan 12, 2026",
    status: "sent",
    contractType: "maintenance",
    signerName: "Jane Doe",
  },
  {
    id: "3",
    contractNumber: "CNT-2025-003",
    customer: "Global Industries",
    title: "Emergency Service Contract",
    date: "Jan 15, 2025",
    validUntil: "Jan 15, 2026",
    status: "draft",
    contractType: "custom",
    signerName: null,
  },
  {
    id: "4",
    contractNumber: "CNT-2025-004",
    customer: "Summit LLC",
    title: "Annual Service Plan",
    date: "Jan 18, 2025",
    validUntil: "Jan 18, 2026",
    status: "viewed",
    contractType: "service",
    signerName: "Mike Johnson",
  },
  {
    id: "5",
    contractNumber: "CNT-2025-005",
    customer: "Peak Industries",
    title: "Equipment Warranty",
    date: "Jan 20, 2025",
    validUntil: "Jan 20, 2027",
    status: "expired",
    contractType: "custom",
    signerName: "Sarah Wilson",
  },
];

export default function ContractsPage() {
  // Server-side calculations - no client-side computation needed
  // TODO: Replace with real database query and calculations
  // const contracts = await db.select().from(contractsTable).where(...);

  const totalContracts = mockContracts.length;
  const signed = mockContracts.filter((c) => c.status === "signed").length;
  const pending = mockContracts.filter(
    (c) => c.status === "sent" || c.status === "viewed"
  ).length;
  const draft = mockContracts.filter((c) => c.status === "draft").length;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
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

            <Button
              asChild
              className="md:hidden"
              size="sm"
              title="Templates"
              variant="outline"
            >
              <Link href="/dashboard/work/contracts/templates">
                <FileSignature className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <Link href="/dashboard/work/contracts/templates">
                <FileSignature className="mr-2 size-4" />
                Templates
              </Link>
            </Button>

            <Button asChild size="sm">
              <Link href="/dashboard/work/contracts/new">
                <Plus className="mr-2 size-4" />
                <span className="hidden sm:inline">New Contract</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </>
        }
        description="Create and manage digital contracts for estimates, invoices, and standalone agreements"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalContracts}</div>
                <p className="text-muted-foreground text-xs">
                  All active contracts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Signed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{signed}</div>
                <p className="text-muted-foreground text-xs">
                  {Math.round((signed / totalContracts) * 100)}% completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Awaiting Signature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{pending}</div>
                <p className="text-muted-foreground text-xs">
                  {pending} contracts pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{draft}</div>
                <p className="text-muted-foreground text-xs">
                  {draft} contracts
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Contracts"
      />

      {/* ContractsTable - Client component handles interactive features */}
      <div className="flex-1 overflow-auto">
        <ContractsTable contracts={mockContracts} itemsPerPage={50} />
      </div>
    </div>
  );
}
