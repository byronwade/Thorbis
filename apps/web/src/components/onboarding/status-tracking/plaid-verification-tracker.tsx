"use client";

/**
 * Plaid Verification Tracker
 *
 * Comprehensive tracking for Plaid bank account verification (instant to few minutes)
 * - Polls API every 15 seconds for verification status
 * - Shows which accounts were connected
 * - Displays verification status for each account
 * - Educational content on what Plaid accesses
 * - Troubleshooting help if connection fails
 */

import {
	AlertCircle,
	AlertTriangle,
	Building2,
	CheckCircle2,
	Clock,
	DollarSign,
	ExternalLink,
	Info,
	Loader2,
	RefreshCw,
	Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BankAccount {
	id: string;
	name: string;
	mask: string; // Last 4 digits
	type: string; // checking, savings, etc.
	subtype: string;
	verified: boolean;
	verificationStatus?: "pending" | "verified" | "failed";
}

interface PlaidVerificationTrackerProps {
	companyId: string;
	plaidItemId?: string; // After token exchange
	onVerificationComplete?: (accounts: BankAccount[]) => void;
}

type VerificationStatus = "connecting" | "verifying" | "verified" | "failed";

export function PlaidVerificationTracker({
	companyId,
	plaidItemId,
	onVerificationComplete,
}: PlaidVerificationTrackerProps) {
	const [status, setStatus] = useState<VerificationStatus>("connecting");
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);
	const [isPolling, setIsPolling] = useState(true);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [timeElapsed, setTimeElapsed] = useState(0);

	const verifiedCount = accounts.filter((a) => a.verified).length;
	const allVerified = accounts.length > 0 && verifiedCount === accounts.length;

	// Poll API every 15 seconds for verification status
	useEffect(() => {
		if (!isPolling || allVerified || status === "failed") return;

		const checkStatus = async () => {
			setIsChecking(true);
			try {
				const response = await fetch(
					`/api/payments/plaid-status?companyId=${encodeURIComponent(companyId)}` +
						(plaidItemId ? `&itemId=${encodeURIComponent(plaidItemId)}` : ""),
				);
				const data = await response.json();

				if (data.success && data.accounts) {
					setAccounts(data.accounts);
					setStatus(data.status || "verifying");
					setLastChecked(new Date());

					// Stop polling if all verified or failed
					if (data.allVerified) {
						setStatus("verified");
						setIsPolling(false);
						onVerificationComplete?.(data.accounts);
					} else if (data.status === "failed") {
						setStatus("failed");
						setIsPolling(false);
						setError(data.error || "Verification failed");
					}
				} else if (!data.success) {
					setError(data.error || "Failed to check verification status");
				}
			} catch (err) {
				console.error("Plaid verification check failed:", err);
				setError("Unable to check status. We'll keep trying...");
			} finally {
				setIsChecking(false);
			}
		};

		// Initial check
		checkStatus();

		// Poll every 15 seconds
		const interval = setInterval(checkStatus, 15000);

		return () => clearInterval(interval);
	}, [
		companyId,
		plaidItemId,
		isPolling,
		allVerified,
		status,
		onVerificationComplete,
	]);

	// Track time elapsed
	useEffect(() => {
		const interval = setInterval(() => {
			setTimeElapsed((t) => t + 1);
		}, 1000); // Update every second

		return () => clearInterval(interval);
	}, []);

	const handleManualCheck = async () => {
		setIsChecking(true);
		try {
			const response = await fetch(
				`/api/payments/plaid-status?companyId=${encodeURIComponent(companyId)}` +
					(plaidItemId ? `&itemId=${encodeURIComponent(plaidItemId)}` : ""),
			);
			const data = await response.json();

			if (data.success && data.accounts) {
				setAccounts(data.accounts);
				setStatus(data.status || "verifying");
				setLastChecked(new Date());

				if (data.allVerified) {
					setStatus("verified");
					setIsPolling(false);
					onVerificationComplete?.(data.accounts);
				}
			}
		} catch (err) {
			console.error("Manual check failed:", err);
		} finally {
			setIsChecking(false);
		}
	};

	const getStatusInfo = () => {
		switch (status) {
			case "connecting":
				return {
					icon: Clock,
					iconClass: "text-blue-500",
					bgClass: "bg-blue-500/10",
					title: "Connecting to Bank",
					description: "Establishing secure connection with your bank...",
				};
			case "verifying":
				return {
					icon: Loader2,
					iconClass: "text-amber-500 animate-spin",
					bgClass: "bg-amber-500/10",
					title: "Verifying Accounts",
					description: `${verifiedCount} of ${accounts.length} accounts verified`,
				};
			case "verified":
				return {
					icon: CheckCircle2,
					iconClass: "text-green-500",
					bgClass: "bg-green-500/10",
					title: "Bank Connected!",
					description: `${accounts.length} account${accounts.length !== 1 ? "s" : ""} verified and ready`,
				};
			case "failed":
				return {
					icon: AlertCircle,
					iconClass: "text-destructive",
					bgClass: "bg-destructive/10",
					title: "Connection Failed",
					description: error || "Unable to verify bank connection",
				};
		}
	};

	const statusInfo = getStatusInfo();
	const StatusIcon = statusInfo.icon;

	return (
		<div className="space-y-6">
			{/* Status Header */}
			<div className="rounded-lg bg-muted/40 p-6 space-y-4">
				<div className="flex items-start gap-4">
					<div
						className={cn(
							"flex h-12 w-12 items-center justify-center rounded-full",
							statusInfo.bgClass,
						)}
					>
						<StatusIcon className={cn("h-6 w-6", statusInfo.iconClass)} />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold">{statusInfo.title}</h3>
						<p className="text-sm text-muted-foreground">
							{statusInfo.description}
						</p>
						{lastChecked && (
							<p className="text-xs text-muted-foreground mt-2">
								Last checked: {lastChecked.toLocaleTimeString()}
								{isPolling &&
									status !== "failed" &&
									" • Checking every 15 seconds..."}
							</p>
						)}
						{timeElapsed > 0 && status === "connecting" && (
							<p className="text-xs text-muted-foreground">
								Time elapsed: {Math.floor(timeElapsed / 60)}:
								{(timeElapsed % 60).toString().padStart(2, "0")}
							</p>
						)}
					</div>
				</div>

				{/* Progress Bar */}
				{accounts.length > 0 &&
					status !== "verified" &&
					status !== "failed" && (
						<div className="space-y-2">
							<div className="h-2 bg-muted rounded-full overflow-hidden">
								<div
									className="h-full bg-primary transition-all duration-500"
									style={{
										width: `${(verifiedCount / accounts.length) * 100}%`,
									}}
								/>
							</div>
							<p className="text-xs text-muted-foreground text-center">
								{Math.round((verifiedCount / accounts.length) * 100)}% complete
							</p>
						</div>
					)}
			</div>

			{/* Manual Check Button */}
			{status !== "verified" && status !== "failed" && accounts.length > 0 && (
				<Button
					onClick={handleManualCheck}
					disabled={isChecking}
					variant="outline"
					className="w-full"
				>
					{isChecking ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Checking Status...
						</>
					) : (
						<>
							<RefreshCw className="mr-2 h-4 w-4" />
							Check Now
						</>
					)}
				</Button>
			)}

			{/* Connected Accounts */}
			{accounts.length > 0 && (
				<div className="space-y-3">
					<h4 className="text-sm font-medium">Connected Accounts</h4>
					<div className="space-y-2">
						{accounts.map((account) => (
							<div
								key={account.id}
								className={cn(
									"rounded-lg p-4 space-y-2 transition-colors",
									account.verified
										? "bg-green-500/10 ring-1 ring-green-500/20"
										: "bg-muted/40",
								)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex h-8 w-8 items-center justify-center rounded-full",
												account.verified ? "bg-green-500/20" : "bg-muted",
											)}
										>
											<Building2
												className={cn(
													"h-4 w-4",
													account.verified
														? "text-green-500"
														: "text-muted-foreground",
												)}
											/>
										</div>
										<div>
											<p className="text-sm font-medium">{account.name}</p>
											<p className="text-xs text-muted-foreground">
												{account.type} •••• {account.mask}
											</p>
										</div>
									</div>
									{account.verified ? (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									) : (
										<Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
									)}
								</div>

								{account.verified && (
									<p className="text-xs text-green-700 dark:text-green-400 font-medium">
										✓ Verified and ready for payments
									</p>
								)}

								{account.verificationStatus === "failed" && (
									<p className="text-xs text-destructive font-medium">
										✗ Verification failed - Please reconnect
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* What Plaid Accesses */}
			{status !== "failed" && (
				<div className="rounded-lg bg-blue-500/10 p-4 space-y-3">
					<div className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-500" />
						<span className="font-medium">
							What information does Plaid access?
						</span>
					</div>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>
							<strong className="text-foreground">Account details:</strong>{" "}
							Account name, type, and last 4 digits
						</p>
						<p>
							<strong className="text-foreground">Balance:</strong> Current
							available balance (for verification)
						</p>
						<p>
							<strong className="text-foreground">
								Routing/Account numbers:
							</strong>{" "}
							For setting up ACH payments
						</p>
						<p className="text-xs mt-2">
							Plaid uses bank-level encryption and never stores your login
							credentials. We cannot access your account without your
							permission.
						</p>
					</div>
				</div>
			)}

			{/* What Happens Next */}
			{status === "verifying" && (
				<div className="space-y-3">
					<h4 className="text-sm font-medium">What's happening now?</h4>
					<div className="space-y-3 text-sm text-muted-foreground">
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">1</span>
							</div>
							<p>
								Plaid is securely connecting to your bank to verify account
								ownership
							</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">2</span>
							</div>
							<p>
								Confirming account details and retrieving routing/account
								numbers
							</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">3</span>
							</div>
							<p>
								Setting up secure ACH payment capabilities for deposits and
								transfers
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Success Message */}
			{status === "verified" && (
				<div className="rounded-lg bg-green-500/10 p-4 space-y-2">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5 text-green-500" />
						<span className="font-medium text-green-700 dark:text-green-400">
							Bank successfully connected!
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						Your bank account{accounts.length > 1 ? "s are" : " is"} verified
						and ready. You can now:
					</p>
					<ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
						<li>Receive customer payments via ACH</li>
						<li>Set up automatic payouts to your bank</li>
						<li>Track transaction history in real-time</li>
					</ul>
				</div>
			)}

			{/* Error State */}
			{status === "failed" && (
				<div className="space-y-4">
					<div className="rounded-lg bg-destructive/10 p-4 space-y-3">
						<div className="flex items-start gap-3">
							<AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-destructive">
									Connection Failed
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									{error ||
										"We couldn't verify your bank connection. Please try again."}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Common issues:</h4>
						<ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
							<li>Bank login credentials were incorrect</li>
							<li>Bank requires multi-factor authentication</li>
							<li>Account is locked or restricted</li>
							<li>Bank is temporarily unavailable</li>
						</ul>
					</div>

					<Button variant="default" className="w-full">
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again with Plaid
					</Button>
				</div>
			)}

			{/* Troubleshooting */}
			{timeElapsed > 120 && status === "verifying" && (
				<div className="rounded-lg bg-amber-500/10 p-4 space-y-3">
					<div className="flex items-start gap-3">
						<AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium">
								Taking longer than expected?
							</p>
							<ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc ml-4">
								<li>Some banks take a few minutes to verify</li>
								<li>Make sure you completed the Plaid connection flow</li>
								<li>
									Check if you received an email from your bank to confirm the
									connection
								</li>
								<li>Try the "Check Now" button above to force a refresh</li>
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Security Note */}
			<div className="rounded-lg border border-muted p-4 space-y-2">
				<div className="flex items-center gap-2">
					<Info className="h-4 w-4" />
					<p className="text-sm font-medium">Your security is our priority</p>
				</div>
				<p className="text-xs text-muted-foreground">
					Plaid uses the same security protocols as banks. Your login
					credentials are encrypted and never stored by us or Plaid. You can
					disconnect your bank at any time from Settings.
				</p>
				<Button variant="link" size="sm" className="h-auto p-0">
					<ExternalLink className="mr-1 h-3 w-3" />
					Learn more about Plaid security
				</Button>
			</div>
		</div>
	);
}
