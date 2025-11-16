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
  AlertCircle,
  AlertTriangle,
  Check,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { processInvoicePayment } from "@/actions/invoice-payments";
import { getPaymentMethods } from "@/actions/payment-methods";
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

    const result = await getPaymentMethods();

    if (!(result.success && result.paymentMethods)) {
      setError(result.error || "Failed to load payment methods");
      setIsLoading(false);
      return;
    }

    const defaultPM =
      result.paymentMethods.find((pm: any) => pm.is_default) ??
      result.paymentMethods[0];

    if (defaultPM) {
      // Normalize shape for this component
      setDefaultPaymentMethod({
        id: defaultPM.id,
        card_brand: defaultPM.brand,
        card_last4: defaultPM.last4,
        card_exp_month: defaultPM.exp_month,
        card_exp_year: defaultPM.exp_year,
        nickname: defaultPM.display_name,
        is_default: defaultPM.is_default,
      });
    } else {
      setError("No payment methods found. Please add a payment method first.");
    }

    setIsLoading(false);
  };

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  const handleConfirmPayment = async () => {
    if (!defaultPaymentMethod) {
      setError("No payment method available");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const result = await processInvoicePayment({
      invoiceId,
      paymentMethodId: defaultPaymentMethod.id,
      channel: "online",
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
      <Dialog onOpenChange={onOpenChange} open={open}>
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
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Payment Successful</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
              <Check className="size-8 text-success" />
            </div>
            <h3 className="mb-2 font-semibold text-lg">Payment Successful!</h3>
            <p className="text-center text-muted-foreground text-sm">
              {formatCurrency(amount)} paid for invoice {invoiceNumber}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
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
              <span className="font-bold text-xl">
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
                  <p className="font-medium text-sm">
                    {defaultPaymentMethod.card_brand.toUpperCase()} ••••{" "}
                    {defaultPaymentMethod.card_last4}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Expires{" "}
                    {String(defaultPaymentMethod.card_exp_month).padStart(
                      2,
                      "0"
                    )}
                    /{defaultPaymentMethod.card_exp_year}
                    {defaultPaymentMethod.nickname &&
                      ` • ${defaultPaymentMethod.nickname}`}
                  </p>
                </div>
                {defaultPaymentMethod.is_default && (
                  <Badge className="ml-auto text-xs" variant="secondary">
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
            disabled={isProcessing}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isProcessing || !defaultPaymentMethod}
            onClick={handleConfirmPayment}
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
