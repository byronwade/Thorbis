/**
 * Trial Ending Email Template
 *
 * Sent to company owners when their trial is about to end (3 days before).
 * Features:
 * - Clear countdown to trial end
 * - Plan pricing reminder
 * - Call to action to add payment method
 */

import { Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { Card } from "@/emails/components/card";
import { Heading } from "@/emails/components/heading";
import { BaseLayout } from "@/emails/layouts/base-layout";
import { EMAIL_COLORS } from "@/emails/theme";

export type TrialEndingEmailProps = {
	companyName: string;
	ownerName: string;
	daysRemaining: number;
	trialEndDate: string;
	planName: string;
	monthlyPrice: string;
	billingUrl: string;
	previewText?: string;
};

export default function TrialEndingEmail({
	companyName,
	ownerName,
	daysRemaining,
	trialEndDate,
	planName,
	monthlyPrice,
	billingUrl,
	previewText = `Your Stratos trial ends in ${daysRemaining} days`,
}: TrialEndingEmailProps) {
	const urgencyColor = daysRemaining <= 1 ? EMAIL_COLORS.error : EMAIL_COLORS.warning;

	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Your Trial Ends Soon</Heading>

			<Text style={paragraph}>Hi {ownerName},</Text>

			<Text style={paragraph}>
				Your free trial for <strong>{companyName}</strong> on Stratos is ending soon.
				We hope you've enjoyed exploring the platform!
			</Text>

			{/* Countdown Card */}
			<Card style={{ ...countdownCard, borderColor: urgencyColor }}>
				<div style={countdownHeader}>
					<Text style={countdownLabel}>Trial ends in</Text>
					<Text style={{ ...countdownNumber, color: urgencyColor }}>
						{daysRemaining} {daysRemaining === 1 ? "day" : "days"}
					</Text>
					<Text style={countdownDate}>{trialEndDate}</Text>
				</div>
			</Card>

			{/* Plan Summary */}
			<Card style={planCard}>
				<Heading level={3} style={{ marginBottom: "16px", marginTop: "0" }}>
					Your Plan
				</Heading>
				<div style={planRow}>
					<Text style={planLabel}>{planName}</Text>
					<Text style={planPrice}>{monthlyPrice}/month</Text>
				</div>
				<Text style={planNote}>
					Cancel anytime. No long-term commitment required.
				</Text>
			</Card>

			{/* Benefits Reminder */}
			<Text style={sectionTitle}>Keep these features:</Text>
			<ul style={featureList}>
				<li style={featureItem}>Unlimited customers and jobs</li>
				<li style={featureItem}>Professional invoicing and estimates</li>
				<li style={featureItem}>Team scheduling and dispatching</li>
				<li style={featureItem}>Real-time GPS tracking</li>
				<li style={featureItem}>Customer portal access</li>
			</ul>

			{/* CTA Button */}
			<div style={buttonContainer}>
				<Button href={billingUrl}>Add Payment Method</Button>
			</div>

			{/* Help Note */}
			<Text style={helpNote}>
				Questions about your account? Reply to this email or contact our support team.
				We're here to help you succeed.
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

const countdownCard: React.CSSProperties = {
	backgroundColor: EMAIL_COLORS.background,
	borderWidth: "2px",
	borderStyle: "solid",
	padding: "24px",
	borderRadius: "8px",
	marginBottom: "24px",
	textAlign: "center" as const,
};

const countdownHeader: React.CSSProperties = {
	textAlign: "center" as const,
};

const countdownLabel: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	margin: "0 0 8px 0",
	textTransform: "uppercase" as const,
	letterSpacing: "0.5px",
};

const countdownNumber: React.CSSProperties = {
	fontSize: "48px",
	fontWeight: "bold",
	margin: "0",
	lineHeight: "1",
};

const countdownDate: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	margin: "8px 0 0 0",
};

const planCard: React.CSSProperties = {
	marginBottom: "24px",
	padding: "20px",
};

const planRow: React.CSSProperties = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: "12px",
};

const planLabel: React.CSSProperties = {
	fontSize: "16px",
	fontWeight: "600",
	color: EMAIL_COLORS.text,
	margin: "0",
};

const planPrice: React.CSSProperties = {
	fontSize: "20px",
	fontWeight: "bold",
	color: EMAIL_COLORS.primary,
	margin: "0",
};

const planNote: React.CSSProperties = {
	fontSize: "13px",
	color: EMAIL_COLORS.muted,
	margin: "0",
};

const sectionTitle: React.CSSProperties = {
	fontSize: "14px",
	fontWeight: "600",
	color: EMAIL_COLORS.text,
	margin: "24px 0 12px 0",
	textTransform: "uppercase" as const,
	letterSpacing: "0.5px",
};

const featureList: React.CSSProperties = {
	paddingLeft: "20px",
	margin: "0 0 24px 0",
};

const featureItem: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.text,
	marginBottom: "8px",
	lineHeight: "1.5",
};

const buttonContainer: React.CSSProperties = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const helpNote: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	textAlign: "center" as const,
	margin: "24px 0 0 0",
	lineHeight: "1.6",
};
