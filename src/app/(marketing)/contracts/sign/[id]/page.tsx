import { CheckCircle2, Clock, FileSignature, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContractSigningForm } from "@/components/work/contract-signing-form";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

// import { getSupabaseClient } from "@/lib/db";

/**
 * Public Contract Signing Page - Server Component
 *
 * This is a public-facing page where customers can view and sign contracts.
 * The URL can be shared via email or SMS.
 *
 * Features:
 * - No authentication required
 * - Clean, customer-friendly interface
 * - Digital signature capture
 * - Legal compliance information
 */

// Mock data - will be replaced with database query
const mockContract = {
  id: "1",
  contractNumber: "CNT-2025-001",
  title: "HVAC Service Agreement",
  description: "Annual service and maintenance agreement",
  companyName: "Thorbis Service Company",
  companyLogo: null,
  status: "sent",
  content: `This Service Agreement is entered into on January 1, 2025 between Thorbis Service Company and Acme Corp.

SERVICES TO BE PROVIDED:

1. Quarterly HVAC system inspections and maintenance
2. Priority emergency service response
3. Filter replacements and cleaning
4. System performance optimization
5. Annual efficiency reports

PAYMENT TERMS:

- Annual fee: $2,400 (payable quarterly at $600)
- Emergency service calls included (2 per year)
- Additional service calls billed at standard rates

DURATION:

- This agreement is valid from January 1, 2025 to December 31, 2025
- Automatically renews unless cancelled 30 days before end date

TERMINATION:

- Either party may terminate with 30 days written notice
- Full refund for unused quarters if cancelled by provider
- Pro-rated refund if cancelled by customer

By signing below, both parties agree to these terms and conditions.`,
  terms: "Standard terms and conditions apply as per company policy.",
  validFrom: "2025-01-01",
  validUntil: "2026-01-01",
  signerEmail: "john@acmecorp.com",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return generateSEOMetadata({
    title: "Contract Signing",
    section: "Customer Portal",
    description:
      "Review and sign your Thorbis service agreement securely with digital signatures and automated compliance tracking.",
    path: `/contracts/sign/${id}`,
    imageAlt: "Thorbis contract signing interface",
    keywords: ["contract signing", "digital signature", "thorbis"],
    noindex: true,
    nofollow: true,
  });
}

export default async function ContractSignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 16+
  const { id } = await params;

  // TODO: Fetch from database and verify contract is signable
  // const supabase = await getSupabaseClient();
  // const { data: contract, error } = await supabase
  //   .from("contracts")
  //   .select("*")
  //   .eq("id", id)
  //   .single();
  // if (error || !contract || contract.status === "signed") notFound();

  const contract = mockContract;

  // If contract is already signed, show success message
  if (contract.status === "signed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <Card className="border-success bg-success/50 dark:border-success/50 dark:bg-success/20">
            <CardContent className="flex flex-col items-center py-12">
              <div className="rounded-full bg-success p-4 dark:bg-success/30">
                <CheckCircle2 className="size-12 text-success dark:text-success" />
              </div>
              <h1 className="mt-6 font-bold text-2xl text-success dark:text-success">
                Contract Already Signed
              </h1>
              <p className="mt-2 text-center text-success dark:text-success">
                This contract has already been signed. Thank you!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          {contract.companyLogo ? (
            <img
              alt={contract.companyName}
              className="mx-auto mb-4 h-16"
              src={contract.companyLogo}
            />
          ) : (
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <FileSignature className="size-8 text-primary" />
            </div>
          )}
          <h1 className="font-bold text-3xl">{contract.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {contract.companyName} • {contract.contractNumber}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-muted">
            <CardContent className="flex items-center gap-3 py-4">
              <Shield className="size-5 text-success dark:text-success" />
              <div>
                <p className="font-medium text-sm">Secure & Encrypted</p>
                <p className="text-muted-foreground text-xs">SSL protected</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-muted">
            <CardContent className="flex items-center gap-3 py-4">
              <Clock className="size-5 text-primary dark:text-primary" />
              <div>
                <p className="font-medium text-sm">Quick Signing</p>
                <p className="text-muted-foreground text-xs">Takes 2 minutes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-muted">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle2 className="size-5 text-accent-foreground dark:text-accent-foreground" />
              <div>
                <p className="font-medium text-sm">Legally Binding</p>
                <p className="text-muted-foreground text-xs">
                  E-signature law compliant
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contract Terms</CardTitle>
            <CardDescription>
              Please review the terms carefully before signing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Valid From:</span>
                <span>{formatDate(contract.validFrom)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Valid Until:</span>
                <span>{formatDate(contract.validUntil)}</span>
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-lg border bg-muted/30 p-6">
              {contract.content}
            </div>

            {contract.terms && (
              <div className="mt-6">
                <h4 className="mb-2 font-semibold text-sm">Additional Terms</h4>
                <p className="text-muted-foreground text-sm">
                  {contract.terms}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signing Form */}
        <ContractSigningForm
          contractId={contract.id}
          defaultEmail={contract.signerEmail}
        />

        {/* Legal Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-xs">
            By signing this contract, you agree to be legally bound by its
            terms. Your signature, along with your IP address and timestamp,
            will be recorded for legal compliance. This document is protected by
            electronic signature laws.
          </p>
        </div>
      </div>
    </div>
  );
}
