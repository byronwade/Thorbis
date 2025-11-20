/**
 * Team Invitation Email Template - Invitation to join team
 *
 * Features:
 * - Invitation to join company team
 * - Secure invitation link with expiration
 * - Role and access information
 * - Getting started guide
 */

import { Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { Card } from "@/emails/components/card";
import { Heading } from "@/emails/components/heading";
import { BaseLayout } from "@/emails/layouts/base-layout";
import { EMAIL_COLORS } from "@/emails/theme";

export type TeamInvitationProps = {
	inviteeName: string;
	inviterName: string;
	companyName: string;
	role: string;
	jobTitle?: string;
	invitationUrl: string;
	expiresInDays?: number;
	supportEmail?: string;
	supportPhone?: string;
	previewText?: string;
};

export default function TeamInvitationEmail({
	inviteeName,
	inviterName,
	companyName,
	role,
	jobTitle,
	invitationUrl,
	expiresInDays = 7,
	supportEmail = "support@thorbis.com",
	supportPhone = "(555) 123-4567",
	previewText = `You've been invited to join ${companyName}`,
}: TeamInvitationProps) {
	const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Welcome to the Team!</Heading>

			<Text style={paragraph}>Hi {inviteeName},</Text>

			<Text style={paragraph}>
				{inviterName} has invited you to join <strong>{companyName}</strong> on
				Thorbis. We're excited to have you on board!
			</Text>

			<Card style={invitationCard}>
				<div style={invitationIcon}>🎉</div>
				<Text style={invitationTitle}>You're Invited!</Text>
				<Text style={invitationText}>
					You've been invited as a <strong>{roleDisplay}</strong>
					{jobTitle ? ` - ${jobTitle}` : ""}.
				</Text>
				<Text style={invitationText}>
					Click the button below to accept your invitation and set up your
					account.
				</Text>
			</Card>

			<div style={buttonContainer}>
				<Button href={invitationUrl}>Accept Invitation</Button>
			</div>

			<Card style={expiryCard}>
				<Text style={expiryText}>
					⏰ This invitation link will expire in{" "}
					<strong>{expiresInDays} days</strong>. Please accept your invitation
					soon.
				</Text>
			</Card>

			<Card style={featuresCard}>
				<Heading level={3}>What you can do with Thorbis:</Heading>
				<ul style={featuresList}>
					<li style={featureItem}>
						<strong>📅 Manage Jobs & Schedule:</strong> Create and track jobs,
						schedule appointments, and coordinate with your team
					</li>
					<li style={featureItem}>
						<strong>👥 Customer Management:</strong> Access complete customer
						information, history, and communication logs
					</li>
					<li style={featureItem}>
						<strong>💰 Invoicing & Payments:</strong> Generate invoices,
						estimates, and track payments in real-time
					</li>
					<li style={featureItem}>
						<strong>📊 Reports & Analytics:</strong> View performance metrics
						and business insights
					</li>
					<li style={featureItem}>
						<strong>💬 Team Communication:</strong> Collaborate with your team
						through built-in messaging
					</li>
					<li style={featureItem}>
						<strong>📱 Mobile Access:</strong> Access your work from any device,
						anywhere
					</li>
				</ul>
			</Card>

			<Card style={securityCard}>
				<Heading level={3}>Secure & Reliable</Heading>
				<Text style={securityText}>
					Your account is protected with industry-standard security. All data is
					encrypted and backed up regularly to keep your business safe.
				</Text>
			</Card>

			<Card style={stepsCard}>
				<Heading level={3}>Getting Started is Easy</Heading>
				<div style={stepGrid}>
					<div style={step}>
						<div style={stepNumber}>1</div>
						<Text style={stepText}>
							Click the "Accept Invitation" button above
						</Text>
					</div>
					<div style={step}>
						<div style={stepNumber}>2</div>
						<Text style={stepText}>
							Complete your profile and set a secure password
						</Text>
					</div>
					<div style={step}>
						<div style={stepNumber}>3</div>
						<Text style={stepText}>
							Explore the platform and start collaborating!
						</Text>
					</div>
				</div>
			</Card>

			<Card style={helpCard}>
				<Heading level={3}>Need Help?</Heading>
				<Text style={helpText}>
					If you have any questions about getting started or need assistance,
					our support team is here to help.
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

			<Text style={footerNote}>
				<strong>Note:</strong> If you didn't expect this invitation or believe
				you received this email in error, please contact us at{" "}
				<a href={`mailto:${supportEmail}`} style={inlineLink}>
					{supportEmail}
				</a>
				.
			</Text>
		</BaseLayout>
	);
}

// Styles
const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 16px 0",
};

const invitationCard = {
	background:
		"linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
	borderRadius: "12px",
	padding: "40px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const invitationIcon = {
	fontSize: "64px",
	margin: "0 0 16px 0",
};

const invitationTitle = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "24px",
	fontWeight: "600",
	margin: "0 0 12px 0",
};

const invitationText = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 12px 0",
	opacity: "0.95",
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const expiryCard = {
	backgroundColor: "#fef3c7",
	border: "1px solid #fde68a",
	borderRadius: "8px",
	padding: "16px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const expiryText = {
	color: "#92400e",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "0",
};

const featuresCard = {
	backgroundColor: "#f0fdf4",
	border: "1px solid #bbf7d0",
	margin: "24px 0",
};

const featuresList = {
	color: "#166534",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const featureItem = {
	margin: "0 0 12px 0",
};

const securityCard = {
	backgroundColor: "#f5f3ff",
	border: "1px solid #ddd6fe",
	margin: "24px 0",
};

const securityText = {
	color: "#5b21b6",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "12px 0 0 0",
};

const stepsCard = {
	backgroundColor: "#eff6ff",
	border: "1px solid #bfdbfe",
	margin: "24px 0",
};

const stepGrid = {
	display: "grid" as const,
	gridTemplateColumns: "1fr 1fr 1fr",
	gap: "20px",
	margin: "20px 0 0 0",
};

const step = {
	textAlign: "center" as const,
};

const stepNumber = {
	width: "40px",
	height: "40px",
	backgroundColor: "hsl(217 91% 60%)",
	color: EMAIL_COLORS.primaryText,
	borderRadius: "50%",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "18px",
	fontWeight: "600",
	margin: "0 auto 12px auto",
};

const stepText = {
	color: "#1e40af",
	fontSize: "13px",
	lineHeight: "18px",
	margin: "0",
};

const helpCard = {
	backgroundColor: "#fef2f2",
	border: "1px solid #fecaca",
	margin: "24px 0",
};

const helpText = {
	color: "#991b1b",
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

const footerNote = {
	color: "#6b7280",
	fontSize: "13px",
	lineHeight: "20px",
	margin: "32px 0 0 0",
	padding: "20px",
	backgroundColor: "#f9fafb",
	borderRadius: "8px",
	textAlign: "center" as const,
};

const inlineLink = {
	color: "hsl(217 91% 60%)",
	textDecoration: "underline",
};
