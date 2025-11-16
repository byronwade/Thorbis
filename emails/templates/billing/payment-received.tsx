/**
 * Payment Received Email Template - Payment confirmation receipt
 *
 * Features:
 * - Payment confirmation
 * - Payment details
 * - Receipt download
 * - Thank you message
 */

import { Text } from "@react-email/components";
import type { PaymentReceivedProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function PaymentReceivedEmail({
	customerName,
	invoiceNumber,
	paymentAmount,
	paymentMethod,
	paymentDate,
	receiptUrl,
	previewText = `Payment received - ${paymentAmount}`,
}: PaymentReceivedProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Payment Received - Thank You!</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>This confirms that we've received your payment. Thank you for your prompt payment!</Text>

			<Card style={confirmationCard}>
				<div style={successIcon}>✓</div>
				<Text style={successText}>Payment Confirmed</Text>

				<div style={detailsGrid}>
					<div style={detailRow}>
						<Text style={detailLabel}>Invoice:</Text>
						<Text style={detailValue}>#{invoiceNumber}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Amount:</Text>
						<Text style={detailValue}>{paymentAmount}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Payment Method:</Text>
						<Text style={detailValue}>{paymentMethod}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Date:</Text>
						<Text style={detailValue}>{paymentDate}</Text>
					</div>
				</div>
			</Card>

			<div style={buttonContainer}>
				<Button href={receiptUrl}>Download Receipt</Button>
			</div>

			<Card style={thankYouCard}>
				<Text style={thankYouIcon}>🙏</Text>
				<Heading level={3}>We appreciate your business!</Heading>
				<Text style={thankYouText}>
					Your trust in our services means everything to us. We look forward to serving you again in the future.
				</Text>
			</Card>

			<Text style={footerNote}>
				Need help? Contact us at{" "}
				<a href="mailto:billing@thorbis.com" style={link}>
					billing@thorbis.com
				</a>
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

const confirmationCard = {
	background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
	borderRadius: "12px",
	padding: "40px",
	margin: "24px 0",
	textAlign: "center" as const,
};

const successIcon = {
	fontSize: "64px",
	color: EMAIL_COLORS.primaryText,
	backgroundColor: "rgba(245, 248, 254, 0.2)",
	width: "96px",
	height: "96px",
	borderRadius: "50%",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	margin: "0 auto 24px",
	fontWeight: "700",
};

const successText = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "24px",
	fontWeight: "700",
	margin: "0 0 32px 0",
};

const detailsGrid = {
	backgroundColor: "rgba(245, 248, 254, 0.95)",
	borderRadius: "8px",
	padding: "24px",
	margin: "0",
};

const detailRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	padding: "12px 0",
	borderBottom: "1px solid #e5e7eb",
};

const detailLabel = {
	color: "#6b7280",
	fontSize: "14px",
	fontWeight: "500",
	margin: "0",
};

const detailValue = {
	color: "#111827",
	fontSize: "14px",
	fontWeight: "600",
	margin: "0",
	textAlign: "right" as const,
};

const buttonContainer = {
	margin: "32px 0",
	textAlign: "center" as const,
};

const thankYouCard = {
	backgroundColor: "#fffbeb",
	border: "1px solid #fde68a",
	padding: "32px",
	margin: "32px 0",
	textAlign: "center" as const,
};

const thankYouIcon = {
	fontSize: "48px",
	margin: "0 0 16px 0",
};

const thankYouText = {
	color: "#92400e",
	fontSize: "15px",
	lineHeight: "22px",
	margin: "16px 0 0 0",
};

const footerNote = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "32px 0 0 0",
	textAlign: "center" as const,
};

const link = {
	color: "hsl(217 91% 60%)",
	textDecoration: "underline",
};
