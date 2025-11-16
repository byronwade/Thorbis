/**
 * Invoice Overdue Banner
 *
 * Prominent alert banner for overdue invoices with quick pay action
 */

"use client";

import { AlertTriangle, Clock, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOverdueStatus } from "@/lib/utils/invoice-overdue";

type InvoiceOverdueBannerProps = {
  dueDate: string | null;
  balanceAmount: number;
  onQuickPay?: () => void;
};

export function InvoiceOverdueBanner({
  dueDate,
  balanceAmount,
  onQuickPay,
}: InvoiceOverdueBannerProps) {
  const overdueStatus = getOverdueStatus(dueDate, balanceAmount);

  // Don't show banner if not overdue
  if (!overdueStatus.showBanner) {
    return null;
  }

  // Format amount
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // Get icon based on urgency
  const getIcon = () => {
    if (
      overdueStatus.urgency === "severe" ||
      overdueStatus.urgency === "critical"
    ) {
      return <AlertTriangle className="h-6 w-6" />;
    }
    return <Clock className="h-6 w-6" />;
  };

  // Animation classes based on urgency
  const getAnimationClass = () => {
    if (overdueStatus.urgency === "severe") {
      return "animate-pulse";
    }
    if (overdueStatus.urgency === "critical") {
      return "animate-pulse";
    }
    return "";
  };

  return (
    <Alert
      className={`mb-6 border-2 ${overdueStatus.colors.bg} ${overdueStatus.colors.border} ${getAnimationClass()}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`shrink-0 ${overdueStatus.colors.text}`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1">
          <AlertTitle
            className={`mb-2 flex items-center gap-2 font-bold text-lg ${overdueStatus.colors.text}`}
          >
            <span>PAST DUE</span>
            <Badge className={overdueStatus.colors.badge}>
              {overdueStatus.daysOverdue} day
              {overdueStatus.daysOverdue === 1 ? "" : "s"} overdue
            </Badge>
          </AlertTitle>
          <AlertDescription
            className={`space-y-2 ${overdueStatus.colors.text}`}
          >
            <p className="text-base">{overdueStatus.message}</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium text-sm">Amount Due:</p>
                <p className="font-bold text-3xl">
                  {formatCurrency(balanceAmount)}
                </p>
              </div>
            </div>
          </AlertDescription>
        </div>

        {/* Quick Pay Button */}
        <div className="shrink-0">
          <Button
            className={`
              ${overdueStatus.urgency === "severe" ? "animate-bounce" : ""}
              ${overdueStatus.urgency === "critical" ? "animate-pulse" : ""}bg-primary text-primary-foreground hover:bg-primary/90`}
            onClick={onQuickPay}
            size="lg"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Now
          </Button>
        </div>
      </div>
    </Alert>
  );
}
