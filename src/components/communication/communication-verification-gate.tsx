import { AlertCircle, CheckCircle2, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type VerificationStatus = {
	isReady: boolean;
	step:
		| "not_started"
		| "provisioning"
		| "pending_10dlc"
		| "pending_porting"
		| "ready";
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

	// IMPORTANT: Voice calling works without SMS verification
	// Only SMS requires toll-free/10DLC verification
	// Allow access if basic provisioning is complete

	// Everything is ready (basic provisioning complete)
	// SMS verification is optional - users can still make calls
	return {
		isReady: true,
		step: "ready",
		issues: [],
		nextAction: "All set! You can make calls. SMS requires verification.",
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
		<div className="flex min-h-[600px] items-center justify-center p-8">
			<div className="w-full max-w-2xl">
				<div className="mb-8 text-center">
					<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
						{status.step === "not_started" ? (
							<AlertCircle className="h-8 w-8 text-yellow-500" />
						) : status.step === "pending_10dlc" ? (
							<Clock className="h-8 w-8 text-blue-500" />
						) : status.step === "pending_porting" ? (
							<Clock className="h-8 w-8 animate-pulse text-blue-500" />
						) : (
							<Phone className="h-8 w-8 text-yellow-500" />
						)}
					</div>
					<h1 className="text-foreground mb-2 text-3xl font-bold">
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
					<div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-6">
						<h3 className="text-foreground mb-3 flex items-center gap-2 font-semibold">
							<Clock className="h-5 w-5 animate-pulse text-blue-500" />
							Porting Requests In Progress
						</h3>
						<div className="space-y-3">
							{status.portingRequests.map((request) => (
								<div
									key={request.id}
									className="bg-background border-border rounded-lg border p-4"
								>
									<div className="mb-2 flex items-start justify-between">
										<div>
											<p className="text-foreground font-mono font-semibold">
												{request.phone_number}
											</p>
											<p className="text-muted-foreground text-sm capitalize">
												Status: {request.status.replace(/_/g, " ")}
											</p>
										</div>
										<div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">
											<Clock className="h-3 w-3 animate-pulse" />
											In Progress
										</div>
									</div>
									{request.estimated_completion && (
										<p className="text-muted-foreground mt-2 text-xs">
											Estimated completion:{" "}
											{new Date(
												request.estimated_completion,
											).toLocaleDateString()}
										</p>
									)}
								</div>
							))}
						</div>
						<div className="bg-muted/50 mt-4 rounded-lg p-3">
							<p className="text-muted-foreground text-sm">
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
					<div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-6">
						<h3 className="text-foreground mb-3 flex items-center gap-2 font-semibold">
							<AlertCircle className="h-5 w-5 text-yellow-500" />
							Setup Requirements
						</h3>
						<ul className="space-y-2">
							{status.issues.map((issue, i) => (
								<li
									key={i}
									className="text-muted-foreground flex items-start gap-2 text-sm"
								>
									<span className="mt-0.5 text-yellow-500">•</span>
									<span>{issue}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="bg-muted/50 border-border mb-6 rounded-lg border p-6">
					<h3 className="text-foreground mb-4 font-semibold">
						What You'll Get
					</h3>
					<div className="grid gap-3">
						<div className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
							<div>
								<p className="text-foreground font-medium">SMS Messaging</p>
								<p className="text-muted-foreground text-sm">
									Send and receive text messages with customers
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
							<div>
								<p className="text-foreground font-medium">Voice Calls</p>
								<p className="text-muted-foreground text-sm">
									Make and receive phone calls with call recording
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
							<div>
								<p className="text-foreground font-medium">Delivery Tracking</p>
								<p className="text-muted-foreground text-sm">
									Real-time status updates for all messages
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
							<div>
								<p className="text-foreground font-medium">
									Carrier Compliance
								</p>
								<p className="text-muted-foreground text-sm">
									Verified messaging for reliable delivery (toll-free or 10DLC)
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					{status.step === "pending_porting" ? (
						<div className="bg-muted border-border block w-full cursor-not-allowed rounded-lg border px-6 py-4 text-center font-semibold">
							<div className="text-muted-foreground flex items-center justify-center gap-2">
								<Clock className="h-5 w-5 animate-pulse" />
								<span>Waiting for Porting to Complete</span>
							</div>
						</div>
					) : (
						<Link
							href={status.setupUrl}
							className="bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-lg px-6 py-4 text-center font-semibold transition-all"
						>
							{status.step === "not_started"
								? "🚀 Start Automated Setup"
								: status.step === "pending_10dlc"
									? "📱 Enable Business Messaging"
									: "⚙️ Continue Setup"}
						</Link>
					)}

					<p className="text-muted-foreground text-center text-sm">
						{status.step === "pending_porting"
							? "Porting typically takes 3-7 business days"
							: "Setup takes 1-2 minutes • Fully automated • No manual steps"}
					</p>
				</div>

				<div className="border-border mt-8 border-t pt-6">
					<details className="group">
						<summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors">
							How does business messaging verification work?
						</summary>
						<div className="text-muted-foreground mt-3 space-y-2 text-sm">
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
								carrier approval tracking, and email notifications when
								complete. No manual steps or external portals required.
							</p>
						</div>
					</details>
				</div>
			</div>
		</div>
	);
}
