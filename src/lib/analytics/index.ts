/**
 * Analytics Module
 *
 * Centralized analytics tracking for the entire application.
 * Provides type-safe event tracking using Vercel Analytics.
 *
 * @example
 * import { trackEvent } from "@/lib/analytics";
 *
 * trackEvent({
 *   name: "job.created",
 *   properties: { jobId: "123", customerId: "456" }
 * });
 */

export * from "./types";
export * from "./client";
export * from "./hooks";
export * from "./server";

