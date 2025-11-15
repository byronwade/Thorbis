import { Text } from "@react-email/components";
import type { EstimateNotificationProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

const CENTS_IN_DOLLAR = 100;

// Simple currency formatter for email templates
function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / CENTS_IN_DOLLAR); // Convert cents to dollars
}

export default function EstimateNotificationEmail({
  customerName,
  estimateNumber,
  estimateDate,
  validUntil,
  totalAmount,
  items,
  notes,
  estimateUrl,
  currency = "USD",
  previewText = `Estimate ${estimateNumber} from Thorbis`,
}: EstimateNotificationProps) {
  const amountFormatted = formatCurrency(totalAmount, currency);

  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>Your Estimate is Ready</Heading>

      <Text style={paragraph}>Hi {customerName},</Text>

      <Text style={paragraph}>
        We've prepared estimate <strong>#{estimateNumber}</strong> for you.
        Review the summary below and click the button to see the full details.
      </Text>

      <Card style={summaryCard}>
        <div style={summaryRow}>
          <Text style={summaryLabel}>Estimate Number</Text>
          <Text style={summaryValue}>#{estimateNumber}</Text>
        </div>
        <div style={summaryRow}>
          <Text style={summaryLabel}>Estimate Date</Text>
          <Text style={summaryValue}>
            {new Date(estimateDate).toLocaleDateString()}
          </Text>
        </div>
        {validUntil ? (
          <div style={summaryRow}>
            <Text style={summaryLabel}>Valid Until</Text>
            <Text style={summaryValue}>
              {new Date(validUntil).toLocaleDateString()}
            </Text>
          </div>
        ) : null}
        <div style={summaryRow}>
          <Text style={summaryLabel}>Estimated Total</Text>
          <Text style={summaryAmount}>{amountFormatted}</Text>
        </div>
      </Card>

      {Array.isArray(items) && items.length > 0 && (
        <Card style={itemsCard}>
          <Heading level={3}>Estimate Items</Heading>
          {items.map((item, index) => (
            <div key={`${item.description}-${index}`} style={itemRow}>
              <div style={itemDetails}>
                <Text style={itemDescription}>{item.description}</Text>
                <Text style={itemQuantity}>Qty: {item.quantity}</Text>
              </div>
              <Text style={itemAmount}>
                {formatCurrency(item.amount, currency)}
              </Text>
            </div>
          ))}
        </Card>
      )}

      {notes ? (
        <Card style={notesCard}>
          <Heading level={3}>Notes</Heading>
          <Text style={notesText}>{notes}</Text>
        </Card>
      ) : null}

      <div style={buttonContainer}>
        <Button href={estimateUrl}>View Estimate</Button>
      </div>

      <Card style={footerCard}>
        <Heading level={3}>Need Assistance?</Heading>
        <Text style={footerText}>
          If you have any questions about this estimate, reply to this email or
          contact our support team. We're happy to help!
        </Text>
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
  backgroundColor: EMAIL_COLORS.surface,
  border: "1px solid rgba(59,130,246,0.2)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const summaryRow = {
  display: "flex" as const,
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const summaryLabel = {
  color: "#6b7280",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0",
};

const summaryValue = {
  color: "#111827",
  fontSize: "20px",
  fontWeight: 600,
  margin: "0",
};

const summaryAmount = {
  color: "hsl(217 91% 60%)",
  fontSize: "24px",
  fontWeight: 700,
  margin: "0",
};

const itemsCard = {
  backgroundColor: EMAIL_COLORS.surface,
  border: "1px solid rgba(59,130,246,0.1)",
  borderRadius: "12px",
  padding: "20px",
  margin: "16px 0",
};

const itemRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "12px 0",
  borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
};

const itemDetails = {
  flex: 1,
  marginRight: "12px",
};

const itemDescription = {
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 4px 0",
};

const itemQuantity = {
  color: "#475569",
  fontSize: "12px",
  margin: "0",
};

const itemAmount = {
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0",
  minWidth: "80px",
  textAlign: "right" as const,
};

const buttonContainer = {
  margin: "16px 0 32px",
  textAlign: "center" as const,
};

const footerCard = {
  backgroundColor: "#eff6ff",
  border: "1px solid rgba(59,130,246,0.2)",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "16px",
};

const footerText = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "12px 0 0 0",
};

const notesCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "16px",
};

const notesText = {
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};
