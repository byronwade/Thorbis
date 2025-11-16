/**
 * CSRF Protection
 *
 * Cross-Site Request Forgery (CSRF) protection for Server Actions.
 * Generates and validates tokens to prevent unauthorized form submissions.
 *
 * How it works:
 * 1. Server generates a random CSRF token and stores it in HTTP-only cookie
 * 2. Token is also included in form as hidden field or header
 * 3. On form submission, server compares cookie token with submitted token
 * 4. Tokens must match exactly or request is rejected
 *
 * Usage in Server Actions:
 * ```typescript
 * export async function updateSettings(formData: FormData) {
 *   await verifyCSRFToken(formData);
 *   // Your logic here
 * }
 * ```
 *
 * Usage in Forms:
 * ```tsx
 * <form action={updateSettings}>
 *   <CSRFTokenInput />
 *   <input name="setting" />
 *   <button type="submit">Save</button>
 * </form>
 * ```
 */

import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";

const CSRF_TOKEN_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const CSRF_FORM_FIELD = "csrf_token";

/**
 * CSRF Error
 */
export class CSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CSRFError";
  }
}

/**
 * Generate CSRF Token
 *
 * Creates a secure random token and stores it in an HTTP-only cookie.
 * Call this in Server Components or Server Actions to initialize CSRF protection.
 *
 * @returns The generated CSRF token (for including in forms)
 */
export async function generateCSRFToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return token;
}

/**
 * Get Current CSRF Token
 *
 * Gets the CSRF token from cookies without generating a new one.
 * Generates a new token if none exists.
 *
 * @returns Current CSRF token or new token if none exists
 */
export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value;

  if (existingToken) {
    return existingToken;
  }

  // Generate new token if none exists
  return generateCSRFToken();
}

/**
 * Verify CSRF Token
 *
 * Validates the CSRF token from request against the cookie.
 * Supports both header-based and form field-based tokens.
 *
 * @param formData - Optional FormData containing the CSRF token
 * @throws CSRFError if validation fails
 *
 * @example
 * // In Server Action
 * export async function updateUser(formData: FormData) {
 *   await verifyCSRFToken(formData);
 *   // Your logic here
 * }
 */
export async function verifyCSRFToken(formData?: FormData): Promise<void> {
  const cookieStore = await cookies();
  const headersList = await headers();

  const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value;

  // Get token from header or form field
  let submittedToken: string | null = null;

  // Check header first (for fetch requests)
  submittedToken = headersList.get(CSRF_HEADER);

  // Fall back to form field (for form submissions)
  if (!submittedToken && formData) {
    submittedToken = formData.get(CSRF_FORM_FIELD) as string | null;
  }

  // Validate
  if (!cookieToken) {
    throw new CSRFError(
      "CSRF token missing from cookies. Please refresh the page and try again."
    );
  }

  if (!submittedToken) {
    throw new CSRFError(
      "CSRF token missing from request. Please ensure the form includes a CSRF token."
    );
  }

  // Constant-time comparison to prevent timing attacks
  if (!constantTimeCompare(cookieToken, submittedToken)) {
    throw new CSRFError(
      "Invalid CSRF token. This request may be forged. Please refresh the page and try again."
    );
  }
}

/**
 * Constant-Time String Comparison
 *
 * Compares two strings in constant time to prevent timing attacks.
 * Always compares the full length even if strings don't match.
 *
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal, false otherwise
 */
function constantTimeCompare(a: string, b: string): boolean {
  // If lengths don't match, still do comparison to prevent timing leak
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF Protection Wrapper for Server Actions
 *
 * Wraps a Server Action to automatically verify CSRF token.
 *
 * @param fn - Server Action function to wrap
 * @returns Wrapped function with CSRF protection
 *
 * @example
 * ```typescript
 * export const updateSettings = withCSRFProtection(
 *   async (formData: FormData) => {
 *     // Your logic here - CSRF already verified
 *   }
 * );
 * ```
 */
export function withCSRFProtection<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    // Check if first argument is FormData
    const formData = args[0] instanceof FormData ? args[0] : undefined;

    await verifyCSRFToken(formData);
    return fn(...args);
  };
}

/**
 * Rotate CSRF Token
 *
 * Generates a new CSRF token, invalidating the old one.
 * Use this after successful form submission or periodically for extra security.
 *
 * @returns New CSRF token
 */
export async function rotateCSRFToken(): Promise<string> {
  return generateCSRFToken();
}

/**
 * Clear CSRF Token
 *
 * Removes the CSRF token cookie.
 * Use this on logout.
 */
export async function clearCSRFToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_TOKEN_COOKIE);
}
