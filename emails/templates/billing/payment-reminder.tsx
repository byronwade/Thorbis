/**
 * Payment Reminder Email Template - Overdue payment notification
 *
 * Features:
 * - Friendly but firm reminder
 * - Invoice details
 * - Days overdue
 * - Easy payment link
 */

import { Text } from "@react-email/components";
import type { PaymentReminderProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function PaymentReminderEmail({
  customerName,
  invoiceNumber,
  totalAmount,
  dueDate,
  daysOverdue,
  paymentUrl,
  previewText = `Payment reminder: Invoice ${invoiceNumber}`,
}: PaymentReminderProps) {
  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>Payment Reminder</Heading>

      <Text style={paragraph}>Hi {customerName},</Text>

      <Text style={paragraph}>
        We wanted to remind you that payment for the following invoice is now
        overdue. We understand that sometimes invoices can slip through the
        cracks, so we're sending this friendly reminder.
      </Text>

      <Card style={reminderCard}>
        <div style={overdueHeader}>
          <Text style={overdueLabel}>Payment Overdue</Text>
          <Text style={overdueDays}>{daysOverdue} days</Text>
        </div>

        <div style={invoiceDetails}>
          <div style={detailRow}>
            <Text style={detailLabel}>Invoice Number:</Text>
            <Text style={detailValue}>#{invoiceNumber}</Text>
          </div>
          <div style={detailRow}>
            <Text style={detailLabel}>Original Due Date:</Text>
            <Text style={detailValue}>{dueDate}</Text>
          </div>
          <div style={detailRow}>
            <Text style={detailLabel}>Amount Due:</Text>
            <Text style={amountDue}>{totalAmount}</Text>
          </div>
        </div>
      </Card>

      <div style={buttonContainer}>
        <Button href={paymentUrl}>Pay Now</Button>
      </div>

      <Card style={helpCard}>
        <Heading level={3}>Need help?</Heading>
        <Text style={helpText}>
          If you're experiencing financial difficulties or have questions about
          this invoice, please don't hesitate to reach out. We're here to work
          with you.
        </Text>
        <ul style={contactList}>
          <li style={contactItem}>
            Email:{" "}
            <a href="mailto:billing@thorbis.com" style={link}>
              billing@thorbis.com
            </a>
          </li>
          <li style={contactItem}>
            Phone:{" "}
            <a href="tel:+1234567890" style={link}>
              (123) 456-7890
            </a>
          </li>
        </ul>
      </Card>

      <Text style={footerNote}>
        If you've already sent payment, please disregard this reminder and
        accept our thanks!
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

const reminderCard = {
  backgroundColor: "#fef2f2",
  border: "2px solid #fca5a5",
  borderRadius: "12px",
  padding: "32px",
  margin: "24px 0",
};

const overdueHeader = {
  textAlign: "center" as const,
  marginBottom: "24px",
  paddingBottom: "20px",
  borderBottom: "1px solid #fca5a5",
};

const overdueLabel = {
  color: "#991b1b",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
};

const overdueDays = {
  color: "#dc2626",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0",
};

const invoiceDetails = {
  backgroundColor: EMAIL_COLORS.surface,
  borderRadius: "8px",
  padding: "20px",
};

const detailRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  padding: "10px 0",
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
  textAlign: "right" as const,
};

const amountDue = {
  color: "#dc2626",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0",
  textAlign: "right" as const,
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const helpCard = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  margin: "32px 0",
};

const helpText = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "12px 0 16px 0",
};

const contactList = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 0 20px",
  padding: "0",
};

const contactItem = {
  margin: "8px 0",
};

const link = {
  color: "#1e40af",
  textDecoration: "underline",
  fontWeight: "600",
};

const footerNote = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0 0",
  textAlign: "center" as const,
  fontStyle: "italic" as const,
};
