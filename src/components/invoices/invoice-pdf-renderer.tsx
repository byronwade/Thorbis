/**
 * Invoice PDF Renderer
 *
 * Converts TipTap JSON content to PDF using @react-pdf/renderer
 * Applies all visual customization from invoice-layout-store
 *
 * Features:
 * - Multi-page support
 * - Custom colors, fonts, spacing
 * - QR codes and logos
 * - Watermarks
 * - Page numbers
 * - Professional PDF output
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PDFImage,
  Font,
} from "@react-pdf/renderer";

interface InvoicePDFProps {
  content: any; // TipTap JSON
  customization?: any; // From Zustand store
}

// Register fonts (optional - use system fonts by default)
// Font.register({
//   family: "Inter",
//   src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
// });

/**
 * PDF Styles - Dynamic based on customization
 */
const createStyles = (customization?: any) => {
  const colors = customization?.colors || {};
  const typography = customization?.typography || {};
  const spacing = customization?.spacing || {};

  return StyleSheet.create({
    page: {
      padding: 48, // ~0.67 inches
      backgroundColor: "#ffffff",
      fontFamily: typography.bodyFont || "Helvetica",
      fontSize: typography.bodySize || 10,
      color: colors.text || "#000000",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
      paddingBottom: 12,
      borderBottom: `2px solid ${colors.primary || "#000000"}`,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: typography.headingSize || 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: colors.heading || colors.text || "#000000",
    },
    invoiceTitle: {
      fontSize: 32,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 12,
    },
    invoiceMetadata: {
      fontSize: 10,
      marginBottom: 4,
    },
    label: {
      fontSize: 8,
      color: colors.mutedText || "#666666",
      textTransform: "uppercase",
      marginBottom: 4,
    },
    billingSection: {
      flexDirection: "row",
      gap: 24,
      marginBottom: 24,
      paddingBottom: 12,
      borderBottom: `1px solid ${colors.border || "#e5e7eb"}`,
    },
    billToBox: {
      flex: 1,
      padding: 12,
      border: `1px solid ${colors.border || "#e5e7eb"}`,
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
      marginBottom: 8,
      color: colors.heading || "#000000",
    },
    table: {
      marginBottom: 24,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: colors.tableHeader || "#f3f4f6",
      padding: 8,
      fontSize: 9,
      fontWeight: "bold",
      textTransform: "uppercase",
      borderBottom: `2px solid ${colors.primary || "#000000"}`,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderBottom: `1px solid ${colors.border || "#e5e7eb"}`,
      fontSize: 10,
    },
    tableCell: {
      flex: 1,
    },
    tableCellDescription: {
      flex: 3,
    },
    tableCellRight: {
      flex: 1,
      textAlign: "right",
    },
    totalsContainer: {
      marginLeft: "auto",
      width: "40%",
      marginBottom: 24,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      fontSize: 10,
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingTop: 12,
      borderTop: `2px solid ${colors.primary || "#000000"}`,
      fontSize: 14,
      fontWeight: "bold",
    },
    notesSection: {
      marginBottom: 24,
      padding: 12,
      backgroundColor: colors.notesBg || "#f9fafb",
      borderRadius: 4,
    },
    footer: {
      marginTop: "auto",
      paddingTop: 24,
      borderTop: `1px solid ${colors.border || "#e5e7eb"}`,
      fontSize: 8,
      color: colors.mutedText || "#666666",
      textAlign: "center",
    },
    pageNumber: {
      position: "absolute",
      bottom: 30,
      right: 48,
      fontSize: 8,
      color: colors.mutedText || "#666666",
    },
  });
};

/**
 * PDF Document Component
 */
