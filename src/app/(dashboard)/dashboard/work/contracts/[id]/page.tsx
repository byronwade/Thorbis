import {
  ArrowLeft,
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
import { ContractActions } from "@/components/work/contract-actions";

/**
 * Contract Detail Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches contract data
 * - Client components only for interactive actions
 */

// Mock data - will be replaced with database query
const mockContract = {
  id: "1",
  contractNumber: "CNT-2025-001",
  title: "HVAC Service Agreement",
  description: "Annual service and maintenance agreement for HVAC systems",
  customer: "Acme Corp",
  customerId: "1",
  status: "signed",
  contractType: "service",
  signerName: "John Smith",
  signerEmail: "john@acmecorp.com",
  signerTitle: "Facilities Manager",
  signerCompany: "Acme Corp",
  signedAt: "2025-01-10T14:30:00Z",
  sentAt: "2025-01-08T10:00:00Z",
  viewedAt: "2025-01-09T15:20:00Z",
  createdAt: "2025-01-05T09:00:00Z",
  validFrom: "2025-01-01",
  validUntil: "2026-01-01",
  ipAddress: "192.168.1.1",
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
  notes: "Customer requested quarterly reminders for scheduled maintenance.",
};

function getStatusBadge(status: string) {
  const config = {
    signed: {
      className: "bg-green-500 hover:bg-green-600 text-white",
      label: "Signed",
    },
    sent: {
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      label: "Sent",
    },
    viewed: {
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      label: "Viewed",
    },
    draft: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Draft",
    },
    rejected: {
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      label: "Rejected",
    },
    expired: {
      className:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 16+
  const { id } = await params;

  // TODO: Fetch from database
  // const contract = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
  // if (!contract[0]) notFound();

  const contract = mockContract;

  return (
    <div className="flex h-full flex-col">
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
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl space-y-6 p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
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

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Valid From</p>
                    <p className="font-medium text-sm">
                      {formatDate(contract.validFrom)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Valid Until</p>
                    <p className="font-medium text-sm">
                      {formatDate(contract.validUntil)}
                    </p>
                  </div>

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
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/dashboard/customers/${contract.customerId}`}>
                      <User className="mr-2 size-4" />
                      {contract.customer}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

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
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <FileSignature className="size-4 text-green-600 dark:text-green-400" />
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
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <FileSignature className="size-4 text-purple-600 dark:text-purple-400" />
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
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <Send className="size-4 text-blue-600 dark:text-blue-400" />
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
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/20">
                        <Calendar className="size-4 text-gray-600 dark:text-gray-400" />
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
      <ContractActions contractId={id} status={contract.status} />
    </div>
  );
}
