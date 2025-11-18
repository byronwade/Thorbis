"use client";

import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Loader2,
	MessageSquare,
	Phone,
} from "lucide-react";
import { useState } from "react";
import { submitAutomatedVerification } from "@/actions/ten-dlc-registration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Props = {
	companyId: string;
	onSkip?: () => void;
	onComplete?: () => void;
};

export function TelnyxVerificationStep({
	companyId,
	onSkip,
	onComplete,
}: Props) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = async () => {
		setSubmitting(true);
		setError(null);

		try {
			const result = await submitAutomatedVerification(companyId);

			if (result.success) {
				setSuccess(true);
				setMessage(result.message || "Verification submitted successfully!");

				// Auto-complete after showing success message
				setTimeout(() => {
					if (onComplete) {
						onComplete();
					}
				}, 2000);
			} else {
				setError(result.error || "Failed to submit verification");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to submit verification",
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (success) {
		return (
			<Alert className="border-green-500 bg-green-50 dark:bg-green-950">
				<CheckCircle2 className="size-4 text-green-600" />
				<AlertTitle className="text-green-600">
					Verification Submitted Successfully!
				</AlertTitle>
				<AlertDescription className="text-green-600">
					<p className="mt-2">{message}</p>
					<p className="mt-2 text-sm">
						SMS messaging will be automatically enabled once the verification is
						approved. You can proceed with the rest of your setup.
					</p>
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Information Alert */}
			<Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
				<MessageSquare className="size-4 text-blue-600" />
				<AlertTitle className="text-blue-600">
					Enable Business Messaging
				</AlertTitle>
				<AlertDescription className="text-blue-600">
					<p className="mt-2">
						Federal law requires verification before you can send business text
						messages. We'll automatically submit your verification using the
						information you provided in Step 1.
					</p>
				</AlertDescription>
			</Alert>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Verification Error</AlertTitle>
					<AlertDescription className="mt-2">
						<p>{error}</p>
						<p className="mt-2 text-sm">
							Please ensure you completed all required fields in Step 1
							(Company Information), including your Tax ID (EIN) and full
							address.
						</p>
					</AlertDescription>
				</Alert>
			)}

			{/* Main Content */}
			<Card>
				<CardHeader>
					<CardTitle>Automated Verification</CardTitle>
					<CardDescription>
						We'll submit your business information to our messaging provider for
						compliance verification
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* What Happens */}
						<div className="space-y-3">
							<h4 className="font-medium">What Happens Next:</h4>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="flex gap-3 rounded-lg border p-4">
									<Clock className="text-primary size-5 shrink-0" />
									<div>
										<p className="font-medium">Automatic Submission</p>
										<p className="text-muted-foreground text-sm">
											We'll use your company information from Step 1 to submit
											verification
										</p>
									</div>
								</div>
								<div className="flex gap-3 rounded-lg border p-4">
									<CheckCircle2 className="text-primary size-5 shrink-0" />
									<div>
										<p className="font-medium">5-7 Day Approval</p>
										<p className="text-muted-foreground text-sm">
											Verification typically completes within 5-7 business days
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Timeline */}
						<Alert>
							<Clock className="size-4" />
							<AlertTitle>Verification Timeline</AlertTitle>
							<AlertDescription>
								<p className="mt-2">
									<strong>
										Toll-free numbers: 5 business days or less
									</strong>
								</p>
								<p className="mt-2">
									<strong>Regular (10DLC) numbers: Instant approval</strong>
								</p>
								<p className="mt-2 text-sm">
									You cannot send text messages until verification is complete.
									This is a federal requirement enforced by The Campaign
									Registry.
								</p>
							</AlertDescription>
						</Alert>

						{/* Features Available After Verification */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">
									What You'll Get After Verification
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="flex gap-3">
										<MessageSquare className="text-primary size-5 shrink-0" />
										<div>
											<p className="font-medium">Business SMS/MMS</p>
											<p className="text-muted-foreground text-sm">
												Send text messages to customers with media attachments
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<Phone className="text-primary size-5 shrink-0" />
										<div>
											<p className="font-medium">Voice Calls</p>
											<p className="text-muted-foreground text-sm">
												Make and receive business phone calls
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<CheckCircle2 className="text-primary size-5 shrink-0" />
										<div>
											<p className="font-medium">Read Receipts (RCS)</p>
											<p className="text-muted-foreground text-sm">
												See when customers read your messages
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<MessageSquare className="text-primary size-5 shrink-0" />
										<div>
											<p className="font-medium">Two-Way Messaging</p>
											<p className="text-muted-foreground text-sm">
												Receive and respond to customer texts
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Submit Button */}
						<div className="flex flex-col gap-4">
							<Button
								onClick={handleSubmit}
								disabled={submitting}
								size="lg"
								className="w-full"
							>
								{submitting ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Submitting Verification...
									</>
								) : (
									<>
										<CheckCircle2 className="mr-2 size-4" />
										Submit Verification
									</>
								)}
							</Button>

							{/* Skip Option */}
							{onSkip && (
								<div className="border-t pt-4">
									<p className="text-muted-foreground mb-2 text-sm">
										<strong>Note:</strong> You can submit verification later,
										but you won't be able to send text messages until it's
										done.
									</p>
									<Button
										onClick={onSkip}
										variant="outline"
										size="sm"
										disabled={submitting}
									>
										Skip for Now (I'll Submit This Later)
									</Button>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
