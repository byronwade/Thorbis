/**
 * Email Verification Template - Email verification link
 *
 * Features:
 * - Sends verification link to user
 * - Clear call-to-action
 * - Security information
 */

import { Text } from "@react-email/components";
import type { EmailVerificationProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function EmailVerificationEmail({
	name,
	verificationUrl,
	previewText = "Verify your email address to get started",
}: EmailVerificationProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Verify your email address</Heading>

			<Text style={paragraph}>Hi {name},</Text>

			<Text style={paragraph}>
				Thanks for signing up for Thorbis! To complete your registration and start using your account, please verify
				your email address by clicking the button below.
			</Text>

			<div style={buttonContainer}>
				<Button href={verificationUrl}>Verify Email Address</Button>
			</div>

			<Text style={paragraph}>Or copy and paste this URL into your browser:</Text>

			<Card style={urlCard}>
				<Text style={urlText}>{verificationUrl}</Text>
			</Card>

			<Card style={securityCard}>
				<Heading level={3}>Security Note</Heading>
				<Text style={securityText}>
					This verification link will expire in 24 hours for security reasons. If you didn't create an account with
					Thorbis, you can safely ignore this email.
				</Text>
			</Card>
		</BaseLayout>
	);
}

const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 16px 0",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const urlCard = {
	backgroundColor: "#f9fafb",
	border: "1px solid #e5e7eb",
	borderRadius: "6px",
	padding: "16px",
	margin: "16px 0 32px 0",
};

const urlText = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	wordBreak: "break-all" as const,
	margin: "0",
};

const securityCard = {
	backgroundColor: "#fef3c7",
	border: "1px solid #fde68a",
	margin: "32px 0 0 0",
};

const securityText = {
	color: "#92400e",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "8px 0 0 0",
};
