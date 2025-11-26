"use client";

/**
 * Invoice Action Components
 *
 * Dialog components for invoice management actions.
 */

import { ActionDialog, type FormField } from "../action-dialog";
import {
	updateInvoiceStatus,
	voidInvoice,
	updateInvoiceDueDate,
	sendInvoiceReminder,
} from "@/actions/admin-invoices";

interface InvoiceActionDialogProps {
	invoiceId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Update Invoice Status Dialog
 */
export function UpdateInvoiceStatusDialog({
	invoiceId,
	open,
	onOpenChange,
}: InvoiceActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "status",
			label: "New Status",
			type: "select",
			required: true,
			options: [
				{ value: "draft", label: "Draft" },
				{ value: "sent", label: "Sent" },
				{ value: "viewed", label: "Viewed" },
				{ value: "paid", label: "Paid" },
				{ value: "overdue", label: "Overdue" },
				{ value: "cancelled", label: "Cancelled" },
			],
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Invoice Status"
			description="Change the status of this invoice."
			fields={fields}
			requireReason={true}
			actionLabel="Update Status"
			onSubmit={async (data) => {
				return await updateInvoiceStatus(invoiceId, data.status, data.reason);
			}}
		/>
	);
}

/**
 * Void Invoice Dialog
 */
export function VoidInvoiceDialog({
	invoiceId,
	open,
	onOpenChange,
}: InvoiceActionDialogProps) {
	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Void Invoice"
			description="Cancel this invoice. This action cannot be undone. Note: You cannot void a paid invoice - issue a refund instead."
			fields={[]}
			requireReason={true}
			actionLabel="Void Invoice"
			isDestructive={true}
			onSubmit={async (data) => {
				return await voidInvoice(invoiceId, data.reason);
			}}
		/>
	);
}

/**
 * Update Due Date Dialog
 */
export function UpdateDueDateDialog({
	invoiceId,
	open,
	onOpenChange,
}: InvoiceActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "dueDate",
			label: "New Due Date",
			type: "date",
			required: true,
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Invoice Due Date"
			description="Change the due date for this invoice."
			fields={fields}
			requireReason={true}
			actionLabel="Update Due Date"
			onSubmit={async (data) => {
				return await updateInvoiceDueDate(invoiceId, data.dueDate, data.reason);
			}}
		/>
	);
}

/**
 * Send Reminder Dialog
 */
export function SendReminderDialog({
	invoiceId,
	open,
	onOpenChange,
}: InvoiceActionDialogProps) {
	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Send Invoice Reminder"
			description="Manually send a payment reminder email to the customer for this invoice."
			fields={[]}
			requireReason={false}
			actionLabel="Send Reminder"
			onSubmit={async (data) => {
				return await sendInvoiceReminder(invoiceId, data.reason);
			}}
		/>
	);
}
