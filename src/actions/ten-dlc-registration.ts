"use server";

import { createClient } from "@/lib/supabase/server";
import {
	checkAccountVerificationStatus,
	getNextSteps,
	getVerificationRequirements,
	type VerificationStatus,
} from "@/lib/telnyx/account-verification";
import {
	attachNumberToCampaign,
	createTenDlcBrand,
	createTenDlcCampaign,
	getTenDlcBrand,
	getTenDlcCampaign,
	submitTollFreeVerification,
	getTollFreeVerificationStatus,
	type TenDlcBrandPayload,
	type TenDlcCampaignPayload,
	type TollFreeVerificationPayload,
} from "@/lib/telnyx/ten-dlc";
import { sendVerificationSubmittedEmail } from "@/lib/email/verification-emails";

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

/**
 * Check Telnyx account verification status
 *
 * Returns the current verification level and what's required to proceed
 */
export async function checkTelnyxVerificationStatus(): Promise<{
	success: boolean;
	data?: VerificationStatus & {
		nextSteps: Array<{ step: string; action: string; url?: string }>;
		requirements: {
			level1: { required: boolean; items: string[] };
			level2: { required: boolean; items: string[] };
		};
	};
	error?: string;
}> {
	try {
		const statusResult = await checkAccountVerificationStatus();

		if (!statusResult.success) {
			return {
				success: false,
				error: statusResult.error || "Failed to check verification status",
			};
		}

		const status = statusResult.data!;
		const nextSteps = getNextSteps(status);
		const requirements = getVerificationRequirements(status.currentLevel);

		return {
			success: true,
			data: {
				...status,
				nextSteps,
				requirements,
			},
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to check verification status",
		};
	}
}

/**
 * Automatically submit toll-free and 10DLC verification during onboarding
 *
 * This function is called when a company completes Step 4 of onboarding.
 * It automatically submits verification to Telnyx using the company data
 * collected during Step 1 (Company Information).
 *
 * ServiceTitan-style flow: Users never leave the platform or visit Telnyx Portal
 */
export async function submitAutomatedVerification(companyId: string): Promise<{
	success: boolean;
	tollFreeRequestId?: string;
	brandId?: string;
	campaignId?: string;
	error?: string;
	message?: string;
}> {
	const supabase = await createClient();

	if (!supabase) {
		return {
			success: false,
			error: "Failed to create Supabase client",
		};
	}

	try {
		// 1. Fetch company data
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
			};
		}

		// Validate required fields
		if (!company.ein) {
			return {
				success: false,
				error:
					"Company EIN is required for messaging verification. Please add your Tax ID in Step 1.",
			};
		}

		if (
			!company.address ||
			!company.city ||
			!company.state ||
			!company.zip_code
		) {
			return {
				success: false,
				error:
					"Company address is incomplete. Please complete all address fields in Step 1.",
			};
		}

		if (!company.phone) {
			return {
				success: false,
				error: "Company phone number is required for verification.",
			};
		}

		// 2. Get company phone numbers
		const { data: phoneNumbers, error: phoneError } = await supabase
			.from("phone_numbers")
			.select("phone_number, is_toll_free")
			.eq("company_id", companyId)
			.neq("status", "deleted");

		if (phoneError || !phoneNumbers || phoneNumbers.length === 0) {
			return {
				success: false,
				error:
					"No phone numbers found. Please add a phone number before enabling messaging.",
			};
		}

		// Separate toll-free and 10DLC numbers
		const tollFreeNumbers = phoneNumbers.filter((p) => p.is_toll_free);
		const dlcNumbers = phoneNumbers.filter((p) => !p.is_toll_free);

		// 3. Submit toll-free verification if we have toll-free numbers
		let tollFreeRequestId: string | undefined;
		if (tollFreeNumbers.length > 0) {
			const tollFreePayload: TollFreeVerificationPayload = {
				businessName: company.name,
				corporateWebsite: company.website || `https://${company.name.toLowerCase().replace(/\s/g, "")}.com`,
				businessAddr1: company.address,
				businessCity: company.city,
				businessState: company.state,
				businessZip: company.zip_code,
				businessContactFirstName: "Admin", // TODO: Get from user profile
				businessContactLastName: "User",
				businessContactEmail: company.email || company.support_email || "",
				businessContactPhone: company.phone,
				phoneNumbers: tollFreeNumbers.map((p) => ({
					phoneNumber: p.phone_number,
				})),
				useCase: "Customer Support",
				useCaseSummary: `${company.industry} business communications including appointment reminders, service notifications, and customer support`,
				productionMessageContent: `Hi! This is ${company.name}. Your appointment is scheduled for tomorrow at 10 AM. Reply STOP to opt out.`,
				messageVolume: "10000",
				optInWorkflow:
					"Customers opt-in during service booking and account creation",
				businessRegistrationNumber: company.ein,
				businessRegistrationType: "EIN",
				businessRegistrationCountry: "US",
				entityType: "PRIVATE_PROFIT",
			};

			const tollFreeResult = await submitTollFreeVerification(tollFreePayload);

			if (!tollFreeResult.success || !tollFreeResult.data) {
				return {
					success: false,
					error: `Toll-free verification failed: ${tollFreeResult.error}`,
				};
			}

			tollFreeRequestId = tollFreeResult.data.id;

			// Save toll-free request ID to database
			await supabase
				.from("company_telnyx_settings")
				.upsert({
					company_id: companyId,
					toll_free_verification_request_id: tollFreeRequestId,
					toll_free_verification_status: "pending",
					toll_free_verification_submitted_at: new Date().toISOString(),
				});
		}

		// 4. Submit 10DLC registration if we have regular numbers
		let brandId: string | undefined;
		let campaignId: string | undefined;
		if (dlcNumbers.length > 0) {
			const registrationResult =
				await registerCompanyFor10DLC(companyId);

			if (!registrationResult.success) {
				return {
					success: false,
					error: `10DLC registration failed: ${registrationResult.error}`,
					tollFreeRequestId,
				};
			}

			brandId = registrationResult.brandId;
			campaignId = registrationResult.campaignId;
		}

		// 5. Send verification submitted email
		// Note: Don't block the response if email fails - verification was successful
		if (company.email) {
			try {
				await sendVerificationSubmittedEmail(
					companyId,
					company.email,
					{
						hasTollFreeNumbers: tollFreeNumbers.length > 0,
						has10DLCNumbers: dlcNumbers.length > 0,
						tollFreeCount: tollFreeNumbers.length,
						dlcCount: dlcNumbers.length,
					}
				);
			} catch (emailError) {
				// Log but don't fail - email is non-critical
				console.error("Failed to send verification email:", emailError);
			}
		}

		return {
			success: true,
			tollFreeRequestId,
			brandId,
			campaignId,
			message: `Verification submitted successfully! ${tollFreeNumbers.length > 0 ? "Toll-free verification typically takes 5 business days." : ""} ${dlcNumbers.length > 0 ? "10DLC registration completed." : ""}`,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to submit verification",
		};
	}
}
