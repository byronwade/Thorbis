/**
 * Stripe Client - Client-side Stripe utilities
 *
 * Performance optimizations:
 * - Lazy loads Stripe.js only when needed
 * - Singleton pattern for Stripe instance
 * - Client Component compatible
 */

import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance - Singleton pattern
 *
 * Lazy loads Stripe.js and caches the instance
 * Safe to call multiple times - only loads once
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn(
        "Stripe publishable key not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
      );
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}
