"use client";

import {
  Calendar,
  CreditCard,
  DollarSign,
  Loader2,
  Repeat,
} from "lucide-react";
import { useState } from "react";
import { createPaymentPlan } from "@/actions/payment-plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * Payment Plan Creator - Client Component
 *
 * Comprehensive payment plan creation:
 * - Down payment + scheduled payments
 * - Weekly, bi-weekly, monthly, quarterly schedules
 * - Interest calculation
 * - Late fees and grace periods
 * - Auto-payment via Stripe
 * - Preview payment schedule
 *
 * Power-user optimized for finance teams
 */

type PaymentPlanCreatorProps = {
  customerId: string;
  invoiceId?: string;
  invoiceAmount?: number;
  onSuccess?: (planId: string) => void;
  onCancel?: () => void;
};

export function PaymentPlanCreator({
  customerId,
  invoiceId,
  invoiceAmount = 0,
  onSuccess,
  onCancel,
}: PaymentPlanCreatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [planName, setPlanName] = useState("");
  const [totalAmount, setTotalAmount] = useState(invoiceAmount || 0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [paymentFrequency, setPaymentFrequency] = useState<
    "weekly" | "bi_weekly" | "monthly" | "quarterly"
  >("monthly");
  const [numberOfPayments, setNumberOfPayments] = useState(12);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [hasInterest, setHasInterest] = useState(false);
  const [interestRate, setInterestRate] = useState(0);
  const [setupFee, setSetupFee] = useState(0);
  const [lateFee, setLateFee] = useState(25);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  // Calculated values
  const financedAmount = totalAmount - downPaymentAmount;
  const paymentAmount =
    financedAmount > 0 ? Math.ceil(financedAmount / numberOfPayments) : 0;
  const downPaymentPercent =
    totalAmount > 0 ? (downPaymentAmount / totalAmount) * 100 : 0;

  // Calculate first and final payment dates
  const calculateDates = () => {
    const start = new Date(startDate);
    const first = new Date(start);
    const final = new Date(start);

    switch (paymentFrequency) {
      case "weekly":
        final.setDate(final.getDate() + (numberOfPayments - 1) * 7);
        break;
      case "bi_weekly":
        final.setDate(final.getDate() + (numberOfPayments - 1) * 14);
        break;
      case "monthly":
        final.setMonth(final.getMonth() + (numberOfPayments - 1));
        break;
      case "quarterly":
        final.setMonth(final.getMonth() + (numberOfPayments - 1) * 3);
        break;
    }

    return { first, final };
  };

  const { first: firstPaymentDate, final: finalPaymentDate } = calculateDates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("customerId", customerId);
      if (invoiceId) formData.set("invoiceId", invoiceId);
      if (planName) formData.set("planName", planName);
      formData.set("totalAmount", totalAmount.toString());
      formData.set("downPaymentAmount", downPaymentAmount.toString());
      formData.set("paymentFrequency", paymentFrequency);
      formData.set("numberOfPayments", numberOfPayments.toString());
      formData.set("startDate", startDate);
      formData.set("hasInterest", hasInterest ? "true" : "false");
      formData.set("interestRate", interestRate.toString());
      formData.set("setupFee", setupFee.toString());
      formData.set("lateFee", lateFee.toString());
      formData.set("gracePeriodDays", gracePeriodDays.toString());
      formData.set("autoPayEnabled", autoPayEnabled ? "true" : "false");
      formData.set("notes", notes);
      formData.set("terms", terms);

      const result = await createPaymentPlan(formData);

      if (result.success) {
        onSuccess?.(result.data);
      } else {
        setError(result.error || "Failed to create payment plan");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Plan Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            <CardTitle>Payment Plan Details</CardTitle>
          </div>
          <CardDescription>
            Configure the payment schedule and terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name (Optional)</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g., HVAC Installation - 12 Month Plan"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount *</Label>
              <Input
                id="totalAmount"
                type="number"
                min="1"
                step="0.01"
                value={totalAmount || ""}
                onChange={(e) =>
                  setTotalAmount(Number.parseFloat(e.target.value))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input
                id="downPayment"
                type="number"
                min="0"
                step="0.01"
                value={downPaymentAmount || ""}
                onChange={(e) =>
                  setDownPaymentAmount(Number.parseFloat(e.target.value))
                }
              />
              {downPaymentPercent > 0 && (
                <p className="text-muted-foreground text-xs">
                  {downPaymentPercent.toFixed(1)}% down payment
                </p>
              )}
            </div>
          </div>

          {/* Financed Amount Summary */}
          <div className="rounded-lg border bg-primary/5 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-xs">Down Payment</p>
                <p className="font-bold text-lg">
                  ${downPaymentAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Financed</p>
                <p className="font-bold text-lg">
                  ${financedAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Per Payment</p>
                <p className="font-bold text-lg">
                  ${paymentAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Repeat className="size-5 text-primary" />
            <CardTitle>Payment Schedule</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="frequency">Payment Frequency *</Label>
              <Select
                value={paymentFrequency}
                onValueChange={(value: any) => setPaymentFrequency(value)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi_weekly">Every 2 Weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPayments">Number of Payments *</Label>
              <Input
                id="numberOfPayments"
                type="number"
                min="1"
                max="60"
                value={numberOfPayments}
                onChange={(e) =>
                  setNumberOfPayments(Number.parseInt(e.target.value))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="font-mono"
            />
          </div>

          {/* Schedule Preview */}
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <p className="mb-2 font-medium">Payment Schedule Preview:</p>
            <div className="space-y-1 text-muted-foreground text-xs">
              <p>
                First Payment: {firstPaymentDate.toLocaleDateString()} - $
                {paymentAmount.toLocaleString()}
              </p>
              <p>
                Final Payment: {finalPaymentDate.toLocaleDateString()} - $
                {paymentAmount.toLocaleString()}
              </p>
              <p>
                Total Duration: {numberOfPayments}{" "}
                {paymentFrequency.replace("_", " ")} payments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees & Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fees & Interest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div>
              <Label htmlFor="hasInterest" className="text-sm font-medium">
                Charge Interest
              </Label>
              <p className="text-muted-foreground text-xs">
                Add interest to financed amount
              </p>
            </div>
            <Switch
              id="hasInterest"
              checked={hasInterest}
              onCheckedChange={setHasInterest}
            />
          </div>

          {hasInterest && (
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(Number.parseFloat(e.target.value))
                }
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="setupFee">Setup Fee</Label>
              <Input
                id="setupFee"
                type="number"
                min="0"
                step="0.01"
                value={setupFee}
                onChange={(e) => setSetupFee(Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lateFee">Late Fee</Label>
              <Input
                id="lateFee"
                type="number"
                min="0"
                step="0.01"
                value={lateFee}
                onChange={(e) => setLateFee(Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
              <Input
                id="gracePeriod"
                type="number"
                min="0"
                max="30"
                value={gracePeriodDays}
                onChange={(e) =>
                  setGracePeriodDays(Number.parseInt(e.target.value))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Payment */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            <CardTitle className="text-base">Auto-Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div>
              <Label htmlFor="autoPay" className="text-sm font-medium">
                Enable Auto-Payment
              </Label>
              <p className="text-muted-foreground text-xs">
                Automatically charge saved payment method on due dates
              </p>
            </div>
            <Switch
              id="autoPay"
              checked={autoPayEnabled}
              onCheckedChange={setAutoPayEnabled}
            />
          </div>

          {autoPayEnabled && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
              <p className="text-blue-900 dark:text-blue-100">
                Customer will need to set up their payment method in the
                customer portal. Automatic charges will occur on scheduled due
                dates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this payment plan..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              placeholder="Payment plan terms and conditions for customer..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary & Actions */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-base">Payment Plan Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-bold text-lg">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Down Payment</p>
              <p className="font-bold text-lg">
                ${downPaymentAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Financed Amount</p>
              <p className="font-bold text-lg">
                ${financedAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Amount</p>
              <p className="font-bold text-lg">
                ${paymentAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white/50 p-3 text-sm dark:bg-black/20">
            <p className="font-medium">
              {numberOfPayments} {paymentFrequency.replace("_", " ")} payments
              of ${paymentAmount.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-xs">
              Starting {firstPaymentDate.toLocaleDateString()}, ending{" "}
              {finalPaymentDate.toLocaleDateString()}
            </p>
            {lateFee > 0 && (
              <p className="mt-1 text-muted-foreground text-xs">
                ${lateFee} late fee after {gracePeriodDays} day grace period
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isLoading || financedAmount < 0}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create Payment Plan
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
