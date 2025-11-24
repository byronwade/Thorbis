"use client";

/**
 * Email Setup Step - Professional Email Configuration
 *
 * Explains email deliverability, custom domains, and DNS setup.
 * Critical for ensuring customer communications don't go to spam.
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard, ExpandableInfo } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Mail,
	Globe,
	CheckCircle2,
	Clock,
	Shield,
	AlertTriangle,
	Sparkles,
	Copy,
	ExternalLink,
	RefreshCw,
	SkipForward,
} from "lucide-react";

type EmailSetupOption = "existing" | "custom-domain" | "gmail" | "outlook" | "skip";

const SETUP_OPTIONS: {
	id: EmailSetupOption;
	title: string;
	description: string;
	icon: React.ElementType;
	badge?: string;
	badgeVariant?: "default" | "secondary" | "destructive" | "outline";
	recommended?: boolean;
}[] = [
	{
		id: "existing",
		title: "Use My Existing Email",
		description: "Replies go to your current business email",
		icon: Mail,
		badge: "Instant",
		badgeVariant: "default",
	},
	{
		id: "custom-domain",
		title: "Custom Domain Email",
		description: "Send from your own domain (e.g., invoices@yourcompany.com)",
		icon: Globe,
		badge: "Recommended",
		badgeVariant: "default",
		recommended: true,
	},
	{
		id: "gmail",
		title: "Connect Gmail",
		description: "Sync with your Google Workspace account",
		icon: Mail,
		badge: "OAuth",
		badgeVariant: "secondary",
	},
	{
		id: "outlook",
		title: "Connect Outlook",
		description: "Sync with your Microsoft 365 account",
		icon: Mail,
		badge: "OAuth",
		badgeVariant: "secondary",
	},
	{
		id: "skip",
		title: "Skip for Now",
		description: "Use default Thorbis email (may have lower deliverability)",
		icon: SkipForward,
	},
];

// Sample DNS records for custom domain setup
const DNS_RECORDS = [
	{
		type: "TXT",
		name: "@",
		value: "v=spf1 include:_spf.thorbis.com ~all",
		purpose: "SPF - Authorizes Thorbis to send email",
	},
	{
		type: "CNAME",
		name: "em._domainkey",
		value: "dkim.thorbis.com",
		purpose: "DKIM - Email authentication",
	},
	{
		type: "CNAME",
		name: "mail",
		value: "mail.thorbis.com",
		purpose: "Return path for bounces",
	},
];

export function EmailStep() {
	const { data, updateData } = useOnboardingStore();
	const [isVerifying, setIsVerifying] = useState(false);
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	const copyToClipboard = (text: string, index: number) => {
		navigator.clipboard.writeText(text);
		setCopiedIndex(index);
		setTimeout(() => setCopiedIndex(null), 2000);
	};

	const verifyDNS = async () => {
		setIsVerifying(true);
		// Simulate verification
		await new Promise((resolve) => setTimeout(resolve, 2000));
		updateData({ dnsVerified: true });
		setIsVerifying(false);
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Configure email sending</h2>
				<p className="text-sm text-muted-foreground">
					How should invoices, estimates, and reminders be sent to customers?
				</p>
			</div>

			{/* Why This Matters */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Email deliverability matters"
				description="Emails from custom domains have 30% higher open rates than generic addresses. They build trust and rarely land in spam."
				variant="tip"
			/>

			{/* Setup Options */}
			<div className="space-y-3">
				{SETUP_OPTIONS.map((option) => {
					const Icon = option.icon;
					const isSelected = data.emailSetupType === option.id;

					return (
						<button
							key={option.id}
							type="button"
							onClick={() => updateData({ emailSetupType: option.id, dnsVerified: false })}
							className={cn(
								"w-full flex items-center gap-4 rounded-xl p-4 text-left transition-all",
								isSelected
									? "bg-primary/10 ring-2 ring-primary"
									: "bg-muted/30 hover:bg-muted/50",
								option.recommended && !isSelected && "ring-1 ring-primary/30"
							)}
						>
							<div className={cn(
								"flex h-10 w-10 items-center justify-center rounded-lg transition-colors flex-shrink-0",
								isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
							)}>
								<Icon className="h-5 w-5" />
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<p className="font-medium">{option.title}</p>
									{option.badge && (
										<Badge variant={option.badgeVariant} className="text-xs">
											{option.badge}
										</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">{option.description}</p>
							</div>

							{isSelected && (
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
							)}
						</button>
					);
				})}
			</div>

			{/* Existing Email Configuration */}
			{data.emailSetupType === "existing" && (
				<div className="rounded-xl bg-muted/30 p-5 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="replyToEmail">Reply-To Email Address</Label>
						<Input
							id="replyToEmail"
							type="email"
							placeholder="invoices@yourcompany.com"
							value={data.companyEmail}
							onChange={(e) => updateData({ companyEmail: e.target.value })}
						/>
						<p className="text-xs text-muted-foreground">
							When customers reply to invoices or estimates, replies go here.
						</p>
					</div>

					<InfoCard
						icon={<AlertTriangle className="h-5 w-5" />}
						title="Emails will be sent from noreply@thorbis.com"
						description="While functional, this may have lower deliverability. Consider setting up a custom domain for best results."
						variant="warning"
					/>
				</div>
			)}

			{/* Custom Domain Configuration */}
			{data.emailSetupType === "custom-domain" && (
				<div className="space-y-4">
					<div className="rounded-xl bg-muted/30 p-5 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="customDomain">Your Domain</Label>
							<Input
								id="customDomain"
								placeholder="yourcompany.com"
								value={data.customDomain}
								onChange={(e) => updateData({ customDomain: e.target.value, dnsVerified: false })}
							/>
							<p className="text-xs text-muted-foreground">
								Enter just the domain, not the full email address.
							</p>
						</div>
					</div>

					{data.customDomain && (
						<div className="rounded-xl bg-muted/30 p-5 space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">DNS Records to Add</h3>
								{data.dnsVerified ? (
									<Badge variant="default" className="bg-green-500">
										<CheckCircle2 className="mr-1 h-3 w-3" />
										Verified
									</Badge>
								) : (
									<Badge variant="secondary">Pending</Badge>
								)}
							</div>

							<p className="text-sm text-muted-foreground">
								Add these records to your domain's DNS settings (usually in your domain registrar like GoDaddy, Namecheap, or Cloudflare).
							</p>

							<div className="space-y-3">
								{DNS_RECORDS.map((record, i) => (
									<div key={i} className="rounded-lg bg-background p-3 space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="font-mono text-xs">
													{record.type}
												</Badge>
												<span className="text-sm font-medium">{record.purpose}</span>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => copyToClipboard(record.value, i)}
											>
												{copiedIndex === i ? (
													<CheckCircle2 className="h-4 w-4 text-green-500" />
												) : (
													<Copy className="h-4 w-4" />
												)}
											</Button>
										</div>
										<div className="grid gap-1 text-xs">
											<div className="flex">
												<span className="text-muted-foreground w-16">Name:</span>
												<code className="bg-muted px-1 rounded">{record.name}</code>
											</div>
											<div className="flex">
												<span className="text-muted-foreground w-16">Value:</span>
												<code className="bg-muted px-1 rounded break-all">{record.value}</code>
											</div>
										</div>
									</div>
								))}
							</div>

							<Button
								onClick={verifyDNS}
								disabled={isVerifying || data.dnsVerified}
								className="w-full"
							>
								{isVerifying ? (
									<>
										<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
										Verifying DNS...
									</>
								) : data.dnsVerified ? (
									<>
										<CheckCircle2 className="mr-2 h-4 w-4" />
										DNS Verified
									</>
								) : (
									<>
										<Shield className="mr-2 h-4 w-4" />
										Verify DNS Records
									</>
								)}
							</Button>

							{!data.dnsVerified && (
								<p className="text-xs text-muted-foreground text-center">
									DNS changes can take up to 48 hours to propagate.
									You can skip this and verify later.
								</p>
							)}
						</div>
					)}

					<ExpandableInfo title="How do I add DNS records?">
						<div className="space-y-2 text-sm">
							<p>
								DNS records are managed where you registered your domain. Common providers:
							</p>
							<ul className="space-y-1">
								<li>• <strong>GoDaddy:</strong> My Products → DNS → Add Record</li>
								<li>• <strong>Namecheap:</strong> Domain List → Manage → Advanced DNS</li>
								<li>• <strong>Cloudflare:</strong> DNS → Records → Add Record</li>
								<li>• <strong>Google Domains:</strong> DNS → Custom Records</li>
							</ul>
							<p className="text-muted-foreground">
								If you're not sure, ask your IT person or contact your domain provider's support.
							</p>
						</div>
					</ExpandableInfo>
				</div>
			)}

			{/* OAuth Options */}
			{(data.emailSetupType === "gmail" || data.emailSetupType === "outlook") && (
				<div className="rounded-xl bg-muted/30 p-5 space-y-4">
					<h3 className="font-semibold">
						Connect {data.emailSetupType === "gmail" ? "Gmail" : "Outlook"}
					</h3>
					<p className="text-sm text-muted-foreground">
						Click below to securely connect your {data.emailSetupType === "gmail" ? "Google Workspace" : "Microsoft 365"} account.
						We'll use OAuth, so we never see your password.
					</p>
					<Button className="w-full">
						<ExternalLink className="mr-2 h-4 w-4" />
						Connect {data.emailSetupType === "gmail" ? "Google" : "Microsoft"} Account
					</Button>
					<p className="text-xs text-muted-foreground text-center">
						You'll be redirected to {data.emailSetupType === "gmail" ? "Google" : "Microsoft"} to authorize access.
					</p>
				</div>
			)}

			{/* Skip Warning */}
			{data.emailSetupType === "skip" && (
				<InfoCard
					icon={<AlertTriangle className="h-5 w-5" />}
					title="Emails may land in spam"
					description="Without proper email authentication, your invoices and reminders may not reach customers. We strongly recommend setting up at least the 'existing email' option."
					variant="warning"
				/>
			)}
		</div>
	);
}
