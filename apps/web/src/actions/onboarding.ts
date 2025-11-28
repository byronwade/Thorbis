"use server";

/**
 * Comprehensive Onboarding Server Actions
 *
 * Handles complete organization setup including:
 * - Database connection check
 * - Company creation with full details
 * - Team member invitations
 * - Phone number setup (purchase or port)
 * - Notification settings
 * - Payment setup (required)
 *
 * Security:
 * - Server-side validation with Zod
 * - Authenticated user required
 * - Supabase RLS policies enforced
 */

import { revalidatePath } from "next/cache";
import { start as startWorkflow } from "workflow/api";
import { z } from "zod";
import { generatePlatformSubdomain } from "@/lib/email/domain-validation";
import {
	DEFAULT_TRIAL_LENGTH_DAYS,
	ensureCompanyTrialStatus,
} from "@/lib/payments/trial-management";
import { geocodeAddressSilent } from "@/lib/services/geocoding";
import { createClient } from "@/lib/supabase/server";
import {
	createServiceSupabaseClient,
	type ServiceSupabaseClient,
} from "@/lib/supabase/service-client";
import { formatPhoneNumber, initiatePorting } from "@/lib/twilio/numbers";
import type { Json } from "@/types/supabase";
import { companyTrialWorkflow } from "@/workflows/company-trial";
import { ensureMessagingBranding } from "./messaging-branding";
import { updateNotificationSettings } from "./settings/communications";
import { purchasePhoneNumber } from "./twilio";

const onboardingSchema = z.object({
	orgName: z.string().min(2, "Organization name must be at least 2 characters"),
	orgIndustry: z.string().min(2, "Industry is required"),
	orgSize: z.string().min(1, "Company size is required"),
	orgPhone: z.string().min(10, "Valid phone number is required"),
	orgAddress: z.string().min(5, "Business address is required"),
	orgCity: z.string().min(2, "City is required"),
	orgState: z.string().min(2, "State is required"),
	orgZip: z.string().min(5, "ZIP code is required"),
	orgWebsite: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	orgTaxId: z.string().optional(),
});

// Regex constants for URL parsing (performance optimization)
const LEADING_SLASH_REGEX = /^\/+/;
const WWW_PREFIX_REGEX = /^www\./;
const PROTOCOL_REGEX = /^https?:\/\//;
const TEAM_MEMBER_FIELD_REGEX = /^teamMember_(\d+)_(\w+)$/;

type OnboardingResult = {
	success: boolean;
	error?: string;
	companyId?: string;
};

const INCOMPLETE_SUBSCRIPTION_STATUSES = [
	"incomplete",
	"incomplete_expired",
	"past_due",
	"canceled",
	"unpaid",
] as const;

type IncompleteCompanyCandidate = {
	id: string;
	name: string;
	normalizedName: string;
};

type ProgressUpdate = {
	step?: number;
	stepData?: Record<string, unknown>;
	patch?: Record<string, unknown>;
};

function normalizeCompanyName(name: string): string {
	return name.trim().toLowerCase();
}

function buildFullAddress(data: {
	orgAddress: string;
	orgCity: string;
	orgState: string;
	orgZip: string;
}): string {
	return [data.orgAddress, data.orgCity, data.orgState, data.orgZip]
		.filter(Boolean)
		.join(", ");
}

