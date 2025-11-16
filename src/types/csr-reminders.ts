/**
 * CSR Reminders Types
 *
 * Configurable reminders that appear at the top of the call window
 * to help CSRs follow best practices during customer calls.
 */

export type CSRReminder = {
  id: string;
  text: string;
  enabled: boolean;
  order: number;
};

export type CSRReminderSettings = {
  enabled: boolean;
  reminders: CSRReminder[];
};

/**
 * Default CSR reminders
 */
export const DEFAULT_CSR_REMINDERS: CSRReminder[] = [
  {
    id: "greeting",
    text: "Greet customer warmly and smile while speaking",
    enabled: true,
    order: 1,
  },
  {
    id: "verify",
    text: "Verify customer name, phone, and service address",
    enabled: true,
    order: 2,
  },
  {
    id: "availability",
    text: "Ask about preferred appointment times and availability",
    enabled: true,
    order: 3,
  },
  {
    id: "confirm",
    text: "Confirm all details before ending the call",
    enabled: true,
    order: 4,
  },
];

/**
 * Additional optional reminders that can be enabled
 */
export const OPTIONAL_CSR_REMINDERS: CSRReminder[] = [
  {
    id: "upsell",
    text: "Mention maintenance plans or additional services",
    enabled: false,
    order: 5,
  },
  {
    id: "feedback",
    text: "Ask if customer has any questions or concerns",
    enabled: false,
    order: 6,
  },
  {
    id: "followup",
    text: "Inform customer about follow-up communication",
    enabled: false,
    order: 7,
  },
  {
    id: "payment",
    text: "Discuss payment options and pricing",
    enabled: false,
    order: 8,
  },
  {
    id: "emergency",
    text: "Ask if this is an emergency requiring immediate service",
    enabled: false,
    order: 9,
  },
];
