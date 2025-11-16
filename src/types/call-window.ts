/**
 * Call Window Types
 *
 * Comprehensive type definitions for the call window interface,
 * including customer data, related records, and Telnyx enrichment.
 */

import type { Database } from "@/types/supabase";

// Database table types
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type Estimate = Database["public"]["Tables"]["estimates"]["Row"];
export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Equipment = Database["public"]["Tables"]["equipment"]["Row"];

// Contract type (if exists in database)
export type Contract = {
  id: string;
  customer_id: string;
  title: string;
  status: string;
  start_date: string;
  end_date: string | null;
  value: number;
  created_at: string;
};

/**
 * Quick statistics for customer overview
 */
export type CustomerStats = {
  totalJobs: number;
  activeJobs: number;
  totalRevenue: number;
  openInvoices: number;
  openInvoicesAmount: number;
  lastContactDate: string | null;
  customerSince: string | null;
};

/**
 * Telnyx caller enrichment data
 */
export type TelnyxEnrichmentData = {
  callerName: string | null;
  callerType: string | null;
  lineType: string | null;
  carrier: string | null;
  country: string | null;
  nationalFormat: string | null;
};

/**
 * Comprehensive customer data for call window
 */
export type CustomerCallData = {
  // Core customer info
  customer: Customer | null;
  isKnownCustomer: boolean;
  source: "database" | "telnyx" | "unknown";

  // Quick stats
  stats: CustomerStats;

  // Related records (limited to recent/relevant)
  jobs: Job[];
  invoices: Invoice[];
  estimates: Estimate[];
  appointments: Schedule[];
  properties: Property[];
  equipment: Equipment[];
  contracts: Contract[];

  // Telnyx enrichment data (if available)
  telnyxData?: TelnyxEnrichmentData;
};

/**
 * Call state for UI store
 */
export type CallState = {
  // Basic call info
  status: "idle" | "incoming" | "active" | "ended";
  caller: {
    number: string;
    name: string;
    avatar?: string;
  } | null;
  startTime: number | null;

  // Call controls
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;

  // Video state
  videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";
  isLocalVideoEnabled: boolean;
  isRemoteVideoEnabled: boolean;

  // Customer data
  customerId: string | null;
  customerData: CustomerCallData | null;

  // Call metadata
  callControlId: string | null;
  callSessionId: string | null;
  direction: "inbound" | "outbound";

  // Telnyx state
  telnyxCallState: "idle" | "connecting" | "ringing" | "active" | "ended";
  telnyxError: string | null;

  // Enhanced features
  isScreenSharing: boolean;
  connectionQuality: "excellent" | "good" | "poor";
  hasVirtualBackground: boolean;
  reactions: Array<{
    id: string;
    type: "thumbs-up" | "clap" | "heart" | "tada";
    timestamp: number;
  }>;
  chatMessages: Array<{
    id: string;
    sender: "me" | "them";
    message: string;
    timestamp: number;
  }>;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    isMuted: boolean;
    isVideoEnabled: boolean;
    isSpeaking: boolean;
    isScreenSharing: boolean;
  }>;
  meetingLink: string;
};
