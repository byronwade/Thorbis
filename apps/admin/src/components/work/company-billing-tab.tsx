import { CreditCard, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import Link from "next/link";

type CompanyBillingTabProps = {
	company: any;
};

/**
 * Company Billing Tab
 * 
 * Displays billing and subscription information.
 */
export function CompanyBillingTab({ company }: CompanyBillingTabProps) {
	const hasStripeSubscription = !!company.stripe_subscription_id;

	return (
		<div className="space-y-6">
			{/* Subscription Status */}
			<Card>
				<CardHeader>
					<CardTitle>Subscription</CardTitle>
					<CardDescription>Current subscription details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Status</p>
							{company.stripe_subscription_status ? (
								<Badge className="mt-1 capitalize">
									{company.stripe_subscription_status}
								</Badge>
							) : (
								<p className="text-muted-foreground text-sm">No subscription</p>
							)}
						</div>
						<div>
							<p className="font-medium">Plan</p>
							<p className="text-muted-foreground text-sm">
								{company.subscription_tier || "Free"}
							</p>
						</div>
					</div>

					{company.subscription_current_period_start && (
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Current Period</label>
							<p className="text-sm">
								{formatDate(company.subscription_current_period_start)} -{" "}
								{company.subscription_current_period_end
									? formatDate(company.subscription_current_period_end)
									: "N/A"}
							</p>
						</div>
					)}

					{company.trial_ends_at && (
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Trial Ends</label>
							<p className="text-sm">{formatDate(company.trial_ends_at)}</p>
						</div>
					)}

					{hasStripeSubscription && (
						<div className="pt-4">
							<Button variant="outline" asChild>
								<a
									href={`https://dashboard.stripe.com/subscriptions/${company.stripe_subscription_id}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									View in Stripe
									<ExternalLink className="ml-2 h-4 w-4" />
								</a>
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Stripe IDs */}
			<Card>
				<CardHeader>
					<CardTitle>Stripe Information</CardTitle>
					<CardDescription>Stripe customer and subscription IDs</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{company.stripe_customer_id ? (
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Customer ID</label>
							<p className="font-mono text-xs">{company.stripe_customer_id}</p>
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No Stripe customer ID</p>
					)}

					{company.stripe_subscription_id ? (
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Subscription ID</label>
							<p className="font-mono text-xs">{company.stripe_subscription_id}</p>
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No Stripe subscription ID</p>
					)}
				</CardContent>
			</Card>

			{/* Usage Metrics Placeholder */}
			<Card>
				<CardHeader>
					<CardTitle>Usage Metrics</CardTitle>
					<CardDescription>Current billing period usage</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Usage metrics will be displayed here once Stripe integration is complete.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}



