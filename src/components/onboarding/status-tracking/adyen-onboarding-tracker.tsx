"use client";

/**
 * Adyen Onboarding Tracker
 *
 * Comprehensive tracking for Adyen merchant onboarding and KYC verification (days to weeks)
 * - Polls API every 60 seconds for status updates
 * - Shows current onboarding stage
 * - Displays required documents and verification status
 * - Educational content on KYC requirements
 * - Troubleshooting help if verification fails
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Clock,
	AlertCircle,
	Info,
	Loader2,
	RefreshCw,
	Building2,
	FileText,
	Shield,
	ExternalLink,
	AlertTriangle,
	Calendar,
	Upload,
	CheckCircle,
	Circle,
} from "lucide-react";

interface AdyenDocument {
	id: string;
	type: string;
	description: string;
	required: boolean;
	uploaded: boolean;
	verified: boolean;
	rejectionReason?: string;
}

interface AdyenOnboardingTrackerProps {
	companyId: string;
	accountHolderId?: string; // Adyen account holder ID
	onOnboardingComplete?: () => void;
}

type OnboardingStatus =
	| "draft"
	| "pending"
	| "in_review"
	| "documents_requested"
	| "verified"
	| "rejected"
	| "suspended";

const STATUS_INFO: Record<
	OnboardingStatus,
	{
		label: string;
		description: string;
		icon: React.ElementType;
		color: string;
		bgClass: string;
	}
> = {
	draft: {
		label: "Draft",
		description: "Account created, not yet submitted",
		icon: Circle,
		color: "text-muted-foreground",
		bgClass: "bg-muted",
	},
	pending: {
		label: "Pending Review",
		description: "Waiting for Adyen to begin verification",
		icon: Clock,
		color: "text-amber-500",
		bgClass: "bg-amber-500/10",
	},
	in_review: {
		label: "Under Review",
		description: "Adyen is verifying your business information",
		icon: Loader2,
		color: "text-blue-500 animate-spin",
		bgClass: "bg-blue-500/10",
	},
	documents_requested: {
		label: "Documents Needed",
		description: "Additional documents required",
		icon: Upload,
		color: "text-amber-500",
		bgClass: "bg-amber-500/10",
	},
	verified: {
		label: "Verified",
		description: "Your account is approved and active!",
		icon: CheckCircle2,
		color: "text-green-500",
		bgClass: "bg-green-500/10",
	},
	rejected: {
		label: "Rejected",
		description: "Verification was unsuccessful",
		icon: AlertCircle,
		color: "text-destructive",
		bgClass: "bg-destructive/10",
	},
	suspended: {
		label: "Suspended",
		description: "Account has been suspended",
		icon: AlertCircle,
		color: "text-destructive",
		bgClass: "bg-destructive/10",
	},
};

const TIMELINE_STAGES = [
	{ id: "pending", label: "Submitted" },
	{ id: "in_review", label: "In Review" },
	{ id: "documents_requested", label: "Documents" },
	{ id: "verified", label: "Approved" },
];

export function AdyenOnboardingTracker({
	companyId,
	accountHolderId,
	onOnboardingComplete,
}: AdyenOnboardingTrackerProps) {
	const [status, setStatus] = useState<OnboardingStatus>("pending");
	const [documents, setDocuments] = useState<AdyenDocument[]>([]);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);
	const [isPolling, setIsPolling] = useState(true);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [estimatedCompletionDate, setEstimatedCompletionDate] = useState<Date | null>(null);
	const [daysSinceSubmission, setDaysSinceSubmission] = useState(0);

	const uploadedDocsCount = documents.filter((d) => d.uploaded).length;
	const verifiedDocsCount = documents.filter((d) => d.verified).length;

	// Poll API every 60 seconds for onboarding status
	useEffect(() => {
		if (!isPolling || status === "verified" || status === "rejected") return;

		const checkStatus = async () => {
			setIsChecking(true);
			try {
				const response = await fetch(
					`/api/payments/adyen-onboarding-status?companyId=${encodeURIComponent(companyId)}` +
					(accountHolderId ? `&accountHolderId=${encodeURIComponent(accountHolderId)}` : "")
				);
				const data = await response.json();

				if (data.success) {
					setStatus(data.status);
					setDocuments(data.documents || []);
					setLastChecked(new Date());

					if (data.estimatedCompletionDate) {
						setEstimatedCompletionDate(new Date(data.estimatedCompletionDate));
					}

					if (data.daysSinceSubmission !== undefined) {
						setDaysSinceSubmission(data.daysSinceSubmission);
					}

					// Stop polling if verified or rejected
					if (data.status === "verified") {
						setIsPolling(false);
						onOnboardingComplete?.();
					} else if (data.status === "rejected") {
						setIsPolling(false);
						setError(data.error || "Verification was rejected");
					}
				} else if (!data.success) {
					setError(data.error || "Failed to check onboarding status");
				}
			} catch (err) {
				console.error("Adyen onboarding check failed:", err);
				setError("Unable to check status. We'll keep trying...");
			} finally {
				setIsChecking(false);
			}
		};

		// Initial check
		checkStatus();

		// Poll every 60 seconds
		const interval = setInterval(checkStatus, 60000);

		return () => clearInterval(interval);
	}, [companyId, accountHolderId, isPolling, status, onOnboardingComplete]);

	const handleManualCheck = async () => {
		setIsChecking(true);
		try {
			const response = await fetch(
				`/api/payments/adyen-onboarding-status?companyId=${encodeURIComponent(companyId)}` +
				(accountHolderId ? `&accountHolderId=${encodeURIComponent(accountHolderId)}` : "")
			);
			const data = await response.json();

			if (data.success) {
				setStatus(data.status);
				setDocuments(data.documents || []);
				setLastChecked(new Date());

				if (data.status === "verified") {
					setIsPolling(false);
					onOnboardingComplete?.();
				}
			}
		} catch (err) {
			console.error("Manual check failed:", err);
		} finally {
			setIsChecking(false);
		}
	};

	const getCurrentStageIndex = () => {
		const stageOrder = ["pending", "in_review", "documents_requested", "verified"];
		let currentIndex = stageOrder.indexOf(status);

		// If we're past documents_requested and haven't hit verified, stay at in_review
		if (status === "pending" || status === "in_review") {
			return currentIndex;
		} else if (status === "documents_requested") {
			return 2; // Documents stage
		} else if (status === "verified") {
			return 3; // Approved stage
		}

		return 1; // Default to in_review
	};

	const statusInfo = STATUS_INFO[status];
	const StatusIcon = statusInfo.icon;
	const currentStageIndex = getCurrentStageIndex();

	return (
		<div className="space-y-6">
			{/* Status Header */}
			<div className="rounded-lg bg-muted/40 p-6 space-y-4">
				<div className="flex items-start gap-4">
					<div className={cn("flex h-12 w-12 items-center justify-center rounded-full", statusInfo.bgClass)}>
						<StatusIcon className={cn("h-6 w-6", statusInfo.color)} />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold">{statusInfo.label}</h3>
						<p className="text-sm text-muted-foreground">{statusInfo.description}</p>
						{lastChecked && (
							<p className="text-xs text-muted-foreground mt-2">
								Last checked: {lastChecked.toLocaleTimeString()}
								{isPolling && status !== "verified" && status !== "rejected" && " • Checking every 60 seconds..."}
							</p>
						)}
						{daysSinceSubmission > 0 && status !== "verified" && (
							<p className="text-xs text-muted-foreground">
								Days since submission: {daysSinceSubmission}
							</p>
						)}
					</div>
				</div>

				{/* Timeline */}
				{status !== "rejected" && status !== "suspended" && (
					<div className="flex items-center justify-between gap-2 pt-4">
						{TIMELINE_STAGES.map((stage, index) => {
							const isComplete = index < currentStageIndex;
							const isCurrent = index === currentStageIndex;

							return (
								<div key={stage.id} className="flex items-center gap-2 flex-1">
									<div className="flex flex-col items-center gap-1 min-w-0">
										<div
											className={cn(
												"flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
												isComplete && "bg-green-500 text-white",
												isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
												!isComplete && !isCurrent && "bg-muted text-muted-foreground"
											)}
										>
											{isComplete ? <CheckCircle className="h-4 w-4" /> : index + 1}
										</div>
										<span className="text-xs text-center font-medium">{stage.label}</span>
									</div>
									{index < TIMELINE_STAGES.length - 1 && (
										<div
											className={cn(
												"h-0.5 flex-1",
												isComplete ? "bg-green-500" : "bg-muted"
											)}
										/>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Manual Check Button */}
			{status !== "verified" && status !== "rejected" && (
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

			{/* Estimated Completion */}
			{estimatedCompletionDate && status !== "verified" && status !== "rejected" && (
				<div className="rounded-lg bg-blue-500/10 p-4 space-y-2">
					<div className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-blue-500" />
						<span className="font-medium">Estimated completion</span>
					</div>
					<p className="text-sm text-muted-foreground">
						{estimatedCompletionDate.toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
					<p className="text-xs text-muted-foreground">
						Verification typically takes 3-7 business days. Complex cases may take longer.
					</p>
				</div>
			)}

			{/* Required Documents */}
			{documents.length > 0 && status === "documents_requested" && (
				<div className="space-y-3">
					<h4 className="text-sm font-medium">Required Documents</h4>
					<div className="space-y-2">
						{documents.map((doc) => (
							<div
								key={doc.id}
								className={cn(
									"rounded-lg p-4 space-y-2 transition-colors",
									doc.verified ? "bg-green-500/10 ring-1 ring-green-500/20" :
									doc.uploaded ? "bg-blue-500/10 ring-1 ring-blue-500/20" :
									"bg-muted/40"
								)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div
											className={cn(
												"flex h-8 w-8 items-center justify-center rounded-full",
												doc.verified ? "bg-green-500/20" :
												doc.uploaded ? "bg-blue-500/20" :
												"bg-muted"
											)}
										>
											<FileText
												className={cn(
													"h-4 w-4",
													doc.verified ? "text-green-500" :
													doc.uploaded ? "text-blue-500" :
													"text-muted-foreground"
												)}
											/>
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium">{doc.type}</p>
											<p className="text-xs text-muted-foreground">{doc.description}</p>
										</div>
									</div>
									{doc.verified ? (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									) : doc.uploaded ? (
										<Clock className="h-5 w-5 text-blue-500" />
									) : (
										<Upload className="h-5 w-5 text-amber-500" />
									)}
								</div>

								{doc.verified && (
									<p className="text-xs text-green-700 dark:text-green-400 font-medium">
										✓ Document verified
									</p>
								)}

								{doc.uploaded && !doc.verified && (
									<p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
										⏳ Under review
									</p>
								)}

								{!doc.uploaded && doc.required && (
									<Button variant="outline" size="sm" className="w-full">
										<Upload className="mr-2 h-3 w-3" />
										Upload {doc.type}
									</Button>
								)}

								{doc.rejectionReason && (
									<div className="text-xs text-destructive bg-destructive/10 rounded p-2">
										<strong>Rejected:</strong> {doc.rejectionReason}
									</div>
								)}
							</div>
						))}
					</div>
					<p className="text-xs text-muted-foreground">
						{uploadedDocsCount} of {documents.length} documents uploaded •
						{verifiedDocsCount} verified
					</p>
				</div>
			)}

			{/* What's Being Verified */}
			{(status === "pending" || status === "in_review") && (
				<div className="rounded-lg bg-blue-500/10 p-4 space-y-3">
					<div className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-500" />
						<span className="font-medium">What Adyen is verifying</span>
					</div>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>
							<strong className="text-foreground">Business identity:</strong> Legal name, address, tax ID
						</p>
						<p>
							<strong className="text-foreground">Ownership:</strong> Beneficial owners and control persons
						</p>
						<p>
							<strong className="text-foreground">Banking:</strong> Account details and validation
						</p>
						<p>
							<strong className="text-foreground">Compliance:</strong> Anti-money laundering (AML) checks
						</p>
					</div>
				</div>
			)}

			{/* What Happens Next */}
			{status === "in_review" && (
				<div className="space-y-3">
					<h4 className="text-sm font-medium">What happens next?</h4>
					<div className="space-y-3 text-sm text-muted-foreground">
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">1</span>
							</div>
							<p>
								Adyen's compliance team is reviewing your business information and documentation
							</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">2</span>
							</div>
							<p>
								They may request additional documents if needed. You'll receive an email notification.
							</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
								<span className="text-xs font-medium text-primary">3</span>
							</div>
							<p>
								Once verified, your account will be activated and you can start processing high-value payments.
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
							Merchant account verified!
						</span>
					</div>
					<p className="text-sm text-muted-foreground">
						Your Adyen account is approved and ready. You can now:
					</p>
					<ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
						<li>Accept credit and debit card payments</li>
						<li>Process high-value transactions (&gt;$10k)</li>
						<li>Use Tap-to-Pay for card-present payments</li>
						<li>Accept ACH payments through Adyen</li>
					</ul>
				</div>
			)}

			{/* Rejection State */}
			{status === "rejected" && (
				<div className="space-y-4">
					<div className="rounded-lg bg-destructive/10 p-4 space-y-3">
						<div className="flex items-start gap-3">
							<AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-destructive">Verification Unsuccessful</p>
								<p className="text-sm text-muted-foreground mt-1">
									{error || "Your merchant account application was not approved."}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Common reasons for rejection:</h4>
						<ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
							<li>Incomplete or inaccurate business information</li>
							<li>High-risk industry classification</li>
							<li>Insufficient business documentation</li>
							<li>Issues with beneficial owner verification</li>
							<li>Business not meeting Adyen's requirements</li>
						</ul>
					</div>

					<Button variant="default" className="w-full">
						<ExternalLink className="mr-2 h-4 w-4" />
						Contact Adyen Support
					</Button>
				</div>
			)}

			{/* Troubleshooting */}
			{daysSinceSubmission > 7 && status === "in_review" && (
				<div className="rounded-lg bg-amber-500/10 p-4 space-y-3">
					<div className="flex items-start gap-3">
						<AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-medium">Taking longer than expected?</p>
							<ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc ml-4">
								<li>Complex business structures can take longer to verify</li>
								<li>Check your email for any document requests from Adyen</li>
								<li>International businesses may require additional verification</li>
								<li>You can contact Adyen support for a status update</li>
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Security Note */}
			<div className="rounded-lg border border-muted p-4 space-y-2">
				<div className="flex items-center gap-2">
					<Info className="h-4 w-4" />
					<p className="text-sm font-medium">About KYC verification</p>
				</div>
				<p className="text-xs text-muted-foreground">
					Know Your Customer (KYC) verification is required by financial regulations to prevent fraud and money
					laundering. All payment processors require this for merchant accounts. Your information is securely
					encrypted and only used for verification purposes.
				</p>
				<Button variant="link" size="sm" className="h-auto p-0">
					<ExternalLink className="mr-1 h-3 w-3" />
					Learn more about Adyen's verification process
				</Button>
			</div>
		</div>
	);
}
