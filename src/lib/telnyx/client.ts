/**
 * Telnyx Client - Authenticated API Client
 *
 * Provides a singleton Telnyx client instance with proper authentication.
 * This client is used across all Telnyx service modules.
 */

import Telnyx from "telnyx";

if (!process.env.TELNYX_API_KEY) {
  throw new Error("TELNYX_API_KEY environment variable is required");
}

/**
 * Singleton Telnyx client instance
 * Automatically authenticated with API key from environment variables
 */
export const telnyxClient = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });

/**
 * Type exports for use throughout the application
 */
export type TelnyxClient = typeof telnyxClient;

/**
 * Telnyx API configuration
 */
export const TELNYX_CONFIG = {
  apiKey: process.env.TELNYX_API_KEY,
  webhookSecret: process.env.TELNYX_WEBHOOK_SECRET || "",
  connectionId: process.env.NEXT_PUBLIC_TELNYX_CONNECTION_ID || "",
  publicKey: process.env.TELNYX_PUBLIC_KEY || "",
  messagingProfileId:
    process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID ||
    process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID ||
    "",
} as const;
