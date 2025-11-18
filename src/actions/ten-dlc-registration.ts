"use server";

import { createClient } from "@/lib/supabase/server";
import {
	attachNumberToCampaign,
	createTenDlcBrand,
	createTenDlcCampaign,
	getTenDlcBrand,
	getTenDlcCampaign,
	type TenDlcBrandPayload,
	type TenDlcCampaignPayload,
} from "@/lib/telnyx/ten-dlc";

type RegistrationResult = {
	success: boolean;
	brandId?: string;
	campaignId?: string;
	error?: string;
	log: string[];
};

/**
 * Automated 10DLC registration for a company
 *
 * This function:
 * 1. Fetches company data from database
 * 2. Creates a 10DLC brand with Telnyx
 * 3. Waits for brand approval (polls status)
 * 4. Creates a 10DLC campaign
 * 5. Waits for campaign approval
 * 6. Attaches all company phone numbers to the campaign
 * 7. Updates company_telnyx_settings with brand and campaign IDs
 */
export async function registerCompanyFor10DLC(
	companyId: string,
): Promise<RegistrationResult> {
	const log: string[] = [];
	const supabase = await createClient();

	if (!supabase) {
		return {
			success: false,
			error: "Failed to create Supabase client",
			log,
		};
	}

	try {
		// 1. Fetch company data
		log.push("Fetching company data...");
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select(`
				id,
				name,
				ein,
				website,
				business_type,
				street_address,
				city,
				state,
				zip_code,
				country,
				primary_contact_first_name,
				primary_contact_last_name,
				primary_contact_email,
				primary_contact_phone,
				primary_contact_job_title
			`)
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			return {
				success: false,
				error: `Company not found: ${companyError?.message}`,
				log,
			};
		}

		// Validate required fields
		if (!company.ein) {
			return {
				success: false,
				error: "Company EIN is required for 10DLC registration",
				log,
			};
		}

		// 2. Check if already registered
		log.push("Checking existing 10DLC registration...");
		const { data: settings } = await supabase
			.from("company_telnyx_settings")
			.select("ten_dlc_brand_id, ten_dlc_campaign_id")
			.eq("company_id", companyId)
			.single();

		if (settings?.ten_dlc_brand_id && settings?.ten_dlc_campaign_id) {
			log.push("Company already has 10DLC registration");
			return {
				success: true,
				brandId: settings.ten_dlc_brand_id,
				campaignId: settings.ten_dlc_campaign_id,
				log,
			};
		}

		// 3. Create 10DLC Brand
		log.push("Creating 10DLC brand with Telnyx...");
		const brandPayload: TenDlcBrandPayload = {
			customer_reference: companyId,
			brand_name: company.name || "Unknown Company",
			ein: company.ein,
			ein_issuing_country: company.country || "US",
			vertical: determineVertical(company.business_type),
			website: company.website,
			company_type: "PRIVATE_PROFIT", // Default - could be made configurable
			address: {
				line1: company.street_address || "",
				city: company.city || "",
				state: company.state || "",
				postal_code: company.zip_code || "",
				country: company.country || "US",
			},
			contact: {
				first_name: company.primary_contact_first_name || "",
				last_name: company.primary_contact_last_name || "",
				email: company.primary_contact_email || "",
				phone: company.primary_contact_phone || "",
				job_position: company.primary_contact_job_title || "Owner",
			},
		};

		const brandResult = await createTenDlcBrand(brandPayload);

		if (!brandResult.success || !brandResult.data?.id) {
			return {
				success: false,
				error: `Failed to create 10DLC brand: ${brandResult.error}`,
				log,
			};
		}

		const brandId = brandResult.data.id;
		log.push(`Brand created: ${brandId}`);

		// 4. Poll brand status until approved (max 60 seconds)
		log.push("Waiting for brand approval...");
		const brandApproved = await pollForApproval(
			() => getTenDlcBrand(brandId),
			60,
		);

		if (!brandApproved) {
			log.push("Brand approval pending - will retry later");
			// Save brand ID even if not approved yet
			await supabase
				.from("company_telnyx_settings")
				.update({ ten_dlc_brand_id: brandId })
				.eq("company_id", companyId);

			return {
				success: false,
				error:
					"Brand created but approval pending. Please check back in a few minutes.",
				brandId,
				log,
			};
		}

		log.push("Brand approved");

		// 5. Create 10DLC Campaign
		log.push("Creating 10DLC campaign...");
		const campaignPayload: TenDlcCampaignPayload = {
			brand_id: brandId,
			campaign_alias: `${company.name} - Mixed Messaging`,
			usecase: "MIXED", // Mixed use case covers most business needs
			description: `Business messaging for ${company.name}`,
			sample_messages: [
				"Your appointment is confirmed for tomorrow at 2 PM.",
				"Thank you for your payment. Receipt: #12345",
				"Reminder: Service scheduled for next week.",
			],
			message_flow:
				"Customers opt-in when providing phone number. Messages sent for appointments, invoices, and general updates.",
			terms_and_conditions: company.website
				? `${company.website}/terms`
				: "https://stratos.thorbis.com/terms",
			help_message: "Reply HELP for assistance or call us.",
			help_phone_number: company.primary_contact_phone || "",
			help_email: company.primary_contact_email || "",
			auto_renewal: true,
			opt_in_keywords: ["START", "YES", "SUBSCRIBE"],
			opt_out_keywords: ["STOP", "END", "UNSUBSCRIBE", "CANCEL", "QUIT"],
			opt_in_message:
				"You are now subscribed to messages from " +
				company.name +
				". Reply STOP to unsubscribe.",
			opt_out_message:
				"You have been unsubscribed from " +
				company.name +
				" messages. Reply START to resubscribe.",
		};

		const campaignResult = await createTenDlcCampaign(campaignPayload);

		if (!campaignResult.success || !campaignResult.data?.id) {
			return {
				success: false,
				error: `Failed to create 10DLC campaign: ${campaignResult.error}`,
				brandId,
				log,
			};
		}

		const campaignId = campaignResult.data.id;
		log.push(`Campaign created: ${campaignId}`);

		// 6. Poll campaign status
		log.push("Waiting for campaign approval...");
		const campaignApproved = await pollForApproval(
			() => getTenDlcCampaign(campaignId),
			60,
		);

		if (!campaignApproved) {
			log.push("Campaign approval pending - will retry later");
			await supabase
				.from("company_telnyx_settings")
				.update({
					ten_dlc_brand_id: brandId,
					ten_dlc_campaign_id: campaignId,
				})
				.eq("company_id", companyId);

			return {
				success: false,
				error:
					"Campaign created but approval pending. Please check back in a few minutes.",
				brandId,
				campaignId,
				log,
			};
		}

		log.push("Campaign approved");

		// 7. Attach all company phone numbers to campaign
		log.push("Attaching phone numbers to campaign...");
		const { data: phoneNumbers } = await supabase
			.from("phone_numbers")
			.select("phone_number")
			.eq("company_id", companyId)
			.eq("status", "active");

		let attachedCount = 0;
		for (const phone of phoneNumbers || []) {
			const attachResult = await attachNumberToCampaign(
				campaignId,
				phone.phone_number,
			);

			if (attachResult.success) {
				attachedCount++;
			} else {
				log.push(
					`Failed to attach ${phone.phone_number}: ${attachResult.error}`,
				);
			}
		}

		log.push(`Attached ${attachedCount} phone numbers to campaign`);

		// 8. Update company settings
		log.push("Updating company Telnyx settings...");
		await supabase
			.from("company_telnyx_settings")
			.update({
				ten_dlc_brand_id: brandId,
				ten_dlc_campaign_id: campaignId,
			})
			.eq("company_id", companyId);

		return {
			success: true,
			brandId,
			campaignId,
			log,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			log,
		};
	}
}

