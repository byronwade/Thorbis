/**
 * Invoice Sent Email Template - Invoice delivery with payment link
 *
 * Features:
 * - Invoice summary with line items
 * - Total amount and due date
 * - Payment link
 * - Download PDF option
 */

import { Text } from "@react-email/components";
import type { InvoiceSentProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Divider } from "../../components/divider";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function InvoiceSentEmail({
  customerName,
  invoiceNumber,
  totalAmount,
  dueDate,
  items,
  paymentUrl,
  downloadUrl,
  previewText = `Invoice ${invoiceNumber} - ${totalAmount}`,
}: InvoiceSentProps) {
  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>Your Invoice is Ready</Heading>

      <Text style={paragraph}>Hi {customerName},</Text>

      <Text style={paragraph}>
        Thank you for your business! Your invoice is now available.
      </Text>

      <Card style={invoiceCard}>
        <div style={invoiceHeader}>
          <Text style={invoiceLabel}>Invoice Number</Text>
          <Text style={invoiceNumberStyle}>#{invoiceNumber}</Text>
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <div style={itemsSection}>
          {items.map((item, index) => (
            <div key={index} style={itemRow}>
              <div style={itemDetails}>
                <Text style={itemDescription}>{item.description}</Text>
                <Text style={itemQuantity}>Qty: {item.quantity}</Text>
              </div>
              <Text style={itemAmount}>{item.amount}</Text>
            </div>
          ))}
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <div style={totalRow}>
          <Text style={totalLabel}>Total Amount:</Text>
          <Text style={totalAmountStyle}>{totalAmount}</Text>
        </div>

        <div style={dueRow}>
          <Text style={dueLabel}>Due Date:</Text>
          <Text style={dueDateStyle}>{dueDate}</Text>
        </div>
      </Card>

      <div style={buttonGroup}>
        <Button href={paymentUrl}>Pay Now</Button>
        <div style={secondaryButtonContainer}>
          <Button href={downloadUrl} variant="outline">
            Download PDF
          </Button>
        </div>
      </div>

      <Card style={paymentInfoCard}>
        <Heading level={3}>Payment Methods Accepted</Heading>
        <Text style={paymentText}>
          We accept credit cards, debit cards, ACH transfers, and checks. Choose
          your preferred payment method when you click "Pay Now" above.
        </Text>
      </Card>

      <Text style={footerNote}>
        Questions about this invoice? Contact us at{" "}
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

const invoiceCard = {
  backgroundColor: "#ffffff",
  border: "2px solid hsl(217 91% 60%)",
  borderRadius: "12px",
  padding: "32px",
  margin: "24px 0",
};

const invoiceHeader = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const invoiceLabel = {
  color: "#6b7280",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
};

const invoiceNumberStyle = {
  color: "hsl(217 91% 60%)",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0",
};

const itemsSection = {
  margin: "20px 0",
};

const itemRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const itemDetails = {
  flex: "1",
};

const itemDescription = {
  color: "#111827",
  fontSize: "15px",
  fontWeight: "500",
  margin: "0 0 4px 0",
};

const itemQuantity = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0",
};

const itemAmount = {
  color: "#111827",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0",
  textAlign: "right" as const,
};

const totalRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  marginTop: "20px",
};

const totalLabel = {
  color: "#111827",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0",
};

const totalAmountStyle = {
  color: "hsl(217 91% 60%)",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
};

const dueRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  marginTop: "12px",
};

const dueLabel = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const dueDateStyle = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const buttonGroup = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const secondaryButtonContainer = {
  marginTop: "12px",
};

const paymentInfoCard = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  margin: "24px 0",
};

const paymentText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "12px 0 0 0",
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
