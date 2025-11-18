import "server-only";
import { telnyxRequest } from "./api";

export type TenDlcBrandPayload = {
	entityType: "PRIVATE_PROFIT" | "PUBLIC_PROFIT" | "NON_PROFIT";
	displayName: string;
	companyName: string;
	firstName: string;
	lastName: string;
	ein: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	email: string;
	website?: string;
	vertical: string;
	isReseller?: boolean;
	mock?: boolean;
	mobilePhone?: string;
	businessContactEmail?: string;
	stockSymbol?: string;
	stockExchange?: string;
	ipAddress?: string;
	webhookURL?: string;
	webhookFailoverURL?: string;
};

export async function createTenDlcBrand(payload: TenDlcBrandPayload) {
	return telnyxRequest<{ id: string }>("/10dlc/brand", {
		method: "POST",
		body: payload,
	});
}

export async function getTenDlcBrand(brandId: string) {
	return telnyxRequest<{ id: string; status: string }>(
		`/10dlc/brand/${brandId}`,
	);
}

export type TenDlcCampaignPayload = {
	brandId: string;
	usecase: string;
	description: string;
	messageFlow: string;
	helpMessage: string;
	helpKeywords?: string;
	optinKeywords?: string;
	optinMessage?: string;
	optoutKeywords?: string;
	optoutMessage?: string;
	sample1: string;
	sample2?: string;
	sample3?: string;
	sample4?: string;
	sample5?: string;
	autoRenewal: boolean;
	subUsecases?: string[];
	termsAndConditions?: boolean;
	privacyPolicyLink?: string;
	termsAndConditionsLink?: string;
	affiliateMarketing?: boolean;
	ageGated?: boolean;
	directLending?: boolean;
	embeddedLink?: boolean;
	embeddedPhone?: boolean;
	numberPool?: boolean;
	subscriberHelp?: boolean;
	subscriberOptin?: boolean;
	subscriberOptout?: boolean;
	referenceId?: string;
	mnoIds?: number[];
	tag?: string[];
};

export async function createTenDlcCampaign(payload: TenDlcCampaignPayload) {
	return telnyxRequest<{ campaignId: string }>("/10dlc/campaignBuilder", {
		method: "POST",
		body: payload,
	});
}

export async function getTenDlcCampaign(campaignId: string) {
	return telnyxRequest<{ id: string; status: string; usecase: string }>(
		`/10dlc/campaign/${campaignId}`,
	);
}

export async function attachNumberToCampaign(
	campaignId: string,
	phoneNumber: string,
) {
	return telnyxRequest<{ id: string }>(
		`/10dlc/campaigns/${campaignId}/phone_numbers`,
		{
			method: "POST",
			body: {
				phone_numbers: [{ phone_number: phoneNumber }],
			},
		},
	);
}

/**
 * Toll-Free Verification Payload
 * Required fields as of January 1, 2026
 */
export type TollFreeVerificationPayload = {
	// Business Information
	businessName: string;
	corporateWebsite: string;
	businessAddr1: string;
	businessCity: string;
	businessState: string;
	businessZip: string;

	// Contact Information
	businessContactFirstName: string;
	businessContactLastName: string;
	businessContactEmail: string;
	businessContactPhone: string;

	// Phone Numbers to Verify
	phoneNumbers: Array<{ phoneNumber: string }>;

	// Use Case Information
	useCase: string; // e.g., "Account Notifications", "Customer Support", etc.
	useCaseSummary: string;
	productionMessageContent: string;
	messageVolume: string; // e.g., "10000", "100000"

	// Opt-in/Opt-out Workflow
	optInWorkflow: string;
	optInWorkflowImageURLs?: Array<{ url: string }>;

	// Business Registration (Required as of Jan 1, 2026)
	businessRegistrationNumber: string; // e.g., EIN number
	businessRegistrationType: string; // e.g., "EIN", "VAT", "ABN"
	businessRegistrationCountry: string; // ISO 3166-1 alpha-2 (e.g., "US")

	// Entity Type
	entityType: "PRIVATE_PROFIT" | "PUBLIC_PROFIT" | "NON_PROFIT";

	// Additional optional fields
	additionalInformation?: string;
};

/**
 * Submit toll-free verification request to Telnyx
 * This allows customers to send SMS from toll-free numbers
 * Approval typically takes 5 business days or less
 */
export async function submitTollFreeVerification(
	payload: TollFreeVerificationPayload,
) {
	return telnyxRequest<{
		id: string;
		status: string;
		createdAt: string;
	}>("/public/api/v2/requests", {
		method: "POST",
		body: payload,
	});
}

/**
 * Check the status of a toll-free verification request
 */
export async function getTollFreeVerificationStatus(requestId: string) {
	return telnyxRequest<{
		id: string;
		status: string;
		phoneNumbers: Array<{ phoneNumber: string; status: string }>;
	}>(`/public/api/v2/requests/${requestId}`);
}