function formatDisplayPhoneNumber(phoneNumber: string): string {
	const digits = phoneNumber.replace(/\D/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return phoneNumber;
}

async function uploadCompanyLogo(
	serviceSupabase: ServiceSupabaseClient,
	companyId: string,
	logoFile: File | null,
): Promise<string | null> {
	if (!logoFile || logoFile.size === 0) {
		return null;
	}

	try {
		const fileExt = logoFile.name.split(".").pop() || "png";
		const fileName = `${companyId}-${Date.now()}.${fileExt}`;
		const filePath = `logos/${fileName}`;

		const { error: uploadError } = await serviceSupabase.storage
			.from("company-assets")
			.upload(filePath, logoFile, {
				cacheControl: "3600",
				upsert: false,
			});

		if (uploadError) {
			return null;
		}

		const {
			data: { publicUrl },
		} = serviceSupabase.storage.from("company-assets").getPublicUrl(filePath);

		const { error: updateError } = await serviceSupabase
			.from("companies")
			.update({ logo: publicUrl })
			.eq("id", companyId);

		if (updateError) {
			// Error already logged, continue
		}

		return publicUrl;
	} catch (_error) {
		return null;
	}
}

async function ensureActiveMembership(
	serviceSupabase: ServiceSupabaseClient,
	companyId: string,
	userId: string,
): Promise<void> {
	// First verify the table exists by checking if we can query it
	const { error: testError } = await serviceSupabase
		.from("company_memberships")
		.select("id")
		.limit(1);

	if (testError) {
		// If table doesn't exist, this is a critical error
		if (
			testError.message?.includes("does not exist") ||
			testError.code === "42P01"
		) {
			throw new Error(
				"Database schema error: team_members table not found. Please contact support.",
			);
		}
		throw new Error(`Database error: ${testError.message}`);
	}

	const { data: membership, error } = await serviceSupabase
		.from("company_memberships")
		.select("id, status")
		.eq("company_id", companyId)
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		throw new Error(`Failed to verify organization access: ${error.message}`);
	}

	if (!membership) {
		const { error: insertError } = await serviceSupabase
			.from("company_memberships")
			.insert({
				company_id: companyId,
				user_id: userId,
				status: "active",
				role: "owner", // Set as owner since they're creating the company
				joined_at: new Date().toISOString(),
			});

		if (insertError) {
			throw new Error(
				`Failed to add you to the organization: ${insertError.message}`,
			);
		}
		return;
	}

	if (membership.status !== "active") {
		const { error: updateError } = await serviceSupabase
			.from("company_memberships")
			.update({
				status: "active",
				deleted_at: null,
				deleted_by: null,
			})
			.eq("id", membership.id);

		if (updateError) {
			throw new Error(
				`Failed to reactivate your organization access: ${updateError.message}`,
			);
		}
	}
}

async function fetchIncompleteCompanyCandidates(
	serviceSupabase: ServiceSupabaseClient,
	userId: string,
): Promise<IncompleteCompanyCandidate[]> {
	const { data, error } = await serviceSupabase
		.from("company_memberships")
		.select(
			`
        company_id,
        status,
        companies!inner (
          id,
          name,
          stripe_subscription_status,
          deleted_at
        )
      `,
		)
		.eq("user_id", userId)
		.neq("status", "archived")
		.is("companies.deleted_at", null)
		.in(
			"companies.stripe_subscription_status",
			INCOMPLETE_SUBSCRIPTION_STATUSES,
		);

	if (error) {
		return [];
	}

	return (data ?? [])
		.filter((record: any) => record.companies)
		.map((record: any) => ({
			id: record.companies.id as string,
			name: record.companies.name as string,
			normalizedName: normalizeCompanyName(record.companies.name as string),
		}));
}

async function validateCompanyForOnboarding(
	serviceSupabase: ServiceSupabaseClient,
	userId: string,
	companyId?: string,
): Promise<IncompleteCompanyCandidate | null> {
	if (!companyId) {
		return null;
	}

	const { data: company, error } = await serviceSupabase
		.from("companies")
		.select("id, name, stripe_subscription_status, deleted_at")
		.eq("id", companyId)
		.maybeSingle();

	if (error) {
		return null;
	}

	if (
		!company ||
		company.deleted_at ||
		!INCOMPLETE_SUBSCRIPTION_STATUSES.includes(
			company.stripe_subscription_status as (typeof INCOMPLETE_SUBSCRIPTION_STATUSES)[number],
		)
	) {
		return null;
	}

	const { data: membership, error: membershipError } = await serviceSupabase
		.from("company_memberships")
		.select("status")
		.eq("user_id", userId)
		.eq("company_id", companyId)
		.neq("status", "archived")
		.maybeSingle();

	if (membershipError) {
		return null;
	}

	if (!membership) {
		return null;
	}

	return {
		id: company.id as string,
		name: company.name as string,
		normalizedName: normalizeCompanyName(company.name as string),
	};
}

function pickCompanyCandidate(options: {
	existing?: IncompleteCompanyCandidate | null;
	normalizedName: string;
	activeCompanyId?: string | null;
	candidates: IncompleteCompanyCandidate[];
}): string | null {
	const { existing, normalizedName, activeCompanyId, candidates } = options;

	if (existing) {
		return existing.id;
	}

	const byName = candidates.find(
		(candidate) => candidate.normalizedName === normalizedName,
	);
	if (byName) {
		return byName.id;
	}

	if (activeCompanyId) {
		const activeMatch = candidates.find(
			(candidate) => candidate.id === activeCompanyId,
		);
		if (activeMatch) {
			return activeMatch.id;
		}
	}

	return candidates[0]?.id ?? null;
}

