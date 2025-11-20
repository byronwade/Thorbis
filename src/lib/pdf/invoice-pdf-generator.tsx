/**
 * Invoice PDF Generator using React-PDF
 *
 * Generates professional PDF invoices that mirror the invoice preview
 *
 * Features:
 * - React-PDF based generation (Vercel compatible)
 * - Professional business document styling
 * - Matches invoice preview design
 * - Respects invoice settings
 */

import {
	Document,
	Font,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
	family: "Helvetica",
	fonts: [
		{
			src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf",
		},
		{
			src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf",
			fontWeight: "bold",
		},
	],
});

// PDF Styles - matches invoice preview
const PDF_COLORS = {
	white: "#FFFFFF",
	black: "#000000",
	textPrimary: "#333333",
	textSecondary: "#666666",
	border: "#E5E7EB",
};

const styles = StyleSheet.create({
	page: {
		padding: 72, // 1 inch
		fontFamily: "Helvetica",
		fontSize: 11,
		backgroundColor: PDF_COLORS.white,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 48,
		paddingBottom: 24,
		borderBottom: `2px solid ${PDF_COLORS.black}`,
	},
	headerLeft: {
		flex: 1,
	},
	companyName: {
		fontSize: 24,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginBottom: 8,
	},
	companyInfo: {
		fontSize: 10,
		marginBottom: 2,
		color: "#333333",
	},
	headerRight: {
		alignItems: "flex-end",
	},
	invoiceTitle: {
		fontSize: 40,
		fontWeight: "bold",
		marginBottom: 16,
	},
	invoiceMeta: {
		fontSize: 10,
		marginBottom: 4,
	},
	metaLabel: {
		color: PDF_COLORS.textSecondary,
	},
	metaValue: {
		fontWeight: "bold",
	},
	billToSection: {
		marginBottom: 36,
	},
	sectionTitle: {
		fontSize: 9,
		fontWeight: "bold",
		textTransform: "uppercase",
		color: PDF_COLORS.textSecondary,
		marginBottom: 12,
		letterSpacing: 0.5,
	},
	customerName: {
		fontWeight: "bold",
		marginBottom: 4,
	},
	customerInfo: {
		fontSize: 10,
		marginBottom: 2,
		color: "#333333",
	},
	table: {
		marginBottom: 36,
	},
	tableHeader: {
		flexDirection: "row",
		borderBottom: `2px solid ${PDF_COLORS.black}`,
		paddingBottom: 8,
		marginBottom: 8,
	},
	tableHeaderCell: {
		fontSize: 9,
		fontWeight: "bold",
		textTransform: "uppercase",
	},
	tableRow: {
		flexDirection: "row",
		borderBottom: `1px solid ${PDF_COLORS.border}`,
		paddingVertical: 12,
	},
	tableCell: {
		fontSize: 10,
	},
	tableCellRight: {
		textAlign: "right",
	},
	tableCellBold: {
		fontWeight: "bold",
	},
	// Column widths
	colDescription: {
		flex: 1,
	},
	colQty: {
		width: 60,
	},
	colRate: {
		width: 100,
	},
	colAmount: {
		width: 120,
	},
	totalsSection: {
		alignItems: "flex-end",
		marginBottom: 36,
	},
	totalsBox: {
		width: 300,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	totalLabel: {
		fontSize: 10,
		color: PDF_COLORS.textSecondary,
	},
	totalValue: {
		fontSize: 10,
	},
	grandTotalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderTop: `2px solid ${PDF_COLORS.black}`,
		paddingTop: 12,
		marginTop: 8,
	},
	grandTotalLabel: {
		fontSize: 11,
		fontWeight: "bold",
		textTransform: "uppercase",
	},
	grandTotalValue: {
		fontSize: 16,
		fontWeight: "bold",
	},
	notesSection: {
		marginBottom: 24,
	},
	notesText: {
		fontSize: 10,
		lineHeight: 1.5,
		color: PDF_COLORS.textPrimary,
	},
	footer: {
		marginTop: 48,
		paddingTop: 16,
		borderTop: `1px solid ${PDF_COLORS.border}`,
		alignItems: "center",
	},
	footerText: {
		fontSize: 10,
		color: PDF_COLORS.textSecondary,
	},
});

type InvoicePDFProps = {
	invoice: any;
	customer: any;
	company: any;
};

