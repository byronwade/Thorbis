/**
 * Invoice Page Content
 *
 * Comprehensive invoice details with collapsible sections
 * Matches appointment, estimate, and job detail page patterns
 *
 * Sections:
 * - Invoice Information (number, title, dates, status)
 * - Parties (company and customer info)
 * - Line Items (invoice line items table)
 * - Totals (subtotal, tax, discount, total)
 * - Terms & Notes (payment terms and notes)
 * - Payment Management (payment methods and quick pay)
 * - Progress Payments (payment history)
 * - Activity Log (invoice history)
 * - Notes (invoice notes)
 * - Attachments (invoice attachments)
 * - Related Items (linked job, customer)
 */

"use client";

import {
  Archive,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  Link2Off,
  MessageSquare,
  Receipt,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { archiveInvoice, unlinkJobFromInvoice } from "@/actions/invoices";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UnifiedAccordionContent,
  type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { WorkflowTimeline } from "@/components/ui/workflow-timeline";
import { InvoiceHeader } from "./invoice-header";
import { InvoiceLineItems } from "./invoice-line-items";
import { InvoiceOverdueBanner } from "./invoice-overdue-banner";
import { InvoiceParties } from "./invoice-parties";
import { InvoicePaymentManagement } from "./invoice-payment-management";
import { InvoicePayments } from "./invoice-payments";
import { InvoiceProgressPayments } from "./invoice-progress-payments";
import { InvoiceTerms } from "./invoice-terms";
import { InvoiceTotals } from "./invoice-totals";

export type InvoiceData = {
  invoice: any;
  customer?: any;
  company?: any;
  job?: any;
  property?: any;
  estimate?: any; // NEW: for workflow timeline
  contract?: any; // NEW: for workflow timeline
  paymentMethods?: any[];
  invoicePayments?: any[];
  notes?: any[];
  activities?: any[];
  attachments?: any[];
  communications?: any[];
};

export type InvoicePageContentProps = {
  entityData: InvoiceData;
  metrics?: any;
};

function formatCurrency(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function InvoicePageContent({ entityData }: InvoicePageContentProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [invoice, setInvoice] = useState(entityData.invoice);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [unlinkJobId, setUnlinkJobId] = useState<string | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const {
    invoice: initialInvoice,
    customer,
    company,
    job,
    property,
    estimate, // NEW: for workflow timeline
    contract, // NEW: for workflow timeline
    paymentMethods = [],
    invoicePayments = [],
    notes = [],
    activities = [],
    attachments = [],
    communications = [],
  } = entityData;

  // Update invoice field
  const updateField = useCallback((field: string, value: any) => {
    setInvoice((prev: any) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  // Quick payment handler
  const handleQuickPayment = useCallback(() => {
    setShowQuickPayment(true);
    // Scroll to payment section
    setTimeout(() => {
      const paymentSection = document.getElementById("payment-management");
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, []);

  const handleArchiveInvoice = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveInvoice(invoice.id);
      if (result.success) {
        toast.success("Invoice archived successfully");
        setIsArchiveDialogOpen(false);
        // Redirect to invoices list
        window.location.href = "/dashboard/work/invoices";
      } else {
        toast.error(result.error || "Failed to archive invoice");
      }
    } catch (error) {
      toast.error("Failed to archive invoice");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnlinkJob = async () => {
    if (!unlinkJobId) return;

    setIsUnlinking(true);
    try {
      const result = await unlinkJobFromInvoice(invoice.id);

      if (result.success) {
        toast.success("Job unlinked from invoice");
        setUnlinkJobId(null);
        // Refresh to show updated data
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to unlink job");
      }
    } catch (error) {
      toast.error("Failed to unlink job");
    } finally {
      setIsUnlinking(false);
    }
  };

  const statusBadgeVariant =
    invoice.status === "paid"
      ? "default"
      : invoice.status === "overdue"
        ? "destructive"
        : invoice.status === "partial"
          ? "secondary"
          : "outline";

  const headerBadges = [
    <Badge key="id" variant="outline">
      {invoice.invoice_number || `INV-${invoice.id.slice(0, 8).toUpperCase()}`}
    </Badge>,
    <Badge key="status" variant={statusBadgeVariant}>
      {invoice.status || "draft"}
    </Badge>,
  ];

  const customHeader = (
    <div className="w-full px-2 sm:px-0">
      <div className="mx-auto max-w-7xl rounded-md bg-muted/50 shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {headerBadges}
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-2xl sm:text-3xl">
                  {invoice.title || `Invoice ${invoice.invoice_number || ""}`}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {invoice.created_at
                    ? new Date(invoice.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No date"}
                </p>
              </div>
            </div>
          </div>

          {customer && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
                href={`/dashboard/customers/${customer.id}`}
              >
                <User className="size-4" />
                {customer.display_name ||
                  `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
                  "Unknown Customer"}
              </Link>

              {customer.email && (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
                  href={`mailto:${customer.email}`}
                >
                  <FileText className="size-4" />
                  {customer.email}
                </a>
              )}

              {/* Archive Button */}
              <Button
                className="ml-auto"
                disabled={invoice.status === "paid"}
                onClick={() => setIsArchiveDialogOpen(true)}
                size="sm"
                variant="outline"
              >
                <Archive className="mr-2 size-4" />
                Archive
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              <DollarSign className="size-4 text-muted-foreground" />
              <span className="font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format((invoice.total_amount || 0) / 100)}
              </span>
            </div>

            {invoice.balance_amount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <Receipt className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format((invoice.balance_amount || 0) / 100)}{" "}
                  due
                </span>
              </div>
            )}

            {job && (
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80"
                href={`/dashboard/work/${job.id}`}
              >
                <Wrench className="size-4 text-muted-foreground" />
                <span className="font-medium">Job #{job.job_number}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoiceCommunicationEntries = (items: any[]) => (
    <div className="space-y-3">
      {items.slice(0, 25).map((communication: any) => {
        const contactName =
          communication.customer?.first_name ||
          communication.customer?.last_name
            ? `${communication.customer?.first_name ?? ""} ${communication.customer?.last_name ?? ""}`.trim()
            : communication.direction === "inbound"
              ? communication.from_address
              : communication.to_address;
        const preview =
          communication.subject ||
          communication.body?.slice(0, 160) ||
          "No additional details";
        const timestamp = new Date(communication.created_at).toLocaleString();

        return (
          <div className="rounded-lg border p-3" key={communication.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {communication.type?.toUpperCase()}
              </Badge>
              <Badge
                variant={
                  communication.direction === "inbound"
                    ? "secondary"
                    : "default"
                }
              >
                {communication.direction === "inbound" ? "Inbound" : "Outbound"}
              </Badge>
              {communication.status && (
                <Badge variant="outline">{communication.status}</Badge>
              )}
              <span className="text-muted-foreground text-xs">{timestamp}</span>
            </div>
            <div className="mt-2">
              <p className="font-medium text-sm">{contactName || "Contact"}</p>
              <p className="text-muted-foreground text-sm">{preview}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [];

    // Overdue Banner (before content)
    const overdueBanner =
      invoice.balance_amount > 0 && invoice.due_date ? (
        <InvoiceOverdueBanner
          balanceAmount={invoice.balance_amount}
          dueDate={invoice.due_date}
          onQuickPay={handleQuickPayment}
        />
      ) : null;

    // NEW: Sales Workflow Timeline Section
    // Only show if there's an estimate or contract to display progression
    if (estimate || contract) {
      const workflowStages = [
        {
          id: "estimate",
          label: "Estimate Created",
          status: estimate ? ("completed" as const) : ("pending" as const),
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
          status: contract ? ("completed" as const) : ("pending" as const),
          date: contract?.created_at,
          href: contract?.id
            ? `/dashboard/work/contracts/${contract.id}`
            : undefined,
          description:
            contract?.status === "signed"
              ? "Signed"
              : contract
                ? "Pending signature"
                : undefined,
        },
        {
          id: "invoice",
          label: "Invoice Created",
          status: "completed" as const,
          date: invoice.created_at,
          href: `/dashboard/work/invoices/${invoice.id}`,
          description: `#${invoice.invoice_number || invoice.id.slice(0, 8)}`,
        },
        {
          id: "payment",
          label: "Payment Received",
          status:
            invoice.status === "paid"
              ? ("completed" as const)
              : invoice.paid_amount > 0
                ? ("current" as const)
                : ("pending" as const),
          date: invoice.paid_at,
          description:
            invoice.status === "paid"
              ? "Paid in full"
              : invoice.paid_amount > 0
                ? `Paid: ${formatCurrency(invoice.paid_amount)}`
                : `Balance: ${formatCurrency(invoice.balance_amount)}`,
        },
      ];

      sections.push({
        id: "workflow-timeline",
        title: "Sales Workflow",
        icon: <TrendingUp className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <WorkflowTimeline stages={workflowStages} />
          </UnifiedAccordionContent>
        ),
      });
    }

    // Invoice Information Section
    sections.push({
      id: "invoice-info",
      title: "Invoice Information",
      icon: <FileText className="size-4" />,
      defaultOpen: !(estimate || contract), // Only default open if workflow not shown
      content: (
        <UnifiedAccordionContent>
          <InvoiceHeader invoice={invoice} job={job} onUpdate={updateField} />
        </UnifiedAccordionContent>
      ),
    });

    // Parties Section
    if (company || customer) {
      sections.push({
        id: "parties",
        title: "Parties",
        icon: <Building2 className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <InvoiceParties
              company={company}
              customer={customer}
              invoice={invoice}
              property={property}
            />
          </UnifiedAccordionContent>
        ),
      });
    }

    // Line Items Section
    sections.push({
      id: "line-items",
      title: "Line Items",
      icon: <Receipt className="size-4" />,
      count: Array.isArray(invoice.line_items) ? invoice.line_items.length : 0,
      content: (
        <UnifiedAccordionContent>
          <InvoiceLineItems
            lineItems={invoice.line_items || []}
            onUpdate={(items) => updateField("line_items", items)}
          />
        </UnifiedAccordionContent>
      ),
    });

    // Totals Section
    sections.push({
      id: "totals",
      title: "Totals",
      icon: <DollarSign className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <InvoiceTotals invoice={invoice} />
        </UnifiedAccordionContent>
      ),
    });

    // Terms & Notes Section
    if (invoice.terms || invoice.notes) {
      sections.push({
        id: "terms-notes",
        title: "Terms & Notes",
        icon: <FileCheck className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <InvoiceTerms
              notes={invoice.notes}
              onUpdate={updateField}
              terms={invoice.terms}
            />
          </UnifiedAccordionContent>
        ),
      });
    }

    // Payment Management Section
    sections.push({
      id: "payment-management",
      title: "Payment Management",
      icon: <CreditCard className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <div id="payment-management">
            <InvoicePaymentManagement
              autoOpen={showQuickPayment}
              invoice={invoice}
              paymentMethods={paymentMethods}
            />
          </div>
        </UnifiedAccordionContent>
      ),
    });

    // Payments Applied Section (New - shows detailed payment history)
    if (invoicePayments.length > 0 || invoice.paid_amount > 0) {
      sections.push({
        id: "payments-applied",
        title: "Payments Applied",
        icon: <DollarSign className="size-4" />,
        count: invoicePayments.length,
        content: (
          <UnifiedAccordionContent>
            <InvoicePayments invoice={invoice} payments={invoicePayments} />
          </UnifiedAccordionContent>
        ),
      });
    }

    // Progress Payments Section (Legacy - deprecated in favor of Payments Applied)
    // Keep for backward compatibility but hide if new payments section shows
    if (invoice.paid_amount > 0 && invoicePayments.length === 0) {
      sections.push({
        id: "progress-payments",
        title: "Payment History",
        icon: <Calendar className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <InvoiceProgressPayments invoice={invoice} />
          </UnifiedAccordionContent>
        ),
      });
    }

    sections.push({
      id: "communications",
      title: "Communications",
      icon: <MessageSquare className="size-4" />,
      count: communications.length,
      content: (
        <UnifiedAccordionContent>
          {communications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground text-sm">
              <MessageSquare className="mb-4 size-10 text-muted-foreground" />
              No communications logged for this invoice yet.
            </div>
          ) : (
            renderInvoiceCommunicationEntries(communications)
          )}
        </UnifiedAccordionContent>
      ),
    });

    return sections;
  }, [
    invoice,
    company,
    customer,
    communications,
    job,
    property,
    estimate, // NEW
    contract, // NEW
    paymentMethods,
    invoicePayments,
    showQuickPayment,
    updateField,
    handleQuickPayment,
  ]);

  const relatedItems = useMemo(() => {
    const items: any[] = [];

    if (customer) {
      items.push({
        id: `customer-${customer.id}`,
        type: "customer",
        title:
          customer.display_name ||
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "Unknown Customer",
        subtitle: customer.email || customer.phone || undefined,
        href: `/dashboard/customers/${customer.id}`,
      });
    }

    if (job) {
      items.push({
        id: `job-${job.id}`,
        type: "job",
        title: job.title || `Job #${job.job_number}`,
        subtitle: job.status,
        href: `/dashboard/work/${job.id}`,
        badge: job.status
          ? { label: job.status, variant: "outline" as const }
          : undefined,
        actions: (
          <Button
            onClick={() => setUnlinkJobId(job.id)}
            size="sm"
            variant="outline"
          >
            <Link2Off className="mr-2 size-4" />
            Unlink
          </Button>
        ),
      });
    }

    return items;
  }, [customer, job]);

  // Early return check after all hooks
  return (
    <>
      <DetailPageContentLayout
        activities={activities}
        attachments={attachments}
        beforeContent={
          invoice.balance_amount > 0 && invoice.due_date ? (
            <div className="w-full px-2 sm:px-0">
              <div className="mx-auto max-w-7xl">
                <InvoiceOverdueBanner
                  balanceAmount={invoice.balance_amount}
                  dueDate={invoice.due_date}
                  onQuickPay={handleQuickPayment}
                />
              </div>
            </div>
          ) : undefined
        }
        customHeader={customHeader}
        customSections={customSections}
        defaultOpenSection="invoice-info"
        notes={notes}
        relatedItems={relatedItems}
        showStandardSections={{
          activities: true,
          notes: true,
          attachments: true,
          relatedItems: true,
        }}
      />

      {/* Archive Dialog */}
      <Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Invoice?</DialogTitle>
            <DialogDescription>
              This will archive invoice #{invoice.invoice_number}. You can
              restore it from the archive within 90 days.
              {invoice.status === "paid" && (
                <div className="mt-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Note: Paid invoices cannot be archived for compliance
                    reasons.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isArchiving}
              onClick={() => setIsArchiveDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isArchiving || invoice.status === "paid"}
              onClick={handleArchiveInvoice}
              variant="destructive"
            >
              {isArchiving ? "Archiving..." : "Archive Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlink Job Confirmation Dialog */}
      <Dialog
        onOpenChange={(open) => !open && setUnlinkJobId(null)}
        open={unlinkJobId !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink Job from Invoice?</DialogTitle>
            <DialogDescription>
              This will remove the job association from this invoice. The
              invoice will remain in the system but will no longer appear on the
              job's page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isUnlinking}
              onClick={() => setUnlinkJobId(null)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isUnlinking}
              onClick={handleUnlinkJob}
              variant="destructive"
            >
              {isUnlinking ? "Unlinking..." : "Unlink Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