async function generateUniqueSlug(
	serviceSupabase: ServiceSupabaseClient,
	baseSlug: string,
): Promise<string> {
	let slug = baseSlug;
	let counter = 1;
	let searching = true;

	while (searching) {
		const { data } = await serviceSupabase
			.from("companies")
			.select("id")
			.eq("slug", slug)
			.maybeSingle();

		if (data) {
			slug = `${baseSlug}-${counter}`;
			counter += 1;
		} else {
			searching = false;
		}
	}

	return slug;
}

function extractDomainFromUrl(url?: string | null) {
	if (!url) {
		return null;
	}
	try {
		const normalized = url.startsWith("http")
			? url
			: `https://${url.replace(LEADING_SLASH_REGEX, "")}`;
		const parsed = new URL(normalized);
		return parsed.hostname.replace(WWW_PREFIX_REGEX, "");
	} catch {
		const sanitized = url.replace(PROTOCOL_REGEX, "").split("/")[0];
		return sanitized || null;
	}
}

async function autoConfigureEmailInfrastructure(
	serviceSupabase: ServiceSupabaseClient,
	companyId: string,
	companySlug: string,
	_website?: string | null,
) {
	// Check if domain already exists for this company
	const { data: existingDomain } = await serviceSupabase
		.from("company_email_domains")
		.select("id")
		.eq("company_id", companyId)
		.maybeSingle();

	if (existingDomain) {
		// Domain already configured, skip
		return;
	}

	try {
		// Create platform subdomain (e.g., company-slug.mail.stratos.app)
		// Custom domains can be configured later in settings
		const platformDomain = generatePlatformSubdomain(companySlug);

		await serviceSupabase.from("company_email_domains").insert({
			company_id: companyId,
			domain_name: platformDomain,
			status: "verified", // Platform subdomains are pre-verified
			is_platform_subdomain: true,
			sending_enabled: true,
			reputation_score: 100,
			last_synced_at: new Date().toISOString(),
		});
	} catch (_error) {
		// Unable to set up email domain - can be configured later in settings
		console.warn(`[Onboarding] Failed to configure email domain for company ${companyId}`);
	}
}

async function updateOnboardingProgressRecord(
	serviceSupabase: ServiceSupabaseClient,
	companyId: string,
	update: ProgressUpdate,
): Promise<void> {
	const { data: company, error } = await serviceSupabase
		.from("companies")
		.select("onboarding_progress")
		.eq("id", companyId)
		.maybeSingle();

	if (error) {
		throw new Error(`Failed to load onboarding progress: ${error.message}`);
	}

	const current =
		(company?.onboarding_progress as Record<string, unknown>) || {};

	const next: Record<string, unknown> = {
		...current,
		...(update.patch ?? {}),
	};

	if (typeof update.step === "number") {
		next[`step${update.step}`] = update.stepData ?? {};
		const existingStep =
			typeof current.currentStep === "number"
				? (current.currentStep as number)
				: 1;
		next.currentStep = Math.max(existingStep, update.step);
	}

	next.lastUpdated = new Date().toISOString();

	const { error: updateError } = await serviceSupabase
		.from("companies")
		.update({ onboarding_progress: next as Json })
		.eq("id", companyId);

	if (updateError) {
		throw new Error(
			`Failed to update onboarding progress: ${updateError.message}`,
		);
	}
}

/**
 * Check database connection
 */
async function checkDatabaseConnection(): Promise<boolean> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return false;
		}

		// Simple query to test connection
		const { error } = await supabase.from("profiles").select("count").limit(1);
		return !error;
	} catch (_error) {
		return false;
	}
}

const TEAM_MEMBER_PREFIX = "teamMember_";

type TeamMemberProgressInput = {
	email: string;
	firstName: string;
	lastName: string;
	role?: string;
};

