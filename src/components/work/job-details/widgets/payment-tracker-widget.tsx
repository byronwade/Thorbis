/**
 * Payment Tracker Widget - Server Component
 *
 * Visual payment status with progress tracking and payment milestones.
 * Shows payment schedule, amounts, and status.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static rendering for better performance
 * - Currency formatting utilities
 */

import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

interface PaymentTrackerWidgetProps {
  job: Job;
}

function formatCurrency(cents: number | null): string {
  if (!cents) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function PaymentTrackerWidget({ job }: PaymentTrackerWidgetProps) {
  const totalAmount = job.totalAmount || 0;
  const paidAmount = job.paidAmount || 0;
  const remainingAmount = totalAmount - paidAmount;
  const percentagePaid = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  // Mock payment milestones (in production, fetch from database)
  const paymentMilestones = [
    {
      id: "1",
      name: "Deposit",
      amount: totalAmount * 0.3,
      dueDate: job.createdAt,
      status: paidAmount >= totalAmount * 0.3 ? "paid" : "pending",
    },
    {
      id: "2",
      name: "Progress Payment",
      amount: totalAmount * 0.4,
      dueDate: job.scheduledStart,
      status:
        paidAmount >= totalAmount * 0.7
          ? "paid"
          : paidAmount >= totalAmount * 0.3
            ? "due"
            : "upcoming",
    },
    {
      id: "3",
      name: "Final Payment",
      amount: totalAmount * 0.3,
      dueDate: job.scheduledEnd,
      status:
        paidAmount >= totalAmount
          ? "paid"
          : paidAmount >= totalAmount * 0.7
            ? "due"
            : "upcoming",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Payment Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-sm">Payment Progress</span>
          <span className="font-bold text-base">
            {Math.round(percentagePaid)}%
          </span>
        </div>
        <Progress className="h-3" value={percentagePaid} />
      </div>

      {/* Payment Summary */}
      <div className="space-y-2 rounded-lg bg-muted/30 p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Contract:</span>
          <span className="font-semibold">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Paid:</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(paidAmount)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Remaining:</span>
          <span className="font-bold text-orange-600">
            {formatCurrency(remainingAmount)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Payment Milestones */}
      <div className="space-y-1">
        <h5 className="font-medium text-sm">Payment Milestones</h5>
        <div className="space-y-3">
          {paymentMilestones.map((milestone) => {
            const StatusIcon =
              milestone.status === "paid"
                ? CheckCircle2
                : milestone.status === "due"
                  ? AlertCircle
                  : milestone.status === "upcoming"
                    ? Circle
                    : Clock;

            const statusColor =
              milestone.status === "paid"
                ? "text-green-600"
                : milestone.status === "due"
                  ? "text-orange-600"
                  : "text-muted-foreground";

            return (
              <div
                className="flex items-start gap-2 text-sm"
                key={milestone.id}
              >
                <StatusIcon
                  className={`mt-0.5 size-4 shrink-0 ${statusColor}`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{milestone.name}</span>
                    <Badge
                      className="text-xs"
                      variant={
                        milestone.status === "paid"
                          ? "default"
                          : milestone.status === "due"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {milestone.dueDate
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                          }).format(new Date(milestone.dueDate))
                        : "TBD"}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(milestone.amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {remainingAmount > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <Button asChild className="w-full" size="sm" variant="default">
              <Link href={`/dashboard/work/${job.id}/payments/new`}>
                <DollarSign className="mr-2 size-4" />
                Record Payment
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
