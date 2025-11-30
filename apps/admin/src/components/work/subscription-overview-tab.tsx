import { CreditCard, Calendar, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import Link from "next/link";

type SubscriptionOverviewTabProps = {
	subscription: any;
};

/**
 * Subscription Overview Tab
 * 
 * Displays key subscription information.
 */
export function SubscriptionOverviewTab({ subscription }: SubscriptionOverviewTabProps) {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Subscription Details</CardTitle>
						<CardDescription>Current subscription information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Status</label>
							<div>
								<Badge className="capitalize">{subscription.status}</Badge>
							</div>
						</div>
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Plan</label>
							<p className="text-sm capitalize">{subscription.plan}</p>
						</div>
						{subscription.current_period_start && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Current Period</label>
								<p className="text-sm">
									{formatDate(subscription.current_period_start)} -{" "}
									{subscription.current_period_end
										? formatDate(subscription.current_period_end)
										: "N/A"}
								</p>
							</div>
						)}
						{subscription.trial_ends_at && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Trial Ends</label>
								<p className="text-sm">{formatDate(subscription.trial_ends_at)}</p>
							</div>
						)}
						{subscription.cancel_at_period_end && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Cancellation</label>
								<p className="text-sm">Will cancel at period end</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Company Information</CardTitle>
						<CardDescription>Associated company</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Link
							href={`/dashboard/work/companies/${subscription.company_id}`}
							className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
						>
							<Building2 className="text-muted-foreground h-5 w-5" />
							<div>
								<p className="font-medium">{subscription.company_name}</p>
								<p className="text-muted-foreground text-sm">View company details</p>
							</div>
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* Stripe IDs */}
			<Card>
				<CardHeader>
					<CardTitle>Stripe Information</CardTitle>
					<CardDescription>Stripe subscription and customer IDs</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{subscription.stripe_subscription_id ? (
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Subscription ID</label>
							<p className="font-mono text-xs">{subscription.stripe_subscription_id}</p>
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No Stripe subscription ID</p>
					)}

					{subscription.stripe_customer_id ? (
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Customer ID</label>
							<p className="font-mono text-xs">{subscription.stripe_customer_id}</p>
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No Stripe customer ID</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

