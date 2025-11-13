/**
 * Appointment Reminder Email Template - 24h before appointment
 *
 * Features:
 * - Reminder of upcoming appointment
 * - Appointment details
 * - Option to reschedule
 * - Preparation instructions
 */

import { Text } from "@react-email/components";
import type { AppointmentReminderProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export default function AppointmentReminderEmail({
  customerName,
  appointmentDate,
  appointmentTime,
  technicianName,
  address,
  rescheduleUrl,
  previewText = "Reminder: Your service appointment is tomorrow",
}: AppointmentReminderProps) {
  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>Appointment Reminder</Heading>

      <Text style={paragraph}>Hi {customerName},</Text>

      <Text style={paragraph}>
        This is a friendly reminder that your service appointment is coming up!
      </Text>

      <Card style={highlightCard}>
        <div style={highlightContent}>
          <Text style={highlightLabel}>Tomorrow</Text>
          <Text style={highlightDate}>{appointmentDate}</Text>
          <Text style={highlightTime}>{appointmentTime}</Text>
        </div>
      </Card>

      <Card style={detailsCard}>
        <div style={detailRow}>
          <Text style={detailLabel}>Technician:</Text>
          <Text style={detailValue}>{technicianName}</Text>
        </div>
        <div style={detailRow}>
          <Text style={detailLabel}>Location:</Text>
          <Text style={detailValue}>{address}</Text>
        </div>
      </Card>

      <Card style={prepCard}>
        <Heading level={3}>How to prepare</Heading>
        <ul style={list}>
          <li style={listItem}>
            Please ensure someone is present during the service window
          </li>
          <li style={listItem}>Clear access to the work area if possible</li>
          <li style={listItem}>Secure any pets for safety</li>
        </ul>
      </Card>

      <Text style={paragraph}>
        We'll notify you when {technicianName} is on the way.
      </Text>

      <div style={buttonContainer}>
        <Button href={rescheduleUrl}>Need to Reschedule?</Button>
      </div>

      <Text style={footerNote}>
        Questions? Call us at{" "}
        <a href="tel:+1234567890" style={link}>
          (123) 456-7890
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

const highlightCard = {
  background:
    "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
  borderRadius: "12px",
  padding: "32px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const highlightContent = {
  color: EMAIL_COLORS.primaryText,
};

const highlightLabel = {
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
  opacity: 0.9,
};

const highlightDate = {
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 4px 0",
};

const highlightTime = {
  fontSize: "20px",
  fontWeight: "500",
  margin: "0",
  opacity: 0.95,
};

const detailsCard = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  padding: "20px",
  margin: "24px 0",
};

const detailRow = {
  display: "flex" as const,
  justifyContent: "space-between",
  marginBottom: "12px",
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

const prepCard = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  margin: "24px 0",
};

const list = {
  color: "#166534",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "12px 0 0 20px",
  padding: "0",
};

const listItem = {
  margin: "0 0 8px 0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
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
