/**
 * Stratos Billing Pricing Constants
 *
 * Single source of truth for all pricing.
 * Must match the marketing pricing page exactly.
 *
 * Pricing Model: Provider Cost + 200% Markup (3x total)
 * Base Fee: $200/month flat rate
 *
 * @see apps/web/src/components/pricing/modern-pricing.tsx
 * @see apps/web/src/app/(marketing)/pricing/page.tsx
 */

// ============================================================================
// PRICING CONSTANTS (in cents for precision)
// ============================================================================

/**
 * Base monthly fee in cents ($200/month)
 */
export const BASE_FEE_CENTS = 20000;

/**
 * Markup multiplier (200% markup = 3x provider cost)
 */
export const MARKUP_MULTIPLIER = 3;

// ============================================================================
// EMAIL PRICING
// Provider: SendGrid
// ============================================================================

export const EMAIL_PRICING = {
  provider: "SendGrid",
  providerCostPerEmail: 0.01, // $0.0001 per email (in cents = 0.01)
  customerPricePerEmail: 0.03, // $0.0003 per email (in cents = 0.03)
  unit: "email",
} as const;

// ============================================================================
// SMS PRICING
// Provider: Twilio
// ============================================================================

export const SMS_PRICING = {
  provider: "Twilio",
  providerCostPerSms: 0.8, // $0.008 per SMS (in cents = 0.8)
  customerPricePerSms: 2.4, // $0.024 per SMS (in cents = 2.4)
  unit: "text message",
} as const;

// ============================================================================
// VOICE CALL PRICING
// Provider: Twilio
// ============================================================================

export const CALL_PRICING = {
  provider: "Twilio",
  inbound: {
    providerCostPerMinute: 0.4, // $0.004 per minute (in cents = 0.4)
    customerPricePerMinute: 1.2, // $0.012 per minute (in cents = 1.2)
  },
  outbound: {
    providerCostPerMinute: 1.0, // $0.01 per minute (in cents = 1.0)
    customerPricePerMinute: 3.0, // $0.03 per minute (in cents = 3.0)
  },
  unit: "minute",
} as const;

// ============================================================================
// AI CHAT PRICING
// Provider: Anthropic (Claude 3.5 Sonnet)
// ============================================================================

export const AI_CHAT_PRICING = {
  provider: "Anthropic",
  model: "claude-3-5-sonnet",
  providerCostPerChat: 5, // $0.05 per chat (in cents = 5)
  customerPricePerChat: 15, // $0.15 per chat (in cents = 15)
  unit: "chat",
  // Token-based pricing for detailed tracking
  tokens: {
    inputCostPer1K: 0.3, // $0.003 per 1K input tokens (in cents)
    outputCostPer1K: 1.5, // $0.015 per 1K output tokens (in cents)
  },
} as const;

// ============================================================================
// AI PHONE (VOICE ASSISTANT) PRICING
// Provider: Twilio (voice) + Deepgram (STT) + Anthropic (LLM) + ElevenLabs (TTS)
// ============================================================================

export const AI_PHONE_PRICING = {
  providers: ["Twilio", "Deepgram", "Anthropic", "ElevenLabs"],
  providerCostPerMinute: 6, // $0.06 per minute combined (in cents = 6)
  customerPricePerMinute: 18, // $0.18 per minute (in cents = 18)
  unit: "minute",
  breakdown: {
    telephony: 0.4, // Twilio voice
    stt: 2.5, // Speech-to-text
    llm: 2.0, // Language model
    tts: 1.1, // Text-to-speech
  },
} as const;

// ============================================================================
// STORAGE PRICING
// Provider: Supabase
// ============================================================================

export const STORAGE_PRICING = {
  provider: "Supabase",
  providerCostPerGb: 9, // $0.09 per GB (in cents = 9)
  customerPricePerGb: 27, // $0.27 per GB (in cents = 27)
  unit: "GB",
  // Conversion helpers
  bytesPerGb: 1024 * 1024 * 1024, // 1,073,741,824 bytes
} as const;

// ============================================================================
// AUTOMATION PRICING
// Provider: Vercel (Serverless Functions)
// ============================================================================

export const AUTOMATION_PRICING = {
  provider: "Vercel",
  providerCostPerMonth: 300, // $3.00 per unit per month (in cents = 300)
  customerPricePerMonth: 900, // $9.00 per unit per month (in cents = 900)
  unit: "automation unit",
  // A unit = ~100K function invocations or background job runs
  invocationsPerUnit: 100000,
} as const;

// ============================================================================
// AGGREGATED PRICING CONFIG
// Used by billing calculations
// ============================================================================

