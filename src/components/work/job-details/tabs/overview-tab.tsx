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

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Clock,
  FileText,
  Shield,
  Wrench,
  AlertCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJobEditorStore } from "@/lib/stores/job-editor-store";
import { TeamMemberSelector } from "../team-member-selector";

interface OverviewTabProps {
  job: any;
  customer: any;
  customers: any[];
  property: any;
  properties: any[];
  propertyEnrichment: any;
  isEditMode: boolean;
}

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

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

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
            <Badge variant={localJob.status === "completed" ? "default" : "secondary"}>
              {localJob.status?.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Number (readonly) */}
          <div>
            <Label>Job Number</Label>
            <Input
              value={localJob.job_number || ""}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={localJob.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              disabled={!isEditMode}
              placeholder="Enter job title..."
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={localJob.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              disabled={!isEditMode}
              placeholder="Enter job description..."
              rows={4}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Status</Label>
              <Select
                value={localJob.status || "quoted"}
                onValueChange={(value) => handleFieldChange("status", value)}
                disabled={!isEditMode}
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
                value={localJob.priority || "medium"}
                onValueChange={(value) => handleFieldChange("priority", value)}
                disabled={!isEditMode}
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
                value={localJob.job_type || ""}
                onChange={(e) => handleFieldChange("job_type", e.target.value)}
                disabled={!isEditMode}
                placeholder="e.g., Installation, Repair, Maintenance"
              />
            </div>

            <div>
              <Label>Service Type</Label>
              <Input
                value={localJob.service_type || ""}
                onChange={(e) => handleFieldChange("service_type", e.target.value)}
                disabled={!isEditMode}
                placeholder="e.g., HVAC, Plumbing, Electrical"
              />
            </div>
          </div>

          {/* Team Assignments */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Team Assigned
            </Label>
            <TeamMemberSelector jobId={job.id} isEditMode={isEditMode} />
          </div>

          <Separator />

          {/* Internal Notes */}
          <div>
            <Label>Internal Notes</Label>
            <Textarea
              value={localJob.notes || ""}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              disabled={!isEditMode}
              placeholder="Internal notes (not visible to customer)..."
              rows={3}
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
                  <h3 className="text-lg font-semibold">
                    {customer.first_name} {customer.last_name}
                  </h3>
                  {customer.company_name && (
                    <p className="text-sm text-muted-foreground">
                      {customer.company_name}
                    </p>
                  )}
                </div>
                {isEditMode && (
                  <Button variant="outline" size="sm">
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
                      href={`mailto:${customer.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {customer.email}
                    </a>
                  </div>
                )}

                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Customer Address */}
              {customer.address && (
                <div>
                  <Label className="text-xs text-muted-foreground">
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
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-900">
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                    This job has {customers.length} customers assigned.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No customer assigned
              {isEditMode && (
                <Button variant="outline" size="sm" className="ml-2">
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
                  <h3 className="text-lg font-semibold">
                    {property.name || "Service Location"}
                  </h3>
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      <p>{property.address}</p>
                      {property.address2 && <p>{property.address2}</p>}
                      <p>
                        {property.city}, {property.state} {property.zip_code}
                      </p>
                    </div>
                  </div>
                </div>
                {isEditMode && (
                  <Button variant="outline" size="sm">
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
                      <Label className="text-xs text-muted-foreground">
                        Square Footage
                      </Label>
                      <p className="text-sm font-medium">
                        {propertyEnrichment.squareFootage.toLocaleString()} sq ft
                      </p>
                    </div>
                  )}

                  {propertyEnrichment.yearBuilt && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Year Built
                      </Label>
                      <p className="text-sm font-medium">
                        {propertyEnrichment.yearBuilt}
                      </p>
                    </div>
                  )}

                  {propertyEnrichment.propertyType && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Property Type
                      </Label>
                      <p className="text-sm font-medium capitalize">
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
                  <p className="text-sm text-muted-foreground">
                    {property.notes}
                  </p>
                </div>
              )}

              {/* Multiple Properties Indicator */}
              {properties.length > 1 && (
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-900">
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                    This job involves {properties.length} properties.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No property assigned
              {isEditMode && (
                <Button variant="outline" size="sm" className="ml-2">
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
                  {formatDate(localJob.scheduled_start)}
                </span>
              </div>
            </div>

            <div>
              <Label>Scheduled End</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(localJob.scheduled_end)}
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
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        {formatDate(localJob.actual_start)}
                      </span>
                    </div>
                  </div>
                )}

                {localJob.actual_end && (
                  <div>
                    <Label>Actual End</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        {formatDate(localJob.actual_end)}
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
              <Label className="text-xs text-muted-foreground">
                Total Amount
              </Label>
              <p className="text-2xl font-bold">
                {formatCurrency(localJob.total_amount || 0)}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Paid Amount
              </Label>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(localJob.paid_amount || 0)}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Outstanding
              </Label>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(
                  (localJob.total_amount || 0) - (localJob.paid_amount || 0)
                )}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full">
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
                <p className="text-sm text-muted-foreground">
                  {JSON.stringify(localJob.job_warranty_info)}
                </p>
              </div>
            )}

            {localJob.job_service_agreement_id && (
              <div>
                <Label>Service Agreement</Label>
                <Button variant="link" className="h-auto p-0">
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
