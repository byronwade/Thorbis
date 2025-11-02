/**
 * Password Security Validator
 *
 * Enhanced password validation including:
 * - Strength requirements (length, complexity)
 * - Breach checking via Have I Been Pwned API
 * - Common password detection
 *
 * Uses k-anonymity model - only first 5 characters of password hash
 * are sent to HIBP API, protecting user privacy.
 */

import { createHash } from "crypto";

/**
 * Check if Password is Breached
 *
 * Uses Have I Been Pwned API with k-anonymity model.
 * Only sends first 5 characters of SHA-1 hash to API.
 *
 * @param password - Password to check
 * @returns true if password found in breach database, false otherwise
 *
 * @example
 * ```typescript
 * const breached = await isPasswordBreached("password123");
 * if (breached) {
 *   return { error: "This password has been compromised" };
 * }
 * ```
 */
export async function isPasswordBreached(
  password: string
): Promise<boolean> {
  try {
    // Generate SHA-1 hash of password
    const hash = createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();

    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    // Query HIBP API with first 5 characters only (k-anonymity)
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          "User-Agent": "Thorbis-App",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );

    if (!response.ok) {
      // If API is down, fail open (allow password)
      // Log for monitoring but don't block user
      console.error("HIBP API unavailable:", response.status);
      return false;
    }

    const text = await response.text();
    const hashes = text.split("\n");

    // Check if our password hash suffix appears in results
    return hashes.some((line) => line.startsWith(suffix));
  } catch (error) {
    // On error (network, timeout, etc.), fail open (allow password)
    // Log error but don't block user signup/login
    console.error("Error checking password breach:", error);
    return false;
  }
}

/**
 * Common Weak Passwords
 *
 * List of common passwords that should be rejected even if not in breach database.
 * This provides instant feedback without API call.
 */
const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password123",
  "12345678",
  "qwerty123",
  "abc12345",
  "password1",
  "123456789",
  "qwertyuiop",
  "password!",
  "letmein123",
]);

/**
 * Check if Password is Common/Weak
 *
 * Checks against a local list of extremely common passwords.
 * Faster than breach checking and provides instant feedback.
 *
 * @param password - Password to check
 * @returns true if password is in common weak list, false otherwise
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_WEAK_PASSWORDS.has(password.toLowerCase());
}

/**
 * Validate Password Strength
 *
 * Comprehensive password validation including:
 * - Length (8-100 characters)
 * - Complexity (uppercase, lowercase, number)
 * - Common password check
 * - Breach database check (optional, async)
 *
 * @param password - Password to validate
 * @param checkBreaches - Whether to check breach database (default: true)
 * @returns Object with isValid boolean and error message if invalid
 */
export async function validatePasswordStrength(
  password: string,
  checkBreaches: boolean = true
): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // Length check
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters",
    };
  }

  if (password.length > 100) {
    return {
      isValid: false,
      error: "Password is too long (maximum 100 characters)",
    };
  }

  // Complexity check
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      error:
        "Password must contain uppercase letter, lowercase letter, and number",
    };
  }

  // Common password check (instant)
  if (isCommonPassword(password)) {
    return {
      isValid: false,
      error:
        "This password is too common. Please choose a more unique password.",
    };
  }

  // Breach check (optional, async)
  if (checkBreaches) {
    const breached = await isPasswordBreached(password);
    if (breached) {
      return {
        isValid: false,
        error:
          "This password has been found in a data breach. Please choose a different password for your security.",
      };
    }
  }

  return { isValid: true };
}

/**
 * Calculate Password Strength Score
 *
 * Returns a score from 0-100 based on password characteristics.
 * Useful for password strength meters.
 *
 * @param password - Password to score
 * @returns Score from 0-100
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0;

  // Length score (max 40 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;

  // Complexity score (max 40 points)
  if (/[a-z]/.test(password)) score += 10; // lowercase
  if (/[A-Z]/.test(password)) score += 10; // uppercase
  if (/\d/.test(password)) score += 10; // numbers
  if (/[^a-zA-Z\d]/.test(password)) score += 10; // special characters

  // Diversity score (max 20 points)
  const uniqueChars = new Set(password).size;
  score += Math.min(20, Math.floor((uniqueChars / password.length) * 20));

  return Math.min(100, score);
}

/**
 * Get Password Strength Label
 *
 * Returns human-readable label for password strength.
 *
 * @param score - Password strength score (0-100)
 * @returns Strength label
 */
export function getPasswordStrengthLabel(
  score: number
): "Weak" | "Fair" | "Good" | "Strong" | "Very Strong" {
  if (score < 40) return "Weak";
  if (score < 60) return "Fair";
  if (score < 80) return "Good";
  if (score < 95) return "Strong";
  return "Very Strong";
}
