import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Edit,
  FileSignature,
  MoreVertical,
  Send,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { WorkflowTimeline } from "@/components/ui/workflow-timeline";
import { ContractActions } from "@/components/work/contract-actions";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Contract Detail Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches contract data
 * - Client components only for interactive actions
 */

function getStatusBadge(status: string) {
  const config = {
    signed: {
      className: "bg-green-500 hover:bg-green-600 text-white",
      label: "Signed",
    },
    sent: {
      className: "bg-primary/10 text-primary",
      label: "Sent",
    },
    viewed: {
      className: "bg-accent/10 text-accent-foreground",
      label: "Viewed",
    },
    draft: {
      className: "bg-muted text-foreground",
      label: "Draft",
    },
    rejected: {
      className: "bg-destructive/10 text-destructive",
      label: "Rejected",
    },
    expired: {
      className: "bg-warning/10 text-warning",
      label: "Expired",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.draft;

  return (
    <Badge className={statusConfig.className} variant="outline">
      {statusConfig.label}
    </Badge>
  );
}

function formatDate(dateString: string | Date | null) {
  if (!dateString) return "N/A";
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string | Date | null) {
  if (!dateString) return "N/A";
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 16+
  const { id } = await params;

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

  // Check if active company has completed onboarding
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    redirect("/dashboard/welcome");
  }

  // Get active company ID
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    redirect("/dashboard/welcome");
  }

  // Fetch contract with all related data
  const { data: contractRaw, error: contractError } = await supabase
    .from("contracts")
    .select(`
      *,
      estimate:estimates!estimate_id(
        id,
        estimate_number,
        title,
        customer_id,
        customer:customers!customer_id(*)
      ),
      invoice:invoices!invoice_id(
        id,
        invoice_number,
        title,
        customer_id,
        customer:customers!customer_id(*)
      ),
      job:jobs!job_id(
        id,
        job_number,
        title,
        customer_id,
        customer:customers!customer_id(*)
      )
    `)
    .eq("id", id)
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .single();

  if (contractError || !contractRaw) {
    return notFound();
  }

  // Get customer from estimate, invoice, or job
  const estimate = Array.isArray(contractRaw.estimate)
    ? contractRaw.estimate[0]
    : contractRaw.estimate;
  const invoice = Array.isArray(contractRaw.invoice)
    ? contractRaw.invoice[0]
    : contractRaw.invoice;
  const job = Array.isArray(contractRaw.job)
    ? contractRaw.job[0]
    : contractRaw.job;

  const customer = estimate?.customer
    ? Array.isArray(estimate.customer)
      ? estimate.customer[0]
      : estimate.customer
    : invoice?.customer
      ? Array.isArray(invoice.customer)
        ? invoice.customer[0]
        : invoice.customer
      : job?.customer
        ? Array.isArray(job.customer)
          ? job.customer[0]
          : job.customer
        : null;

  const customerId =
    estimate?.customer_id || invoice?.customer_id || job?.customer_id;

  // NEW: Fetch property (via job) and appointments for contract context
  const [{ data: property }, { data: appointments }] = await Promise.all([
    // Fetch property via job
    job?.id
      ? supabase
          .from("jobs")
          .select("property_id, property:properties!property_id(*)")
          .eq("id", job.id)
          .single()
          .then((result) => ({
            data: result.data?.property
              ? Array.isArray(result.data.property)
                ? result.data.property[0]
                : result.data.property
              : null,
            error: result.error,
          }))
      : Promise.resolve({ data: null, error: null }),

    // Fetch appointments related to the job
    job?.id
      ? supabase
          .from("schedules")
          .select("id, scheduled_start, scheduled_end, status, type")
          .eq("job_id", job.id)
          .is("deleted_at", null)
          .order("scheduled_start", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [], error: null }),
  ]);

  // Transform contract data
  const contract = {
    id: contractRaw.id,
    contractNumber: contractRaw.contract_number,
    title: contractRaw.title,
    description: contractRaw.description,
    customer: customer
      ? customer.display_name ||
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
        "Unknown Customer"
      : contractRaw.signer_email || "Unknown",
    customerId: customerId || null,
    status: contractRaw.status,
    contractType: contractRaw.contract_type,
    signerName: contractRaw.signer_name,
    signerEmail: contractRaw.signer_email,
    signerTitle: contractRaw.signer_title,
    signerCompany: contractRaw.signer_company,
    signedAt: contractRaw.signed_at,
    sentAt: contractRaw.sent_at,
    viewedAt: contractRaw.viewed_at,
    createdAt: contractRaw.created_at,
    validFrom: contractRaw.valid_from,
    validUntil: contractRaw.expires_at || contractRaw.valid_until,
    ipAddress: contractRaw.signer_ip_address,
    content: contractRaw.content,
    terms: contractRaw.terms,
    notes: contractRaw.notes,
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work/contracts">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-2xl">{contract.title}</h1>
              {getStatusBadge(contract.status)}
            </div>
            <p className="text-muted-foreground text-sm">
              {contract.contractNumber} • {contract.customer}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Download className="mr-2 size-4" />
              Download PDF
            </Button>
            {contract.status === "draft" && (
              <Button size="sm">
                <Send className="mr-2 size-4" />
                Send for Signature
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 size-4" />
                  Edit Contract
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileSignature className="mr-2 size-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* NEW: Sales Workflow Timeline */}
              {(estimate || invoice) && (
                <WorkflowTimeline
                  stages={[
                    {
                      id: "estimate",
                      label: "Estimate Created",
                      status: estimate ? "completed" : "pending",
                      date: estimate?.created_at,
                      href: estimate?.id
                        ? `/dashboard/work/estimates/${estimate.id}`
                        : undefined,
                      description: estimate?.estimate_number
                        ? `#${estimate.estimate_number}`
                        : undefined,
                    },
                    {
                      id: "contract",
                      label: "Contract Generated",
                      status: "completed",
                      date: contractRaw.created_at,
                      href: `/dashboard/work/contracts/${contractRaw.id}`,
                      description:
                        contract.status === "signed"
                          ? "Signed"
                          : "Pending signature",
                    },
                    {
                      id: "invoice",
                      label: "Invoice Created",
                      status: invoice ? "completed" : "pending",
                      date: invoice?.created_at,
                      href: invoice?.id
                        ? `/dashboard/work/invoices/${invoice.id}`
                        : undefined,
                      description: invoice?.invoice_number
                        ? `#${invoice.invoice_number}`
                        : undefined,
                    },
                    {
                      id: "payment",
                      label: "Payment Received",
                      status:
                        invoice?.status === "paid"
                          ? "completed"
                          : invoice
                            ? "current"
                            : "pending",
                      date: invoice?.paid_at,
                      description: invoice?.paid_at
                        ? "Completed"
                        : invoice
                          ? `Balance: ${formatCurrency(invoice.balance_amount)}`
                          : undefined,
                    },
                  ]}
                />
              )}

              {/* Contract Body */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-lg border bg-muted/30 p-6">
                    {contract.content}
                  </div>
                </CardContent>
              </Card>

              {/* Signature Section */}
              {contract.status === "signed" && contract.signerName && (
                <Card>
                  <CardHeader>
                    <CardTitle>Signature</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 rounded-lg border bg-muted/30 p-4">
                      <div className="rounded-lg bg-background p-3">
                        <FileSignature className="size-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{contract.signerName}</p>
                        {contract.signerTitle && (
                          <p className="text-muted-foreground text-sm">
                            {contract.signerTitle}
                            {contract.signerCompany &&
                              ` at ${contract.signerCompany}`}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          Signed on {formatDateTime(contract.signedAt)}
                        </p>
                        {contract.ipAddress && (
                          <p className="text-muted-foreground text-xs">
                            IP: {contract.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Terms */}
              {contract.terms && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {contract.terms}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contract Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-medium text-sm capitalize">
                      {contract.contractType}
                    </p>
                  </div>

                  <Separator />

                  {contract.validFrom && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">
                        Valid From
                      </p>
                      <p className="font-medium text-sm">
                        {formatDate(contract.validFrom)}
                      </p>
                    </div>
                  )}

                  {contract.validUntil && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">
                        Valid Until
                      </p>
                      <p className="font-medium text-sm">
                        {formatDate(contract.validUntil)}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">
                      Created Date
                    </p>
                    <p className="font-medium text-sm">
                      {formatDate(contract.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  {contract.customerId ? (
                    <Button asChild className="w-full" variant="outline">
                      <Link
                        href={`/dashboard/customers/${contract.customerId}`}
                      >
                        <User className="mr-2 size-4" />
                        {contract.customer}
                      </Link>
                    </Button>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      {contract.customer}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NEW: Property Information */}
              {property && (
                <Card>
                  <CardHeader>
                    <CardTitle>Property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/dashboard/work/properties/${property.id}`}>
                        <Building2 className="mr-2 size-4" />
                        {property.name || property.address}
                      </Link>
                    </Button>
                    {property.city && property.state && (
                      <p className="mt-2 text-center text-muted-foreground text-sm">
                        {property.city}, {property.state}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* NEW: Related Appointments */}
              {appointments && appointments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {appointments.map((appt: any) => (
                        <Link
                          className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                          href={`/dashboard/appointments/${appt.id}`}
                          key={appt.id}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">
                                {new Date(
                                  appt.scheduled_start
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {new Date(
                                  appt.scheduled_start
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <Badge className="text-xs" variant="outline">
                              {appt.status}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Signer Information */}
              {contract.signerName && (
                <Card>
                  <CardHeader>
                    <CardTitle>Signer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Name</p>
                      <p className="font-medium text-sm">
                        {contract.signerName}
                      </p>
                    </div>

                    {contract.signerEmail && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p className="font-medium text-sm">
                          {contract.signerEmail}
                        </p>
                      </div>
                    )}

                    {contract.signerTitle && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Title</p>
                        <p className="font-medium text-sm">
                          {contract.signerTitle}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contract.signedAt && (
                      <div className="flex gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                          <FileSignature className="size-4 text-success dark:text-green-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Signed</p>
                          <p className="text-muted-foreground text-xs">
                            {formatDateTime(contract.signedAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {contract.viewedAt && (
                      <div className="flex gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent-foreground">
                          <FileSignature className="size-4 text-accent-foreground dark:text-purple-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Viewed</p>
                          <p className="text-muted-foreground text-xs">
                            {formatDateTime(contract.viewedAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {contract.sentAt && (
                      <div className="flex gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Send className="size-4 text-primary dark:text-blue-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Sent</p>
                          <p className="text-muted-foreground text-xs">
                            {formatDateTime(contract.sentAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Calendar className="size-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Created</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDateTime(contract.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Notes */}
              {contract.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {contract.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Component for Interactive Actions */}
      <ContractActions
        contractId={id}
        contractNumber={contract.contractNumber || id.slice(0, 8)}
        status={contract.status}
      />
    </div>
  );
}
