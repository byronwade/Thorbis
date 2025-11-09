/**
 * Generic Email Template
 *
 * A simple, clean email template for general communications
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface GenericEmailProps {
  recipientName: string;
  message: string;
  companyName?: string;
}

export function GenericEmail({
  recipientName,
  message,
  companyName = "Thorbis",
}: GenericEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{message.substring(0, 100)}...</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={h1}>Hello {recipientName},</Heading>
            <Text style={text}>{message}</Text>
            <Text style={footer}>
              Best regards,
              <br />
              {companyName}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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

const section = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "32px",
};

export default GenericEmail;
