"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { getActiveCompanyId } from "@/lib/auth/company-context";

export type EmailProvider = "managed" | "gmail" | "disabled";

interface UpdateEmailProviderParams {
	provider: EmailProvider;
}

export async function updateEmailProvider(params: UpdateEmailProviderParams) {
	try {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = createServiceSupabaseClient();

		// Update the company's email provider
		const { error } = await supabase
			.from("companies")
			.update({
				email_provider: params.provider,
				email_provider_updated_at: new Date().toISOString(),
			})
			.eq("id", companyId);

		if (error) {
			console.error("Failed to update email provider:", error);
			return { success: false, error: error.message };
		}

		// Revalidate the settings page
		revalidatePath("/dashboard/settings/communications/email-provider");

		return { success: true };
	} catch (error) {
		console.error("Error updating email provider:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function getEmailProviderStatus() {
	try {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { provider: "managed" as EmailProvider, isConnected: false };
		}

		const supabase = createServiceSupabaseClient();

		// Get current provider setting
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("email_provider, email_provider_updated_at, email_provider_updated_by")
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			return { provider: "managed" as EmailProvider, isConnected: false };
		}

		const provider = (company.email_provider as EmailProvider) || "managed";

		// Check connection status based on provider
		let isConnected = false;

		if (provider === "managed") {
			// Check if Resend domain exists and is active
			const { data: domain } = await supabase
				.from("company_email_domains")
				.select("status, sending_enabled")
				.eq("company_id", companyId)
				.eq("is_platform_subdomain", true)
				.single();

			isConnected = domain?.status === "verified" && domain?.sending_enabled === true;
		} else if (provider === "gmail") {
			// Check if Gmail tokens exist and are valid
			const { data: tokens } = await supabase
				.from("company_gmail_tokens")
				.select("is_valid, token_expires_at")
				.eq("company_id", companyId)
				.single();

			isConnected = tokens?.is_valid === true && new Date(tokens.token_expires_at) > new Date();
		}

		return {
			provider,
			isConnected,
			updatedAt: company.email_provider_updated_at,
			updatedBy: company.email_provider_updated_by,
		};
	} catch (error) {
		console.error("Error getting email provider status:", error);
		return { provider: "managed" as EmailProvider, isConnected: false };
	}
}
