"use client";

/**
 * Modern Job Details Page - Clean Card-Based Layout
 *
 * Follows the pattern from team member details page:
 * - Simple card-based layout (no complex accordions)
 * - Clean sections for different data
 * - Easy to navigate and maintain
 * - Modern UI with proper spacing
 */

import {
  AlertCircle,
  Archive,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobQuickActions } from "./job-quick-actions";
import { TeamMemberSelector } from "./team-member-selector";

type JobPageModernProps = {
  entityData: any;
  metrics: any;
};

export function JobPageModern({ entityData, metrics }: JobPageModernProps) {
  const {
    job,
    customer,
    property,
    assignedUser,
    teamAssignments,
    invoices,
    estimates,
    payments,
  } = entityData;

  const isArchived = Boolean(job.archived_at);
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusVariant = (status: string) => {
    const statusMap: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      quoted: "secondary",
      scheduled: "default",
      in_progress: "default",
      completed: "default",
      cancelled: "destructive",
      on_hold: "outline",
    };
    return statusMap[status] || "secondary";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      quoted: "Quoted",
      scheduled: "Scheduled",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      on_hold: "On Hold",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 px-6 pt-4 pb-12">
      {/* Archive Notice */}
      {isArchived && (
        <div className="rounded-lg border border-warning bg-warning p-4 dark:border-warning dark:bg-warning/20">
          <div className="flex items-center gap-3">
            <Archive className="size-5 text-warning dark:text-warning" />
            <div>
              <p className="font-medium text-warning dark:text-warning">
                This job has been archived
              </p>
              <p className="text-sm text-warning dark:text-warning">
                Archived on {formatDate(job.archived_at)}. This job is read-only
                and doesn't appear in active job lists.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Job Header */}
      <div className="flex items-start gap-4 rounded-lg border bg-card p-6">
        <div className="flex size-20 items-center justify-center rounded-lg bg-primary/10">
          <Wrench className="size-10 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl">
              {job.title || "Untitled Job"}
            </h1>
            {isArchived && (
              <Badge className="border-warning text-warning" variant="outline">
                Archived
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            #{job.job_number || job.id.slice(0, 8)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={getStatusVariant(job.status)}>
              {getStatusLabel(job.status)}
            </Badge>
            {job.priority && (
              <Badge className="capitalize" variant="outline">
                <AlertCircle className="mr-1 size-3" />
                {job.priority} Priority
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <JobQuickActions currentStatus={job.status} jobId={job.id} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Amount</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {formatCurrency(metrics.totalAmount)}
            </div>
            <p className="text-muted-foreground text-xs">
              {metrics.paidAmount > 0 &&
                `${formatCurrency(metrics.paidAmount)} paid`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Balance Due</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {formatCurrency(metrics.totalAmount - metrics.paidAmount)}
            </div>
            <p className="text-muted-foreground text-xs">
              {invoices?.length || 0} invoice{invoices?.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Labor Hours</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{metrics.totalLaborHours}h</div>
            <p className="text-muted-foreground text-xs">
              {metrics.estimatedLaborHours > 0 &&
                `${metrics.estimatedLaborHours}h estimated`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Profit Margin</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {metrics.profitMargin.toFixed(1)}%
            </div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(
                (metrics.totalAmount * metrics.profitMargin) / 100
              )}{" "}
              profit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer & Property Section */}
      {(customer || property) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Card */}
          {customer && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Primary contact for this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      alt={`${customer.first_name} ${customer.last_name}`}
                      src={customer.avatar_url}
                    />
                    <AvatarFallback>
                      {customer.first_name?.[0]}
                      {customer.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link
                      className="font-medium text-foreground hover:text-primary"
                      href={`/dashboard/customers/${customer.id}`}
                    >
                      {customer.first_name} {customer.last_name}
                    </Link>
                    {customer.company_name && (
                      <p className="text-muted-foreground text-sm">
                        {customer.company_name}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {customer.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground text-xs uppercase">
                          Email
                        </p>
                        <p className="text-sm">{customer.email}</p>
                      </div>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="size-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground text-xs uppercase">
                          Phone
                        </p>
                        <p className="text-sm">{customer.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <Button asChild className="w-full" size="sm" variant="outline">
                  <Link href={`/dashboard/customers/${customer.id}`}>
                    View Customer Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Property Card */}
          {property && (
            <Card>
              <CardHeader>
                <CardTitle>Service Location</CardTitle>
                <CardDescription>Property details for this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{property.name || "Property"}</p>
                    <p className="text-muted-foreground text-sm">
                      {property.property_type || "Residential"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground text-xs uppercase">
                      Address
                    </p>
                    <p className="text-sm">
                      {property.address}
                      {property.unit && `, ${property.unit}`}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {property.city}, {property.state} {property.zip_code}
                    </p>
                  </div>
                </div>

                <Separator />

                <Button asChild className="w-full" size="sm" variant="outline">
                  <Link href={`/dashboard/work/properties/${property.id}`}>
                    View Property Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Team Assignment Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team Assigned</CardTitle>
          <CardDescription>Team members assigned to this job</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMemberSelector isEditMode={true} jobId={job.id} />
        </CardContent>
      </Card>

      {/* Job Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Service information and dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 font-medium text-muted-foreground text-xs uppercase">
                Service Type
              </p>
              <p className="text-sm">
                {job.service_type || job.job_type || "Not specified"}
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-muted-foreground text-xs uppercase">
                Priority
              </p>
              <p className="text-sm capitalize">{job.priority || "Normal"}</p>
            </div>
          </div>

          {job.description && (
            <>
              <Separator />
              <div>
                <p className="mb-2 font-medium text-muted-foreground text-xs uppercase">
                  Description
                </p>
                <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                  {job.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground text-xs uppercase">
                  Created
                </p>
                <p className="text-sm">{formatDate(job.created_at)}</p>
              </div>
            </div>
            {job.scheduled_date && (
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground text-xs uppercase">
                    Scheduled
                  </p>
                  <p className="text-sm">{formatDate(job.scheduled_date)}</p>
                </div>
              </div>
            )}
            {job.completed_at && (
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-muted-foreground text-xs uppercase">
                    Completed
                  </p>
                  <p className="text-sm">{formatDate(job.completed_at)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Invoices, estimates, and payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="mb-1 font-medium text-muted-foreground text-xs uppercase">
                Invoices
              </p>
              <p className="font-bold text-2xl">{invoices?.length || 0}</p>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(
                  invoices?.reduce(
                    (sum: number, inv: any) => sum + (inv.total || 0),
                    0
                  ) || 0
                )}
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-muted-foreground text-xs uppercase">
                Estimates
              </p>
              <p className="font-bold text-2xl">{estimates?.length || 0}</p>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(
                  estimates?.reduce(
                    (sum: number, est: any) => sum + (est.total || 0),
                    0
                  ) || 0
                )}
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium text-muted-foreground text-xs uppercase">
                Payments
              </p>
              <p className="font-bold text-2xl">{payments?.length || 0}</p>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(metrics.paidAmount)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button asChild className="flex-1" size="sm" variant="outline">
              <Link href={`/dashboard/invoices?jobId=${job.id}`}>
                View Invoices
              </Link>
            </Button>
            <Button asChild className="flex-1" size="sm" variant="outline">
              <Link href={`/dashboard/estimates?jobId=${job.id}`}>
                View Estimates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
