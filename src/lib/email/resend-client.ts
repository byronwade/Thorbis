/**
 * Resend Client - Email Service Configuration
 *
 * Features:
 * - Singleton Resend client instance
 * - Environment-based configuration
 * - Type-safe email sending
 * - Development mode support (logs instead of sending)
 */

import { Resend } from "resend";

// Initialize Resend client
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email configuration
export const emailConfig = {
  from: `${process.env.RESEND_FROM_NAME || "Thorbis"} <${process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com"}>`,
  // Enable production mode if RESEND_API_KEY is configured, even in development
  isDevelopment: !process.env.RESEND_API_KEY || process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

// Check if Resend is properly configured
export function isResendConfigured(): boolean {
  if (!resend) {
    console.warn(
      "Resend is not configured. Please add RESEND_API_KEY to your environment variables."
    );
    return false;
  }
  return true;
}
