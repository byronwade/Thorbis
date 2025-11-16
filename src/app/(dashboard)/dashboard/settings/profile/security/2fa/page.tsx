"use client";

/**
 * Settings > Profile > Security > 2Fa Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { AlertCircle, CheckCircle, Copy, Download, Key, QrCode, RefreshCw, Shield, Smartphone } from "lucide-react";
import { useState } from "react";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function TwoFactorAuthPage() {
	const [setupStep, setSetupStep] = useState<"setup" | "verify" | "complete">("setup");
	const [verificationCode, setVerificationCode] = useState("");
	const [isPending, setIsPending] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const canFinalize = setupStep === "verify" && verificationCode.length === 6;

	const handleCancel = () => {
		setSetupStep("setup");
		setVerificationCode("");
		setHasChanges(false);
		setIsPending(false);
	};

	const handleSave = () => {
		if (!canFinalize) {
			return;
		}
		setIsPending(true);
		setTimeout(() => {
			setSetupStep("complete");
			setVerificationCode("");
			setHasChanges(false);
			setIsPending(false);
		}, 600);
	};

	const backupCodes = ["A1B2C3D4", "E5F6G7H8", "I9J0K1L2", "M3N4O5P6", "Q7R8S9T0", "U1V2W3X4", "Y5Z6A7B8", "C9D0E1F2"];

	return (
		<SettingsPageLayout
			description="Add an extra layer of security to your account."
			hasChanges={hasChanges}
			helpText="Scan the QR code with an authenticator app, enter the 6-digit code, and store backup codes safely."
			isPending={isPending}
			onCancel={handleCancel}
			onSave={handleSave}
			saveButtonText="Enable 2FA"
			title="Two-Factor Authentication"
		>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-success" />
						Setup Progress
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
								<CheckCircle className="h-4 w-4 text-white" />
							</div>
							<span className="font-medium text-sm">Download App</span>
						</div>
						<div className="h-0.5 w-8 bg-success" />
						<div className="flex items-center gap-2">
							<div
								className={`flex h-8 w-8 items-center justify-center rounded-full ${
									setupStep === "setup"
										? "animate-pulse bg-primary"
										: setupStep === "verify"
											? "bg-warning"
											: "bg-success"
								}`}
							>
								{setupStep === "setup" ? (
									<QrCode className="h-4 w-4 text-white" />
								) : setupStep === "verify" ? (
									<Key className="h-4 w-4 text-white" />
								) : (
									<CheckCircle className="h-4 w-4 text-white" />
								)}
							</div>
							<span className="font-medium text-sm">
								{setupStep === "setup" ? "Scan QR Code" : setupStep === "verify" ? "Enter Code" : "Complete"}
							</span>
						</div>
						<div className={`h-0.5 w-8 ${setupStep === "complete" ? "bg-success" : "bg-muted"}`} />
						<div className="flex items-center gap-2">
							<div
								className={`flex h-8 w-8 items-center justify-center rounded-full ${
									setupStep === "complete" ? "bg-success" : "bg-muted"
								}`}
							>
								<CheckCircle
									className={`h-4 w-4 ${setupStep === "complete" ? "text-white" : "text-muted-foreground"}`}
								/>
							</div>
							<span
								className={`font-medium text-sm ${setupStep === "complete" ? "text-success" : "text-muted-foreground"}`}
							>
								Backup Codes
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{setupStep === "setup" && (
				<div className="grid gap-8 md:grid-cols-2">
					{/* Setup Instructions */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Smartphone className="h-5 w-5" />
								Setup Instructions
							</CardTitle>
							<CardDescription>Follow these steps to enable 2FA on your account</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-medium text-sm text-white">
										1
									</div>
									<div>
										<div className="font-medium">Download an authenticator app</div>
										<div className="mt-1 text-muted-foreground text-sm">
											Install Google Authenticator, Authy, or similar app on your phone
										</div>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-medium text-sm text-white">
										2
									</div>
									<div>
										<div className="font-medium">Scan the QR code</div>
										<div className="mt-1 text-muted-foreground text-sm">
											Open your authenticator app and scan the code shown
										</div>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-medium text-sm text-white">
										3
									</div>
									<div>
										<div className="font-medium">Enter verification code</div>
										<div className="mt-1 text-muted-foreground text-sm">
											Enter the 6-digit code from your app to verify setup
										</div>
									</div>
								</div>
							</div>

							<div className="rounded-lg border border-primary bg-primary p-4 dark:border-primary dark:bg-primary/20">
								<div className="flex items-center gap-2">
									<Download className="h-4 w-4 text-primary" />
									<span className="font-medium text-primary dark:text-primary">Recommended Apps</span>
								</div>
								<div className="mt-2 flex gap-2">
									<Badge variant="secondary">Google Authenticator</Badge>
									<Badge variant="secondary">Authy</Badge>
									<Badge variant="secondary">Microsoft Authenticator</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* QR Code */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<QrCode className="h-5 w-5" />
								Scan QR Code
							</CardTitle>
							<CardDescription>Scan this code with your authenticator app</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center space-y-6">
							<div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-border bg-card p-4">
								<div className="grid h-full w-full grid-cols-8 gap-0.5 rounded bg-gradient-to-br from-black to-gray-800 p-2">
									{/* QR Code Pattern Simulation */}
									<div className="bg-card" />
									<div className="bg-black" />
									<div className="bg-card" />
									<div className="bg-black" />
									<div className="bg-card" />
									<div className="bg-black" />
									<div className="bg-card" />
									<div className="bg-black" />

									<div className="bg-black" />
									<div className="bg-card" />
									<div className="bg-black" />
									<div className="bg-card" />
									<div className="bg-black" />
									<div className="bg-card" />
									<div className="bg-black" />
									<div className="bg-card" />

									<div className="col-span-8 row-span-2 bg-card" />

									<div className="col-span-2 bg-black" />
									<div className="col-span-2 bg-card" />
									<div className="bg-black" />
									<div className="col-span-2 bg-card" />
									<div className="bg-black" />

									<div className="col-span-8 bg-card" />

									<div className="bg-black" />
									<div className="col-span-2 bg-card" />
									<div className="col-span-2 bg-black" />
									<div className="col-span-2 bg-card" />
									<div className="bg-black" />

									<div className="col-span-8 row-span-2 bg-card" />

									<div className="col-span-8 bg-black" />
								</div>
							</div>

							<div className="space-y-2 text-center">
								<p className="rounded bg-muted px-3 py-1 font-mono text-sm dark:bg-foreground">
									Thorbis:john@example.com
								</p>
								<Button size="sm" variant="outline">
									<RefreshCw className="mr-2 size-4" />
									Regenerate Code
								</Button>
							</div>

							<Button
								onClick={() => {
									setSetupStep("verify");
									setHasChanges(true);
								}}
							>
								I've Scanned the Code
							</Button>
						</CardContent>
					</Card>
				</div>
			)}

			{setupStep === "verify" && (
				<Card className="mx-auto max-w-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							Enter Verification Code
						</CardTitle>
						<CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="verificationCode">Verification Code</Label>
							<Input
								className="text-center font-mono text-lg"
								id="verificationCode"
								maxLength={6}
								onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
								placeholder="000000"
								value={verificationCode}
							/>
						</div>

						<div className="text-center">
							<p className="mb-4 text-muted-foreground text-sm">Can't see the code? Check your authenticator app.</p>
							<Button className="w-full" disabled={!canFinalize || isPending} onClick={handleSave}>
								{isPending ? "Verifying..." : "Verify Code"}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{setupStep === "complete" && (
				<div className="space-y-8">
					{/* Success Message */}
					<Card className="border-success dark:border-success">
						<CardContent className="pt-6">
							<div className="space-y-4 text-center">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success dark:bg-success/20">
									<CheckCircle className="h-8 w-8 text-success" />
								</div>
								<div>
									<h3 className="font-semibold text-lg text-success dark:text-success">
										Two-Factor Authentication Enabled!
									</h3>
									<p className="text-success dark:text-success">Your account is now more secure</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Backup Codes */}
					<Card>
						<CardHeader>
							<CardTitle>Save Your Backup Codes</CardTitle>
							<CardDescription>
								Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								{backupCodes.map((code, index) => (
									<div
										className="rounded border bg-secondary p-3 text-center font-mono text-sm dark:bg-foreground"
										key={index}
									>
										{code}
									</div>
								))}
							</div>

							<div className="flex gap-3">
								<Button className="flex-1">
									<Download className="mr-2 size-4" />
									Download Codes
								</Button>
								<Button className="flex-1" variant="outline">
									<Copy className="mr-2 size-4" />
									Copy Codes
								</Button>
							</div>

							<div className="rounded-lg border border-warning bg-warning p-4 dark:border-warning dark:bg-warning/20">
								<div className="flex items-start gap-3">
									<AlertCircle className="mt-0.5 h-5 w-5 text-warning" />
									<div className="text-sm">
										<div className="font-medium text-warning dark:text-warning">Important Security Notice</div>
										<div className="mt-1 text-warning dark:text-warning">
											Each backup code can only be used once. Store them securely and treat them like passwords.
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* 2FA Benefits */}
			<Card>
				<CardHeader>
					<CardTitle>Why Use Two-Factor Authentication?</CardTitle>
					<CardDescription>Benefits of enabling 2FA on your account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2 text-center">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-primary/20">
								<Shield className="h-6 w-6 text-primary" />
							</div>
							<div className="font-medium">Enhanced Security</div>
							<div className="text-muted-foreground text-sm">
								Protects against unauthorized access even if your password is compromised
							</div>
						</div>

						<div className="space-y-2 text-center">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success dark:bg-success/20">
								<CheckCircle className="h-6 w-6 text-success" />
							</div>
							<div className="font-medium">Industry Standard</div>
							<div className="text-muted-foreground text-sm">
								Recommended by security experts and required by many organizations
							</div>
						</div>

						<div className="space-y-2 text-center">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent dark:bg-accent/20">
								<Smartphone className="h-6 w-6 text-accent-foreground" />
							</div>
							<div className="font-medium">Easy to Use</div>
							<div className="text-muted-foreground text-sm">Simply enter a code from your phone when signing in</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</SettingsPageLayout>
	);
}
