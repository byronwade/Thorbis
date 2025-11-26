/**
 * Estimate Sent Email Template
 *
 * Sent to customers when an estimate is generated.
 * Features:
 * - Estimate summary with total amount
 * - Line items breakdown
 * - Accept estimate button
 * - Validity period notice
 */

import { Text } from "@react-email/components";
import { Button } from "@/emails/components/button";
import { Card } from "@/emails/components/card";
import { Heading } from "@/emails/components/heading";
import { BaseLayout } from "@/emails/layouts/base-layout";
import { EMAIL_COLORS } from "@/emails/theme";

export type EstimateSentEmailProps = {
	customerName: string;
	estimateNumber: string;
	totalAmount: string;
	validUntil: string;
	items: Array<{
		description: string;
		amount: string;
	}>;
	acceptUrl: string;
	viewUrl: string;
	previewText?: string;
};

export default function EstimateSentEmail({
	customerName,
	estimateNumber,
	totalAmount,
	validUntil,
	items,
	acceptUrl,
	viewUrl,
	previewText = `Estimate ${estimateNumber} for ${totalAmount}`,
}: EstimateSentEmailProps) {
	return (
		<BaseLayout previewText={previewText}>
			<Heading level={1}>Estimate {estimateNumber}</Heading>

			<Text style={paragraph}>Hi {customerName},</Text>

			<Text style={paragraph}>
				Thank you for your interest! We've prepared an estimate for the services
				you requested. Please review the details below.
			</Text>

			{/* Estimate Summary Card */}
			<Card style={estimateCard}>
				<div style={estimateHeader}>
					<Text style={estimateLabel}>Estimated Total</Text>
					<Text style={estimateAmount}>{totalAmount}</Text>
				</div>
				<div style={estimateDetails}>
					<div style={detailRow}>
						<Text style={detailLabel}>Estimate Number:</Text>
						<Text style={detailValue}>{estimateNumber}</Text>
					</div>
					<div style={detailRow}>
						<Text style={detailLabel}>Valid Until:</Text>
						<Text style={detailValue}>{validUntil}</Text>
					</div>
				</div>
			</Card>

			{/* Line Items */}
			{items.length > 0 && (
				<Card style={itemsCard}>
					<Heading level={3} style={{ marginBottom: "16px" }}>
						Estimate Details
					</Heading>
					<table style={itemsTable}>
						<thead>
							<tr>
								<th style={tableHeader}>Description</th>
								<th style={{ ...tableHeader, textAlign: "right" }}>Amount</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, index) => (
								<tr key={index}>
									<td style={tableCell}>{item.description}</td>
									<td style={{ ...tableCell, textAlign: "right" }}>
										{item.amount}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td style={{ ...tableCell, fontWeight: "bold" }}>Total</td>
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

			{/* Accept Button */}
			<div style={buttonContainer}>
				<Button href={acceptUrl}>Accept Estimate</Button>
			</div>

			{/* Secondary Actions */}
			<Card style={actionsCard}>
				<Text style={actionsText}>
					<a href={viewUrl} style={link}>
						View Full Estimate Online
					</a>
				</Text>
			</Card>

			{/* Validity Notice */}
			<Card style={validityCard}>
				<Text style={validityText}>
					This estimate is valid until <strong>{validUntil}</strong>. Prices and
					availability are subject to change after this date.
				</Text>
			</Card>

			{/* Footer Note */}
			<Text style={footerNote}>
				If you have any questions about this estimate or would like to discuss
				modifications, please don't hesitate to contact us. We're here to help!
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

const estimateCard: React.CSSProperties = {
	backgroundColor: EMAIL_COLORS.success,
	padding: "24px",
	borderRadius: "8px",
	marginBottom: "24px",
};

const estimateHeader: React.CSSProperties = {
	textAlign: "center" as const,
	marginBottom: "16px",
};

const estimateLabel: React.CSSProperties = {
	fontSize: "14px",
	color: "rgba(255, 255, 255, 0.8)",
	margin: "0 0 4px 0",
};

const estimateAmount: React.CSSProperties = {
	fontSize: "36px",
	fontWeight: "bold",
	color: "#ffffff",
	margin: "0",
};

const estimateDetails: React.CSSProperties = {
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

const validityCard: React.CSSProperties = {
	backgroundColor: EMAIL_COLORS.warning + "20",
	borderLeft: `4px solid ${EMAIL_COLORS.warning}`,
	padding: "16px",
	marginBottom: "24px",
};

const validityText: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.text,
	margin: "0",
};

const footerNote: React.CSSProperties = {
	fontSize: "14px",
	color: EMAIL_COLORS.muted,
	textAlign: "center" as const,
	margin: "24px 0 0 0",
};
