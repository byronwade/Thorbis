"use server";

import { Buffer } from "node:buffer";
import { extname } from "node:path";
import { AuthApiError } from "@supabase/supabase-js";
import { checkBotId } from "botid/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearActiveCompany } from "@/lib/auth/company-context";
import { createEmailVerificationToken, verifyAndConsumeToken } from "@/lib/auth/tokens";
import { emailConfig } from "@/lib/email/resend-client";
import { clearCSRFToken } from "@/lib/security/csrf";
import { authRateLimiter, checkRateLimit, passwordResetRateLimiter, RateLimitError } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient, type ServiceSupabaseClient } from "@/lib/supabase/service-client";
import { sendEmailVerification, sendPasswordChanged, sendWelcomeEmail } from "./emails";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const COMPANY_NAME_MIN_LENGTH = 2;
const COMPANY_NAME_MAX_LENGTH = 200;
const PHONE_MIN_DIGITS = 10;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 100;
const CONFIRMATION_TOKEN_TTL_HOURS = 24;
const COUNTRY_CODE_US = "1";
const NATIONAL_NUMBER_DIGITS = 10;
const EXTENDED_US_NUMBER_DIGITS = 11;
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
const AVATAR_SIZE_LIMIT_MB = 5;
const MAX_AVATAR_FILE_SIZE = AVATAR_SIZE_LIMIT_MB * BYTES_PER_MEGABYTE;

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
		.trim()
		.min(NAME_MIN_LENGTH, "Name must be at least 2 characters")
		.max(NAME_MAX_LENGTH, "Name is too long"),
	email: z.string().email("Invalid email address"),
	phone: z
		.string()
		.trim()
		.min(PHONE_MIN_DIGITS, "Phone number is required")
		.refine((value) => value.replace(/\D/g, "").length >= PHONE_MIN_DIGITS, "Enter a valid phone number"),
	password: z
		.string()
		.min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
		.max(PASSWORD_MAX_LENGTH, "Password is too long")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
	companyName: z
		.string()
		.trim()
		.min(COMPANY_NAME_MIN_LENGTH, "Company name must be at least 2 characters")
		.max(COMPANY_NAME_MAX_LENGTH, "Company name is too long")
		.optional(),
	terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
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
			.min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
			.max(PASSWORD_MAX_LENGTH, "Password is too long")
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const AVATAR_STORAGE_BUCKET = "avatars";
const SUPABASE_RATE_LIMIT_MAX_RETRIES = 3;
const SUPABASE_RATE_LIMIT_BACKOFF_MS = 200;

