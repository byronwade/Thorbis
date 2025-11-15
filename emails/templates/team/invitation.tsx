/**
 * Team Invitation Email Template
 *
 * Sent when a team member is invited to join a company
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type TeamInvitationProps = {
  inviteeName: string;
  inviterName: string;
  companyName: string;
  role: string;
  magicLink: string;
  expiresInDays: number;
};

const TeamInvitationEmail = ({
  inviteeName = "John Doe",
  inviterName = "Jane Smith",
  companyName = "Acme Corp",
  role = "Technician",
  magicLink = "https://example.com/accept-invitation",
  expiresInDays = 7,
}: TeamInvitationProps) => {
  const previewText = `You've been invited to join ${companyName} on Thorbis`;

  // Format role for display
  const roleDisplay = role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>Team Invitation</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {inviteeName},</Text>

            <Text style={paragraph}>
              <strong>{inviterName}</strong> has invited you to join{" "}
              <strong>{companyName}</strong> on Thorbis as a{" "}
              <strong>{roleDisplay}</strong>.
            </Text>

            <Text style={paragraph}>
              Thorbis is a complete business management platform that helps your
              team manage jobs, track time, communicate with customers, and grow
              your business.
            </Text>

            <Section style={roleSection}>
              <Text style={roleTitle}>Your Role: {roleDisplay}</Text>
              <Text style={roleDescription}>
                {role === "owner" &&
                  "Full access to all features including company settings, billing, and team management."}
                {role === "admin" &&
                  "Full access to all features except billing and company ownership settings."}
                {role === "manager" &&
                  "Manage jobs, team schedules, and customer communications. View reports and analytics."}
                {role === "dispatcher" &&
                  "Schedule and assign jobs, communicate with technicians and customers."}
                {role === "technician" &&
                  "View and complete assigned jobs, update job status, and communicate with team."}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button href={magicLink} style={button}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={paragraph}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>
              <Link href={magicLink} style={link}>
                {magicLink}
              </Link>
            </Text>

            <Text style={expiryText}>
              This invitation expires in {expiresInDays} days.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you didn't expect this invitation or have questions, please
              contact {inviterName} or reply to this email.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Thorbis. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TeamInvitationEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  backgroundColor: "#0F172A",
};

const heading = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
  lineHeight: "1.4",
};

const content = {
  padding: "24px 24px 32px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#0F172A",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#334155",
  margin: "16px 0",
};

const roleSection = {
  backgroundColor: "#F1F5F9",
  borderLeft: "4px solid #3B82F6",
  padding: "16px",
  margin: "24px 0",
  borderRadius: "4px",
};

const roleTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#0F172A",
  margin: "0 0 8px 0",
};

const roleDescription = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#64748B",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3B82F6",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const linkText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#64748B",
  margin: "16px 0",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#3B82F6",
  textDecoration: "underline",
};

const expiryText = {
  fontSize: "14px",
  color: "#64748B",
  margin: "24px 0 0",
  fontStyle: "italic",
};

const footer = {
  padding: "24px",
  borderTop: "1px solid #E2E8F0",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#94A3B8",
  margin: "8px 0",
};
