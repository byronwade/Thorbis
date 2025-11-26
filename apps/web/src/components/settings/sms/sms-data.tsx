import { notFound } from "next/navigation";
import SmsSettingsClient from "@/app/(dashboard)/dashboard/settings/communications/sms/sms-client";
import {
	DEFAULT_SMS_SETTINGS,
	mapSmsSettings,
} from "@/app/(dashboard)/dashboard/settings/communications/sms/sms-config";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function UsmsData() {
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
		.from("communication_sms_settings")
		.select("*")
		.eq("company_id", activeCompanyId)
		.maybeSingle();

	if (error) {
		console.error("Failed to load SMS settings", error);
	}

	const initialSettings = {
		...DEFAULT_SMS_SETTINGS,
		...mapSmsSettings(data ?? null),
	};

	return <SmsSettingsClient initialSettings={initialSettings} />;
}
