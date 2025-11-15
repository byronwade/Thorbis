/**
 * Vercel Analytics Client
 *
 * Client-side analytics tracking using Vercel Analytics.
 * Provides type-safe event tracking with automatic error handling.
 */

"use client";

import { track } from "@vercel/analytics";
import type { AnalyticsEvent } from "./types";

/**
 * Serialize properties to ensure they're compatible with Vercel Analytics
 */
function serializeProperties(
  properties?: Record<string, unknown>
): Record<string, string | number | boolean> | undefined {
  if (!properties) {
    return;
  }

  const serialized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      serialized[key] = value;
    } else if (typeof value === "object") {
      // Serialize nested objects to JSON strings
      try {
        serialized[key] = JSON.stringify(value);
      } catch {
        // Skip if can't serialize
      }
    }
  }

  return serialized;
}

/**
 * Track an analytics event
 *
 * @example
 * trackEvent({
 *   name: "job.created",
 *   properties: {
 *     jobId: "job-123",
 *     customerId: "cust-456",
 *     estimatedValue: 5000
 *   }
 * });
 */
export function trackEvent(event: AnalyticsEvent): void {
  try {
    // Extract event name and properties
    const { name, properties } = event;

    // Serialize properties to ensure compatibility
    const serializedProperties = serializeProperties(properties);

    // Track with Vercel Analytics
    track(name, serializedProperties);
  } catch {
    // Silently fail - analytics should never break the app
    // Errors are swallowed to prevent analytics from breaking user experience
  }
}

/**
 * Track multiple events in batch
 */
export function trackEvents(events: AnalyticsEvent[]): void {
  for (const event of events) {
    trackEvent(event);
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent({
    name: "page.viewed",
    properties: {
      path,
      title,
      referrer: typeof window !== "undefined" ? document.referrer : undefined,
    },
  });
}

/**
 * Track a custom event with type safety
 */
export function trackCustomEvent(
  name: string,
  properties?: Record<string, unknown>
): void {
  trackEvent({
    name: name as AnalyticsEvent["name"],
    properties,
  } as AnalyticsEvent);
}
