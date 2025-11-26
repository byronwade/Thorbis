/**
 * Verification Submitted Email Template
 * Sent immediately after user submits toll-free/10DLC verification during onboarding
 *
 * Features:
 * - Confirms submission received
 * - Explains verification timeline
 * - Sets expectations for what happens next
 * - Provides support contact info
 */

import { Text } from "@react-email/components";
import type { VerificationSubmittedProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function VerificationSubmittedEmail({
	companyName,
	contactName,
	hasTollFreeNumbers,
	has10DLCNumbers,
	tollFreeCount = 0,
	dlcCount = 0,
	dashboardUrl,
	previewText = "Your messaging verification has been submitted successfully",
}: VerificationSubmittedProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Verification Submitted Successfully!</Heading>

			<Text style={paragraph}>Hi {contactName},</Text>

			<Text style={paragraph}>
				Great news! We've successfully submitted your business messaging
				verification for <strong>{companyName}</strong>. Here's what happens
				next:
			</Text>

			{/* Timeline Cards */}
			<div style={timelineContainer}>
				{has10DLCNumbers && (
					<Card style={successCard}>
						<div style={cardIcon}>✅</div>
						<Heading level={3} style={cardTitle}>
							10DLC Registration Complete
						</Heading>
						<Text style={cardText}>
							<strong>
								{dlcCount} regular number{dlcCount !== 1 ? "s" : ""}
							</strong>{" "}
							enabled for SMS immediately. You can start sending text messages
							right away!
						</Text>
					</Card>
				)}

				{hasTollFreeNumbers && (
					<Card style={pendingCard}>
						<div style={cardIcon}>⏰</div>
						<Heading level={3} style={cardTitle}>
							Toll-Free Verification Pending
						</Heading>
						<Text style={cardText}>
							<strong>
								{tollFreeCount} toll-free number{tollFreeCount !== 1 ? "s" : ""}
							</strong>{" "}
							submitted for verification. Approval typically takes{" "}
							<strong>5-7 business days</strong>.
						</Text>
					</Card>
				)}
			</div>

			{/* What to Expect */}
			<Card>
				<Heading level={3}>What to Expect</Heading>

				<ul style={list}>
					{has10DLCNumbers && (
						<li style={listItem}>
							<strong>Regular Numbers (10DLC):</strong> Ready to use! Start
							sending SMS/MMS to your customers right away.
						</li>
					)}
					{hasTollFreeNumbers && (
						<li style={listItem}>
							<strong>Toll-Free Numbers:</strong> Under review by our carrier
							partners. We'll email you when they're approved (usually within
							5-7 business days).
						</li>
					)}
					<li style={listItem}>
						<strong>No Action Required:</strong> We're handling everything
						automatically. You can continue setting up your account.
					</li>
					<li style={listItem}>
						<strong>Notification:</strong> You'll receive another email once
						your toll-free verification is complete.
					</li>
				</ul>
			</Card>

			{/* CTA */}
			<div style={buttonContainer}>
				<Button href={dashboardUrl}>Go to Dashboard</Button>
			</div>

			{/* Support */}
			<Text style={supportText}>
				<strong>Need help?</strong> If you have any questions about the
				verification process, our support team is here to help at{" "}
				<a href="mailto:support@thorbis.com" style={link}>
					support@thorbis.com
				</a>
			</Text>

			<Text style={footerNote}>
				This is a federal requirement enforced by The Campaign Registry and US
				carriers to prevent spam and ensure legitimate business messaging.
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

const timelineContainer = {
	margin: "32px 0",
	display: "grid",
	gap: "16px",
};

const successCard = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #86efac",
	borderRadius: "8px",
	padding: "24px",
};

const pendingCard = {
	backgroundColor: "#fffbeb",
	border: "1px solid #fde047",
	borderRadius: "8px",
	padding: "24px",
};

const cardIcon = {
	fontSize: "32px",
	marginBottom: "8px",
};

const cardTitle = {
	color: "#374151",
	fontSize: "18px",
	fontWeight: "600",
	margin: "0 0 8px 0",
};

const cardText = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "0",
};

const list = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "16px 0 0 24px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const supportText = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "24px 0 0 0",
	padding: "16px",
	backgroundColor: "#f9fafb",
	borderRadius: "8px",
	textAlign: "center" as const,
};

const footerNote = {
	color: "#9ca3af",
	fontSize: "13px",
	lineHeight: "18px",
	margin: "24px 0 0 0",
	textAlign: "center" as const,
	fontStyle: "italic",
};

const link = {
	color: "hsl(217 91% 60%)",
	textDecoration: "underline",
};
