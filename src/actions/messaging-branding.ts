"use server";

import type { SupabaseClient as SupabaseJsClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
	attachNumberToCampaign,
	createTenDlcBrand,
	createTenDlcCampaign,
	getTenDlcBrand,
	getTenDlcCampaign,
} from "@/lib/telnyx/ten-dlc";
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseJsClient<Database>;

type OwnerContactRow = {
	full_name?: string | null;
	email?: string | null;
	phone?: string | null;
};

const DEFAULT_MESSAGING_PROFILE_ID =
	process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID ||
	process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID ||
	"";

const NANP_WITH_COUNTRY_DIGITS = 11;
const NANP_LOCAL_DIGITS = 10;
const WHITESPACE_SPLIT_REGEX = /\s+/;

function formatPhone(phone?: string | null): string | null {
	if (!phone) {
		return null;
	}
	const digits = phone.replace(/\D/g, "");
	if (!digits) {
		return null;
	}
	if (digits.length === NANP_WITH_COUNTRY_DIGITS && digits.startsWith("1")) {
		return `+${digits}`;
	}
	if (digits.length === NANP_LOCAL_DIGITS) {
		return `+1${digits}`;
	}
	return phone.startsWith("+") ? phone : `+${digits}`;
}

function splitName(fullName?: string | null) {
	if (!fullName) {
		return { first: "Support", last: "Team" };
	}
	const parts = fullName.trim().split(WHITESPACE_SPLIT_REGEX);
	if (parts.length === 1) {
		return { first: parts[0], last: "Team" };
	}
	return { first: parts[0], last: parts.slice(1).join(" ") };
}

function mapIndustryToVertical(industry?: string | null) {
	if (!industry) {
		return "PROFESSIONAL";
	}
	const normalized = industry.toLowerCase();
	if (normalized.includes("plumb")) {
		return "HOME_SERVICES";
	}
	if (normalized.includes("hvac")) {
		return "HOME_SERVICES";
	}
	if (normalized.includes("electric")) {
		return "HOME_SERVICES";
	}
	if (normalized.includes("clean")) {
		return "PROFESSIONAL";
	}
	return "PROFESSIONAL";
}

async function upsertBrandRecord(
	supabase: TypedSupabaseClient,
	data: Partial<Database["public"]["Tables"]["messaging_brands"]["Insert"]> & {
		company_id: string;
	}
) {
	const { data: existing } = await supabase
		.from("messaging_brands")
		.select("id")
		.eq("company_id", data.company_id)
		.maybeSingle();

	if (existing) {
		await supabase
			.from("messaging_brands")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", existing.id);
	} else {
		await supabase
			.from("messaging_brands")
			.insert(data as Database["public"]["Tables"]["messaging_brands"]["Insert"]);
	}
}

async function upsertCampaignRecord(
	supabase: TypedSupabaseClient,
	data: Partial<Database["public"]["Tables"]["messaging_campaigns"]["Insert"]> & {
		messaging_brand_id: string;
		usecase: string;
	}
) {
	const { data: existing } = await supabase
		.from("messaging_campaigns")
		.select("id")
		.eq("messaging_brand_id", data.messaging_brand_id)
		.eq("usecase", data.usecase)
		.maybeSingle();

	if (existing) {
		await supabase
			.from("messaging_campaigns")
			.update({ ...data, updated_at: new Date().toISOString() })
			.eq("id", existing.id);
		return existing.id;
	}

	const { data: inserted } = await supabase
		.from("messaging_campaigns")
		.insert(data)
		.select("id")
		.single();

	return inserted?.id ?? null;
}

