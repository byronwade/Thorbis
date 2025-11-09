/**
 * Invoice Header Component
 *
 * Displays and allows editing of:
 * - Invoice number (auto-generated, non-editable)
 * - Invoice title
 * - Issue date
 * - Due date
 * - Linked job (if any)
 * - Overdue status with visual indicators
 */

"use client";

import { AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOverdueStatus } from "@/lib/utils/invoice-overdue";

type Invoice = {
  id: string;
  invoice_number: string;
  title: string;
  created_at: string;
  due_date: string | null;
  balance_amount: number;
  [key: string]: any;
};

interface InvoiceHeaderProps {
  invoice: Invoice;
  onUpdate: (field: string, value: any) => void;
  job?: { id: string; job_number: string; title: string } | null;
}

export function InvoiceHeader({ invoice, onUpdate, job }: InvoiceHeaderProps) {
  // Get overdue status
  const overdueStatus = getOverdueStatus(
    invoice.due_date,
    invoice.balance_amount
  );
  const isOverdue = overdueStatus.showBanner;

  // Format dates for input
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Format dates for display
  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      className={`mb-8 border-2 p-6 ${isOverdue ? overdueStatus.colors.bg : ""} ${isOverdue ? overdueStatus.colors.border : ""}`}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm">
              Invoice Number
            </Label>
            <div className="mt-1 font-bold font-mono text-2xl">
              {invoice.invoice_number}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Invoice Title</Label>
            <Input
              className="mt-1"
              id="title"
              onChange={(e) => onUpdate("title", e.target.value)}
              placeholder="e.g., HVAC System Installation"
              value={invoice.title || ""}
            />
          </div>

          {job && (
            <div>
              <Label className="text-muted-foreground text-sm">
                Linked Job
              </Label>
              <div className="mt-1">
                <Badge className="text-sm" variant="outline">
                  {job.job_number}: {job.title}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2" htmlFor="created_at">
              <Calendar className="h-4 w-4" />
              Issue Date
            </Label>
            <div className="mt-1 text-sm">
              {formatDateForDisplay(invoice.created_at)}
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2" htmlFor="due_date">
              <Calendar className="h-4 w-4" />
              Due Date
              {isOverdue && (
                <Badge className={overdueStatus.colors.badge}>
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {overdueStatus.daysOverdue}d overdue
                </Badge>
              )}
            </Label>
            <Input
              className={`mt-1 ${isOverdue ? "border-2 border-red-500" : ""}`}
              id="due_date"
              onChange={(e) => onUpdate("due_date", e.target.value)}
              type="date"
              value={formatDateForInput(invoice.due_date)}
            />
            {isOverdue && (
              <p
                className={`mt-1 font-medium text-sm ${overdueStatus.colors.text}`}
              >
                {overdueStatus.message}
              </p>
            )}
          </div>

          <div>
            <Label
              className={`text-sm ${isOverdue ? overdueStatus.colors.text + "font-bold" : "text-muted-foreground"}`}
            >
              {isOverdue ? "PAST DUE AMOUNT" : "Amount Due"}
            </Label>
            <div
              className={`mt-1 font-bold text-3xl ${isOverdue ? overdueStatus.colors.text : ""}`}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(invoice.balance_amount / 100)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
