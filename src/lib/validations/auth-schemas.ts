/**
 * Authentication Validation Schemas
 *
 * Centralized Zod schemas for all authentication-related inputs.
 * These schemas ensure consistent validation across the application.
 *
 * Usage:
 * ```typescript
 * import { signUpSchema } from "@/lib/validations/auth-schemas";
 *
 * const validated = signUpSchema.parse(formData);
 * ```
 */

import { z } from "zod";
import { emailSchema } from "./shared-schemas";

/**
 * Password Validation Rules
 *
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 100 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - Optional: Special character (can be enforced later)
 */
export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(100, "Password is too long")
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number");

/**
 * Sign Up Schema
 *
 * Used for new user registration.
 */
export const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long").trim(),
	email: emailSchema,
	phone: z
		.string()
		.trim()
		.min(10, "Phone number is required")
		.refine((value) => value.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
	password: passwordSchema,
	terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
	companyName: z
		.string()
		.min(2, "Company name must be at least 2 characters")
		.max(200, "Company name is too long")
		.trim()
		.optional(),
});

/**
 * Sign In Schema
 *
 * Used for existing user login.
 */
export const signInSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().default(false).optional(),
});

/**
 * Forgot Password Schema
 *
 * Used for password reset requests.
 */
export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

/**
 * Reset Password Schema
 *
 * Used for setting new password after reset.
 * Ensures password and confirmation match.
 */
export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string(),
		token: z.string().min(1, "Reset token is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

/**
 * Change Password Schema
 *
 * Used for authenticated users changing their password.
 * Ensures new password is different from current.
 */
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password",
		path: ["newPassword"],
	});

/**
 * Update Profile Schema
 *
 * Used for updating user profile information.
 */
export const updateProfileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long").trim().optional(),
	bio: z.string().max(500, "Bio is too long").optional(),
	phone: z
		.string()
		.regex(/^(\+1|1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Invalid phone number format")
		.optional()
		.or(z.literal("")),
	avatar: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
});

/**
 * Email Verification Schema
 *
 * Used for verifying email with token.
 */
export const emailVerificationSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
});

/**
 * Resend Verification Email Schema
 *
 * Used for requesting a new verification email.
 */
export const resendVerificationSchema = z.object({
	email: emailSchema,
});

/**
 * OAuth Provider Schema
 *
 * Used for OAuth authentication.
 */
export const oauthProviderSchema = z.enum(["google", "facebook", "github"]);

// Type exports for TypeScript
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