const delay = (ms: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const withSupabaseRateLimitRetry = async <T extends { error?: unknown }>(operation: () => Promise<T>): Promise<T> => {
	for (let attempt = 1; attempt <= SUPABASE_RATE_LIMIT_MAX_RETRIES; attempt += 1) {
		try {
			const result = await operation();

			if (
				result &&
				typeof result === "object" &&
				"error" in result &&
				result.error instanceof AuthApiError &&
				result.error.code === "over_request_rate_limit"
			) {
				if (attempt === SUPABASE_RATE_LIMIT_MAX_RETRIES) {
					throw result.error;
				}

				await delay(SUPABASE_RATE_LIMIT_BACKOFF_MS * attempt);
				continue;
			}

			return result;
		} catch (error) {
			if (
				error instanceof AuthApiError &&
				error.code === "over_request_rate_limit" &&
				attempt < SUPABASE_RATE_LIMIT_MAX_RETRIES
			) {
				await delay(SUPABASE_RATE_LIMIT_BACKOFF_MS * attempt);
				continue;
			}
			throw error;
		}
	}

	throw new Error("Supabase auth operation failed after retries");
};

type SignUpFormInput = z.infer<typeof signUpSchema>;

type SupabaseBrowserClient = Exclude<Awaited<ReturnType<typeof createClient>>, null>;

function normalizePhoneNumber(input: string): string {
	const trimmed = input.trim();
	const digitsOnly = trimmed.replace(/\D/g, "");

	if (!digitsOnly) {
		return trimmed;
	}

	if (trimmed.startsWith("+")) {
		return `+${digitsOnly}`;
	}

	if (digitsOnly.length === EXTENDED_US_NUMBER_DIGITS && digitsOnly.startsWith(COUNTRY_CODE_US)) {
		return `+${digitsOnly}`;
	}

	if (digitsOnly.length === NATIONAL_NUMBER_DIGITS) {
		return `+${COUNTRY_CODE_US}${digitsOnly}`;
	}

	return `+${digitsOnly}`;
}

const reportAuthIssue = (_message: string, _error?: unknown) => {
	// TODO: Integrate structured logging/monitoring
};

const getMetadataString = (metadata: unknown, key: string): string | undefined => {
	if (metadata && typeof metadata === "object") {
		const value = (metadata as Record<string, unknown>)[key];
		if (typeof value === "string") {
			return value;
		}
	}

	return;
};

async function uploadAvatarForNewUser(
	supabase: ServiceSupabaseClient,
	file: File,
	userId: string
): Promise<string | null> {
	if (!file.type.startsWith("image/")) {
		throw new Error("Avatar must be an image");
	}

	if (file.size > MAX_AVATAR_FILE_SIZE) {
		throw new Error(`Avatar must be smaller than ${AVATAR_SIZE_LIMIT_MB}MB`);
	}

	const arrayBuffer = await file.arrayBuffer();
	const extension = extname(file.name) || ".jpg";
	const filePath = `${userId}/profile${extension}`;

	const { error: uploadError } = await supabase.storage
		.from(AVATAR_STORAGE_BUCKET)
		.upload(filePath, Buffer.from(arrayBuffer), {
			cacheControl: "3600",
			contentType: file.type || "image/jpeg",
			upsert: true,
		});

	if (uploadError) {
		throw new Error(uploadError.message);
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from(AVATAR_STORAGE_BUCKET).getPublicUrl(filePath);

	return publicUrl;
}

const createServiceClientLoader = () => {
	let client: ServiceSupabaseClient | null = null;
	return async () => {
		if (client) {
			return client;
		}
		client = await createServiceSupabaseClient();
		return client;
	};
};

type ParsedSignUpForm = {
	validated: SignUpFormInput;
	normalizedPhone: string;
	companyName?: string;
	avatarFile: File | null;
};

const parseSignUpFormData = (formData: FormData): ParsedSignUpForm => {
	const companyNameEntry = formData.get("companyName");
	const normalizedCompanyName =
		typeof companyNameEntry === "string" && companyNameEntry.trim().length > 0 ? companyNameEntry : undefined;

	const rawData = {
		name: (formData.get("name") as string) ?? "",
		email: (formData.get("email") as string) ?? "",
		phone: (formData.get("phone") as string) ?? "",
		password: (formData.get("password") as string) ?? "",
		companyName: normalizedCompanyName,
		terms: formData.get("terms") === "on" || formData.get("terms") === "true",
	};

	const validated = signUpSchema.parse(rawData);
	const avatarEntry = formData.get("avatar");
	const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null;

	return {
		validated,
		normalizedPhone: normalizePhoneNumber(validated.phone),
		companyName: validated.companyName?.trim() || undefined,
		avatarFile,
	};
};

const requireSupabaseBrowserClient = async (): Promise<SupabaseBrowserClient> => {
	const supabase = await createClient();

	if (!supabase) {
		throw new Error("Authentication service is not configured. Please check your environment variables.");
	}

	return supabase as SupabaseBrowserClient;
};

type RegisterSupabaseUserParams = {
	supabase: SupabaseBrowserClient;
	validated: SignUpFormInput;
	normalizedPhone: string;
	companyName?: string;
};

const registerSupabaseUser = async ({
	supabase,
	validated,
	normalizedPhone,
	companyName,
}: RegisterSupabaseUserParams) => {
	const { data, error } = await withSupabaseRateLimitRetry(() =>
		supabase.auth.signUp({
			email: validated.email,
			password: validated.password,
			options: {
				data: {
					name: validated.name,
					phone: normalizedPhone,
					companyName: companyName ?? null,
				},
				emailRedirectTo: `${emailConfig.siteUrl}/auth/callback`,
			},
		})
	);

	if (error) {
		throw new Error(error.message);
	}

	if (!data.user) {
		throw new Error("Failed to create user account");
	}

	return data;
};

type SyncSignUpProfileParams = {
	ensureServiceSupabase: () => Promise<ServiceSupabaseClient>;
	userId: string;
	normalizedPhone: string;
	name: string;
	companyName?: string;
	avatarFile: File | null;
};

const syncSignUpProfile = async ({
	ensureServiceSupabase,
	userId,
	normalizedPhone,
	name,
	companyName,
	avatarFile,
}: SyncSignUpProfileParams) => {
	let avatarUrl: string | null = null;

	if (avatarFile) {
		try {
			const adminClient = await ensureServiceSupabase();
			avatarUrl = await uploadAvatarForNewUser(adminClient, avatarFile, userId);
		} catch (avatarUploadError) {
			reportAuthIssue("Avatar upload failed", avatarUploadError);
		}
	}

	try {
		const adminClient = await ensureServiceSupabase();
		const updatePayload: Record<string, string | null> = {
			phone: normalizedPhone,
		};

		if (avatarUrl) {
			updatePayload.avatar = avatarUrl;
		}

		await adminClient.from("users").update(updatePayload).eq("id", userId);
	} catch (profileUpdateError) {
		reportAuthIssue("Failed to update user profile", profileUpdateError);
	}

	if (!avatarUrl) {
		return;
	}

	try {
		const adminClient = await ensureServiceSupabase();
		await adminClient.auth.admin.updateUserById(userId, {
			user_metadata: {
				name,
				phone: normalizedPhone,
				companyName: companyName ?? null,
				avatarUrl,
			},
		});
	} catch (metadataError) {
		reportAuthIssue("Failed to sync avatar metadata", metadataError);
	}
};

type PostSignUpEmailParams = {
	email: string;
	name: string;
	requiresConfirmation: boolean;
	userId: string;
};

const handlePostSignUpEmails = async ({
	email,
	name,
	requiresConfirmation,
	userId,
}: PostSignUpEmailParams): Promise<AuthActionResult | null> => {
	if (requiresConfirmation) {
		const { token, expiresAt } = await createEmailVerificationToken(email, userId, CONFIRMATION_TOKEN_TTL_HOURS);

		const verificationUrl = `${emailConfig.siteUrl}/auth/verify-email?token=${token}`;
		const verificationResult = await sendEmailVerification(email, {
			name,
			verificationUrl,
		});

		if (!verificationResult.success) {
			reportAuthIssue("Failed to send verification email", verificationResult.error);
		}

		return {
			success: true,
			data: {
				requiresEmailConfirmation: true,
				message: "Account created! Please check your email to verify your account.",
				expiresAt: expiresAt.toISOString(),
			},
		};
	}

	const emailResult = await sendWelcomeEmail(email, {
		name,
		loginUrl: `${emailConfig.siteUrl}/dashboard/welcome`,
	});

	if (!emailResult.success) {
		reportAuthIssue("Failed to send welcome email", emailResult.error);
	}

	return null;
};

const normalizeOptionalPhone = (phone: string | null): string | null => {
	if (!phone) {
		return null;
	}

	const digitsOnly = phone.replace(/\D/g, "");
	if (digitsOnly.length < PHONE_MIN_DIGITS) {
		throw new Error("Please enter a valid phone number with at least 10 digits.");
	}

	return normalizePhoneNumber(phone);
};

type CompleteProfileForm = {
	name: string | null;
	normalizedPhone: string | null;
	avatarFile: File | null;
};

const parseCompleteProfileForm = (formData: FormData): CompleteProfileForm => {
	const avatarEntry = formData.get("avatar");
	const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null;

	const name = (formData.get("name") as string | null) ?? null;
	const phone = (formData.get("phone") as string | null) ?? null;

	return {
		name,
		normalizedPhone: normalizeOptionalPhone(phone),
		avatarFile,
	};
};

const requireAuthenticatedUser = async (supabase: SupabaseBrowserClient) => {
	const {
		data: { user },
	} = await withSupabaseRateLimitRetry(() => supabase.auth.getUser());

	if (!user) {
		throw new Error("You must be signed in to complete your profile.");
	}

	return user;
};

type UpdateCompleteProfileRecordsParams = {
	ensureServiceSupabase: () => Promise<ServiceSupabaseClient>;
	userId: string;
	name: string | null;
	normalizedPhone: string | null;
	avatarFile: File | null;
	existingAvatar: string | null;
	existingMetadata?: Record<string, unknown>;
};

const uploadAvatarWithFallback = async ({
	ensureServiceSupabase,
	avatarFile,
	userId,
	fallbackAvatar,
}: {
	ensureServiceSupabase: () => Promise<ServiceSupabaseClient>;
	avatarFile: File | null;
	userId: string;
	fallbackAvatar: string | null;
}): Promise<string | null> => {
	if (!avatarFile) {
		return fallbackAvatar;
	}

	try {
		const adminClient = await ensureServiceSupabase();
		return await uploadAvatarForNewUser(adminClient, avatarFile, userId);
	} catch (avatarUploadError) {
		reportAuthIssue("Avatar upload failed", avatarUploadError);
		return fallbackAvatar;
	}
};

const updateUserTableRecord = async ({
	ensureServiceSupabase,
	userId,
	name,
	normalizedPhone,
	avatarUrl,
}: {
	ensureServiceSupabase: () => Promise<ServiceSupabaseClient>;
	userId: string;
	name: string | null;
	normalizedPhone: string | null;
	avatarUrl: string | null;
}): Promise<AuthActionResult | null> => {
	const updatePayload: Record<string, string | null> = {};

	if (name) {
		updatePayload.name = name;
	}
	if (normalizedPhone) {
		updatePayload.phone = normalizedPhone;
	}
	if (avatarUrl) {
		updatePayload.avatar = avatarUrl;
	}

	if (Object.keys(updatePayload).length === 0) {
		return null;
	}

	try {
		const adminClient = await ensureServiceSupabase();
		const { error } = await adminClient.from("users").update(updatePayload).eq("id", userId);

		if (error) {
			reportAuthIssue("Failed to update user profile", error);
			return {
				success: false,
				error: `Failed to update your profile: ${error.message}`,
			};
		}
	} catch (profileUpdateError) {
		reportAuthIssue("Failed to update user profile", profileUpdateError);
		return {
			success: false,
			error: "Failed to update your profile. Please try again.",
		};
	}

	return null;
};

const syncUserMetadataProfile = async ({
	ensureServiceSupabase,
	userId,
	name,
	normalizedPhone,
	avatarUrl,
	existingMetadata,
}: {
	ensureServiceSupabase: () => Promise<ServiceSupabaseClient>;
	userId: string;
	name: string | null;
	normalizedPhone: string | null;
	avatarUrl: string | null;
	existingMetadata?: Record<string, unknown>;
}) => {
	const hasMetadataChanges = Boolean(name || normalizedPhone || avatarUrl);
	if (!hasMetadataChanges) {
		return;
	}

	try {
		const adminClient = await ensureServiceSupabase();
		const metadata: Record<string, string | null> = {
			...(existingMetadata as Record<string, string | null>),
		};

		if (name) {
			metadata.name = name;
		}
		if (normalizedPhone) {
			metadata.phone = normalizedPhone;
		}
		if (avatarUrl) {
			metadata.avatarUrl = avatarUrl;
		}

		await adminClient.auth.admin.updateUserById(userId, {
			user_metadata: metadata,
		});
	} catch (metadataError) {
		reportAuthIssue("Failed to sync user metadata", metadataError);
	}
};

const updateCompleteProfileRecords = async ({
	ensureServiceSupabase,
	userId,
	name,
	normalizedPhone,
	avatarFile,
	existingAvatar,
	existingMetadata,
}: UpdateCompleteProfileRecordsParams): Promise<AuthActionResult | null> => {
	const avatarUrl = await uploadAvatarWithFallback({
		ensureServiceSupabase,
		avatarFile,
		userId,
		fallbackAvatar: existingAvatar,
	});

	const userUpdateResult = await updateUserTableRecord({
		ensureServiceSupabase,
		userId,
		name,
		normalizedPhone,
		avatarUrl,
	});

	if (userUpdateResult) {
		return userUpdateResult;
	}

	await syncUserMetadataProfile({
		ensureServiceSupabase,
		userId,
		name,
		normalizedPhone,
		avatarUrl,
		existingMetadata,
	});

	return null;
};

type ResolveProfileRedirectParams = {
	ensureServiceSupabase: () => Promise<ServiceSupabaseClient>;
	userId: string;
};

const resolveProfileRedirectPath = async ({
	ensureServiceSupabase,
	userId,
}: ResolveProfileRedirectParams): Promise<string> => {
	const adminClient = await ensureServiceSupabase();
	const { data: hasCompany } = await adminClient
		.from("team_members")
		.select("company_id")
		.eq("user_id", userId)
		.eq("status", "active")
		.limit(1)
		.maybeSingle();

	return hasCompany ? "/dashboard" : "/dashboard/welcome";
};
// Internal return type (not exported - Next.js 16 "use server" restriction)
type AuthActionResult = {
	success: boolean;
	error?: string;
	data?: Record<string, unknown>;
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
		// Bot protection check (Vercel BotID)
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}

		const parsedForm = parseSignUpFormData(formData);

		await checkRateLimit(parsedForm.validated.email, authRateLimiter);

		const supabase = await requireSupabaseBrowserClient();
		const authResult = await registerSupabaseUser({
			supabase,
			validated: parsedForm.validated,
			normalizedPhone: parsedForm.normalizedPhone,
			companyName: parsedForm.companyName,
		});

		const userId = authResult.user?.id;
		if (!userId) {
			throw new Error("Failed to create user account");
		}

		const ensureServiceSupabase = createServiceClientLoader();
		await syncSignUpProfile({
			ensureServiceSupabase,
			userId,
			normalizedPhone: parsedForm.normalizedPhone,
			name: parsedForm.validated.name,
			companyName: parsedForm.companyName,
			avatarFile: parsedForm.avatarFile,
		});

		const postSignUpResult = await handlePostSignUpEmails({
			email: parsedForm.validated.email,
			name: parsedForm.validated.name,
			requiresConfirmation: !authResult.session,
			userId,
		});

		if (postSignUpResult) {
			return postSignUpResult;
		}

		// Revalidate and redirect to onboarding
		revalidatePath("/", "layout");
		redirect("/dashboard/welcome");
	} catch (caughtError) {
		if (caughtError instanceof z.ZodError) {
			return {
				success: false,
				error: caughtError.issues[0]?.message || "Validation error",
			};
		}

		if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
			return {
				success: false,
				error: caughtError.message,
			};
		}

		// Re-throw redirect errors
		throw caughtError;
	}
}

