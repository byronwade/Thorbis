"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
	ensureCompanyTelnyxSetup,
	purchaseAdditionalNumbers,
	type CompanyTelnyxSettingsRow,
} from "@/lib/telnyx/provision-company";

export async function provisionCompanyTelnyx(companyId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Service unavailable" };
	}

	const result = await ensureCompanyTelnyxSetup({
		companyId,
		supabase,
	});

	if (result.success) {
		revalidatePath(`/dashboard/communication`);
	}

	return result;
}

export async function purchaseCompanyPhoneNumbers(
	companyId: string,
	quantity: number,
	areaCode?: string,
) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Service unavailable" };
	}

	const result = await purchaseAdditionalNumbers({
		companyId,
		supabase,
		quantity,
		areaCode,
	});

	if (result.success) {
		revalidatePath(`/dashboard/communication`);
	}

	return result;
}

export type { CompanyTelnyxSettingsRow };