function extractTeamMembers(formData: FormData): TeamMemberProgressInput[] {
	const members: Record<number, TeamMemberProgressInput> = {};

	for (const [key, value] of formData.entries()) {
		if (!key.startsWith(TEAM_MEMBER_PREFIX) || typeof value !== "string") {
			continue;
		}

		const match = key.match(TEAM_MEMBER_FIELD_REGEX);
		if (!match) {
			continue;
		}

		const index = Number.parseInt(match[1], 10);
		const field = match[2];
		if (!Number.isFinite(index)) {
			continue;
		}

		const existing = members[index] || {
			email: "",
			firstName: "",
			lastName: "",
		};

		switch (field) {
			case "email":
				existing.email = value.trim();
				break;
			case "firstName":
				existing.firstName = value.trim();
				break;
			case "lastName":
				existing.lastName = value.trim();
				break;
			case "role":
				existing.role = value.trim();
				break;
			default:
				break;
		}

		members[index] = existing;
	}

	return Object.values(members).filter(
		(member) => member.email || member.firstName || member.lastName,
	);
}

async function saveOnboardingProgress(
	formData: FormData,
	existingCompanyId?: string,
	step?: number,
	stepData?: Record<string, unknown>,
): Promise<OnboardingResult> {
	try {
		const data = onboardingSchema.parse({
			orgName: formData.get("orgName"),
			orgIndustry: formData.get("orgIndustry"),
			orgSize: formData.get("orgSize"),
			orgPhone: formData.get("orgPhone"),
			orgAddress: formData.get("orgAddress"),
			orgCity: formData.get("orgCity"),
			orgState: formData.get("orgState"),
			orgZip: formData.get("orgZip"),
			orgWebsite: formData.get("orgWebsite"),
			orgTaxId: formData.get("orgTaxId"),
		});

		const supabase = await createClient();
		if (!supabase) {
			return {
				success: false,
				error: "Database not configured",
			};
		}

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user || !user.id) {
			return {
				success: false,
				error: "You must be logged in to save progress",
			};
		}

		const userId = user.id as string;
		const serviceSupabase = await createServiceSupabaseClient();

		const normalizedName = normalizeCompanyName(data.orgName);
		const logoFile = (formData.get("logo") as File | null) ?? null;

		const companyContext = await import("@/lib/auth/company-context");
		const activeCompanyId = await companyContext.getActiveCompanyId();

		const [existingCandidate, candidates] = await Promise.all([
			validateCompanyForOnboarding(serviceSupabase, userId, existingCompanyId),
			fetchIncompleteCompanyCandidates(serviceSupabase, userId),
		]);

		let companyId = pickCompanyCandidate({
			existing: existingCandidate,
			normalizedName,
			activeCompanyId,
			candidates,
		});

		const fullAddress = buildFullAddress(data);
		const step1Snapshot = {
			name: data.orgName,
			industry: data.orgIndustry,
			companySize: data.orgSize,
			phone: data.orgPhone,
			address: fullAddress,
			website: data.orgWebsite || "",
			taxId: data.orgTaxId || "",
		};

		// Geocode company address
		let companyLat: number | null = null;
		let companyLon: number | null = null;

		const geocodeResult = await geocodeAddressSilent(
			data.orgAddress,
			data.orgCity,
			data.orgState,
			data.orgZip,
			"USA",
		);

		if (geocodeResult) {
			companyLat = geocodeResult.lat;
			companyLon = geocodeResult.lon;
		}

		let createdCompany = false;
		let companySlug = "";

		if (companyId) {
			// Fetch existing company's slug
			const { data: existingCompany } = await serviceSupabase
				.from("companies")
				.select("slug")
				.eq("id", companyId)
				.single();

			companySlug = existingCompany?.slug || `company-${companyId.slice(0, 8)}`;

			const updatePayload = {
				name: data.orgName,
				industry: data.orgIndustry,
				company_size: data.orgSize,
				phone: data.orgPhone,
				address: fullAddress,
				city: data.orgCity,
				state: data.orgState,
				zip_code: data.orgZip,
				website: data.orgWebsite || null,
				tax_id: data.orgTaxId || null,
				lat: companyLat,
				lon: companyLon,
			};

			const { error: updateError } = await serviceSupabase
				.from("companies")
				.update(updatePayload)
				.eq("id", companyId);

			if (updateError) {
				return {
					success: false,
					error: `Failed to update company: ${updateError.message}`,
				};
			}
		} else {
			const baseSlug =
				data.orgName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "") || `company-${Date.now()}`;
			companySlug = await generateUniqueSlug(serviceSupabase, baseSlug);

			const { data: company, error: companyError } = await serviceSupabase
				.from("companies")
				.insert({
					name: data.orgName,
					slug: companySlug,
					industry: data.orgIndustry,
					company_size: data.orgSize,
					phone: data.orgPhone,
					address: fullAddress,
					city: data.orgCity,
					state: data.orgState,
					zip_code: data.orgZip,
					website: data.orgWebsite || null,
					tax_id: data.orgTaxId || null,
					lat: companyLat,
					lon: companyLon,
					created_by: userId,
					owner_id: userId,
					stripe_subscription_status: "incomplete",
				})
				.select("id")
				.single();

			if (companyError || !company) {
				return {
					success: false,
					error: `Failed to create company: ${companyError?.message || "Unknown error"}`,
				};
			}

			companyId = company.id;
			createdCompany = true;
		}

		if (!companyId) {
			return {
				success: false,
				error: "Company ID is required",
			};
		}

		if (createdCompany) {
			try {
				await ensureCompanyTrialStatus({
					companyId,
					trialLengthDays: DEFAULT_TRIAL_LENGTH_DAYS,
					serviceClient: serviceSupabase,
				});
				await startWorkflow(companyTrialWorkflow, [
					{ companyId, trialLengthDays: DEFAULT_TRIAL_LENGTH_DAYS },
				]);
			} catch (_trialError) {
				// Ignore trial workflow errors
			}
		}

		try {
			await ensureActiveMembership(serviceSupabase, companyId, userId);
		} catch (membershipError) {
			if (createdCompany) {
				try {
					await serviceSupabase.from("companies").delete().eq("id", companyId);
				} catch (_cleanupError) {
					// Ignore cleanup errors
				}
			}

			return {
				success: false,
				error:
					membershipError instanceof Error
						? membershipError.message
						: "Failed to add you to the organization",
			};
		}

		await uploadCompanyLogo(serviceSupabase, companyId, logoFile);

		try {
			const brandingResult = await ensureMessagingBranding(companyId, {
				supabase: serviceSupabase,
			});

			if (!brandingResult.success) {
				// Branding setup failed, continue
			}
		} catch (_brandingError) {
			// Ignore branding errors during onboarding
		}

		try {
			await autoConfigureEmailInfrastructure(
				serviceSupabase,
				companyId,
				companySlug,
				data.orgWebsite,
			);
		} catch (_emailInfraError) {
			// Ignore email infrastructure errors during onboarding
		}

		const progressStep = typeof step === "number" ? step : 1;
		const progressData = stepData ?? (progressStep === 1 ? step1Snapshot : {});

		try {
			await updateOnboardingProgressRecord(serviceSupabase, companyId, {
				step: progressStep,
				stepData: progressData,
				patch: {
					step1: step1Snapshot,
				},
			});
		} catch (progressError) {
			return {
				success: false,
				error:
					progressError instanceof Error
						? progressError.message
						: "Failed to save onboarding progress",
			};
		}

		try {
			await companyContext.setActiveCompany(companyId);
		} catch (_error) {
			// Ignore errors setting active company
		}

		// REMOVED: revalidatePath("/welcome");
		// Causes infinite POST loop when auto-saving progress
		revalidatePath("/", "layout");

		return {
			success: true,
			companyId,
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
			error: "An unexpected error occurred. Please try again.",
		};
	}
}

