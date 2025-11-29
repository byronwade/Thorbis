"use client";

/**
 * SendGrid Domain Configuration Component
 *
 * Allows companies to configure their domain for SendGrid email sending:
 * - Shows global SendGrid API key status (configured via SENDGRID_API_KEY env var)
 * - Set up domain authentication (with subdomain support)
 * - View DNS records needed for verification
 * - Verify domain status
 *
 * Note: SendGrid uses a single global API key for all companies (multi-tenant).
 */

import {
	AlertTriangle,
	CheckCircle2,
	Copy,
	ExternalLink,
	Loader2,
	Mail,
	RefreshCw,
	ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
	setupSendGridDomain,
	verifySendGridDomainStatus,
	getSendGridDomainStatus,
} from "@/actions/settings/sendgrid-domain";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StandardFormField } from "@/components/ui/standard-form-field";
import { cn } from "@/lib/utils";

type DNSRecord = {
	host: string;
	type: "CNAME" | "TXT";
	data: string;
	valid: boolean;
};

type DomainStatus = {
	id: string;
	domain: string;
	subdomain: string | null;
	status: string;
	valid: boolean;
	dnsRecords: {
		mailCname?: DNSRecord;
		dkim1?: DNSRecord;
		dkim2?: DNSRecord;
	};
};