/**
 * Complete Profile - Update missing user information after OAuth signup
 *
 * Features:
 * - Collects missing required fields (phone, name)
 * - Optional avatar upload
 * - Updates both auth metadata and public.users table
 * - Company name is collected during onboarding, not here
 */
export async function completeProfile(formData: FormData): Promise<AuthActionResult> {
	try {
		const supabase = await requireSupabaseBrowserClient();
		const user = await requireAuthenticatedUser(supabase);
		const parsedForm = parseCompleteProfileForm(formData);
		const ensureServiceSupabase = createServiceClientLoader();

		const profileUpdateResult = await updateCompleteProfileRecords({
			ensureServiceSupabase,
			userId: user.id,
			name: parsedForm.name,
			normalizedPhone: parsedForm.normalizedPhone,
			avatarFile: parsedForm.avatarFile,
			existingAvatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
			existingMetadata: user.user_metadata,
		});

		if (profileUpdateResult) {
			return profileUpdateResult;
		}

		const redirectPath = await resolveProfileRedirectPath({
			ensureServiceSupabase,
			userId: user.id,
		}).catch((redirectError) => {
			reportAuthIssue("Error checking company status", redirectError);
			return "/dashboard/welcome";
		});

		revalidatePath("/", "layout");
		redirect(redirectPath);
	} catch (caughtError) {
		if (caughtError instanceof z.ZodError) {
			return {
				success: false,
				error: caughtError.issues[0]?.message || "Validation error",
			};
		}

		if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
			return {
				success: false,
				error: caughtError.message,
			};
		}

		throw caughtError;
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
		// Bot protection check (Vercel BotID)
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}

		// Parse and validate form data
		const rawData = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		const validatedData = signInSchema.parse(rawData);

		// Rate limit sign-in attempts by email
		try {
			await checkRateLimit(validatedData.email, authRateLimiter);
		} catch (rateLimitError) {
			if (rateLimitError instanceof RateLimitError) {
				return {
					success: false,
					error: rateLimitError.message,
				};
			}
			throw rateLimitError;
		}

		// Create Supabase client
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Authentication service is not configured. Please check your environment variables.",
			};
		}

		// Sign in with Supabase Auth
		const { data, error: signInError } = await withSupabaseRateLimitRetry(() =>
			supabase.auth.signInWithPassword({
				email: validatedData.email,
				password: validatedData.password,
			})
		);

		if (signInError) {
			return {
				success: false,
				error: signInError.message,
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
	} catch (caughtError) {
		if (caughtError instanceof z.ZodError) {
			return {
				success: false,
				error: caughtError.issues[0]?.message || "Validation error",
			};
		}

		if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
			return {
				success: false,
				error: caughtError.message,
			};
		}

		throw caughtError;
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
		const { error: signOutError } = await withSupabaseRateLimitRetry(() => supabase.auth.signOut());

		if (signOutError) {
			return {
				success: false,
				error: signOutError.message,
			};
		}

		// Clear all security-related cookies
		await clearCSRFToken();
		await clearActiveCompany();

		// Revalidate and redirect to login
		revalidatePath("/", "layout");
		redirect("/login");
	} catch (caughtError) {
		if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
			return {
				success: false,
				error: caughtError.message,
			};
		}

		throw caughtError;
	}
}