export function InvoicePDFDocument({
	invoice,
	customer,
	company,
}: InvoicePDFProps) {
	const lineItems = invoice.line_items || [];
	const subtotal = invoice.subtotal || invoice.total_amount;
	const taxAmount = invoice.tax_amount || 0;
	const discountAmount = invoice.discount_amount || 0;
	const total = invoice.total_amount;

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount / 100);

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text style={styles.companyName}>
							{company.name || "Company Name"}
						</Text>
						{company.address_line1 && (
							<Text style={styles.companyInfo}>{company.address_line1}</Text>
						)}
						{company.city && (
							<Text style={styles.companyInfo}>
								{company.city}, {company.state} {company.postal_code}
							</Text>
						)}
						{company.phone && (
							<Text style={styles.companyInfo}>{company.phone}</Text>
						)}
						{company.email && (
							<Text style={styles.companyInfo}>{company.email}</Text>
						)}
					</View>
					<View style={styles.headerRight}>
						<Text style={styles.invoiceTitle}>INVOICE</Text>
						<View>
							<Text style={styles.invoiceMeta}>
								<Text style={styles.metaLabel}>Invoice #: </Text>
								<Text style={styles.metaValue}>{invoice.invoice_number}</Text>
							</Text>
							<Text style={styles.invoiceMeta}>
								<Text style={styles.metaLabel}>Date: </Text>
								{formatDate(invoice.created_at)}
							</Text>
							{invoice.due_date && (
								<Text style={styles.invoiceMeta}>
									<Text style={styles.metaLabel}>Due: </Text>
									<Text style={styles.metaValue}>
										{formatDate(invoice.due_date)}
									</Text>
								</Text>
							)}
						</View>
					</View>
				</View>

				{/* Bill To */}
				<View style={styles.billToSection}>
					<Text style={styles.sectionTitle}>Bill To</Text>
					<Text style={styles.customerName}>
						{customer.display_name ||
							`${customer.first_name} ${customer.last_name}`}
					</Text>
					{customer.company_name && (
						<Text style={styles.customerInfo}>{customer.company_name}</Text>
					)}
					{customer.billing_address && (
						<Text style={styles.customerInfo}>{customer.billing_address}</Text>
					)}
					{customer.billing_city && (
						<Text style={styles.customerInfo}>
							{customer.billing_city}, {customer.billing_state}{" "}
							{customer.billing_zip}
						</Text>
					)}
					{customer.email && (
						<Text style={styles.customerInfo}>{customer.email}</Text>
					)}
					{customer.phone && (
						<Text style={styles.customerInfo}>{customer.phone}</Text>
					)}
				</View>

				{/* Line Items Table */}
				<View style={styles.table}>
					{/* Table Header */}
					<View style={styles.tableHeader}>
						<Text style={[styles.tableHeaderCell, styles.colDescription]}>
							Description
						</Text>
						<Text
							style={[
								styles.tableHeaderCell,
								styles.colQty,
								styles.tableCellRight,
							]}
						>
							Qty
						</Text>
						<Text
							style={[
								styles.tableHeaderCell,
								styles.colRate,
								styles.tableCellRight,
							]}
						>
							Rate
						</Text>
						<Text
							style={[
								styles.tableHeaderCell,
								styles.colAmount,
								styles.tableCellRight,
							]}
						>
							Amount
						</Text>
					</View>

					{/* Table Rows */}
					{lineItems.map((item: any, index: number) => (
						<View key={index} style={styles.tableRow}>
							<Text style={[styles.tableCell, styles.colDescription]}>
								{item.description}
							</Text>
							<Text
								style={[styles.tableCell, styles.colQty, styles.tableCellRight]}
							>
								{item.quantity}
							</Text>
							<Text
								style={[
									styles.tableCell,
									styles.colRate,
									styles.tableCellRight,
								]}
							>
								{formatCurrency(item.unit_price || item.unitPrice)}
							</Text>
							<Text
								style={[
									styles.tableCell,
									styles.colAmount,
									styles.tableCellRight,
									styles.tableCellBold,
								]}
							>
								{formatCurrency(item.amount || item.quantity * item.unit_price)}
							</Text>
						</View>
					))}
				</View>

				{/* Totals */}
				<View style={styles.totalsSection}>
					<View style={styles.totalsBox}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Subtotal</Text>
							<Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
						</View>
						{taxAmount > 0 && (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Tax</Text>
								<Text style={styles.totalValue}>
									{formatCurrency(taxAmount)}
								</Text>
							</View>
						)}
						{discountAmount > 0 && (
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Discount</Text>
								<Text style={styles.totalValue}>
									-{formatCurrency(discountAmount)}
								</Text>
							</View>
						)}
						<View style={styles.grandTotalRow}>
							<Text style={styles.grandTotalLabel}>Total</Text>
							<Text style={styles.grandTotalValue}>
								{formatCurrency(total)}
							</Text>
						</View>
					</View>
				</View>

				{/* Notes */}
				{invoice.notes && (
					<View style={styles.notesSection}>
						<Text style={styles.sectionTitle}>Notes</Text>
						<Text style={styles.notesText}>{invoice.notes}</Text>
					</View>
				)}

				{/* Footer */}
				<View style={styles.footer}>
					<Text style={styles.footerText}>Thank you for your business!</Text>
				</View>
			</Page>
		</Document>
	);
}
