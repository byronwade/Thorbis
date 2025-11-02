/**
 * Settings Utility Helpers
 *
 * Common utility functions for working with settings throughout the application
 */

import type { ActionResult } from "@/lib/errors/with-error-handling";

/**
 * Convert camelCase to snake_case for database fields
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase for UI fields
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform an object's keys from snake_case to camelCase
 */
export function keysToCamelCase<T = any>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[toCamelCase(key)] = value;
  }
  return result as T;
}

/**
 * Transform an object's keys from camelCase to snake_case
 */
export function keysToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[toSnakeCase(key)] = value;
  }
  return result;
}

/**
 * Create FormData from an object with automatic type conversion
 */
export function createFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue; // Skip null/undefined values
    }

    if (typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (typeof value === "string") {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
  }

  return formData;
}

/**
 * Check if settings action result is successful
 */
export function isSettingsSuccess<T>(
  result: ActionResult<T>
): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Check if settings action result is an error
 */
export function isSettingsError<T>(
  result: ActionResult<T>
): result is { success: false; error: string } {
  return result.success === false;
}

/**
 * Get error message from action result
 */
export function getSettingsError<T>(result: ActionResult<T>): string | null {
  return isSettingsError(result) ? result.error : null;
}

/**
 * Format settings field name for display
 * Example: "smtpFromEmail" -> "SMTP From Email"
 */
export function formatFieldName(fieldName: string): string {
  // Insert space before capital letters
  const spaced = fieldName.replace(/([A-Z])/g, " $1");

  // Capitalize first letter of each word
  const capitalized = spaced
    .split(" ")
    .map((word) => {
      // Handle acronyms like SMTP, API, URL
      if (word.toUpperCase() === word && word.length > 1) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return capitalized.trim();
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic US format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Format phone number to (XXX) XXX-XXXX
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Get default settings for a given settings type
 * Useful for reset functionality
 */
export const defaultSettings = {
  email: {
    smtpEnabled: false,
    smtpUseTls: true,
    trackOpens: true,
    trackClicks: true,
    autoCcEnabled: false,
  },
  job: {
    jobNumberPrefix: "JOB",
    nextJobNumber: 1,
    defaultJobStatus: "scheduled",
    requireCustomerSignature: false,
    trackTechnicianTime: true,
    requireCompletionNotes: true,
  },
  invoice: {
    invoiceNumberPrefix: "INV",
    nextInvoiceNumber: 1,
    defaultPaymentTerms: 30,
    lateFeeEnabled: false,
    lateFeeAmount: 5,
    taxEnabled: true,
    defaultTaxRate: 0,
  },
  estimate: {
    estimateNumberPrefix: "EST",
    nextEstimateNumber: 1,
    defaultValidForDays: 30,
    showExpiryDate: true,
    requireApproval: false,
    sendReminderEnabled: true,
  },
  user: {
    theme: "system" as const,
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h" as const,
    defaultPageSize: 25,
  },
} as const;

/**
 * Merge partial settings with defaults
 */
export function mergeWithDefaults<T extends keyof typeof defaultSettings>(
  settingsType: T,
  partial: Partial<(typeof defaultSettings)[T]>
): (typeof defaultSettings)[T] {
  return {
    ...defaultSettings[settingsType],
    ...partial,
  };
}

/**
 * Check if two settings objects are equal
 */
export function areSettingsEqual(
  a: Record<string, any>,
  b: Record<string, any>
): boolean {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();

  if (keysA.length !== keysB.length) return false;
  if (keysA.some((key, i) => key !== keysB[i])) return false;

  return keysA.every((key) => a[key] === b[key]);
}

/**
 * Get changed fields between two settings objects
 */
export function getChangedFields(
  original: Record<string, any>,
  updated: Record<string, any>
): Record<string, { from: any; to: any }> {
  const changes: Record<string, { from: any; to: any }> = {};

  for (const key of Object.keys(updated)) {
    if (original[key] !== updated[key]) {
      changes[key] = {
        from: original[key],
        to: updated[key],
      };
    }
  }

  return changes;
}

/**
 * Validate required fields in settings
 */
export function validateRequiredFields(
  settings: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter((field) => {
    const value = settings[field];
    return value === null || value === undefined || value === "";
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Export settings as JSON file
 */
export function exportSettingsAsJson(
  settings: Record<string, any>,
  filename: string = "settings.json"
): void {
  const json = JSON.stringify(settings, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import settings from JSON file
 */
export async function importSettingsFromJson(
  file: File
): Promise<Record<string, any> | null> {
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.error("Failed to import settings:", error);
    return null;
  }
}
