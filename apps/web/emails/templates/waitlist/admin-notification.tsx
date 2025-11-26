/**
 * Waitlist Admin Notification Email
 *
 * Sent to admin when a new user joins the waitlist
 * - Simple notification format
 * - User details
 * - Timestamp
 */

import { Text } from "@react-email/components";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export interface WaitlistAdminNotificationProps {
	userName: string;
	userEmail: string;
	previewText?: string;
}

export default function WaitlistAdminNotificationEmail({
	userName,
	userEmail,
	previewText = "New waitlist signup",
}: WaitlistAdminNotificationProps) {
	const timestamp = new Date().toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: "UTC",
	});

	return (
		<BaseLayout previewText={previewText}>
			{/* Heading */}
			<Heading level={1} style={heading}>
				New Waitlist Signup 🎉
			</Heading>

			{/* Notification Message */}
			<Text style={paragraph}>A new user has joined the Thorbis waitlist:</Text>

			{/* User Details */}
			<div style={detailsBox}>
				<div style={detailRow}>
					<Text style={detailLabel}>Name:</Text>
					<Text style={detailValue}>{userName}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Email:</Text>
					<Text style={detailValue}>{userEmail}</Text>
				</div>
				<div style={detailRow}>
					<Text style={detailLabel}>Signed up:</Text>
					<Text style={detailValue}>{timestamp} UTC</Text>
				</div>
			</div>

			{/* Closing */}
			<Text style={paragraph}>
				This is an automated notification. The user has been added to your
				Resend audience and received a welcome email.
			</Text>
		</BaseLayout>
	);
}

// Styles
const heading = {
	fontSize: "28px",
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

const detailsBox = {
	backgroundColor: "#f9fafb",
	borderLeft: "4px solid #3c6ff5",
	padding: "24px",
	margin: "24px 0 32px 0",
	borderRadius: "8px",
};

const detailRow = {
	marginBottom: "12px",
	display: "flex",
};

const detailLabel = {
	color: "#6b7280",
	fontSize: "15px",
	fontWeight: "600",
	margin: "0 8px 0 0",
	lineHeight: "22px",
	minWidth: "100px",
};

const detailValue = {
	color: "#111827",
	fontSize: "15px",
	margin: "0",
	lineHeight: "22px",
	fontWeight: "500",
};
