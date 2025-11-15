/**
 * Server-Side Analytics Helpers
 *
 * For server actions, return tracking data that can be tracked by client components.
 * This ensures analytics work correctly with Next.js server/client boundaries.
 */

import type { AnalyticsEvent } from "./types";

/**
 * Create a tracking event that should be fired after a server action completes
 * This is returned from server actions and tracked by client components
 */
export function createTrackingEvent(event: AnalyticsEvent): AnalyticsEvent {
  return event;
}

/**
 * Helper to create job tracking events
 */
export function trackJobCreated(
  jobId: string,
  properties?: {
    customerId?: string;
    jobType?: string;
    estimatedValue?: number;
    source?: string;
  }
): AnalyticsEvent {
  return {
    name: "job.created",
    properties: {
      jobId,
      ...properties,
    },
  };
}

export function trackJobUpdated(
  jobId: string,
  properties?: {
    field?: string;
    oldValue?: string;
    newValue?: string;
  }
): AnalyticsEvent {
  return {
    name: "job.updated",
    properties: {
      jobId,
      ...properties,
    },
  };
}

export function trackJobStatusChanged(
  jobId: string,
  oldStatus: string,
  newStatus: string
): AnalyticsEvent {
  return {
    name: "job.status_changed",
    properties: {
      jobId,
      oldStatus,
      newStatus,
    },
  };
}

/**
 * Helper to create customer tracking events
 */
export function trackCustomerCreated(
  customerId: string,
  properties?: {
    source?: "manual" | "import" | "api";
    hasEmail?: boolean;
    hasPhone?: boolean;
  }
): AnalyticsEvent {
  return {
    name: "customer.created",
    properties: {
      customerId,
      ...properties,
    },
  };
}

/**
 * Helper to create invoice tracking events
 */
export function trackInvoiceCreated(
  invoiceId: string,
  properties?: {
    jobId?: string;
    customerId?: string;
    amount?: number;
    currency?: string;
  }
): AnalyticsEvent {
  return {
    name: "invoice.created",
    properties: {
      invoiceId,
      ...properties,
    },
  };
}

export function trackInvoiceSent(
  invoiceId: string,
  method: "email" | "sms" | "link"
): AnalyticsEvent {
  return {
    name: "invoice.sent",
    properties: {
      invoiceId,
      method,
    },
  };
}

export function trackInvoicePaid(
  invoiceId: string,
  properties?: {
    amount?: number;
    paymentMethod?: string;
  }
): AnalyticsEvent {
  return {
    name: "invoice.paid",
    properties: {
      invoiceId,
      ...properties,
    },
  };
}
