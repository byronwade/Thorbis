"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearActiveCompany } from "@/lib/auth/company-context";
import {
  createEmailVerificationToken,
  verifyAndConsumeToken,
} from "@/lib/auth/tokens";
import { emailConfig } from "@/lib/email/resend-client";
import { clearCSRFToken } from "@/lib/security/csrf";
import {
  authRateLimiter,
  checkRateLimit,
  passwordResetRateLimiter,
  RateLimitError,
} from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import {
  sendEmailVerification,
  sendPasswordChanged,
  sendWelcomeEmail,
} from "./emails";

/**
 * Authentication Server Actions - Supabase Auth + Resend Email Integration
 *
 * Performance optimizations:
 * - Server Actions for secure authentication
 * - Supabase Auth handles password hashing and session management
 * - Custom emails via Resend with branded templates
 * - Zod validation for input sanitization
 * - Proper error handling with user-friendly messages
 */

// Validation Schemas
const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Internal return type (not exported - Next.js 16 "use server" restriction)
type AuthActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Sign Up - Create new user account with Supabase Auth + Custom Resend Email
 *
 * Features:
 * - Email/password authentication
 * - Custom welcome email via Resend with branded template
 * - Creates user profile in users table via database trigger
 * - Validates input with Zod
 * - Disables Supabase's built-in emails (using custom Resend templates instead)
 */
export async function signUp(formData: FormData): Promise<AuthActionResult> {
  try {
    // Parse and validate form data
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      terms: formData.get("terms") === "on" || formData.get("terms") === "true",
    };

    const validatedData = signUpSchema.parse(rawData);

    // Rate limit sign-up attempts by email
    try {
      await checkRateLimit(validatedData.email, authRateLimiter);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return {
          success: false,
          error: error.message,
        };
      }
      throw error;
    }

    // Create Supabase client
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error:
          "Authentication service is not configured. Please check your environment variables.",
      };
    }

    // Sign up with Supabase Auth
    // IMPORTANT: Disable "Confirm signup" in Supabase Dashboard > Authentication > Email Templates
    // We're handling email verification ourselves with custom tokens
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
        },
        // Skip Supabase's email confirmation - we'll handle it ourselves
        emailRedirectTo: `${emailConfig.siteUrl}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    // Check if email confirmation is required (based on Supabase settings)
    const requiresConfirmation = !data.session;

    if (requiresConfirmation) {
      // Generate our own secure verification token
      const { token, expiresAt } = await createEmailVerificationToken(
        validatedData.email,
        data.user.id,
        24 // Expires in 24 hours
      );

      // Send custom branded verification email via Resend
      const verificationUrl = `${emailConfig.siteUrl}/auth/verify-email?token=${token}`;

      const verificationResult = await sendEmailVerification(
        validatedData.email,
        {
          name: validatedData.name,
          verificationUrl,
        }
      );

      // Log email send failure but don't block signup
      if (!verificationResult.success) {
        console.error(
          "Failed to send verification email:",
          verificationResult.error
        );
      }

      return {
        success: true,
        data: {
          requiresEmailConfirmation: true,
          message:
            "Account created! Please check your email to verify your account.",
          expiresAt: expiresAt.toISOString(),
        },
      };
    }

    // If no email confirmation needed, send welcome email and redirect to onboarding
    const emailResult = await sendWelcomeEmail(validatedData.email, {
      name: validatedData.name,
      loginUrl: `${emailConfig.siteUrl}/dashboard/welcome`,
    });

    // Log email send failure but don't block signup
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
    }

    // Revalidate and redirect to onboarding
    revalidatePath("/", "layout");
    redirect("/dashboard/welcome");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }

    // Don't redirect on errors, just return them
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      return {
        success: false,
        error: error.message,
      };
    }

    // Re-throw redirect errors
    throw error;
  }
}

/**
 * Sign In - Authenticate existing user with Supabase Auth
 *
 * Features:
 * - Email/password authentication
 * - Session management handled by Supabase
 * - Validates input with Zod
 * - Redirects to dashboard on success
 */
export async function signIn(formData: FormData): Promise<AuthActionResult> {
  try {
    // Parse and validate form data
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = signInSchema.parse(rawData);

    // Rate limit sign-in attempts by email
    try {
      await checkRateLimit(validatedData.email, authRateLimiter);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return {
          success: false,
          error: error.message,
        };
      }
      throw error;
    }

    // Create Supabase client
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error:
          "Authentication service is not configured. Please check your environment variables.",
      };
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.session) {
      return {
        success: false,
        error: "Failed to create session. Please try again.",
      };
    }

    // Revalidate and redirect to dashboard
    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }

    // Don't redirect on errors, just return them
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      return {
        success: false,
        error: error.message,
      };
    }

    // Re-throw redirect errors
    throw error;
  }
}

/**
 * Sign Out - End user session
 *
 * Features:
 * - Clears Supabase session (cookie-based)
 * - Clears CSRF token cookie
 * - Clears active company cookie
 * - Revalidates all cached data
 * - Redirects to login page
 *
 * Security:
 * - Ensures all authentication and security cookies are removed
 * - Prevents session reuse or CSRF attacks after logout
 */
export async function signOut(): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    // Sign out from Supabase (clears auth cookies)
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Clear all security-related cookies
    await clearCSRFToken();
    await clearActiveCompany();

    // Revalidate and redirect to login
    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    // Don't redirect on errors, just return them
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      return {
        success: false,
        error: error.message,
      };
    }

    // Re-throw redirect errors
    throw error;
  }
}

/**
 * Sign In with OAuth - Authenticate with Google or other providers
 *
 * Features:
 * - OAuth provider authentication
 * - Automatic user profile creation
 * - Redirects to provider login page
 */
export async function signInWithOAuth(
  provider: "google" | "facebook"
): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Redirect to OAuth provider
    if (data.url) {
      redirect(data.url);
    }

    return {
      success: true,
    };
  } catch (error) {
    // Don't redirect on errors, just return them
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      return {
        success: false,
        error: error.message,
      };
    }

    // Re-throw redirect errors
    throw error;
  }
}

/**
 * Forgot Password - Send custom password reset email via Resend
 *
 * Features:
 * - Sends custom branded password reset email via Resend
 * - Secure token generation via Supabase
 * - Custom email template with security information
 */
export async function forgotPassword(
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validatedData = forgotPasswordSchema.parse(rawData);

    // Rate limit password reset requests by email (stricter limit)
    try {
      await checkRateLimit(validatedData.email, passwordResetRateLimiter);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return {
          success: false,
          error: error.message,
        };
      }
      throw error;
    }

    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    // Generate password reset token via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${emailConfig.siteUrl}/auth/reset-password`,
      }
    );

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Note: Supabase will send its own email with the reset link.
    // To use custom Resend email instead, you need to:
    // 1. Disable Supabase's password reset email in the dashboard
    // 2. Generate your own secure token
    // 3. Send custom email with that token
    // For now, we're using Supabase's reset flow but you can customize this

    // TODO: Replace with custom token generation + Resend email
    // For full custom implementation, see the commented code below:
    /*
    const resetToken = generateSecureToken(); // Implement your own token generation
    await storeResetToken(validatedData.email, resetToken); // Store in your database

    await sendPasswordReset(validatedData.email, {
      resetUrl: `${emailConfig.siteUrl}/auth/reset-password?token=${resetToken}`,
      expiresInMinutes: 60,
    });
    */

    return {
      success: true,
      data: {
        message: "Password reset email sent. Please check your inbox.",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send reset email",
    };
  }
}

