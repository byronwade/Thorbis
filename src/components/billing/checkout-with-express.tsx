"use client";

/**
 * Checkout with Express Checkout Example
 *
 * Shows how to integrate Express Checkout Element
 * into an existing checkout flow
 *
 * Features:
 * - Express checkout at the top (Apple Pay, Google Pay, etc.)
 * - Divider with "Or pay with card"
 * - Regular payment form below
 * - Saved payment methods selection
 */

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExpressCheckoutElement } from "./express-checkout-element";

interface CheckoutWithExpressProps {
  /** Total amount in cents */
  amount: number;
  /** Currency code */
  currency?: string;
  /** Product/service description */
  description?: string;
  /** Whether to collect shipping */
  collectShipping?: boolean;
  /** Callback when payment completes */
  onSuccess?: () => void;
  /** Callback when payment fails */
  onError?: (error: Error) => void;
}

/**
 * Checkout with Express Checkout
 *
 * Complete checkout flow example showing:
 * 1. Express Checkout buttons at top (one-click)
 * 2. Divider
 * 3. Regular checkout form
 * 4. Saved payment methods
 */
export function CheckoutWithExpress({
  amount,
  currency = "usd",
  description = "Purchase",
  collectShipping = false,
  onSuccess,
  onError,
}: CheckoutWithExpressProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExpressPaymentComplete = (paymentMethodId: string) => {
    console.log("Express payment complete:", paymentMethodId);
    setIsProcessing(false);
    onSuccess?.();
  };

  const handleExpressPaymentError = (error: Error) => {
    console.error("Express payment error:", error);
    setIsProcessing(false);
    onError?.(error);
  };

  const formatAmount = (cents: number) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(dollars);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Order Summary */}
      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-lg">Order Summary</h2>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{description}</span>
          <span className="font-bold text-2xl">{formatAmount(amount)}</span>
        </div>
      </Card>

      {/* Express Checkout Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h3 className="font-semibold text-lg">Express Checkout</h3>
          <span className="text-muted-foreground text-sm">
            Fastest way to pay
          </span>
        </div>

        <Card className="p-6">
          <ExpressCheckoutElement
            amount={amount}
            collectShipping={collectShipping}
            currency={currency} // Save payment method
            onPaymentComplete={handleExpressPaymentComplete}
            onPaymentError={handleExpressPaymentError}
            setupFutureUsage="off_session"
          />

          <p className="mt-4 text-center text-muted-foreground text-xs">
            One-click checkout with Apple Pay, Google Pay, or Link
          </p>
        </Card>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-muted-foreground text-sm">
            Or pay with card
          </span>
        </div>
      </div>

      {/* Regular Checkout Form */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="size-5" />
          <h3 className="font-semibold text-lg">Card Payment</h3>
        </div>

        {/* This would be your existing payment form */}
        <div className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p>Your regular payment form goes here</p>
            <p className="mt-2 text-xs">
              (Card Element, billing address, etc.)
            </p>
          </div>

          <Button
            className="w-full"
            disabled={isProcessing}
            onClick={() => {
              // Handle regular card payment
              setIsProcessing(true);
              // Your payment logic here
            }}
            size="lg"
          >
            {isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
            Pay {formatAmount(amount)}
          </Button>
        </div>
      </Card>

      {/* Security Notice */}
      <div className="text-center text-muted-foreground text-xs">
        <p>🔒 Your payment information is encrypted and secure</p>
        <p className="mt-1">Powered by Stripe</p>
      </div>
    </div>
  );
}
