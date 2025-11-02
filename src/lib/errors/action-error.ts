/**
 * Action Error Class & Error Codes
 *
 * Provides standardized error handling for Server Actions with:
 * - Error codes for categorization
 * - HTTP status codes for API responses
 * - Detailed error messages
 * - Optional error details/context
 */

/**
 * Error Code Constants
 *
 * Organized by category for easy management and consistent error handling
 */
export const ERROR_CODES = {
  // Authentication & Authorization
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",

  // Validation
  VALIDATION_FAILED: "VALIDATION_FAILED",
  VALIDATION_REQUIRED_FIELD: "VALIDATION_REQUIRED_FIELD",
  VALIDATION_INVALID_FORMAT: "VALIDATION_INVALID_FORMAT",
  VALIDATION_OUT_OF_RANGE: "VALIDATION_OUT_OF_RANGE",

  // Database
  DB_RECORD_NOT_FOUND: "DB_RECORD_NOT_FOUND",
  DB_DUPLICATE_ENTRY: "DB_DUPLICATE_ENTRY",
  DB_CONSTRAINT_VIOLATION: "DB_CONSTRAINT_VIOLATION",
  DB_FOREIGN_KEY_VIOLATION: "DB_FOREIGN_KEY_VIOLATION",
  DB_CONNECTION_ERROR: "DB_CONNECTION_ERROR",
  DB_QUERY_ERROR: "DB_QUERY_ERROR",

  // Business Logic
  BUSINESS_RULE_VIOLATION: "BUSINESS_RULE_VIOLATION",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
  RESOURCE_LOCKED: "RESOURCE_LOCKED",
  RESOURCE_DELETED: "RESOURCE_DELETED",

  // External Services
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  SERVICE_TIMEOUT: "SERVICE_TIMEOUT",
  SERVICE_RATE_LIMIT: "SERVICE_RATE_LIMIT",
  SERVICE_INTEGRATION_ERROR: "SERVICE_INTEGRATION_ERROR",

  // File Operations
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",

  // Payment & Financial
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_DECLINED: "PAYMENT_DECLINED",
  PAYMENT_INSUFFICIENT_FUNDS: "PAYMENT_INSUFFICIENT_FUNDS",
  PAYMENT_INVALID_AMOUNT: "PAYMENT_INVALID_AMOUNT",
  PAYMENT_ALREADY_REFUNDED: "PAYMENT_ALREADY_REFUNDED",
  PAYMENT_CANNOT_REFUND: "PAYMENT_CANNOT_REFUND",

  // Generic
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Action Error Class
 *
 * Custom error class for Server Actions with additional context
 *
 * @example
 * throw new ActionError(
 *   "Customer not found",
 *   ERROR_CODES.DB_RECORD_NOT_FOUND,
 *   404,
 *   { customerId: "123" }
 * );
 */
export class ActionError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode = ERROR_CODES.UNKNOWN_ERROR,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = "ActionError";

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActionError);
    }
  }

  /**
   * Convert error to a plain object suitable for API responses
   */
  toJSON() {
    return {
      success: false as const,
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    };
  }

  /**
   * Create ActionError from unknown error
   */
  static fromUnknown(error: unknown): ActionError {
    if (error instanceof ActionError) {
      return error;
    }

    if (error instanceof Error) {
      return new ActionError(
        error.message,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        500
      );
    }

    return new ActionError(
      "An unexpected error occurred",
      ERROR_CODES.UNKNOWN_ERROR,
      500
    );
  }
}

/**
 * Error Message Helpers
 *
 * Consistent error messages for common scenarios
 */
export const ERROR_MESSAGES = {
  // Authentication
  unauthorized: () => "You must be logged in to perform this action",
  forbidden: (resource: string) =>
    `You don't have permission to access this ${resource}`,
  emailNotVerified: () => "Please verify your email before continuing",

  // Validation
  requiredField: (field: string) => `${field} is required`,
  invalidFormat: (field: string) => `${field} has an invalid format`,
  outOfRange: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max}`,

  // Database
  notFound: (resource: string) => `${resource} not found`,
  alreadyExists: (resource: string) => `${resource} already exists`,
  cannotDelete: (resource: string, reason: string) =>
    `Cannot delete ${resource}: ${reason}`,

  // Business Logic
  insufficientFunds: () => "Insufficient funds for this transaction",
  cannotRefund: (reason: string) => `Cannot process refund: ${reason}`,
  resourceLocked: (resource: string) =>
    `${resource} is currently being modified by another user`,

  // Generic
  operationFailed: (operation: string) => `Failed to ${operation}`,
  serviceUnavailable: (service: string) =>
    `${service} is currently unavailable`,
} as const;
