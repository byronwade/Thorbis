/**
 * Waitlist Subscription Confirmation Email
 *
 * Sent when a user successfully joins the waitlist
 * - Beautiful Thorbis branding
 * - Welcome message
 * - What to expect next
 * - Social links
 */

import { Text } from "@react-email/components";
import type { ReactNode } from "react";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export interface WaitlistSubscriptionProps {
	name: string;
	previewText?: string;
}

export default function WaitlistSubscriptionEmail({
	name,
	previewText = "Welcome to the Thorbis waitlist!",
}: WaitlistSubscriptionProps) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
	const twitterUrl = "https://twitter.com/thorbisllc";

	return (
		<BaseLayout previewText={previewText}>
			{/* Hero Heading */}
			<div style={heroContainer}>
				<div style={celebrationIcon}>🎉</div>
				<Heading level={1} style={heroHeading}>
					Welcome to the Thorbis Waitlist, {name}!
				</Heading>
			</div>

			{/* Welcome Message */}
			<Text style={paragraph}>
				Thank you for joining the waitlist! We're thrilled to have you on board
				as we prepare to launch Thorbis, the all-in-one field service management
				platform.
			</Text>

			<Text style={paragraph}>
				You're among the first to get early access when we launch. We'll keep
				you updated on our progress and notify you as soon as Thorbis is ready
				for you.
			</Text>

			{/* What to Expect */}
			<Heading level={2}>What to Expect</Heading>

			<div style={featureList}>
				<div style={featureItem}>
					<div style={featureIcon}>📧</div>
					<div style={featureContent}>
						<Text style={featureTitle}>Regular Updates</Text>
						<Text style={featureDescription}>
							We'll send you updates about our progress, new features, and
							launch timeline
						</Text>
					</div>
				</div>

				<div style={featureItem}>
					<div style={featureIcon}>🚀</div>
					<div style={featureContent}>
						<Text style={featureTitle}>Early Access</Text>
						<Text style={featureDescription}>
							Be among the first to access Thorbis when we launch and help shape
							the platform
						</Text>
					</div>
				</div>

				<div style={featureItem}>
					<div style={featureIcon}>💡</div>
					<div style={featureContent}>
						<Text style={featureTitle}>Exclusive Insights</Text>
						<Text style={featureDescription}>
							Get behind-the-scenes content, tips, and best practices for field
							service management
						</Text>
					</div>
				</div>
			</div>

			{/* Social Links */}
			<Heading level={2}>Stay Connected</Heading>

			<Text style={paragraph}>
				Follow us on social media for the latest updates, tips, and announcements:
			</Text>

			<div style={socialContainer}>
				<Button href={twitterUrl} variant="outline">
					Follow @thorbisllc on X
				</Button>
			</div>

			{/* What's Next */}
			<div style={infoBox}>
				<Heading level={3}>What's Next?</Heading>
				<Text style={paragraph}>
					We're working hard to bring you the best field service management
					platform. In the meantime, you can:
				</Text>
				<ul style={list}>
					<li style={listItem}>
						Follow us on{" "}
						<a href={twitterUrl} style={link}>
							Twitter/X
						</a>{" "}
						for real-time updates
					</li>
					<li style={listItem}>
						Share the waitlist with your team and colleagues
					</li>
					<li style={listItem}>
						Keep an eye on your inbox for our launch announcement
					</li>
				</ul>
			</div>

			{/* Closing */}
			<Text style={closingText}>
				We're excited to have you on this journey with us!
				<br />
				<br />
				<strong>The Thorbis Team</strong>
			</Text>
		</BaseLayout>
	);
}

// Styles
const heroContainer = {
	textAlign: "center" as const,
	marginBottom: "32px",
};

const celebrationIcon = {
	fontSize: "64px",
	marginBottom: "16px",
	lineHeight: "1",
};

const heroHeading = {
	fontSize: "32px",
	fontWeight: "700",
	color: "#111827",
	margin: "0 0 24px 0",
	lineHeight: "1.2",
};

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
	marginBottom: "24px",
	padding: "20px",
	backgroundColor: "#f9fafb",
	borderRadius: "8px",
	borderLeft: "4px solid #3c6ff5",
};

const featureIcon = {
	fontSize: "32px",
	marginRight: "16px",
	lineHeight: "1",
	flexShrink: 0,
};

const featureContent = {
	flex: 1,
};

const featureTitle = {
	color: "#111827",
	fontSize: "18px",
	fontWeight: "600",
	margin: "0 0 6px 0",
	lineHeight: "24px",
};

const featureDescription = {
	color: "#6b7280",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "0",
};

const socialContainer = {
	margin: "24px 0 32px 0",
	textAlign: "center" as const,
};

const infoBox = {
	backgroundColor: "#f0f9ff",
	borderLeft: "4px solid #3c6ff5",
	padding: "24px",
	margin: "32px 0",
	borderRadius: "8px",
};

const list = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "16px 0 0 0",
	paddingLeft: "24px",
};

const listItem = {
	marginBottom: "12px",
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

