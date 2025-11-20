/**
 * Email Verification Template - Email verification link
 *
 * Design:
 * - Clean, full-width layout (no cards)
 * - Thorbis-branded with logo from BaseLayout
 * - Clear call-to-action
 * - Security information
 */

import { Text } from "@react-email/components";
import type { EmailVerificationProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function EmailVerificationEmail({
	name,
	verificationUrl,
	previewText = "Verify your email address to get started",
}: EmailVerificationProps) {
	return (
		<BaseLayout previewText={previewText}>
			{/* Main Heading */}
			<Heading level={1}>Verify Your Email Address 📧</Heading>

			<Text style={paragraph}>Hi {name},</Text>

			<Text style={paragraph}>
				Thanks for signing up for Thorbis! To complete your registration and
				start using your account, please verify your email address by clicking
				the button below.
			</Text>

			{/* Call to Action */}
			<div style={buttonContainer}>
				<Button href={verificationUrl}>Verify Email Address</Button>
			</div>

			{/* Alternative Link */}
			<Text style={paragraph}>
				Or copy and paste this URL into your browser:
			</Text>

			<div style={urlBox}>
				<Text style={urlText}>{verificationUrl}</Text>
			</div>

			{/* Security Information */}
			<div style={securitySection}>
				<Heading level={3}>🔒 Security Note</Heading>
				<Text style={securityText}>
					This verification link will expire in 24 hours for security reasons.
					If you didn't create an account with Thorbis, you can safely ignore
					this email.
				</Text>
			</div>
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

const securitySection = {
	backgroundColor: "#fef3c7",
	borderLeft: "4px solid #fbbf24",
	padding: "24px",
	margin: "32px 0",
	borderRadius: "4px",
};

const securityText = {
	color: "#92400e",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "8px 0 0 0",
};