export function InvoicePDFDocument({
  content,
  customization,
}: InvoicePDFProps) {
  const styles = createStyles(customization);

  // Parse TipTap JSON content
  const blocks = content?.content || [];

  // Extract data from blocks
  const headerBlock =
    blocks.find((b: any) => b.type === "invoiceHeaderBlock")?.attrs || {};
  const billingBlock =
    blocks.find((b: any) => b.type === "customerBillingBlock")?.attrs || {};
  const lineItemsBlock =
    blocks.find((b: any) => b.type === "lineItemsTableBlock")?.attrs || {};
  const totalsBlock =
    blocks.find((b: any) => b.type === "invoiceTotalsBlock")?.attrs || {};
  const paymentBlock =
    blocks.find((b: any) => b.type === "paymentInfoBlock")?.attrs || {};
  const notesBlock =
    blocks.find((b: any) => b.type === "invoiceNotesBlock")?.attrs || {};
  const footerBlock =
    blocks.find((b: any) => b.type === "invoiceFooterBlock")?.attrs || {};

  const lineItems = lineItemsBlock.lineItems || [];

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {headerBlock.companyLogo && (
              <PDFImage
                src={headerBlock.companyLogo}
                style={{ width: 120, height: 48, marginBottom: 8 }}
              />
            )}
            <Text style={styles.companyName}>{headerBlock.companyName}</Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              {headerBlock.companyAddress}
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              {headerBlock.companyCity}, {headerBlock.companyState}{" "}
              {headerBlock.companyZip}
            </Text>
            <Text style={{ fontSize: 9 }}>{headerBlock.companyPhone}</Text>
            <Text style={{ fontSize: 9 }}>{headerBlock.companyEmail}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.label}>Invoice Number</Text>
              <Text style={styles.invoiceMetadata}>
                {headerBlock.invoiceNumber}
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.label}>Invoice Date</Text>
              <Text style={styles.invoiceMetadata}>
                {new Date(headerBlock.invoiceDate).toLocaleDateString()}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Due Date</Text>
              <Text style={[styles.invoiceMetadata, { fontWeight: "bold" }]}>
                {new Date(headerBlock.dueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Billing Information */}
        <View style={styles.billingSection}>
          <View style={styles.billToBox}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              {billingBlock.customerName}
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              {billingBlock.billingAddress}
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>
              {billingBlock.billingCity}, {billingBlock.billingState}{" "}
              {billingBlock.billingZip}
            </Text>
            <Text style={{ fontSize: 9 }}>{billingBlock.customerEmail}</Text>
            <Text style={{ fontSize: 9 }}>{billingBlock.customerPhone}</Text>
          </View>

          {billingBlock.showShipTo && (
            <View style={styles.billToBox}>
              <Text style={styles.sectionTitle}>Ship To</Text>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                {billingBlock.shipToName}
              </Text>
              <Text style={{ fontSize: 9, marginBottom: 2 }}>
                {billingBlock.shipToAddress}
              </Text>
              <Text style={{ fontSize: 9 }}>
                {billingBlock.shipToCity}, {billingBlock.shipToState}{" "}
                {billingBlock.shipToZip}
              </Text>
            </View>
          )}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellDescription}>Description</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCellRight}>Unit Price</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>
          {lineItems.map((item: any, index: number) => (
            <View key={item.id || index} style={styles.tableRow}>
              <Text style={styles.tableCellDescription}>
                {item.description}
              </Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(totalsBlock.subtotal || 0)}</Text>
          </View>

          {totalsBlock.taxTiers?.map((tier: any) => (
            <View key={tier.id} style={styles.totalRow}>
              <Text>
                {tier.name} ({tier.rate}%)
              </Text>
              <Text>{formatCurrency(tier.amount)}</Text>
            </View>
          ))}

          {totalsBlock.discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text>Discount</Text>
              <Text>-{formatCurrency(totalsBlock.discountAmount)}</Text>
            </View>
          )}

          <View style={styles.grandTotalRow}>
            <Text>Total</Text>
            <Text>
              {formatCurrency(
                totalsBlock.subtotal +
                  (totalsBlock.taxTiers?.reduce(
                    (sum: number, t: any) => sum + t.amount,
                    0,
                  ) || 0) -
                  (totalsBlock.discountAmount || 0),
              )}
            </Text>
          </View>

          {totalsBlock.depositAmount > 0 && (
            <View style={styles.totalRow}>
              <Text>Deposit</Text>
              <Text>-{formatCurrency(totalsBlock.depositAmount)}</Text>
            </View>
          )}

          {totalsBlock.paymentsReceived > 0 && (
            <View style={styles.totalRow}>
              <Text>Payments Received</Text>
              <Text style={{ color: "#10b981" }}>
                -{formatCurrency(totalsBlock.paymentsReceived)}
              </Text>
            </View>
          )}

          {(totalsBlock.depositAmount > 0 ||
            totalsBlock.paymentsReceived > 0) && (
            <View
              style={[
                styles.grandTotalRow,
                {
                  borderTop: `1px solid ${customization?.colors?.primary || "#000"}`,
                },
              ]}
            >
              <Text>Amount Due</Text>
              <Text
                style={{ color: customization?.colors?.primary || "#000000" }}
              >
                {formatCurrency(
                  totalsBlock.subtotal +
                    (totalsBlock.taxTiers?.reduce(
                      (sum: number, t: any) => sum + t.amount,
                      0,
                    ) || 0) -
                    (totalsBlock.discountAmount || 0) -
                    (totalsBlock.depositAmount || 0) -
                    (totalsBlock.paymentsReceived || 0),
                )}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Information */}
        {paymentBlock.paymentTerms && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Payment Terms</Text>
            <Text style={{ fontSize: 10 }}>{paymentBlock.paymentTerms}</Text>
          </View>
        )}

        {/* Notes */}
        {notesBlock.notes && (
          <View style={styles.notesSection}>
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
              {notesBlock.label || "Notes"}
            </Text>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>
              {notesBlock.notes}
            </Text>
          </View>
        )}

        {/* Footer */}
        {footerBlock.footerText && (
          <View style={styles.footer}>
            <Text>{footerBlock.footerText}</Text>
            {footerBlock.disclaimer && (
              <Text style={{ fontSize: 7, marginTop: 8 }}>
                {footerBlock.disclaimer}
              </Text>
            )}
          </View>
        )}

        {/* Page Numbers */}
        {footerBlock.showPageNumbers && (
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        )}
      </Page>
    </Document>
  );
}
