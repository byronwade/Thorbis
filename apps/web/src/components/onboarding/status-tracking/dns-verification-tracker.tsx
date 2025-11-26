"use client";

/**
 * DNS Verification Tracker
 *
 * Comprehensive tracking for DNS verification (can take up to 48 hours)
 * - Polls DNS every 60 seconds to check verification
 * - Shows which records are verified
 * - Educational content on DNS propagation
 * - Troubleshooting help
 * - Provider-specific instructions
 */

import {
	AlertCircle,
	Check,
	CheckCircle2,
	Clock,
	Copy,
	ExternalLink,
	Globe,
	Info,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DNSRecord {
	id: string;
	type: string;
	name: string;
	value: string;
	purpose: string;
	verified?: boolean;
}

interface DNSVerificationTrackerProps {
	domain: string;
	records: DNSRecord[];
	onVerificationComplete?: () => void;
}

export function DNSVerificationTracker({
	domain,
	records: initialRecords,
	onVerificationComplete,
}: DNSVerificationTrackerProps) {
	const [records, setRecords] = useState(initialRecords);
	const [copied, setCopied] = useState<string | null>(null);
	const [isChecking, setIsChecking] = useState(false);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [isPolling, setIsPolling] = useState(true);

	const verifiedCount = records.filter((r) => r.verified).length;
	const allVerified = verifiedCount === records.length;

	// Poll DNS every 60 seconds
	useEffect(() => {
		if (!isPolling || allVerified) return;

		const checkDNS = async () => {
			setIsChecking(true);
			try {
				// Call server action to verify DNS
				const response = await fetch(
					`/api/email/verify-dns?domain=${encodeURIComponent(domain)}`,
				);
				const data = await response.json();

				if (data.success && data.records) {
					setRecords((prev) =>
						prev.map((record) => {
							const verified = data.records.find(
								(r: any) => r.id === record.id,
							)?.verified;
							return { ...record, verified };
						}),
					);
					setLastChecked(new Date());

					// Stop polling if all verified
					if (data.allVerified) {
						setIsPolling(false);
						onVerificationComplete?.();
					}
				}
			} catch (err) {
				console.error("DNS check failed:", err);
			} finally {
				setIsChecking(false);
			}
		};

		// Initial check
		checkDNS();

		// Check every 60 seconds
		const interval = setInterval(checkDNS, 60000);

		return () => clearInterval(interval);
	}, [domain, isPolling, allVerified, onVerificationComplete]);

	// Track time elapsed
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeElapsed((t) => t + 1);
		}, 60000); // Update every minute

		return () => clearInterval(interval);
	}, []);

	const handleCopy = async (text: string, id: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(id);
		setTimeout(() => setCopied(null), 2000);
	};

	const handleManualCheck = async () => {
		setIsChecking(true);
		try {
			const response = await fetch(
				`/api/email/verify-dns?domain=${encodeURIComponent(domain)}`,
			);
			const data = await response.json();

			if (data.success && data.records) {
				setRecords((prev) =>
					prev.map((record) => {
						const verified = data.records.find(
							(r: any) => r.id === record.id,
						)?.verified;
						return { ...record, verified };
					}),
				);
				setLastChecked(new Date());

				if (data.allVerified) {
					setIsPolling(false);
					onVerificationComplete?.();
				}
			}
		} catch (err) {
			console.error("Manual DNS check failed:", err);
		} finally {
			setIsChecking(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Status Header */}
			<div className="rounded-lg bg-muted/40 p-6 space-y-4">
				<div className="flex items-start gap-4">
					{allVerified ? (
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
							<CheckCircle2 className="h-6 w-6 text-green-500" />
						</div>
					) : (
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 animate-pulse">
							<Clock className="h-6 w-6 text-amber-500" />
						</div>
					)}
					<div className="flex-1">
						<h3 className="text-lg font-semibold">
							{allVerified ? "DNS Verified!" : "Waiting for DNS Propagation"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{allVerified
								? `Your domain ${domain} is ready to send emails`
								: `${verifiedCount} of ${records.length} records verified`}
						</p>
						{lastChecked && (
							<p className="text-xs text-muted-foreground mt-2">
								Last checked: {lastChecked.toLocaleTimeString()}
								{isPolling && !allVerified && " • Checking every 60 seconds..."}
							</p>
						)}
					</div>
				</div>

				{/* Progress Bar */}
				{!allVerified && (
					<div className="space-y-2">
						<div className="h-2 bg-muted rounded-full overflow-hidden">
							<div
								className="h-full bg-primary transition-all duration-500"
								style={{ width: `${(verifiedCount / records.length) * 100}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground text-center">
							{Math.round((verifiedCount / records.length) * 100)}% complete
						</p>
					</div>
				)}
			</div>

			{/* Manual Check Button */}
			{!allVerified && (
				<Button
					onClick={handleManualCheck}
					disabled={isChecking}
					variant="outline"
					className="w-full"
				>
					{isChecking ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Checking DNS...
						</>
					) : (
						<>
							<RefreshCw className="mr-2 h-4 w-4" />
							Check Now
						</>
					)}
				</Button>
			)}

			{/* DNS Records */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium">DNS Records</h4>
				<div className="space-y-2">
					{records.map((record) => (
						<div
							key={record.id}
							className={cn(
								"rounded-lg p-4 space-y-3 transition-colors",
								record.verified
									? "bg-green-500/10 ring-1 ring-green-500/20"
									: "bg-muted/40",
							)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{record.verified ? (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									) : (
										<Clock className="h-5 w-5 text-amber-500" />
									)}
									<span className="text-sm font-medium">
										{record.type} - {record.purpose}
									</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 px-2"
									onClick={() => handleCopy(record.value, record.id)}
								>
									{copied === record.id ? (
										<Check className="h-3 w-3" />
									) : (
										<Copy className="h-3 w-3" />
									)}
								</Button>
							</div>

							<div className="text-xs space-y-1 font-mono">
								<div className="flex flex-wrap items-center gap-1">
									<span className="text-muted-foreground">Name:</span>
									<code className="bg-background px-2 py-1 rounded break-all">
										{record.name}
									</code>
								</div>
								<div className="flex flex-wrap items-center gap-1">
									<span className="text-muted-foreground">Value:</span>
									<code className="bg-background px-2 py-1 rounded break-all">
										{record.value}
									</code>
								</div>
							</div>

							{record.verified && (
								<p className="text-xs text-green-700 dark:text-green-400 font-medium">
									✓ Verified successfully
								</p>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Timeline Info */}
			{!allVerified && (
				<div className="rounded-lg bg-blue-500/10 p-4 space-y-3">
					<div className="flex items-center gap-2">
						<Globe className="h-5 w-5 text-blue-500" />
						<span className="font-medium">DNS Propagation Timeline</span>
					</div>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>
							<strong>5 minutes:</strong> Most records verify this quickly if
							configured correctly
						</p>
						<p>
							<strong>1-2 hours:</strong> Common propagation time for slower DNS
							providers
						</p>
						<p>
							<strong>Up to 48 hours:</strong> Maximum time in rare cases
							(usually much faster)
						</p>
					</div>
					{timeElapsed > 0 && (
						<p className="text-xs text-muted-foreground">
							Time elapsed: {timeElapsed} minute{timeElapsed !== 1 ? "s" : ""}
						</p>
					)}
				</div>
			)}

			{/* Instructions */}
			{!allVerified && (
				<div className="space-y-4">
					<h4 className="text-sm font-medium flex items-center gap-2">
						<Info className="h-4 w-4" />
						How to Add DNS Records
					</h4>

					<div className="space-y-3 text-sm text-muted-foreground">
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">1</span>
							</div>
							<p>
								Log into your domain registrar or DNS provider (where you bought{" "}
								{domain})
							</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">2</span>
							</div>
							<p>Find the DNS settings, DNS management, or Zone file section</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">3</span>
							</div>
							<p>
								Add each record above exactly as shown (copy/paste the values)
							</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">4</span>
							</div>
							<p>
								Save your changes and wait. We'll automatically detect when
								records are live.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Provider-Specific Help */}
			{!allVerified && (
				<div className="rounded-lg border border-muted p-4 space-y-3">
					<p className="text-sm font-medium">Need help finding DNS settings?</p>
					<div className="grid grid-cols-2 gap-2">
						<Button variant="outline" size="sm" className="justify-start">
							<ExternalLink className="mr-2 h-3 w-3" />
							GoDaddy
						</Button>
						<Button variant="outline" size="sm" className="justify-start">
							<ExternalLink className="mr-2 h-3 w-3" />
							Namecheap
						</Button>
						<Button variant="outline" size="sm" className="justify-start">
							<ExternalLink className="mr-2 h-3 w-3" />
							Cloudflare
						</Button>
						<Button variant="outline" size="sm" className="justify-start">
							<ExternalLink className="mr-2 h-3 w-3" />
							Google Domains
						</Button>
					</div>
				</div>
			)}

			{/* Troubleshooting */}
			{!allVerified && timeElapsed > 30 && (
				<div className="rounded-lg bg-amber-500/10 p-4 space-y-3">
					<div className="flex items-start gap-3">
						<AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium">
								Taking longer than expected?
							</p>
							<ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc ml-4">
								<li>
									Double-check that you copied the values exactly (no extra
									spaces)
								</li>
								<li>
									Make sure you selected the correct record type (TXT vs CNAME)
								</li>
								<li>
									Some providers need you to use @ instead of the full domain
									name
								</li>
								<li>
									Try refreshing your DNS provider's page and checking if
									records saved
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Success Message */}
			{allVerified && (
				<div className="rounded-lg bg-green-500/10 p-4 space-y-2">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5 text-green-500" />
						<span className="font-medium text-green-700 dark:text-green-400">
							Domain verified successfully!
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						You can now send emails from {domain}. All notifications and
						invoices will use this domain.
					</p>
				</div>
			)}
		</div>
	);
}