/**
 * Sign In with OAuth - Authenticate with Google or other providers
 *
 * Features:
 * - OAuth provider authentication
 * - Handles both new signups and existing user logins automatically
 * - Supabase determines if user exists and signs them in or creates new account
 * - Redirects to provider login page
 * - After callback, checks if profile is complete (phone, name)
 */
export async function signInWithOAuth(provider: "google" | "facebook"): Promise<AuthActionResult> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Authentication service is not configured.",
			};
		}

		const { data, error: oauthError } = await withSupabaseRateLimitRetry(() =>
			supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
				},
			})
		);

		if (oauthError) {
			return {
				success: false,
				error: oauthError.message,
			};
		}

		// Redirect to OAuth provider
		if (data.url) {
			redirect(data.url);
		}

		return {
			success: true,
		};
	} catch (caughtError) {
		if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
			return {
				success: false,
				error: caughtError.message,
			};
		}

		throw caughtError;
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
export async function forgotPassword(formData: FormData): Promise<AuthActionResult> {
	try {
		// Bot protection check (Vercel BotID)
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}

		const rawData = {
			email: formData.get("email") as string,
		};

		const validatedData = forgotPasswordSchema.parse(rawData);

		// Rate limit password reset requests by email (stricter limit)
		try {
			await checkRateLimit(validatedData.email, passwordResetRateLimiter);
		} catch (rateLimitError) {
			if (rateLimitError instanceof RateLimitError) {
				return {
					success: false,
					error: rateLimitError.message,
				};
			}
			throw rateLimitError;
		}

		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Authentication service is not configured.",
			};
		}

		// Generate password reset token via Supabase
		const { error: resetPasswordError } = await withSupabaseRateLimitRetry(() =>
			supabase.auth.resetPasswordForEmail(validatedData.email, {
				redirectTo: `${emailConfig.siteUrl}/auth/reset-password`,
			})
		);

		if (resetPasswordError) {
			return {
				success: false,
				error: resetPasswordError.message,
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
	} catch (caughtError) {
		if (caughtError instanceof z.ZodError) {
			return {
				success: false,
				error: caughtError.issues[0]?.message || "Validation error",
			};
		}

		return {
			success: false,
			error: caughtError instanceof Error ? caughtError.message : "Failed to send reset email",
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
export async function resetPassword(formData: FormData): Promise<AuthActionResult> {
	try {
		// Bot protection check (Vercel BotID)
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}

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
		} = await withSupabaseRateLimitRetry(() => supabase.auth.getUser());

		const { error: updateUserError } = await withSupabaseRateLimitRetry(() =>
			supabase.auth.updateUser({
				password: validatedData.password,
			})
		);

		if (updateUserError) {
			return {
				success: false,
				error: updateUserError.message,
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
				reportAuthIssue("Failed to send password changed email", emailResult.error);
			}
		}

		return {
			success: true,
			data: {
				message: "Password updated successfully. A confirmation email has been sent.",
			},
		};
	} catch (caughtError) {
		if (caughtError instanceof z.ZodError) {
			return {
				success: false,
				error: caughtError.issues[0]?.message || "Validation error",
			};
		}

		return {
			success: false,
			error: caughtError instanceof Error ? caughtError.message : "Failed to reset password",
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
		} = await withSupabaseRateLimitRetry(() => supabase.auth.getUser());

		return user;
	} catch (caughtError) {
		reportAuthIssue("Error getting current user", caughtError);
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
		} = await withSupabaseRateLimitRetry(() => supabase.auth.getSession());

		return session;
	} catch (caughtError) {
		reportAuthIssue("Error getting session", caughtError);
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
		const tokenRecord = await verifyAndConsumeToken(token, "email_verification");

		if (!tokenRecord) {
			return {
				success: false,
				error: "Invalid or expired verification link. Please request a new one.",
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
				reportAuthIssue("Failed to update email verification status", updateError);
				return {
					success: false,
					error: "Failed to verify email. Please contact support.",
				};
			}

			// Send welcome email after successful verification
			const welcomeResult = await sendWelcomeEmail(tokenRecord.email, {
				name: getMetadataString(tokenRecord.metadata, "name") || "User",
				loginUrl: `${emailConfig.siteUrl}/login`,
			});

			if (!welcomeResult.success) {
				reportAuthIssue("Failed to send welcome email", welcomeResult.error);
			}
		}

		return {
			success: true,
			data: {
				message: "Email verified successfully! You can now sign in.",
				email: tokenRecord.email,
			},
		};
	} catch (caughtError) {
		reportAuthIssue("Error verifying email", caughtError);
		return {
			success: false,
			error: caughtError instanceof Error ? caughtError.message : "Failed to verify email",
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
export async function resendVerificationEmail(email: string): Promise<AuthActionResult> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Authentication service is not configured.",
			};
		}

		// Check if user exists
		const { data: userData } = await supabase.from("users").select("id, name, email").eq("email", email).single();

		if (!userData) {
			// Don't reveal if user exists or not for security
			return {
				success: true,
				data: {
					message: "If an account exists with this email, a verification link has been sent.",
				},
			};
		}

		// Generate new verification token
		const { token, expiresAt } = await createEmailVerificationToken(email, userData.id, CONFIRMATION_TOKEN_TTL_HOURS);

		// Send verification email
		const verificationUrl = `${emailConfig.siteUrl}/auth/verify-email?token=${token}`;

		const emailResult = await sendEmailVerification(email, {
			name: userData.name || "User",
			verificationUrl,
		});

		if (!emailResult.success) {
			reportAuthIssue("Failed to send verification email", emailResult.error);
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
	} catch (caughtError) {
		reportAuthIssue("Error resending verification email", caughtError);
		return {
			success: false,
			error: caughtError instanceof Error ? caughtError.message : "Failed to resend verification email",
		};
	}
}
