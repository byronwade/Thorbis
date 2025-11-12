/**
 * Estimate Page Content
 *
 * Comprehensive estimate details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import { Archive, Calendar, FileCheck, FileText, Receipt, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { archiveEstimate } from "@/actions/estimates";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UnifiedAccordionContent,
  type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { WorkflowTimeline } from "@/components/ui/workflow-timeline";

export type EstimateData = {
  estimate: any;
  customer?: any;
  job?: any;
  invoice?: any;
  contract?: any; // NEW: for workflow timeline
  notes?: any[];
  activities?: any[];
  attachments?: any[];
};

export type EstimatePageContentProps = {
  entityData: EstimateData;
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

function getStatusBadge(status: string) {
  const variants: Record<string, { className: string; label: string }> = {
    draft: {
      className:
        "bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground",
      label: "Draft",
    },
    sent: {
      className:
        "bg-primary text-primary dark:bg-primary/20 dark:text-primary",
      label: "Sent",
    },
    viewed: {
      className:
        "bg-accent text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground",
      label: "Viewed",
    },
    accepted: {
      className: "bg-success text-white",
      label: "Accepted",
    },
    declined: {
      className: "bg-destructive text-white",
      label: "Declined",
    },
    expired: {
      className: "bg-warning text-white",
      label: "Expired",
    },
  };

  const config = variants[status] || {
    className: "bg-muted text-foreground",
    label: status,
  };

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
}

export function EstimatePageContent({ entityData }: EstimatePageContentProps) {
  const [mounted, setMounted] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const {
    estimate,
    customer,
    job,
    invoice,
    contract, // NEW: for workflow timeline
    notes = [],
    activities = [],
    attachments = [],
  } = entityData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleArchiveEstimate = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveEstimate(estimate.id);
      if (result.success) {
        toast.success("Estimate archived successfully");
        setIsArchiveDialogOpen(false);
        // Redirect to estimates list
        window.location.href = "/dashboard/work/estimates";
      } else {
        toast.error(result.error || "Failed to archive estimate");
      }
    } catch (error) {
      toast.error("Failed to archive estimate");
    } finally {
      setIsArchiving(false);
    }
  };

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const lineItems = estimate.line_items
    ? typeof estimate.line_items === "string"
      ? JSON.parse(estimate.line_items)
      : estimate.line_items
    : [];

  const headerBadges = [
    <Badge key="status" variant="outline">
      {getStatusBadge(estimate.status || "draft")}
    </Badge>,
  ];

  const customHeader = (
    <div className="w-full">
      <div className="rounded-md bg-muted/50 shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {headerBadges.map((badge, index) => (
                  <span key={index}>{badge}</span>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-2xl sm:text-3xl">
                  {estimate.title ||
                    `Estimate ${estimate.estimate_number || estimate.id.slice(0, 8)}`}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {formatCurrency(estimate.total_amount)}
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

              {/* Archive Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsArchiveDialogOpen(true)}
                className="ml-auto"
              >
                <Archive className="mr-2 size-4" />
                Archive
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {estimate.valid_until && (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  Valid until{" "}
                  {new Date(estimate.valid_until).toLocaleDateString()}
                </span>
              </div>
            )}
            {job && (
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80"
                href={`/dashboard/work/${job.id}`}
              >
                <FileText className="size-4 text-muted-foreground" />
                <span className="font-medium">Job #{job.job_number}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [];

    // NEW: Sales Workflow Timeline Section
    // Only show if there's a contract or invoice to display progression
    if (contract || invoice) {
      const workflowStages = [
        {
          id: "estimate",
          label: "Estimate Created",
          status: "completed" as const,
          date: estimate.created_at,
          href: `/dashboard/work/estimates/${estimate.id}`,
          description: estimate.status === "accepted" ? "Accepted by customer" : undefined,
        },
        {
          id: "contract",
          label: "Contract Generated",
          status: contract ? ("completed" as const) : ("pending" as const),
          date: contract?.created_at,
          href: contract ? `/dashboard/work/contracts/${contract.id}` : undefined,
          description: contract?.status === "signed" ? "Signed" : contract ? "Pending signature" : undefined,
        },
        {
          id: "invoice",
          label: "Invoice Created",
          status: invoice ? ("completed" as const) : ("pending" as const),
          date: invoice?.created_at,
          href: invoice ? `/dashboard/work/invoices/${invoice.id}` : undefined,
          description: invoice?.status === "paid" ? "Paid in full" : invoice ? `Status: ${invoice.status}` : undefined,
        },
        {
          id: "payment",
          label: "Payment Received",
          status: invoice?.status === "paid" ? ("completed" as const) : invoice ? ("current" as const) : ("pending" as const),
          date: invoice?.paid_at,
          description: invoice?.paid_at ? "Completed" : invoice ? `Balance: ${formatCurrency(invoice.balance_amount)}` : undefined,
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

    // Line Items Section
    sections.push({
        id: "line-items",
        title: "Line Items",
        icon: <FileText className="size-4" />,
        count: lineItems.length,
        defaultOpen: !contract && !invoice, // Only default open if workflow not shown
        content: (
          <UnifiedAccordionContent>
            {lineItems.length > 0 ? (
              <div className="-mx-4 overflow-x-auto sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.description || item.name || "Item"}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity || 1}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            item.unit_price || item.unitPrice || item.price || 0
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(
                            (item.quantity || 1) *
                              (item.unit_price ||
                                item.unitPrice ||
                                item.price ||
                                0)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 bg-muted/50">
                      <TableCell
                        className="text-right font-semibold"
                        colSpan={3}
                      >
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(estimate.subtotal || 0)}
                      </TableCell>
                    </TableRow>
                    {estimate.tax_amount > 0 && (
                      <TableRow>
                        <TableCell className="text-right" colSpan={3}>
                          Tax ({estimate.tax_rate || 0}%)
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(estimate.tax_amount || 0)}
                        </TableCell>
                      </TableRow>
                    )}
                    {estimate.discount_amount > 0 && (
                      <TableRow>
                        <TableCell className="text-right" colSpan={3}>
                          Discount
                        </TableCell>
                        <TableCell className="text-right">
                          -{formatCurrency(estimate.discount_amount || 0)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow className="border-t-2 bg-muted/50">
                      <TableCell
                        className="text-right font-bold text-lg"
                        colSpan={3}
                      >
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(estimate.total_amount || 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto size-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground text-sm">
                    No line items yet
                  </p>
                </div>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      });

    if (estimate.terms) {
      sections.push({
        id: "terms",
        title: "Terms & Conditions",
        icon: <FileCheck className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-3">
              <p className="whitespace-pre-wrap text-sm">{estimate.terms}</p>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (estimate.valid_until) {
      sections.push({
        id: "validity",
        title: "Validity",
        icon: <Calendar className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-3">
              <div>
                <Label>Valid Until</Label>
                <p className="text-sm">
                  {new Date(estimate.valid_until).toLocaleDateString()}
                </p>
              </div>
              {estimate.status === "accepted" && estimate.accepted_at && (
                <div>
                  <Label>Accepted At</Label>
                  <p className="text-sm">
                    {new Date(estimate.accepted_at).toLocaleString()}
                  </p>
                </div>
              )}
              {estimate.status === "declined" && estimate.declined_at && (
                <div>
                  <Label>Declined At</Label>
                  <p className="text-sm">
                    {new Date(estimate.declined_at).toLocaleString()}
                  </p>
                  {estimate.decline_reason && (
                    <div className="mt-2">
                      <Label>Decline Reason</Label>
                      <p className="text-sm">{estimate.decline_reason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (customer) {
      sections.push({
        id: "customer-details",
        title: "Customer Details",
        icon: <User className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="grid flex-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">
                    {customer.display_name ||
                      `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
                      "Unknown"}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{customer.email || "N/A"}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{customer.phone || "N/A"}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/customers/${customer.id}`}>
                  View Full Profile
                </Link>
              </Button>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (job) {
      sections.push({
        id: "job-details",
        title: "Related Job",
        icon: <FileText className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="grid flex-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Job Number</Label>
                  <p className="text-sm">
                    #{job.job_number || job.id.slice(0, 8)}
                  </p>
                </div>
                <div>
                  <Label>Title</Label>
                  <p className="text-sm">{job.title || "N/A"}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/work/${job.id}`}>View Job</Link>
              </Button>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (invoice) {
      sections.push({
        id: "invoice-details",
        title: "Related Invoice",
        icon: <Receipt className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="grid flex-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Invoice Number</Label>
                  <p className="text-sm">
                    #{invoice.invoice_number || invoice.id.slice(0, 8)}
                  </p>
                </div>
                <div>
                  <Label>Invoice Amount</Label>
                  <p className="text-sm">
                    {formatCurrency(invoice.total_amount)}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/work/invoices/${invoice.id}`}>
                  View Invoice
                </Link>
              </Button>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    return sections;
  }, [estimate, customer, job, invoice, contract, lineItems]);

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
        title: job.title || `Job #${job.job_number || job.id.slice(0, 8)}`,
        subtitle: job.status,
        href: `/dashboard/work/${job.id}`,
        badge: job.status
          ? { label: job.status, variant: "outline" as const }
          : undefined,
      });
    }

    if (invoice) {
      items.push({
        id: `invoice-${invoice.id}`,
        type: "invoice",
        title: `Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)}`,
        subtitle: formatCurrency(invoice.total_amount),
        href: `/dashboard/work/invoices/${invoice.id}`,
        badge: invoice.status
          ? { label: invoice.status, variant: "outline" as const }
          : undefined,
      });
    }

    return items;
  }, [customer, job, invoice]);

  return (
    <>
      <DetailPageContentLayout
        activities={activities}
        attachments={attachments}
        customHeader={customHeader}
        customSections={customSections}
        defaultOpenSection="line-items"
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
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Estimate?</DialogTitle>
            <DialogDescription>
              This will archive estimate #
              {estimate.estimate_number || estimate.id.slice(0, 8)}. You can
              restore it from the archive within 90 days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsArchiveDialogOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchiveEstimate}
              disabled={isArchiving}
            >
              {isArchiving ? "Archiving..." : "Archive Estimate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
