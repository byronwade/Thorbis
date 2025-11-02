/**
 * Welcome Email Template - Sent when user signs up
 *
 * Features:
 * - Welcomes new user to Thorbis
 * - Provides link to dashboard
 * - Next steps and getting started info
 */

import { Text } from "@react-email/components";
import type { WelcomeEmailProps } from "../../../src/lib/email/email-types";
import { Button } from "../../components/button";
import { Heading } from "../../components/heading";
import { BaseLayout } from "../../layouts/base-layout";

export default function WelcomeEmail({
  name,
  loginUrl,
  previewText = "Welcome to Thorbis! Let's get you started.",
}: WelcomeEmailProps) {
  return (
    <BaseLayout previewText={previewText}>
      <Heading level={1}>Welcome to Thorbis, {name}!</Heading>

      <Text style={paragraph}>
        We're excited to have you on board. Thorbis is your all-in-one platform
        for managing your service business efficiently.
      </Text>

      <Text style={paragraph}>Here's what you can do with Thorbis:</Text>

      <ul style={list}>
        <li style={listItem}>Schedule and dispatch jobs effortlessly</li>
        <li style={listItem}>Manage customer relationships in one place</li>
        <li style={listItem}>Create professional invoices and estimates</li>
        <li style={listItem}>Track your team's performance</li>
        <li style={listItem}>Grow your business with powerful insights</li>
      </ul>

      <div style={buttonContainer}>
        <Button href={loginUrl}>Get Started</Button>
      </div>

      <Text style={footerNote}>
        Need help getting started? Check out our{" "}
        <a href="https://thorbis.com/docs" style={link}>
          getting started guide
        </a>{" "}
        or reach out to our support team anytime.
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

const list = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px 24px",
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
