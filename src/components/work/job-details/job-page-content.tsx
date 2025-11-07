/**
 * Job Page Content - Comprehensive Single Page View
 * All details visible with collapsible sections - like ServiceTitan/HouseCall Pro
 */

"use client";

import {
  Activity,
  Building2,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Receipt,
  Save,
  User,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateJob } from "@/actions/jobs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StatsCards } from "@/components/ui/stats-cards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { JobEstimatesTable } from "./job-estimates-table";
import { JobInvoicesTable } from "./job-invoices-table";
import { JobNotesTable } from "./job-notes-table";
import { JobPurchaseOrdersTable } from "./job-purchase-orders-table";
import { JobQuickActions } from "./job-quick-actions";

type JobPageContentProps = {
  jobData: any;
  metrics: any;
};

export function JobPageContent({ jobData, metrics }: JobPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [localJob, setLocalJob] = useState({
    ...jobData.job,
    priority: jobData.job.priority || "normal", // Ensure default priority
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    job,
    customer,
    property,
    assignedUser,
    teamAssignments,
    timeEntries,
    invoices,
    estimates,
    payments,
    purchaseOrders,
    tasks,
    photos,
    documents,
    signatures,
    activities,
    communications,
    equipment,
    jobEquipment = [],
    jobMaterials = [],
    jobNotes = [],
  } = jobData;

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setLocalJob({ ...localJob, [field]: value });
    setHasChanges(true);
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (localJob.title !== jobData.job.title) {
        formData.append("title", localJob.title);
      }
      if (localJob.description !== jobData.job.description) {
        formData.append("description", localJob.description || "");
      }
      if (localJob.status !== jobData.job.status) {
        formData.append("status", localJob.status);
      }
      if (localJob.priority !== jobData.job.priority) {
        formData.append("priority", localJob.priority || "normal");
      }
      if (localJob.job_type !== jobData.job.job_type) {
        formData.append("jobType", localJob.job_type || "");
      }
      if (localJob.notes !== jobData.job.notes) {
        formData.append("notes", localJob.notes || "");
      }

      const result = await updateJob(jobData.job.id, formData);
      if (result.success) {
        toast.success("Changes saved successfully");
        setHasChanges(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save changes");
      }
    } catch (_error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Not set";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "approved":
      case "completed":
        return "default";
      case "sent":
      case "scheduled":
        return "secondary";
      case "overdue":
      case "cancelled":
        return "destructive";
      case "draft":
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="w-full">
      {/* Page Header - Not Fixed */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Title and Breadcrumb */}
          <div className="mb-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex-1">
                <Input
                  className="h-auto border-0 p-0 font-bold text-3xl tracking-tight shadow-none focus-visible:ring-0"
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  value={localJob.title}
                />
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
                  <span className="font-medium font-mono">
                    #{job.job_number}
                  </span>
                  {customer && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <Link
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline"
                        href={`/dashboard/customers/${customer.id}`}
                      >
                        <User className="h-3.5 w-3.5" />
                        {customer.first_name} {customer.last_name}
                      </Link>
                    </>
                  )}
                  {property && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <Link
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline"
                        href={`/dashboard/properties/${property.id}`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {property.name || property.address}
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {hasChanges && (
                <Button
                  disabled={isSaving}
                  onClick={handleSave}
                  size="sm"
                  variant="default"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}
            </div>

            {/* Job Details Grid */}
            <div className="mt-4 rounded-lg border bg-card p-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleFieldChange("status", value)
                    }
                    value={localJob.status}
                  >
                    <SelectTrigger className="h-10 border-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Priority
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleFieldChange("priority", value)
                    }
                    value={localJob.priority}
                  >
                    <SelectTrigger className="h-10 border-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Job Type
                  </Label>
                  <Input
                    className="h-10 border-muted"
                    onChange={(e) =>
                      handleFieldChange("service_type", e.target.value)
                    }
                    placeholder="e.g., Service, Repair, Installation"
                    value={localJob.service_type || localJob.job_type || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Assigned To
                  </Label>
                  <Input
                    className="h-10 border-muted bg-muted/50"
                    readOnly
                    value={
                      assignedUser
                        ? `${assignedUser.name || "Unassigned"}`
                        : "Unassigned"
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 space-y-2">
                <Label className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Description
                </Label>
                <Textarea
                  className="min-h-[80px] resize-none border-muted text-sm"
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  placeholder="Enter job description..."
                  value={localJob.description || ""}
                />
              </div>
            </div>
          </div>

          {/* Core Actions - Dispatch, Arrive, Close */}
          <JobQuickActions
            actualEnd={job.actual_end}
            actualStart={job.actual_start}
            currentStatus={job.status}
            jobId={job.id}
            scheduledStart={job.scheduled_start}
          />
        </div>
      </div>

      {/* All Sections - Collapsible */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <Accordion
          className="space-y-3"
          defaultValue={[
            "customer",
            "schedule",
            "equipment-serviced",
            "financials",
            "invoices",
            "estimates",
            "purchase-orders",
            "team",
            "tasks",
          ]}
          type="multiple"
        >
          {/* CUSTOMER & PROPERTY */}
          <AccordionItem className="rounded-lg border bg-card" value="customer">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Customer & Property Details
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Customer */}
                {customer && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-base">
                      <User className="h-4 w-4" />
                      Customer
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-lg">
                          {customer.first_name} {customer.last_name}
                        </p>
                        {customer.company_name && (
                          <p className="text-muted-foreground text-sm">
                            {customer.company_name}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              className="text-blue-600 text-sm hover:underline"
                              href={`mailto:${customer.email}`}
                            >
                              {customer.email}
                            </a>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              className="text-blue-600 text-sm hover:underline"
                              href={`tel:${customer.phone}`}
                            >
                              {customer.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {customer.address && (
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Billing Address
                          </Label>
                          <p className="text-sm">
                            {customer.address}
                            {customer.city && `, ${customer.city}`}
                            {customer.state && `, ${customer.state}`}
                            {customer.zip && ` ${customer.zip}`}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Total Revenue
                          </Label>
                          <p className="font-medium text-sm">
                            {formatCurrency(customer.total_revenue || 0)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Total Jobs
                          </Label>
                          <p className="font-medium text-sm">
                            {customer.total_jobs || 0}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Outstanding Balance
                          </Label>
                          <p className="font-medium text-orange-600 text-sm">
                            {formatCurrency(customer.outstanding_balance || 0)}
                          </p>
                        </div>
                      </div>

                      {equipment.length > 0 && (
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-sm">
                                {equipment.length} Equipment at Property
                              </span>
                            </div>
                            <Button
                              className="h-7 text-blue-600 text-xs hover:text-blue-700"
                              onClick={() => {
                                // Scroll to equipment section
                                const equipmentSection = document.querySelector(
                                  '[value="equipment"]'
                                );
                                equipmentSection?.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              View All →
                            </Button>
                          </div>
                          <p className="mt-1 text-muted-foreground text-xs">
                            HVAC, water heaters, and other equipment tracked at
                            this customer's property
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Property */}
                {property && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-base">
                      <MapPin className="h-4 w-4" />
                      Service Location
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">
                          {property.name || "Property"}
                        </p>
                        <div className="mt-1 text-muted-foreground text-sm">
                          <p>{property.address}</p>
                          {property.address2 && <p>{property.address2}</p>}
                          <p>
                            {property.city}, {property.state}{" "}
                            {property.zip_code}
                          </p>
                        </div>
                      </div>

                      {(property.square_footage ||
                        property.year_built ||
                        property.property_type) && (
                        <div className="grid gap-3 md:grid-cols-3">
                          {property.square_footage && (
                            <div>
                              <Label className="text-muted-foreground text-xs">
                                Square Footage
                              </Label>
                              <p className="font-medium text-sm">
                                {property.square_footage.toLocaleString()} sq ft
                              </p>
                            </div>
                          )}
                          {property.year_built && (
                            <div>
                              <Label className="text-muted-foreground text-xs">
                                Year Built
                              </Label>
                              <p className="font-medium text-sm">
                                {property.year_built}
                              </p>
                            </div>
                          )}
                          {property.property_type && (
                            <div>
                              <Label className="text-muted-foreground text-xs">
                                Type
                              </Label>
                              <p className="font-medium text-sm capitalize">
                                {property.property_type}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {property.notes && (
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Access Instructions
                          </Label>
                          <p className="text-sm">{property.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SCHEDULE & TIMELINE */}
          <AccordionItem className="rounded-lg border bg-card" value="schedule">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Schedule & Timeline
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Scheduled Start</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(job.scheduled_start)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Scheduled End</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(job.scheduled_end)}
                      </span>
                    </div>
                  </div>
                </div>

                {(job.actual_start || job.actual_end) && (
                  <>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      {job.actual_start && (
                        <div>
                          <Label>Actual Start</Label>
                          <div className="mt-1 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              {formatDate(job.actual_start)}
                            </span>
                          </div>
                        </div>
                      )}
                      {job.actual_end && (
                        <div>
                          <Label>Actual End</Label>
                          <div className="mt-1 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              {formatDate(job.actual_end)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {(job.dispatch_zone || job.travel_time_minutes) && (
                  <>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      {job.dispatch_zone && (
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Dispatch Zone
                          </Label>
                          <p className="font-medium text-sm">
                            {job.dispatch_zone}
                          </p>
                        </div>
                      )}
                      {job.travel_time_minutes && (
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Travel Time
                          </Label>
                          <p className="font-medium text-sm">
                            {job.travel_time_minutes} minutes
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* TEAM & TIME TRACKING */}
          <AccordionItem className="rounded-lg border bg-card" value="team">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Team & Time Tracking
                </span>
                <Badge variant="secondary">{teamAssignments.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Labor Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-xs">
                        Total Hours
                      </p>
                      <p className="font-bold text-2xl">
                        {formatHours(metrics.totalLaborHours)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-xs">Estimated</p>
                      <p className="font-bold text-2xl">
                        {metrics.estimatedLaborHours > 0
                          ? formatHours(metrics.estimatedLaborHours)
                          : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-xs">Variance</p>
                      <p
                        className={cn(
                          "font-bold text-2xl",
                          metrics.totalLaborHours > metrics.estimatedLaborHours
                            ? "text-orange-600"
                            : "text-green-600"
                        )}
                      >
                        {metrics.estimatedLaborHours > 0
                          ? formatHours(
                              metrics.totalLaborHours -
                                metrics.estimatedLaborHours
                            )
                          : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Team Members */}
                {assignedUser && (
                  <div>
                    <h4 className="mb-3 font-semibold">Primary Technician</h4>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar>
                        <AvatarImage src={assignedUser.avatar} />
                        <AvatarFallback>
                          {assignedUser.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{assignedUser.name}</p>
                        <div className="flex gap-3 text-muted-foreground text-xs">
                          {assignedUser.email && (
                            <span>{assignedUser.email}</span>
                          )}
                          {assignedUser.phone && (
                            <span>{assignedUser.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Entries */}
                {timeEntries.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold">
                      Time Entries ({timeEntries.length})
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Technician</TableHead>
                          <TableHead>Clock In</TableHead>
                          <TableHead>Clock Out</TableHead>
                          <TableHead>Break</TableHead>
                          <TableHead>Total Hours</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeEntries.map((entry: any) => {
                          const user = Array.isArray(entry.user)
                            ? entry.user[0]
                            : entry.user;
                          return (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">
                                {user?.name || "Unknown"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(entry.clock_in)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {entry.clock_out ? (
                                  formatDate(entry.clock_out)
                                ) : (
                                  <Badge variant="default">Active</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm">
                                {entry.break_minutes || 0}m
                              </TableCell>
                              <TableCell className="font-medium">
                                {entry.total_hours
                                  ? formatHours(entry.total_hours)
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <Badge className="text-xs" variant="outline">
                                  {entry.entry_type}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* JOB TASKS & CHECKLIST */}
          <AccordionItem className="rounded-lg border bg-card" value="tasks">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Job Tasks & Checklist
                </span>
                <Badge variant="secondary">{tasks.length}</Badge>
                {tasks.length > 0 && (
                  <Badge variant="outline">
                    {tasks.filter((t: any) => t.is_completed).length}/
                    {tasks.length} Complete
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Progress Bar */}
                {tasks.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-muted-foreground">
                        {Math.round(
                          (tasks.filter((t: any) => t.is_completed).length /
                            tasks.length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${(tasks.filter((t: any) => t.is_completed).length / tasks.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Tasks grouped by category */}
                {tasks.length > 0 ? (
                  [
                    "Pre-Job",
                    "On-Site",
                    "Post-Job",
                    "Safety",
                    "Quality",
                    null,
                  ].map((category) => {
                    const categoryTasks = tasks.filter((t: any) =>
                      category === null ? !t.category : t.category === category
                    );

                    if (categoryTasks.length === 0) {
                      return null;
                    }

                    return (
                      <div key={category || "uncategorized"}>
                        <h4 className="mb-3 font-semibold text-muted-foreground text-sm uppercase">
                          {category || "Other Tasks"}
                        </h4>
                        <div className="space-y-2">
                          {categoryTasks.map((task: any) => {
                            const assignedUser = Array.isArray(
                              task.assigned_user
                            )
                              ? task.assigned_user[0]
                              : task.assigned_user;

                            return (
                              <div
                                className={cn(
                                  "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                                  task.is_completed && "bg-gray-50 opacity-75"
                                )}
                                key={task.id}
                              >
                                {/* Checkbox */}
                                <div className="flex items-center pt-0.5">
                                  <input
                                    checked={task.is_completed}
                                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                                    onChange={() => {}}
                                    type="checkbox"
                                  />
                                </div>

                                {/* Task Content */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p
                                        className={cn(
                                          "font-medium",
                                          task.is_completed &&
                                            "text-muted-foreground line-through"
                                        )}
                                      >
                                        {task.title}
                                        {task.is_required && (
                                          <Badge
                                            className="ml-2 text-xs"
                                            variant="destructive"
                                          >
                                            Required
                                          </Badge>
                                        )}
                                      </p>
                                      {task.description && (
                                        <p className="mt-1 text-muted-foreground text-sm">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Assigned User */}
                                    {assignedUser && (
                                      <div className="flex items-center gap-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={assignedUser.avatar}
                                          />
                                          <AvatarFallback className="text-xs">
                                            {assignedUser.name
                                              ?.substring(0, 2)
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                    )}
                                  </div>

                                  {/* Task Meta */}
                                  <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                                    {task.is_completed && task.completed_at && (
                                      <span className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        Completed{" "}
                                        {formatDate(task.completed_at)}
                                      </span>
                                    )}
                                    {!task.is_completed && task.due_date && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Due {formatDate(task.due_date)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="mb-2 text-muted-foreground text-sm">
                      No tasks added yet
                    </p>
                    <Button size="sm" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                )}

                {/* Quick Actions */}
                {tasks.length > 0 && (
                  <div className="flex gap-2 border-t pt-4">
                    <Button
                      className="hover:bg-accent"
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                    <Button
                      className="hover:bg-accent"
                      size="sm"
                      variant="outline"
                    >
                      Load Template
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* FINANCIALS - STATS ONLY */}
          <AccordionItem
            className="rounded-lg border bg-card"
            value="financials"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Financials & Billing
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {/* Financial Stats - Using StatsCards component */}
                <StatsCards
                  stats={[
                    {
                      label: "Job Value",
                      value: formatCurrency(metrics.totalAmount),
                      change:
                        metrics.totalAmount > 0
                          ? Number(
                              (
                                ((metrics.totalAmount - metrics.paidAmount) /
                                  metrics.totalAmount) *
                                -100
                              ).toFixed(2)
                            )
                          : 0,
                      changeLabel: `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`,
                    },
                    {
                      label: "Paid",
                      value: formatCurrency(metrics.paidAmount),
                      change:
                        metrics.totalAmount > 0
                          ? Number(
                              (
                                (metrics.paidAmount / metrics.totalAmount) *
                                100
                              ).toFixed(2)
                            )
                          : 0,
                      changeLabel: `${payments.length} payment${payments.length !== 1 ? "s" : ""}`,
                    },
                    {
                      label: "Outstanding",
                      value: formatCurrency(
                        metrics.totalAmount - metrics.paidAmount
                      ),
                      change:
                        metrics.totalAmount > 0
                          ? Number(
                              (
                                ((metrics.totalAmount - metrics.paidAmount) /
                                  metrics.totalAmount) *
                                100
                              ).toFixed(2)
                            )
                          : 0,
                      changeLabel: "remaining",
                    },
                    {
                      label: "Profit",
                      value: formatCurrency(
                        metrics.totalAmount - metrics.materialsCost
                      ),
                      change: Number(metrics.profitMargin.toFixed(2)),
                      changeLabel: "margin",
                    },
                  ]}
                  variant="ticker"
                />

                {/* Payment Terms & Deposit */}
                <div className="grid gap-4 md:grid-cols-2">
                  {job.payment_terms && (
                    <div>
                      <Label>Payment Terms</Label>
                      <p className="text-sm">{job.payment_terms}</p>
                    </div>
                  )}
                  {job.deposit_amount > 0 && (
                    <div>
                      <Label>Deposit Required</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {formatCurrency(job.deposit_amount)}
                        </p>
                        {job.deposit_paid_at && (
                          <Badge variant="default">
                            Paid {formatDate(job.deposit_paid_at)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* INVOICES */}
          <CollapsibleSection
            actions={
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            }
            count={invoices.length}
            fullWidthContent
            icon={<FileText className="h-5 w-5" />}
            title="Invoices"
            value="invoices"
          >
            <JobInvoicesTable invoices={invoices} />
          </CollapsibleSection>

          {/* ESTIMATES */}
          <CollapsibleSection
            actions={
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Estimate
              </Button>
            }
            count={estimates.length}
            fullWidthContent
            icon={<Receipt className="h-5 w-5" />}
            title="Estimates"
            value="estimates"
          >
            <JobEstimatesTable estimates={estimates} />
          </CollapsibleSection>

          {/* PURCHASE ORDERS */}
          <CollapsibleSection
            actions={
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create PO
              </Button>
            }
            count={purchaseOrders.length}
            fullWidthContent
            icon={<Package className="h-5 w-5" />}
            title="Purchase Orders"
            value="purchase-orders"
          >
            <JobPurchaseOrdersTable purchaseOrders={purchaseOrders} />
          </CollapsibleSection>

          {/* PHOTOS & DOCUMENTS */}
          <AccordionItem className="rounded-lg border bg-card" value="photos">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Photos & Documents
                </span>
                <Badge variant="secondary">
                  {photos.length + documents.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                {/* Photo Categories */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">
                      Photos by Category ({photos.length})
                    </h4>
                    <Button
                      className="hover:bg-accent"
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-4">
                    {[
                      "before",
                      "during",
                      "after",
                      "issue",
                      "equipment",
                      "completion",
                      "other",
                    ].map((category) => {
                      const count = photos.filter(
                        (p: any) => p.category === category
                      ).length;
                      return (
                        <div
                          className="rounded-lg border p-4 text-center"
                          key={category}
                        >
                          <p className="font-medium text-muted-foreground text-xs uppercase">
                            {category}
                          </p>
                          <p className="font-bold text-3xl">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Documents */}
                <div>
                  <h4 className="mb-3 font-semibold">
                    Documents ({documents.length})
                  </h4>
                  {documents.length > 0 ? (
                    <div className="space-y-2">
                      {documents.map((doc: any) => (
                        <div
                          className="flex items-center justify-between rounded-lg border p-3"
                          key={doc.id}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.file_name}</span>
                          </div>
                          <Button
                            className="hover:bg-accent"
                            size="sm"
                            variant="ghost"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No documents uploaded
                    </p>
                  )}
                </div>

                <Separator />

                {/* Signatures */}
                <div>
                  <h4 className="mb-3 font-semibold">Signatures</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Customer Signature
                        </p>
                        {signatures.find(
                          (s: any) => s.signature_type === "customer"
                        ) ? (
                          <Badge variant="default">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Signed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                      {signatures.find(
                        (s: any) => s.signature_type === "customer"
                      ) && (
                        <p className="text-muted-foreground text-xs">
                          Signed{" "}
                          {formatDate(
                            signatures.find(
                              (s: any) => s.signature_type === "customer"
                            ).signed_at
                          )}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Technician Signature
                        </p>
                        {signatures.find(
                          (s: any) => s.signature_type === "technician"
                        ) ? (
                          <Badge variant="default">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Signed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                      {signatures.find(
                        (s: any) => s.signature_type === "technician"
                      ) && (
                        <p className="text-muted-foreground text-xs">
                          Signed{" "}
                          {formatDate(
                            signatures.find(
                              (s: any) => s.signature_type === "technician"
                            ).signed_at
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ACTIVITY & COMMUNICATIONS */}
          <AccordionItem className="rounded-lg border bg-card" value="activity">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Activity & Communications
                </span>
                <Badge variant="secondary">
                  {activities.length + communications.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-3">
                {/* Combined timeline */}
                {[...activities, ...communications]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .slice(0, 20)
                  .map((item: any) => {
                    const user = Array.isArray(item.user)
                      ? item.user[0]
                      : item.user;
                    const isComm = item.type || item.subject; // Communications have type or subject

                    return (
                      <div
                        className="flex gap-3 rounded-lg border p-3"
                        key={item.id}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-xs">
                            {user?.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {user?.name || "System"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(item.created_at)}
                            </span>
                            {isComm && item.type && (
                              <Badge className="text-xs" variant="outline">
                                {item.type.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          {item.subject && (
                            <p className="mb-1 font-medium text-sm">
                              {item.subject}
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm">
                            {item.description || item.body || "Activity logged"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* EQUIPMENT SERVICED */}
          <AccordionItem
            className="rounded-lg border bg-card"
            value="equipment-serviced"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                <span className="font-semibold text-lg">
                  Equipment Serviced on This Job
                </span>
                <Badge variant="default">{jobEquipment.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {jobEquipment.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Wrench className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-4 text-muted-foreground text-sm">
                    No equipment has been added to this job yet
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Equipment serviced on this job will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobEquipment.map((je: any) => (
                    <div
                      className="space-y-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                      key={je.id}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold">
                              {je.equipment?.name}
                            </h4>
                            <Badge variant="secondary">{je.service_type}</Badge>
                          </div>
                          <div className="space-y-1 text-muted-foreground text-sm">
                            <p>
                              {je.equipment?.manufacturer} {je.equipment?.model}
                              {je.equipment?.serial_number &&
                                ` • SN: ${je.equipment.serial_number}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {je.work_performed && (
                        <div className="text-sm">
                          <span className="font-medium">Work Performed:</span>
                          <p className="mt-1 text-muted-foreground">
                            {je.work_performed}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {je.condition_before && (
                          <div>
                            <span className="mr-2 text-muted-foreground">
                              Before:
                            </span>
                            <Badge variant="outline">
                              {je.condition_before}
                            </Badge>
                          </div>
                        )}
                        {je.condition_after && (
                          <div>
                            <span className="mr-2 text-muted-foreground">
                              After:
                            </span>
                            <Badge variant="default">
                              {je.condition_after}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* CUSTOMER EQUIPMENT AT PROPERTY */}
          {equipment.length > 0 && (
            <AccordionItem
              className="rounded-lg border bg-card"
              value="equipment"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold text-lg">
                    Customer Equipment at Property
                  </span>
                  <Badge variant="secondary">{equipment.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Serial #</TableHead>
                      <TableHead>Last Service</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.manufacturer || "N/A"}</TableCell>
                        <TableCell>{item.model || "N/A"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.serial_number || "N/A"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.last_service_date
                            ? formatDate(item.last_service_date)
                            : "Never"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Spacer for bottom padding */}
        <div className="h-24" />
      </div>
    </div>
  );
}
