"use client";

/**
 * Pay Invoice Dialog
 *
 * Allows customers to pay invoices with:
 * - Saved payment methods
 * - New credit/debit card
 * - Real-time Stripe payment processing
 * - Database updates after successful payment
 */

import { AlertCircle, Check, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getInvoicePaymentDetails,
  payInvoiceWithSavedCard,
} from "@/actions/invoice-payments";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface PayInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  onSuccess?: () => void;
}

export function PayInvoiceDialog({
  open,
  onOpenChange,
  invoiceId,
  onSuccess,
}: PayInvoiceDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [invoice, setInvoice] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"saved" | "new">("saved");

  // New card fields
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpMonth, setNewCardExpMonth] = useState("");
  const [newCardExpYear, setNewCardExpYear] = useState("");
  const [newCardCvc, setNewCardCvc] = useState("");

  useEffect(() => {
    if (open) {
      loadPaymentDetails();
    }
  }, [open, invoiceId]);

  const loadPaymentDetails = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getInvoicePaymentDetails(invoiceId);

    if (result.success) {
      setInvoice(result.invoice);
      setPaymentMethods(result.paymentMethods || []);

      // Auto-select default payment method
      const defaultMethod = result.paymentMethods?.find(
        (pm: any) => pm.is_default
      );
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
        setPaymentMode("saved");
      } else if (result.paymentMethods && result.paymentMethods.length > 0) {
        setSelectedPaymentMethod(result.paymentMethods[0].id);
        setPaymentMode("saved");
      } else {
        setPaymentMode("new");
      }
    } else {
      setError(result.error || "Failed to load payment details");
    }

    setIsLoading(false);
  };

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  const handlePayWithSavedCard = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const result = await payInvoiceWithSavedCard({
      invoiceId,
      paymentMethodId: selectedPaymentMethod,
    });

    setIsProcessing(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
      }, 2000);
    } else {
      setError(result.error || "Payment failed");
    }
  };

  const handlePayWithNewCard = async () => {
    // Validate card fields
    if (!(newCardNumber && newCardExpMonth && newCardExpYear && newCardCvc)) {
      setError("Please fill in all card details");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // TODO: Integrate with Stripe.js to create payment method securely
    // For now, show a message
    setIsProcessing(false);
    setError(
      "New card payment integration coming soon! Please use a saved card or contact support."
    );
  };

  const handlePay = () => {
    if (paymentMode === "saved") {
      handlePayWithSavedCard();
    } else {
      handlePayWithNewCard();
    }
  };

  if (isLoading) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (success) {
    return (
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
              <Check className="size-8 text-success" />
            </div>
            <h3 className="mb-2 font-semibold text-lg">Payment Successful!</h3>
            <p className="text-center text-muted-foreground text-sm">
              Your payment of {formatCurrency(invoice?.balance_amount || 0)} has
              been processed.
            </p>
            <p className="mt-1 text-center text-muted-foreground text-sm">
              Invoice {invoice?.invoice_number} is now paid in full.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Pay Invoice</DialogTitle>
          <DialogDescription>
            Invoice {invoice?.invoice_number} •{" "}
            {formatCurrency(invoice?.balance_amount || 0)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  {invoice?.title || "Invoice Payment"}
                </p>
                <p className="text-muted-foreground text-xs">
                  Due:{" "}
                  {invoice?.due_date
                    ? new Date(invoice.due_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatCurrency(invoice?.balance_amount || 0)}
                </p>
                <Badge
                  className="text-xs"
                  variant={
                    invoice?.status === "overdue" ? "destructive" : "secondary"
                  }
                >
                  {invoice?.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="font-semibold text-base">Payment Method</Label>

            <RadioGroup
              onValueChange={(v: any) => setPaymentMode(v)}
              value={paymentMode}
            >
              {/* Saved Cards */}
              {paymentMethods.length > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="saved" value="saved" />
                    <Label
                      className="cursor-pointer font-normal"
                      htmlFor="saved"
                    >
                      Use Saved Card
                    </Label>
                  </div>

                  {paymentMode === "saved" && (
                    <div className="ml-6 space-y-2">
                      <RadioGroup
                        onValueChange={setSelectedPaymentMethod}
                        value={selectedPaymentMethod}
                      >
                        {paymentMethods.map((pm: any) => (
                          <div
                            className={cn(
                              "flex items-center space-x-3 rounded-lg border p-3 transition-all",
                              selectedPaymentMethod === pm.id &&
                                "border-primary bg-primary/5"
                            )}
                            key={pm.id}
                          >
                            <RadioGroupItem id={pm.id} value={pm.id} />
                            <Label
                              className="flex flex-1 cursor-pointer items-center justify-between"
                              htmlFor={pm.id}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">💳</span>
                                <div>
                                  <p className="font-medium text-sm">
                                    {pm.card_brand.toUpperCase()} ••••{" "}
                                    {pm.card_last4}
                                  </p>
                                  <p className="text-muted-foreground text-xs">
                                    Expires{" "}
                                    {String(pm.card_exp_month).padStart(2, "0")}
                                    /{pm.card_exp_year}
                                    {pm.nickname && ` • ${pm.nickname}`}
                                  </p>
                                </div>
                              </div>
                              {pm.is_default && (
                                <Badge className="text-xs" variant="secondary">
                                  Default
                                </Badge>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </>
              )}

              {/* New Card */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="new" value="new" />
                <Label className="cursor-pointer font-normal" htmlFor="new">
                  Pay with New Card
                </Label>
              </div>

              {paymentMode === "new" && (
                <div className="ml-6 space-y-4 rounded-lg border p-4">
                  <Alert>
                    <AlertCircle className="size-4" />
                    <AlertDescription className="text-xs">
                      <strong>Test Card:</strong> 4242 4242 4242 4242 (any CVC,
                      future date)
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input
                      maxLength={19}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      type="text"
                      value={newCardNumber}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Month</Label>
                      <Input
                        maxLength={2}
                        onChange={(e) => setNewCardExpMonth(e.target.value)}
                        placeholder="MM"
                        type="text"
                        value={newCardExpMonth}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        maxLength={4}
                        onChange={(e) => setNewCardExpYear(e.target.value)}
                        placeholder="YYYY"
                        type="text"
                        value={newCardExpYear}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input
                        maxLength={4}
                        onChange={(e) => setNewCardCvc(e.target.value)}
                        placeholder="123"
                        type="text"
                        value={newCardCvc}
                      />
                    </div>
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={isProcessing}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={
              isProcessing ||
              (paymentMode === "saved" && !selectedPaymentMethod)
            }
            onClick={handlePay}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 size-4" />
                Pay {formatCurrency(invoice?.balance_amount || 0)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
