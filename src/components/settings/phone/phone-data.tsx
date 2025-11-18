import { notFound } from "next/navigation";
import {
	DEFAULT_PHONE_SETTINGS,
	mapPhoneSettings,
} from "@/app/(dashboard)/dashboard/settings/communications/phone/phone-config";
import PhoneSettingsClient from "@/app/(dashboard)/dashboard/settings/communications/phone/phone-settings-client";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function UphoneData() {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const { data, error } = await supabase
		.from("communication_phone_settings")
		.select("*")
		.eq("company_id", activeCompanyId)
		.maybeSingle();

	if (error) {
		console.error("Failed to load phone settings", error);
	}

	const initialSettings = {
		...DEFAULT_PHONE_SETTINGS,
		...mapPhoneSettings(data ?? null),
	};

	return <PhoneSettingsClient initialSettings={initialSettings} />;
}
