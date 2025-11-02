/**
 * Porting Status Dashboard
 *
 * Comprehensive porting request tracking with:
 * - Visual timeline showing all stages
 * - Real-time status updates
 * - Estimated completion countdown
 * - Troubleshooting guide
 * - Support contact options
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Porting request status types
type PortingStatus =
  | "submitted"
  | "pending_validation"
  | "validation_failed"
  | "foc_pending"
  | "foc_received"
  | "in_progress"
  | "porting_complete"
  | "cancelled"
  | "failed";

// Timeline stage definition
type TimelineStage = {
  id: string;
  label: string;
  description: string;
  status: "completed" | "current" | "pending" | "failed";
  completedAt?: string;
  estimatedDate?: string;
};

// Porting request type
type PortingRequest = {
  id: string;
  phoneNumber: string;
  currentCarrier: string;
  accountNumber: string;
  status: PortingStatus;
  createdAt: string;
  estimatedCompletionDate: string;
  focDate?: string;
  actualCompletionDate?: string;
  failureReason?: string;
  currentStage: number;
  stages: TimelineStage[];
};

// Mock data - will be replaced with real data from server actions
const mockPortingRequests: PortingRequest[] = [
  {
    id: "port_1",
    phoneNumber: "+18314306011",
    currentCarrier: "Verizon",
    accountNumber: "12345678",
    status: "in_progress",
    createdAt: "2025-01-29T10:00:00Z",
    estimatedCompletionDate: "2025-02-07T17:00:00Z",
    focDate: "2025-02-05T09:00:00Z",
    currentStage: 2,
    stages: [
      {
        id: "submitted",
        label: "Request Submitted",
        description: "Your porting request has been received and is being processed",
        status: "completed",
        completedAt: "2025-01-29T10:00:00Z",
      },
      {
        id: "validation",
        label: "Validation Complete",
        description: "Account details verified with your current carrier",
        status: "completed",
        completedAt: "2025-01-30T14:30:00Z",
      },
      {
        id: "foc",
        label: "FOC Received",
        description: "Firm Order Commitment confirmed by carrier",
        status: "current",
        estimatedDate: "2025-02-05T09:00:00Z",
      },
      {
        id: "porting",
        label: "Porting in Progress",
        description: "Number is being transferred to Telnyx",
        status: "pending",
        estimatedDate: "2025-02-05T09:00:00Z",
      },
      {
        id: "complete",
        label: "Port Complete",
        description: "Your number is now active on Telnyx",
        status: "pending",
        estimatedDate: "2025-02-07T17:00:00Z",
      },
    ],
  },
  {
    id: "port_2",
    phoneNumber: "+16505550123",
    currentCarrier: "AT&T",
    accountNumber: "87654321",
    status: "validation_failed",
    createdAt: "2025-01-28T15:30:00Z",
    estimatedCompletionDate: "2025-02-06T17:00:00Z",
    failureReason: "Account number mismatch. Please verify your account number with AT&T.",
    currentStage: 1,
    stages: [
      {
        id: "submitted",
        label: "Request Submitted",
        description: "Your porting request has been received",
        status: "completed",
        completedAt: "2025-01-28T15:30:00Z",
      },
      {
        id: "validation",
        label: "Validation Failed",
        description: "Unable to verify account details",
        status: "failed",
        completedAt: "2025-01-29T11:00:00Z",
      },
      {
        id: "foc",
        label: "FOC Pending",
        description: "Awaiting carrier confirmation",
        status: "pending",
      },
      {
        id: "porting",
        label: "Porting in Progress",
        description: "Number transfer in progress",
        status: "pending",
      },
      {
        id: "complete",
        label: "Port Complete",
        description: "Number active on Telnyx",
        status: "pending",
      },
    ],
  },
];

export function PortingStatusDashboard() {
  const [requests, setRequests] = useState(mockPortingRequests);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Number Porting Status</h2>
        <p className="text-muted-foreground">
          Track the progress of your phone number port requests
        </p>
      </div>

      {/* Active Requests */}
      {requests.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <PortingRequestCard
              key={request.id}
              request={request}
              isExpanded={expandedRequest === request.id}
              onToggle={() =>
                setExpandedRequest(expandedRequest === request.id ? null : request.id)
              }
            />
          ))}
        </div>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="size-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" className="justify-start">
              <Mail className="mr-2 size-4" />
              Email Support
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="mr-2 size-4" />
              Live Chat
            </Button>
          </div>
          <Alert>
            <AlertTitle>Common Issues & Solutions</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Account number mismatch - Verify with current carrier</li>
                <li>• Address doesn't match - Must match billing address exactly</li>
                <li>• PIN/Password incorrect - Check account security settings</li>
                <li>• Number not portable - May be under contract or restricted</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function PortingRequestCard({
  request,
  isExpanded,
  onToggle,
}: {
  request: PortingRequest;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusColor = getStatusColor(request.status);
  const statusIcon = getStatusIcon(request.status);
  const progress = calculateProgress(request.currentStage, request.stages.length);
  const daysRemaining = calculateDaysRemaining(request.estimatedCompletionDate);

  return (
    <Card className={cn("transition-all", isExpanded && "ring-2 ring-primary")}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{formatPhoneNumber(request.phoneNumber)}</CardTitle>
              <Badge variant={statusColor as any} className="flex items-center gap-1">
                {statusIcon}
                {getStatusLabel(request.status)}
              </Badge>
            </div>
            <CardDescription>
              From {request.currentCarrier} • Submitted{" "}
              {new Date(request.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>

          <Button variant="ghost" size="icon" onClick={onToggle}>
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Estimated Completion */}
        {request.status !== "porting_complete" && request.status !== "failed" && (
          <div className="mb-4 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  {daysRemaining > 0
                    ? `Estimated completion in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`
                    : "Completing soon"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(request.estimatedCompletionDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Failure Alert */}
        {request.status === "validation_failed" && request.failureReason && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">{request.failureReason}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Update Information
                </Button>
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Completion Alert */}
        {request.status === "porting_complete" && (
          <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              Port Complete!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              <p className="mb-3">
                Your number is now active on Telnyx and ready to use. You can safely cancel your
                service with {request.currentCarrier}.
              </p>
              <Button size="sm" variant="outline">
                View Phone Number Settings
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Timeline (shown when expanded) */}
        {isExpanded && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">Porting Timeline</h4>
            <div className="space-y-4">
              {request.stages.map((stage, index) => (
                <TimelineStageItem
                  key={stage.id}
                  stage={stage}
                  isLast={index === request.stages.length - 1}
                />
              ))}
            </div>

            {/* Additional Details */}
            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <h5 className="mb-3 font-medium">Request Details</h5>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Request ID:</dt>
                  <dd className="font-mono">{request.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Current Carrier:</dt>
                  <dd>{request.currentCarrier}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Account Number:</dt>
                  <dd className="font-mono">***{request.accountNumber.slice(-4)}</dd>
                </div>
                {request.focDate && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">FOC Date:</dt>
                    <dd>{new Date(request.focDate).toLocaleDateString()}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 size-3" />
                Email Updates
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 size-3" />
                Carrier Portal
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TimelineStageItem({ stage, isLast }: { stage: TimelineStage; isLast: boolean }) {
  const getStageIcon = () => {
    switch (stage.status) {
      case "completed":
        return <CheckCircle2 className="size-5 text-green-600" />;
      case "current":
        return <Loader2 className="size-5 animate-spin text-blue-600" />;
      case "failed":
        return <XCircle className="size-5 text-red-600" />;
      default:
        return <div className="size-5 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const getStageColor = () => {
    switch (stage.status) {
      case "completed":
        return "border-green-600";
      case "current":
        return "border-blue-600";
      case "failed":
        return "border-red-600";
      default:
        return "border-muted";
    }
  };

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-[10px] top-8 w-0.5 h-[calc(100%+1rem)]",
            stage.status === "completed" ? "bg-green-600" : "bg-muted"
          )}
        />
      )}

      {/* Icon */}
      <div className="relative z-10">{getStageIcon()}</div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="font-medium">{stage.label}</div>
        <div className="text-sm text-muted-foreground">{stage.description}</div>

        {stage.completedAt && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3" />
            Completed {new Date(stage.completedAt).toLocaleDateString()} at{" "}
            {new Date(stage.completedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}

        {stage.estimatedDate && stage.status !== "completed" && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {stage.status === "current" ? "Expected" : "Estimated"}{" "}
            {new Date(stage.estimatedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Phone className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No porting requests</h3>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          You haven't submitted any number porting requests yet
        </p>
        <Button>
          <Phone className="mr-2 size-4" />
          Start Porting Process
        </Button>
      </CardContent>
    </Card>
  );
}

// Helper functions

function getStatusColor(status: PortingStatus): string {
  switch (status) {
    case "porting_complete":
      return "default";
    case "in_progress":
    case "foc_received":
    case "pending_validation":
      return "secondary";
    case "validation_failed":
    case "failed":
      return "destructive";
    case "cancelled":
      return "outline";
    default:
      return "secondary";
  }
}

function getStatusIcon(status: PortingStatus) {
  switch (status) {
    case "porting_complete":
      return <CheckCircle2 className="size-3" />;
    case "in_progress":
    case "foc_received":
    case "pending_validation":
      return <Loader2 className="size-3 animate-spin" />;
    case "validation_failed":
    case "failed":
      return <AlertCircle className="size-3" />;
    case "cancelled":
      return <XCircle className="size-3" />;
    default:
      return <Clock className="size-3" />;
  }
}

function getStatusLabel(status: PortingStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "pending_validation":
      return "Validating";
    case "validation_failed":
      return "Validation Failed";
    case "foc_pending":
      return "FOC Pending";
    case "foc_received":
      return "FOC Received";
    case "in_progress":
      return "In Progress";
    case "porting_complete":
      return "Complete";
    case "cancelled":
      return "Cancelled";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function calculateProgress(currentStage: number, totalStages: number): number {
  return Math.round((currentStage / totalStages) * 100);
}

function calculateDaysRemaining(estimatedDate: string): number {
  const now = new Date();
  const estimated = new Date(estimatedDate);
  const diffTime = estimated.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}