// Telnyx onboarding requires multiple guarded steps
export async function ensureMessagingBranding(
	companyId: string,
	options?: { supabase?: TypedSupabaseClient | null }
) {
	const supabase = options?.supabase ?? (await createClient());
	if (!supabase) {
		return { success: false, error: "Supabase unavailable" };
	}

	const { data: company, error } = await supabase
		.from("companies")
		.select(
			"id, name, legal_name, doing_business_as, phone, support_email, support_phone, website, website_url, brand_color, industry, address, city, state, zip_code, owner_id, ein, tax_id"
		)
		.eq("id", companyId)
		.single();

	if (error || !company) {
		return {
			success: false,
			error: error?.message || "Company not found",
		};
	}

	const { data: ownerContact } = await supabase
		.from("users")
		.select("full_name, email, phone")
		.eq("id", company.owner_id)
		.maybeSingle<OwnerContactRow>();

	const contactName = splitName(ownerContact?.full_name);
	const contactEmail = ownerContact?.email || company.support_email || "support@example.com";
	const contactPhone =
		formatPhone(ownerContact?.phone) ||
		formatPhone(company.support_phone) ||
		formatPhone(company.phone) ||
		"+18314280176";

	const { data: brandRow } = await supabase
		.from("messaging_brands")
		.select("*")
		.eq("company_id", companyId)
		.maybeSingle();

	if (brandRow?.telnyx_brand_id) {
		const brandStatus = await getTenDlcBrand(brandRow.telnyx_brand_id);
		if (brandStatus.success && brandStatus.data) {
			await supabase
				.from("messaging_brands")
				.update({
					status: brandStatus.data.status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", brandRow.id);
		}
	}

	if (!brandRow?.telnyx_brand_id) {
		const brandPayload = {
			customer_reference: companyId,
			brand_name: company.legal_name || company.name,
			ein: company.ein || company.tax_id || process.env.FALLBACK_TEST_EIN || "00-0000000",
			ein_issuing_country: "US",
			vertical: mapIndustryToVertical(company.industry),
			website: company.website || company.website_url || null,
			company_type: "PRIVATE_PROFIT" as const,
			address: {
				line1: company.address || "115 Flintlock Lane",
				city: company.city || "Ben Lomond",
				state: company.state || "CA",
				postal_code: company.zip_code || "95005",
				country: "US",
			},
			contact: {
				first_name: contactName.first,
				last_name: contactName.last,
				email: contactEmail,
				phone: contactPhone,
			},
			optional_attributes: {
				doing_business_as: company.doing_business_as || company.name,
			},
		};

		const brandResult = await createTenDlcBrand(brandPayload);
		if (!(brandResult.success && brandResult.data)) {
			return {
				success: false,
				error: brandResult.error || "Failed to create 10DLC brand",
			};
		}

		await upsertBrandRecord(supabase, {
			company_id: companyId,
			telnyx_brand_id: brandResult.data.id,
			status: "submitted",
			legal_name: brandPayload.brand_name,
			doing_business_as: company.doing_business_as || company.name,
			ein: brandPayload.ein,
			vertical: brandPayload.vertical,
			website: brandPayload.website,
			support_email: contactEmail,
			support_phone: contactPhone,
			address_line1: brandPayload.address.line1,
			city: brandPayload.address.city,
			state: brandPayload.address.state,
			postal_code: brandPayload.address.postal_code,
			brand_color: company.brand_color,
		});
	}

	revalidatePath("/dashboard/settings/communications/brand");
	return { success: true };
}

// Linking campaigns touches several Telnyx APIs sequentially
export async function ensureMessagingCampaign(
	companyId: string,
	phoneNumber: { id: string; e164: string },
	options?: { supabase?: TypedSupabaseClient | null }
) {
	const supabase = options?.supabase ?? (await createClient());
	if (!supabase) {
		return { success: false, error: "Supabase unavailable" };
	}

	const { data: brand } = await supabase
		.from("messaging_brands")
		.select("*")
		.eq("company_id", companyId)
		.maybeSingle();

	if (!brand?.telnyx_brand_id) {
		const brandResult = await ensureMessagingBranding(companyId, {
			supabase,
		});
		if (!brandResult.success) {
			return brandResult;
		}
		return ensureMessagingCampaign(companyId, phoneNumber);
	}

	const usecase = "CUSTOMER_CARE";

	const { data: campaignRow } = await supabase
		.from("messaging_campaigns")
		.select("*")
		.eq("messaging_brand_id", brand.id)
		.eq("usecase", usecase)
		.maybeSingle();

	if (campaignRow?.telnyx_campaign_id) {
		const campaignStatus = await getTenDlcCampaign(campaignRow.telnyx_campaign_id);
		if (campaignStatus.success && campaignStatus.data) {
			await supabase
				.from("messaging_campaigns")
				.update({
					status: campaignStatus.data.status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", campaignRow.id);
		}
	}

	let campaignId = campaignRow?.id ?? null;
	let telnyxCampaignId = campaignRow?.telnyx_campaign_id ?? null;

	if (!campaignRow?.telnyx_campaign_id) {
		if (!DEFAULT_MESSAGING_PROFILE_ID) {
			return {
				success: false,
				error: "TELNYX_DEFAULT_MESSAGING_PROFILE_ID not configured",
			};
		}

		const description = `${brand.doing_business_as || brand.legal_name} provides appointment updates, reminders, and service notifications to existing customers.`;
		const sampleMessage = `Hi {{customer_name}}, this is ${
			brand.doing_business_as || brand.legal_name
		} confirming your upcoming appointment. Reply HELP for assistance or STOP to opt out.`;

		const campaignPayload = {
			brand_id: brand.telnyx_brand_id,
			campaign_alias: `${companyId}-customer-care`,
			usecase,
			description,
			sample_messages: [sampleMessage],
			message_flow:
				"Customers opt in during onboarding or by texting our business line. They receive service updates and can opt out by replying STOP.",
			terms_and_conditions: "Msg & data rates may apply. Reply STOP to opt out, HELP for help.",
			help_message: `Thanks for contacting ${brand.doing_business_as || brand.legal_name}. Reply STOP to unsubscribe.`,
			help_phone_number: brand.support_phone || "+18314280176",
			help_email: brand.support_email || "support@example.com",
			auto_renewal: true,
			message_fee_credits: 0,
			opt_in_keywords: ["START", "YES"],
			opt_out_keywords: ["STOP", "UNSUBSCRIBE"],
			opt_in_message: "Thanks for opting in to receive messages from us. Reply STOP to opt out.",
			opt_out_message:
				"You have successfully been unsubscribed and will no longer receive messages. Reply START to opt in again.",
		};

		const campaignResult = await createTenDlcCampaign(campaignPayload);
		if (!(campaignResult.success && campaignResult.data)) {
			return {
				success: false,
				error: campaignResult.error || "Failed to create 10DLC campaign",
			};
		}

		campaignId =
			(await upsertCampaignRecord(supabase, {
				messaging_brand_id: brand.id,
				telnyx_campaign_id: campaignResult.data.id,
				status: "submitted",
				usecase,
				description,
				sample_messages: campaignPayload.sample_messages,
				messaging_profile_id: DEFAULT_MESSAGING_PROFILE_ID,
			})) ||
			campaignRow?.id ||
			null;
		telnyxCampaignId = campaignResult.data.id;
	}

	if (!(campaignId && telnyxCampaignId)) {
		return {
			success: false,
			error: "Campaign not ready",
		};
	}

	const { data: linkRecord } = await supabase
		.from("messaging_campaign_phone_numbers")
		.select("*")
		.eq("messaging_campaign_id", campaignId)
		.eq("phone_number_id", phoneNumber.id)
		.maybeSingle();

	if (!linkRecord?.telnyx_relationship_id) {
		const attachResult = await attachNumberToCampaign(telnyxCampaignId, phoneNumber.e164);
		if (!(attachResult.success && attachResult.data)) {
			return {
				success: false,
				error: attachResult.error || "Failed to link number to campaign",
			};
		}

		if (linkRecord) {
			await supabase
				.from("messaging_campaign_phone_numbers")
				.update({
					telnyx_relationship_id: attachResult.data.id,
					status: "submitted",
				})
				.eq("id", linkRecord.id);
		} else {
			await supabase.from("messaging_campaign_phone_numbers").insert({
				messaging_campaign_id: campaignId,
				phone_number_id: phoneNumber.id,
				telnyx_relationship_id: attachResult.data.id,
				status: "submitted",
			});
		}
	}

	await supabase
		.from("phone_numbers")
		.update({
			telnyx_messaging_profile_id: DEFAULT_MESSAGING_PROFILE_ID,
			metadata: {
				ten_dlc_campaign_id: telnyxCampaignId,
			},
		})
		.eq("id", phoneNumber.id);

	revalidatePath("/dashboard/settings/communications/phone-numbers");
	return { success: true };
}