export const PRICING_CONFIG = {
  baseFee: BASE_FEE_CENTS,
  markup: MARKUP_MULTIPLIER,
  email: EMAIL_PRICING,
  sms: SMS_PRICING,
  call: CALL_PRICING,
  aiChat: AI_CHAT_PRICING,
  aiPhone: AI_PHONE_PRICING,
  storage: STORAGE_PRICING,
  automation: AUTOMATION_PRICING,
} as const;

// ============================================================================
// BILLING CALCULATION HELPERS
// ============================================================================

export type BillingUsage = {
  emailsSent: number;
  smsSent: number;
  callMinutesInbound: number;
  callMinutesOutbound: number;
  aiChats: number;
  aiPhoneMinutes: number;
  storageBytes: number;
  automationUnits: number;
};

export type BillingBreakdown = {
  baseFee: number;
  emails: { quantity: number; providerCost: number; billableCost: number };
  sms: { quantity: number; providerCost: number; billableCost: number };
  callsInbound: { quantity: number; providerCost: number; billableCost: number };
  callsOutbound: { quantity: number; providerCost: number; billableCost: number };
  aiChats: { quantity: number; providerCost: number; billableCost: number };
  aiPhone: { quantity: number; providerCost: number; billableCost: number };
  storage: { quantity: number; providerCost: number; billableCost: number };
  automation: { quantity: number; providerCost: number; billableCost: number };
  totalProviderCost: number;
  totalBillableCost: number;
  grandTotal: number;
};

/**
 * Calculate billing breakdown from usage data
 * All costs returned in cents
 */
export function calculateBilling(usage: BillingUsage): BillingBreakdown {
  const storageGb = usage.storageBytes / STORAGE_PRICING.bytesPerGb;

  const emails = {
    quantity: usage.emailsSent,
    providerCost: Math.round(usage.emailsSent * EMAIL_PRICING.providerCostPerEmail),
    billableCost: Math.round(usage.emailsSent * EMAIL_PRICING.customerPricePerEmail),
  };

  const sms = {
    quantity: usage.smsSent,
    providerCost: Math.round(usage.smsSent * SMS_PRICING.providerCostPerSms),
    billableCost: Math.round(usage.smsSent * SMS_PRICING.customerPricePerSms),
  };

  const callsInbound = {
    quantity: usage.callMinutesInbound,
    providerCost: Math.round(usage.callMinutesInbound * CALL_PRICING.inbound.providerCostPerMinute),
    billableCost: Math.round(usage.callMinutesInbound * CALL_PRICING.inbound.customerPricePerMinute),
  };

  const callsOutbound = {
    quantity: usage.callMinutesOutbound,
    providerCost: Math.round(usage.callMinutesOutbound * CALL_PRICING.outbound.providerCostPerMinute),
    billableCost: Math.round(usage.callMinutesOutbound * CALL_PRICING.outbound.customerPricePerMinute),
  };

  const aiChats = {
    quantity: usage.aiChats,
    providerCost: Math.round(usage.aiChats * AI_CHAT_PRICING.providerCostPerChat),
    billableCost: Math.round(usage.aiChats * AI_CHAT_PRICING.customerPricePerChat),
  };

  const aiPhone = {
    quantity: usage.aiPhoneMinutes,
    providerCost: Math.round(usage.aiPhoneMinutes * AI_PHONE_PRICING.providerCostPerMinute),
    billableCost: Math.round(usage.aiPhoneMinutes * AI_PHONE_PRICING.customerPricePerMinute),
  };

  const storage = {
    quantity: Number(storageGb.toFixed(2)),
    providerCost: Math.round(storageGb * STORAGE_PRICING.providerCostPerGb),
    billableCost: Math.round(storageGb * STORAGE_PRICING.customerPricePerGb),
  };

  const automation = {
    quantity: usage.automationUnits,
    providerCost: Math.round(usage.automationUnits * AUTOMATION_PRICING.providerCostPerMonth),
    billableCost: Math.round(usage.automationUnits * AUTOMATION_PRICING.customerPricePerMonth),
  };

  const totalProviderCost =
    emails.providerCost +
    sms.providerCost +
    callsInbound.providerCost +
    callsOutbound.providerCost +
    aiChats.providerCost +
    aiPhone.providerCost +
    storage.providerCost +
    automation.providerCost;

  const totalBillableCost =
    emails.billableCost +
    sms.billableCost +
    callsInbound.billableCost +
    callsOutbound.billableCost +
    aiChats.billableCost +
    aiPhone.billableCost +
    storage.billableCost +
    automation.billableCost;

  return {
    baseFee: BASE_FEE_CENTS,
    emails,
    sms,
    callsInbound,
    callsOutbound,
    aiChats,
    aiPhone,
    storage,
    automation,
    totalProviderCost,
    totalBillableCost,
    grandTotal: BASE_FEE_CENTS + totalBillableCost,
  };
}

/**
 * Format cents as dollars string
 */
export function formatCentsToDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
