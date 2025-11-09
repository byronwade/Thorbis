/**
 * Invoice Overdue Utility
 *
 * Provides visual styling and urgency levels for overdue invoices
 * based on how many days past due they are.
 */

export type OverdueLevel =
  | "current"
  | "1-day"
  | "7-days"
  | "15-days"
  | "30-days"
  | "60-days"
  | "90-days";

export interface OverdueStatus {
  level: OverdueLevel;
  daysOverdue: number;
  urgency: "none" | "low" | "medium" | "high" | "critical" | "severe";
  colors: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  message: string;
  showBanner: boolean;
  allowPayment: boolean;
}

/**
 * Calculate overdue status from due date
 */
export function getOverdueStatus(
  dueDate: string | null,
  balanceAmount: number
): OverdueStatus {
  // Not overdue if no balance or no due date
  if (!dueDate || balanceAmount <= 0) {
    return {
      level: "current",
      daysOverdue: 0,
      urgency: "none",
      colors: {
        bg: "bg-background",
        border: "border-border",
        text: "text-foreground",
        badge:
          "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      },
      message: "Current",
      showBanner: false,
      allowPayment: true,
    };
  }

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Not yet overdue
  if (diffDays <= 0) {
    return {
      level: "current",
      daysOverdue: 0,
      urgency: "none",
      colors: {
        bg: "bg-background",
        border: "border-border",
        text: "text-foreground",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      },
      message: `Due in ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"}`,
      showBanner: false,
      allowPayment: true,
    };
  }

  // 1 day overdue - Gentle reminder
  if (diffDays <= 1) {
    return {
      level: "1-day",
      daysOverdue: diffDays,
      urgency: "low",
      colors: {
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-900 dark:text-yellow-100",
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      },
      message: "Payment was due yesterday",
      showBanner: true,
      allowPayment: true,
    };
  }

  // 2-6 days overdue - Noticeable
  if (diffDays <= 7) {
    return {
      level: "7-days",
      daysOverdue: diffDays,
      urgency: "low",
      colors: {
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-300 dark:border-yellow-700",
        text: "text-yellow-900 dark:text-yellow-100",
        badge:
          "bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
      },
      message: `${diffDays} days overdue`,
      showBanner: true,
      allowPayment: true,
    };
  }

  // 8-14 days overdue - Getting concerning
  if (diffDays <= 15) {
    return {
      level: "15-days",
      daysOverdue: diffDays,
      urgency: "medium",
      colors: {
        bg: "bg-orange-50 dark:bg-orange-950/20",
        border: "border-orange-300 dark:border-orange-700",
        text: "text-orange-900 dark:text-orange-100",
        badge:
          "bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
      },
      message: `${diffDays} days overdue - Please remit payment soon`,
      showBanner: true,
      allowPayment: true,
    };
  }

  // 16-29 days overdue - Urgent
  if (diffDays <= 30) {
    return {
      level: "30-days",
      daysOverdue: diffDays,
      urgency: "high",
      colors: {
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-300 dark:border-red-700",
        text: "text-red-900 dark:text-red-100",
        badge: "bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100",
      },
      message: `${diffDays} days overdue - Immediate payment required`,
      showBanner: true,
      allowPayment: true,
    };
  }

  // 31-59 days overdue - Very urgent
  if (diffDays <= 60) {
    return {
      level: "60-days",
      daysOverdue: diffDays,
      urgency: "critical",
      colors: {
        bg: "bg-red-100 dark:bg-red-950/30",
        border: "border-red-400 dark:border-red-600",
        text: "text-red-950 dark:text-red-50",
        badge: "bg-red-300 text-red-950 dark:bg-red-800 dark:text-red-50",
      },
      message: `${diffDays} days overdue - Account may be sent to collections`,
      showBanner: true,
      allowPayment: true,
    };
  }

  // 60+ days overdue - Critical
  return {
    level: "90-days",
    daysOverdue: diffDays,
    urgency: "severe",
    colors: {
      bg: "bg-red-200 dark:bg-red-950/40",
      border: "border-red-500 dark:border-red-500",
      text: "text-red-950 dark:text-red-50",
      badge: "bg-red-500 text-white dark:bg-red-600 dark:text-white",
    },
    message: `${diffDays} days overdue - URGENT: Pay immediately to avoid collections`,
    showBanner: true,
    allowPayment: true,
  };
}

/**
 * Format currency with emphasis for large amounts
 */
export function formatOverdueAmount(
  cents: number,
  urgency: OverdueStatus["urgency"]
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

  return formatted;
}
