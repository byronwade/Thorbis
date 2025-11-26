/**
 * Payment Processor Settings Page
 *
 * Configure payment processors (Adyen, Plaid, ProfitStars) and payout settings.
 */

import { Suspense } from "react";
import { PaymentSettingsData } from "@/components/settings/finance/payments/payment-settings-data";
import { PaymentSettingsSkeleton } from "@/components/settings/finance/payments/payment-settings-skeleton";

export default function PaymentSettingsPage() {
	return (
		<Suspense fallback={<PaymentSettingsSkeleton />}>
			<PaymentSettingsData />
		</Suspense>
	);
}
