import "server-only";

const TELNYX_BASE_URL = "https://api.telnyx.com/v2";

type TelnyxRequestOptions = {
	method?: "GET" | "POST";
	body?: Record<string, unknown>;
};

async function telnyxRequest<TResponse>(
	path: string,
	{ method = "GET", body }: TelnyxRequestOptions = {},
): Promise<{ success: boolean; data?: TResponse; error?: string }> {
	const apiKey = process.env.TELNYX_API_KEY;
	if (!apiKey) {
		return { success: false, error: "TELNYX_API_KEY is not configured" };
	}

	const response = await fetch(`${TELNYX_BASE_URL}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	const payload = (await response.json().catch(() => {})) as
		| { data?: TResponse; errors?: Array<{ detail?: string }> }
		| undefined;

	if (!response.ok) {
		const message =
			payload?.errors?.[0]?.detail ||
			payload?.errors?.[0] ||
			response.statusText;
		return {
			success: false,
			error: `Telnyx ${response.status}: ${message}`,
		};
	}

	return { success: true, data: payload?.data };
}

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