/**
 * Poll approval status until approved or timeout
 */
async function pollForApproval(
	fetcher: () => Promise<{ success: boolean; data?: { status: string } }>,
	maxSeconds: number,
): Promise<boolean> {
	const startTime = Date.now();
	const pollInterval = 5000; // 5 seconds

	while (Date.now() - startTime < maxSeconds * 1000) {
		const result = await fetcher();

		if (!result.success || !result.data) {
			return false;
		}

		const status = result.data.status.toLowerCase();

		if (status === "approved" || status === "active") {
			return true;
		}

		if (status === "rejected" || status === "failed") {
			return false;
		}

		// Wait before polling again
		await new Promise((resolve) => setTimeout(resolve, pollInterval));
	}

	return false; // Timeout
}

/**
 * Map business type to 10DLC vertical
 */
function determineVertical(businessType?: string | null): string {
	if (!businessType) return "PROFESSIONAL_SERVICES";

	const type = businessType.toLowerCase();

	if (type.includes("healthcare") || type.includes("medical"))
		return "HEALTHCARE";
	if (type.includes("finance") || type.includes("banking"))
		return "FINANCIAL_SERVICES";
	if (type.includes("insurance")) return "INSURANCE";
	if (type.includes("real estate")) return "REAL_ESTATE";
	if (type.includes("retail") || type.includes("ecommerce")) return "RETAIL";
	if (type.includes("restaurant") || type.includes("food")) return "RESTAURANT";
	if (type.includes("education")) return "EDUCATION";
	if (type.includes("technology") || type.includes("software"))
		return "TECHNOLOGY";
	if (type.includes("nonprofit") || type.includes("charity"))
		return "NON_PROFIT";

	// Default for plumbing, HVAC, electrical, etc.
	return "PROFESSIONAL_SERVICES";
}