async function completeOnboarding(
	formData: FormData,
): Promise<OnboardingResult> {
	const result = await saveOnboardingProgress(formData);

	if (!(result.success && result.companyId)) {
		return result;
	}

	const teamMembers = extractTeamMembers(formData);
	if (teamMembers.length > 0) {
		const teamResult = await saveOnboardingStepProgress(result.companyId, 2, {
			teamMembers,
		});

		if (!teamResult.success) {
			return teamResult;
		}
	}

	return result;
}

/**
 * Save onboarding progress for a specific step (without company details)
 * Used for steps 2-5 (team members, phone number, notifications, etc.)
 *
 * @param companyId - The ID of the company to save progress for
 * @param step - The step number (2-5)
 * @param stepData - The data to save for this step
 * @returns Promise resolving to OnboardingResult
 */
async function saveOnboardingStepProgress(
	companyId: string,
	step: number,
	stepData: Record<string, unknown>,
): Promise<OnboardingResult> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Database not configured",
			};
		}

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				success: false,
				error: "You must be logged in to save progress",
			};
		}

		const serviceSupabase = await createServiceSupabaseClient();

		const candidate = await validateCompanyForOnboarding(
			serviceSupabase,
			user.id,
			companyId,
		);

		if (!candidate) {
			return {
				success: false,
				error: "Company not found. Please go back and complete step 1.",
			};
		}

		try {
			await ensureActiveMembership(serviceSupabase, companyId, user.id);
		} catch (membershipError) {
			return {
				success: false,
				error:
					membershipError instanceof Error
						? membershipError.message
						: "You don't have access to this company",
			};
		}

		try {
			await updateOnboardingProgressRecord(serviceSupabase, companyId, {
				step,
				stepData,
			});
		} catch (progressError) {
			return {
				success: false,
				error:
					progressError instanceof Error
						? progressError.message
						: "Failed to save progress",
			};
		}

		// REMOVED: revalidatePath("/welcome");
		// This was causing infinite POST request loop on welcome page
		// Only revalidate when onboarding is complete, not on every step save

		return {
			success: true,
			companyId,
		};
	} catch (_error) {
		return {
			success: false,
			error: "An unexpected error occurred. Please try again.",
		};
	}
}

