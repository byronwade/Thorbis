/**
 * Portal Invitation Email Template - Customer portal access invitation
 *
 * Features:
 * - Invitation to access customer portal
 * - Secure setup link with expiration
 * - Portal features overview
 * - Getting started guide
 */

import { Text } from "@react-email/components";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";
import { EMAIL_COLORS } from "../../theme";

export type PortalInvitationProps = {
  customerName: string;
  portalUrl: string;
  expiresInHours?: number;
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  previewText?: string;
};

export default function PortalInvitationEmail({
  customerName,
  portalUrl,
  expiresInHours = 168, // 7 days default
  companyName = "Thorbis",
  supportEmail = "support@thorbis.com",
  supportPhone = "(555) 123-4567",
  previewText = "You've been invited to access your customer portal",
}: PortalInvitationProps) {
  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>You're Invited!</Heading>

      <Text style={paragraph}>Hi {customerName},</Text>

      <Text style={paragraph}>
        Great news! You now have access to your {companyName} customer portal -
        a convenient online hub where you can manage your services, view
        invoices, and communicate with us anytime.
      </Text>

      <Card style={invitationCard}>
        <div style={invitationIcon}>🎉</div>
        <Text style={invitationTitle}>Your Portal is Ready!</Text>
        <Text style={invitationText}>
          Click the button below to set up your account and access all your
          service information in one place.
        </Text>
      </Card>

      <div style={buttonContainer}>
        <Button href={portalUrl}>Set Up My Account</Button>
      </div>

      <Card style={expiryCard}>
        <Text style={expiryText}>
          ⏰ This invitation link will expire in{" "}
          <strong>{expiresInHours} hours</strong>. Please complete your account
          setup soon.
        </Text>
      </Card>

      <Card style={featuresCard}>
        <Heading level={3}>What you can do in your portal:</Heading>
        <ul style={featuresList}>
          <li style={featureItem}>
            <strong>📅 View & Schedule Services:</strong> Book appointments and
            track upcoming service visits
          </li>
          <li style={featureItem}>
            <strong>📄 Manage Invoices:</strong> View billing history and pay
            invoices online securely
          </li>
          <li style={featureItem}>
            <strong>📊 Service History:</strong> Access complete records of all
            your past services
          </li>
          <li style={featureItem}>
            <strong>🏠 Property Details:</strong> Manage multiple properties and
            service locations
          </li>
          <li style={featureItem}>
            <strong>💬 Direct Communication:</strong> Message our team and get
            real-time updates
          </li>
          <li style={featureItem}>
            <strong>📱 Mobile Access:</strong> Access your account from any
            device, anywhere
          </li>
        </ul>
      </Card>

      <Card style={securityCard}>
        <Heading level={3}>Secure & Private</Heading>
        <Text style={securityText}>
          Your portal is protected with industry-standard security. Only you can
          access your account information, and all data is encrypted for your
          protection.
        </Text>
      </Card>

      <Card style={stepsCard}>
        <Heading level={3}>Getting Started is Easy</Heading>
        <div style={stepGrid}>
          <div style={step}>
            <div style={stepNumber}>1</div>
            <Text style={stepText}>
              Click the "Set Up My Account" button above
            </Text>
          </div>
          <div style={step}>
            <div style={stepNumber}>2</div>
            <Text style={stepText}>
              Create a secure password for your account
            </Text>
          </div>
          <div style={step}>
            <div style={stepNumber}>3</div>
            <Text style={stepText}>
              Explore your portal and manage your services!
            </Text>
          </div>
        </div>
      </Card>

      <Card style={helpCard}>
        <Heading level={3}>Need Help?</Heading>
        <Text style={helpText}>
          If you have any questions about setting up your portal or need
          assistance, our support team is here to help.
        </Text>
        <div style={contactGrid}>
          <div style={contactMethod}>
            <Text style={contactLabel}>Email:</Text>
            <a href={`mailto:${supportEmail}`} style={contactLink}>
              {supportEmail}
            </a>
          </div>
          <div style={contactMethod}>
            <Text style={contactLabel}>Phone:</Text>
            <a href={`tel:${supportPhone}`} style={contactLink}>
              {supportPhone}
            </a>
          </div>
        </div>
      </Card>

      <Text style={footerNote}>
        <strong>Note:</strong> If you didn't request portal access or believe
        you received this email in error, please contact us at{" "}
        <a href={`mailto:${supportEmail}`} style={inlineLink}>
          {supportEmail}
        </a>
        .
      </Text>
    </BaseLayout>
  );
}

// Styles
const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const invitationCard = {
  background:
    "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)",
  borderRadius: "12px",
  padding: "40px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const invitationIcon = {
  fontSize: "64px",
  margin: "0 0 16px 0",
};

const invitationTitle = {
  color: EMAIL_COLORS.primaryText,
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const invitationText = {
  color: EMAIL_COLORS.primaryText,
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  opacity: "0.95",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const expiryCard = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const expiryText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const featuresCard = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  margin: "24px 0",
};

const featuresList = {
  color: "#166534",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "12px 0 0 20px",
  padding: "0",
};

const featureItem = {
  margin: "0 0 12px 0",
};

const securityCard = {
  backgroundColor: "#f5f3ff",
  border: "1px solid #ddd6fe",
  margin: "24px 0",
};

const securityText = {
  color: "#5b21b6",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "12px 0 0 0",
};

const stepsCard = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  margin: "24px 0",
};

const stepGrid = {
  display: "grid" as const,
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "20px",
  margin: "20px 0 0 0",
};

const step = {
  textAlign: "center" as const,
};

const stepNumber = {
  width: "40px",
  height: "40px",
  backgroundColor: "hsl(217 91% 60%)",
  color: EMAIL_COLORS.primaryText,
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 auto 12px auto",
};

const stepText = {
  color: "#1e40af",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "0",
};

const helpCard = {
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  margin: "24px 0",
};

const helpText = {
  color: "#991b1b",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "12px 0 20px 0",
};

const contactGrid = {
  display: "grid" as const,
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const contactMethod = {
  textAlign: "center" as const,
};

const contactLabel = {
  color: "#6b7280",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
};

const contactLink = {
  color: "hsl(217 91% 60%)",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "underline",
};

const footerNote = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "32px 0 0 0",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const inlineLink = {
  color: "hsl(217 91% 60%)",
  textDecoration: "underline",
};
