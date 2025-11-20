import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { telnyxClient } from "./client";
import {
	type NumberFeature,
	type NumberType,
	purchaseNumber,
	searchAvailableNumbers,
} from "./numbers";

export type CompanyTelnyxSettingsRow = {
	company_id: string;
	status: string;
	messaging_profile_id: string | null;
	call_control_application_id: string | null;
	default_outbound_number: string | null;
	default_outbound_phone_number_id: string | null;
	ten_dlc_brand_id: string | null;
	ten_dlc_campaign_id: string | null;
	webhook_secret: string | null;
	metadata: Record<string, unknown> | null;
	last_provisioned_at: string | null;
	created_at: string | null;
	updated_at: string | null;
};

type TypedSupabaseClient = SupabaseClient<Database>;

type ProvisionOptions = {
	companyId: string;
	supabase: TypedSupabaseClient;
	areaCode?: string;
	numberQuantity?: number;
	features?: NumberFeature[];
};

const DEFAULT_FEATURES: NumberFeature[] = ["sms", "mms", "voice"];
const COMPANY_SETTINGS_TABLE = "company_telnyx_settings";

async function getBaseAppUrl(): Promise<string | undefined> {
	const candidates = [
		process.env.NEXT_PUBLIC_SITE_URL,
		process.env.SITE_URL,
		process.env.NEXT_PUBLIC_APP_URL,
		process.env.APP_URL,
	];

	for (const candidate of candidates) {
		if (!candidate) continue;
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		const isLocal = /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(trimmed);
		if (isLocal) {
			continue;
		}
		if (trimmed.startsWith("http")) {
			return trimmed.replace(/\/+$/, "");
		}
		return `https://${trimmed.replace(/\/+$/, "")}`;
	}

	return undefined;
}

async function buildCompanyWebhookUrl(
	companyId: string,
): Promise<string | undefined> {
	const base = await getBaseAppUrl();
	if (!base) {
		return undefined;
	}
	return `${base}/api/webhooks/telnyx?company=${companyId}`;
}

