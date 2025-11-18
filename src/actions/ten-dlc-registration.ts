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
				industry,
				address,
				city,
				state,
				zip_code,
				phone,
				email,
				support_email,
				support_phone
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
				error: "Company EIN is required for 10DLC registration. Please add the company's Tax ID.",
				log,
			};
		}

		if (!company.address || !company.city || !company.state || !company.zip_code) {
			return {
				success: false,
				error: "Company address is incomplete. Please add full address, city, state, and ZIP code.",
				log,
			};
		}

		const contactEmail = company.email || company.support_email;
		const contactPhone = company.phone || company.support_phone;

		if (!contactEmail || !contactPhone) {
			return {
				success: false,
				error: "Company contact email and phone are required for 10DLC registration.",
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
			entityType: "PRIVATE_PROFIT", // Default - could be made configurable
			displayName: company.name || "Unknown Company",
			companyName: company.name || "Unknown Company",
			firstName: "Business", // No separate first/last name fields in companies table
			lastName: "Owner",
			ein: company.ein,
			phone: contactPhone,
			street: company.address || "",
			city: company.city || "",
			state: company.state || "",
			postalCode: company.zip_code || "",
			country: "US",
			email: contactEmail,
			website: company.website,
			vertical: determineVertical(company.industry),
			businessContactEmail: contactEmail,
			isReseller: false,
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
			brandId: brandId,
			usecase: "MIXED", // Mixed use case covers most business needs
			description: `Business messaging for ${company.name}`,
			messageFlow:
				"Customers opt-in when providing phone number. Messages sent for appointments, invoices, and general updates.",
			helpMessage: "Reply HELP for assistance or call us.",
			helpKeywords: "HELP",
			optinKeywords: "START YES SUBSCRIBE",
			optinMessage:
				"You are now subscribed to messages from " +
				company.name +
				". Reply STOP to unsubscribe.",
			optoutKeywords: "STOP END UNSUBSCRIBE CANCEL QUIT",
			optoutMessage:
				"You have been unsubscribed from " +
				company.name +
				" messages. Reply START to resubscribe.",
			sample1: "Your appointment is confirmed for tomorrow at 2 PM.",
			sample2: "Thank you for your payment. Receipt: #12345",
			sample3: "Reminder: Service scheduled for next week.",
			autoRenewal: true,
			termsAndConditions: true,
			termsAndConditionsLink: company.website
				? `${company.website}/terms`
				: "https://stratos.thorbis.com/terms",
			subscriberHelp: true,
			subscriberOptin: true,
			subscriberOptout: true,
		};

		const campaignResult = await createTenDlcCampaign(campaignPayload);

		if (!campaignResult.success || !campaignResult.data?.campaignId) {
			return {
				success: false,
				error: `Failed to create 10DLC campaign: ${campaignResult.error}`,
				brandId,
				log,
			};
		}

		const campaignId = campaignResult.data.campaignId;
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
