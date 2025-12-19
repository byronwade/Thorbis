"use client";

/**
 * Client wrapper for PaymentRecoveryCard
 * Handles button actions and routing
 */

import { useRouter } from "next/navigation";
import { PaymentRecoveryCard } from "./payment-recovery-card";

type PaymentRecoveryCardClientProps = {
	companyId: string;
	amountDue: string;
	lastFourDigits: string;
	paymentMethod: string;
	failedAt: string;
	attemptCount: number;
	gracePeriodEnds: string;
	daysRemainingInGrace: number;
};

export function PaymentRecoveryCardClient({
	companyId,
	...props
}: PaymentRecoveryCardClientProps) {
	const router = useRouter();

	const handleUpdatePayment = () => {
		// Navigate to payment methods page
		router.push("/dashboard/settings/billing/payment-methods");
	};

	const handleRetryPayment = async (): Promise<boolean> => {
		// Call server action to retry payment
		try {
			const { retrySubscriptionPayment } = await import(
				"@/actions/onboarding-billing"
			);
			const result = await retrySubscriptionPayment(companyId);
			return result.success;
		} catch {
			return false;
		}
	};

	return (
		<PaymentRecoveryCard
			{...props}
			onUpdatePayment={handleUpdatePayment}
			onRetryPayment={handleRetryPayment}
		/>
	);
}
