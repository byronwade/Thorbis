"use server";

/**
 * Onboarding Server Actions
 *
 * Handles organization setup and onboarding completion
 *
 * Security:
 * - Server-side validation with Zod
 * - Authenticated user required
 * - Supabase RLS policies enforced
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const onboardingSchema = z.object({
	orgName: z.string().min(2, "Organization name must be at least 2 characters"),
	orgIndustry: z.string().min(2, "Industry is required"),
	orgSize: z.string().min(1, "Company size is required"),
	orgPhone: z.string().min(10, "Valid phone number is required"),
	orgAddress: z.string().min(5, "Business address is required"),
});

type OnboardingResult = {
	success: boolean;
	error?: string;
	companyId?: string;
};

export async function completeOnboarding(formData: FormData): Promise<OnboardingResult> {
	try {
		// Parse and validate form data
		const data = onboardingSchema.parse({
			orgName: formData.get("orgName"),
			orgIndustry: formData.get("orgIndustry"),
			orgSize: formData.get("orgSize"),
			orgPhone: formData.get("orgPhone"),
			orgAddress: formData.get("orgAddress"),
		});

		// Get authenticated user
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

		// Create organization/company
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.insert({
				name: data.orgName,
				industry: data.orgIndustry,
				company_size: data.orgSize,
				phone: data.orgPhone,
				address: data.orgAddress,
				created_by: user.id,
			})
			.select()
			.single();

		if (companyError) {
			console.error("Error creating company:", companyError);
			return {
				success: false,
				error: "Failed to create organization. Please try again.",
			};
		}

		// Update user profile to mark onboarding as complete
		const { error: profileError } = await supabase.from("profiles").update({ onboarding_completed: true, active_company_id: company.id }).eq("id", user.id);

		if (profileError) {
			console.error("Error updating profile:", profileError);
			// Don't fail the whole operation if profile update fails
		}

		// TODO: Process payment with Stripe
		// This is a placeholder - integrate with Stripe in production
		// const paymentResult = await createStripeSubscription(company.id, paymentMethodId);

		revalidatePath("/dashboard");

		return {
			success: true,
			companyId: company.id,
		};
	} catch (error) {
		console.error("Onboarding error:", error);

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
