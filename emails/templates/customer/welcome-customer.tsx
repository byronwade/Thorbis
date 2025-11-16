/**
 * Welcome Customer Email Template - New customer onboarding
 *
 * Features:
 * - Warm welcome message
 * - Account access information
 * - Getting started guide
 * - Support contact info
 */

import { Text } from "@react-email/components";
import type { WelcomeCustomerProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function WelcomeCustomerEmail({
	customerName,
	accountUrl,
	supportEmail,
	supportPhone,
	previewText = "Welcome to Thorbis - We're here for you!",
}: WelcomeCustomerProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Welcome to Thorbis!</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				Thank you for choosing Thorbis for your service needs! We're thrilled to
				have you as a customer and look forward to providing you with excellent
				service.
			</Text>

			<Card style={welcomeCard}>
				<div style={welcomeIcon}>👋</div>
				<Text style={welcomeText}>You're now part of the Thorbis family!</Text>
			</Card>

			<div style={buttonContainer}>
				<Button href={accountUrl}>Access Your Account</Button>
			</div>

			<Card style={featuresCard}>
				<Heading level={3}>What you can do with your account:</Heading>
				<ul style={list}>
					<li style={listItem}>
						<strong>Track services:</strong> View all your service history in
						one place
					</li>
					<li style={listItem}>
						<strong>Schedule appointments:</strong> Book services at your
						convenience
					</li>
					<li style={listItem}>
						<strong>Manage invoices:</strong> View and pay invoices online
					</li>
					<li style={listItem}>
						<strong>Get updates:</strong> Receive real-time notifications about
						your services
					</li>
					<li style={listItem}>
						<strong>Save time:</strong> Store your property details for faster
						booking
					</li>
				</ul>
			</Card>

			<Card style={supportCard}>
				<Heading level={3}>We're here to help</Heading>
				<Text style={supportText}>
					Our customer support team is ready to assist you with any questions or
					concerns.
				</Text>
				<div style={contactGrid}>
					<div style={contactMethod}>
						<Text style={contactLabel}>Email:</Text>
						<a href={`mailto:${supportEmail}`} style={contactLink}>
							{supportEmail}
						</a>
					</div>
					<div style={contactMethod}>
						<Text style={contactLabel}>Phone:</Text>
						<a href={`tel:${supportPhone}`} style={contactLink}>
							{supportPhone}
						</a>
					</div>
				</div>
			</Card>

			<Card style={tipsCard}>
				<Heading level={3}>Pro Tips for New Customers</Heading>
				<ul style={tipsList}>
					<li style={tipItem}>
						Set up your profile to save time on future bookings
					</li>
					<li style={tipItem}>
						Add your property details for more accurate service quotes
					</li>
					<li style={tipItem}>
						Enable notifications to stay updated on service appointments
					</li>
					<li style={tipItem}>
						Save our contact info for quick access when you need us
					</li>
				</ul>
			</Card>

			<Text style={thankYouText}>
				Once again, welcome to Thorbis! We're committed to providing you with
				exceptional service every step of the way.
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

const welcomeCard = {
	background:
		"linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
	borderRadius: "12px",
	padding: "40px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const welcomeIcon = {
	fontSize: "64px",
	margin: "0 0 16px 0",
};

const welcomeText = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "24px",
	fontWeight: "600",
	margin: "0",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const featuresCard = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #bbf7d0",
	margin: "24px 0",
};

const list = {
	color: "#166534",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const listItem = {
	margin: "0 0 12px 0",
};

const supportCard = {
	backgroundColor: "#eff6ff",
	border: "1px solid #bfdbfe",
	margin: "24px 0",
};

const supportText = {
	color: "#1e40af",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "12px 0 20px 0",
};

const contactGrid = {
	display: "grid" as const,
	gridTemplateColumns: "1fr 1fr",
	gap: "16px",
};

const contactMethod = {
	textAlign: "center" as const,
};

const contactLabel = {
	color: "#6b7280",
	fontSize: "12px",
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	margin: "0 0 8px 0",
};

const contactLink = {
	color: "hsl(217 91% 60%)",
	fontSize: "15px",
	fontWeight: "600",
	textDecoration: "underline",
};

const tipsCard = {
	backgroundColor: "#fffbeb",
	border: "1px solid #fde68a",
	margin: "24px 0",
};

const tipsList = {
	color: "#92400e",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const tipItem = {
	margin: "0 0 10px 0",
};

const thankYouText = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
};
