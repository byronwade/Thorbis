/**
 * Password Reset Email Template - Send password reset link
 *
 * Features:
 * - Password reset link with expiration
 * - Security warnings
 * - Clear call-to-action
 */

import { Text } from "@react-email/components";
import type { PasswordResetProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
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
			<Heading level={1}>Reset your password</Heading>

			{name && <Text style={paragraph}>Hi {name},</Text>}

			<Text style={paragraph}>
				We received a request to reset the password for your Thorbis account. Click the button below to create a new
				password.
			</Text>

			<div style={buttonContainer}>
				<Button href={resetUrl}>Reset Password</Button>
			</div>

			<Text style={paragraph}>Or copy and paste this URL into your browser:</Text>

			<Card style={urlCard}>
				<Text style={urlText}>{resetUrl}</Text>
			</Card>

			<Card style={warningCard}>
				<Heading level={3}>Important Security Information</Heading>
				<ul style={list}>
					<li style={listItem}>This password reset link will expire in {expiresInMinutes} minutes</li>
					<li style={listItem}>If you didn't request a password reset, please ignore this email</li>
					<li style={listItem}>Never share this link with anyone</li>
				</ul>
				<Text style={warningText}>
					If you're concerned about your account security,{" "}
					<a href="mailto:security@thorbis.com" style={link}>
						contact our security team
					</a>
					.
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

const warningCard = {
	backgroundColor: "#fef2f2",
	border: "1px solid #fecaca",
	margin: "32px 0 0 0",
};

const list = {
	color: "#991b1b",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const listItem = {
	margin: "0 0 8px 0",
};

const warningText = {
	color: "#991b1b",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "16px 0 0 0",
};

const link = {
	color: "#991b1b",
	textDecoration: "underline",
};
