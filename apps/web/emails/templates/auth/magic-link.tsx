/**
 * Magic Link Email Template - Passwordless authentication
 *
 * Design:
 * - Clean, full-width layout (no cards)
 * - Thorbis-branded with logo from BaseLayout
 * - One-click authentication link
 * - Security information
 * - Expiration time
 */

import { Text } from "@react-email/components";
import type { MagicLinkProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function MagicLinkEmail({
	loginUrl,
	expiresInMinutes = 15,
	previewText = "Sign in to your Thorbis account",
}: MagicLinkProps) {
	return (
		<BaseLayout previewText={previewText}>
			{/* Main Heading */}
			<Heading level={1}>Sign In to Thorbis ✨</Heading>

			<Text style={paragraph}>
				Click the button below to sign in to your Thorbis account. No password
				required!
			</Text>

			{/* Call to Action */}
			<div style={buttonContainer}>
				<Button href={loginUrl}>Sign In to Thorbis</Button>
			</div>

			{/* Alternative Link */}
			<Text style={paragraph}>
				Or copy and paste this URL into your browser:
			</Text>

			<div style={urlBox}>
				<Text style={urlText}>{loginUrl}</Text>
			</div>

			{/* Security Information */}
			<div style={infoSection}>
				<Heading level={3}>🔒 Security Information</Heading>
				<ul style={list}>
					<li style={listItem}>
						This link will expire in <strong>{expiresInMinutes} minutes</strong>
					</li>
					<li style={listItem}>The link can only be used once</li>
					<li style={listItem}>
						If you didn't request this link, you can safely ignore this email
					</li>
				</ul>
				<Text style={infoText}>
					For your security, we recommend only signing in from trusted devices.
				</Text>
			</div>

			<Text style={closingText}>
				Welcome back,
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

const infoSection = {
	backgroundColor: "#eff6ff",
	borderLeft: "4px solid #3b82f6",
	padding: "24px",
	margin: "32px 0",
	borderRadius: "4px",
};

const list = {
	color: "#1e40af",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "12px 0 16px 24px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const infoText = {
	color: "#1e40af",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "16px 0 0 0",
};

const closingText = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "32px 0 0 0",
};
