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
	return telnyxRequest<{ brandId: string; status: string }>("/10dlc/brand", {
		method: "POST",
		body: payload,
	});
}

export async function getTenDlcBrand(brandId: string) {
	return telnyxRequest<{ brandId: string; status: string }>(
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
