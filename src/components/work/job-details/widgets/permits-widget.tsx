/**
 * Permits Widget - Server Component
 *
 * Displays permit information, status, and compliance tracking for the job.
 * Critical for construction, electrical, plumbing, and HVAC work.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

interface PermitsWidgetProps {
  job: Job;
}

// Permit status types
type PermitStatus =
  | "pending"
  | "submitted"
  | "approved"
  | "rejected"
  | "expired";

// Mock permit type (in production, fetch from permits table)
interface Permit {
  id: string;
  name: string;
  type: string;
  status: PermitStatus;
  permitNumber?: string;
  submittedDate?: Date;
  approvedDate?: Date;
  expiryDate?: Date;
  issuingAuthority: string;
  fee?: number;
  notes?: string;
}

export function PermitsWidget({ job }: PermitsWidgetProps) {
  // Mock permits (in production, fetch from database)
  const permits: Permit[] = [
    {
      id: "1",
      name: "Building Permit",
      type: "Building",
      status: "approved",
      permitNumber: "BP-2025-001234",
      submittedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      approvedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
      issuingAuthority: "City of San Francisco",
      fee: 250,
      notes: "Approved with standard conditions",
    },
    {
      id: "2",
      name: "Electrical Permit",
      type: "Electrical",
      status: "submitted",
      permitNumber: "EP-2025-005678",
      submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      issuingAuthority: "City of San Francisco",
      fee: 150,
      notes: "Awaiting review by electrical inspector",
    },
    {
      id: "3",
      name: "HVAC Permit",
      type: "HVAC",
      status: "pending",
      issuingAuthority: "City of San Francisco",
      fee: 200,
      notes: "Application in progress",
    },
  ];

  const statusConfig: Record<
    PermitStatus,
    {
      label: string;
      icon: typeof CheckCircle2;
      color: string;
      bgColor: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    pending: {
      label: "Pending",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
      variant: "outline",
    },
    submitted: {
      label: "Submitted",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
      variant: "secondary",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
      variant: "default",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
      variant: "destructive",
    },
    expired: {
      label: "Expired",
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-950",
      variant: "outline",
    },
  };

  // Calculate permit progress
  const totalPermits = permits.length;
  const approvedPermits = permits.filter((p) => p.status === "approved").length;
  const progressPercentage =
    totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0;

  function formatDate(date?: Date): string {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function getDaysUntilExpiry(date?: Date): number | null {
    if (!date) return null;
    const diffMs = date.getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  if (permits.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center">
        <div>
          <FileCheck className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
          <p className="mb-2 text-muted-foreground text-sm">
            No permits required
          </p>
          <p className="mb-3 text-muted-foreground text-xs">
            This job doesn't require any permits
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/work/${job.id}/permits`}>
              <FileText className="mr-2 size-4" />
              Add Permit
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Permits & Compliance</h4>
        <Badge className="text-xs" variant="secondary">
          {approvedPermits}/{totalPermits} approved
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Permit Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress className="h-2" value={progressPercentage} />
      </div>

      <Separator />

      {/* Permit List */}
      <div className="space-y-3">
        {permits.map((permit) => {
          const config = statusConfig[permit.status];
          const Icon = config.icon;
          const daysUntilExpiry = getDaysUntilExpiry(permit.expiryDate);
          const isExpiringSoon =
            daysUntilExpiry !== null && daysUntilExpiry <= 30;

          return (
            <div className="space-y-2 rounded-lg border p-3" key={permit.id}>
              {/* Permit Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className={`rounded-full p-1.5 ${config.bgColor}`}>
                    <Icon className={`size-4 ${config.color}`} />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{permit.name}</h5>
                    <p className="text-muted-foreground text-xs">
                      {permit.type}
                    </p>
                  </div>
                </div>
                <Badge className="text-xs" variant={config.variant}>
                  {config.label}
                </Badge>
              </div>

              {/* Permit Details */}
              <div className="ml-10 space-y-1.5 text-xs">
                {permit.permitNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Permit #:</span>
                    <span className="font-medium font-mono">
                      {permit.permitNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Authority:</span>
                  <span className="font-medium">{permit.issuingAuthority}</span>
                </div>

                {permit.submittedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="font-medium">
                      {formatDate(permit.submittedDate)}
                    </span>
                  </div>
                )}

                {permit.approvedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approved:</span>
                    <span className="font-medium text-green-600">
                      {formatDate(permit.approvedDate)}
                    </span>
                  </div>
                )}

                {permit.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span
                      className={`font-medium ${isExpiringSoon ? "text-orange-600" : ""}`}
                    >
                      {formatDate(permit.expiryDate)}
                      {isExpiringSoon && ` (${daysUntilExpiry}d)`}
                    </span>
                  </div>
                )}

                {permit.fee && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="font-medium">
                      ${permit.fee.toFixed(2)}
                    </span>
                  </div>
                )}

                {permit.notes && (
                  <div className="mt-2 rounded bg-muted p-2">
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {permit.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warnings */}
      {permits.some((p) => {
        const days = getDaysUntilExpiry(p.expiryDate);
        return days !== null && days <= 30;
      }) && (
        <>
          <Separator />
          <div className="flex items-start gap-2 rounded-lg border-orange-500 border-l-4 bg-orange-50 p-3 dark:bg-orange-950/30">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900 text-sm dark:text-orange-100">
                Permits Expiring Soon
              </p>
              <p className="text-orange-800 text-xs dark:text-orange-200">
                Some permits will expire within 30 days. Renew them to avoid
                delays.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <Separator />
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={`/dashboard/work/${job.id}/permits`}>
            <FileCheck className="mr-2 size-4" />
            Manage Permits
          </Link>
        </Button>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-muted p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Fees:</span>
          <span className="font-semibold">
            ${permits.reduce((sum, p) => sum + (p.fee || 0), 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
