import { AlertCircle, CheckCircle2, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type VerificationStatus = {
	isReady: boolean;
	step: "not_started" | "provisioning" | "pending_10dlc" | "pending_porting" | "ready";
	issues: string[];
	nextAction: string;
	setupUrl: string;
	portingRequests?: Array<{
		id: string;
		phone_number: string;
		status: string;
		estimated_completion?: string;
	}>;
};

async function checkTelnyxVerificationStatus(
	companyId: string,
): Promise<VerificationStatus> {
	const supabase = await createClient();

	// Check Telnyx settings
	const { data: settings } = await supabase
		.from("company_telnyx_settings")
		.select("*")
		.eq("company_id", companyId)
		.single();

	// Check phone numbers
	const { data: phoneNumbers } = await supabase
		.from("phone_numbers")
		.select("*")
		.eq("company_id", companyId)
		.eq("status", "active");

	// Check for pending porting requests
	const { data: portingRequests } = await supabase
		.from("phone_porting_requests")
		.select("id, phone_number, status, estimated_completion")
		.eq("company_id", companyId)
		.in("status", ["pending", "submitted", "in_progress"]);

	const issues: string[] = [];

	// Not started - no settings at all
	if (!settings) {
		return {
			isReady: false,
			step: "not_started",
			issues: ["Telnyx has not been set up for this company"],
			nextAction:
				"Run the automated setup to provision messaging and calling capabilities.",
			setupUrl: "/test-telnyx-setup",
		};
	}

	// Check basic provisioning
	if (!settings.messaging_profile_id) {
		issues.push("Missing messaging profile");
	}
	if (!settings.call_control_application_id) {
		issues.push("Missing call control application");
	}
	if (!phoneNumbers || phoneNumbers.length === 0) {
		issues.push("No phone numbers provisioned");
	}

	if (issues.length > 0) {
		return {
			isReady: false,
			step: "provisioning",
			issues,
			nextAction:
				"Complete basic Telnyx provisioning (messaging profile, call control app, phone numbers).",
			setupUrl: "/test-telnyx-setup",
		};
	}

	// Check for pending porting requests - these take priority
	if (portingRequests && portingRequests.length > 0) {
		return {
			isReady: false,
			step: "pending_porting",
			issues: [
				`${portingRequests.length} phone number(s) being ported`,
				...portingRequests.map((req) => `${req.phone_number} - ${req.status}`),
			],
			nextAction:
				"Phone number porting is in progress. This typically takes 3-7 business days.",
			setupUrl: "/dashboard/settings/phone-numbers",
			portingRequests: portingRequests.map((req) => ({
				id: req.id,
				phone_number: req.phone_number,
				status: req.status,
				estimated_completion: req.estimated_completion || undefined,
			})),
		};
	}

	// Check if ANY verification is complete (toll-free OR 10DLC)
	const hasTollFreeVerification = settings.toll_free_verification_status === "approved";
	const has10DLC = settings.ten_dlc_brand_id && settings.ten_dlc_campaign_id;
	const hasPendingTollFree = settings.toll_free_verification_status === "pending";

	if (!hasTollFreeVerification && !has10DLC) {
		// Check if toll-free verification is pending
		if (hasPendingTollFree) {
			return {
				isReady: false,
				step: "pending_10dlc",
				issues: ["Toll-free verification pending (5-7 business days)"],
				nextAction:
					"Your toll-free verification has been submitted and is pending approval. You'll receive an email when approved.",
				setupUrl: "/dashboard/settings/messaging",
			};
		}

		// Not started at all
		return {
			isReady: false,
			step: "pending_10dlc",
			issues: ["Messaging verification not completed"],
			nextAction:
				"Enable business messaging with automated verification. Uses toll-free numbers for instant setup (5-7 day approval).",
			setupUrl: "/test-telnyx-setup",
		};
	}

	// Everything is ready
	return {
		isReady: true,
		step: "ready",
		issues: [],
		nextAction: "All set! You can send messages and make calls.",
		setupUrl: "/dashboard/communication",
	};
}

type CommunicationVerificationGateProps = {
	companyId: string;
	children: React.ReactNode;
};

export async function CommunicationVerificationGate({
	companyId,
	children,
}: CommunicationVerificationGateProps) {
	const status = await checkTelnyxVerificationStatus(companyId);

	// If ready, render the children (actual communication interface)
	if (status.isReady) {
		return <>{children}</>;
	}

	// Otherwise, show the verification/setup required page
	return (
		<div className="flex items-center justify-center min-h-[600px] p-8">
			<div className="max-w-2xl w-full">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-4">
						{status.step === "not_started" ? (
							<AlertCircle className="w-8 h-8 text-yellow-500" />
						) : status.step === "pending_10dlc" ? (
							<Clock className="w-8 h-8 text-blue-500" />
						) : status.step === "pending_porting" ? (
							<Clock className="w-8 h-8 text-blue-500 animate-pulse" />
						) : (
							<Phone className="w-8 h-8 text-yellow-500" />
						)}
					</div>
					<h1 className="text-3xl font-bold text-foreground mb-2">
						{status.step === "not_started"
							? "Communications Setup Required"
							: status.step === "provisioning"
								? "Setup In Progress"
								: status.step === "pending_porting"
									? "Phone Number Porting In Progress"
									: "Messaging Verification Required"}
					</h1>
					<p className="text-muted-foreground text-lg">{status.nextAction}</p>
				</div>

				{/* Phone Porting Status - Special Display */}
				{status.step === "pending_porting" && status.portingRequests && (
					<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
						<h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
							<Clock className="w-5 h-5 text-blue-500 animate-pulse" />
							Porting Requests In Progress
						</h3>
						<div className="space-y-3">
							{status.portingRequests.map((request) => (
								<div
									key={request.id}
									className="bg-background border border-border rounded-lg p-4"
								>
									<div className="flex items-start justify-between mb-2">
										<div>
											<p className="font-mono text-foreground font-semibold">
												{request.phone_number}
											</p>
											<p className="text-sm text-muted-foreground capitalize">
												Status: {request.status.replace(/_/g, " ")}
											</p>
										</div>
										<div className="flex items-center gap-2 text-xs text-blue-500 font-medium px-3 py-1 bg-blue-500/10 rounded-full">
											<Clock className="w-3 h-3 animate-pulse" />
											In Progress
										</div>
									</div>
									{request.estimated_completion && (
										<p className="text-xs text-muted-foreground mt-2">
											Estimated completion:{" "}
											{new Date(request.estimated_completion).toLocaleDateString()}
										</p>
									)}
								</div>
							))}
						</div>
						<div className="mt-4 p-3 bg-muted/50 rounded-lg">
							<p className="text-sm text-muted-foreground">
								<strong className="text-foreground">Note:</strong> Phone number
								porting typically takes 3-7 business days. You'll receive email
								notifications when the process completes. Communications will be
								available once all numbers are successfully ported.
							</p>
						</div>
					</div>
				)}

				{/* Other Issues */}
				{status.issues.length > 0 && status.step !== "pending_porting" && (
					<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
						<h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
							<AlertCircle className="w-5 h-5 text-yellow-500" />
							Setup Requirements
						</h3>
						<ul className="space-y-2">
							{status.issues.map((issue, i) => (
								<li
									key={i}
									className="text-sm text-muted-foreground flex items-start gap-2"
								>
									<span className="text-yellow-500 mt-0.5">•</span>
									<span>{issue}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="bg-muted/50 border border-border rounded-lg p-6 mb-6">
					<h3 className="font-semibold text-foreground mb-4">
						What You'll Get
					</h3>
					<div className="grid gap-3">
						<div className="flex items-start gap-3">
							<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
							<div>
								<p className="font-medium text-foreground">SMS Messaging</p>
								<p className="text-sm text-muted-foreground">
									Send and receive text messages with customers
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
							<div>
								<p className="font-medium text-foreground">Voice Calls</p>
								<p className="text-sm text-muted-foreground">
									Make and receive phone calls with call recording
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
							<div>
								<p className="font-medium text-foreground">
									Delivery Tracking
								</p>
								<p className="text-sm text-muted-foreground">
									Real-time status updates for all messages
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
							<div>
								<p className="font-medium text-foreground">Carrier Compliance</p>
								<p className="text-sm text-muted-foreground">
									Verified messaging for reliable delivery (toll-free or 10DLC)
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					{status.step === "pending_porting" ? (
						<div className="block w-full px-6 py-4 bg-muted border border-border rounded-lg font-semibold text-center cursor-not-allowed">
							<div className="flex items-center justify-center gap-2 text-muted-foreground">
								<Clock className="w-5 h-5 animate-pulse" />
								<span>Waiting for Porting to Complete</span>
							</div>
						</div>
					) : (
						<Link
							href={status.setupUrl}
							className="block w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all text-center"
						>
							{status.step === "not_started"
								? "🚀 Start Automated Setup"
								: status.step === "pending_10dlc"
									? "📱 Enable Business Messaging"
									: "⚙️ Continue Setup"}
						</Link>
					)}

					<p className="text-center text-sm text-muted-foreground">
						{status.step === "pending_porting"
							? "Porting typically takes 3-7 business days"
							: "Setup takes 1-2 minutes • Fully automated • No manual steps"}
					</p>
				</div>

				<div className="mt-8 pt-6 border-t border-border">
					<details className="group">
						<summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							How does business messaging verification work?
						</summary>
						<div className="mt-3 text-sm text-muted-foreground space-y-2">
							<p>
								<strong className="text-foreground">
									Business messaging verification
								</strong>{" "}
								is required by US carriers for text messaging. We use toll-free
								numbers by default, which provide instant setup with 5-7 day
								approval.
							</p>
							<p>
								The verification process confirms your business identity with
								carriers and ensures your messages are delivered reliably to
								customers.
							</p>
							<p>
								Our automated setup handles everything: verification submission,
								carrier approval tracking, and email notifications when complete.
								No manual steps or external portals required.
							</p>
						</div>
					</details>
				</div>
			</div>
		</div>
	);
}
