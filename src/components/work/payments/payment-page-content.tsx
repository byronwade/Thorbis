/**
 * Payment Page Content
 *
 * Comprehensive payment details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  CreditCard,
  DollarSign,
  Receipt,
  RefreshCw,
  FileText,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import {
  UnifiedAccordionContent,
  UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PaymentData = {
  payment: any;
  customer?: any;
  invoice?: any;
  job?: any;
  notes?: any[];
  activities?: any[];
  attachments?: any[];
};

export type PaymentPageContentProps = {
  entityData: PaymentData;
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

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: "Cash",
    check: "Check",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    ach: "ACH",
    wire: "Wire Transfer",
    venmo: "Venmo",
    paypal: "PayPal",
    other: "Other",
  };
  return labels[method] || method;
}

function getStatusBadge(status: string) {
  const variants: Record<string, { className: string; label: string }> = {
    pending: {
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      label: "Pending",
    },
    processing: {
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      label: "Processing",
    },
    completed: {
      className: "bg-green-500 text-white",
      label: "Completed",
    },
    failed: {
      className: "bg-red-500 text-white",
      label: "Failed",
    },
    refunded: {
      className: "bg-orange-500 text-white",
      label: "Refunded",
    },
    partially_refunded: {
      className: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      label: "Partially Refunded",
    },
    cancelled: {
      className: "bg-gray-500 text-white",
      label: "Cancelled",
    },
  };

  const config = variants[status] || {
    className: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
}

export function PaymentPageContent({
  entityData,
}: PaymentPageContentProps) {
  const [mounted, setMounted] = useState(false);

  const {
    payment,
    customer,
    invoice,
    job,
    notes = [],
    activities = [],
    attachments = [],
  } = entityData;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const headerBadges = [
    <Badge key="status" variant="outline">
      {getStatusBadge(payment.status || "pending")}
    </Badge>,
    <Badge key="method" variant="outline">
      {getPaymentMethodLabel(payment.payment_method || "other")}
    </Badge>,
  ];

  const customHeader = (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
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
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  Payment {payment.payment_number || payment.id.slice(0, 8)}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            </div>
          </div>

          {customer && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                href={`/dashboard/customers/${customer.id}`}
              >
                <User className="size-4" />
                {customer.display_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Unknown Customer"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [
      {
        id: "payment-details",
        title: "Payment Details",
        icon: <CreditCard className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Payment Number</Label>
                <Input value={payment.payment_number || payment.id.slice(0, 8)} readOnly />
              </div>
              <div>
                <Label>Amount</Label>
                <Input value={formatCurrency(payment.amount)} readOnly />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Input value={getPaymentMethodLabel(payment.payment_method || "other")} readOnly />
              </div>
              <div>
                <Label>Status</Label>
                <div>{getStatusBadge(payment.status || "pending")}</div>
              </div>
              {payment.processed_at && (
                <div>
                  <Label>Processed At</Label>
                  <Input
                    value={new Date(payment.processed_at).toLocaleString()}
                    readOnly
                  />
                </div>
              )}
              {payment.completed_at && (
                <div>
                  <Label>Completed At</Label>
                  <Input
                    value={new Date(payment.completed_at).toLocaleString()}
                    readOnly
                  />
                </div>
              )}
              {payment.reference_number && (
                <div>
                  <Label>Reference Number</Label>
                  <Input value={payment.reference_number} readOnly />
                </div>
              )}
              {payment.check_number && (
                <div>
                  <Label>Check Number</Label>
                  <Input value={payment.check_number} readOnly />
                </div>
              )}
              {payment.card_last4 && (
                <div>
                  <Label>Card</Label>
                  <Input
                    value={`${payment.card_brand || "Card"} •••• ${payment.card_last4}`}
                    readOnly
                  />
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    if (payment.processor_name || payment.processor_transaction_id) {
      sections.push({
        id: "processor-info",
        title: "Processor Information",
        icon: <Building2 className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {payment.processor_name && (
                <div>
                  <Label>Processor</Label>
                  <Input value={payment.processor_name} readOnly />
                </div>
              )}
              {payment.processor_transaction_id && (
                <div>
                  <Label>Transaction ID</Label>
                  <Input value={payment.processor_transaction_id} readOnly />
                </div>
              )}
              {payment.processor_fee !== null && payment.processor_fee !== undefined && (
                <div>
                  <Label>Processor Fee</Label>
                  <Input value={formatCurrency(payment.processor_fee)} readOnly />
                </div>
              )}
              {payment.net_amount !== null && payment.net_amount !== undefined && (
                <div>
                  <Label>Net Amount</Label>
                  <Input value={formatCurrency(payment.net_amount)} readOnly />
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (payment.refunded_amount > 0) {
      sections.push({
        id: "refunds",
        title: "Refunds",
        icon: <RefreshCw className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-3">
              <div>
                <Label>Refunded Amount</Label>
                <p className="text-sm font-semibold">{formatCurrency(payment.refunded_amount)}</p>
              </div>
              {payment.refund_reason && (
                <div>
                  <Label>Refund Reason</Label>
                  <p className="text-sm">{payment.refund_reason}</p>
                </div>
              )}
              {payment.refunded_at && (
                <div>
                  <Label>Refunded At</Label>
                  <p className="text-sm">
                    {new Date(payment.refunded_at).toLocaleString()}
                  </p>
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
                    {customer.display_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Unknown"}
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
                <Link href={`/dashboard/customers/${customer.id}`}>View Full Profile</Link>
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
                  <p className="text-sm">#{invoice.invoice_number || invoice.id.slice(0, 8)}</p>
                </div>
                <div>
                  <Label>Invoice Amount</Label>
                  <p className="text-sm">{formatCurrency(invoice.total_amount)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant="outline">{invoice.status || "N/A"}</Badge>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/work/invoices/${invoice.id}`}>View Invoice</Link>
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
                  <p className="text-sm">#{job.job_number || job.id.slice(0, 8)}</p>
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

    return sections;
  }, [payment, customer, invoice, job]);

  const relatedItems = useMemo(() => {
    const items: any[] = [];

    if (customer) {
      items.push({
        id: `customer-${customer.id}`,
        type: "customer",
        title: customer.display_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Unknown Customer",
        subtitle: customer.email || customer.phone || undefined,
        href: `/dashboard/customers/${customer.id}`,
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

    return items;
  }, [customer, invoice, job]);

  return (
    <DetailPageContentLayout
      customHeader={customHeader}
      customSections={customSections}
      activities={activities}
      notes={notes}
      attachments={attachments}
      relatedItems={relatedItems}
      showStandardSections={{
        activities: true,
        notes: true,
        attachments: true,
        relatedItems: true,
      }}
      defaultOpenSection="payment-details"
    />
  );
}





