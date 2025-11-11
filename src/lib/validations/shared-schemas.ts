/**
 * Shared Validation Schemas
 *
 * Common Zod schemas used across multiple validation files.
 * These schemas are reusable and help maintain consistency.
 */

import { z } from "zod";

/**
 * Email validation schema
 */
export const emailSchema = z.string().email("Invalid email address");

/**
 * Phone number validation schema
 * Accepts formats like: +1234567890, (123) 456-7890, 123-456-7890, etc.
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s()-]{10,}$/, "Invalid phone number");

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid("Invalid ID format");

/**
 * Date validation schema (ISO datetime string)
 */
export const dateSchema = z.string().datetime("Invalid date format");

/**
 * Date or datetime string schema (more flexible)
 */
export const dateOrDateTimeSchema = z.union([
  z.string().datetime("Invalid date format"),
  z.string().date("Invalid date format"),
]);

/**
 * Positive number schema
 */
export const positiveNumberSchema = z
  .number()
  .positive("Value must be positive");

/**
 * Non-negative number schema
 */
export const nonNegativeNumberSchema = z
  .number()
  .nonnegative("Value cannot be negative");

/**
 * Currency amount schema (in cents, as integer)
 */
export const currencyAmountSchema = z
  .number()
  .int("Amount must be an integer")
  .nonnegative("Amount cannot be negative");

/**
 * Percentage schema (0-100)
 */
export const percentageSchema = z
  .number()
  .min(0, "Percentage cannot be negative")
  .max(100, "Percentage cannot exceed 100");

/**
 * URL schema
 */
export const urlSchema = z.string().url("Invalid URL format");

/**
 * Slug schema (URL-friendly string)
 */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens");





