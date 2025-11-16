/**
 * Overview Tab - Job Details Main View
 *
 * Inline-editable sections similar to customer page
 *
 * Features:
 * - Job Information (title, description, status, priority)
 * - Customer & Contact Information
 * - Property & Location Details
 * - Schedule & Timeline
 * - Quick Financials Summary
 * - Service Details (type, warranty, agreements)
 *
 * Performance:
 * - Client Component for interactivity
 * - Optimistic updates
 * - Debounced auto-save
 */

"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useJobEditorStore } from "@/lib/stores/job-editor-store";
import { TeamMemberSelector } from "../team-member-selector";

type OverviewTabProps = {
  job: any;
  customer: any;
  customers: any[];
  property: any;
  properties: any[];
  propertyEnrichment: any;
  isEditMode: boolean;
};

export function OverviewTab({
  job,
  customer,
  customers,
  property,
  properties,
  propertyEnrichment,
  isEditMode,
}: OverviewTabProps) {
  const { setHasUnsavedChanges, setEditorContent } = useJobEditorStore();

  const [localJob, setLocalJob] = useState(job);
  const formatDateOrFallback = (
    value: unknown,
    preset = "datetime",
    fallback = "—"
  ) => {
    const formatted = formatDate(
      value as Date | number | string | null | undefined,
      preset
    );
    return formatted === "—" ? fallback : formatted;
  };

  // Handle field changes
  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      const updated = { ...localJob, [field]: value };
      setLocalJob(updated);
      setHasUnsavedChanges(true);
      setEditorContent(updated);
    },
    [localJob, setHasUnsavedChanges, setEditorContent]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Job Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Job Information</CardTitle>
            </div>
            <Badge
              variant={
                localJob.status === "completed" ? "default" : "secondary"
              }
            >
              {localJob.status?.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Number (readonly) */}
          <div>
            <Label>Job Number</Label>
            <Input
              className="bg-muted"
              disabled
              value={localJob.job_number || ""}
            />
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              disabled={!isEditMode}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Enter job title..."
              value={localJob.title || ""}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              disabled={!isEditMode}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Enter job description..."
              rows={4}
              value={localJob.description || ""}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Status</Label>
              <Select
                disabled={!isEditMode}
                onValueChange={(value) => handleFieldChange("status", value)}
                value={localJob.status || "quoted"}
              >
                <SelectTrigger>
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

            <div>
              <Label>Priority</Label>
              <Select
                disabled={!isEditMode}
                onValueChange={(value) => handleFieldChange("priority", value)}
                value={localJob.priority || "medium"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Type & Service Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Job Type</Label>
              <Input
                disabled={!isEditMode}
                onChange={(e) => handleFieldChange("job_type", e.target.value)}
                placeholder="e.g., Installation, Repair, Maintenance"
                value={localJob.job_type || ""}
              />
            </div>

            <div>
              <Label>Service Type</Label>
              <Input
                disabled={!isEditMode}
                onChange={(e) =>
                  handleFieldChange("service_type", e.target.value)
                }
                placeholder="e.g., HVAC, Plumbing, Electrical"
                value={localJob.service_type || ""}
              />
            </div>
          </div>

          {/* Team Assignments */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Team Assigned
            </Label>
            <TeamMemberSelector isEditMode={isEditMode} jobId={job.id} />
          </div>

          <Separator />

          {/* Internal Notes */}
          <div>
            <Label>Internal Notes</Label>
            <Textarea
              disabled={!isEditMode}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Internal notes (not visible to customer)..."
              rows={3}
              value={localJob.notes || ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer & Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Customer & Contact</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {customer ? (
            <>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {customer.first_name} {customer.last_name}
                  </h3>
                  {customer.company_name && (
                    <p className="text-muted-foreground text-sm">
                      {customer.company_name}
                    </p>
                  )}
                </div>
                {isEditMode && (
                  <Button size="sm" variant="outline">
                    Change Customer
                  </Button>
                )}
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="grid gap-4 md:grid-cols-2">
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      className="text-primary text-sm hover:underline"
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
                      className="text-primary text-sm hover:underline"
                      href={`tel:${customer.phone}`}
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Customer Address */}
              {customer.address && (
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Customer Address
                  </Label>
                  <p className="text-sm">
                    {customer.address}
                    {customer.city && `, ${customer.city}`}
                    {customer.state && `, ${customer.state}`}
                    {customer.zip && ` ${customer.zip}`}
                  </p>
                </div>
              )}

              {/* Multiple Customers Indicator */}
              {customers.length > 1 && (
                <div className="rounded-md border border-primary bg-primary p-3">
                  <p className="text-primary text-sm">
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                    This job has {customers.length} customers assigned.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No customer assigned
              {isEditMode && (
                <Button className="ml-2" size="sm" variant="outline">
                  Add Customer
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property & Location */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Property & Location</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {property ? (
            <>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {property.name || "Service Location"}
                  </h3>
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="text-muted-foreground text-sm">
                      <p>{property.address}</p>
                      {property.address2 && <p>{property.address2}</p>}
                      <p>
                        {property.city}, {property.state} {property.zip_code}
                      </p>
                    </div>
                  </div>
                </div>
                {isEditMode && (
                  <Button size="sm" variant="outline">
                    Change Property
                  </Button>
                )}
              </div>

              <Separator />

              {/* Property Details */}
              {propertyEnrichment && (
                <div className="grid gap-4 md:grid-cols-3">
                  {propertyEnrichment.squareFootage && (
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Square Footage
                      </Label>
                      <p className="font-medium text-sm">
                        {propertyEnrichment.squareFootage.toLocaleString()} sq
                        ft
                      </p>
                    </div>
                  )}

                  {propertyEnrichment.yearBuilt && (
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Year Built
                      </Label>
                      <p className="font-medium text-sm">
                        {propertyEnrichment.yearBuilt}
                      </p>
                    </div>
                  )}

                  {propertyEnrichment.propertyType && (
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Property Type
                      </Label>
                      <p className="font-medium text-sm capitalize">
                        {propertyEnrichment.propertyType}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Access Instructions */}
              {property.notes && (
                <div>
                  <Label>Access Instructions</Label>
                  <p className="text-muted-foreground text-sm">
                    {property.notes}
                  </p>
                </div>
              )}

              {/* Multiple Properties Indicator */}
              {properties.length > 1 && (
                <div className="rounded-md border border-primary bg-primary p-3">
                  <p className="text-primary text-sm">
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                    This job involves {properties.length} properties.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No property assigned
              {isEditMode && (
                <Button className="ml-2" size="sm" variant="outline">
                  Add Property
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule & Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Schedule & Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Scheduled Start</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDateOrFallback(
                    localJob.scheduled_start,
                    "datetime",
                    "Not set"
                  )}
                </span>
              </div>
            </div>

            <div>
              <Label>Scheduled End</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDateOrFallback(
                    localJob.scheduled_end,
                    "datetime",
                    "Not set"
                  )}
                </span>
              </div>
            </div>
          </div>

          {(localJob.actual_start || localJob.actual_end) && (
            <>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                {localJob.actual_start && (
                  <div>
                    <Label>Actual Start</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-success" />
                      <span className="text-sm">
                        {formatDateOrFallback(
                          localJob.actual_start,
                          "datetime",
                          "Not set"
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {localJob.actual_end && (
                  <div>
                    <Label>Actual End</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-success" />
                      <span className="text-sm">
                        {formatDateOrFallback(
                          localJob.actual_end,
                          "datetime",
                          "Not set"
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Financials Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Financial Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground text-xs">
                Total Amount
              </Label>
              <p className="font-bold text-2xl">
                {formatCurrency(localJob.total_amount || 0, { decimals: 0 })}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">
                Paid Amount
              </Label>
              <p className="font-bold text-2xl text-success">
                {formatCurrency(localJob.paid_amount || 0, { decimals: 0 })}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">
                Outstanding
              </Label>
              <p className="font-bold text-2xl text-warning">
                {formatCurrency(
                  (localJob.total_amount || 0) - (localJob.paid_amount || 0),
                  { decimals: 0 }
                )}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button className="w-full" variant="outline">
              View Detailed Financials →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Details (if applicable) */}
      {(localJob.job_warranty_info || localJob.job_service_agreement_id) && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Service Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {localJob.job_warranty_info && (
              <div>
                <Label>Warranty Information</Label>
                <p className="text-muted-foreground text-sm">
                  {JSON.stringify(localJob.job_warranty_info)}
                </p>
              </div>
            )}

            {localJob.job_service_agreement_id && (
              <div>
                <Label>Service Agreement</Label>
                <Button className="h-auto p-0" variant="link">
                  View Agreement Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
