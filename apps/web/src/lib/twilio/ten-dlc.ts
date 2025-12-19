/**
 * Twilio A2P 10DLC Registration API
 *
 * Functions for registering brands and campaigns for 10DLC compliance.
 * See: https://www.twilio.com/docs/messaging/compliance/a2p-10dlc
 */

import twilio from "twilio";

// Initialize Twilio client
function getTwilioClient() {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;

	if (!accountSid || !authToken) {
		return null;
	}

	return twilio(accountSid, authToken);
}

export type BrandRegistrationData = {
	companyName: string;
	ein?: string;
	country: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	brandType?: "STANDARD" | "SOLE_PROPRIETOR" | "LOW_VOLUME_STANDARD";
	vertical?: string;
	stockSymbol?: string;
	stockExchange?: string;
	website?: string;
};

export type CampaignData = {
	brandId: string;
	description: string;
	messageFlow: string;
	helpMessage: string;
	optOutMessage: string;
	optInMessage?: string;
	useCase: "MARKETING" | "DELIVERY_NOTIFICATIONS" | "CUSTOMER_CARE" | "ACCOUNT_NOTIFICATIONS" | "SECURITY" | "MIXED";
	sampleMessages: string[];
	termsAndConditions?: boolean;
	embeddedLink?: boolean;
	embeddedPhone?: boolean;
	affiliateMarketing?: boolean;
	ageGated?: boolean;
};

export type BrandResult = {
	success: boolean;
	data?: {
		id: string;
		status: string;
		brandScore?: number;
		brandSid?: string;
	};
	error?: string;
};

export type CampaignResult = {
	success: boolean;
	data?: {
		id: string;
		status: string;
		campaignSid?: string;
	};
	error?: string;
};

/**
 * Register a brand for 10DLC
 */
export async function registerTenDlcBrand(
	companyId: string,
	data: BrandRegistrationData
): Promise<BrandResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.",
		};
	}

	try {
		// First, we need a Customer Profile (Trust Product) for the brand
		// This should already exist from business verification
		const trustProducts = await client.trusthub.v1.trustProducts.list({ limit: 20 });
		let customerProfileSid = trustProducts.find(
			(p) => p.friendlyName?.includes(companyId) && p.status === "twilio-approved"
		)?.sid;

		// If no approved profile exists, create a new one
		if (!customerProfileSid) {
			// Create end user for brand
			const endUser = await client.trusthub.v1.endUsers.create({
				friendlyName: `10DLC Brand - ${data.companyName} - ${companyId}`,
				type: "customer_profile_business_information",
				attributes: {
					business_name: data.companyName,
					business_type: data.brandType === "SOLE_PROPRIETOR" ? "sole_proprietorship" : "corporation",
					business_registration_number: data.ein,
					business_registration_identifier: "EIN",
				},
			});

			// Create trust product
			const trustProduct = await client.trusthub.v1.trustProducts.create({
				friendlyName: `10DLC Profile - ${companyId}`,
				policySid: "RN806dd6cd175f314e1f96a9727ee271f4",
				email: data.email,
			});

			// Assign end user
			await client.trusthub.v1
				.trustProducts(trustProduct.sid)
				.trustProductsEntityAssignments.create({
					objectSid: endUser.sid,
				});

			customerProfileSid = trustProduct.sid;
		}

		// Register the brand with the Messaging API
		const brand = await client.messaging.v1.brandRegistrations.create({
			customerProfileBundleSid: customerProfileSid,
			a2PProfileBundleSid: customerProfileSid,
			brandType: data.brandType || "STANDARD",
		});

		return {
			success: true,
			data: {
				id: brand.sid,
				status: brand.status,
				brandSid: brand.sid,
				brandScore: brand.brandScore ? Number(brand.brandScore) : undefined,
			},
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error registering brand:", error);
		return {
			success: false,
			error: error.message || "Failed to register 10DLC brand",
		};
	}
}

/**
 * Get brand status
 */
export async function getTenDlcBrand(brandSid: string): Promise<BrandResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		const brand = await client.messaging.v1.brandRegistrations(brandSid).fetch();

		return {
			success: true,
			data: {
				id: brand.sid,
				status: brand.status,
				brandScore: brand.brandScore ? Number(brand.brandScore) : undefined,
				brandSid: brand.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error getting brand:", error);
		return {
			success: false,
			error: error.message || "Failed to get brand status",
		};
	}
}

/**
 * List all brands for account
 */
export async function listTenDlcBrands(): Promise<{
	success: boolean;
	data?: Array<{ id: string; status: string; brandScore?: number }>;
	error?: string;
}> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		const brands = await client.messaging.v1.brandRegistrations.list({ limit: 50 });

		return {
			success: true,
			data: brands.map((b) => ({
				id: b.sid,
				status: b.status,
				brandScore: b.brandScore ? Number(b.brandScore) : undefined,
			})),
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error listing brands:", error);
		return {
			success: false,
			error: error.message || "Failed to list brands",
		};
	}
}

