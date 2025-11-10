import { Download, FileSignature, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import {
  type Contract,
  ContractsTable,
} from "@/components/work/contracts-table";
import { ContractsKanban } from "@/components/work/contracts-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Contracts Page - Server Component
 *
 * Performance optimizations:
 * - Server Component calculates statistics before rendering (no loading flash)
 * - Only ContractsTable component is client-side for sorting/filtering/pagination
 * - Better SEO and initial page load performance
 *
 * Seamless datatable layout with inline statistics
 */

export default async function ContractsPage() {
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

  // Fetch contracts from database
  const { data: contractsRaw, error } = await supabase
    .from("contracts")
    .select(
      `
      id,
      contract_number,
      title,
      status,
      contract_type,
      created_at,
      expires_at,
      signed_at,
      signer_name,
      signer_email,
      customers!customer_id(display_name, first_name, last_name)
    `
    )
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contracts:", error);
  }

  // Transform data for table component
  const contracts: Contract[] = (contractsRaw || []).map((contract: any) => {
    const customer = Array.isArray(contract.customers)
      ? contract.customers[0]
      : contract.customers;

    return {
      id: contract.id,
      contractNumber: contract.contract_number,
      customer:
        customer?.display_name ||
        `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
        contract.signer_email ||
        "Unknown",
      title: contract.title,
      date: new Date(contract.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      validUntil: contract.expires_at
        ? new Date(contract.expires_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      status: contract.status as
        | "signed"
        | "sent"
        | "draft"
        | "viewed"
        | "expired",
      contractType: contract.contract_type || "custom",
      signerName: contract.signer_name || null,
    };
  });

  // Calculate stats from data
  const totalContracts = contracts.length;
  const signed = contracts.filter((c) => c.status === "signed").length;
  const pending = contracts.filter(
    (c) => c.status === "sent" || c.status === "viewed"
  ).length;
  const draft = contracts.filter((c) => c.status === "draft").length;

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <div className="flex items-center gap-2">
            <WorkViewSwitcher section="contracts" />
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
          </div>
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

      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<ContractsKanban contracts={contracts} />}
          section="contracts"
          table={<ContractsTable contracts={contracts} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
