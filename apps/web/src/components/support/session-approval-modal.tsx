"use client";

/**
 * Support Session Approval Modal
 *
 * Modal that appears when support requests access to the company account.
 * Customer can approve (with duration) or deny the request.
 */

import { AlertCircle, Clock, Shield, Ticket, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	approveSupportSessionRequest,
	rejectSupportSessionRequest,
} from "@/actions/support-sessions";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SupportSession {
	id: string;
	admin_user_id: string;
	ticket_id: string | null;
	reason: string;
	requested_at: string;
	requested_permissions: string[];
	admin_name?: string;
	admin_email?: string;
}

interface SessionApprovalModalProps {
	session: SupportSession | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onApproved?: () => void;
	onRejected?: () => void;
}

export function SessionApprovalModal({
	session,
	open,
	onOpenChange,
	onApproved,
	onRejected,
}: SessionApprovalModalProps) {
	const [isApproving, setIsApproving] = useState(false);
	const [isRejecting, setIsRejecting] = useState(false);
	const [duration, setDuration] = useState("60"); // minutes

	if (!session) return null;

	const handleApprove = async () => {
		setIsApproving(true);
		try {
			const result = await approveSupportSessionRequest(
				session.id,
				parseInt(duration),
			);

			if (result.success) {
				toast.success("Support access approved", {
					description: `Access granted for ${duration} minutes`,
				});
				onOpenChange(false);
				onApproved?.();
			} else {
				toast.error("Failed to approve access", {
					description: result.error || "Please try again",
				});
			}
		} catch (error) {
			toast.error("Error approving access");
			console.error(error);
		} finally {
			setIsApproving(false);
		}
	};

	const handleReject = async () => {
		setIsRejecting(true);
		try {
			const result = await rejectSupportSessionRequest(
				session.id,
				"Declined by customer",
			);

			if (result.success) {
				toast.success("Support access denied");
				onOpenChange(false);
				onRejected?.();
			} else {
				toast.error("Failed to deny access", {
					description: result.error || "Please try again",
				});
			}
		} catch (error) {
			toast.error("Error denying access");
			console.error(error);
		} finally {
			setIsRejecting(false);
		}
	};

	// Format permissions for display
	const permissionLabels: Record<string, string> = {
		view: "View your account data",
		edit_jobs: "Modify jobs",
		edit_invoices: "Modify invoices",
		edit_payments: "Manage payments",
		refund: "Issue refunds",
		edit_team: "Manage team members",
		reset_password: "Reset passwords",
		edit_company: "Update company settings",
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-2">
						<div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-2">
							<Shield className="h-5 w-5 text-orange-600" />
						</div>
						<DialogTitle>Support Access Request</DialogTitle>
					</div>
					<DialogDescription>
						A support team member is requesting access to your account to assist
						you.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Admin Info */}
					<div className="rounded-lg border bg-muted/50 p-4 space-y-3">
						<div className="flex items-center gap-2">
							<User className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								Support Representative
							</span>
						</div>
						<p className="text-sm text-muted-foreground">
							{session.admin_name ||
								session.admin_email ||
								session.admin_user_id}
						</p>

						{session.ticket_id && (
							<div className="flex items-center gap-2 pt-2 border-t">
								<Ticket className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									Ticket: <span className="font-mono">{session.ticket_id}</span>
								</span>
							</div>
						)}
					</div>

					{/* Reason */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Reason for Access</label>
						<p className="text-sm text-muted-foreground rounded-md border p-3 bg-muted/30">
							{session.reason}
						</p>
					</div>

					{/* Permissions */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Requested Permissions</label>
						<div className="space-y-1">
							{session.requested_permissions.map((permission) => (
								<div
									key={permission}
									className="flex items-center gap-2 text-sm"
								>
									<div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
									<span>{permissionLabels[permission] || permission}</span>
								</div>
							))}
						</div>
					</div>

					{/* Duration Selector */}
					<div className="space-y-2">
						<label className="text-sm font-medium flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Access Duration
						</label>
						<Select value={duration} onValueChange={setDuration}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="30">30 minutes</SelectItem>
								<SelectItem value="60">1 hour (recommended)</SelectItem>
								<SelectItem value="120">2 hours</SelectItem>
								<SelectItem value="240">4 hours</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">
							Support access will automatically expire after this time.
						</p>
					</div>

					{/* Security Notice */}
					<div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-3 space-y-1">
						<div className="flex items-start gap-2">
							<AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
							<div className="space-y-1">
								<p className="text-xs font-medium text-orange-900 dark:text-orange-100">
									Security Notice
								</p>
								<p className="text-xs text-orange-800 dark:text-orange-200">
									All actions taken by support will be logged and visible in
									your account audit trail.
								</p>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleReject}
						disabled={isApproving || isRejecting}
						className="w-full sm:w-auto"
					>
						{isRejecting ? "Denying..." : "Deny Access"}
					</Button>
					<Button
						type="button"
						onClick={handleApprove}
						disabled={isApproving || isRejecting}
						className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
					>
						{isApproving
							? "Approving..."
							: `Approve for ${duration === "60" ? "1 hour" : duration === "30" ? "30 min" : duration === "120" ? "2 hours" : "4 hours"}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
