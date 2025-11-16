/**
 * Payment Success Page
 *
 * Shows confirmation after successful payment
 */

import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Payment Successful - Thorbis",
	description: "Your payment has been processed successfully",
};

type PageProps = {
	params: Promise<{
		invoiceId: string;
	}>;
};

export default async function PaymentSuccessPage({ params }: PageProps) {
	const { invoiceId } = await params;

	return (
		<div className="min-h-screen bg-gray-50 py-16">
			<div className="container mx-auto max-w-2xl px-4">
				<Card className="border-green-200 bg-green-50">
					<CardHeader>
						<div className="flex flex-col items-center gap-4 text-center">
							<div className="rounded-full bg-green-100 p-3">
								<CheckCircle className="h-12 w-12 text-green-600" />
							</div>
							<div>
								<CardTitle className="text-2xl text-green-900">Payment Successful!</CardTitle>
								<CardDescription className="mt-2 text-green-700">
									Your payment has been processed successfully.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<p className="text-green-800 text-sm">
							You will receive a confirmation email shortly with the payment details.
						</p>
						<p className="text-green-800 text-sm">Thank you for your business!</p>
						<div className="pt-4">
							<Button asChild className="bg-white" variant="outline">
								<Link href="/">Return to Home</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
