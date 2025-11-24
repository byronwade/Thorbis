import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	handleCheckoutSuccess,
	getCheckoutSessionStatus,
} from "@/actions/onboarding-billing";
import Link from "next/link";

interface PageProps {
	searchParams: Promise<{ session_id?: string; company_id?: string }>;
}

async function SuccessContent({
	searchParams,
}: {
	searchParams: { session_id?: string; company_id?: string };
}) {
	const sessionId = searchParams.session_id;
	const companyId = searchParams.company_id;

	if (!sessionId || !companyId) {
		redirect("/onboarding");
	}

	// Verify session status
	const sessionStatus = await getCheckoutSessionStatus(sessionId);

	if (!sessionStatus.success || !sessionStatus.completed) {
		return (
			<Card className="max-w-2xl mx-auto p-8">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
					</div>
					<h2 className="text-2xl font-semibold">Processing payment...</h2>
					<p className="text-muted-foreground">
						Please wait while we confirm your payment.
					</p>
				</div>
			</Card>
		);
	}

	// Save payment details to database
	const result = await handleCheckoutSuccess({
		sessionId,
		companyId,
	});

	if (!result.success) {
		return (
			<Card className="max-w-2xl mx-auto p-8">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-semibold text-destructive">
						Payment processing error
					</h2>
					<p className="text-muted-foreground">
						Your payment was successful, but we encountered an error saving your
						details. Please contact support.
					</p>
					<p className="text-sm text-muted-foreground">
						Error: {result.error}
					</p>
				</div>
			</Card>
		);
	}

	return (
		<Card className="max-w-2xl mx-auto p-8">
			<div className="text-center space-y-6">
				{/* Success Icon */}
				<div className="flex justify-center">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
						<CheckCircle2 className="h-12 w-12 text-green-500" />
					</div>
				</div>

				{/* Success Message */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold">Payment method saved!</h1>
					<p className="text-lg text-muted-foreground">
						Your 14-day free trial has started
					</p>
				</div>

				{/* Details */}
				<div className="space-y-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-4">
					<p>
						<strong className="text-foreground">What happens next:</strong>
					</p>
					<ul className="space-y-2 text-left list-none">
						<li className="flex items-start gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
							<span>
								Your payment method is saved securely with Stripe
							</span>
						</li>
						<li className="flex items-start gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
							<span>
								You have 14 days to explore all features at no charge
							</span>
						</li>
						<li className="flex items-start gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
							<span>
								You'll receive an email reminder 3 days before your trial ends
							</span>
						</li>
						<li className="flex items-start gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
							<span>
								Cancel anytime from Settings → Billing (no questions asked)
							</span>
						</li>
					</ul>
				</div>

				{/* Subscription ID */}
				{result.subscriptionId && (
					<p className="text-xs text-muted-foreground">
						Subscription ID: {result.subscriptionId}
					</p>
				)}

				{/* Continue Button */}
				<div className="pt-4">
					<Link href="/onboarding?step=complete">
						<Button size="lg" className="w-full sm:w-auto">
							Continue to dashboard
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	);
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
	const params = await searchParams;

	return (
		<div className="container max-w-4xl py-12">
			<Suspense
				fallback={
					<Card className="max-w-2xl mx-auto p-8">
						<div className="text-center space-y-4">
							<Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto" />
							<p className="text-muted-foreground">
								Processing your payment...
							</p>
						</div>
					</Card>
				}
			>
				<SuccessContent searchParams={params} />
			</Suspense>
		</div>
	);
}
