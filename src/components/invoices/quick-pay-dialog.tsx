"use client";

/**
 * Quick Pay Dialog
 *
 * Simple payment dialog for quick payments from customer page:
 * - Shows invoice amount and default payment method
 * - One-click confirmation
 * - No card selection (uses default)
 * - Fast UX for routine payments
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Check,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getInvoicePaymentDetails,
  payInvoiceWithSavedCard,
} from "@/actions/invoice-payments";

interface QuickPayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  onSuccess?: () => void;
}

export function QuickPayDialog({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  amount,
  onSuccess,
}: QuickPayDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<any>(null);

  useEffect(() => {
    if (open) {
      loadDefaultPaymentMethod();
    }
  }, [open]);

  const loadDefaultPaymentMethod = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getInvoicePaymentDetails(invoiceId);

    if (result.success) {
      const defaultPM = result.paymentMethods?.find((pm: any) => pm.is_default);
      if (defaultPM) {
        setDefaultPaymentMethod(defaultPM);
      } else if (result.paymentMethods && result.paymentMethods.length > 0) {
        // Use first available if no default
        setDefaultPaymentMethod(result.paymentMethods[0]);
      } else {
        setError(
          "No payment methods found. Please add a payment method first.",
        );
      }
    } else {
      setError(result.error || "Failed to load payment details");
    }

    setIsLoading(false);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const handleConfirmPayment = async () => {
    if (!defaultPaymentMethod) {
      setError("No payment method available");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const result = await payInvoiceWithSavedCard({
      invoiceId,
      paymentMethodId: defaultPaymentMethod.id,
    });

    setIsProcessing(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error || "Payment failed");
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
              <Check className="size-8 text-success" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Payment Successful!</h3>
            <p className="text-center text-muted-foreground text-sm">
              {formatCurrency(amount)} paid for invoice {invoiceNumber}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Quick payment for {invoiceNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Summary */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Amount to Pay:</span>
              <span className="text-xl font-bold">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          {defaultPaymentMethod ? (
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-muted-foreground text-xs">
                Payment Method:
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="text-sm font-medium">
                    {defaultPaymentMethod.card_brand.toUpperCase()} ••••{" "}
                    {defaultPaymentMethod.card_last4}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Expires{" "}
                    {String(defaultPaymentMethod.card_exp_month).padStart(
                      2,
                      "0",
                    )}
                    /{defaultPaymentMethod.card_exp_year}
                    {defaultPaymentMethod.nickname &&
                      ` • ${defaultPaymentMethod.nickname}`}
                  </p>
                </div>
                {defaultPaymentMethod.is_default && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Default
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertDescription>
                No payment method available. Please add a payment method in the
                Billing Information section.
              </AlertDescription>
            </Alert>
          )}

          {/* Confirmation Message */}
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription className="text-sm">
              This will charge {formatCurrency(amount)} to your{" "}
              {defaultPaymentMethod?.card_brand.toUpperCase()} card ending in{" "}
              {defaultPaymentMethod?.card_last4}.
            </AlertDescription>
          </Alert>

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
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={isProcessing || !defaultPaymentMethod}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 size-4" />
                Confirm & Pay
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
