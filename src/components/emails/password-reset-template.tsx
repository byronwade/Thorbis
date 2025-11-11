/**
 * Password Reset Email Template
 *
 * Sent when an owner/manager resets a team member's password
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetTemplateProps {
  teamMemberName: string;
  resetByName: string;
  resetLink: string;
  companyName: string;
  expiresInHours?: number;
}

export function PasswordResetTemplate({
  teamMemberName,
  resetByName,
  resetLink,
  companyName,
  expiresInHours = 24,
}: PasswordResetTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Password reset for {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset</Heading>

          <Text style={text}>
            Hi {teamMemberName},
          </Text>

          <Text style={text}>
            {resetByName} from {companyName} has initiated a password reset for your account.
          </Text>

          <Text style={text}>
            Click the button below to set a new password for your account:
          </Text>

          <Section style={buttonContainer}>
            <Button href={resetLink} style={button}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>

          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>

          <Hr style={hr} />

          <Text style={footer}>
            This link will expire in {expiresInHours} hours. If you didn't request this password reset, please contact your administrator immediately.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            The {companyName} Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
  padding: "0 48px",
};

const buttonContainer = {
  padding: "27px 48px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 20px",
};

const link = {
  color: "#0066cc",
  fontSize: "14px",
  textDecoration: "underline",
  padding: "0 48px",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
};