function formatDisplay(phoneNumber: string): string {
	const digits = phoneNumber.replace(/[^0-9]/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return phoneNumber;
}

type ProvisionResult = {
	success: boolean;
	settings?: CompanyTelnyxSettingsRow;
	error?: string;
	log: string[];
};

async function ensurePhoneNumbersInserted(
	supabase: TypedSupabaseClient,
	companyId: string,
	phoneNumbers: Array<{
		phoneNumber: string;
		areaCode?: string;
		countryCode?: string;
		telnyxPhoneNumberId?: string;
		numberType?: NumberType;
	}>,
	defaults: {
		messagingProfileId: string | null;
		connectionId: string | null;
	},
): Promise<void> {
	if (phoneNumbers.length === 0) {
		return;
	}

	for (const number of phoneNumbers) {
		const digits = number.phoneNumber.replace(/[^0-9]/g, "");
		const e164 = digits.startsWith("+")
			? digits
			: digits.startsWith("1") && digits.length === 11
				? `+${digits}`
				: `+1${digits}`;

		const row = {
			company_id: companyId,
			phone_number: e164,
			formatted_number: formatDisplay(e164),
			area_code: number.areaCode || e164.slice(2, 5),
			country_code: number.countryCode || "US",
			number_type: number.numberType || "local",
			status: "active",
			features: DEFAULT_FEATURES,
			telnyx_phone_number_id: number.telnyxPhoneNumberId || null,
			telnyx_messaging_profile_id: defaults.messagingProfileId,
			telnyx_connection_id: defaults.connectionId,
		};

		const { data: existing } = await supabase
			.from("phone_numbers")
			.select("id")
			.eq("company_id", companyId)
			.eq("phone_number", e164)
			.maybeSingle();

		if (existing?.id) {
			await supabase.from("phone_numbers").update(row).eq("id", existing.id);
		} else {
			await supabase.from("phone_numbers").insert(row);
		}
	}
}

async function createMessagingProfile(companyName: string, webhookUrl: string) {
	const response = await telnyxClient.messagingProfiles.create({
		name: `${companyName} - Thorbis`,
		enabled: true,
		webhook_url: webhookUrl,
		webhook_api_version: "2",
	});
	return response.data as any;
}

async function createCallControlApplication(
	companyName: string,
	webhookUrl: string,
) {
	const response = await telnyxClient.callControlApplications.create({
		application_name: `${companyName} - Thorbis`,
		webhook_event_url: webhookUrl,
		webhook_api_version: "2",
		answering_machine_detection: "premium",
	});
	return response.data as any;
}

async function purchaseNumbers(
	companyId: string,
	options: {
		quantity: number;
		areaCode?: string;
		features?: NumberFeature[];
		messagingProfileId: string;
		connectionId: string;
	},
): Promise<
	Array<{
		phoneNumber: string;
		telnyxPhoneNumberId?: string;
		areaCode?: string;
		numberType?: NumberType;
	}>
> {
	const search = await searchAvailableNumbers({
		areaCode: options.areaCode,
		features: options.features || DEFAULT_FEATURES,
		limit: Math.max(options.quantity * 2, options.quantity),
	});

	if (!search.success || !search.data || search.data.length === 0) {
		throw new Error("No available phone numbers found for requested criteria");
	}

	const purchased: Array<{
		phoneNumber: string;
		telnyxPhoneNumberId?: string;
		areaCode?: string;
		numberType?: NumberType;
	}> = [];
	const candidates = search.data as any[];

	for (const candidate of candidates) {
		if (purchased.length >= options.quantity) {
			break;
		}

		const number = candidate.phone_number as string;
		const purchaseResult = await purchaseNumber({
			phoneNumber: number,
			messagingProfileId: options.messagingProfileId,
			connectionId: options.connectionId,
			customerReference: `company:${companyId}`,
		});

		if (!purchaseResult.success) {
			throw new Error(
				purchaseResult.error ||
					`Failed to purchase number ${number} from Telnyx`,
			);
		}

		purchased.push({
			phoneNumber: number,
			areaCode: candidate.national_destination_code || candidate.area_code,
			telnyxPhoneNumberId: candidate.id || candidate.phone_number,
			numberType: candidate.number_type,
		});
	}

	if (purchased.length === 0) {
		throw new Error("Failed to purchase any phone numbers");
	}

	// Enable messaging on all purchased numbers
	for (const number of purchased) {
		if (number.telnyxPhoneNumberId) {
			try {
				const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
				if (!TELNYX_API_KEY) {
					throw new Error("TELNYX_API_KEY not configured");
				}

				await fetch(
					`https://api.telnyx.com/v2/phone_numbers/${number.telnyxPhoneNumberId}/messaging`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${TELNYX_API_KEY}`,
						},
						body: JSON.stringify({
							messaging_profile_id: options.messagingProfileId,
						}),
					},
				);
			} catch (error) {
				// Log but don't fail - messaging can be enabled later
				console.warn(
					`Failed to enable messaging on ${number.phoneNumber}:`,
					error,
				);
			}
		}
	}

	return purchased;
}

export async function fetchCompanyTelnyxSettings(
	supabase: TypedSupabaseClient,
	companyId: string,
): Promise<CompanyTelnyxSettingsRow | null> {
	const { data } = await (supabase as any)
		.from(COMPANY_SETTINGS_TABLE)
		.select("*")
		.eq("company_id", companyId)
		.maybeSingle();

	return (data as CompanyTelnyxSettingsRow | null) ?? null;
}

export async function ensureCompanyTelnyxSetup(
	options: ProvisionOptions,
): Promise<ProvisionResult> {
	const { supabase, companyId } = options;
	const log: string[] = [];

	const existing = await fetchCompanyTelnyxSettings(supabase, companyId);
	if (
		existing &&
		existing.status === "ready" &&
		existing.messaging_profile_id &&
		existing.call_control_application_id
	) {
		log.push("Existing Telnyx configuration found");
		return { success: true, settings: existing, log };
	}

	const { data: company } = await supabase
		.from("companies")
		.select("id, name")
		.eq("id", companyId)
		.maybeSingle();

	if (!company) {
		return {
			success: false,
			error: "Company not found",
			log,
		};
	}

	const webhookUrl = await buildCompanyWebhookUrl(companyId);
	if (!webhookUrl) {
		return {
			success: false,
			error:
				"NEXT_PUBLIC_SITE_URL must be configured with a public URL to provision Telnyx resources",
			log,
		};
	}

	try {
		log.push("Creating messaging profile");
		const messagingProfile = await createMessagingProfile(
			company.name || "Company",
			webhookUrl,
		);
		const messagingProfileId = messagingProfile?.id as string;

		log.push("Creating call control application");
		const callApplication = await createCallControlApplication(
			company.name || "Company",
			webhookUrl,
		);
		const connectionId = callApplication?.id as string;

		if (!messagingProfileId || !connectionId) {
			throw new Error(
				"Failed to provision messaging profile or call control application",
			);
		}

		log.push("Purchasing phone numbers");
		const purchasedNumbers = await purchaseNumbers(companyId, {
			quantity: Math.max(options.numberQuantity || 1, 1),
			areaCode: options.areaCode,
			features: options.features || DEFAULT_FEATURES,
			messagingProfileId,
			connectionId,
		});

		await ensurePhoneNumbersInserted(supabase, companyId, purchasedNumbers, {
			messagingProfileId,
			connectionId,
		});

		const defaultNumber =
			purchasedNumbers.find((n) => n.numberType === "toll-free") ||
			purchasedNumbers[0];

		const upsertResult = await (supabase as any)
			.from(COMPANY_SETTINGS_TABLE)
			.upsert(
				{
					company_id: companyId,
					status: "ready",
					messaging_profile_id: messagingProfileId,
					call_control_application_id: connectionId,
					default_outbound_number: defaultNumber?.phoneNumber || null,
					default_outbound_phone_number_id:
						defaultNumber?.telnyxPhoneNumberId || null,
					metadata: {
						log,
						purchased_numbers: purchasedNumbers.map((n) => n.phoneNumber),
					},
					last_provisioned_at: new Date().toISOString(),
				},
				{ onConflict: "company_id" },
			)
			.select("*")
			.single();

		return {
			success: true,
			settings: upsertResult.data as CompanyTelnyxSettingsRow,
			log,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to provision Telnyx resources",
			log,
		};
	}
}

export async function purchaseAdditionalNumbers(
	options: ProvisionOptions & { quantity: number },
): Promise<ProvisionResult> {
	const { supabase, companyId, quantity } = options;
	const log: string[] = [];

	const settings = await fetchCompanyTelnyxSettings(supabase, companyId);
	if (
		!settings ||
		settings.status !== "ready" ||
		!settings.messaging_profile_id ||
		!settings.call_control_application_id
	) {
		return {
			success: false,
			error:
				"Company Telnyx configuration is not ready. Run ensureCompanyTelnyxSetup first.",
			log,
		};
	}

	try {
		log.push(`Purchasing ${quantity} additional numbers`);
		const purchasedNumbers = await purchaseNumbers(companyId, {
			quantity,
			areaCode: options.areaCode,
			features: options.features || DEFAULT_FEATURES,
			messagingProfileId: settings.messaging_profile_id,
			connectionId: settings.call_control_application_id,
		});

		await ensurePhoneNumbersInserted(supabase, companyId, purchasedNumbers, {
			messagingProfileId: settings.messaging_profile_id,
			connectionId: settings.call_control_application_id,
		});

		// Prefer toll-free numbers as the default outbound if available
		const tollFreeNumber = purchasedNumbers.find(
			(n) => n.numberType === "toll-free",
		);
		if (
			tollFreeNumber &&
			settings.default_outbound_number !== tollFreeNumber.phoneNumber
		) {
			await supabase
				.from(COMPANY_SETTINGS_TABLE)
				.update({
					default_outbound_number: tollFreeNumber.phoneNumber,
					default_outbound_phone_number_id:
						tollFreeNumber.telnyxPhoneNumberId || null,
				})
				.eq("company_id", companyId);
		}

		return {
			success: true,
			settings,
			log,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to purchase phone numbers",
			log,
		};
	}
}