/**
 * Register a campaign
 */
export async function registerTenDlcCampaign(
	companyId: string,
	data: CampaignData
): Promise<CampaignResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		// First, create or get the messaging service
		let messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

		if (!messagingServiceSid) {
			// Create a new messaging service
			const service = await client.messaging.v1.services.create({
				friendlyName: `Messaging Service - ${companyId}`,
				inboundRequestUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/twilio/sms`,
				statusCallback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/twilio/status`,
			});
			messagingServiceSid = service.sid;
		}

		// Create the campaign using US App-to-Person API
		const campaign = await client.messaging.v1.services(messagingServiceSid)
			.usAppToPerson.create({
				brandRegistrationSid: data.brandId,
				description: data.description,
				messageFlow: data.messageFlow,
				messageSamples: data.sampleMessages,
				usAppToPersonUsecase: data.useCase,
				hasEmbeddedLinks: data.embeddedLink || false,
				hasEmbeddedPhone: data.embeddedPhone || false,
				optInMessage: data.optInMessage || "Reply YES to confirm. Msg & data rates may apply.",
				optOutMessage: data.optOutMessage,
				helpMessage: data.helpMessage,
			});

		return {
			success: true,
			data: {
				id: campaign.sid,
				status: campaign.campaignStatus,
				campaignSid: campaign.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error registering campaign:", error);
		return {
			success: false,
			error: error.message || "Failed to register 10DLC campaign",
		};
	}
}

/**
 * Get campaign status
 */
export async function getTenDlcCampaign(campaignSid: string): Promise<CampaignResult> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
		if (!messagingServiceSid) {
			return {
				success: false,
				error: "TWILIO_MESSAGING_SERVICE_SID not configured",
			};
		}

		const campaign = await client.messaging.v1
			.services(messagingServiceSid)
			.usAppToPerson(campaignSid)
			.fetch();

		return {
			success: true,
			data: {
				id: campaign.sid,
				status: campaign.campaignStatus,
				campaignSid: campaign.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error getting campaign:", error);
		return {
			success: false,
			error: error.message || "Failed to get campaign status",
		};
	}
}

/**
 * Attach a phone number to a messaging service (for 10DLC campaign)
 */
export async function attachNumberToCampaign(
	phoneNumberSid: string,
	messagingServiceSid?: string
): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		const serviceSid = messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
		if (!serviceSid) {
			return {
				success: false,
				error: "Messaging service SID not provided or configured",
			};
		}

		// Attach phone number to messaging service
		const phoneNumber = await client.messaging.v1
			.services(serviceSid)
			.phoneNumbers.create({
				phoneNumberSid: phoneNumberSid,
			});

		return {
			success: true,
			data: {
				id: phoneNumber.sid,
			},
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error attaching number:", error);
		return {
			success: false,
			error: error.message || "Failed to attach number to campaign",
		};
	}
}

/**
 * Get messaging service/profile status
 */
export async function getMessagingProfile(
	profileId?: string
): Promise<{ success: boolean; data?: { id: string; status: string; friendlyName?: string }; error?: string }> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		const serviceSid = profileId || process.env.TWILIO_MESSAGING_SERVICE_SID;
		if (!serviceSid) {
			return {
				success: false,
				error: "Messaging service SID not provided or configured",
			};
		}

		const service = await client.messaging.v1.services(serviceSid).fetch();

		return {
			success: true,
			data: {
				id: service.sid,
				status: "active", // Services don't have status, they're either active or deleted
				friendlyName: service.friendlyName,
			},
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error getting messaging profile:", error);
		return {
			success: false,
			error: error.message || "Failed to get messaging profile",
		};
	}
}

/**
 * List all campaigns for the account
 */
export async function listTenDlcCampaigns(): Promise<{
	success: boolean;
	data?: Array<{ id: string; status: string; useCase?: string }>;
	error?: string;
}> {
	const client = getTwilioClient();

	if (!client) {
		return {
			success: false,
			error: "Twilio client not configured",
		};
	}

	try {
		const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
		if (!messagingServiceSid) {
			return {
				success: false,
				error: "TWILIO_MESSAGING_SERVICE_SID not configured",
			};
		}

		const campaigns = await client.messaging.v1
			.services(messagingServiceSid)
			.usAppToPerson.list({ limit: 50 });

		return {
			success: true,
			data: campaigns.map((c) => ({
				id: c.sid,
				status: c.campaignStatus,
				useCase: c.usAppToPersonUsecase,
			})),
		};
	} catch (error: any) {
		console.error("[Twilio 10DLC] Error listing campaigns:", error);
		return {
			success: false,
			error: error.message || "Failed to list campaigns",
		};
	}
}
