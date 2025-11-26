"use client";

import {
	AlertTriangle,
	Building,
	Calendar,
	Check,
	Clock,
	DollarSign,
	Loader2,
	Mail,
	MessageSquare,
	Phone,
	Shield,
	User,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Types matching the service
interface PendingAction {
	id: string;
	companyId: string;
	chatId: string;
	messageId: string;
	userId: string;
	toolName: string;
	toolArgs: Record<string, unknown>;
	actionType: string;
	affectedEntityType: string;
	affectedEntityIds: string[];
	affectedCount: number;
	riskLevel: "low" | "medium" | "high" | "critical";
	status:
		| "pending"
		| "approved"
		| "rejected"
		| "expired"
		| "executed"
		| "failed";
	expiresAt: string;
	createdAt: string;
}

interface OwnerActionApprovalDialogProps {
	pendingAction: PendingAction | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onApprove: (
		actionId: string,
	) => Promise<{ success: boolean; error?: string }>;
	onReject: (
		actionId: string,
		reason?: string,
	) => Promise<{ success: boolean; error?: string }>;
	isOwner: boolean;
	className?: string;
}

const riskLevelConfig = {
	low: {
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
		icon: Shield,
		label: "Low Risk",
	},
	medium: {
		color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
		icon: AlertTriangle,
		label: "Medium Risk",
	},
	high: {
		color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
		icon: AlertTriangle,
		label: "High Risk",
	},
	critical: {
		color: "bg-red-500/10 text-red-500 border-red-500/20",
		icon: AlertTriangle,
		label: "Critical Risk",
	},
};

const actionTypeIcons: Record<string, typeof Mail> = {
	send_communication: Mail,
	financial: DollarSign,
	delete: X,
	bulk_update: Building,
	bulk_delete: X,
	archive: Building,
};

function getToolIcon(actionType: string) {
	return actionTypeIcons[actionType] || AlertTriangle;
}

function formatToolArgs(
	toolArgs: Record<string, unknown>,
): { label: string; value: string }[] {
	const formatted: { label: string; value: string }[] = [];

	const labelMap: Record<string, string> = {
		to: "Recipient",
		recipient: "Recipient",
		subject: "Subject",
		body: "Message",
		message: "Message",
		customerId: "Customer ID",
		customer_id: "Customer ID",
		amount: "Amount",
		teamMemberId: "Team Member",
		vendorId: "Vendor",
		appointmentId: "Appointment",
		invoiceId: "Invoice",
	};

	for (const [key, value] of Object.entries(toolArgs)) {
		if (value === undefined || value === null) continue;

		const label =
			labelMap[key] ||
			key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
		let displayValue = String(value);

		// Format amounts (cents to dollars)
		if (key === "amount" && typeof value === "number") {
			displayValue = `$${(value / 100).toFixed(2)}`;
		}

		// Truncate long values
		if (displayValue.length > 200) {
			displayValue = displayValue.substring(0, 200) + "...";
		}

		formatted.push({ label, value: displayValue });
	}

	return formatted;
}

function formatTimeRemaining(expiresAt: string): string {
	const now = new Date();
	const expires = new Date(expiresAt);
	const diff = expires.getTime() - now.getTime();

	if (diff <= 0) return "Expired";

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 0) {
		return `${hours}h ${minutes}m remaining`;
	}
	return `${minutes}m remaining`;
}

