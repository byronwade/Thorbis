/**
 * Convex Utility Functions
 *
 * Provides helper functions for working with Convex data
 */
import { api } from "../../../../../convex/_generated/api";

// Re-export api for direct access when needed
export { api };

/**
 * Format a Convex timestamp to a Date object
 */
export function convexTimestampToDate(timestamp: number | undefined): Date | null {
  if (timestamp === undefined) return null;
  return new Date(timestamp);
}

/**
 * Format a Convex timestamp to an ISO string
 */
export function convexTimestampToISO(timestamp: number | undefined): string | null {
  if (timestamp === undefined) return null;
  return new Date(timestamp).toISOString();
}

/**
 * Convert a Date to a Convex timestamp
 */
export function dateToConvexTimestamp(date: Date | string | null | undefined): number | undefined {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime();
}

/**
 * Format currency from cents to display string
 */
export function formatCurrency(cents: number | undefined | null, currency = "USD"): string {
  if (cents === undefined || cents === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/**
 * Parse currency string to cents
 */
export function parseCurrencyToCents(value: string | number): number {
  if (typeof value === "number") return Math.round(value * 100);
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return Math.round(parseFloat(cleaned) * 100) || 0;
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Create a display name from first and last name
 */
export function createDisplayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  companyName?: string | null
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return fullName || companyName || "Unknown";
}

/**
 * Get initials from a name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Check if a record is archived
 */
export function isArchived<T extends { archivedAt?: number }>(record: T): boolean {
  return record.archivedAt !== undefined && record.archivedAt !== null;
}

/**
 * Check if a record is deleted
 */
export function isDeleted<T extends { deletedAt?: number }>(record: T): boolean {
  return record.deletedAt !== undefined && record.deletedAt !== null;
}

/**
 * Filter out archived records
 */
export function excludeArchived<T extends { archivedAt?: number }>(records: T[]): T[] {
  return records.filter((r) => !isArchived(r));
}

/**
 * Filter out deleted records
 */
export function excludeDeleted<T extends { deletedAt?: number }>(records: T[]): T[] {
  return records.filter((r) => !isDeleted(r));
}

/**
 * Pagination helper
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Create a paginated result from an array
 */
export function paginateArray<T>(
  items: T[],
  { page, pageSize }: PaginationOptions
): PaginatedResult<T> {
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: items.slice(start, end),
    totalCount,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
