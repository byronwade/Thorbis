/**
 * Subscription Payment Failed Email Template
 *
 * Features:
 * - Clear problem explanation
 * - Grace period countdown
 * - Update payment method CTA
 * - What happens if payment isn't resolved
 */

import { Text } from "@react-email/components";
import type { SubscriptionPaymentFailedProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function SubscriptionPaymentFailedEmail({
	companyName,
	ownerName,
	failedAt,
	attemptCount,
	lastFourDigits,
	paymentMethod,
	amountDue,
	gracePeriodEnds,
	daysRemainingInGrace,
	updatePaymentUrl,
	previewText = "Action required: Your payment method couldn't be charged",
}: SubscriptionPaymentFailedProps) {
	const isUrgent = daysRemainingInGrace <= 2;

	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Payment Failed</Heading>

			<Text style={paragraph}>Hi {ownerName},</Text>

			<Text style={paragraph}>
				We weren't able to process your payment for {companyName}'s Thorbis
				subscription. Don't worry — your account is still active, but we need
				you to update your payment information to keep things running smoothly.
			</Text>

			<Card style={isUrgent ? urgentCard : alertCard}>
				<div style={alertHeader}>
					<Text style={alertLabel}>Action Required</Text>
					<Text style={alertTitle}>Payment Unsuccessful</Text>
				</div>

				<div style={paymentDetails}>
					<div style={detailRow}>
						<Text style={detailLabel}>Failed On:</Text>
						<Text style={detailValue}>{failedAt}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Payment Method:</Text>
						<Text style={detailValue}>
							{paymentMethod} ending in {lastFourDigits}
						</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Amount Due:</Text>
						<Text style={amountStyle}>{amountDue}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Attempt:</Text>
						<Text style={detailValue}>#{attemptCount}</Text>
					</div>
				</div>

				{daysRemainingInGrace > 0 && (
					<div style={graceNotice}>
						<Text style={graceLabel}>Grace period ends in</Text>
						<Text style={graceDays}>
							{daysRemainingInGrace} day{daysRemainingInGrace !== 1 ? "s" : ""}
						</Text>
						<Text style={graceDate}>{gracePeriodEnds}</Text>
					</div>
				)}
			</Card>

			<div style={buttonContainer}>
				<Button href={updatePaymentUrl}>Update Payment Method</Button>
			</div>

			<Card style={infoCard}>
				<Heading level={3}>Common reasons for payment failure:</Heading>
				<ul style={reasonsList}>
					<li style={reasonItem}>Card expired or canceled</li>
					<li style={reasonItem}>Insufficient funds</li>
					<li style={reasonItem}>Bank declined the transaction</li>
					<li style={reasonItem}>
						Card security settings blocking subscription payments
					</li>
				</ul>
			</Card>

			<Card style={warningCard}>
				<Heading level={3}>What happens if payment isn't resolved?</Heading>
				<ul style={consequencesList}>
					<li style={consequenceItem}>
						<strong>During grace period:</strong> Your account remains fully
						functional.
					</li>
					<li style={consequenceItem}>
						<strong>After grace period:</strong> Your account will be restricted.
						You won't be able to create new jobs or invoices.
					</li>
					<li style={consequenceItem}>
						<strong>Your data is safe:</strong> We never delete your data. Once
						payment is resolved, full access is restored immediately.
					</li>
				</ul>
			</Card>

			<Text style={footerNote}>
				Need help? Contact our billing team at{" "}
				<a href="mailto:billing@thorbis.com" style={link}>
					billing@thorbis.com
				</a>{" "}
				or call{" "}
				<a href="tel:+1234567890" style={link}>
					(123) 456-7890
				</a>
			</Text>
		</BaseLayout>
	);
}

const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 16px 0",
};

const alertCard = {
	backgroundColor: "#fef2f2",
	border: "2px solid #fca5a5",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
};

const urgentCard = {
	backgroundColor: "#fef2f2",
	border: "3px solid #dc2626",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
};

const alertHeader = {
	textAlign: "center" as const,
	marginBottom: "24px",
	paddingBottom: "20px",
	borderBottom: "1px solid #fca5a5",
};

const alertLabel = {
	color: "#991b1b",
	fontSize: "12px",
	textTransform: "uppercase" as const,
	letterSpacing: "0.1em",
	margin: "0 0 8px 0",
};

const alertTitle = {
	color: "#dc2626",
	fontSize: "24px",
	fontWeight: "700",
	margin: "0",
};

const paymentDetails = {
	backgroundColor: EMAIL_COLORS.surface,
	borderRadius: "8px",
	padding: "20px",
	marginBottom: "20px",
};

const detailRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	padding: "10px 0",
	borderBottom: "1px solid #f3f4f6",
};

const detailLabel = {
	color: "#6b7280",
	fontSize: "14px",
	margin: "0",
};

const detailValue = {
	color: "#111827",
	fontSize: "14px",
	fontWeight: "600",
	margin: "0",
	textAlign: "right" as const,
};

const amountStyle = {
	color: "#dc2626",
	fontSize: "16px",
	fontWeight: "700",
	margin: "0",
	textAlign: "right" as const,
};

const graceNotice = {
	textAlign: "center" as const,
	padding: "16px",
	backgroundColor: "#fffbeb",
	borderRadius: "8px",
	border: "1px solid #fcd34d",
};

const graceLabel = {
	color: "#92400e",
	fontSize: "12px",
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	margin: "0",
};

const graceDays = {
	color: "#b45309",
	fontSize: "28px",
	fontWeight: "700",
	margin: "8px 0",
};

const graceDate = {
	color: "#92400e",
	fontSize: "12px",
	margin: "0",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const infoCard = {
	backgroundColor: "#f0f9ff",
	border: "1px solid #bae6fd",
	margin: "32px 0",
};

const reasonsList = {
	color: "#0c4a6e",
	fontSize: "14px",
	lineHeight: "24px",
	margin: "12px 0 0 0",
	padding: "0 0 0 20px",
};

const reasonItem = {
	margin: "8px 0",
};

const warningCard = {
	backgroundColor: "#fffbeb",
	border: "1px solid #fcd34d",
	margin: "32px 0",
};

const consequencesList = {
	color: "#78350f",
	fontSize: "14px",
	lineHeight: "24px",
	margin: "12px 0 0 0",
	padding: "0 0 0 20px",
};

const consequenceItem = {
	margin: "12px 0",
};

const footerNote = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
};

const link = {
	color: "#2563eb",
	textDecoration: "underline",
};
