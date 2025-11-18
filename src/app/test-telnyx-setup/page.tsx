"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { registerCompanyFor10DLC } from "@/actions/ten-dlc-registration";

const TEST_COMPANY_ID = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

type SetupStep = {
	id: string;
	name: string;
	status: "pending" | "running" | "success" | "error";
	message?: string;
	details?: string[];
};

export default function TestTelnyxSetup() {
	const [steps, setSteps] = useState<SetupStep[]>([
		{
			id: "company-data",
			name: "Validate Company Data",
			status: "pending",
		},
		{
			id: "telnyx-settings",
			name: "Check Telnyx Settings",
			status: "pending",
		},
		{
			id: "phone-numbers",
			name: "Verify Phone Numbers",
			status: "pending",
		},
		{
			id: "10dlc-brand",
			name: "Register 10DLC Brand",
			status: "pending",
		},
		{
			id: "10dlc-campaign",
			name: "Create 10DLC Campaign",
			status: "pending",
		},
		{
			id: "attach-numbers",
			name: "Attach Numbers to Campaign",
			status: "pending",
		},
		{
			id: "test-sms",
			name: "Send Test SMS",
			status: "pending",
		},
	]);

	const [isRunning, setIsRunning] = useState(false);
	const [finalResult, setFinalResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const updateStep = (
		id: string,
		updates: Partial<SetupStep>,
	) => {
		setSteps((prev) =>
			prev.map((step) =>
				step.id === id ? { ...step, ...updates } : step,
			),
		);
	};

	const runFullSetup = async () => {
		setIsRunning(true);
		setFinalResult(null);

		try {
			// Step 1: Validate Company Data
			updateStep("company-data", { status: "running" });
			const companyResponse = await fetch(
				`/api/telnyx/validate-company?companyId=${TEST_COMPANY_ID}`,
			);
			const companyData = await companyResponse.json();

			if (!companyData.valid) {
				updateStep("company-data", {
					status: "error",
					message: companyData.error || "Company validation failed",
					details: companyData.missing,
				});
				throw new Error(companyData.error || "Company validation failed");
			}

			updateStep("company-data", {
				status: "success",
				message: "Company data is complete",
				details: [
					`Name: ${companyData.company.name}`,
					`EIN: ${companyData.company.ein}`,
					`Phone: ${companyData.company.primary_contact_phone}`,
				],
			});

			// Step 2: Check Telnyx Settings
			updateStep("telnyx-settings", { status: "running" });
			const settingsResponse = await fetch(
				`/api/telnyx/check-settings?companyId=${TEST_COMPANY_ID}`,
			);
			const settingsData = await settingsResponse.json();

			if (!settingsData.ready) {
				updateStep("telnyx-settings", {
					status: "error",
					message: "Telnyx settings not configured",
					details: settingsData.issues,
				});
				throw new Error("Telnyx settings not ready");
			}

			updateStep("telnyx-settings", {
				status: "success",
				message: "Telnyx settings configured",
				details: [
					`Messaging Profile: ${settingsData.messagingProfileId}`,
					`Call Control App: ${settingsData.callControlAppId}`,
				],
			});

			// Step 3: Verify Phone Numbers
			updateStep("phone-numbers", { status: "running" });
			const phonesResponse = await fetch(
				`/api/telnyx/check-phones?companyId=${TEST_COMPANY_ID}`,
			);
			const phonesData = await phonesResponse.json();

			if (!phonesData.hasPhones) {
				updateStep("phone-numbers", {
					status: "error",
					message: "No phone numbers found",
					details: ["Company needs at least one phone number"],
				});
				throw new Error("No phone numbers found");
			}

			updateStep("phone-numbers", {
				status: "success",
				message: `Found ${phonesData.count} phone number(s)`,
				details: phonesData.numbers.map(
					(n: any) => `${n.phone_number} (${n.status})`,
				),
			});

			// Steps 4-6: 10DLC Registration (combined)
			updateStep("10dlc-brand", { status: "running" });
			updateStep("10dlc-campaign", { status: "running" });
			updateStep("attach-numbers", { status: "running" });

			const registrationResult = await registerCompanyFor10DLC(TEST_COMPANY_ID);

			if (!registrationResult.success) {
				updateStep("10dlc-brand", {
					status: "error",
					message: registrationResult.error || "Registration failed",
					details: registrationResult.log,
				});
				updateStep("10dlc-campaign", { status: "error" });
				updateStep("attach-numbers", { status: "error" });

				// Check if it's just pending approval
				if (
					registrationResult.error?.includes("pending") ||
					registrationResult.error?.includes("approval")
				) {
					setFinalResult({
						success: false,
						message:
							"10DLC registration submitted but awaiting approval. This typically takes 1-5 minutes. Please run setup again in a few minutes.",
					});
				} else {
					throw new Error(
						registrationResult.error || "10DLC registration failed",
					);
				}
			} else {
				updateStep("10dlc-brand", {
					status: "success",
					message: "Brand registered and approved",
					details: [`Brand ID: ${registrationResult.brandId}`],
				});
				updateStep("10dlc-campaign", {
					status: "success",
					message: "Campaign created and approved",
					details: [`Campaign ID: ${registrationResult.campaignId}`],
				});
				updateStep("attach-numbers", {
					status: "success",
					message: "Phone numbers attached to campaign",
					details: registrationResult.log.filter((log) =>
						log.includes("Attached"),
					),
				});

				// Step 7: Send Test SMS
				updateStep("test-sms", { status: "running" });

				const testResponse = await fetch("/api/telnyx/send-test-sms", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						companyId: TEST_COMPANY_ID,
						to: companyData.company.primary_contact_phone,
						message: "✅ Telnyx setup complete! Your messaging is now fully configured.",
					}),
				});

				const testResult = await testResponse.json();

				if (testResult.success) {
					updateStep("test-sms", {
						status: "success",
						message: "Test SMS sent successfully",
						details: [
							`Message ID: ${testResult.messageId}`,
							`Sent to: ${companyData.company.primary_contact_phone}`,
						],
					});

					setFinalResult({
						success: true,
						message:
							"🎉 Complete! Your Test Plumbing Company is fully configured for SMS and calls. Check your phone for the test message!",
					});
				} else {
					updateStep("test-sms", {
						status: "error",
						message: testResult.error || "Test SMS failed",
					});

					setFinalResult({
						success: false,
						message:
							"Setup complete but test SMS failed. Try sending manually at /test-telnyx-send",
					});
				}
			}
		} catch (error: any) {
			console.error("Setup error:", error);
			setFinalResult({
				success: false,
				message: error.message || "Setup failed. See steps above for details.",
			});
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-2 text-foreground">
					Automated Telnyx Setup
				</h1>
				<p className="text-muted-foreground mb-8">
					One-click setup for Test Plumbing Company - Configures everything needed for SMS and calls
				</p>

				<div className="bg-muted/50 p-6 rounded-lg border border-border mb-8">
					<h2 className="font-semibold mb-3 text-foreground text-lg">
						What This Does
					</h2>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li className="flex items-start gap-2">
							<span className="text-primary">1.</span>
							<span>Validates your company data (EIN, address, contact info)</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">2.</span>
							<span>Checks Telnyx messaging profile and call control app</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">3.</span>
							<span>Verifies phone numbers are active</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">4.</span>
							<span>Registers your brand with The Campaign Registry (10DLC)</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">5.</span>
							<span>Creates and approves messaging campaign</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">6.</span>
							<span>Attaches all phone numbers to the campaign</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">7.</span>
							<span>Sends a test SMS to verify everything works</span>
						</li>
					</ul>
				</div>

				<button
					onClick={runFullSetup}
					disabled={isRunning}
					className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg mb-8"
				>
					{isRunning ? (
						<span className="flex items-center justify-center gap-2">
							<Loader2 className="size-5 animate-spin" />
							Setting up...
						</span>
					) : (
						"🚀 Run Full Setup"
					)}
				</button>

				{/* Setup Steps */}
				<div className="space-y-3 mb-8">
					{steps.map((step) => (
						<div
							key={step.id}
							className={`p-4 rounded-lg border transition-all ${
								step.status === "success"
									? "bg-green-500/5 border-green-500/20"
									: step.status === "error"
										? "bg-red-500/5 border-red-500/20"
										: step.status === "running"
											? "bg-blue-500/5 border-blue-500/20"
											: "bg-muted/50 border-border"
							}`}
						>
							<div className="flex items-start gap-3">
								<div className="mt-0.5">
									{step.status === "success" && (
										<CheckCircle2 className="size-5 text-green-500" />
									)}
									{step.status === "error" && (
										<XCircle className="size-5 text-red-500" />
									)}
									{step.status === "running" && (
										<Loader2 className="size-5 text-blue-500 animate-spin" />
									)}
									{step.status === "pending" && (
										<div className="size-5 rounded-full border-2 border-muted-foreground/30" />
									)}
								</div>

								<div className="flex-1">
									<h3 className="font-semibold text-foreground">
										{step.name}
									</h3>
									{step.message && (
										<p
											className={`text-sm mt-1 ${
												step.status === "error"
													? "text-red-500"
													: "text-muted-foreground"
											}`}
										>
											{step.message}
										</p>
									)}
									{step.details && step.details.length > 0 && (
										<ul className="mt-2 space-y-1">
											{step.details.map((detail, i) => (
												<li
													key={i}
													className="text-xs text-muted-foreground font-mono"
												>
													• {detail}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Final Result */}
				{finalResult && (
					<div
						className={`p-6 border-2 rounded-lg ${
							finalResult.success
								? "bg-green-500/10 border-green-500"
								: "bg-yellow-500/10 border-yellow-500"
						}`}
					>
						<p className="text-lg font-semibold text-foreground">
							{finalResult.message}
						</p>

						{finalResult.success && (
							<div className="mt-4 space-y-2">
								<p className="text-sm text-muted-foreground">
									You can now:
								</p>
								<ul className="space-y-1 text-sm">
									<li className="flex items-start gap-2">
										<span className="text-primary">→</span>
										<a
											href="/test-telnyx-send"
											className="text-primary underline hover:text-primary/80 transition-colors"
										>
											Send SMS messages
										</a>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary">→</span>
										<a
											href="/dashboard/communication"
											className="text-primary underline hover:text-primary/80 transition-colors"
										>
											View all communications
										</a>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary">→</span>
										<a
											href="/test-telnyx-status"
											className="text-primary underline hover:text-primary/80 transition-colors"
										>
											Check message delivery status
										</a>
									</li>
								</ul>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