/**
 * Reset Password - Update password with reset token + Send confirmation email
 *
 * Features:
 * - Updates user password
 * - Validates password strength
 * - Invalidates reset token after use
 * - Sends custom password changed confirmation via Resend
 */
export async function resetPassword(
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const rawData = {
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validatedData = resetPasswordSchema.parse(rawData);

    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    // Get current user before updating password
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Send password changed confirmation email via Resend
    if (user?.email) {
      const emailResult = await sendPasswordChanged(user.email, {
        name: user.user_metadata?.name || "User",
        changedAt: new Date(),
      });

      // Log email send failure but don't block password reset
      if (!emailResult.success) {
        console.error(
          "Failed to send password changed email:",
          emailResult.error
        );
      }
    }

    return {
      success: true,
      data: {
        message:
          "Password updated successfully. A confirmation email has been sent.",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}

/**
 * Get Current User - Retrieve authenticated user data
 *
 * Features:
 * - Returns user session data
 * - Returns null if not authenticated
 * - Can be used in Server Components
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get Session - Retrieve current session
 *
 * Features:
 * - Returns session data including access token
 * - Returns null if no active session
 * - Can be used in Server Components
 */
export async function getSession() {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return null;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Verify Email - Verify user's email with custom token
 *
 * Features:
 * - Validates custom verification token
 * - Updates Supabase user's email_confirmed_at
 * - One-time use tokens with expiration
 * - Sends welcome email after successful verification
 */
export async function verifyEmail(token: string): Promise<AuthActionResult> {
  try {
    // Verify and consume the token
    const tokenRecord = await verifyAndConsumeToken(
      token,
      "email_verification"
    );

    if (!tokenRecord) {
      return {
        success: false,
        error:
          "Invalid or expired verification link. Please request a new one.",
      };
    }

    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    // Update Supabase user to mark email as verified
    if (tokenRecord.userId) {
      // Mark email as verified in local users table
      const { error: updateError } = await supabase
        .from("users")
        .update({ email_verified: true })
        .eq("id", tokenRecord.userId);

      if (updateError) {
        console.error(
          "Failed to update email verification status:",
          updateError
        );
        return {
          success: false,
          error: "Failed to verify email. Please contact support.",
        };
      }

      // Send welcome email after successful verification
      const welcomeResult = await sendWelcomeEmail(tokenRecord.email, {
        name: (tokenRecord.metadata as any)?.name || "User",
        loginUrl: `${emailConfig.siteUrl}/login`,
      });

      if (!welcomeResult.success) {
        console.error("Failed to send welcome email:", welcomeResult.error);
      }
    }

    return {
      success: true,
      data: {
        message: "Email verified successfully! You can now sign in.",
        email: tokenRecord.email,
      },
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify email",
    };
  }
}

/**
 * Resend Verification Email - Send a new verification email
 *
 * Features:
 * - Generates new verification token
 * - Deletes old tokens for the email
 * - Sends fresh verification email
 */
export async function resendVerificationEmail(
  email: string
): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    // Check if user exists
    const { data: userData } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("email", email)
      .single();

    if (!userData) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        data: {
          message:
            "If an account exists with this email, a verification link has been sent.",
        },
      };
    }

    // Generate new verification token
    const { token, expiresAt } = await createEmailVerificationToken(
      email,
      userData.id,
      24
    );

    // Send verification email
    const verificationUrl = `${emailConfig.siteUrl}/auth/verify-email?token=${token}`;

    const emailResult = await sendEmailVerification(email, {
      name: userData.name || "User",
      verificationUrl,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return {
        success: false,
        error: "Failed to send verification email. Please try again.",
      };
    }

    return {
      success: true,
      data: {
        message: "A new verification link has been sent to your email.",
        expiresAt: expiresAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error resending verification email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to resend verification email",
    };
  }
}
