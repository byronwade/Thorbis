/**
 * Equipment Page Content
 *
 * Comprehensive equipment details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  Package,
  Calendar,
  ShieldCheck,
  Wrench,
  User,
  MapPin,
  AlertCircle,
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

export type EquipmentData = {
  equipment: any;
  customer?: any;
  property?: any;
  servicePlan?: any;
  serviceHistory?: any[];
  notes?: any[];
  activities?: any[];
  attachments?: any[];
};

export type EquipmentPageContentProps = {
  entityData: EquipmentData;
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
    active: {
      className: "bg-green-500 text-white",
      label: "Active",
    },
    inactive: {
      className: "bg-gray-500 text-white",
      label: "Inactive",
    },
    retired: {
      className: "bg-orange-500 text-white",
      label: "Retired",
    },
    replaced: {
      className: "bg-blue-500 text-white",
      label: "Replaced",
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

function getConditionBadge(condition: string) {
  const variants: Record<string, { className: string; label: string }> = {
    excellent: {
      className: "bg-green-500 text-white",
      label: "Excellent",
    },
    good: {
      className: "bg-blue-500 text-white",
      label: "Good",
    },
    fair: {
      className: "bg-yellow-500 text-white",
      label: "Fair",
    },
    poor: {
      className: "bg-orange-500 text-white",
      label: "Poor",
    },
    needs_replacement: {
      className: "bg-red-500 text-white",
      label: "Needs Replacement",
    },
  };

  const config = variants[condition] || {
    className: "bg-gray-100 text-gray-800",
    label: condition,
  };

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
}

export function EquipmentPageContent({
  entityData,
}: EquipmentPageContentProps) {
  const [mounted, setMounted] = useState(false);

  const {
    equipment,
    customer,
    property,
    servicePlan,
    serviceHistory = [],
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
      {getStatusBadge(equipment.status || "active")}
    </Badge>,
    <Badge key="condition" variant="outline">
      {getConditionBadge(equipment.condition || "good")}
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
                  {equipment.name || `Equipment ${equipment.equipment_number || equipment.id.slice(0, 8)}`}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {equipment.manufacturer} {equipment.model}
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
        id: "equipment-details",
        title: "Equipment Details",
        icon: <Package className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Equipment Number</Label>
                <Input value={equipment.equipment_number || equipment.id.slice(0, 8)} readOnly />
              </div>
              <div>
                <Label>Type</Label>
                <Input value={equipment.type || "N/A"} readOnly />
              </div>
              <div>
                <Label>Manufacturer</Label>
                <Input value={equipment.manufacturer || "N/A"} readOnly />
              </div>
              <div>
                <Label>Model</Label>
                <Input value={equipment.model || "N/A"} readOnly />
              </div>
              {equipment.serial_number && (
                <div>
                  <Label>Serial Number</Label>
                  <Input value={equipment.serial_number} readOnly />
                </div>
              )}
              {equipment.model_year && (
                <div>
                  <Label>Model Year</Label>
                  <Input value={equipment.model_year.toString()} readOnly />
                </div>
              )}
              {equipment.location && (
                <div>
                  <Label>Location</Label>
                  <Input value={equipment.location} readOnly />
                </div>
              )}
              {equipment.capacity && (
                <div>
                  <Label>Capacity</Label>
                  <Input value={equipment.capacity} readOnly />
                </div>
              )}
              {equipment.efficiency && (
                <div>
                  <Label>Efficiency</Label>
                  <Input value={equipment.efficiency} readOnly />
                </div>
              )}
              {equipment.fuel_type && (
                <div>
                  <Label>Fuel Type</Label>
                  <Input value={equipment.fuel_type} readOnly />
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    if (equipment.install_date || equipment.installed_by) {
      sections.push({
        id: "installation",
        title: "Installation",
        icon: <Calendar className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {equipment.install_date && (
                <div>
                  <Label>Install Date</Label>
                  <Input
                    value={new Date(equipment.install_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {equipment.installed_by && (
                <div>
                  <Label>Installed By</Label>
                  <Input value={equipment.installed_by} readOnly />
                </div>
              )}
              {equipment.install_job_id && (
                <div>
                  <Label>Install Job</Label>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/work/${equipment.install_job_id}`}>
                      View Job
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (equipment.is_under_warranty || equipment.warranty_expiration) {
      sections.push({
        id: "warranty",
        title: "Warranty",
        icon: <ShieldCheck className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Under Warranty</Label>
                <Input value={equipment.is_under_warranty ? "Yes" : "No"} readOnly />
              </div>
              {equipment.warranty_expiration && (
                <div>
                  <Label>Warranty Expiration</Label>
                  <Input
                    value={new Date(equipment.warranty_expiration).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {equipment.warranty_provider && (
                <div>
                  <Label>Warranty Provider</Label>
                  <Input value={equipment.warranty_provider} readOnly />
                </div>
              )}
              {equipment.warranty_notes && (
                <div className="md:col-span-2">
                  <Label>Warranty Notes</Label>
                  <p className="text-sm whitespace-pre-wrap">{equipment.warranty_notes}</p>
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (serviceHistory.length > 0) {
      sections.push({
        id: "service-history",
        title: "Service History",
        icon: <Wrench className="size-4" />,
        count: serviceHistory.length,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-2">
              {serviceHistory.map((service: any) => (
                <div key={service.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-sm">
                      {service.service_type || "Service"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {service.serviced_at
                        ? new Date(service.serviced_at).toLocaleDateString()
                        : "Date unknown"}
                    </p>
                  </div>
                  {service.job_id && (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/dashboard/work/${service.job_id}`}>View Job</Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (equipment.last_service_date || equipment.next_service_due) {
      sections.push({
        id: "maintenance-schedule",
        title: "Maintenance Schedule",
        icon: <Calendar className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {equipment.last_service_date && (
                <div>
                  <Label>Last Service</Label>
                  <Input
                    value={new Date(equipment.last_service_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {equipment.next_service_due && (
                <div>
                  <Label>Next Service Due</Label>
                  <Input
                    value={new Date(equipment.next_service_due).toLocaleDateString()}
                    readOnly
                  />
                </div>
              )}
              {equipment.service_interval_days && (
                <div>
                  <Label>Service Interval</Label>
                  <Input value={`${equipment.service_interval_days} days`} readOnly />
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

    if (property) {
      sections.push({
        id: "property-location",
        title: "Property Location",
        icon: <MapPin className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-4">
              <div>
                <Label>Service Address</Label>
                <p className="text-sm">
                  {property.address}
                  {property.address2 && `, ${property.address2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {property.city}, {property.state} {property.zip_code}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${property.address}, ${property.city}, ${property.state}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 size-4" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    return sections;
  }, [equipment, customer, property, serviceHistory]);

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

    if (servicePlan) {
      items.push({
        id: `service-plan-${servicePlan.id}`,
        type: "service_plan",
        title: servicePlan.name || `Plan ${servicePlan.plan_number || servicePlan.id.slice(0, 8)}`,
        subtitle: servicePlan.status,
        href: `/dashboard/work/maintenance-plans/${servicePlan.id}`,
        badge: servicePlan.status
          ? { label: servicePlan.status, variant: "outline" as const }
          : undefined,
      });
    }

    return items;
  }, [customer, property, servicePlan]);

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
      defaultOpenSection="equipment-details"
    />
  );
}





