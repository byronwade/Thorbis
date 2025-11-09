"use client";

/**
 * Express Checkout Element - Client Component
 *
 * Displays one-click payment buttons for:
 * - Apple Pay
 * - Google Pay
 * - Link
 * - PayPal
 * - Amazon Pay
 * - Klarna
 *
 * Client-side features:
 * - Interactive payment buttons
 * - Stripe Elements integration
 * - Payment method selection
 * - Automatic wallet detection
 *
 * Performance optimizations:
 * - Lazy loads Stripe.js
 * - Only renders on supported browsers
 * - Minimal bundle impact
 */

import {
  Elements,
  ExpressCheckoutElement as StripeExpressCheckout,
} from "@stripe/react-stripe-js";
import type { Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { getStripe } from "@/lib/stripe/client";

interface ExpressCheckoutElementProps {
  /** Amount in cents (e.g., 1000 = $10.00) */
  amount: number;
  /** Currency code (e.g., 'usd') */
  currency: string;
  /** Customer ID for saving payment methods */
  customerId?: string;
  /** Whether to save payment method for future use */
  setupFutureUsage?: "on_session" | "off_session";
  /** Callback when payment is complete */
  onPaymentComplete?: (paymentMethodId: string) => void;
  /** Callback when payment fails */
  onPaymentError?: (error: Error) => void;
  /** Whether to collect shipping address */
  collectShipping?: boolean;
  /** Shipping options if collecting shipping */
  shippingOptions?: Array<{
    id: string;
    label: string;
    detail?: string;
    amount: number;
  }>;
}

/**
 * Inner component that uses Stripe hooks
 * Must be wrapped in Elements provider
 */
function ExpressCheckoutInner({
  amount,
  currency,
  customerId,
  setupFutureUsage,
  onPaymentComplete,
  onPaymentError,
  collectShipping,
  shippingOptions,
}: ExpressCheckoutElementProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <div
      className={`transition-opacity duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
    >
      <StripeExpressCheckout
        onCancel={() => {
          console.log("Payment cancelled");
        }}
        onConfirm={async (event) => {
          try {
            // Create PaymentIntent on server
            const response = await fetch("/api/payments/create-intent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount,
                currency,
                customerId,
                setupFutureUsage,
                paymentMethodType: event.expressPaymentType,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to create payment intent");
            }

            const { clientSecret, error } = await response.json();

            if (error) {
              throw new Error(error);
            }

            // Complete the payment
            (event as any).complete("success");

            // Save payment method if requested
            if (setupFutureUsage && customerId) {
              const paymentMethodId = (event as any).paymentMethod?.id;
              if (paymentMethodId) {
                await fetch("/api/payments/save-method", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paymentMethodId,
                    customerId,
                    isDefault: true,
                  }),
                });

                onPaymentComplete?.(paymentMethodId);
              }
            }
          } catch (error) {
            console.error("Payment error:", error);
            (event as any).complete("fail");
            onPaymentError?.(
              error instanceof Error ? error : new Error("Payment failed")
            );
          }
        }}
        onReady={(event) => {
          setIsReady(true);
          console.log(
            "Express Checkout ready with:",
            event.availablePaymentMethods
          );
        }}
        onShippingAddressChange={
          collectShipping
            ? (event) => {
                console.log("Shipping address changed:", event.address);
                (event as any).resolve({
                  shippingOptions: shippingOptions || [],
                });
              }
            : undefined
        }
        onShippingRateChange={
          collectShipping
            ? (event) => {
                console.log("Shipping rate changed:", event.shippingRate);
                event.resolve();
              }
            : undefined
        }
        options={{
          wallets: {
            applePay: "auto",
            googlePay: "auto",
          },
          layout: {
            maxColumns: 2,
            maxRows: 1,
            overflow: "auto",
          },
          buttonTheme: {
            applePay: "black",
            googlePay: "black",
          },
          buttonHeight: 48,
        }}
      />
    </div>
  );
}

/**
 * Express Checkout Element
 *
 * Renders one-click payment buttons (Apple Pay, Google Pay, etc.)
 * Automatically detects available payment methods based on:
 * - Customer's browser/device
 * - Payment method setup
 * - Currency support
 * - Country restrictions
 */
export function ExpressCheckoutElement(props: ExpressCheckoutElementProps) {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  if (!stripePromise) {
    return null;
  }

  const elementsOptions: StripeElementsOptions = {
    mode: "payment",
    amount: props.amount,
    currency: props.currency,
    setupFutureUsage: props.setupFutureUsage,
    appearance: {
      theme: "stripe",
      variables: {
        borderRadius: "8px",
        colorPrimary: "#0066ff",
      },
    },
    paymentMethodTypes: ["card", "link", "paypal", "amazon_pay", "klarna"],
  };

  return (
    <Elements options={elementsOptions} stripe={stripePromise}>
      <ExpressCheckoutInner {...props} />
    </Elements>
  );
}
