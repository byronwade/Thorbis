/**
 * Payment Methods Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default
 * - Fetches data server-side
 * - Only interactive parts are client components
 */

import { Plus } from "lucide-react";
import { Suspense } from "react";
import { getPaymentMethods } from "@/actions/payment-methods";
import { PaymentMethodsList } from "@/components/settings/billing/payment-methods-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Payment Methods Loading Skeleton
 */
function PaymentMethodsLoading() {
	return (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<Card className="p-4" key={i}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Skeleton className="size-4" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
						<Skeleton className="h-9 w-24" />
					</div>
				</Card>
			))}
		</div>
	);
}

/**
 * Payment Methods Content - Fetches data server-side
 */
async function PaymentMethodsContent() {
	const { paymentMethods } = await getPaymentMethods();

	return (
		<PaymentMethodsList
			paymentMethods={paymentMethods.map((method: any) => ({
				id: method.id,
				stripePaymentMethodId: method.stripe_payment_method_id,
				type: method.type,
				brand: method.brand,
				last4: method.last4,
				expMonth: method.exp_month,
				expYear: method.exp_year,
				walletType: method.wallet_type,
				displayName: method.display_name,
				isDefault: method.is_default,
				isDefaultForSubscription: method.is_default_for_subscription,
				createdAt: method.created_at,
			}))}
		/>
	);
}

/**
 * Payment Methods Page
 */
export default function PaymentMethodsPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">Payment Methods</h1>
					<p className="text-muted-foreground">
						Manage your saved payment methods and set defaults
					</p>
				</div>
				<Button>
					<Plus className="mr-2 size-4" />
					Add Payment Method
				</Button>
			</div>

			{/* Info Cards */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card className="p-4">
					<h3 className="font-semibold">Apple Pay & Google Pay</h3>
					<p className="text-muted-foreground mt-2 text-sm">
						When you use Apple Pay or Google Pay, your payment details are
						securely saved for future purchases. You can manage these payment
						methods below.
					</p>
				</Card>
				<Card className="p-4">
					<h3 className="font-semibold">Default Payment Methods</h3>
					<p className="text-muted-foreground mt-2 text-sm">
						Set a default payment method for one-time purchases and a separate
						default for subscription payments. This makes checkout faster and
						more convenient.
					</p>
				</Card>
			</div>

			{/* Payment Methods List */}
			<Suspense fallback={<PaymentMethodsLoading />}>
				<PaymentMethodsContent />
			</Suspense>

			{/* Additional Info */}
			<Card className="border-muted-foreground/20 bg-muted/50 p-4">
				<h3 className="font-semibold">How it works</h3>
				<ul className="text-muted-foreground mt-2 space-y-2 text-sm">
					<li>
						• <strong>Apple Pay & Google Pay:</strong> When you complete a
						payment using Apple Pay or Google Pay, the underlying card is
						securely saved to your account.
					</li>
					<li>
						• <strong>Default Payment:</strong> Your default payment method is
						automatically selected for one-time purchases to speed up checkout.
					</li>
					<li>
						• <strong>Subscription Default:</strong> Set a separate default
						payment method for recurring subscription charges.
					</li>
					<li>
						• <strong>Security:</strong> All payment information is securely
						stored with Stripe and protected by bank-level encryption.
					</li>
				</ul>
			</Card>
		</div>
	);
}

/**
 * Metadata
 */
export const metadata = {
	title: "Payment Methods - Settings",
	description: "Manage your saved payment methods, Apple Pay, and Google Pay",
};
