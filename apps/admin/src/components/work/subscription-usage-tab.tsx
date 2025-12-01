import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SubscriptionUsageTabProps = {
	subscriptionId: string;
};

/**
 * Subscription Usage Tab
 * 
 * Displays usage metrics for the subscription.
 */
export function SubscriptionUsageTab({ subscriptionId }: SubscriptionUsageTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Usage Metrics</CardTitle>
				<CardDescription>Current billing period usage</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center py-12">
					<TrendingUp className="text-muted-foreground mb-4 h-12 w-12" />
					<p className="text-muted-foreground text-sm">
						Usage metrics will be displayed here once Stripe integration is complete.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}



