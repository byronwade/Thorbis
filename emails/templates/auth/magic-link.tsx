/**
 * Magic Link Email Template - Passwordless authentication
 *
 * Features:
 * - One-click authentication link
 * - Security information
 * - Expiration time
 */

import { Text } from "@react-email/components";
import type { MagicLinkProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function MagicLinkEmail({
	loginUrl,
	expiresInMinutes = 15,
	previewText = "Sign in to your Thorbis account",
}: MagicLinkProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Sign in to Thorbis</Heading>

			<Text style={paragraph}>
				Click the button below to sign in to your Thorbis account. No password required!
			</Text>

			<div style={buttonContainer}>
				<Button href={loginUrl}>Sign In to Thorbis</Button>
			</div>

			<Text style={paragraph}>Or copy and paste this URL into your browser:</Text>

			<Card style={urlCard}>
				<Text style={urlText}>{loginUrl}</Text>
			</Card>

			<Card style={infoCard}>
				<Heading level={3}>Security Information</Heading>
				<ul style={list}>
					<li style={listItem}>This link will expire in {expiresInMinutes} minutes</li>
					<li style={listItem}>The link can only be used once</li>
					<li style={listItem}>
						If you didn't request this link, you can safely ignore this email
					</li>
				</ul>
				<Text style={infoText}>
					For your security, we recommend only signing in from trusted devices.
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

const infoCard = {
	backgroundColor: "#eff6ff",
	border: "1px solid #bfdbfe",
	margin: "32px 0 0 0",
};

const list = {
	color: "#1e40af",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "12px 0 16px 20px",
	padding: "0",
};

const listItem = {
	margin: "0 0 8px 0",
};

const infoText = {
	color: "#1e40af",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "0",
};
