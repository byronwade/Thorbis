/**
 * Password Changed Email Template - Confirmation after password change
 *
 * Design:
 * - Clean, full-width layout (no cards)
 * - Thorbis-branded with logo from BaseLayout
 * - Confirms password was changed
 * - Provides security contact info
 * - Shows timestamp of change
 */

import { Text } from "@react-email/components";
import type { PasswordChangedProps } from "../../../src/lib/email/email-types";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function PasswordChangedEmail({
	name,
	changedAt,
	previewText = "Your password has been changed",
}: PasswordChangedProps) {
	const formattedDate = new Date(changedAt).toLocaleString("en-US", {
		dateStyle: "long",
		timeStyle: "long",
	});

	return (
		<BaseLayout previewText={previewText}>
			{/* Main Heading */}
			<Heading level={1}>Password Changed Successfully ✅</Heading>

			<Text style={paragraph}>Hi {name},</Text>

			<Text style={paragraph}>
				This is a confirmation that the password for your Thorbis account was
				changed successfully.
			</Text>

			{/* Change Timestamp */}
			<div style={infoSection}>
				<Text style={infoLabel}>🕒 Change Date & Time:</Text>
				<Text style={infoValue}>{formattedDate}</Text>
			</div>

			{/* Security Warning */}
			<div style={securitySection}>
				<Heading level={3}>⚠️ Didn't Make This Change?</Heading>
				<Text style={securityText}>
					If you didn't change your password, someone may have unauthorized
					access to your account. Please take the following steps immediately:
				</Text>
				<ul style={list}>
					<li style={listItem}>
						<a href="mailto:security@thorbis.com" style={link}>
							Contact our security team
						</a>
					</li>
					<li style={listItem}>
						Change your password again using a secure device
					</li>
					<li style={listItem}>Review your recent account activity</li>
				</ul>
			</div>

			<Text style={footerNote}>
				This is an automated security notification. If you made this change, you
				can safely ignore this email.
			</Text>

			<Text style={closingText}>
				Stay secure,
				<br />
				<strong>The Thorbis Team</strong>
			</Text>
		</BaseLayout>
	);
}

// Styles - Clean, full-width design (no cards)
const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "0 0 20px 0",
};

const infoSection = {
	backgroundColor: "#f0fdf4",
	borderLeft: "4px solid #22c55e",
	padding: "20px 24px",
	margin: "24px 0",
	borderRadius: "4px",
};

const infoLabel = {
	color: "#166534",
	fontSize: "14px",
	fontWeight: "600",
	margin: "0 0 8px 0",
};

const infoValue = {
	color: "#166534",
	fontSize: "17px",
	fontWeight: "500",
	margin: "0",
};

const securitySection = {
	backgroundColor: "#fef2f2",
	borderLeft: "4px solid #ef4444",
	padding: "24px",
	margin: "32px 0",
	borderRadius: "4px",
};

const securityText = {
	color: "#991b1b",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "8px 0 16px 0",
};

const list = {
	color: "#991b1b",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "0 0 0 24px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const link = {
	color: "#991b1b",
	textDecoration: "underline",
	fontWeight: "600",
};

const footerNote = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
	fontStyle: "italic",
};

const closingText = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "24px 0 0 0",
};
