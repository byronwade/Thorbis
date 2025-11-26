import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { PaymentSettingsContent } from "./payment-settings-content";

const getPaymentSettings = cache(async (companyId: string) => {
	const supabase = await createClient();
	if (!supabase) return null;

	const { data } = await supabase
		.from("company_payment_processors")
		.select("*")
		.eq("company_id", companyId)
		.single();

	return data;
});

const getPayoutSchedule = cache(async (companyId: string) => {
	const supabase = await createClient();
	if (!supabase) return null;

	const { data } = await supabase
		.from("payout_schedules")
		.select("*")
		.eq("company_id", companyId)
		.single();

	return data;
});

export async function PaymentSettingsData() {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				Unable to load company settings
			</div>
		);
	}

	const [paymentSettings, payoutSchedule] = await Promise.all([
		getPaymentSettings(companyId),
		getPayoutSchedule(companyId),
	]);

	return (
		<PaymentSettingsContent
			companyId={companyId}
			paymentSettings={paymentSettings}
			payoutSchedule={payoutSchedule}
		/>
	);
}