/**
 * Purchase a phone number during onboarding
 */
async function purchaseOnboardingPhoneNumber(formData: FormData): Promise<{
	success: boolean;
	error?: string;
	phoneNumberId?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "You must be logged in" };
		}

		// Get active company ID
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const activeCompanyId = await getActiveCompanyId();

		if (!activeCompanyId) {
			return { success: false, error: "Company not found" };
		}

		// Verify user has access to the active company
		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("company_id", activeCompanyId)
			.eq("status", "active")
			.maybeSingle();

		if (!teamMember?.company_id) {
			return { success: false, error: "You don't have access to this company" };
		}

		const phoneNumber = formData.get("phoneNumber") as string;
		const _areaCode = formData.get("areaCode") as string | null;

		if (!phoneNumber) {
			return { success: false, error: "Phone number is required" };
		}

		const result = await purchasePhoneNumber({
			phoneNumber,
			companyId: activeCompanyId,
		});

		if (result.success) {
			revalidatePath("/welcome");
		}

		return result;
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to purchase phone number",
		};
	}
}

/**
 * Port a phone number during onboarding
 */
export async function portOnboardingPhoneNumber(formData: FormData): Promise<{
	success: boolean;
	error?: string;
	portingOrderId?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "You must be logged in" };
		}

		// Get active company ID
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const activeCompanyId = await getActiveCompanyId();

		if (!activeCompanyId) {
			return { success: false, error: "Company not found" };
		}

		// Verify user has access to the active company
		const { data: teamMember } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("company_id", activeCompanyId)
			.eq("status", "active")
			.maybeSingle();

		if (!teamMember?.company_id) {
			return { success: false, error: "You don't have access to this company" };
		}

		const phoneNumber = formData.get("phoneNumber") as string;
		const currentCarrier = formData.get("currentCarrier") as string;
		const accountNumber = formData.get("accountNumber") as string;
		const accountPin = formData.get("accountPin") as string;
		const addressLine1 = formData.get("addressLine1") as string;
		const city = formData.get("city") as string;
		const state = formData.get("state") as string;
		const zipCode = formData.get("zipCode") as string;
		const authorizedPerson = formData.get("authorizedPerson") as string;
		const authorizedEmail = formData.get("authorizedEmail") as string;

		if (
			!(
				phoneNumber &&
				currentCarrier &&
				accountNumber &&
				accountPin &&
				addressLine1 &&
				city &&
				state &&
				zipCode &&
				authorizedPerson
			)
		) {
			return { success: false, error: "All required fields must be filled" };
		}

		const result = await initiatePorting({
			phoneNumbers: [phoneNumber],
			accountNumber,
			accountPin,
			authorizedPerson,
			addressLine1,
			city,
			stateOrProvince: state,
			zipOrPostalCode: zipCode,
			countryCode: "US",
		});

		if (result.success) {
			const formattedE164 = formatPhoneNumber(phoneNumber);
			const formattedDisplay = formatDisplayPhoneNumber(formattedE164);

			const { data: portRecord, error: portRecordError } = await supabase
				.from("phone_porting_requests")
				.insert({
					company_id: activeCompanyId,
					user_id: user.id,
					current_phone_number: formattedE164,
					current_carrier: currentCarrier,
					account_number: accountNumber,
					account_pin: accountPin,
					porting_type: "standard",
					status: "submitted",
					twilio_order_id: result.portingOrderId || null,
					twilio_status: (result.data as any)?.status || null,
					service_address: {
						address_line_1: addressLine1,
						city,
						state,
						postal_code: zipCode,
					},
					metadata: {
						authorized_email: authorizedEmail,
					},
				})
				.select("id")
				.single();

			if (portRecordError) {
				console.error(
					"Failed to create porting request record:",
					portRecordError.message,
				);
				// Continue with operation - porting was already initiated via external API
			}

			const portingRequestId = portRecord?.id ?? null;

			const { data: existingPhone } = await supabase
				.from("phone_numbers")
				.select("id")
				.eq("company_id", activeCompanyId)
				.eq("phone_number", formattedE164)
				.maybeSingle();

			if (existingPhone?.id) {
				await supabase
					.from("phone_numbers")
					.update({
						status: "porting",
						porting_request_id: portingRequestId,
					})
					.eq("id", existingPhone.id);
			} else if (portingRequestId) {
				const { error: insertPhoneError } = await supabase
					.from("phone_numbers")
					.insert({
						company_id: activeCompanyId,
						phone_number: formattedE164,
						formatted_number: formattedDisplay,
						country_code: "US",
						number_type: "local",
						status: "porting",
						porting_request_id: portingRequestId,
						metadata: {
							source: "porting",
						},
					});

				if (insertPhoneError) {
					console.error(
						"Failed to create phone number record:",
						insertPhoneError.message,
					);
					// Continue with operation - porting was already initiated
				}
			}

			revalidatePath("/welcome");
		}

		return result;
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to initiate porting",
		};
	}
}

