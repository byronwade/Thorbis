/**
 * Invoice Notification Email Template
 *
 * Design:
 * - Company-branded layout (company logo, colors, contact info)
 * - Clean invoice summary
 * - Full-width sections (no cards)
 * - Professional invoice presentation
 */

import { Text } from "@react-email/components";
import type { InvoiceNotificationProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { CompanyLayout } from "../../layouts/company-layout";

const CENTS_IN_DOLLAR = 100;

export default function InvoiceNotificationEmail({
	customerName,
	invoiceNumber,
	invoiceDate,
	dueDate,
	totalAmount,
	items,
	notes,
	invoiceUrl,
	paymentLink,
	customBody,
	customFooter,
	currency = "USD",
	previewText,
	company,
}: InvoiceNotificationProps) {
	const amountFormatted = formatCurrency(totalAmount, currency);

	// Default company if not provided
	const companyBranding = company || {
		companyName: "Your Company",
		supportEmail: "support@yourcompany.com",
	};

	const defaultPreviewText =
		previewText ||
		`Invoice ${invoiceNumber} from ${companyBranding.companyName}`;

	return (
		<CompanyLayout company={companyBranding} previewText={defaultPreviewText}>
			{/* Main Heading */}
			<Heading level={1}>Invoice {invoiceNumber} 💼</Heading>

			{/* Custom or Default Body */}
			{customBody ? (
				<div>
					{customBody.split("\n").map((line, index) => {
						const trimmedLine = line.trim();
						const key = `${index}-${trimmedLine || "empty-line"}`;
						return (
							<Text key={key} style={paragraph}>
								{line}
							</Text>
						);
					})}
				</div>
			) : (
				<>
					<Text style={paragraph}>Hi {customerName},</Text>

					<Text style={paragraph}>
						We've prepared invoice <strong>#{invoiceNumber}</strong> for you.
						Please review the details below and click the button to view or pay
						online.
					</Text>
				</>
			)}

			{/* Invoice Summary */}
			<div style={summarySection}>
				<div style={summaryRow}>
					<Text style={summaryLabel}>Invoice Number</Text>
					<Text style={summaryValue}>#{invoiceNumber}</Text>
				</div>
				<div style={summaryRow}>
					<Text style={summaryLabel}>Amount Due</Text>
					<Text style={summaryAmount}>{amountFormatted}</Text>
				</div>
				<div style={summaryRow}>
					<Text style={summaryLabel}>Invoice Date</Text>
					<Text style={summaryValue}>
						{new Date(invoiceDate).toLocaleDateString()}
					</Text>
				</div>
				{dueDate && (
					<div style={summaryRow}>
						<Text style={summaryLabel}>Due Date</Text>
						<Text style={summaryValue}>
							{new Date(dueDate).toLocaleDateString()}
						</Text>
					</div>
				)}
			</div>

			{/* Invoice Items */}
			{Array.isArray(items) && items.length > 0 && (
				<div style={itemsSection}>
					<Heading level={3}>Invoice Items</Heading>
					{items.map((item) => {
						const key = `${item.description}-${item.quantity}-${item.amount}`;
						return (
							<div key={key} style={itemRow}>
								<div style={itemDetails}>
									<Text style={itemDescription}>{item.description}</Text>
									<Text style={itemQuantity}>Qty: {item.quantity}</Text>
								</div>
								<Text style={itemAmount}>
									{formatCurrency(item.amount, currency)}
								</Text>
							</div>
						);
					})}
				</div>
			)}

			{/* Notes */}
			{notes && (
				<div style={notesSection}>
					<Heading level={3}>📝 Notes</Heading>
					<Text style={notesText}>{notes}</Text>
				</div>
			)}

			{/* Call to Action */}
			<div style={buttonContainer}>
				{paymentLink ? (
					<Button href={paymentLink}>Pay Invoice Online</Button>
				) : (
					<Button href={invoiceUrl}>View Invoice</Button>
				)}
			</div>

			{/* Footer Message */}
			{customFooter ? (
				<div style={footerSection}>
					<Text style={footerText}>{customFooter}</Text>
				</div>
			) : (
				<div style={footerSection}>
					<Heading level={3}>💡 Need Assistance?</Heading>
					<Text style={footerText}>
						If you have any questions about this invoice, reply to this email or
						contact our support team. We're happy to help!
					</Text>
				</div>
			)}
		</CompanyLayout>
	);
}

// Styles - Clean, full-width design (no cards)
const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "26px",
	margin: "0 0 20px 0",
};

const summarySection = {
	backgroundColor: "#f0f9ff",
	borderLeft: "4px solid #3b82f6",
	padding: "24px",
	margin: "24px 0",
	borderRadius: "4px",
};

const summaryRow = {
	display: "flex" as const,
	alignItems: "center",
	justifyContent: "space-between",
	marginBottom: "16px",
	paddingBottom: "16px",
	borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
};

const summaryLabel = {
	color: "#6b7280",
	fontSize: "14px",
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	fontWeight: "500",
	margin: "0",
};

const summaryValue = {
	color: "#111827",
	fontSize: "18px",
	fontWeight: "600",
	margin: "0",
};

const summaryAmount = {
	color: "#3b82f6",
	fontSize: "28px",
	fontWeight: "700",
	margin: "0",
};

const itemsSection = {
	backgroundColor: "#f9fafb",
	borderLeft: "4px solid #9ca3af",
	padding: "24px",
	margin: "24px 0",
	borderRadius: "4px",
};

const itemRow = {
	display: "flex" as const,
	justifyContent: "space-between",
	alignItems: "flex-start",
	padding: "16px 0",
	borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
};

const itemDetails = {
	flex: 1,
	marginRight: "16px",
};

const itemDescription = {
	color: "#0f172a",
	fontSize: "15px",
	fontWeight: "600",
	margin: "0 0 6px 0",
	lineHeight: "22px",
};

const itemQuantity = {
	color: "#64748b",
	fontSize: "13px",
	margin: "0",
};

const itemAmount = {
	color: "#0f172a",
	fontSize: "15px",
	fontWeight: "600",
	margin: "0",
	minWidth: "100px",
	textAlign: "right" as const,
};

const notesSection = {
	backgroundColor: "#fffbeb",
	borderLeft: "4px solid #fbbf24",
	padding: "20px 24px",
	margin: "24px 0",
	borderRadius: "4px",
};

const notesText = {
	color: "#92400e",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "8px 0 0 0",
};

const buttonContainer = {
	margin: "40px 0",
	textAlign: "center" as const,
};

const footerSection = {
	backgroundColor: "#eff6ff",
	borderLeft: "4px solid #3b82f6",
	padding: "24px",
	margin: "32px 0 0 0",
	borderRadius: "4px",
};

const footerText = {
	color: "#1e40af",
	fontSize: "15px",
	lineHeight: "24px",
	margin: "12px 0 0 0",
};

function formatCurrency(amountInCents: number, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amountInCents / CENTS_IN_DOLLAR);
}
