"use client";

/**
 * Stripe Payment Form Component
 *
 * Collects payment method using Stripe Elements
 * Used in organization creation wizard
 */

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type StripePaymentFormProps = {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isSubmitting: boolean;
  buttonText?: string;
};

export function StripePaymentForm({
  onSuccess,
  onError,
  isSubmitting,
  buttonText = "Save Payment Method",
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Submit payment element to create payment method
      const { error: submitError } = await elements.submit();

      if (submitError) {
        onError(submitError.message || "Failed to validate payment method");
        setIsProcessing(false);
        return;
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (error) {
        onError(error.message || "Failed to save payment method");
        setIsProcessing(false);
      } else if (paymentMethod) {
        onSuccess(paymentMethod.id);
        setIsProcessing(false);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing || isSubmitting}
        className="w-full"
      >
        {(isProcessing || isSubmitting) && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}
        {buttonText}
      </Button>
    </form>
  );
}