export function OwnerActionApprovalDialog({
	pendingAction,
	isOpen,
	onOpenChange,
	onApprove,
	onReject,
	isOwner,
	className,
}: OwnerActionApprovalDialogProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [showRejectForm, setShowRejectForm] = useState(false);
	const [result, setResult] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	// Reset state when dialog opens/closes
	useEffect(() => {
		if (!isOpen) {
			setShowRejectForm(false);
			setRejectionReason("");
			setResult(null);
		}
	}, [isOpen]);

	if (!pendingAction) return null;

	const riskConfig = riskLevelConfig[pendingAction.riskLevel];
	const RiskIcon = riskConfig.icon;
	const ActionIcon = getToolIcon(pendingAction.actionType);
	const toolArgsFormatted = formatToolArgs(pendingAction.toolArgs);

	const handleApprove = async () => {
		if (!isOwner) {
			setResult({
				type: "error",
				message: "Only company owners can approve destructive actions.",
			});
			return;
		}

		setIsProcessing(true);
		setResult(null);

		try {
			const res = await onApprove(pendingAction.id);
			if (res.success) {
				setResult({
					type: "success",
					message: "Action approved! The AI will now execute this action.",
				});
				setTimeout(() => onOpenChange(false), 1500);
			} else {
				setResult({
					type: "error",
					message: res.error || "Failed to approve action.",
				});
			}
		} catch {
			setResult({
				type: "error",
				message: "An error occurred while approving the action.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReject = async () => {
		if (!isOwner) {
			setResult({
				type: "error",
				message: "Only company owners can reject destructive actions.",
			});
			return;
		}

		setIsProcessing(true);
		setResult(null);

		try {
			const res = await onReject(
				pendingAction.id,
				rejectionReason || undefined,
			);
			if (res.success) {
				setResult({
					type: "success",
					message: "Action rejected. The AI will not execute this action.",
				});
				setTimeout(() => onOpenChange(false), 1500);
			} else {
				setResult({
					type: "error",
					message: res.error || "Failed to reject action.",
				});
			}
		} catch {
			setResult({
				type: "error",
				message: "An error occurred while rejecting the action.",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className={cn("max-w-lg", className)}>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-primary" />
						Owner Approval Required
					</DialogTitle>
					<DialogDescription>
						The AI assistant wants to perform a destructive action that requires
						your approval.
					</DialogDescription>
				</DialogHeader>

				{result ? (
					<div className="flex flex-col items-center justify-center py-8">
						<div
							className={cn(
								"rounded-full p-3 mb-4",
								result.type === "success" ? "bg-green-500/10" : "bg-red-500/10",
							)}
						>
							{result.type === "success" ? (
								<Check className="h-8 w-8 text-green-500" />
							) : (
								<X className="h-8 w-8 text-red-500" />
							)}
						</div>
						<p className="text-center text-sm">{result.message}</p>
					</div>
				) : (
					<>
						{/* Risk Level Badge */}
						<div className="flex items-center justify-between">
							<Badge
								variant="outline"
								className={cn("flex items-center gap-1", riskConfig.color)}
							>
								<RiskIcon className="h-3 w-3" />
								{riskConfig.label}
							</Badge>
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<Clock className="h-3 w-3" />
								{formatTimeRemaining(pendingAction.expiresAt)}
							</div>
						</div>

						{/* Action Summary */}
						<div className="bg-muted/50 rounded-lg p-4 space-y-3">
							<div className="flex items-center gap-2">
								<ActionIcon className="h-5 w-5 text-muted-foreground" />
								<span className="font-medium">
									{pendingAction.toolName
										.replace(/([A-Z])/g, " $1")
										.replace(/^./, (s) => s.toUpperCase())}
								</span>
							</div>

							<Separator />

							{/* Tool Arguments */}
							<ScrollArea className="max-h-[200px]">
								<div className="space-y-2">
									{toolArgsFormatted.map(({ label, value }, idx) => (
										<div key={idx} className="grid grid-cols-3 gap-2 text-sm">
											<span className="text-muted-foreground">{label}:</span>
											<span className="col-span-2 break-words">{value}</span>
										</div>
									))}
								</div>
							</ScrollArea>

							{/* Affected Entities */}
							{pendingAction.affectedCount > 0 && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
									<User className="h-4 w-4" />
									<span>
										Affects {pendingAction.affectedCount}{" "}
										{pendingAction.affectedEntityType.replace(/_/g, " ")}
										{pendingAction.affectedCount > 1 ? "s" : ""}
									</span>
								</div>
							)}
						</div>

						{/* Owner Warning */}
						{!isOwner && (
							<div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg text-sm">
								<AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
								<p className="text-yellow-700 dark:text-yellow-300">
									Only company owners can approve or reject this action. Please
									contact an owner.
								</p>
							</div>
						)}

						{/* Rejection Reason Form */}
						{showRejectForm && (
							<div className="space-y-2">
								<Label htmlFor="rejection-reason">
									Reason for rejection (optional)
								</Label>
								<Textarea
									id="rejection-reason"
									placeholder="Why are you rejecting this action?"
									value={rejectionReason}
									onChange={(e) => setRejectionReason(e.target.value)}
									className="h-20 resize-none"
								/>
							</div>
						)}

						<DialogFooter className="flex-col sm:flex-row gap-2">
							{showRejectForm ? (
								<>
									<Button
										variant="ghost"
										onClick={() => setShowRejectForm(false)}
										disabled={isProcessing}
									>
										Back
									</Button>
									<Button
										variant="destructive"
										onClick={handleReject}
										disabled={isProcessing || !isOwner}
									>
										{isProcessing ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Rejecting...
											</>
										) : (
											<>
												<X className="h-4 w-4 mr-2" />
												Confirm Rejection
											</>
										)}
									</Button>
								</>
							) : (
								<>
									<Button
										variant="outline"
										onClick={() => setShowRejectForm(true)}
										disabled={isProcessing || !isOwner}
									>
										<X className="h-4 w-4 mr-2" />
										Reject
									</Button>
									<Button
										onClick={handleApprove}
										disabled={isProcessing || !isOwner}
										className="bg-green-600 hover:bg-green-700"
									>
										{isProcessing ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Approving...
											</>
										) : (
											<>
												<Check className="h-4 w-4 mr-2" />
												Approve Action
											</>
										)}
									</Button>
								</>
							)}
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

/**
 * Inline approval banner that appears in the chat when an action needs approval
 */
export function ActionApprovalBanner({
	pendingAction,
	onViewDetails,
	className,
}: {
	pendingAction: PendingAction;
	onViewDetails: () => void;
	className?: string;
}) {
	const riskConfig = riskLevelConfig[pendingAction.riskLevel];
	const RiskIcon = riskConfig.icon;

	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4 p-3 rounded-lg border",
				riskConfig.color,
				className,
			)}
		>
			<div className="flex items-center gap-3">
				<RiskIcon className="h-5 w-5 flex-shrink-0" />
				<div>
					<p className="text-sm font-medium">Action requires owner approval</p>
					<p className="text-xs opacity-80">
						{pendingAction.toolName.replace(/([A-Z])/g, " $1")} -{" "}
						{formatTimeRemaining(pendingAction.expiresAt)}
					</p>
				</div>
			</div>
			<Button size="sm" variant="outline" onClick={onViewDetails}>
				Review
			</Button>
		</div>
	);
}
