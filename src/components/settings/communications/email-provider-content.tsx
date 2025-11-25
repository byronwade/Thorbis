"use client";

/**
 * Email Provider Settings Content Component
 *
 * Allows companies to choose between:
 * - Managed (Resend/Postmark - platform managed)
 * - Google Workspace (Gmail API)
 * - Disabled (no email sending)
 */

import { useState } from "react";
import {
	Mail,
	CheckCircle2,
	AlertTriangle,
	ExternalLink,
	Loader2,
	Settings,
	Building2,
	ShieldCheck,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { updateEmailProvider, type EmailProvider } from "@/actions/settings/email-provider";
import { toast } from "sonner";

interface EmailProviderContentProps {
	currentProvider: EmailProvider;
	isConnected: boolean;
	companyId: string;
}

const PROVIDERS = [
	{
		id: "managed" as EmailProvider,
		name: "Platform Managed (Resend)",
		description: "Fully managed email infrastructure with automatic setup",
		icon: Building2,
		features: [
			"Automatic domain setup and verification",
			"99.9% delivery guarantee",
			"Built-in spam protection",
			"Team member email addresses included",
			"Support for custom domains",
		],
		recommended: true,
		setupRequired: false,
	},
	{
		id: "gmail" as EmailProvider,
		name: "Google Workspace",
		description: "Use your existing Google Workspace for email",
		icon: Mail,
		features: [
			"Use your existing Gmail addresses",
			"No vendor lock-in - use Gmail directly",
			"All emails tracked in Stratos",
			"Send via Gmail API",
			"Automatic inbox sync",
		],
		recommended: false,
		setupRequired: true,
	},
	{
		id: "disabled" as EmailProvider,
		name: "Disabled",
		description: "Turn off email sending capabilities",
		icon: ShieldCheck,
		features: [
			"No emails will be sent from the platform",
			"Existing emails remain accessible",
			"Can be re-enabled at any time",
		],
		recommended: false,
		setupRequired: false,
	},
] as const;

export function EmailProviderContent({
	currentProvider,
	isConnected,
	companyId,
}: EmailProviderContentProps) {
	const [selectedProvider, setSelectedProvider] = useState<EmailProvider>(currentProvider);
	const [saving, setSaving] = useState(false);
	const [showWarning, setShowWarning] = useState(false);

	const hasChanges = selectedProvider !== currentProvider;

	const handleSave = async () => {
		// Show warning if switching away from current provider
		if (hasChanges && currentProvider !== "disabled" && !showWarning) {
			setShowWarning(true);
			return;
		}

		setSaving(true);
		try {
			const result = await updateEmailProvider({ provider: selectedProvider });

			if (result.success) {
				toast.success("Email provider updated successfully");
				setShowWarning(false);

				// If switching to Gmail, redirect to setup wizard
				if (selectedProvider === "gmail") {
					window.location.href = "/dashboard/settings/communications/email-provider/setup-gmail";
				} else {
					// Reload to refresh connection status
					window.location.reload();
				}
			} else {
				toast.error(result.error || "Failed to update email provider");
			}
		} catch (error) {
			console.error("Error updating email provider:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setSaving(false);
		}
	};

	const selectedProviderData = PROVIDERS.find((p) => p.id === selectedProvider);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Email Provider</h2>
				<p className="text-muted-foreground">
					Choose how your company sends and receives emails
				</p>
			</div>

			{/* Current Status */}
			{currentProvider !== "disabled" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="h-5 w-5" />
							Current Provider Status
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"h-12 w-12 rounded-full flex items-center justify-center",
										isConnected
											? "bg-green-500/10 text-green-600"
											: "bg-yellow-500/10 text-yellow-600"
									)}
								>
									{isConnected ? (
										<CheckCircle2 className="h-6 w-6" />
									) : (
										<AlertTriangle className="h-6 w-6" />
									)}
								</div>
								<div>
									<p className="font-semibold">
										{PROVIDERS.find((p) => p.id === currentProvider)?.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{isConnected ? "Connected and active" : "Not connected - setup required"}
									</p>
								</div>
							</div>
							{isConnected ? (
								<Badge variant="secondary" className="gap-1">
									<CheckCircle2 className="h-3 w-3" />
									Active
								</Badge>
							) : (
								<Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600">
									<AlertTriangle className="h-3 w-3" />
									Setup Required
								</Badge>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Provider Selection */}
			<Card>
				<CardHeader>
					<CardTitle>Select Email Provider</CardTitle>
					<CardDescription>
						Choose the email infrastructure that works best for your business
					</CardDescription>
				</CardHeader>
				<CardContent>
					<RadioGroup
						value={selectedProvider}
						onValueChange={(v) => setSelectedProvider(v as EmailProvider)}
						className="grid gap-4"
					>
						{PROVIDERS.map((provider) => {
							const Icon = provider.icon;
							const isCurrentlySelected = selectedProvider === provider.id;

							return (
								<div key={provider.id}>
									<RadioGroupItem
										value={provider.id}
										id={provider.id}
										className="peer sr-only"
									/>
									<Label
										htmlFor={provider.id}
										className={cn(
											"flex flex-col gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
											"peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
											"hover:border-primary/50"
										)}
									>
										<div className="flex items-start justify-between">
											<div className="flex items-start gap-3">
												<div
													className={cn(
														"h-10 w-10 rounded-lg flex items-center justify-center",
														isCurrentlySelected
															? "bg-primary/10 text-primary"
															: "bg-muted text-muted-foreground"
													)}
												>
													<Icon className="h-5 w-5" />
												</div>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<p className="font-semibold">{provider.name}</p>
														{provider.recommended && (
															<Badge variant="secondary" className="text-xs">
																Recommended
															</Badge>
														)}
													</div>
													<p className="text-sm text-muted-foreground">
														{provider.description}
													</p>
												</div>
											</div>
											{isCurrentlySelected && (
												<CheckCircle2 className="h-5 w-5 text-primary" />
											)}
										</div>

										<Separator />

										<ul className="space-y-2">
											{provider.features.map((feature, idx) => (
												<li key={idx} className="flex items-start gap-2 text-sm">
													<CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
													<span>{feature}</span>
												</li>
											))}
										</ul>

										{provider.setupRequired && isCurrentlySelected && (
											<div className="pt-2">
												<Badge variant="outline" className="gap-1">
													<Settings className="h-3 w-3" />
													Setup wizard required after saving
												</Badge>
											</div>
										)}
									</Label>
								</div>
							);
						})}
					</RadioGroup>
				</CardContent>
			</Card>

			{/* Migration Warning */}
			{showWarning && hasChanges && (
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Switching Email Providers</AlertTitle>
					<AlertDescription className="space-y-2">
						<p>
							You are about to switch from{" "}
							<strong>{PROVIDERS.find((p) => p.id === currentProvider)?.name}</strong> to{" "}
							<strong>{selectedProviderData?.name}</strong>.
						</p>
						<ul className="list-disc list-inside space-y-1 text-sm">
							<li>All existing emails will remain accessible</li>
							<li>Future emails will be sent using the new provider</li>
							<li>You may need to update DNS records or complete setup</li>
							<li>Email sending will be disabled until setup is complete</li>
						</ul>
						<div className="flex gap-2 pt-2">
							<Button variant="destructive" size="sm" onClick={handleSave} disabled={saving}>
								{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
								Confirm and Switch
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setShowWarning(false);
									setSelectedProvider(currentProvider);
								}}
							>
								Cancel
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			)}

			{/* Save Button */}
			<div className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					{hasChanges ? (
						<span className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-yellow-600" />
							You have unsaved changes
						</span>
					) : (
						<span className="flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							No changes to save
						</span>
					)}
				</div>

				<div className="flex gap-2">
					{selectedProvider === "gmail" && currentProvider !== "gmail" && hasChanges && (
						<Button variant="outline" size="sm" asChild>
							<a href="/docs/email/gmail-setup" target="_blank" rel="noopener noreferrer">
								<ExternalLink className="h-4 w-4 mr-2" />
								Setup Guide
							</a>
						</Button>
					)}

					<Button onClick={handleSave} disabled={!hasChanges || saving}>
						{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
						{selectedProvider !== currentProvider && selectedProviderData?.setupRequired
							? "Save and Continue to Setup"
							: "Save Changes"}
						{selectedProvider !== currentProvider && selectedProviderData?.setupRequired && (
							<ArrowRight className="h-4 w-4 ml-2" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