/**
 * Save notification settings during onboarding
 */
async function saveOnboardingNotificationSettings(formData: FormData): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		// Use existing notification settings action
		const result = await updateNotificationSettings(formData);
		return result;
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to save notification settings",
		};
	}
}

/**
 * Save payment processor setup during onboarding (Step 5)
 * This step configures payment processors before final completion
 */
async function savePaymentSetupProgress(
	companyId: string,
	paymentConfig: {
		adyenEnabled?: boolean;
		plaidEnabled?: boolean;
		profitStarsEnabled?: boolean;
		payoutSpeed?: "standard" | "instant" | "daily";
		skipPaymentSetup?: boolean;
	},
): Promise<OnboardingResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database not configured" };
		}

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return { success: false, error: "You must be logged in" };
		}

		const serviceSupabase = await createServiceSupabaseClient();

		// Verify company access
		const candidate = await validateCompanyForOnboarding(
			serviceSupabase,
			user.id,
			companyId,
		);

		if (!candidate) {
			return {
				success: false,
				error: "Company not found. Please go back and complete step 1.",
			};
		}

		// If not skipping, create/update payment processor config
		if (!paymentConfig.skipPaymentSetup) {
			const { data: existingConfig } = await serviceSupabase
				.from("company_payment_processors")
				.select("id")
				.eq("company_id", companyId)
				.maybeSingle();

			if (existingConfig) {
				await serviceSupabase
					.from("company_payment_processors")
					.update({
						adyen_enabled: paymentConfig.adyenEnabled ?? false,
						plaid_enabled: paymentConfig.plaidEnabled ?? false,
						profitstars_enabled: paymentConfig.profitStarsEnabled ?? false,
						updated_at: new Date().toISOString(),
					})
					.eq("company_id", companyId);
			} else {
				await serviceSupabase.from("company_payment_processors").insert({
					company_id: companyId,
					adyen_enabled: paymentConfig.adyenEnabled ?? false,
					plaid_enabled: paymentConfig.plaidEnabled ?? false,
					profitstars_enabled: paymentConfig.profitStarsEnabled ?? false,
				});
			}

			// Create payout schedule if payout speed specified
			if (paymentConfig.payoutSpeed) {
				const { data: existingSchedule } = await serviceSupabase
					.from("payout_schedules")
					.select("id")
					.eq("company_id", companyId)
					.maybeSingle();

				if (existingSchedule) {
					await serviceSupabase
						.from("payout_schedules")
						.update({
							payout_speed: paymentConfig.payoutSpeed,
							updated_at: new Date().toISOString(),
						})
						.eq("company_id", companyId);
				} else {
					await serviceSupabase.from("payout_schedules").insert({
						company_id: companyId,
						payout_speed: paymentConfig.payoutSpeed,
					});
				}
			}
		}

		// Update onboarding progress
		await updateOnboardingProgressRecord(serviceSupabase, companyId, {
			step: 5,
			stepData: {
				...paymentConfig,
				completed: true,
				completedAt: new Date().toISOString(),
			},
		});

		revalidatePath("/welcome");

		return { success: true, companyId };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to save payment setup",
		};
	}
}

