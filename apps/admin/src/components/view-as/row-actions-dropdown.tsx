"use client";

/**
 * Row Actions Dropdown
 *
 * Reusable dropdown menu for table row actions.
 * Shows context-aware admin actions based on resource type.
 */

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, DollarSign, UserCog, FileText, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import all action dialogs
import { UpdateJobStatusDialog, ReassignJobDialog, UpdateJobScheduleDialog, UpdateJobPriorityDialog, AddJobNoteDialog } from "./actions/job-actions";
import { IssueRefundDialog, RetryFailedPaymentDialog, MarkPaymentCompletedDialog, UpdatePaymentMethodDialog } from "./actions/payment-actions";
import { ResetPasswordDialog, ChangeRoleDialog, UpdateTeamStatusDialog, UpdateEmailDialog } from "./actions/team-actions";
import { UpdateInvoiceStatusDialog, VoidInvoiceDialog, UpdateDueDateDialog, SendReminderDialog } from "./actions/invoice-actions";

export type ResourceType = "job" | "payment" | "team" | "invoice";

interface RowActionsDropdownProps {
	resourceType: ResourceType;
	resourceId: string;
	resourceData?: any; // Optional data for context (e.g., max refund amount, team members list)
}

export function RowActionsDropdown({ resourceType, resourceId, resourceData }: RowActionsDropdownProps) {
	const [openDialog, setOpenDialog] = useState<string | null>(null);

	const handleOpenDialog = (dialogName: string) => {
		setOpenDialog(dialogName);
	};

	const handleCloseDialog = () => {
		setOpenDialog(null);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					{resourceType === "job" && (
						<>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateStatus")}>
								<Edit className="mr-2 h-4 w-4" />
								Update Status
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("reassign")}>
								<UserCog className="mr-2 h-4 w-4" />
								Reassign Job
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateSchedule")}>
								<Clock className="mr-2 h-4 w-4" />
								Update Schedule
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("updatePriority")}>
								<AlertCircle className="mr-2 h-4 w-4" />
								Update Priority
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleOpenDialog("addNote")}>
								<FileText className="mr-2 h-4 w-4" />
								Add Support Note
							</DropdownMenuItem>
						</>
					)}

					{resourceType === "payment" && (
						<>
							<DropdownMenuItem onClick={() => handleOpenDialog("issueRefund")} className="text-destructive">
								<DollarSign className="mr-2 h-4 w-4" />
								Issue Refund
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("retryPayment")}>
								<AlertCircle className="mr-2 h-4 w-4" />
								Retry Payment
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("markCompleted")}>
								<Edit className="mr-2 h-4 w-4" />
								Mark as Completed
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateMethod")}>
								<FileText className="mr-2 h-4 w-4" />
								Update Payment Method
							</DropdownMenuItem>
						</>
					)}

					{resourceType === "team" && (
						<>
							<DropdownMenuItem onClick={() => handleOpenDialog("resetPassword")} className="text-destructive">
								<AlertCircle className="mr-2 h-4 w-4" />
								Reset Password
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("changeRole")}>
								<UserCog className="mr-2 h-4 w-4" />
								Change Role
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateStatus")}>
								<Edit className="mr-2 h-4 w-4" />
								Update Status
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateEmail")}>
								<FileText className="mr-2 h-4 w-4" />
								Update Email
							</DropdownMenuItem>
						</>
					)}

					{resourceType === "invoice" && (
						<>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateStatus")}>
								<Edit className="mr-2 h-4 w-4" />
								Update Status
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("void")} className="text-destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Void Invoice
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("updateDueDate")}>
								<Clock className="mr-2 h-4 w-4" />
								Update Due Date
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("sendReminder")}>
								<FileText className="mr-2 h-4 w-4" />
								Send Reminder
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Job Dialogs */}
			{resourceType === "job" && (
				<>
					<UpdateJobStatusDialog jobId={resourceId} open={openDialog === "updateStatus"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<ReassignJobDialog jobId={resourceId} open={openDialog === "reassign"} onOpenChange={(open) => !open && handleCloseDialog()} teamMembers={resourceData?.teamMembers} />
					<UpdateJobScheduleDialog jobId={resourceId} open={openDialog === "updateSchedule"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<UpdateJobPriorityDialog jobId={resourceId} open={openDialog === "updatePriority"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<AddJobNoteDialog jobId={resourceId} open={openDialog === "addNote"} onOpenChange={(open) => !open && handleCloseDialog()} />
				</>
			)}

			{/* Payment Dialogs */}
			{resourceType === "payment" && (
				<>
					<IssueRefundDialog paymentId={resourceId} open={openDialog === "issueRefund"} onOpenChange={(open) => !open && handleCloseDialog()} maxRefundAmount={resourceData?.maxRefundAmount} />
					<RetryFailedPaymentDialog paymentId={resourceId} open={openDialog === "retryPayment"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<MarkPaymentCompletedDialog paymentId={resourceId} open={openDialog === "markCompleted"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<UpdatePaymentMethodDialog paymentId={resourceId} open={openDialog === "updateMethod"} onOpenChange={(open) => !open && handleCloseDialog()} />
				</>
			)}

			{/* Team Dialogs */}
			{resourceType === "team" && (
				<>
					<ResetPasswordDialog teamMemberId={resourceId} open={openDialog === "resetPassword"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<ChangeRoleDialog teamMemberId={resourceId} open={openDialog === "changeRole"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<UpdateTeamStatusDialog teamMemberId={resourceId} open={openDialog === "updateStatus"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<UpdateEmailDialog teamMemberId={resourceId} open={openDialog === "updateEmail"} onOpenChange={(open) => !open && handleCloseDialog()} />
				</>
			)}

			{/* Invoice Dialogs */}
			{resourceType === "invoice" && (
				<>
					<UpdateInvoiceStatusDialog invoiceId={resourceId} open={openDialog === "updateStatus"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<VoidInvoiceDialog invoiceId={resourceId} open={openDialog === "void"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<UpdateDueDateDialog invoiceId={resourceId} open={openDialog === "updateDueDate"} onOpenChange={(open) => !open && handleCloseDialog()} />
					<SendReminderDialog invoiceId={resourceId} open={openDialog === "sendReminder"} onOpenChange={(open) => !open && handleCloseDialog()} />
				</>
			)}
		</>
	);
}
