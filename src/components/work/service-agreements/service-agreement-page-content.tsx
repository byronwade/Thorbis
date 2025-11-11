/**
 * Service Agreement Page Content
 *
 * Comprehensive service agreement details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  FileSignature,
  Calendar,
  DollarSign,
  RefreshCw,
  User,
  ShieldCheck,
  CheckCircle2,
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

export type ServiceAgreementData = {
  agreement: any;
  customer?: any;
  property?: any;
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
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Draft",
    },
    active: {
      className: "bg-green-500 text-white",
      label: "Active",
    },
    expired: {
      className: "bg-orange-500 text-white",
      label: "Expired",
    },
    cancelled: {
      className: "bg-red-500 text-white",
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

export function ServiceAgreementPageContent({
  entityData,
}: ServiceAgreementPageContentProps) {
  const [mounted, setMounted] = useState(false);

  const {
    agreement,
    customer,
    property,
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
      {getStatusBadge(agreement.status || "draft")}
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
                  {agreement.name || agreement.title || `Agreement ${agreement.agreement_number || agreement.id.slice(0, 8)}`}
                </h1>
                {agreement.description && (
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {agreement.description}
                  </p>
                )}
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
                  value={agreement.start_date ? new Date(agreement.start_date).toLocaleDateString() : "N/A"}
                  readOnly
                />
              </div>
              {agreement.end_date && (
                <div>
                  <Label>End Date</Label>
                  <Input
                    value={new Date(agreement.end_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {agreement.contract_value && (
                <div>
                  <Label>Contract Value</Label>
                  <Input value={formatCurrency(agreement.contract_value)} readOnly />
                </div>
              )}
              {agreement.payment_terms && (
                <div>
                  <Label>Payment Terms</Label>
                  <Input value={agreement.payment_terms} readOnly />
                </div>
              )}
            </div>
            {agreement.terms && (
              <div className="mt-4">
                <Label>Terms & Conditions</Label>
                <p className="mt-2 text-sm whitespace-pre-wrap">{agreement.terms}</p>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      },
    ];

    if (agreement.service_levels) {
      const serviceLevels = typeof agreement.service_levels === "string"
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
                  <div key={index} className="flex items-center gap-2 rounded-lg border p-3">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span className="text-sm">{level.name || level.description || level}</span>
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
                  <Input value={agreement.renewal_type} readOnly />
                </div>
              )}
              {agreement.renewal_date && (
                <div>
                  <Label>Renewal Date</Label>
                  <Input
                    value={new Date(agreement.renewal_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {agreement.renewal_notice_days && (
                <div>
                  <Label>Renewal Notice (Days)</Label>
                  <Input value={`${agreement.renewal_notice_days} days`} readOnly />
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
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/customers/${customer.id}`}>View Full Profile</Link>
              </Button>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    return sections;
  }, [agreement, customer]);

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

    if (property) {
      items.push({
        id: `property-${property.id}`,
        type: "property",
        title: property.address || property.name || "Property",
        subtitle: `${property.city || ""}, ${property.state || ""}`.trim() || undefined,
        href: `/dashboard/properties/${property.id}`,
      });
    }

    return items;
  }, [customer, property]);

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
      defaultOpenSection="contract-terms"
    />
  );
}





