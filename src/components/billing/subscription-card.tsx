"use client";

/**
 * Subscription Card - Display subscription details for an organization
 *
 * Shows:
 * - Subscription status with badge
 * - Current plan details
 * - Billing period dates
 * - Actions (cancel, reactivate, manage billing)
 *
 * Performance optimizations:
 * - Client Component for interactive elements
 * - Server Actions for mutations
 */

import { AlertCircle, CheckCircle, CreditCard, XCircle } from "lucide-react";
import { useState } from "react";
import { cancelCompanySubscription, createBillingPortal, reactivateCompanySubscription } from "@/actions/billing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type SubscriptionStatus =
	| "active"
	| "canceled"
	| "incomplete"
	| "incomplete_expired"
	| "past_due"
	| "trialing"
	| "unpaid"
	| "paused";

type SubscriptionCardProps = {
	companyId: string;
	companyName: string;
	subscriptionId?: string | null;
	status?: SubscriptionStatus | null;
	currentPeriodStart?: string | null;
	currentPeriodEnd?: string | null;
	cancelAtPeriodEnd?: boolean;
	trialEndsAt?: string | null;
};

export function SubscriptionCard({
	companyId,
	companyName,
	subscriptionId,
	status,
	currentPeriodStart,
	currentPeriodEnd,
	cancelAtPeriodEnd,
	trialEndsAt,
}: SubscriptionCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const hasActiveSubscription = status === "active" || status === "trialing";

	const handleManageBilling = async () => {
		setIsLoading(true);
		setError(null);

		const result = await createBillingPortal(companyId);

		if (result.success && result.url) {
			window.location.href = result.url;
		} else {
			setError(result.error || "Failed to open billing portal");
			setIsLoading(false);
		}
	};

	const handleCancelSubscription = async () => {
		if (
			!confirm(
				"Are you sure you want to cancel this subscription? It will remain active until the end of the current billing period."
			)
		) {
			return;
		}

		setIsLoading(true);
		setError(null);
		setSuccess(null);

		const result = await cancelCompanySubscription(companyId);

		if (result.success) {
			setSuccess("Subscription will be canceled at the end of the billing period");
			setTimeout(() => window.location.reload(), 2000);
		} else {
			setError(result.error || "Failed to cancel subscription");
		}

		setIsLoading(false);
	};

	const handleReactivateSubscription = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		const result = await reactivateCompanySubscription(companyId);

		if (result.success) {
			setSuccess("Subscription reactivated successfully");
			setTimeout(() => window.location.reload(), 2000);
		} else {
			setError(result.error || "Failed to reactivate subscription");
		}

		setIsLoading(false);
	};

	const getStatusBadge = (status?: SubscriptionStatus | null) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-success">
						<CheckCircle className="mr-1 size-3" />
						Active
					</Badge>
				);
			case "trialing":
				return (
					<Badge className="bg-primary">
						<CheckCircle className="mr-1 size-3" />
						Trial
					</Badge>
				);
			case "past_due":
				return (
					<Badge className="bg-warning">
						<AlertCircle className="mr-1 size-3" />
						Past Due
					</Badge>
				);
			case "canceled":
				return (
					<Badge className="bg-destructive">
						<XCircle className="mr-1 size-3" />
						Canceled
					</Badge>
				);
			default:
				return (
					<Badge variant="outline">
						<AlertCircle className="mr-1 size-3" />
						No Subscription
					</Badge>
				);
		}
	};

	const formatDate = (dateString?: string | null) => {
		if (!dateString) {
			return "N/A";
		}
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle>{companyName}</CardTitle>
						<CardDescription className="mt-1">Organization subscription details</CardDescription>
					</div>
					{getStatusBadge(status)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Error/Success Messages */}
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="size-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{success && (
					<Alert>
						<CheckCircle className="size-4" />
						<AlertDescription>{success}</AlertDescription>
					</Alert>
				)}

				{/* Subscription Details */}
				{hasActiveSubscription ? (
					<div className="space-y-3">
						{/* Trial Period */}
						{status === "trialing" && trialEndsAt && (
							<div className="rounded-lg border border-primary bg-primary p-3 dark:border-primary dark:bg-primary">
								<p className="font-medium text-primary text-sm dark:text-primary">Trial Period</p>
								<p className="text-primary text-sm dark:text-primary">Trial ends on {formatDate(trialEndsAt)}</p>
							</div>
						)}

						{/* Billing Period */}
						<div className="grid gap-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Current period:</span>
								<span className="font-medium">
									{formatDate(currentPeriodStart)} - {formatDate(currentPeriodEnd)}
								</span>
							</div>
							{subscriptionId && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subscription ID:</span>
									<span className="font-mono text-xs">{subscriptionId}</span>
								</div>
							)}
						</div>

						{/* Cancellation Notice */}
						{cancelAtPeriodEnd && (
							<Alert>
								<AlertCircle className="size-4" />
								<AlertDescription>
									This subscription will be canceled on {formatDate(currentPeriodEnd)}
								</AlertDescription>
							</Alert>
						)}
					</div>
				) : (
					<div className="rounded-lg border border-dashed p-6 text-center">
						<CreditCard className="mx-auto mb-2 size-8 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">No active subscription for this organization</p>
					</div>
				)}
			</CardContent>

			<CardFooter className="flex gap-2">
				{hasActiveSubscription ? (
					<>
						<Button disabled={isLoading} onClick={handleManageBilling} variant="outline">
							<CreditCard className="mr-2 size-4" />
							Manage Billing
						</Button>

						{cancelAtPeriodEnd ? (
							<Button disabled={isLoading} onClick={handleReactivateSubscription} variant="default">
								Reactivate Subscription
							</Button>
						) : (
							<Button disabled={isLoading} onClick={handleCancelSubscription} variant="destructive">
								Cancel Subscription
							</Button>
						)}
					</>
				) : (
					<Button disabled={isLoading} onClick={handleManageBilling}>
						<CreditCard className="mr-2 size-4" />
						Set Up Billing
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
