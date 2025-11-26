/**
 * Verification Complete Email Template
 * Sent when toll-free verification is approved (or all verifications complete)
 *
 * Features:
 * - Celebrates approval
 * - Confirms SMS/MMS are now enabled
 * - Provides quick start guide
 * - Links to messaging dashboard
 */

import { Text } from "@react-email/components";
import type { VerificationCompleteProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function VerificationCompleteEmail({
	companyName,
	contactName,
	verificationTypes,
	dashboardUrl,
	messagingUrl,
	previewText = "Your business messaging is now fully enabled!",
}: VerificationCompleteProps) {
	const hasTollFree = verificationTypes.includes("toll-free");
	const has10DLC = verificationTypes.includes("10dlc");

	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>🎉 Your Messaging is Live!</Heading>

			<Text style={paragraph}>Hi {contactName},</Text>

			<Text style={paragraph}>
				Excellent news! Your business messaging verification for{" "}
				<strong>{companyName}</strong> has been approved. You can now send SMS
				and MMS messages to your customers.
			</Text>

			{/* Success Card */}
			<Card style={successCard}>
				<div style={cardIcon}>✅</div>
				<Heading level={3} style={cardTitle}>
					All Systems Ready
				</Heading>
				<Text style={cardText}>
					{hasTollFree && has10DLC && (
						<>
							Both your toll-free and regular (10DLC) numbers are now approved
							and ready to send messages.
						</>
					)}
					{hasTollFree && !has10DLC && (
						<>
							Your toll-free numbers have been approved and are ready to send
							messages.
						</>
					)}
					{!hasTollFree && has10DLC && (
						<>
							Your 10DLC (regular) numbers have been approved and are ready to
							send messages.
						</>
					)}
				</Text>
			</Card>

			{/* What You Can Do Now */}
			<Heading level={3}>What You Can Do Now</Heading>

			<ul style={list}>
				<li style={listItem}>
					<strong>Send SMS/MMS:</strong> Text your customers with appointment
					reminders, estimates, invoices, and updates
				</li>
				<li style={listItem}>
					<strong>Two-Way Messaging:</strong> Receive and respond to customer
					texts directly in your dashboard
				</li>
				<li style={listItem}>
					<strong>Automated Messages:</strong> Set up automatic text
					notifications for jobs, appointments, and payments
				</li>
				<li style={listItem}>
					<strong>Rich Media:</strong> Send photos, documents, and other
					attachments via MMS
				</li>
				{hasTollFree && (
					<li style={listItem}>
						<strong>RCS Messaging:</strong> Support for read receipts and rich
						messaging features on compatible devices
					</li>
				)}
			</ul>

			{/* Quick Start */}
			<Card>
				<Heading level={3}>Quick Start Guide</Heading>

				<Text style={stepText}>
					<strong>1. Set Up Message Templates</strong>
					<br />
					Create reusable templates for common messages like appointment
					confirmations and reminders.
				</Text>

				<Text style={stepText}>
					<strong>2. Configure Notifications</strong>
					<br />
					Enable automatic text notifications for job updates, invoice payments,
					and more.
				</Text>

				<Text style={stepText}>
					<strong>3. Start Messaging</strong>
					<br />
					Send your first text message! Try texting a test appointment reminder
					or estimate notification.
				</Text>
			</Card>

			{/* CTAs */}
			<div style={buttonContainer}>
				<Button href={messagingUrl}>Open Messaging Dashboard</Button>
			</div>

			<div style={secondaryButtonContainer}>
				<a href={dashboardUrl} style={secondaryLink}>
					Back to Main Dashboard →
				</a>
			</div>

			{/* Support */}
			<Text style={supportText}>
				<strong>Need help getting started?</strong> Check out our{" "}
				<a href="https://thorbis.com/docs/messaging" style={link}>
					messaging guide
				</a>{" "}
				or contact support at{" "}
				<a href="mailto:support@thorbis.com" style={link}>
					support@thorbis.com
				</a>
			</Text>

			<Text style={footerNote}>
				Your approval was issued by The Campaign Registry and is valid for all
				US carriers. Keep sending great messages! 📱
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

const successCard = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #86efac",
	borderRadius: "8px",
	padding: "24px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const cardIcon = {
	fontSize: "48px",
	marginBottom: "12px",
};

const cardTitle = {
	color: "#166534",
	fontSize: "20px",
	fontWeight: "600",
	margin: "0 0 8px 0",
};

const cardText = {
	color: "#15803d",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
};

const list = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "16px 0 24px 24px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const stepText = {
	color: "#6b7280",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "0 0 16px 0",
};

const buttonContainer = {
	margin: "32px 0 16px 0",
	textAlign: "center" as const,
};

const secondaryButtonContainer = {
	margin: "0 0 32px 0",
	textAlign: "center" as const,
};

const secondaryLink = {
	color: "hsl(217 91% 60%)",
	fontSize: "16px",
	textDecoration: "none",
	fontWeight: "500",
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