/**
 * Complete the onboarding wizard and mark the company as fully set up
 * This sets onboarding_completed_at timestamp which unlocks full dashboard access
 */
export async function completeOnboardingWizard(
	onboardingData: Record<string, unknown>,
): Promise<OnboardingResult> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Database not configured",
			};
		}

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				success: false,
				error: "You must be logged in to complete onboarding",
			};
		}

		// Get active company
		const { getActiveCompanyId } = await import("@/lib/auth/company-context");
		const activeCompanyId = await getActiveCompanyId();

		if (!activeCompanyId) {
			return {
				success: false,
				error: "No active company found. Please complete company setup first.",
			};
		}

		const serviceSupabase = await createServiceSupabaseClient();

		// Verify user has access to this company
		const { data: membership } = await serviceSupabase
			.from("company_memberships")
			.select("id, role")
			.eq("company_id", activeCompanyId)
			.eq("user_id", user.id)
			.eq("status", "active")
			.maybeSingle();

		if (!membership) {
			return {
				success: false,
				error: "You don't have access to this company",
			};
		}

		// Update company with onboarding completion timestamp and full progress
		const now = new Date().toISOString();
		const { error: updateError } = await serviceSupabase
			.from("companies")
			.update({
				onboarding_completed_at: now,
				onboarding_progress: {
					...(onboardingData as Record<string, unknown>),
					completedAt: now,
					completedBy: user.id,
				} as Json,
			})
			.eq("id", activeCompanyId);

		if (updateError) {
			return {
				success: false,
				error: `Failed to complete onboarding: ${updateError.message}`,
			};
		}

		// Revalidate all dashboard paths
		revalidatePath("/dashboard");
		revalidatePath("/welcome");
		revalidatePath("/", "layout");

		return {
			success: true,
			companyId: activeCompanyId,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred while completing onboarding",
		};
	}
}

async function archiveIncompleteCompany(
	companyId: string,
): Promise<OnboardingResult> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Database not configured",
			};
		}

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				success: false,
				error: "You must be logged in to archive a company",
			};
		}

		const serviceSupabase = await createServiceSupabaseClient();

		const { data: company, error: companyError } = await serviceSupabase
			.from("companies")
			.select("id, stripe_subscription_status, owner_id")
			.eq("id", companyId)
			.maybeSingle();

		if (companyError) {
			return {
				success: false,
				error: `Failed to verify company: ${companyError.message}`,
			};
		}

		if (!company) {
			return {
				success: false,
				error: "Company not found",
			};
		}

		if (company.owner_id !== user.id) {
			return {
				success: false,
				error: "You can only archive companies you own",
			};
		}

		if (
			company.stripe_subscription_status === "active" ||
			company.stripe_subscription_status === "trialing"
		) {
			return {
				success: false,
				error: "Cannot archive a company with an active subscription",
			};
		}

		const now = new Date();
		const permanentDeleteDate = new Date(now);
		permanentDeleteDate.setDate(now.getDate() + 90);

		const timestamp = now.toISOString();

		const { error: archiveError } = await serviceSupabase
			.from("companies")
			.update({
				deleted_at: timestamp,
				deleted_by: user.id,
				archived_at: timestamp,
				permanent_delete_scheduled_at: permanentDeleteDate.toISOString(),
			})
			.eq("id", companyId);

		if (archiveError) {
			return {
				success: false,
				error: `Failed to archive company: ${archiveError.message}`,
			};
		}

		const { error: memberArchiveError } = await serviceSupabase
			.from("company_memberships")
			.update({
				deleted_at: timestamp,
				deleted_by: user.id,
				status: "archived",
			})
			.eq("company_id", companyId);

		if (memberArchiveError) {
			console.error(
				"Failed to archive company memberships:",
				memberArchiveError.message,
			);
			// Continue - company was archived but memberships may be orphaned
			// This should be cleaned up by a scheduled job
		}

		const { getActiveCompanyId, clearActiveCompany } = await import(
			"@/lib/auth/company-context"
		);
		const activeCompanyId = await getActiveCompanyId();
		if (activeCompanyId === companyId) {
			await clearActiveCompany();
		}

		revalidatePath("/welcome");
		revalidatePath("/", "layout");
		revalidatePath("/dashboard/settings/archive");

		return {
			success: true,
		};
	} catch (_error) {
		return {
			success: false,
			error: "An unexpected error occurred. Please try again.",
		};
	}
}
