"use server";

import { sendVerificationSubmittedEmail } from "@/lib/email/verification-emails";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
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
			.select(
				`
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
			`,
			)
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
				error:
					"Company EIN is required for 10DLC registration. Please add the company's Tax ID.",
				log,
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
					"Company address is incomplete. Please add full address, city, state, and ZIP code.",
				log,
			};
		}

		const contactEmail = company.email || company.support_email;
		const contactPhone = company.phone || company.support_phone;

		if (!contactEmail || !contactPhone) {
			return {
				success: false,
				error:
					"Company contact email and phone are required for 10DLC registration.",
				log,
			};
		}

		// CRITICAL: Verify email domain before 10DLC registration
		log.push("Verifying company email domain...");

		const supabaseService = await createServiceSupabaseClient();
		if (!supabaseService) {
			return {
				success: false,
				error: "Database service client failed",
				log,
			};
		}

		const { data: verifiedDomain } = await supabaseService
			.from("company_email_domains")
			.select("*")
			.eq("company_id", companyId)
			.eq("status", "verified")
			.single();

		if (!verifiedDomain) {
			return {
				success: false,
				error:
					"Company email domain must be verified before 10DLC registration. TCR (The Campaign Registry) requires a verified business email domain with proper SPF/DKIM/DMARC records. Please complete email domain setup in the onboarding steps.",
				log,
			};
		}

		// Use domain email for TCR registration
		const fullDomain = verifiedDomain.subdomain
			? `${verifiedDomain.subdomain}.${verifiedDomain.domain_name}`
			: verifiedDomain.domain_name;

		const domainEmail = `admin@${fullDomain}`;
		log.push(`Email domain verified: ${fullDomain}`);

		// Normalize phone to E.164 format (Telnyx requirement)
		const normalizeToE164 = (phone: string): string => {
			// Remove all non-digit characters
			const digits = phone.replace(/\D/g, "");
			// Ensure it starts with country code (default to US +1)
			if (digits.length === 10) {
				return `+1${digits}`;
			}
			if (digits.length === 11 && digits.startsWith("1")) {
				return `+${digits}`;
			}
			// Already has country code
			return `+${digits}`;
		};

		const normalizedPhone = normalizeToE164(contactPhone);

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
			phone: normalizedPhone, // E.164 format required by Telnyx
			street: company.address || "",
			city: company.city || "",
			state: company.state || "",
			postalCode: company.zip_code || "",
			country: "US",
			email: contactEmail,
			website: company.website,
			vertical: determineVertical(company.industry),
			businessContactEmail: contactEmail,
			// ISV/Reseller identification - Stratos is the platform
			isReseller: true,
		};

		const brandResult = await createTenDlcBrand(brandPayload);

		if (!brandResult.success || !brandResult.data?.brandId) {
			return {
				success: false,
				error: `Failed to create 10DLC brand: ${brandResult.error}`,
				log,
			};
		}

		const brandId = brandResult.data.brandId;
		log.push(`Brand created: ${brandId}`);

		// 4. Poll brand status until approved (max 60 seconds)
		log.push("Waiting for brand approval...");
		const brandApprovalResult = await pollForApproval(
			() => getTenDlcBrand(brandId),
			60,
		);

		if (!brandApprovalResult.approved) {
			log.push(
				`Brand approval failed: ${brandApprovalResult.failureReason || "Unknown reason"}`,
			);

			// Check if failure was due to email validation (fail fast)
			if (brandApprovalResult.failureReason?.toLowerCase().includes("email")) {
				return {
					success: false,
					error:
						`Email validation failed: ${brandApprovalResult.failureReason}. ` +
						"TCR requires a verified business email domain (not personal/free providers). " +
						"Options: 1) Use toll-free numbers (bypasses TCR), " +
						"2) Set up Google Workspace/Microsoft 365, " +
						"3) See /TELNYX_10DLC_EMAIL_REQUIREMENTS.md",
					brandId,
					log,
				};
			}

			// Save brand ID even if not approved yet
			await supabase
				.from("company_telnyx_settings")
				.update({ ten_dlc_brand_id: brandId })
				.eq("company_id", companyId);

			return {
				success: false,
				error:
					brandApprovalResult.failureReason ||
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
		const campaignApprovalResult = await pollForApproval(
			() => getTenDlcCampaign(campaignId),
			60,
		);

		if (!campaignApprovalResult.approved) {
			log.push(
				`Campaign approval failed: ${campaignApprovalResult.failureReason || "Unknown reason"}`,
			);
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
					campaignApprovalResult.failureReason ||
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
	fetcher: () => Promise<{
		success: boolean;
		data?: {
			status: string;
			failureReasons?: Array<{ fields: string[]; description: string }>;
		};
	}>,
	maxSeconds: number,
): Promise<{ approved: boolean; failureReason?: string }> {
	const startTime = Date.now();
	const pollInterval = 5000; // 5 seconds

	while (Date.now() - startTime < maxSeconds * 1000) {
		const result = await fetcher();

		if (!result.success || !result.data) {
			return { approved: false, failureReason: "Failed to fetch status" };
		}

		const status = result.data.status.toLowerCase();

		if (status === "approved" || status === "active") {
			return { approved: true };
		}

		if (
			status === "rejected" ||
			status === "failed" ||
			status === "registration_failed"
		) {
			// Extract failure reason from response
			const failureReason =
				result.data.failureReasons?.[0]?.description ||
				`Registration ${status}`;
			return { approved: false, failureReason };
		}

		// Wait before polling again
		await new Promise((resolve) => setTimeout(resolve, pollInterval));
	}

	return { approved: false, failureReason: "Timeout waiting for approval" };
}

/**
 * Map business type to 10DLC vertical
 */
function determineVertical(businessType?: string | null): string {
	if (!businessType) return "PROFESSIONAL";

	const type = businessType.toLowerCase();

	// Map to Telnyx's exact vertical values
	// Valid values from error: AGRICULTURE, COMMUNICATION, CONSTRUCTION, EDUCATION,
	// ENERGY, ENTERTAINMENT, FINANCIAL, GAMBLING, GOVERNMENT, HEALTHCARE, HOSPITALITY,
	// HUMAN_RESOURCES, INSURANCE, LEGAL, MANUFACTURING, NGO, POLITICAL, POSTAL,
	// PROFESSIONAL, REAL_ESTATE, RETAIL, TECHNOLOGY, TRANSPORTATION

	if (type.includes("healthcare") || type.includes("medical"))
		return "HEALTHCARE";
	if (type.includes("finance") || type.includes("banking")) return "FINANCIAL";
	if (type.includes("insurance")) return "INSURANCE";
	if (type.includes("real estate")) return "REAL_ESTATE";
	if (type.includes("retail") || type.includes("ecommerce")) return "RETAIL";
	if (
		type.includes("hospitality") ||
		type.includes("restaurant") ||
		type.includes("food") ||
		type.includes("hotel")
	)
		return "HOSPITALITY";
	if (type.includes("education")) return "EDUCATION";
	if (type.includes("technology") || type.includes("software"))
		return "TECHNOLOGY";
	if (
		type.includes("nonprofit") ||
		type.includes("charity") ||
		type.includes("ngo")
	)
		return "NGO";
	if (
		type.includes("construction") ||
		type.includes("plumbing") ||
		type.includes("hvac") ||
		type.includes("electrical") ||
		type.includes("contractor")
	)
		return "CONSTRUCTION";
	if (type.includes("legal") || type.includes("law")) return "LEGAL";
	if (type.includes("manufacturing")) return "MANUFACTURING";
	if (type.includes("transportation") || type.includes("logistics"))
		return "TRANSPORTATION";
	if (type.includes("energy") || type.includes("utilities")) return "ENERGY";
	if (type.includes("agriculture") || type.includes("farming"))
		return "AGRICULTURE";
	if (type.includes("entertainment") || type.includes("media"))
		return "ENTERTAINMENT";

	// Default for service businesses
	return "PROFESSIONAL";
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
	log?: string[];
	requiresPlatformSetup?: boolean;
}> {
	const supabase = await createClient();
	const log: string[] = [];

	const normalizePhone = (value: string | null) => {
		if (!value) return null;
		const digits = value.replace(/\D/g, "");
		if (!digits) return null;
		if (digits.length === 10) {
			return `+1${digits}`;
		}
		if (digits.length === 11 && digits.startsWith("1")) {
			return `+${digits}`;
		}
		return value.startsWith("+") ? value : `+${digits}`;
	};

	if (!supabase) {
		return {
			success: false,
			error: "Failed to create Supabase client",
			log,
		};
	}

	try {
		// 1. Fetch company data
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select(
				`
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
			`,
			)
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			log.push("Company lookup failed");
			return {
				success: false,
				error: `Company not found: ${companyError?.message}`,
				log,
			};
		}
		log.push(`Company loaded: ${company.name} (${company.id})`);

		// Validate required fields
		if (!company.ein) {
			log.push("Missing EIN");
			return {
				success: false,
				error:
					"Company EIN is required for messaging verification. Please add your Tax ID in Step 1.",
				log,
			};
		}

		if (
			!company.address ||
			!company.city ||
			!company.state ||
			!company.zip_code
		) {
			log.push("Incomplete address");
			return {
				success: false,
				error:
					"Company address is incomplete. Please complete all address fields in Step 1.",
				log,
			};
		}

		const companyPhone = normalizePhone(company.phone || company.support_phone);
		if (!companyPhone) {
			log.push("Missing company phone");
			return {
				success: false,
				error: "Company phone number is required for verification.",
				log,
			};
		}

		// 2. Get company phone numbers
		const { data: phoneNumbers, error: phoneError } = await supabase
			.from("phone_numbers")
			.select("phone_number, number_type")
			.eq("company_id", companyId)
			.eq("status", "active");

		if (phoneError || !phoneNumbers || phoneNumbers.length === 0) {
			log.push("No phone numbers found for company");
			return {
				success: false,
				error:
					"No phone numbers found. Please add a phone number before enabling messaging.",
				log,
			};
		}

		// Separate toll-free and 10DLC numbers
		const tollFreeNumbers = phoneNumbers.filter(
			(p) => p.number_type === "toll-free",
		);
		const dlcNumbers = phoneNumbers.filter((p) => p.number_type === "local");
		log.push(
			`Detected toll-free numbers: ${tollFreeNumbers.length}, 10DLC numbers: ${dlcNumbers.length}`,
		);

		// If no toll-free numbers, recommend using toll-free for immediate setup
		if (tollFreeNumbers.length === 0 && dlcNumbers.length > 0) {
			console.log(
				"Note: Only local numbers found. Toll-free verification works immediately without Level 2. Consider adding toll-free numbers for faster setup.",
			);
		}

		const contactPhone = companyPhone;
		const contactEmail = company.email || company.support_email || null;
		if (!contactEmail) {
			return {
				success: false,
				error: "A primary email is required for toll-free verification.",
				log,
			};
		}

		// 3. Submit toll-free verification if we have toll-free numbers
		let tollFreeRequestId: string | undefined;
		if (tollFreeNumbers.length > 0) {
			log.push("Preparing toll-free verification payload");
			const normalizedWebsite =
				company.website ||
				`https://${company.name.toLowerCase().replace(/\s+/g, "")}.com`;
			const optInImageUrl = `${normalizedWebsite.replace(/\/$/, "")}/opt-in`;
			const additionalInfo = `${company.name} sends timely service notifications, scheduling updates, and customer support follow-ups for ${company.industry || "field service"} operations.`;
			const sanitizedEin = company.ein.replace(/[^\d]/g, "");

			const tollFreePayload: TollFreeVerificationPayload = {
				businessName: company.name,
				corporateWebsite: normalizedWebsite,
				businessAddr1: company.address,
				businessCity: company.city,
				businessState: company.state,
				businessZip: company.zip_code,
				businessContactFirstName: "Admin", // TODO: Get from user profile
				businessContactLastName: "User",
				businessContactEmail: contactEmail,
				businessContactPhone: contactPhone,
				phoneNumbers: tollFreeNumbers.map((p) => ({
					phoneNumber: p.phone_number,
				})),
				useCase: "Customer Support",
				useCaseSummary: `${company.industry} business communications including appointment reminders, service notifications, and customer support`,
				productionMessageContent: `Hi! This is ${company.name}. Your appointment is scheduled for tomorrow at 10 AM. Reply STOP to opt out.`,
				messageVolume: "10000",
				optInWorkflow:
					"Customers opt-in during service booking and account creation",
				optInWorkflowImageURLs: [
					{
						url:
							optInImageUrl ||
							"https://dummyimage.com/600x400/cccccc/000000&text=Opt-In",
						description: "Opt-in form screenshot",
					},
				],
				optInKeywords: "YES,START",
				optOutKeywords: "STOP,UNSUBSCRIBE",
				optOutMessage: `You have opted out of ${company.name} messages. Reply START to opt in again.`,
				helpKeywords: "HELP,INFO",
				businessRegistrationNumber: sanitizedEin,
				businessRegistrationType: "EIN",
				businessRegistrationCountry: "US",
				entityType: "PRIVATE_PROFIT",
				additionalInformation: additionalInfo,
				helpMessageResponse: `For help, reply HELP or call ${companyPhone}.`,
				optInConfirmationResponse: `Thanks for subscribing to ${company.name} updates.`,
			};

			log.push("Submitting toll-free verification to Telnyx");
			const tollFreeResult = await submitTollFreeVerification(tollFreePayload);

			if (!tollFreeResult.success || !tollFreeResult.data) {
				log.push(
					`Toll-free verification failed: ${tollFreeResult.error || "unknown"}`,
				);
				return {
					success: false,
					error: `Toll-free verification failed: ${tollFreeResult.error}`,
					log,
				};
			}

			tollFreeRequestId = tollFreeResult.data.id;
			log.push(`Toll-free verification request created: ${tollFreeRequestId}`);

			// Save toll-free request ID to database
			await supabase.from("company_telnyx_settings").upsert({
				company_id: companyId,
				toll_free_verification_request_id: tollFreeRequestId,
				toll_free_verification_status: "pending",
				toll_free_verification_submitted_at: new Date().toISOString(),
			});
		}

		// 4. Submit 10DLC registration if we have regular numbers (OPTIONAL - won't block toll-free)
		let brandId: string | undefined;
		let campaignId: string | undefined;
		let dlcError: string | undefined;

		if (dlcNumbers.length > 0) {
			log.push("Attempting 10DLC registration");
			const registrationResult = await registerCompanyFor10DLC(companyId);

			if (!registrationResult.success) {
				// Check if this is a 403 error (account verification required)
				const is403Error =
					registrationResult.error?.includes("403") ||
					registrationResult.error?.includes("verifications required");

				if (is403Error) {
					// Platform account needs Level 2 verification
					// Don't fail - just log the error and continue with toll-free
					dlcError =
						"10DLC requires Level 2 verification (see /TELNYX_PLATFORM_SETUP.md). Toll-free verification will proceed.";
					console.warn(dlcError);
					log.push(dlcError);

					// If we have toll-free numbers, continue (toll-free works without Level 2)
					// If we ONLY have local numbers and no toll-free, then fail
					if (tollFreeNumbers.length === 0) {
						return {
							success: false,
							error:
								"Platform setup required: Your Telnyx account needs Level 2 verification to enable 10DLC registration for local numbers. Alternative: Add toll-free numbers which work immediately without Level 2 verification. See /TELNYX_PLATFORM_SETUP.md for details.",
							requiresPlatformSetup: true,
							log,
						};
					}
				} else {
					// Other error - log but don't fail if we have toll-free
					dlcError = `10DLC registration failed: ${registrationResult.error}`;
					console.error(dlcError);
					log.push(dlcError);

					if (tollFreeNumbers.length === 0) {
						// No toll-free backup - fail
						return {
							success: false,
							error: dlcError,
							log,
						};
					}
				}
			} else {
				brandId = registrationResult.brandId;
				campaignId = registrationResult.campaignId;
				log.push(
					`10DLC registration completed: brand=${brandId}, campaign=${campaignId}`,
				);
			}
		}

		// 5. Send verification submitted email
		// Note: Don't block the response if email fails - verification was successful
		if (company.email) {
			try {
				await sendVerificationSubmittedEmail(companyId, company.email, {
					hasTollFreeNumbers: tollFreeNumbers.length > 0,
					has10DLCNumbers: dlcNumbers.length > 0,
					tollFreeCount: tollFreeNumbers.length,
					dlcCount: dlcNumbers.length,
				});
				log.push("Verification submitted email sent");
			} catch (emailError) {
				// Log but don't fail - email is non-critical
				console.error("Failed to send verification email:", emailError);
				log.push(
					`Failed to send verification email: ${emailError instanceof Error ? emailError.message : emailError}`,
				);
			}
		}

		// Build success message
		const messages: string[] = [];
		if (tollFreeRequestId) {
			messages.push(
				`✅ Toll-free verification submitted (${tollFreeNumbers.length} number${tollFreeNumbers.length > 1 ? "s" : ""}) - Approval in 5-7 business days`,
			);
		}
		if (brandId && campaignId) {
			messages.push(
				`✅ 10DLC registration completed (${dlcNumbers.length} number${dlcNumbers.length > 1 ? "s" : ""}) - Active immediately`,
			);
		}
		if (dlcError) {
			messages.push(`⚠️ ${dlcError}`);
		}
		log.push(...messages);

		return {
			success: true,
			tollFreeRequestId,
			brandId,
			campaignId,
			message: messages.join(". "),
			log,
		};
	} catch (error) {
		log.push(
			`Unhandled verification error: ${error instanceof Error ? error.message : error}`,
		);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to submit verification",
			log,
		};
	}
}
