"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * Authentication Server Actions - Supabase Auth Integration
 *
 * Performance optimizations:
 * - Server Actions for secure authentication
 * - Supabase Auth handles password hashing and session management
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

// Types
export type AuthActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Sign Up - Create new user account with Supabase Auth
 *
 * Features:
 * - Email/password authentication
 * - Automatic email verification (if enabled in Supabase)
 * - Creates user profile in users table via database trigger
 * - Validates input with Zod
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
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      return {
        success: true,
        data: {
          requiresEmailConfirmation: true,
          message: "Please check your email to confirm your account.",
        },
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
 * - Clears Supabase session
 * - Clears cookies
 * - Redirects to login page
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

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

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
 * Forgot Password - Send password reset email
 *
 * Features:
 * - Sends password reset email via Supabase
 * - Secure token generation
 * - Email template configured in Supabase dashboard
 */
export async function forgotPassword(
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validatedData = forgotPasswordSchema.parse(rawData);

    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: "Authentication service is not configured.",
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
      }
    );

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

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
 * Reset Password - Update password with reset token
 *
 * Features:
 * - Updates user password
 * - Validates password strength
 * - Invalidates reset token after use
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

    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: {
        message:
          "Password updated successfully. You can now sign in with your new password.",
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
