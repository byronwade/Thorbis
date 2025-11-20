/**
 * Welcome Email Template - Sent when user signs up
 *
 * Design:
 * - Clean, full-width layout (no cards)
 * - Thorbis-branded with logo
 * - Professional welcome message
 * - Clear call-to-action
 * - Next steps guidance
 */

import { Text } from "@react-email/components";
import type { WelcomeEmailProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function WelcomeEmail({
	name,
	loginUrl,
	previewText = "Welcome to Thorbis! Let's get you started.",
}: WelcomeEmailProps) {
	return (
		<BaseLayout previewText={previewText}>
			{/* Hero Heading */}
			<Heading level={1}>Welcome to Thorbis, {name}! 👋</Heading>

			{/* Welcome Message */}
			<Text style={paragraph}>
				We're thrilled to have you on board! Thorbis is your all-in-one platform
				for managing your service business more efficiently than ever before.
			</Text>

			<Text style={paragraph}>
				Whether you're scheduling jobs, managing customers, creating invoices,
				or tracking your team's performance, we've built Thorbis to make your
				life easier.
			</Text>

			{/* What You Can Do */}
			<Heading level={2}>What You Can Do with Thorbis</Heading>

			<div style={featureList}>
				<div style={featureItem}>
					<Text style={featureIcon}>📅</Text>
					<div style={featureContent}>
						<Text style={featureTitle}>Schedule & Dispatch Jobs</Text>
						<Text style={featureDescription}>
							Manage your calendar, assign technicians, and optimize routes
							effortlessly
						</Text>
					</div>
				</div>

				<div style={featureItem}>
					<Text style={featureIcon}>👥</Text>
					<div style={featureContent}>
						<Text style={featureTitle}>Customer Management</Text>
						<Text style={featureDescription}>
							Keep all customer information, history, and communication in one
							place
						</Text>
					</div>
				</div>

				<div style={featureItem}>
					<Text style={featureIcon}>💰</Text>
					<div style={featureContent}>
						<Text style={featureTitle}>Invoicing & Payments</Text>
						<Text style={featureDescription}>
							Create professional invoices and estimates, accept online payments
						</Text>
					</div>
				</div>

				<div style={featureItem}>
					<Text style={featureIcon}>📊</Text>
					<div style={featureContent}>
						<Text style={featureTitle}>Business Insights</Text>
						<Text style={featureDescription}>
							Track performance, revenue, and growth with powerful analytics
						</Text>
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div style={ctaContainer}>
				<Button href={loginUrl}>Get Started with Thorbis</Button>
			</div>

			{/* Next Steps */}
			<Heading level={2}>Next Steps</Heading>

			<Text style={paragraph}>
				To help you get the most out of Thorbis, here's what we recommend:
			</Text>

			<ol style={stepsList}>
				<li style={stepItem}>
					<strong>Complete your company profile</strong> - Add your business
					information, logo, and branding
				</li>
				<li style={stepItem}>
					<strong>Add your team members</strong> - Invite technicians and staff
					to collaborate
				</li>
				<li style={stepItem}>
					<strong>Import your customers</strong> - Bring over your existing
					customer list (optional)
				</li>
				<li style={stepItem}>
					<strong>Schedule your first job</strong> - Start managing your
					workflow
				</li>
			</ol>

			{/* Help & Resources */}
			<div style={helpSection}>
				<Heading level={3}>Need Help Getting Started?</Heading>
				<Text style={paragraph}>
					Our team is here to support you every step of the way:
				</Text>
				<Text style={paragraph}>
					• Check out our{" "}
					<a href="https://thorbis.com/docs/getting-started" style={link}>
						getting started guide
					</a>
					<br />• Watch our{" "}
					<a href="https://thorbis.com/tutorials" style={link}>
						video tutorials
					</a>
					<br />• Email us at{" "}
					<a href="mailto:support@thorbis.com" style={link}>
						support@thorbis.com
					</a>
					<br />• Live chat is available 9am-5pm PT
				</Text>
			</div>

			{/* Closing */}
			<Text style={closingText}>
				Welcome aboard,
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

const featureList = {
	margin: "24px 0 32px 0",
};

const featureItem = {
	display: "flex",
	alignItems: "flex-start",
	marginBottom: "20px",
	padding: "16px 0",
	borderBottom: "1px solid #e5e7eb",
};

const featureIcon = {
	fontSize: "32px",
	marginRight: "16px",
	lineHeight: "1",
};

const featureContent = {
	flex: 1,
};

const featureTitle = {
	color: "#111827",
	fontSize: "17px",
	fontWeight: "600",
	margin: "0 0 4px 0",
	lineHeight: "24px",
};

const featureDescription = {
	color: "#6b7280",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "0",
};

const ctaContainer = {
	margin: "40px 0",
	textAlign: "center" as const,
};

const stepsList = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "16px 0 32px 24px",
	padding: "0",
};

const stepItem = {
	marginBottom: "12px",
};

const helpSection = {
	backgroundColor: "#f9fafb",
	borderLeft: "4px solid #3c6ff5",
	padding: "24px",
	margin: "32px 0",
	borderRadius: "4px",
};

const link = {
	color: "#3c6ff5",
	textDecoration: "none",
	fontWeight: "500",
};

const closingText = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "32px 0 0 0",
};
