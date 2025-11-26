"use client";

/**
 * Payment Action Components
 *
 * Dialog components for payment management actions.
 */

import { ActionDialog, type FormField } from "../action-dialog";
import {
	issuePaymentRefund,
	retryFailedPayment,
	markPaymentCompleted,
	updatePaymentMethod,
} from "@/actions/admin-payments";

interface PaymentActionDialogProps {
	paymentId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/**
 * Issue Payment Refund Dialog
 */
interface IssueRefundDialogProps extends PaymentActionDialogProps {
	maxRefundAmount?: number; // in cents
}

export function IssueRefundDialog({
	paymentId,
	open,
	onOpenChange,
	maxRefundAmount = 0,
}: IssueRefundDialogProps) {
	const maxDollars = (maxRefundAmount / 100).toFixed(2);

	const fields: FormField[] = [
		{
			name: "refundAmount",
			label: `Refund Amount (max: $${maxDollars})`,
			type: "number",
			required: true,
			placeholder: "0.00",
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Issue Payment Refund"
			description={`Issue a full or partial refund for this payment. Maximum refund available: $${maxDollars}`}
			fields={fields}
			requireReason={true}
			actionLabel="Issue Refund"
			isDestructive={true}
			onSubmit={async (data) => {
				// Convert dollars to cents
				const refundCents = Math.round(parseFloat(data.refundAmount) * 100);
				return await issuePaymentRefund(paymentId, refundCents, data.reason);
			}}
		/>
	);
}

/**
 * Retry Failed Payment Dialog
 */
export function RetryFailedPaymentDialog({
	paymentId,
	open,
	onOpenChange,
}: PaymentActionDialogProps) {
	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Retry Failed Payment"
			description="Retry processing this failed payment. This will mark the payment as pending and attempt to process it again."
			fields={[]}
			requireReason={true}
			actionLabel="Retry Payment"
			onSubmit={async (data) => {
				return await retryFailedPayment(paymentId, data.reason);
			}}
		/>
	);
}

/**
 * Mark Payment Completed Dialog
 */
export function MarkPaymentCompletedDialog({
	paymentId,
	open,
	onOpenChange,
}: PaymentActionDialogProps) {
	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Mark Payment as Completed"
			description="Manually mark this payment as completed. Use this for offline payments (cash, check, etc.) that were processed outside the system."
			fields={[]}
			requireReason={true}
			actionLabel="Mark as Completed"
			onSubmit={async (data) => {
				return await markPaymentCompleted(paymentId, data.reason);
			}}
		/>
	);
}

/**
 * Update Payment Method Dialog
 */
export function UpdatePaymentMethodDialog({
	paymentId,
	open,
	onOpenChange,
}: PaymentActionDialogProps) {
	const fields: FormField[] = [
		{
			name: "paymentMethod",
			label: "Payment Method",
			type: "select",
			required: true,
			options: [
				{ value: "cash", label: "Cash" },
				{ value: "check", label: "Check" },
				{ value: "credit_card", label: "Credit Card" },
				{ value: "debit_card", label: "Debit Card" },
				{ value: "ach", label: "ACH / Bank Transfer" },
				{ value: "wire", label: "Wire Transfer" },
				{ value: "other", label: "Other" },
			],
		},
	];

	return (
		<ActionDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Update Payment Method"
			description="Change the payment method recorded for this payment."
			fields={fields}
			requireReason={true}
			actionLabel="Update Method"
			onSubmit={async (data) => {
				return await updatePaymentMethod(
					paymentId,
					data.paymentMethod,
					data.reason,
				);
			}}
		/>
	);
}
