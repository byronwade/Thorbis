/**
 * Trial Ending Email Template - Subscription trial expiration warning
 *
 * Features:
 * - Countdown to trial end
 * - Subscription plan details
 * - Clear CTA to add payment method
 * - What happens after trial ends
 */

import { Text } from "@react-email/components";
import type { TrialEndingProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function TrialEndingEmail({
	companyName,
	ownerName,
	daysRemaining,
	trialEndDate,
	planName,
	monthlyPrice,
	billingUrl,
	previewText = `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`,
}: TrialEndingProps) {
	const isUrgent = daysRemaining <= 1;

	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Your Trial is Ending Soon</Heading>

			<Text style={paragraph}>Hi {ownerName},</Text>

			<Text style={paragraph}>
				We hope you've been enjoying Thorbis for {companyName}! This is a
				friendly reminder that your free trial period ends{" "}
				<strong>
					{daysRemaining === 0
						? "today"
						: daysRemaining === 1
							? "tomorrow"
							: `in ${daysRemaining} days`}
				</strong>
				.
			</Text>

			<Card style={isUrgent ? urgentCard : warningCard}>
				<div style={countdownHeader}>
					<Text style={countdownLabel}>Trial ends in</Text>
					<Text style={countdownDays}>
						{daysRemaining}
						<span style={countdownUnit}>
							{daysRemaining === 1 ? " day" : " days"}
						</span>
					</Text>
					<Text style={endDate}>on {trialEndDate}</Text>
				</div>

				<div style={planDetails}>
					<div style={detailRow}>
						<Text style={detailLabel}>Your Plan:</Text>
						<Text style={detailValue}>{planName}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Monthly Price:</Text>
						<Text style={detailValue}>{monthlyPrice}</Text>
					</div>
				</div>
			</Card>

			<div style={buttonContainer}>
				<Button href={billingUrl}>Add Payment Method</Button>
			</div>

			<Card style={infoCard}>
				<Heading level={3}>What happens after your trial?</Heading>
				<ul style={featureList}>
					<li style={featureItem}>
						<strong>If you add a payment method:</strong> Your subscription will
						continue seamlessly with no interruption to your service.
					</li>
					<li style={featureItem}>
						<strong>If you don't add a payment method:</strong> Your account
						will be downgraded to a limited free tier. Your data will be
						preserved for 30 days.
					</li>
				</ul>
			</Card>

			<Card style={benefitsCard}>
				<Heading level={3}>Why continue with Thorbis?</Heading>
				<ul style={benefitsList}>
					<li style={benefitItem}>Unlimited jobs and customers</li>
					<li style={benefitItem}>Professional invoicing and estimates</li>
					<li style={benefitItem}>Automated scheduling and dispatch</li>
					<li style={benefitItem}>Customer communication tools</li>
					<li style={benefitItem}>Financial reporting and analytics</li>
					<li style={benefitItem}>Priority support</li>
				</ul>
			</Card>

			<Text style={footerNote}>
				Have questions? Reply to this email or contact our support team at{" "}
				<a href="mailto:support@thorbis.com" style={link}>
					support@thorbis.com
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

const warningCard = {
	backgroundColor: "#fffbeb",
	border: "2px solid #fcd34d",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
};

const urgentCard = {
	backgroundColor: "#fef2f2",
	border: "2px solid #fca5a5",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
};

const countdownHeader = {
	textAlign: "center" as const,
	marginBottom: "24px",
	paddingBottom: "20px",
	borderBottom: "1px solid #fcd34d",
};

const countdownLabel = {
	color: "#92400e",
	fontSize: "14px",
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	margin: "0 0 8px 0",
};

const countdownDays = {
	color: "#b45309",
	fontSize: "48px",
	fontWeight: "700",
	margin: "0",
	lineHeight: "1",
};

const countdownUnit = {
	fontSize: "24px",
	fontWeight: "500",
};

const endDate = {
	color: "#92400e",
	fontSize: "14px",
	margin: "8px 0 0 0",
};

const planDetails = {
	backgroundColor: EMAIL_COLORS.surface,
	borderRadius: "8px",
	padding: "20px",
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

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const infoCard = {
	backgroundColor: "#f0f9ff",
	border: "1px solid #bae6fd",
	margin: "32px 0",
};

const featureList = {
	color: "#0c4a6e",
	fontSize: "14px",
	lineHeight: "24px",
	margin: "12px 0 0 0",
	padding: "0 0 0 20px",
};

const featureItem = {
	margin: "12px 0",
};

const benefitsCard = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #86efac",
	margin: "32px 0",
};

const benefitsList = {
	color: "#166534",
	fontSize: "14px",
	lineHeight: "24px",
	margin: "12px 0 0 0",
	padding: "0 0 0 20px",
	listStyle: "none" as const,
};

const benefitItem = {
	margin: "8px 0",
	paddingLeft: "20px",
	position: "relative" as const,
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
