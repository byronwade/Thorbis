"use client";

/**
 * Email Setup Step - Domain Verification Flow
 *
 * Options:
 * 1. Platform Domain (instant) - Send from {company}.mail.stratos.app
 * 2. Custom Domain (requires DNS) - Send from yourcompany.com
 * 3. Gmail/Outlook OAuth - Use existing provider
 * 4. Skip - Use platform domain later
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Mail,
	Globe,
	Check,
	ExternalLink,
	SkipForward,
	AlertTriangle,
	Zap,
	Copy,
	CheckCircle2,
	Clock,
	Shield,
	Loader2,
} from "lucide-react";
import { DNSVerificationTracker } from "@/components/onboarding/status-tracking/dns-verification-tracker";
import { GMAIL_WORKSPACE_PER_USER_FEE, formatCurrency } from "@/lib/pricing/onboarding-fees";

type EmailSetupOption = "platform" | "custom-domain" | "gmail" | "outlook" | "skip";

const SETUP_OPTIONS: {
	id: EmailSetupOption;
	title: string;
	subtitle: string;
	icon: React.ElementType;
	badge?: string;
	pricing?: string;
}[] = [
	{
		id: "platform",
		title: "Quick Setup",
		subtitle: "Ready instantly, no DNS needed",
		icon: Zap,
		badge: "Recommended",
	},
	{
		id: "custom-domain",
		title: "Custom Domain",
		subtitle: "Send from yourcompany.com",
		icon: Globe,
	},
	{
		id: "gmail",
		title: "Connect Gmail",
		subtitle: "Google Workspace sync",
		icon: Mail,
		pricing: `${formatCurrency(GMAIL_WORKSPACE_PER_USER_FEE)}/user/month`,
	},
	{
		id: "outlook",
		title: "Connect Outlook",
		subtitle: "Microsoft 365 sync",
		icon: Mail,
	},
	{
		id: "skip",
		title: "Set up later",
		subtitle: "Configure in Settings",
		icon: SkipForward,
	},
];

// Blocked domains that can't be used
const BLOCKED_DOMAINS = [
	"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
	"aol.com", "icloud.com", "protonmail.com", "mail.com"
];

export function EmailStep() {
	const { data, updateData } = useOnboardingStore();
	const [domainInput, setDomainInput] = useState(data.customDomain || "");
	const [domainError, setDomainError] = useState<string | null>(null);
	const [isValidating, setIsValidating] = useState(false);
	const [copied, setCopied] = useState<string | null>(null);

	// Generate company slug for platform domain
	const companySlug = data.companyName
		?.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "") || "yourcompany";

	const platformEmail = `notifications@${companySlug}.mail.stratos.app`;

	const validateDomain = (domain: string): boolean => {
		setDomainError(null);

		if (!domain) {
			setDomainError("Domain is required");
			return false;
		}

		// Normalize
		const normalized = domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "");

		// Check format
		const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
		if (!domainRegex.test(normalized)) {
			setDomainError("Invalid domain format. Example: yourcompany.com");
			return false;
		}

		// Check blocked domains
		if (BLOCKED_DOMAINS.some(blocked => normalized === blocked || normalized.endsWith(`.${blocked}`))) {
			setDomainError("Public email domains (Gmail, Yahoo, etc.) cannot be used. Please enter your company's domain.");
			return false;
		}

		return true;
	};

	const handleDomainSubmit = async () => {
		const normalized = domainInput.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "");

		if (!validateDomain(normalized)) return;

		setIsValidating(true);

		// Simulate API call to create domain in Resend
		await new Promise(resolve => setTimeout(resolve, 1000));

		updateData({
			customDomain: normalized,
			dnsVerified: false,
			emailSetupType: "custom-domain"
		});
		setIsValidating(false);
	};

	const handleCopy = async (text: string, id: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(null), 2000);
	};

	// Mock DNS records (these would come from Resend API in production)
	const dnsRecords = data.customDomain ? [
		{
			id: "spf",
			type: "TXT",
			name: data.customDomain,
			value: "v=spf1 include:amazonses.com ~all",
			purpose: "SPF - Authorizes sending",
		},
		{
			id: "dkim1",
			type: "CNAME",
			name: `resend._domainkey.${data.customDomain}`,
			value: "resend.domainkey.resend.dev",
			purpose: "DKIM - Email signing",
		},
		{
			id: "dmarc",
			type: "TXT",
			name: `_dmarc.${data.customDomain}`,
			value: "v=DMARC1; p=none;",
			purpose: "DMARC - Policy",
		},
	] : [];

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Email setup</h2>
				<p className="text-muted-foreground">
					Choose how invoices and notifications are sent to customers.
				</p>
			</div>

			{/* Why email setup matters */}
			{!data.emailSetupType && (
				<div className="rounded-lg border bg-primary/5 p-4">
					<div className="flex items-start gap-3">
						<Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
						<div className="space-y-2">
							<p className="text-sm font-medium">Why does this matter?</p>
							<p className="text-sm text-muted-foreground">
								Emails from your own domain (e.g., yourcompany.com) have better deliverability and look more professional than generic addresses. Customers are more likely to open emails from a familiar sender.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Setup Options */}
			<div className="space-y-4">
				<div className="grid gap-3">
					{SETUP_OPTIONS.map((option) => {
						const Icon = option.icon;
						const isSelected = data.emailSetupType === option.id;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => {
									updateData({ emailSetupType: option.id });
									if (option.id !== "custom-domain") {
										setDomainError(null);
									}
									// Reset Gmail user count if switching away from Gmail
									if (option.id !== "gmail") {
										updateData({ gmailWorkspaceUsers: 0 });
									}
								}}
								className={cn(
									"relative flex items-center gap-4 rounded-lg p-4 text-left transition-all",
									isSelected
										? "bg-primary/10 ring-2 ring-primary"
										: "bg-muted/40 hover:bg-muted/60"
								)}
							>
								{option.badge && (
									<span className="absolute top-2 right-2 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
										{option.badge}
									</span>
								)}
								{isSelected && !option.badge && (
									<div className="absolute top-3 right-3">
										<Check className="h-4 w-4 text-primary" />
									</div>
								)}
								<div className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
									isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
								)}>
									<Icon className="h-5 w-5" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-medium">{option.title}</p>
									<p className="text-sm text-muted-foreground">{option.subtitle}</p>
									{option.pricing && (
										<p className="text-sm font-medium text-primary mt-1">
											{option.pricing}
										</p>
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Platform Domain - Instant Setup */}
			{data.emailSetupType === "platform" && (
				<div className="space-y-4">
					<div className="rounded-lg bg-green-500/10 p-4 space-y-3">
						<div className="flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5 text-green-500" />
							<span className="font-medium text-green-700 dark:text-green-400">Ready to use immediately</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Emails will be sent from:
						</p>
						<code className="block text-sm bg-background/50 p-3 rounded font-mono">
							{platformEmail}
						</code>
					</div>

					<div className="space-y-2">
						<Label htmlFor="replyToEmail">Reply-To Email (optional)</Label>
						<Input
							id="replyToEmail"
							type="email"
							placeholder="you@yourcompany.com"
							value={data.companyEmail}
							onChange={(e) => updateData({ companyEmail: e.target.value })}
						/>
						<p className="text-xs text-muted-foreground">
							Customer replies go to this address. You can upgrade to a custom domain anytime.
						</p>
					</div>
				</div>
			)}

			{/* Custom Domain Configuration */}
			{data.emailSetupType === "custom-domain" && (
				<div className="space-y-6">
					{/* Domain Input */}
					{!data.customDomain ? (
						<div className="space-y-4">
							{/* Time estimate warning */}
							<div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
								<Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
								<p className="text-sm text-amber-700 dark:text-amber-400">
									DNS verification takes <strong>15 minutes to 48 hours</strong> depending on your provider. You can continue setup and verify later.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="customDomain">Your Domain</Label>
								<div className="flex gap-2">
									<Input
										id="customDomain"
										placeholder="yourcompany.com"
										value={domainInput}
										onChange={(e) => {
											setDomainInput(e.target.value);
											setDomainError(null);
										}}
										className={domainError ? "border-destructive" : ""}
									/>
									<Button
										onClick={handleDomainSubmit}
										disabled={!domainInput || isValidating}
									>
										{isValidating ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Verify"
										)}
									</Button>
								</div>
								{domainError && (
									<p className="text-sm text-destructive flex items-center gap-2">
										<AlertTriangle className="h-4 w-4" />
										{domainError}
									</p>
								)}
								<p className="text-xs text-muted-foreground">
									Enter the domain you own (not Gmail, Yahoo, etc.)
								</p>
							</div>

							{/* DNS Setup Guide */}
							<div className="rounded-lg border bg-muted/30">
								<button
									type="button"
									className="w-full flex items-center justify-between p-4 text-left"
									onClick={(e) => {
										const content = (e.currentTarget.nextElementSibling as HTMLElement);
										if (content) {
											content.classList.toggle("hidden");
										}
									}}
								>
									<span className="text-sm font-medium">How to add DNS records</span>
									<span className="text-sm text-muted-foreground">Show guide</span>
								</button>
								<div className="hidden px-4 pb-4">
									<ol className="space-y-3 text-sm text-muted-foreground">
										<li className="flex gap-3">
											<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">1</span>
											<div>
												<p className="font-medium text-foreground">Log in to your domain provider</p>
												<p>Common providers: GoDaddy, Namecheap, Cloudflare, Google Domains</p>
											</div>
										</li>
										<li className="flex gap-3">
											<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">2</span>
											<div>
												<p className="font-medium text-foreground">Find DNS settings</p>
												<p>Look for "DNS", "DNS Management", or "Name Servers"</p>
											</div>
										</li>
										<li className="flex gap-3">
											<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">3</span>
											<div>
												<p className="font-medium text-foreground">Add the records we provide</p>
												<p>Copy each record exactly as shown (TXT and CNAME types)</p>
											</div>
										</li>
										<li className="flex gap-3">
											<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">4</span>
											<div>
												<p className="font-medium text-foreground">Wait for propagation</p>
												<p>Changes can take 15 minutes to 48 hours to take effect worldwide</p>
											</div>
										</li>
									</ol>
									<div className="mt-4 p-3 bg-background rounded">
										<p className="text-xs text-muted-foreground">
											Need help? Contact support with your domain provider name and we'll guide you through the process.
										</p>
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-4">
								<Shield className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
								<div>
									<p className="font-medium text-foreground">Domain verification required</p>
									<p>You'll need to add DNS records to prove you own this domain. This ensures only you can send emails from it.</p>
								</div>
							</div>
						</div>
					) : (
						/* DNS Verification Tracker */
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">{data.customDomain}</p>
									<p className="text-sm text-muted-foreground">
										Verifying DNS records
									</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => updateData({ customDomain: "", dnsVerified: false })}
								>
									Change
								</Button>
							</div>

							<DNSVerificationTracker
								domain={data.customDomain}
								records={dnsRecords}
								onVerificationComplete={() => {
									updateData({ dnsVerified: true });
								}}
							/>
						</div>
					)}
				</div>
			)}

			{/* OAuth Options */}
			{(data.emailSetupType === "gmail" || data.emailSetupType === "outlook") && (
				<div className="space-y-4">
					<div className="rounded-lg bg-muted/40 p-4 space-y-3">
						<p className="text-sm">
							Connect your {data.emailSetupType === "gmail" ? "Google Workspace" : "Microsoft 365"} account to send emails directly from your business email.
						</p>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Shield className="h-4 w-4" />
							We use OAuth - we never see your password
						</div>
					</div>

					{/* Gmail User Count */}
					{data.emailSetupType === "gmail" && (
						<div className="space-y-2">
							<Label htmlFor="gmailUserCount">
								Number of users needing Gmail access
							</Label>
							<Input
								id="gmailUserCount"
								type="number"
								min="0"
								placeholder="e.g., 5"
								value={data.gmailWorkspaceUsers || ""}
								onChange={(e) => {
									const count = parseInt(e.target.value) || 0;
									updateData({ gmailWorkspaceUsers: count });
								}}
								className="w-[150px]"
							/>
							<p className="text-xs text-muted-foreground">
								{data.gmailWorkspaceUsers > 0
									? `Monthly cost: ${formatCurrency(data.gmailWorkspaceUsers * GMAIL_WORKSPACE_PER_USER_FEE)}`
									: "Enter number of users who need Gmail Workspace access"
								}
							</p>
						</div>
					)}

					<Button className="w-full">
						<ExternalLink className="mr-2 h-4 w-4" />
						Connect {data.emailSetupType === "gmail" ? "Google" : "Microsoft"} Account
					</Button>
					<p className="text-xs text-muted-foreground text-center">
						Requires {data.emailSetupType === "gmail" ? "Google Workspace" : "Microsoft 365"} admin access
					</p>
				</div>
			)}

			{/* Skip Note */}
			{data.emailSetupType === "skip" && (
				<div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-4">
					<AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
					<div>
						<p className="font-medium text-foreground">Using default sender</p>
						<p>Emails will be sent from our platform domain. You can configure a custom domain later in Settings → Email.</p>
					</div>
				</div>
			)}
		</div>
	);
}
