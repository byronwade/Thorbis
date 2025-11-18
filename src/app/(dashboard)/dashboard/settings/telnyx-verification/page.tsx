import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { TelnyxVerificationStatus } from "@/components/settings/telnyx-verification-status";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Telnyx Verification",
	description: "Verify your Telnyx account for 10DLC messaging",
};

export default function TelnyxVerificationPage() {
	return (
		<div className="container mx-auto max-w-5xl space-y-8 p-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold">Telnyx Account Verification</h1>
				<p className="text-muted-foreground mt-2">
					Complete account verification to enable 10DLC business messaging
				</p>
			</div>

			{/* Important Notice */}
			<Alert>
				<HelpCircle className="size-4" />
				<AlertTitle>Why Verification is Required</AlertTitle>
				<AlertDescription>
					The TRACED Act (federal law) requires all businesses sending
					Application-to-Person (A2P) text messages to complete identity and
					business verification. This prevents spam and ensures message
					deliverability.
				</AlertDescription>
			</Alert>

			{/* Real-time Verification Status */}
			<TelnyxVerificationStatus />

			{/* FAQ Section */}
			<Card>
				<CardHeader>
					<CardTitle>Frequently Asked Questions</CardTitle>
					<CardDescription>
						Common questions about the verification process
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="why-cant-automate">
							<AccordionTrigger>
								Why can't verification be automated?
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-2 text-sm">
									<p>
										The TRACED Act is a federal law designed to combat robocalls
										and SMS spam. It requires:
									</p>
									<ul className="ml-6 list-disc space-y-1">
										<li>Manual identity verification by a human reviewer</li>
										<li>
											Document validation by compliance teams (not AI/automation)
										</li>
										<li>Business ownership proof through official documents</li>
										<li>
											Anti-fraud measures that prevent automated approvals
										</li>
									</ul>
									<p className="mt-2">
										Telnyx and The Campaign Registry must comply with these
										regulations, making manual review mandatory.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="how-long">
							<AccordionTrigger>How long does verification take?</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-2 text-sm">
									<p>
										<strong>Level 1 (Identity):</strong> 1-2 business days after
										document submission
									</p>
									<p>
										<strong>Level 2 (Business):</strong> 2-5 business days after
										document submission
									</p>
									<p className="mt-2">
										Total time from start to completion: Typically 3-7 business
										days if all documents are submitted correctly on the first
										try.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="what-documents">
							<AccordionTrigger>
								What documents do I need to provide?
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-3 text-sm">
									<div>
										<p className="font-medium">Level 1 (Identity):</p>
										<ul className="ml-6 list-disc space-y-1">
											<li>Government-issued photo ID</li>
											<li>Payment method (credit card or bank account)</li>
											<li>Phone number and email verification</li>
										</ul>
									</div>
									<div>
										<p className="font-medium">Level 2 (Business):</p>
										<ul className="ml-6 list-disc space-y-1">
											<li>
												IRS EIN Confirmation Letter (CP 575 or 147C form)
											</li>
											<li>
												Business license or Articles of Incorporation
											</li>
											<li>
												Proof of business address (utility bill, lease)
											</li>
											<li>Tax documents (W-9 or business tax return)</li>
										</ul>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="what-after-verified">
							<AccordionTrigger>
								What happens after I'm verified?
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-2 text-sm">
									<p>
										Once Level 2 verification is complete, you can run the
										automated setup which will:
									</p>
									<ol className="ml-6 list-decimal space-y-1">
										<li>Create your 10DLC brand (instant)</li>
										<li>Submit brand for Campaign Registry approval (instant)</li>
										<li>Create messaging campaign (instant)</li>
										<li>Attach your phone numbers (instant)</li>
										<li>Enable business SMS sending (immediate)</li>
									</ol>
									<p className="mt-2">
										Everything after verification is fully automated and takes
										less than 1 minute.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="verification-failed">
							<AccordionTrigger>
								What if my verification is rejected?
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-2 text-sm">
									<p>
										If your verification is rejected, Telnyx will email you with
										specific reasons, such as:
									</p>
									<ul className="ml-6 list-disc space-y-1">
										<li>
											Document quality issues (blurry, cropped, or incomplete)
										</li>
										<li>Information mismatch (name on ID vs. account)</li>
										<li>Missing required documents</li>
										<li>Expired documents</li>
									</ul>
									<p className="mt-2">
										Simply address the issues mentioned and resubmit through the
										Telnyx Portal. Most rejections are quickly resolved by
										uploading clearer documents.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="cost">
							<AccordionTrigger>
								Does verification cost anything?
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-2 text-sm">
									<p>
										<strong>Verification:</strong> Free (no cost for account
										verification)
									</p>
									<p>
										<strong>10DLC Brand Registration:</strong> One-time fee of
										~$4 (paid to The Campaign Registry)
									</p>
									<p>
										<strong>10DLC Campaign:</strong> Monthly fee of ~$10 (paid
										to The Campaign Registry)
									</p>
									<p className="mt-2">
										These fees are industry-standard and required by The
										Campaign Registry, not Telnyx or this platform.
									</p>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			{/* Additional Resources */}
			<Card>
				<CardHeader>
					<CardTitle>Additional Resources</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3 text-sm">
						<div>
							<a
								href="https://telnyx.com/resources/10dlc-guide"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Telnyx 10DLC Complete Guide
							</a>
							<p className="text-muted-foreground">
								Comprehensive guide to 10DLC registration and best practices
							</p>
						</div>
						<div>
							<a
								href="https://www.campaignregistry.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								The Campaign Registry
							</a>
							<p className="text-muted-foreground">
								Official industry database for 10DLC brands and campaigns
							</p>
						</div>
						<div>
							<a
								href="https://support.telnyx.com/en/articles/4673990-telnyx-10dlc-registration-guide"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Telnyx Support: Account Verification
							</a>
							<p className="text-muted-foreground">
								Step-by-step guide for completing verification in the portal
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
