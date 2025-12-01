"use client";

import { useState } from "react";
import { Settings, X, RotateCcw, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelSubscription, reactivateSubscription } from "@/actions/billing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SubscriptionActionsTabProps = {
	subscription: any;
};

/**
 * Subscription Actions Tab
 * 
 * Allows admins to manage subscription actions.
 */
export function SubscriptionActionsTab({ subscription }: SubscriptionActionsTabProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleCancel = async () => {
		if (!confirm("Are you sure you want to cancel this subscription?")) {
			return;
		}

		setIsLoading(true);
		try {
			const result = await cancelSubscription(
				subscription.stripe_subscription_id || subscription.id,
			);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Subscription cancelled");
				router.refresh();
			}
		} catch (error) {
			toast.error("Failed to cancel subscription");
		} finally {
			setIsLoading(false);
		}
	};

	const handleReactivate = async () => {
		setIsLoading(true);
		try {
			const result = await reactivateSubscription(
				subscription.stripe_subscription_id || subscription.id,
			);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Subscription reactivated");
				router.refresh();
			}
		} catch (error) {
			toast.error("Failed to reactivate subscription");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Subscription Actions</CardTitle>
					<CardDescription>Manage subscription lifecycle</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{subscription.status === "active" && !subscription.cancel_at_period_end ? (
						<Button onClick={handleCancel} disabled={isLoading} variant="destructive">
							<X className="mr-2 h-4 w-4" />
							Cancel Subscription
						</Button>
					) : subscription.status === "canceled" ? (
						<Button onClick={handleReactivate} disabled={isLoading}>
							<RotateCcw className="mr-2 h-4 w-4" />
							Reactivate Subscription
						</Button>
					) : (
						<p className="text-muted-foreground text-sm">
							Subscription is set to cancel at period end.
						</p>
					)}

					{subscription.stripe_subscription_id && (
						<div className="pt-4 border-t">
							<Button variant="outline" asChild>
								<a
									href={`https://dashboard.stripe.com/subscriptions/${subscription.stripe_subscription_id}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									View in Stripe Dashboard
									<ExternalLink className="ml-2 h-4 w-4" />
								</a>
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}



