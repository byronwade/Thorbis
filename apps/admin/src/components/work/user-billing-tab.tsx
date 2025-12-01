import { CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserBillingTabProps = {
	user: any;
};

/**
 * User Billing Tab
 * 
 * Displays billing information for the user (if they are a company owner).
 */
export function UserBillingTab({ user }: UserBillingTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Billing Information</CardTitle>
				<CardDescription>Stripe customer and payment details</CardDescription>
			</CardHeader>
			<CardContent>
				{user.stripe_customer_id ? (
					<div className="space-y-4">
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Stripe Customer ID</label>
							<p className="font-mono text-xs">{user.stripe_customer_id}</p>
						</div>
					</div>
				) : (
					<p className="text-muted-foreground text-sm">No Stripe customer ID</p>
				)}
			</CardContent>
		</Card>
	);
}



