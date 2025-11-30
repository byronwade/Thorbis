import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SubscriptionBillingTabProps = {
	subscriptionId: string;
};

/**
 * Subscription Billing Tab
 * 
 * Displays billing history and invoices.
 */
export function SubscriptionBillingTab({ subscriptionId }: SubscriptionBillingTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Billing History</CardTitle>
				<CardDescription>Invoice and payment history</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center py-12">
					<FileText className="text-muted-foreground mb-4 h-12 w-12" />
					<p className="text-muted-foreground text-sm">
						Billing history will be displayed here once Stripe integration is complete.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

