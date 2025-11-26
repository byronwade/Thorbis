/**
 * Invoice Sent Email Template
 *
 * Sent to customers when an invoice is generated.
 * Features:
 * - Invoice summary with amount due
 * - Line items breakdown
 * - Payment button with secure link
 * - Download PDF link
 */

import { Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { Card } from "@/emails/components/card";
import { Heading } from "@/emails/components/heading";
import { BaseLayout } from "@/emails/layouts/base-layout";
import { EMAIL_COLORS } from "@/emails/theme";

export type InvoiceSentEmailProps = {
	customerName: string;
	invoiceNumber: string;
	totalAmount: string;
	dueDate: string;
	items: Array<{
		description: string;
		quantity: number;
		amount: string;
	}>;
	paymentUrl: string;
	downloadUrl: string;
	previewText?: string;
};

export default function InvoiceSentEmail({
	customerName,
	invoiceNumber,
	totalAmount,
	dueDate,
	items,
	paymentUrl,
	downloadUrl,
	previewText = `Invoice ${invoiceNumber} for ${totalAmount}`,
}: InvoiceSentEmailProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Invoice {invoiceNumber}</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				Thank you for your business! Please find your invoice details below.
			</Text>

			{/* Invoice Summary Card */}
			<Card style={invoiceCard}>
				<div style={invoiceHeader}>
					<Text style={invoiceLabel}>Amount Due</Text>
					<Text style={invoiceAmount}>{totalAmount}</Text>
				</div>
				<div style={invoiceDetails}>
					<div style={detailRow}>
						<Text style={detailLabel}>Invoice Number:</Text>
						<Text style={detailValue}>{invoiceNumber}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Due Date:</Text>
						<Text style={detailValue}>{dueDate}</Text>
					</div>
				</div>
			</Card>

			{/* Line Items */}
			{items.length > 0 && (
				<Card style={itemsCard}>
					<Heading level={3} style={{ marginBottom: "16px" }}>
						Invoice Details
					</Heading>
					<table style={itemsTable}>
						<thead>
							<tr>
								<th style={tableHeader}>Description</th>
								<th style={{ ...tableHeader, textAlign: "center" }}>Qty</th>
								<th style={{ ...tableHeader, textAlign: "right" }}>Amount</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									<td style={tableCell}>{item.description}</td>
									<td style={{ ...tableCell, textAlign: "center" }}>
										{item.quantity}
									</td>
									<td style={{ ...tableCell, textAlign: "right" }}>
										{item.amount}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan={2} style={{ ...tableCell, fontWeight: "bold" }}>
									Total
								</td>
								<td
									style={{
										...tableCell,
										textAlign: "right",
										fontWeight: "bold",
									}}
								>
									{totalAmount}
								</td>
							</tr>
						</tfoot>
					</table>
				</Card>
			)}

			{/* Payment Button */}
			<div style={buttonContainer}>
				<Button href={paymentUrl}>Pay Now</Button>
			</div>

			{/* Secondary Actions */}
			<Card style={actionsCard}>
				<Text style={actionsText}>
					<a href={downloadUrl} style={link}>
						Download PDF Invoice
					</a>
				</Text>
			</Card>

			{/* Footer Note */}
			<Text style={footerNote}>
				If you have any questions about this invoice, please don't hesitate to
				contact us. We appreciate your prompt payment.
			</Text>
		</BaseLayout>
	);
}

// Styles
const paragraph: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: EMAIL_COLORS.text,
	margin: "16px 0",
};

const invoiceCard: React.CSSProperties = {
	backgroundColor: EMAIL_COLORS.primary,
	padding: "24px",
	borderRadius: "8px",
	marginBottom: "24px",
};

const invoiceHeader: React.CSSProperties = {
	textAlign: "center" as const,
	marginBottom: "16px",
};

const invoiceLabel: React.CSSProperties = {
	fontSize: "14px",
	color: "rgba(255, 255, 255, 0.8)",
	margin: "0 0 4px 0",
};

const invoiceAmount: React.CSSProperties = {
	fontSize: "36px",
	fontWeight: "bold",
	color: "#ffffff",
	margin: "0",
};

const invoiceDetails: React.CSSProperties = {
	borderTop: "1px solid rgba(255, 255, 255, 0.2)",
	paddingTop: "16px",
};

const detailRow: React.CSSProperties = {
	display: "flex",
	justifyContent: "space-between",
	marginBottom: "8px",
};

const detailLabel: React.CSSProperties = {
	fontSize: "14px",
	color: "rgba(255, 255, 255, 0.8)",
	margin: "0",
};

const detailValue: React.CSSProperties = {
	fontSize: "14px",
	color: "#ffffff",
	fontWeight: "500",
	margin: "0",
};

const itemsCard: React.CSSProperties = {
	marginBottom: "24px",
};

const itemsTable: React.CSSProperties = {
	width: "100%",
	borderCollapse: "collapse" as const,
};

const tableHeader: React.CSSProperties = {
	fontSize: "12px",
	fontWeight: "600",
	color: EMAIL_COLORS.muted,
	textTransform: "uppercase" as const,
	textAlign: "left" as const,
	padding: "8px 0",
	borderBottom: `1px solid ${EMAIL_COLORS.border}`,
};

const tableCell: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.text,
	padding: "12px 0",
	borderBottom: `1px solid ${EMAIL_COLORS.border}`,
};

const buttonContainer: React.CSSProperties = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const actionsCard: React.CSSProperties = {
	textAlign: "center" as const,
	padding: "16px",
	marginBottom: "24px",
};

const actionsText: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	margin: "0",
};

const link: React.CSSProperties = {
	color: EMAIL_COLORS.primary,
	textDecoration: "underline",
};

const footerNote: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	textAlign: "center" as const,
	margin: "24px 0 0 0",
};
