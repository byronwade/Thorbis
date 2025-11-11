import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContractForm } from "@/components/work/contract-form";
// import { getSupabaseClient } from "@/lib/db";

/**
 * New Contract Page - Server Component
 *
 * Performance optimizations:
 * - Server Component handles initial data fetching
 * - Form is client component for interactivity
 * - Pre-fetch customer list, templates, etc. on server
 */

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{
    estimateId?: string;
    invoiceId?: string;
    jobId?: string;
  }>;
}) {
  // Await searchParams in Next.js 16+
  const params = await searchParams;

  // TODO: Fetch related data from database to pre-fill form
  // const supabase = await getSupabaseClient();
  // if (params.estimateId) {
  //   const { data: estimate } = await supabase
  //     .from("estimates")
  //     .select("*")
  //     .eq("id", params.estimateId)
  //     .single();
  //   // Pre-fill signer email from estimate.customerId -> users.email
  // }
  // if (params.invoiceId) {
  //   const { data: invoice } = await supabase
  //     .from("invoices")
  //     .select("*")
  //     .eq("id", params.invoiceId)
  //     .single();
  //   // Pre-fill signer email from invoice.customerId -> users.email
  // }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work/contracts">
              <ArrowLeft className="mr-2 size-4" />
              Back to Contracts
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-2xl">Create New Contract</h1>
            <p className="text-muted-foreground text-sm">
              {params.estimateId && "Create a contract for this estimate"}
              {params.invoiceId && "Create a contract for this invoice"}
              {!(params.estimateId || params.invoiceId) &&
                "Create a contract for digital signature"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-6">
          <ContractForm
            estimateId={params.estimateId}
            invoiceId={params.invoiceId}
            jobId={params.jobId}
          />
        </div>
      </div>
    </div>
  );
}
