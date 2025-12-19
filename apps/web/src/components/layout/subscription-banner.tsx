"use client";

/**
 * Subscription Warning Banner
 *
 * Displays a persistent warning when subscription needs attention:
 * - Trial ending soon
 * - Payment failed (in grace period)
 * - Subscription canceled
 *
 * Uses dismissible logic with localStorage to remember dismissal.
 */

import { AlertTriangle, CreditCard, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubscriptionStatus } from "@/lib/auth/subscription-status";

type SubscriptionBannerProps = {
	status: SubscriptionStatus;
	billingUrl?: string;
};

const DISMISS_STORAGE_KEY = "subscription-banner-dismissed";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function SubscriptionBanner({
	status,
	billingUrl = "/dashboard/settings/billing",
}: SubscriptionBannerProps) {
	const [isDismissed, setIsDismissed] = useState(true); // Start hidden to avoid flash

	useEffect(() => {
		// Check if banner was recently dismissed
		const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
		if (dismissedAt) {
			const dismissedTime = parseInt(dismissedAt, 10);
			const now = Date.now();
			// Allow dismissal for 24 hours, then show again
			if (now - dismissedTime < DISMISS_DURATION_MS) {
				setIsDismissed(true);
				return;
			}
		}
		setIsDismissed(false);
	}, []);

	// Don't show if no warning needed or dismissed
	if (!status.shouldShowWarning || isDismissed) {
		return null;
	}

	const handleDismiss = () => {
		localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
		setIsDismissed(true);
	};

	const isUrgent = status.isPastDue || status.daysRemainingInTrial <= 1;
	const isCritical =
		status.isPastDue && !status.isInGracePeriod && status.status !== "canceled";

	return (
		<div
			className={cn(
				"relative px-4 py-3",
				isUrgent
					? "bg-red-50 border-b border-red-200"
					: "bg-yellow-50 border-b border-yellow-200"
			)}
			role="alert"
			aria-live="polite"
		>
			<div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<AlertTriangle
						className={cn(
							"h-5 w-5 flex-shrink-0",
							isUrgent ? "text-red-600" : "text-yellow-600"
						)}
					/>
					<p
						className={cn(
							"text-sm font-medium",
							isUrgent ? "text-red-800" : "text-yellow-800"
						)}
					>
						{status.warningMessage}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Link href={billingUrl}>
						<Button
							size="sm"
							variant={isUrgent ? "destructive" : "default"}
							className="gap-2"
						>
							<CreditCard className="h-4 w-4" />
							{status.isPastDue ? "Update Payment" : "Manage Billing"}
						</Button>
					</Link>

					{/* Only allow dismissal if not critical */}
					{!isCritical && (
						<button
							onClick={handleDismiss}
							className={cn(
								"p-1 rounded-md transition-colors",
								isUrgent
									? "text-red-600 hover:bg-red-100"
									: "text-yellow-600 hover:bg-yellow-100"
							)}
							aria-label="Dismiss notification"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>

			{/* Progress indicator for grace period */}
			{status.isInGracePeriod && status.daysRemainingInGrace > 0 && (
				<div className="mt-2 mx-auto max-w-7xl">
					<div className="flex items-center gap-2">
						<span className="text-xs text-red-700">
							{status.daysRemainingInGrace} days remaining
						</span>
						<div className="flex-1 h-1.5 bg-red-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-red-600 transition-all duration-300"
								style={{
									width: `${((7 - status.daysRemainingInGrace) / 7) * 100}%`,
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * Server component wrapper to fetch status and render banner
 */
export async function SubscriptionBannerServer({
	companyId,
	billingUrl,
}: {
	companyId: string;
	billingUrl?: string;
}) {
	// Import dynamically to avoid circular dependencies
	const { checkSubscriptionStatus } = await import(
		"@/lib/auth/subscription-status"
	);
	const status = await checkSubscriptionStatus(companyId);

	if (!status.shouldShowWarning) {
		return null;
	}

	return <SubscriptionBanner status={status} billingUrl={billingUrl} />;
}
