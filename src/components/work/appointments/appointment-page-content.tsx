/**
 * Appointment Page Content
 *
 * Comprehensive appointment details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  Wrench,
  Repeat,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import {
  UnifiedAccordionContent,
  UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type AppointmentData = {
  appointment: any;
  customer?: any;
  property?: any;
  job?: any;
  assigned_user?: any;
  notes?: any[];
  activities?: any[];
  attachments?: any[];
};

export type AppointmentPageContentProps = {
  entityData: AppointmentData;
};

export function AppointmentPageContent({
  entityData,
}: AppointmentPageContentProps) {
  const [mounted, setMounted] = useState(false);

  const {
    appointment,
    customer,
    property,
    job,
    assigned_user,
    notes = [],
    activities = [],
    attachments = [],
  } = entityData;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute values used in hooks - must be before hooks
  const appointmentStart = appointment.start_time ? new Date(appointment.start_time) : null;
  const appointmentEnd = appointment.end_time ? new Date(appointment.end_time) : null;
  const durationMinutes = appointmentStart && appointmentEnd
    ? Math.max(0, Math.floor((appointmentEnd.getTime() - appointmentStart.getTime()) / (1000 * 60)))
    : 0;

  // All hooks must be called before any conditional returns
  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [
      {
        id: "schedule-details",
        title: "Schedule Details",
        icon: <Calendar className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={appointmentStart ? appointmentStart.toISOString().slice(0, 16) : ""}
                  readOnly
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={appointmentEnd ? appointmentEnd.toISOString().slice(0, 16) : ""}
                  readOnly
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={appointment.status || "scheduled"} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration</Label>
                <Input value={`${durationMinutes} minutes`} readOnly />
              </div>
              {appointment.location && (
                <div className="md:col-span-2">
                  <Label>Location</Label>
                  <Input value={appointment.location} readOnly />
                </div>
              )}
              {appointment.access_instructions && (
                <div className="md:col-span-2">
                  <Label>Access Instructions</Label>
                  <p className="text-sm whitespace-pre-wrap">{appointment.access_instructions}</p>
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    if (appointment.is_recurring) {
      sections.push({
        id: "recurrence",
        title: "Recurrence Rules",
        icon: <Repeat className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-3">
              <div>
                <Label>Recurrence Pattern</Label>
                <p className="text-sm">
                  {appointment.recurrence_rule ? JSON.stringify(appointment.recurrence_rule) : "Not configured"}
                </p>
              </div>
              {appointment.recurrence_end_date && (
                <div>
                  <Label>Recurrence End Date</Label>
                  <p className="text-sm">
                    {new Date(appointment.recurrence_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    if (appointment.reminder_hours_before !== null && appointment.reminder_hours_before !== undefined) {
      sections.push({
        id: "reminders",
        title: "Reminders",
        icon: <Bell className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-3">
              <div>
                <Label>Reminder</Label>
                <p className="text-sm">
                  {appointment.reminder_hours_before} hours before appointment
                </p>
              </div>
              {appointment.reminder_sent && (
                <div>
                  <Label>Last Reminder Sent</Label>
                  <p className="text-sm">
                    {appointment.reminder_sent_at
                      ? new Date(appointment.reminder_sent_at).toLocaleString()
                      : "Never"}
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
                <div>
                  <Label>Company</Label>
                  <p className="text-sm">{customer.company_name || "N/A"}</p>
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

    if (job) {
      sections.push({
        id: "job-details",
        title: "Related Job",
        icon: <Wrench className="size-4" />,
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
                <div>
                  <Label>Status</Label>
                  <Badge variant="outline">{job.status || "N/A"}</Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge variant="outline">{job.priority || "N/A"}</Badge>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/work/${job.id}`}>View Full Job</Link>
              </Button>
            </div>
          </UnifiedAccordionContent>
        ),
      });
    }

    return sections;
  }, [appointment, customer, property, job, durationMinutes, appointmentStart, appointmentEnd]);

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
  }, [customer, property, job]);

  // Now we can do conditional return after all hooks
  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const statusBadgeVariant =
    appointment.status === "confirmed"
      ? "default"
      : appointment.status === "completed"
        ? "secondary"
        : "outline";

  const headerBadges = [
    <Badge key="status" variant={statusBadgeVariant}>
      {appointment.status || "scheduled"}
    </Badge>,
    appointment.type && (
      <Badge key="type" variant="outline">
        {appointment.type}
      </Badge>
    ),
  ].filter(Boolean);

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
                  {appointment.title || "Appointment"}
                </h1>
                {appointmentStart && (
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {appointmentStart.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {" "}
                    {appointmentStart.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {appointmentEnd?.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
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

              {customer.email && (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                  href={`mailto:${customer.email}`}
                >
                  <Mail className="size-4" />
                  {customer.email}
                </a>
              )}

              {customer.phone && (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                  href={`tel:${customer.phone}`}
                >
                  <Phone className="size-4" />
                  {customer.phone}
                </a>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {durationMinutes > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium">{durationMinutes} minutes</span>
              </div>
            )}

            {assigned_user && (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">{assigned_user.name || "Unassigned"}</span>
              </div>
            )}

            {job && (
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm transition-colors hover:bg-muted/80"
                href={`/dashboard/work/${job.id}`}
              >
                <Wrench className="size-4 text-muted-foreground" />
                <span className="font-medium">Job #{job.job_number || job.id.slice(0, 8)}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
      defaultOpenSection="schedule-details"
    />
  );
}




