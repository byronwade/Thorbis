/**
 * Service Agreement Page Content
 *
 * Comprehensive service agreement details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  Archive,
  CheckCircle2,
  FileSignature,
  Package,
  Receipt,
  RefreshCw,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
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
import { archiveServiceAgreement } from "@/actions/service-agreements";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UnifiedAccordionContent,
  type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type ServiceAgreementData = {
  agreement: any;
  customer?: any;
  property?: any;
  generatedInvoices?: any[]; // NEW
  generatedJobs?: any[]; // NEW
  equipment?: any[]; // NEW
  notes?: any[];
  activities?: any[];
  attachments?: any[];
};

export type ServiceAgreementPageContentProps = {
  entityData: ServiceAgreementData;
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
    active: {
      className: "bg-success text-white",
      label: "Active",
    },
    expired: {
      className: "bg-warning text-white",
      label: "Expired",
    },
    cancelled: {
      className: "bg-destructive text-white",
      label: "Cancelled",
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

export function ServiceAgreementPageContent({
  entityData,
}: ServiceAgreementPageContentProps) {
  const [mounted, setMounted] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const {
    agreement,
    customer,
    property,
    generatedInvoices = [], // NEW
    generatedJobs = [], // NEW
    equipment = [], // NEW
    notes = [],
    activities = [],
    attachments = [],
  } = entityData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleArchiveServiceAgreement = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveServiceAgreement(agreement.id);
      if (result.success) {
        toast.success("Service agreement archived successfully");
        setIsArchiveDialogOpen(false);
        window.location.href = "/dashboard/work/service-agreements";
      } else {
        toast.error(result.error || "Failed to archive service agreement");
      }
    } catch (error) {
      toast.error("Failed to archive service agreement");
    } finally {
      setIsArchiving(false);
    }
  };

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const headerBadges = [
    <Badge key="status" variant="outline">
      {getStatusBadge(agreement.status || "draft")}
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
                  {agreement.name ||
                    agreement.title ||
                    `Agreement ${agreement.agreement_number || agreement.id.slice(0, 8)}`}
                </h1>
                {agreement.description && (
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {agreement.description}
                  </p>
                )}
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
        </div>
      </div>
    </div>
  );

  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [
      {
        id: "contract-terms",
        title: "Contract Terms",
        icon: <FileSignature className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  readOnly
                  value={
                    agreement.start_date
                      ? new Date(agreement.start_date).toLocaleDateString()
                      : "N/A"
                  }
                />
              </div>
              {agreement.end_date && (
                <div>
                  <Label>End Date</Label>
                  <Input
                    readOnly
                    value={new Date(agreement.end_date).toLocaleDateString()}
                  />
                </div>
              )}
              {agreement.contract_value && (
                <div>
                  <Label>Contract Value</Label>
                  <Input
                    readOnly
                    value={formatCurrency(agreement.contract_value)}
                  />
                </div>
              )}
              {agreement.payment_terms && (
                <div>
                  <Label>Payment Terms</Label>
                  <Input readOnly value={agreement.payment_terms} />
                </div>
              )}
            </div>
            {agreement.terms && (
              <div className="mt-4">
                <Label>Terms & Conditions</Label>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {agreement.terms}
                </p>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      },
    ];

    if (agreement.service_levels) {
      const serviceLevels =
        typeof agreement.service_levels === "string"
          ? JSON.parse(agreement.service_levels)
          : agreement.service_levels;

      if (Array.isArray(serviceLevels) && serviceLevels.length > 0) {
        sections.push({
          id: "service-levels",
          title: "Service Levels",
          icon: <ShieldCheck className="size-4" />,
          count: serviceLevels.length,
          content: (
            <UnifiedAccordionContent>
              <div className="space-y-2">
                {serviceLevels.map((level: any, index: number) => (
                  <div
                    className="flex items-center gap-2 rounded-lg border p-3"
                    key={index}
                  >
                    <CheckCircle2 className="size-4 text-success" />
                    <span className="text-sm">
                      {level.name || level.description || level}
                    </span>
                  </div>
                ))}
              </div>
            </UnifiedAccordionContent>
          ),
        });
      }
    }

    if (agreement.renewal_type || agreement.renewal_date) {
      sections.push({
        id: "renewal",
        title: "Renewal",
        icon: <RefreshCw className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {agreement.renewal_type && (
                <div>
                  <Label>Renewal Type</Label>
                  <Input readOnly value={agreement.renewal_type} />
                </div>
              )}
              {agreement.renewal_date && (
                <div>
                  <Label>Renewal Date</Label>
                  <Input
                    readOnly
                    value={new Date(
                      agreement.renewal_date
                    ).toLocaleDateString()}
                  />
                </div>
              )}
              {agreement.renewal_notice_days && (
                <div>
                  <Label>Renewal Notice (Days)</Label>
                  <Input
                    readOnly
                    value={`${agreement.renewal_notice_days} days`}
                  />
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

    // NEW: Generated Invoices Section
    if (generatedInvoices.length > 0) {
      sections.push({
        id: "generated-invoices",
        title: "Generated Invoices",
        icon: <Receipt className="size-4" />,
        count: generatedInvoices.length,
        content: (
          <UnifiedAccordionContent className="p-0">
            <div className="border-b px-6 py-4 text-muted-foreground text-sm">
              Invoices created from this service agreement.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-sm">Invoice #</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Title</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Date</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Total</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Balance</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm">#{invoice.invoice_number || invoice.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm">{invoice.title || "-"}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatCurrency(invoice.balance_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant={invoice.status === "paid" ? "default" : "outline"}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/dashboard/work/invoices/${invoice.id}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    // NEW: Generated Jobs Section
    if (generatedJobs.length > 0) {
      sections.push({
        id: "generated-jobs",
        title: "Generated Jobs",
        icon: <Wrench className="size-4" />,
        count: generatedJobs.length,
        content: (
          <UnifiedAccordionContent className="p-0">
            <div className="border-b px-6 py-4 text-muted-foreground text-sm">
              Jobs created from this service agreement.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-sm">Job #</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Title</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Date</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Completed</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedJobs.map((job: any) => (
                    <tr key={job.id} className="border-b hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm">#{job.job_number}</td>
                      <td className="px-6 py-4 text-sm font-medium">{job.title}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="outline">{job.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {job.completed_at ? new Date(job.completed_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/dashboard/work/${job.id}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    // NEW: Equipment Covered Section
    if (equipment.length > 0) {
      sections.push({
        id: "equipment-covered",
        title: "Equipment Covered",
        icon: <Package className="size-4" />,
        count: equipment.length,
        content: (
          <UnifiedAccordionContent className="p-0">
            <div className="border-b px-6 py-4 text-muted-foreground text-sm">
              Equipment included in this service agreement.
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-sm">Equipment #</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Type</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Manufacturer</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm">#{item.equipment_number || item.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-sm">{item.type || "-"}</td>
                      <td className="px-6 py-4 text-sm">{item.manufacturer || "-"}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/dashboard/work/equipment/${item.id}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    return sections;
  }, [agreement, customer, generatedInvoices, generatedJobs, equipment]);

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

    if (property) {
      items.push({
        id: `property-${property.id}`,
        type: "property",
        title: property.address || property.name || "Property",
        subtitle:
          `${property.city || ""}, ${property.state || ""}`.trim() || undefined,
        href: `/dashboard/work/properties/${property.id}`,
      });
    }

    return items;
  }, [customer, property]);

  return (
    <>
      <DetailPageContentLayout
        activities={activities}
        attachments={attachments}
        customHeader={customHeader}
        customSections={customSections}
        defaultOpenSection="contract-terms"
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
            <DialogTitle>Archive Service Agreement?</DialogTitle>
            <DialogDescription>
              This will archive the service agreement. You can restore it from the archive within 90 days.
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
              onClick={handleArchiveServiceAgreement}
              disabled={isArchiving}
            >
              {isArchiving ? "Archiving..." : "Archive Service Agreement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
