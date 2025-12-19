/**
 * Payment Failed Email Template
 *
 * Sent to company owners when a subscription payment fails.
 * Features:
 * - Clear warning about failed payment
 * - Grace period countdown
 * - Payment method details
 * - Call to action to update payment
 */

import { Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { Card } from "@/emails/components/card";
import { Heading } from "@/emails/components/heading";
import { BaseLayout } from "@/emails/layouts/base-layout";
import { EMAIL_COLORS } from "@/emails/theme";

export type PaymentFailedEmailProps = {
	companyName: string;
	ownerName: string;
	failedAt: string;
	attemptCount: number;
	lastFourDigits: string;
	paymentMethod: string; // "Visa", "Mastercard", "Bank Account", etc.
	amountDue: string;
	gracePeriodEnds: string;
	daysRemainingInGrace: number;
	updatePaymentUrl: string;
	previewText?: string;
};

export default function PaymentFailedEmail({
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
	previewText = `Action required: Payment failed for ${companyName}`,
}: PaymentFailedEmailProps) {
	const isUrgent = daysRemainingInGrace <= 2;

	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1} style={{ color: EMAIL_COLORS.error }}>
				Payment Failed
			</Heading>

			<Text style={paragraph}>Hi {ownerName},</Text>

			<Text style={paragraph}>
				We were unable to process your payment for <strong>{companyName}</strong>.
				Please update your payment method to avoid any interruption to your service.
			</Text>

			{/* Warning Card */}
			<Card style={warningCard}>
				<div style={warningIcon}>!</div>
				<Text style={warningTitle}>Payment Unsuccessful</Text>
				<Text style={warningText}>
					{attemptCount === 1
						? "We attempted to charge your payment method but it was declined."
						: `We've attempted to charge your payment method ${attemptCount} times without success.`}
				</Text>
			</Card>

			{/* Payment Details */}
			<Card style={detailsCard}>
				<Heading level={3} style={{ marginBottom: "16px", marginTop: "0" }}>
					Payment Details
				</Heading>
				<div style={detailRow}>
					<Text style={detailLabel}>Amount Due</Text>
					<Text style={detailValue}>{amountDue}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Payment Method</Text>
					<Text style={detailValue}>
						{paymentMethod} ending in {lastFourDigits}
					</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Failed On</Text>
					<Text style={detailValue}>{failedAt}</Text>
				</div>
			</Card>

			{/* Grace Period Warning */}
			<Card style={isUrgent ? urgentGraceCard : graceCard}>
				<Text style={graceTitle}>
					{isUrgent ? "Urgent: Account Access at Risk" : "Grace Period Active"}
				</Text>
				<div style={graceCountdown}>
					<Text style={graceNumber}>{daysRemainingInGrace}</Text>
					<Text style={graceLabel}>
						{daysRemainingInGrace === 1 ? "day remaining" : "days remaining"}
					</Text>
				</div>
				<Text style={graceNote}>
					Your account will be suspended on <strong>{gracePeriodEnds}</strong> if
					payment is not updated.
				</Text>
			</Card>

			{/* CTA Button */}
			<div style={buttonContainer}>
				<Button href={updatePaymentUrl}>Update Payment Method</Button>
			</div>

			{/* What Happens Next */}
			<Text style={sectionTitle}>What happens if payment isn't updated?</Text>
			<ul style={consequenceList}>
				<li style={consequenceItem}>
					Your team will lose access to the dashboard
				</li>
				<li style={consequenceItem}>
					Scheduled jobs and appointments won't be visible
				</li>
				<li style={consequenceItem}>
					Customer portal access will be disabled
				</li>
				<li style={consequenceItem}>
					Your data will be preserved and accessible once payment is restored
				</li>
			</ul>

			{/* Help Note */}
			<Text style={helpNote}>
				Having trouble? Our support team is ready to help. Reply to this email or
				contact us directly. We'll work with you to resolve any payment issues.
			</Text>
		</BaseLayout>
	);
}

// Styles
const paragraph: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: EMAIL_COLORS.text,
	margin: "16px 0",
};

const warningCard: React.CSSProperties = {
	backgroundColor: "#fef2f2",
	borderColor: EMAIL_COLORS.error,
	borderWidth: "1px",
	borderStyle: "solid",
	padding: "24px",
	borderRadius: "8px",
	marginBottom: "24px",
	textAlign: "center" as const,
};

const warningIcon: React.CSSProperties = {
	width: "48px",
	height: "48px",
	borderRadius: "50%",
	backgroundColor: EMAIL_COLORS.error,
	color: "#ffffff",
	fontSize: "24px",
	fontWeight: "bold",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	marginBottom: "12px",
};

const warningTitle: React.CSSProperties = {
	fontSize: "18px",
	fontWeight: "600",
	color: EMAIL_COLORS.error,
	margin: "0 0 8px 0",
};

const warningText: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.text,
	margin: "0",
};

const detailsCard: React.CSSProperties = {
	marginBottom: "24px",
	padding: "20px",
};

const detailRow: React.CSSProperties = {
	display: "flex",
	justifyContent: "space-between",
	marginBottom: "12px",
};

const detailLabel: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	margin: "0",
};

const detailValue: React.CSSProperties = {
	fontSize: "14px",
	fontWeight: "600",
	color: EMAIL_COLORS.text,
	margin: "0",
};

const graceCard: React.CSSProperties = {
	backgroundColor: "#fef9c3",
	borderColor: EMAIL_COLORS.warning,
	borderWidth: "1px",
	borderStyle: "solid",
	padding: "24px",
	borderRadius: "8px",
	marginBottom: "24px",
	textAlign: "center" as const,
};

const urgentGraceCard: React.CSSProperties = {
	...graceCard,
	backgroundColor: "#fef2f2",
	borderColor: EMAIL_COLORS.error,
};

const graceTitle: React.CSSProperties = {
	fontSize: "14px",
	fontWeight: "600",
	color: EMAIL_COLORS.text,
	margin: "0 0 12px 0",
	textTransform: "uppercase" as const,
	letterSpacing: "0.5px",
};

const graceCountdown: React.CSSProperties = {
	marginBottom: "12px",
};

const graceNumber: React.CSSProperties = {
	fontSize: "48px",
	fontWeight: "bold",
	color: EMAIL_COLORS.text,
	margin: "0",
	lineHeight: "1",
};

const graceLabel: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	margin: "4px 0 0 0",
};

const graceNote: React.CSSProperties = {
	fontSize: "13px",
	color: EMAIL_COLORS.text,
	margin: "0",
};

const buttonContainer: React.CSSProperties = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const sectionTitle: React.CSSProperties = {
	fontSize: "14px",
	fontWeight: "600",
	color: EMAIL_COLORS.text,
	margin: "24px 0 12px 0",
};

const consequenceList: React.CSSProperties = {
	paddingLeft: "20px",
	margin: "0 0 24px 0",
};

const consequenceItem: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.text,
	marginBottom: "8px",
	lineHeight: "1.5",
};

const helpNote: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	textAlign: "center" as const,
	margin: "24px 0 0 0",
	lineHeight: "1.6",
};
