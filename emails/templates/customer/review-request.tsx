/**
 * Review Request Email Template - Request customer feedback
 *
 * Features:
 * - Friendly review request
 * - Job details
 * - Direct link to review platform
 * - Social proof elements
 */

import { Text } from "@react-email/components";
import type { ReviewRequestProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function ReviewRequestEmail({
	customerName,
	jobNumber,
	technicianName,
	completedDate,
	reviewUrl,
	previewText = "How did we do? Share your feedback",
}: ReviewRequestProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>How was your experience?</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				We hope you're enjoying your recently completed service! Your feedback is incredibly
				valuable to us and helps other customers make informed decisions.
			</Text>

			<Card style={serviceCard}>
				<Text style={serviceLabel}>Completed Service</Text>
				<div style={serviceDetails}>
					<div style={detailRow}>
						<Text style={detailLabel}>Job Number:</Text>
						<Text style={detailValue}>#{jobNumber}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Technician:</Text>
						<Text style={detailValue}>{technicianName}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Completed:</Text>
						<Text style={detailValue}>{completedDate}</Text>
					</div>
				</div>
			</Card>

			<Card style={reviewCard}>
				<div style={starsContainer}>
					<Text style={starsText}>⭐ ⭐ ⭐ ⭐ ⭐</Text>
				</div>
				<Text style={reviewPrompt}>Did {technicianName} provide excellent service?</Text>
				<Text style={reviewSubtext}>It only takes a minute to share your experience</Text>
			</Card>

			<div style={buttonContainer}>
				<Button href={reviewUrl}>Leave a Review</Button>
			</div>

			<Card style={impactCard}>
				<Heading level={3}>Your review helps us:</Heading>
				<ul style={list}>
					<li style={listItem}>Recognize and reward our best technicians</li>
					<li style={listItem}>Improve our services based on your feedback</li>
					<li style={listItem}>Help neighbors find reliable service providers</li>
					<li style={listItem}>Grow our small business in the community</li>
				</ul>
			</Card>

			<Text style={thankYouText}>
				Thank you for choosing Thorbis and for taking the time to share your experience!
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

const serviceCard = {
	backgroundColor: "#f9fafb",
	border: "1px solid #e5e7eb",
	borderRadius: "8px",
	padding: "24px",
	margin: "24px 0",
};

const serviceLabel = {
	color: "#6b7280",
	fontSize: "12px",
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	margin: "0 0 16px 0",
};

const serviceDetails = {
	margin: "0",
};

const detailRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	padding: "8px 0",
	borderBottom: "1px solid #f3f4f6",
};

const detailLabel = {
	color: "#6b7280",
	fontSize: "14px",
	margin: "0",
};

const detailValue = {
	color: "#111827",
	fontSize: "14px",
	fontWeight: "600",
	margin: "0",
};

const reviewCard = {
	background: "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
	borderRadius: "12px",
	padding: "40px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const starsContainer = {
	marginBottom: "20px",
};

const starsText = {
	fontSize: "48px",
	margin: "0",
	lineHeight: "1",
};

const reviewPrompt = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "22px",
	fontWeight: "600",
	margin: "0 0 12px 0",
};

const reviewSubtext = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "16px",
	margin: "0",
	opacity: 0.9,
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const impactCard = {
	backgroundColor: "#eff6ff",
	border: "1px solid #bfdbfe",
	margin: "32px 0",
};

const list = {
	color: "#1e40af",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "12px 0 0 20px",
	padding: "0",
};

const listItem = {
	margin: "0 0 10px 0",
};

const thankYouText = {
	color: "#6b7280",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
	fontStyle: "italic" as const,
};
