"use client";

import { CheckCircle2, Clock, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { submitAutomatedVerification } from "@/actions/ten-dlc-registration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

export default function Test10DLCRegister() {
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleRegister = async () => {
		setLoading(true);
		setResult(null);

		try {
			const res = await submitAutomatedVerification(TEST_COMPANY_ID);
			setResult(res);
		} catch (error: any) {
			setResult({ success: false, error: error.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen overflow-y-auto bg-background p-8">
			<div className="mx-auto max-w-4xl space-y-8">
				{/* Header */}
				<div>
					<h1 className="mb-2 text-4xl font-bold">
						10DLC & Toll-Free Registration
					</h1>
					<p className="text-muted-foreground">
						Automated verification setup for business messaging
					</p>
				</div>

				{/* What is 10DLC */}
				<Card>
					<CardHeader>
						<CardTitle>What is 10DLC and why do I need it?</CardTitle>
						<CardDescription>
							Required by US carriers for Application-to-Person messaging
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3 text-sm">
							<p>
								<strong className="text-foreground">
									10-Digit Long Code (10DLC)
								</strong>{" "}
								is required by US carriers for Application-to-Person (A2P)
								messaging. Without 10DLC registration, your SMS messages will be
								blocked or filtered by carriers.
							</p>

							<div className="my-4 space-y-2">
								<p className="font-medium">This automated process will:</p>
								<ul className="ml-6 space-y-2 list-disc">
									<li>
										<strong>For Regular Numbers (10DLC):</strong>
										<ul className="ml-6 mt-1 space-y-1 list-circle">
											<li>Create a verified brand with The Campaign Registry</li>
											<li>Create a messaging campaign</li>
											<li>Attach all your phone numbers to the campaign</li>
											<li>
												<strong className="text-green-600">
													Enable SMS immediately (instant approval)
												</strong>
											</li>
										</ul>
									</li>
									<li>
										<strong>For Toll-Free Numbers:</strong>
										<ul className="ml-6 mt-1 space-y-1 list-circle">
											<li>Submit toll-free verification request</li>
											<li>Provide business and use case information</li>
											<li>
												<strong className="text-amber-600">
													Wait 5-7 business days for approval
												</strong>
											</li>
											<li>Enable SMS after verification completes</li>
										</ul>
									</li>
								</ul>
							</div>
						</div>

						{/* Timeline Comparison */}
						<div className="grid gap-4 md:grid-cols-2">
							<div className="rounded-lg border border-green-500/20 bg-green-50 p-4 dark:bg-green-950">
								<div className="mb-2 flex items-center gap-2">
									<CheckCircle2 className="size-5 text-green-600" />
									<span className="font-semibold text-green-600">
										10DLC (Regular Numbers)
									</span>
								</div>
								<p className="text-sm text-green-600">
									Instant approval - Send SMS immediately after registration
								</p>
							</div>

							<div className="rounded-lg border border-amber-500/20 bg-amber-50 p-4 dark:bg-amber-950">
								<div className="mb-2 flex items-center gap-2">
									<Clock className="size-5 text-amber-600" />
									<span className="font-semibold text-amber-600">
										Toll-Free Numbers
									</span>
								</div>
								<p className="text-sm text-amber-600">
									5-7 business days - Manual compliance review required
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Register Button */}
				<Button
					onClick={handleRegister}
					disabled={loading}
					size="lg"
					className="w-full text-lg"
				>
					{loading ? (
						<>
							<Clock className="mr-2 size-5 animate-spin" />
							Registering...
						</>
					) : (
						<>
							<MessageSquare className="mr-2 size-5" />
							Complete Automated Registration
						</>
					)}
				</Button>

				{/* Result */}
				{result && (
					<Card
						className={
							result.success
								? "border-green-500 bg-green-50 dark:bg-green-950"
								: "border-red-500 bg-red-50 dark:bg-red-950"
						}
					>
						<CardHeader>
							<CardTitle className={result.success ? "text-green-600" : "text-red-600"}>
								{result.success ? "✅ Registration Successful" : "❌ Registration Failed"}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{result.error && (
								<Alert variant="destructive">
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										<pre className="mt-2 overflow-auto text-sm">
											{result.error}
										</pre>
									</AlertDescription>
								</Alert>
							)}

							{result.message && (
								<Alert className="border-green-500 bg-green-50 dark:bg-green-950">
									<CheckCircle2 className="size-4 text-green-600" />
									<AlertDescription className="text-green-600">
										{result.message}
									</AlertDescription>
								</Alert>
							)}

							{result.tollFreeRequestId && (
								<div className="rounded-lg border bg-background p-4">
									<h3 className="mb-2 font-semibold">
										Toll-Free Verification Request ID:
									</h3>
									<p className="font-mono text-sm">{result.tollFreeRequestId}</p>
									<p className="text-muted-foreground mt-2 text-sm">
										Approval typically takes 5-7 business days
									</p>
								</div>
							)}

							{result.brandId && (
								<div className="rounded-lg border bg-background p-4">
									<h3 className="mb-2 font-semibold">10DLC Brand ID:</h3>
									<p className="font-mono text-sm">{result.brandId}</p>
								</div>
							)}

							{result.campaignId && (
								<div className="rounded-lg border bg-background p-4">
									<h3 className="mb-2 font-semibold">10DLC Campaign ID:</h3>
									<p className="font-mono text-sm">{result.campaignId}</p>
									<Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950">
										<CheckCircle2 className="size-4 text-green-600" />
										<AlertDescription className="text-green-600">
											<strong>10DLC SMS enabled immediately!</strong> You can now
											send text messages from your regular phone numbers.
										</AlertDescription>
									</Alert>
								</div>
							)}

							<details className="group">
								<summary className="cursor-pointer font-semibold transition-colors hover:text-primary">
									Full Response JSON
								</summary>
								<pre className="mt-3 max-h-96 overflow-auto rounded-lg border bg-background p-4 text-xs">
									{JSON.stringify(result, null, 2)}
								</pre>
							</details>
						</CardContent>
					</Card>
				)}

				{/* What You'll Get */}
				<Card>
					<CardHeader>
						<CardTitle>What You'll Get After Registration</CardTitle>
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
									<p className="font-medium">Delivery Tracking</p>
									<p className="text-muted-foreground text-sm">
										Real-time status updates for all messages
									</p>
								</div>
							</div>
							<div className="flex gap-3">
								<CheckCircle2 className="text-primary size-5 shrink-0" />
								<div>
									<p className="font-medium">10DLC Compliance</p>
									<p className="text-muted-foreground text-sm">
										Carrier-approved messaging for reliable delivery
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Next Steps */}
				<Card className="border-blue-500/20 bg-blue-50 dark:bg-blue-950">
					<CardHeader>
						<CardTitle className="text-blue-600">Next Steps</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm text-blue-600">
							<li className="flex items-start gap-2">
								<CheckCircle2 className="mt-0.5 size-4 shrink-0" />
								<span>
									<strong>For 10DLC (Regular Numbers):</strong> SMS is enabled
									immediately! Test sending at{" "}
									<Link
										href="/test-telnyx-send"
										className="font-semibold underline hover:text-blue-800"
									>
										/test-telnyx-send
									</Link>
								</span>
							</li>
							<li className="flex items-start gap-2">
								<Clock className="mt-0.5 size-4 shrink-0" />
								<span>
									<strong>For Toll-Free Numbers:</strong> Wait 5-7 business days
									for verification approval. You'll be notified when SMS is
									enabled.
								</span>
							</li>
							<li className="flex items-start gap-2">
								<CheckCircle2 className="mt-0.5 size-4 shrink-0" />
								<span>
									Once approved, all phone numbers will be automatically enabled
									for SMS/MMS messaging
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Info Note */}
				<Alert>
					<MessageSquare className="size-4" />
					<AlertTitle>Automated During Onboarding</AlertTitle>
					<AlertDescription>
						<p className="mt-2">
							This registration process now happens <strong>automatically</strong> during
							onboarding (Step 4). Users submit verification with one click using
							their company information from Step 1.
						</p>
						<p className="mt-2">
							This test page is for debugging and manual registration only.
						</p>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}
