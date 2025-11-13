/**
 * Equipment Page Content
 *
 * Comprehensive equipment details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  Archive,
  Calendar,
  MapPin,
  Package,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { archiveEquipment } from "@/actions/equipment";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UnifiedAccordionContent,
  type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type EquipmentData = {
  equipment: any;
  customer?: any;
  property?: any;
  servicePlan?: any;
  installJob?: any; // NEW: for lifecycle tracking
  lastServiceJob?: any; // NEW: for lifecycle tracking
  upcomingMaintenance?: any[]; // NEW: for lifecycle tracking
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
      className: "bg-success text-white",
      label: "Active",
    },
    inactive: {
      className: "bg-secondary0 text-white",
      label: "Inactive",
    },
    retired: {
      className: "bg-warning text-white",
      label: "Retired",
    },
    replaced: {
      className: "bg-primary text-white",
      label: "Replaced",
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

function getConditionBadge(condition: string) {
  const variants: Record<string, { className: string; label: string }> = {
    excellent: {
      className: "bg-success text-white",
      label: "Excellent",
    },
    good: {
      className: "bg-primary text-white",
      label: "Good",
    },
    fair: {
      className: "bg-warning text-white",
      label: "Fair",
    },
    poor: {
      className: "bg-warning text-white",
      label: "Poor",
    },
    needs_replacement: {
      className: "bg-destructive text-white",
      label: "Needs Replacement",
    },
  };

  const config = variants[condition] || {
    className: "bg-muted text-foreground",
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
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const {
    equipment,
    customer,
    property,
    servicePlan,
    installJob, // NEW: for lifecycle tracking
    lastServiceJob, // NEW: for lifecycle tracking
    upcomingMaintenance = [], // NEW: for lifecycle tracking
    serviceHistory = [],
    notes = [],
    activities = [],
    attachments = [],
  } = entityData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleArchiveEquipment = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveEquipment(equipment.id);
      if (result.success) {
        toast.success("Equipment archived successfully");
        setIsArchiveDialogOpen(false);
        window.location.href = "/dashboard/work/equipment";
      } else {
        toast.error(result.error || "Failed to archive equipment");
      }
    } catch (error) {
      toast.error("Failed to archive equipment");
    } finally {
      setIsArchiving(false);
    }
  };

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
                  {equipment.name ||
                    `Equipment ${equipment.equipment_number || equipment.id.slice(0, 8)}`}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {equipment.manufacturer} {equipment.model}
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
                className="ml-auto"
                onClick={() => setIsArchiveDialogOpen(true)}
                size="sm"
                variant="outline"
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
        id: "equipment-details",
        title: "Equipment Details",
        icon: <Package className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Equipment Number</Label>
                <Input
                  readOnly
                  value={equipment.equipment_number || equipment.id.slice(0, 8)}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Input readOnly value={equipment.type || "N/A"} />
              </div>
              <div>
                <Label>Manufacturer</Label>
                <Input readOnly value={equipment.manufacturer || "N/A"} />
              </div>
              <div>
                <Label>Model</Label>
                <Input readOnly value={equipment.model || "N/A"} />
              </div>
              {equipment.serial_number && (
                <div>
                  <Label>Serial Number</Label>
                  <Input readOnly value={equipment.serial_number} />
                </div>
              )}
              {equipment.model_year && (
                <div>
                  <Label>Model Year</Label>
                  <Input readOnly value={equipment.model_year.toString()} />
                </div>
              )}
              {equipment.location && (
                <div>
                  <Label>Location</Label>
                  <Input readOnly value={equipment.location} />
                </div>
              )}
              {equipment.capacity && (
                <div>
                  <Label>Capacity</Label>
                  <Input readOnly value={equipment.capacity} />
                </div>
              )}
              {equipment.efficiency && (
                <div>
                  <Label>Efficiency</Label>
                  <Input readOnly value={equipment.efficiency} />
                </div>
              )}
              {equipment.fuel_type && (
                <div>
                  <Label>Fuel Type</Label>
                  <Input readOnly value={equipment.fuel_type} />
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    // NEW: Enhanced Installation Section with full job data
    if (equipment.install_date || equipment.installed_by || installJob) {
      sections.push({
        id: "installation",
        title: "Installation",
        icon: <Calendar className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {equipment.install_date && (
                  <div>
                    <Label>Install Date</Label>
                    <Input
                      readOnly
                      value={new Date(
                        equipment.install_date
                      ).toLocaleDateString()}
                    />
                  </div>
                )}
                {equipment.installed_by && (
                  <div>
                    <Label>Installed By</Label>
                    <Input readOnly value={equipment.installed_by} />
                  </div>
                )}
              </div>

              {/* Install Job Card */}
              {installJob && (
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Label className="mb-2 block">Install Job</Label>
                      <h4 className="font-semibold text-lg">
                        {installJob.title || `Job #${installJob.job_number}`}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        #{installJob.job_number}
                      </p>
                      {installJob.completed_at && (
                        <p className="mt-1 text-muted-foreground text-xs">
                          Completed:{" "}
                          {new Date(
                            installJob.completed_at
                          ).toLocaleDateString()}
                        </p>
                      )}
                      <div className="mt-2">
                        <Badge variant="outline">{installJob.status}</Badge>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/work/${installJob.id}`}>
                        View Job
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    // NEW: Last Service Job Section
    if (lastServiceJob) {
      sections.push({
        id: "last-service",
        title: "Last Service",
        icon: <Wrench className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Label className="mb-2 block">Most Recent Service</Label>
                  <h4 className="font-semibold text-lg">
                    {lastServiceJob.title ||
                      `Job #${lastServiceJob.job_number}`}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    #{lastServiceJob.job_number}
                  </p>
                  {lastServiceJob.completed_at && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      Completed:{" "}
                      {new Date(
                        lastServiceJob.completed_at
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-2">
                    <Badge variant="outline">{lastServiceJob.status}</Badge>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/work/${lastServiceJob.id}`}>
                    View Job
                  </Link>
                </Button>
              </div>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    // NEW: Upcoming Maintenance Section
    if (upcomingMaintenance.length > 0) {
      sections.push({
        id: "upcoming-maintenance",
        title: "Upcoming Maintenance",
        icon: <Calendar className="size-4" />,
        count: upcomingMaintenance.length,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-3">
              {upcomingMaintenance.map((schedule: any) => (
                <div
                  className="rounded-lg border bg-card p-4"
                  key={schedule.id}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {new Date(schedule.scheduled_start).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(schedule.scheduled_start).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      {schedule.job && (
                        <p className="mt-1 text-muted-foreground text-xs">
                          {schedule.job.title ||
                            `Job #${schedule.job.job_number}`}
                        </p>
                      )}
                      <div className="mt-2">
                        <Badge variant="outline">{schedule.status}</Badge>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/appointments/${schedule.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
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
                <Input
                  readOnly
                  value={equipment.is_under_warranty ? "Yes" : "No"}
                />
              </div>
              {equipment.warranty_expiration && (
                <div>
                  <Label>Warranty Expiration</Label>
                  <Input
                    readOnly
                    value={new Date(
                      equipment.warranty_expiration
                    ).toLocaleDateString()}
                  />
                </div>
              )}
              {equipment.warranty_provider && (
                <div>
                  <Label>Warranty Provider</Label>
                  <Input readOnly value={equipment.warranty_provider} />
                </div>
              )}
              {equipment.warranty_notes && (
                <div className="md:col-span-2">
                  <Label>Warranty Notes</Label>
                  <p className="whitespace-pre-wrap text-sm">
                    {equipment.warranty_notes}
                  </p>
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
                <div
                  className="flex items-center justify-between rounded-lg border p-3"
                  key={service.id}
                >
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
                      <Link href={`/dashboard/work/${service.job_id}`}>
                        View Job
                      </Link>
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
                    readOnly
                    value={new Date(
                      equipment.last_service_date
                    ).toLocaleDateString()}
                  />
                </div>
              )}
              {equipment.next_service_due && (
                <div>
                  <Label>Next Service Due</Label>
                  <Input
                    readOnly
                    value={new Date(
                      equipment.next_service_due
                    ).toLocaleDateString()}
                  />
                </div>
              )}
              {equipment.service_interval_days && (
                <div>
                  <Label>Service Interval</Label>
                  <Input
                    readOnly
                    value={`${equipment.service_interval_days} days`}
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
                <p className="text-muted-foreground text-sm">
                  {property.city}, {property.state} {property.zip_code}
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${property.address}, ${property.city}, ${property.state}`
                  )}`}
                  rel="noopener noreferrer"
                  target="_blank"
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
  }, [
    equipment,
    customer,
    property,
    installJob,
    lastServiceJob,
    upcomingMaintenance,
    serviceHistory,
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

    if (servicePlan) {
      items.push({
        id: `service-plan-${servicePlan.id}`,
        type: "service_plan",
        title:
          servicePlan.name ||
          `Plan ${servicePlan.plan_number || servicePlan.id.slice(0, 8)}`,
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
    <>
      <DetailPageContentLayout
        activities={activities}
        attachments={attachments}
        customHeader={customHeader}
        customSections={customSections}
        defaultOpenSection="equipment-details"
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
            <DialogTitle>Archive Equipment?</DialogTitle>
            <DialogDescription>
              This will archive the equipment. You can restore it from the
              archive within 90 days.
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
              disabled={isArchiving}
              onClick={handleArchiveEquipment}
              variant="destructive"
            >
              {isArchiving ? "Archiving..." : "Archive Equipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
