import { ArrowLeft, HelpCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentCancelPage() {
	return (
		<div className="container max-w-4xl py-12">
			<Card className="max-w-2xl mx-auto p-8">
				<div className="text-center space-y-6">
					{/* Cancel Icon */}
					<div className="flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
							<XCircle className="h-12 w-12 text-amber-500" />
						</div>
					</div>

					{/* Cancel Message */}
					<div className="space-y-2">
						<h1 className="text-3xl font-bold">Payment cancelled</h1>
						<p className="text-lg text-muted-foreground">
							No charges were made to your account
						</p>
					</div>

					{/* Explanation */}
					<div className="space-y-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-4 text-left">
						<p>
							<strong className="text-foreground">What happened:</strong>
						</p>
						<ul className="space-y-2 list-none">
							<li className="flex items-start gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
								<span>You cancelled the payment process</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
								<span>No payment method was saved</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
								<span>Your onboarding progress has been saved</span>
							</li>
							<li className="flex items-start gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
								<span>You can complete payment setup anytime</span>
							</li>
						</ul>
					</div>

					{/* Help Section */}
					<div className="bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
							<div className="text-sm text-left space-y-2">
								<p className="font-medium">Need help?</p>
								<p>
									If you encountered an issue or have questions about pricing,
									our support team is here to help:
								</p>
								<ul className="space-y-1">
									<li>• Email: support@thorbis.app</li>
									<li>• Live chat (bottom right corner)</li>
									<li>• Phone: 1-800-THORBIS</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<Link href="/onboarding?step=payment" className="flex-1">
							<Button size="lg" className="w-full">
								<ArrowLeft className="mr-2 h-5 w-5" />
								Try again
							</Button>
						</Link>
						<Link href="/onboarding" className="flex-1">
							<Button size="lg" variant="outline" className="w-full">
								Return to onboarding
							</Button>
						</Link>
					</div>

					{/* Skip Option */}
					<div className="pt-4 border-t">
						<p className="text-sm text-muted-foreground mb-3">
							Want to explore first before adding payment?
						</p>
						<Link href="/onboarding?step=complete&skip_payment=true">
							<Button variant="ghost" size="sm">
								Continue without payment (limited features)
							</Button>
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
}
