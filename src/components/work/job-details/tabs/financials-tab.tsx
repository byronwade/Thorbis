/**
 * Financials Tab - Complete Financial Overview
 *
 * Features:
 * - Invoices list with status
 * - Estimates management
 * - Payment tracking
 * - Profitability analysis
 * - Deposit tracking
 *
 * Performance:
 * - Client Component for interactivity
 * - Optimistic UI updates
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  FileText,
  TrendingUp,
  Receipt,
  CreditCard,
  PieChart,
  Plus,
  Eye,
  Download,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialsTabProps {
  job: any;
  invoices: any[];
  estimates: any[];
  metrics: any;
  isEditMode: boolean;
}

export function FinancialsTab({
  job,
  invoices,
  estimates,
  metrics,
  isEditMode,
}: FinancialsTabProps) {
  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Calculate totals
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + (inv.total_amount || 0),
    0
  );
  const totalPaid = invoices.reduce(
    (sum, inv) => sum + (inv.paid_amount || 0),
    0
  );
  const totalOutstanding = totalInvoiced - totalPaid;

  // Get invoice status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "overdue":
        return "destructive";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Job Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(job.total_amount || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(metrics.totalAmount - metrics.materialsCost)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metrics.profitMargin.toFixed(2)}% margin
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Invoices</CardTitle>
              <Badge variant="secondary">{invoices.length}</Badge>
            </div>
            {isEditMode && (
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(invoice.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total_amount || 0)}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(invoice.paid_amount || 0)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        (invoice.total_amount || 0) -
                          (invoice.paid_amount || 0) >
                          0
                          ? "text-orange-600"
                          : "text-green-600"
                      )}
                    >
                      {formatCurrency(
                        (invoice.total_amount || 0) -
                          (invoice.paid_amount || 0)
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status)}>
                        {invoice.status?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No invoices created yet
              {isEditMode && (
                <Button variant="outline" size="sm" className="ml-2 mt-2">
                  Create First Invoice
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estimates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Estimates</CardTitle>
              <Badge variant="secondary">{estimates.length}</Badge>
            </div>
            {isEditMode && (
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Estimate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {estimates && estimates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estimate #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell className="font-medium">
                      {estimate.estimate_number}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(estimate.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(estimate.total_amount || 0)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {estimate.valid_until
                        ? formatDate(estimate.valid_until)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(estimate.status)}>
                        {estimate.status?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {estimate.status === "approved" && (
                          <Button variant="ghost" size="sm">
                            Convert to Job
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No estimates created
              {isEditMode && (
                <Button variant="outline" size="sm" className="ml-2 mt-2">
                  Create First Estimate
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profitability Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profitability Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium">
                  {formatCurrency(metrics.totalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Materials Cost
                </span>
                <span className="font-medium">
                  {formatCurrency(metrics.materialsCost)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Labor Hours
                </span>
                <span className="font-medium">
                  {metrics.totalLaborHours.toFixed(2)}h
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Gross Profit</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(
                    metrics.totalAmount - metrics.materialsCost
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Profit Margin</span>
                <span className="text-lg font-bold text-blue-600">
                  {metrics.profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">Cost Breakdown</h4>
              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Materials</span>
                    <span>
                      {(
                        (metrics.materialsCost / metrics.totalAmount) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: `${
                          (metrics.materialsCost / metrics.totalAmount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Profit</span>
                    <span>{metrics.profitMargin.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${metrics.profitMargin}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms & Deposit Info */}
          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            {job.payment_terms && (
              <div>
                <p className="text-sm font-medium">Payment Terms</p>
                <p className="text-sm text-muted-foreground">
                  {job.payment_terms}
                </p>
              </div>
            )}

            {job.deposit_amount > 0 && (
              <div>
                <p className="text-sm font-medium">Deposit</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(job.deposit_amount)}
                  </p>
                  {job.deposit_paid_at && (
                    <Badge variant="default" className="text-xs">
                      Paid {formatDate(job.deposit_paid_at)}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Record Payment
            </Button>
            <Button variant="outline" size="sm">
              Send Invoice Reminder
            </Button>
            <Button variant="outline" size="sm">
              Generate Statement
            </Button>
            <Button variant="outline" size="sm">
              Apply Discount
            </Button>
            <Button variant="outline" size="sm">
              Set Payment Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
