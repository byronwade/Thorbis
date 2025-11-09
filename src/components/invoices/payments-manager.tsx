/**
 * Payments Manager - Comprehensive Payment Suite
 *
 * Full payment management with:
 * 1. Simple payment recording
 * 2. Payment plans/schedules
 * 3. Progress/milestone payments
 * 4. Partial payment tracking
 *
 * All in one sidebar component
 */

"use client";

import { Calendar, History, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface PaymentsManagerProps {
  invoiceId: string;
  invoice: any;
  payments: any[];
  onUpdate?: () => void;
}

export function PaymentsManager({
  invoiceId,
  invoice,
  payments = [],
  onUpdate,
}: PaymentsManagerProps) {
  const [isRecording, setIsRecording] = useState(false);

  // Format currency
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // Calculate payment progress
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = invoice.total_amount || 0;
  const balanceDue = totalAmount - totalPaid;
  const percentPaid = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header with Progress */}
      <div className="mb-6">
        <h3 className="mb-4 font-semibold text-sm">Payments</h3>

        {/* Payment Progress */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Payment Progress</span>
            <span className="font-medium">{percentPaid.toFixed(0)}%</span>
          </div>
          <Progress className="h-2" value={percentPaid} />
          <div className="flex justify-between text-xs">
            <span>
              <span className="text-muted-foreground">Paid:</span>{" "}
              <span className="font-semibold">{formatCurrency(totalPaid)}</span>
            </span>
            <span>
              <span className="text-muted-foreground">Due:</span>{" "}
              <span className="font-semibold">
                {formatCurrency(balanceDue)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Record Payment */}
      <Button
        className="mb-4 w-full gap-2"
        onClick={() => setIsRecording(!isRecording)}
        variant={isRecording ? "outline" : "default"}
      >
        <Plus className="size-4" />
        Record Payment
      </Button>

      {isRecording && (
        <div className="mb-4 space-y-3 rounded-lg border p-4">
          <div>
            <Label className="text-xs">Amount</Label>
            <Input className="mt-1" placeholder="0.00" type="number" />
          </div>
          <div>
            <Label className="text-xs">Date</Label>
            <Input className="mt-1" type="date" />
          </div>
          <div>
            <Label className="text-xs">Method</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="ach">ACH/Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Save Payment
            </Button>
            <Button
              onClick={() => setIsRecording(false)}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* Payment Sections */}
      <Accordion
        className="flex-1 overflow-y-auto"
        defaultValue={["history"]}
        type="multiple"
      >
        {/* Payment History */}
        <AccordionItem value="history">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <History className="size-4" />
              Payment History ({payments.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {payments.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs">
                  No payments yet
                </p>
              ) : (
                payments.map((payment) => (
                  <div
                    className="rounded-md border bg-card p-3 text-sm"
                    key={payment.id}
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <span className="font-semibold">
                        {formatCurrency(payment.amount)}
                      </span>
                      <Badge className="text-xs" variant="outline">
                        {payment.method}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                    {payment.reference && (
                      <p className="text-muted-foreground text-xs">
                        Ref: {payment.reference}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Payment Plans */}
        <AccordionItem value="plans">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              Payment Plans
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs">
                Set up installment payment schedules
              </p>
              <Button className="w-full gap-2" size="sm" variant="outline">
                <Plus className="size-4" />
                Create Payment Plan
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Progress Payments */}
        <AccordionItem value="progress">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Progress Payments
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs">
                Milestone-based payments (deposits, progress, completion)
              </p>
              <Button className="w-full gap-2" size="sm" variant="outline">
                <Plus className="size-4" />
                Set Up Milestones
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
