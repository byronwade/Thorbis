/**
 * Maintenance Plan Page Content
 *
 * Comprehensive maintenance plan details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  Wrench,
  Calendar,
  DollarSign,
  Repeat,
  User,
  Package,
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

export type MaintenancePlanData = {
  plan: any;
  customer?: any;
  property?: any;
  equipment?: any[];
  notes?: any[];
  activities?: any[];
  attachments?: any[];
};

export type MaintenancePlanPageContentProps = {
  entityData: MaintenancePlanData;
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
    paused: {
      className: "bg-yellow-500 text-white",
      label: "Paused",
    },
    cancelled: {
      className: "bg-red-500 text-white",
      label: "Cancelled",
    },
    expired: {
      className: "bg-orange-500 text-white",
      label: "Expired",
    },
    completed: {
      className: "bg-blue-500 text-white",
      label: "Completed",
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

export function MaintenancePlanPageContent({
  entityData,
}: MaintenancePlanPageContentProps) {
  const [mounted, setMounted] = useState(false);

  const {
    plan,
    customer,
    property,
    equipment = [],
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

  const includedServices = plan.included_services
    ? typeof plan.included_services === "string"
      ? JSON.parse(plan.included_services)
      : plan.included_services
    : [];

  const headerBadges = [
    <Badge key="status" variant="outline">
      {getStatusBadge(plan.status || "draft")}
    </Badge>,
    <Badge key="type" variant="outline">
      {plan.type || "preventive"}
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
                  {plan.name || `Plan ${plan.plan_number || plan.id.slice(0, 8)}`}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {formatCurrency(plan.price)}
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
        id: "service-schedule",
        title: "Service Schedule",
        icon: <Calendar className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Frequency</Label>
                <Input value={plan.frequency || "annually"} readOnly />
              </div>
              <div>
                <Label>Visits Per Term</Label>
                <Input value={plan.visits_per_term || 1} readOnly />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={plan.start_date ? new Date(plan.start_date).toLocaleDateString() : "N/A"}
                  readOnly
                />
              </div>
              {plan.end_date && (
                <div>
                  <Label>End Date</Label>
                  <Input
                    value={new Date(plan.end_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {plan.next_service_due && (
                <div>
                  <Label>Next Service Due</Label>
                  <Input
                    value={new Date(plan.next_service_due).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {plan.last_service_date && (
                <div>
                  <Label>Last Service</Label>
                  <Input
                    value={new Date(plan.last_service_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    if (includedServices.length > 0) {
      sections.push({
        id: "included-services",
        title: "Included Services",
        icon: <Wrench className="size-4" />,
        count: includedServices.length,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-2">
              {includedServices.map((service: any, index: number) => (
                <div key={index} className="flex items-center gap-2 rounded-lg border p-3">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <span className="text-sm">{service.name || service.description || service}</span>
                </div>
              ))}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (equipment.length > 0) {
      sections.push({
        id: "equipment",
        title: "Equipment",
        icon: <Package className="size-4" />,
        count: equipment.length,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-2">
              {equipment.map((eq: any) => (
                <div key={eq.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-sm">{eq.name || eq.equipment_number}</p>
                    <p className="text-muted-foreground text-xs">
                      {eq.manufacturer} {eq.model}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/work/equipment/${eq.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    sections.push({
      id: "billing",
      title: "Billing",
      icon: <DollarSign className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Price</Label>
              <Input value={formatCurrency(plan.price)} readOnly />
            </div>
            <div>
              <Label>Billing Frequency</Label>
              <Input value={plan.billing_frequency || "annually"} readOnly />
            </div>
            <div>
              <Label>Taxable</Label>
              <Input value={plan.taxable ? "Yes" : "No"} readOnly />
            </div>
            {plan.renewal_type && (
              <div>
                <Label>Renewal Type</Label>
                <Input value={plan.renewal_type} readOnly />
              </div>
            )}
          </div>
        </UnifiedAccordionContent>
      ),
    });

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
  }, [plan, customer, equipment, includedServices]);

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

    equipment.forEach((eq: any) => {
      items.push({
        id: `equipment-${eq.id}`,
        type: "equipment",
        title: eq.name || eq.equipment_number,
        subtitle: `${eq.manufacturer || ""} ${eq.model || ""}`.trim() || undefined,
        href: `/dashboard/work/equipment/${eq.id}`,
      });
    });

    return items;
  }, [customer, property, equipment]);

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
      defaultOpenSection="service-schedule"
    />
  );
}





