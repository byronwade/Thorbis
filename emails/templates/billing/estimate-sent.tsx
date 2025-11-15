/**
 * Estimate Sent Email Template - Quote/proposal delivery
 *
 * Features:
 * - Estimate summary
 * - Line items
 * - Valid until date
 * - Accept/view links
 */

import { Text } from "@react-email/components";
import type { EstimateSentProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Divider } from "../../components/divider";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function EstimateSentEmail({
  customerName,
  estimateNumber,
  totalAmount,
  validUntil,
  items,
  acceptUrl,
  viewUrl,
  previewText = `Estimate ${estimateNumber} - ${totalAmount}`,
}: EstimateSentProps) {
  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>Your Estimate is Ready</Heading>

      <Text style={paragraph}>Hi {customerName},</Text>

      <Text style={paragraph}>
        Thank you for your interest in our services! We've prepared a detailed
        estimate for you.
      </Text>

      <Card style={estimateCard}>
        <div style={estimateHeader}>
          <Text style={estimateLabel}>Estimate</Text>
          <Text style={estimateNumberStyle}>#{estimateNumber}</Text>
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <div style={itemsSection}>
          {items.map((item) => {
            const key = `${item.description}-${item.amount}`;
            return (
              <div key={key} style={itemRow}>
                <Text style={itemDescription}>{item.description}</Text>
                <Text style={itemAmount}>{item.amount}</Text>
              </div>
            );
          })}
        </div>

        <Divider style={{ margin: "20px 0" }} />

        <div style={totalRow}>
          <Text style={totalLabel}>Estimated Total:</Text>
          <Text style={totalAmountStyle}>{totalAmount}</Text>
        </div>

        <Card style={validityBadge}>
          <Text style={validityText}>Valid until: {validUntil}</Text>
        </Card>
      </Card>

      <div style={buttonGroup}>
        <Button href={acceptUrl}>Accept Estimate</Button>
        <div style={secondaryButton}>
          <Button href={viewUrl} variant="outline">
            View Details
          </Button>
        </div>
      </div>

      <Card style={infoCard}>
        <Heading level={3}>What happens next?</Heading>
        <ul style={list}>
          <li style={listItem}>
            Review the estimate and click "Accept Estimate" if you're ready to
            proceed
          </li>
          <li style={listItem}>
            We'll schedule your service at a time that works for you
          </li>
          <li style={listItem}>Our team will complete the work as described</li>
          <li style={listItem}>
            Final invoice may vary based on actual work performed
          </li>
        </ul>
      </Card>

      <Card style={contactCard}>
        <Text style={contactText}>
          Have questions or want to discuss the estimate? We're here to help!
        </Text>
        <Text style={contactInfo}>
          Call us at{" "}
          <a href="tel:+1234567890" style={link}>
            (123) 456-7890
          </a>{" "}
          or reply to this email.
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

const estimateCard = {
  backgroundColor: EMAIL_COLORS.surface,
  border: "2px solid hsl(217 91% 60%)",
  borderRadius: "12px",
  padding: "32px",
  margin: "24px 0",
};

const estimateHeader = {
  textAlign: "center" as const,
};

const estimateLabel = {
  color: "#6b7280",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
};

const estimateNumberStyle = {
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
  marginBottom: "12px",
  paddingBottom: "12px",
  borderBottom: "1px solid #f3f4f6",
};

const itemDescription = {
  color: "#111827",
  fontSize: "15px",
  margin: "0",
  flex: "1",
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

const validityBadge = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "24px 0 0 0",
  textAlign: "center" as const,
};

const validityText = {
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const buttonGroup = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const secondaryButton = {
  marginTop: "12px",
};

const infoCard = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  margin: "24px 0",
};

const list = {
  color: "#166534",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "12px 0 0 20px",
  padding: "0",
};

const listItem = {
  margin: "0 0 12px 0",
};

const contactCard = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const contactText = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0 0 12px 0",
};

const contactInfo = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const link = {
  color: "hsl(217 91% 60%)",
  textDecoration: "underline",
  fontWeight: "600",
};
