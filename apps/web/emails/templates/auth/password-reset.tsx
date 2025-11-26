/**
 * Password Reset Email Template - Send password reset link
 *
 * Design:
 * - Clean, full-width layout (no cards)
 * - Thorbis-branded with logo from BaseLayout
 * - Password reset link with expiration
 * - Security warnings
 * - Clear call-to-action
 */

import { Text } from "@react-email/components";
import type { PasswordResetProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function PasswordResetEmail({
	name,
	resetUrl,
	expiresInMinutes = 60,
	previewText = "Reset your Thorbis password",
}: PasswordResetProps) {
	return (
		<BaseLayout previewText={previewText}>
			{/* Main Heading */}
			<Heading level={1}>Reset Your Password 🔑</Heading>

			{name && <Text style={paragraph}>Hi {name},</Text>}

			<Text style={paragraph}>
				We received a request to reset the password for your Thorbis account.
				Click the button below to create a new password.
			</Text>

			{/* Call to Action */}
			<div style={buttonContainer}>
				<Button href={resetUrl}>Reset Password</Button>
			</div>

			{/* Alternative Link */}
			<Text style={paragraph}>
				Or copy and paste this URL into your browser:
			</Text>

			<div style={urlBox}>
				<Text style={urlText}>{resetUrl}</Text>
			</div>

			{/* Security Warning */}
			<div style={warningSection}>
				<Heading level={3}>🔒 Important Security Information</Heading>
				<ul style={list}>
					<li style={listItem}>
						This password reset link will expire in{" "}
						<strong>{expiresInMinutes} minutes</strong>
					</li>
					<li style={listItem}>
						If you didn't request a password reset, please ignore this email
					</li>
					<li style={listItem}>Never share this link with anyone</li>
				</ul>
				<Text style={warningText}>
					If you're concerned about your account security,{" "}
					<a href="mailto:security@thorbis.com" style={link}>
						contact our security team
					</a>
					.
				</Text>
			</div>

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

const buttonContainer = {
	margin: "40px 0",
	textAlign: "center" as const,
};

const urlBox = {
	backgroundColor: "#f9fafb",
	borderLeft: "4px solid #3c6ff5",
	padding: "16px 20px",
	margin: "20px 0 32px 0",
	borderRadius: "4px",
};

const urlText = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "22px",
	wordBreak: "break-all" as const,
	margin: "0",
	fontFamily: "monospace",
};

const warningSection = {
	backgroundColor: "#fef2f2",
	borderLeft: "4px solid #ef4444",
	padding: "24px",
	margin: "32px 0",
	borderRadius: "4px",
};

const list = {
	color: "#991b1b",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "12px 0 16px 24px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const warningText = {
	color: "#991b1b",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "16px 0 0 0",
};

const link = {
	color: "#991b1b",
	textDecoration: "underline",
	fontWeight: "500",
};

const closingText = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "32px 0 0 0",
};