export function SendGridDomainSetup() {
	const [domain, setDomain] = useState("");
	const [subdomain, setSubdomain] = useState("mail");
	const [settingUpDomain, setSettingUpDomain] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [loading, setLoading] = useState(true);
	const [hasApiKey, setHasApiKey] = useState(false);
	const [domainStatus, setDomainStatus] = useState<DomainStatus | null>(null);

	// Load current status on mount
	useEffect(() => {
		loadStatus();
	}, []);

	async function loadStatus() {
		setLoading(true);
		try {
			const result = await getSendGridDomainStatus();
			if (result.success) {
				setHasApiKey(result.hasApiKey || false);
				if (result.domain) {
					setDomainStatus(result.domain);
					setDomain(result.domain.domain);
					setSubdomain(result.domain.subdomain || "mail");
				}
			}
		} catch (error) {
			console.error("Failed to load SendGrid status:", error);
		} finally {
			setLoading(false);
		}
	}


	async function handleSetupDomain() {
		if (!domain.trim()) {
			toast.error("Please enter a domain name");
			return;
		}

		setSettingUpDomain(true);
		try {
			const result = await setupSendGridDomain({
				domain: domain.trim(),
				subdomain: subdomain.trim() || undefined,
			});

			if (result.success && result.domain && result.dnsRecords) {
				toast.success("Domain setup complete! Add the DNS records below.");
				setDomainStatus({
					id: result.domain.id.toString(),
					domain: domain.trim(),
					subdomain: subdomain.trim() || null,
					status: result.domain.valid ? "verified" : "pending",
					valid: result.domain.valid,
					dnsRecords: result.dnsRecords,
				});
				await loadStatus();
			} else {
				toast.error(result.error || "Failed to setup domain");
			}
		} catch (error) {
			console.error("Error setting up domain:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setSettingUpDomain(false);
		}
	}

	async function handleVerifyDomain() {
		if (!domainStatus?.id) {
			toast.error("No domain configured to verify");
			return;
		}

		setVerifying(true);
		try {
			const result = await verifySendGridDomainStatus(domainStatus.id);
			if (result.success && result.domain && result.dnsRecords) {
				const isValid = result.domain.valid;
				toast.success(
					isValid
						? "Domain verified successfully!"
						: "Domain verification pending. Please check your DNS records.",
				);
				setDomainStatus({
					...domainStatus,
					status: isValid ? "verified" : "pending",
					valid: isValid,
					dnsRecords: result.dnsRecords,
				});
				await loadStatus();
			} else {
				toast.error(result.error || "Failed to verify domain");
			}
		} catch (error) {
			console.error("Error verifying domain:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setVerifying(false);
		}
	}

	function copyToClipboard(text: string, label: string) {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied to clipboard`);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">SendGrid Configuration</h2>
				<p className="text-muted-foreground">
					Configure SendGrid API key and domain authentication for email sending
				</p>
			</div>

			{/* API Key Status */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ShieldCheck className="h-5 w-5" />
						SendGrid Configuration
					</CardTitle>
					<CardDescription>
						SendGrid is configured globally for all companies. Each company can set up their own domain for email sending.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{hasApiKey ? (
						<div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
							<CheckCircle2 className="h-5 w-5 text-green-600" />
							<div>
								<p className="font-semibold text-green-600">SendGrid API Key Configured</p>
								<p className="text-sm text-muted-foreground">
									Global SendGrid API key is configured and ready to use
								</p>
							</div>
						</div>
					) : (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertTitle>SendGrid API Key Not Configured</AlertTitle>
							<AlertDescription>
								The global SendGrid API key (SENDGRID_API_KEY) is not set in environment variables.
								Please contact your administrator to configure it.
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>

			{/* Domain Setup */}
			{hasApiKey && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mail className="h-5 w-5" />
							Domain Authentication
						</CardTitle>
						<CardDescription>
							Set up domain authentication to send emails from your domain. We
							recommend using a subdomain (e.g., mail.yourdomain.com) to avoid
							conflicts with existing email services.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{domainStatus ? (
							<div className="space-y-4">
								{/* Domain Status */}
								<div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"h-10 w-10 rounded-full flex items-center justify-center",
												domainStatus.valid
													? "bg-green-500/10 text-green-600"
													: "bg-yellow-500/10 text-yellow-600",
											)}
										>
											{domainStatus.valid ? (
												<CheckCircle2 className="h-5 w-5" />
											) : (
												<AlertTriangle className="h-5 w-5" />
											)}
										</div>
										<div>
											<p className="font-semibold">
												{domainStatus.subdomain
													? `${domainStatus.subdomain}.${domainStatus.domain}`
													: domainStatus.domain}
											</p>
											<p className="text-sm text-muted-foreground">
												{domainStatus.valid
													? "Domain verified and ready to send"
													: "Verification pending - add DNS records below"}
											</p>
										</div>
									</div>
									<Badge
										variant={domainStatus.valid ? "default" : "secondary"}
										className={cn(
											domainStatus.valid
												? "bg-green-500/10 text-green-600 border-green-500/20"
												: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
										)}
									>
										{domainStatus.valid ? "Verified" : "Pending"}
									</Badge>
								</div>

								{/* DNS Records */}
								<div className="space-y-4">
									<h4 className="font-semibold text-sm">DNS Records Required</h4>
									<p className="text-sm text-muted-foreground">
										Add these DNS records to your domain to complete verification.
										Changes may take up to 48 hours to propagate.
									</p>

									{domainStatus.dnsRecords.mailCname && (
										<div className="p-4 border rounded-lg space-y-2">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-semibold">
													Mail CNAME Record
												</Label>
												<Badge
													variant={
														domainStatus.dnsRecords.mailCname.valid
															? "default"
															: "secondary"
													}
													className={cn(
														domainStatus.dnsRecords.mailCname.valid &&
															"bg-green-500/10 text-green-600 border-green-500/20",
													)}
												>
													{domainStatus.dnsRecords.mailCname.valid
														? "Verified"
														: "Pending"}
												</Badge>
											</div>
											<div className="space-y-1 text-sm font-mono">
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Type:</span>
													<span>{domainStatus.dnsRecords.mailCname.type}</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Host:</span>
													<span>{domainStatus.dnsRecords.mailCname.host}</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2"
														onClick={() =>
															copyToClipboard(
																domainStatus.dnsRecords.mailCname!.host,
																"Host",
															)
														}
													>
														<Copy className="h-3 w-3" />
													</Button>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Value:</span>
													<span className="break-all">
														{domainStatus.dnsRecords.mailCname.data}
													</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2"
														onClick={() =>
															copyToClipboard(
																domainStatus.dnsRecords.mailCname!.data,
																"Value",
															)
														}
													>
														<Copy className="h-3 w-3" />
													</Button>
												</div>
											</div>
										</div>
									)}

									{domainStatus.dnsRecords.dkim1 && (
										<div className="p-4 border rounded-lg space-y-2">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-semibold">
													DKIM Record 1
												</Label>
												<Badge
													variant={
														domainStatus.dnsRecords.dkim1.valid
															? "default"
															: "secondary"
													}
													className={cn(
														domainStatus.dnsRecords.dkim1.valid &&
															"bg-green-500/10 text-green-600 border-green-500/20",
													)}
												>
													{domainStatus.dnsRecords.dkim1.valid
														? "Verified"
														: "Pending"}
												</Badge>
											</div>
											<div className="space-y-1 text-sm font-mono">
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Type:</span>
													<span>{domainStatus.dnsRecords.dkim1.type}</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Host:</span>
													<span>{domainStatus.dnsRecords.dkim1.host}</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2"
														onClick={() =>
															copyToClipboard(
																domainStatus.dnsRecords.dkim1!.host,
																"Host",
															)
														}
													>
														<Copy className="h-3 w-3" />
													</Button>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Value:</span>
													<span className="break-all">
														{domainStatus.dnsRecords.dkim1.data}
													</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2"
														onClick={() =>
															copyToClipboard(
																domainStatus.dnsRecords.dkim1!.data,
																"Value",
															)
														}
													>
														<Copy className="h-3 w-3" />
													</Button>
												</div>
											</div>
										</div>
									)}

									{domainStatus.dnsRecords.dkim2 && (
										<div className="p-4 border rounded-lg space-y-2">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-semibold">
													DKIM Record 2
												</Label>
												<Badge
													variant={
														domainStatus.dnsRecords.dkim2.valid
															? "default"
															: "secondary"
													}
													className={cn(
														domainStatus.dnsRecords.dkim2.valid &&
															"bg-green-500/10 text-green-600 border-green-500/20",
													)}
												>
													{domainStatus.dnsRecords.dkim2.valid
														? "Verified"
														: "Pending"}
												</Badge>
											</div>
											<div className="space-y-1 text-sm font-mono">
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Type:</span>
													<span>{domainStatus.dnsRecords.dkim2.type}</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Host:</span>
													<span>{domainStatus.dnsRecords.dkim2.host}</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2"
														onClick={() =>
															copyToClipboard(
																domainStatus.dnsRecords.dkim2!.host,
																"Host",
															)
														}
													>
														<Copy className="h-3 w-3" />
													</Button>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Value:</span>
													<span className="break-all">
														{domainStatus.dnsRecords.dkim2.data}
													</span>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2"
														onClick={() =>
															copyToClipboard(
																domainStatus.dnsRecords.dkim2!.data,
																"Value",
															)
														}
													>
														<Copy className="h-3 w-3" />
													</Button>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<StandardFormField
									label="Domain Name"
									htmlFor="domain"
									description="Your root domain (e.g., thorbis.com)"
									required
								>
									<Input
										id="domain"
										type="text"
										placeholder="thorbis.com"
										value={domain}
										onChange={(e) => setDomain(e.target.value)}
										disabled={settingUpDomain}
									/>
								</StandardFormField>

								<StandardFormField
									label="Subdomain (Recommended)"
									htmlFor="subdomain"
									description="Use a subdomain like 'mail' to avoid conflicts with existing email services (e.g., mail.thorbis.com)"
								>
									<Input
										id="subdomain"
										type="text"
										placeholder="mail"
										value={subdomain}
										onChange={(e) => setSubdomain(e.target.value)}
										disabled={settingUpDomain}
									/>
								</StandardFormField>

								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertTitle>Subdomain Recommended</AlertTitle>
									<AlertDescription>
										Using a subdomain (e.g., mail.yourdomain.com) prevents
										conflicts with existing email services like Google Workspace
										or Microsoft 365. This is the recommended approach.
									</AlertDescription>
								</Alert>

								<Button
									onClick={handleSetupDomain}
									disabled={!domain.trim() || settingUpDomain}
								>
									{settingUpDomain && (
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									)}
									Setup Domain
								</Button>
							</div>
						)}
					</CardContent>
					{domainStatus && (
						<CardFooter>
							<Button
								variant="outline"
								onClick={handleVerifyDomain}
								disabled={verifying}
							>
								{verifying ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<RefreshCw className="h-4 w-4 mr-2" />
								)}
								Verify Domain Status
							</Button>
						</CardFooter>
					)}
				</Card>
			)}
		</div>
	);
}

