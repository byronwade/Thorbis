/**
 * Appointment Page Content
 *
 * Comprehensive appointment details with collapsible sections
 * Matches job and customer detail page patterns
 *
 * Sections:
 * - Appointment Info (date/time, duration, status, type)
 * - Customer Details (linked customer information)
 * - Property Location (service address with map)
 * - Job Details (linked job information)
 * - Team Assignments (assigned technicians)
 * - Travel & Route (travel time, directions, traffic)
 * - Checklist & Tasks (appointment checklist items)
 * - Notes (appointment-specific notes)
 * - Activity Log (appointment history)
 */

"use client";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Wrench,
  Route,
  CheckSquare,
  FileText,
  Activity,
  Phone,
  Mail,
  Building2,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CollapsibleDataSection, CollapsibleActionButton } from "@/components/ui/collapsible-data-section";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

export type AppointmentData = {
  appointment: any;
  customer?: any;
  property?: any;
  job?: any;
  teamAssignments?: any[];
  tasks?: any[];
  notes?: any[];
  activities?: any[];
};

export type AppointmentPageContentProps = {
  entityData: AppointmentData;
  metrics: any;
};

const defaultAccordionSections = [
  "appointment-info",
  "customer-details",
  "property-location",
  "team-assignments",
];

export function AppointmentPageContent({
  entityData,
  metrics,
}: AppointmentPageContentProps) {
  const appointmentData = entityData; // Alias for easier refactoring
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    appointment,
    customer,
    property,
    job,
    teamAssignments = [],
    tasks = [],
    notes = [],
    activities = [],
  } = appointmentData;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const appointmentDate = new Date(appointment.start_time);
  const appointmentEndDate = new Date(appointment.end_time);
  const duration = Math.floor(
    (appointmentEndDate.getTime() - appointmentDate.getTime()) / (1000 * 60)
  );

  return (
    <div className="flex-1">
      {/* Hero Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Appointment ID Badge */}
          <div className="mb-3">
            <Badge variant="outline">
              APT-{appointment.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>

          {/* Title and Status */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-bold text-4xl">
                {appointmentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h1>
              <p className="mt-2 text-muted-foreground text-xl">
                {appointmentDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })} - {appointmentEndDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    appointment.status === "confirmed"
                      ? "default"
                      : appointment.status === "completed"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {appointment.status}
                </Badge>
                <Badge variant="outline">{appointment.appointment_type || "Service"}</Badge>
              </div>
            </div>

            {hasChanges && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setHasChanges(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>
                <Button
                  disabled={isSaving}
                  onClick={() => {}}
                  size="sm"
                >
                  <Save className="mr-2 size-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {/* Quick Links */}
          {customer && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                href={`/dashboard/customers/${customer.id}`}
              >
                <User className="size-4" />
                {customer.first_name} {customer.last_name}
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

          {/* Metadata Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span className="font-medium">{duration} minutes</span>
            </div>

            {teamAssignments.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span className="font-medium">{teamAssignments.length} team members</span>
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

      {/* Collapsible Sections */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div suppressHydrationWarning>
          <Accordion
            className="space-y-3"
            defaultValue={defaultAccordionSections}
            type="multiple"
          >
            {/* Appointment Info */}
            <CollapsibleDataSection
              value="appointment-info"
              title="Appointment Information"
              icon={<Calendar className="size-4" />}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    value={new Date(appointment.start_time).toISOString().slice(0, 16)}
                    readOnly
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={new Date(appointment.end_time).toISOString().slice(0, 16)}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={appointment.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Input value={appointment.appointment_type || "Service"} readOnly />
                </div>
              </div>
            </CollapsibleDataSection>

            {/* Customer Details */}
            {customer && (
              <CollapsibleDataSection
                value="customer-details"
                title="Customer Details"
                icon={<User className="size-4" />}
                actions={
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      View Full Profile
                    </Link>
                  </Button>
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm">{customer.first_name} {customer.last_name}</p>
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
              </CollapsibleDataSection>
            )}

            {/* Property Location */}
            {property && (
              <CollapsibleDataSection
                value="property-location"
                title="Property Location"
                icon={<MapPin className="size-4" />}
              >
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
              </CollapsibleDataSection>
            )}

            {/* Team Assignments */}
            <CollapsibleDataSection
              value="team-assignments"
              title="Team Assignments"
              icon={<Users className="size-4" />}
              badge={<Badge variant="secondary">{teamAssignments.length}</Badge>}
            >
              <div className="space-y-3">
                {teamAssignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <Avatar>
                      <AvatarImage src={assignment.user?.avatar} />
                      <AvatarFallback>
                        {assignment.user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "TM"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{assignment.user?.name || "Unknown"}</p>
                      <p className="text-muted-foreground text-sm">
                        {assignment.role || "Technician"}
                      </p>
                    </div>
                    <Badge variant="outline">{assignment.status || "assigned"}</Badge>
                  </div>
                ))}

                {teamAssignments.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm">
                    No team members assigned
                  </p>
                )}
              </div>
            </CollapsibleDataSection>

            {/* Job Details */}
            {job && (
              <CollapsibleDataSection
                value="job-details"
                title="Job Details"
                icon={<Wrench className="size-4" />}
                actions={
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/work/${job.id}`}>
                      View Full Job
                    </Link>
                  </Button>
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Job Number</Label>
                    <p className="text-sm">#{job.job_number}</p>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <p className="text-sm">{job.title}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant="outline">{job.status}</Badge>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge variant="outline">{job.priority}</Badge>
                  </div>
                </div>
              </CollapsibleDataSection>
            )}

            {/* Notes */}
            <CollapsibleDataSection
              value="notes"
              title="Notes"
              icon={<FileText className="size-4" />}
              count={notes.length}
            >
              <div className="space-y-3">
                {notes.length > 0 ? (
                  notes.map((note: any) => (
                    <div key={note.id} className="rounded-lg border p-4">
                      <p className="text-sm">{note.content}</p>
                      <p className="mt-2 text-muted-foreground text-xs">
                        {note.user?.name} •{" "}
                        {formatDistance(new Date(note.created_at), new Date(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm">
                    No notes yet
                  </p>
                )}
              </div>
            </CollapsibleDataSection>

            {/* Activity Log */}
            <CollapsibleDataSection
              value="activity"
              title="Activity Log"
              icon={<Activity className="size-4" />}
              count={activities.length}
            >
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity: any) => (
                    <div key={activity.id} className="flex gap-4 rounded-lg border p-4">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {activity.user?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          {activity.user?.name} •{" "}
                          {formatDistance(new Date(activity.created_at), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm">
                    No activity yet
                  </p>
                )}
              </div>
            </CollapsibleDataSection>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
