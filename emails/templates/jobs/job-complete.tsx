/**
 * Job Complete Email Template - Service completed notification
 *
 * Features:
 * - Completion confirmation
 * - Job summary
 * - Invoice link
 * - Review request
 */

import { Text } from "@react-email/components";
import type { JobCompleteProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Divider } from "../../components/divider";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function JobCompleteEmail({
	customerName,
	jobNumber,
	completedDate,
	totalAmount,
	invoiceUrl,
	reviewUrl,
	previewText = "Your service is complete!",
}: JobCompleteProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Service Completed!</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				Great news! Your service has been completed successfully. Thank you for choosing Thorbis.
			</Text>

			<Card style={summaryCard}>
				<Text style={successIcon}>✓</Text>
				<Text style={successText}>Job Completed</Text>
				<div style={summaryRow}>
					<Text style={summaryLabel}>Job Number:</Text>
					<Text style={summaryValue}>#{jobNumber}</Text>
				</div>
				<div style={summaryRow}>
					<Text style={summaryLabel}>Completed:</Text>
					<Text style={summaryValue}>{completedDate}</Text>
				</div>
				<Divider />
				<div style={summaryRow}>
					<Text style={totalLabel}>Total Amount:</Text>
					<Text style={totalValue}>{totalAmount}</Text>
				</div>
			</Card>

			<div style={buttonGroup}>
				<Button href={invoiceUrl}>View Invoice</Button>
			</div>

			<Card style={reviewCard}>
				<Heading level={3}>How did we do?</Heading>
				<Text style={reviewText}>
					Your feedback helps us improve our service. We'd love to hear about your experience!
				</Text>
				<div style={reviewButtonContainer}>
					<Button href={reviewUrl} variant="outline">
						Leave a Review
					</Button>
				</div>
			</Card>

			<Card style={thankYouCard}>
				<Text style={thankYouText}>Thank you for your business! We look forward to serving you again.</Text>
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

const summaryCard = {
	backgroundColor: "#f0fdf4",
	border: "2px solid #22c55e",
	borderRadius: "12px",
	padding: "32px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const successIcon = {
	fontSize: "64px",
	color: "#22c55e",
	margin: "0 0 16px 0",
};

const successText = {
	color: "#166534",
	fontSize: "24px",
	fontWeight: "700",
	margin: "0 0 24px 0",
};

const summaryRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	margin: "12px 0",
};

const summaryLabel = {
	color: "#166534",
	fontSize: "14px",
	fontWeight: "500",
	margin: "0",
};

const summaryValue = {
	color: "#166534",
	fontSize: "14px",
	fontWeight: "600",
	margin: "0",
};

const totalLabel = {
	color: "#166534",
	fontSize: "18px",
	fontWeight: "600",
	margin: "0",
};

const totalValue = {
	color: "#166534",
	fontSize: "24px",
	fontWeight: "700",
	margin: "0",
};

const buttonGroup = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const reviewCard = {
	backgroundColor: "#fffbeb",
	border: "1px solid #fde68a",
	padding: "24px",
	margin: "32px 0",
	textAlign: "center" as const,
};

const reviewText = {
	color: "#92400e",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "12px 0 24px 0",
};

const reviewButtonContainer = {
	textAlign: "center" as const,
};

const thankYouCard = {
	backgroundColor: "#f9fafb",
	border: "none",
	padding: "24px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const thankYouText = {
	color: "#6b7280",
	fontSize: "16px",
	fontStyle: "italic" as const,
	margin: "0",
};
