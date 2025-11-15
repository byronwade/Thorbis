/**
 * Manager/Owner Job Metrics
 * Shows job costing, profitability, and financial data
 */

"use client";

import { Calculator, Receipt, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type ManagerJobMetricsProps = {
  metrics: {
    totalEstimated?: number;
    totalInvoiced?: number;
    totalPaid?: number;
    totalCosts?: number;
    laborCosts?: number;
    materialCosts?: number;
    progressPayments?: Array<{
      id: string;
      amount: number;
      status: string;
      date: string;
    }>;
    estimatesTotal?: number;
    estimateCount?: number;
    profitMargin?: number;
    estimatedProfit?: number;
  };
};

export function ManagerJobMetrics({ metrics }: ManagerJobMetricsProps) {
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === null || amount === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = metrics.totalInvoiced || 0;
  const totalCosts = (metrics.laborCosts || 0) + (metrics.materialCosts || 0);
  const grossProfit = totalRevenue - totalCosts;
  const profitMargin =
    totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : "0";

  const outstandingBalance =
    (metrics.totalInvoiced || 0) - (metrics.totalPaid || 0);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Job Costing Overview */}
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
            <Calculator className="size-4" />
            Job Costing
          </button>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-96" side="bottom">
          <div className="space-y-4">
            {/* Header with visual indicator */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-base">Job Financials</h4>
                <p className="text-muted-foreground text-xs">
                  Complete financial overview
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 font-semibold text-xs ${
                  Number(profitMargin) >= 20
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : Number(profitMargin) >= 10
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {profitMargin}% Margin
              </div>
            </div>

            <Separator />

            {/* Revenue Section */}
            <div className="space-y-2">
              <h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Revenue
              </h5>
              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Invoiced</span>
                  <span className="font-semibold text-base">
                    {formatCurrency(metrics.totalInvoiced)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Paid</span>
                  <span className="font-semibold text-base text-green-600 dark:text-green-400">
                    {formatCurrency(metrics.totalPaid)}
                  </span>
                </div>
                {outstandingBalance > 0 && (
                  <div className="flex items-center justify-between border-border border-t pt-2">
                    <span className="font-medium text-sm">Outstanding</span>
                    <span className="font-bold text-amber-600 text-base dark:text-amber-400">
                      {formatCurrency(outstandingBalance)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Costs Section */}
            <div className="space-y-2">
              <h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Costs
              </h5>
              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Labor Costs</span>
                  <span className="font-medium">
                    {formatCurrency(metrics.laborCosts)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Material Costs</span>
                  <span className="font-medium">
                    {formatCurrency(metrics.materialCosts)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-border border-t pt-2">
                  <span className="font-medium text-sm">Total Costs</span>
                  <span className="font-bold text-base text-red-600 dark:text-red-400">
                    {formatCurrency(totalCosts)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profitability Section */}
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-muted-foreground text-xs">
                    Gross Profit
                  </span>
                  <span
                    className={`block font-bold text-xl ${
                      grossProfit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(grossProfit)}
                  </span>
                </div>
                <TrendingUp
                  className={`size-8 ${
                    grossProfit >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Estimates Total */}
      {(metrics.estimateCount ?? 0) > 0 && (metrics.estimatesTotal ?? 0) > 0 ? (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
              <Receipt className="size-4" />
              <span>
                {metrics.estimateCount} Estimate
                {metrics.estimateCount !== 1 ? "s" : ""} •{" "}
                {formatCurrency(metrics.estimatesTotal)}
              </span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-64" side="bottom">
            <div className="space-y-2">
              <div>
                <h4 className="font-semibold text-sm">Estimates</h4>
                <p className="text-muted-foreground text-xs">
                  Total estimated value for this job
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Estimated</span>
                <span className="font-semibold text-sm">
                  {formatCurrency(metrics.estimatesTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Number of Estimates</span>
                <span className="font-medium text-sm">
                  {metrics.estimateCount}
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : null}

      {/* Progress Payments */}
      {metrics.progressPayments && metrics.progressPayments.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
              <TrendingUp className="size-4" />
              <span>
                {metrics.progressPayments.length} Progress Payment
                {metrics.progressPayments.length !== 1 ? "s" : ""}
              </span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-80" side="bottom">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Progress Payments</h4>
                <p className="text-muted-foreground text-xs">
                  Milestone-based payment schedule
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                {metrics.progressPayments.map((payment, index) => (
                  <div
                    className="flex items-center justify-between rounded-md bg-muted/50 p-2"
                    key={payment.id}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        Payment {index + 1}
                      </span>
                      <Badge
                        className="capitalize"
                        variant={
                          payment.status === "paid"
                            ? "default"
                            : payment.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
