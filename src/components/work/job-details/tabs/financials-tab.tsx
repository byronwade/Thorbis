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

import {
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  PieChart,
  Plus,
  Receipt,
  Send,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type FinancialsTabProps = {
  job: any;
  invoices: any[];
  estimates: any[];
  metrics: any;
  isEditMode: boolean;
};

export function FinancialsTab({
  job,
  invoices,
  estimates,
  metrics,
  isEditMode,
}: FinancialsTabProps) {
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
                <p className="text-muted-foreground text-xs">Job Value</p>
                <p className="font-bold text-2xl">
                  {formatCurrency(job.total_amount || 0, { decimals: 2 })}
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
                <p className="text-muted-foreground text-xs">Paid</p>
                <p className="font-bold text-2xl text-success">
                  {formatCurrency(totalPaid, { decimals: 2 })}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Outstanding</p>
                <p className="font-bold text-2xl text-warning">
                  {formatCurrency(totalOutstanding, { decimals: 2 })}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs">Profit</p>
                <p className="font-bold text-2xl text-primary">
                  {formatCurrency(metrics.totalAmount - metrics.materialsCost, {
                    decimals: 2,
                  })}
                </p>
                <p className="text-muted-foreground text-xs">
                  {metrics.profitMargin.toFixed(2)}% margin
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
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
                      {formatDate(invoice.created_at, "short")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total_amount || 0, {
                        decimals: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-success">
                      {formatCurrency(invoice.paid_amount || 0, {
                        decimals: 2,
                      })}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        (invoice.total_amount || 0) -
                          (invoice.paid_amount || 0) >
                          0
                          ? "text-warning"
                          : "text-success"
                      )}
                    >
                      {formatCurrency(
                        (invoice.total_amount || 0) -
                          (invoice.paid_amount || 0),
                        { decimals: 2 }
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status)}>
                        {invoice.status?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No invoices created yet
              {isEditMode && (
                <Button className="mt-2 ml-2" size="sm" variant="outline">
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
                      {formatDate(estimate.created_at, "short")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(estimate.total_amount || 0, {
                        decimals: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {estimate.valid_until
                        ? formatDate(estimate.valid_until, "short")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(estimate.status)}>
                        {estimate.status?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        {estimate.status === "approved" && (
                          <Button size="sm" variant="ghost">
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
            <div className="text-center text-muted-foreground text-sm">
              No estimates created
              {isEditMode && (
                <Button className="mt-2 ml-2" size="sm" variant="outline">
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
                <span className="text-muted-foreground text-sm">Revenue</span>
                <span className="font-medium">
                  {formatCurrency(metrics.totalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Materials Cost
                </span>
                <span className="font-medium">
                  {formatCurrency(metrics.materialsCost)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Labor Hours
                </span>
                <span className="font-medium">
                  {metrics.totalLaborHours.toFixed(2)}h
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Gross Profit</span>
                <span className="font-bold text-lg text-success">
                  {formatCurrency(metrics.totalAmount - metrics.materialsCost)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Profit Margin</span>
                <span className="font-bold text-lg text-primary">
                  {metrics.profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold text-sm">Cost Breakdown</h4>
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
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-warning"
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
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-success"
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
                <p className="font-medium text-sm">Payment Terms</p>
                <p className="text-muted-foreground text-sm">
                  {job.payment_terms}
                </p>
              </div>
            )}

            {job.deposit_amount > 0 && (
              <div>
                <p className="font-medium text-sm">Deposit</p>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(job.deposit_amount)}
                  </p>
                  {job.deposit_paid_at && (
                    <Badge className="text-xs" variant="default">
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
            <Button size="sm" variant="outline">
              Record Payment
            </Button>
            <Button size="sm" variant="outline">
              Send Invoice Reminder
            </Button>
            <Button size="sm" variant="outline">
              Generate Statement
            </Button>
            <Button size="sm" variant="outline">
              Apply Discount
            </Button>
            <Button size="sm" variant="outline">
              Set Payment Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
