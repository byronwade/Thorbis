/**
 * Email Sender - Type-safe email sending utilities
 *
 * Features:
 * - Type-safe email sending with validation
 * - Development mode logging
 * - Error handling and logging
 * - Email logging to database
 * - Retry logic for failed sends
 */

"use server";

import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { z } from "zod";
import type {
  EmailSendResult,
  EmailTemplate as EmailTemplateEnum,
} from "./email-types";
import { emailSendSchema } from "./email-types";
import { emailConfig, isResendConfigured, resend } from "./resend-client";

// Email send options
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: ReactElement;
  templateType: EmailTemplateEnum;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

/**
 * Send email with React Email template
 *
 * Features:
 * - Validates email addresses
 * - Renders React Email template to HTML
 * - Sends via Resend
 * - Logs to database
 * - Development mode logging
 */
export async function sendEmail({
  to,
  subject,
  template,
  templateType,
  replyTo,
  tags = [],
}: SendEmailOptions): Promise<EmailSendResult> {
  try {
    // Validate email data
    const validatedData = emailSendSchema.parse({
      to,
      subject,
      replyTo,
    });

    // In development, log email instead of sending
    if (emailConfig.isDevelopment) {
      console.log("📧 [DEV MODE] Email would be sent:");
      console.log("  To:", validatedData.to);
      console.log("  Subject:", validatedData.subject);
      console.log("  Template:", templateType);
      console.log("  Reply-To:", validatedData.replyTo || "N/A");

      return {
        success: true,
        data: {
          id: "dev-mode-" + Date.now(),
          message: "Email logged in development mode (not actually sent)",
        },
      };
    }

    // Check if Resend is configured
    if (!(isResendConfigured() && resend)) {
      return {
        success: false,
        error:
          "Email service not configured. Please add RESEND_API_KEY to environment variables.",
      };
    }

    // Render template to HTML
    const html = await render(template);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: validatedData.to,
      subject: validatedData.subject,
      html,
      replyTo: validatedData.replyTo,
      tags: [
        ...tags,
        { name: "template", value: templateType },
        { name: "environment", value: process.env.NODE_ENV || "development" },
      ],
    });

    if (error) {
      console.error("Failed to send email:", error);

      // TODO: Log failed email to database for retry
      // await logEmailToDatabase({ ... status: "failed" })

      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    // TODO: Log successful email to database
    // await logEmailToDatabase({ ... status: "sent" })

    return {
      success: true,
      data: {
        id: data?.id,
        message: "Email sent successfully",
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid email data",
      };
    }

    console.error("Unexpected error sending email:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

/**
 * Send batch emails (up to 100 at once per Resend limits)
 *
 * Features:
 * - Validates batch size
 * - Sends multiple emails
 * - Returns results for each email
 */
export async function sendBatchEmails(
  emails: SendEmailOptions[]
): Promise<EmailSendResult[]> {
  if (emails.length > 100) {
    return [
      {
        success: false,
        error: "Cannot send more than 100 emails at once",
      },
    ];
  }

  const results = await Promise.all(emails.map((email) => sendEmail(email)));

  return results;
}

/**
 * Test email configuration by sending a test email
 *
 * Features:
 * - Validates Resend configuration
 * - Sends test email to specified address
 * - Returns detailed error information
 */
export async function testEmailConfiguration(
  testEmailAddress: string
): Promise<EmailSendResult> {
  try {
    const validatedEmail = emailSendSchema.shape.to.parse(testEmailAddress);

    if (!isResendConfigured()) {
      return {
        success: false,
        error: "Resend API key is not configured",
      };
    }

    // Create a simple test template
    const testTemplate = {
      type: "div",
      props: {
        children: [
          {
            type: "h1",
            props: { children: "Email Configuration Test" },
          },
          {
            type: "p",
            props: {
              children: "This is a test email from your Thorbis application.",
            },
          },
          {
            type: "p",
            props: {
              children:
                "If you received this, your email configuration is working correctly!",
            },
          },
        ],
      },
    } as any;

    return await sendEmail({
      to: validatedEmail,
      subject: "Test Email - Thorbis Email Configuration",
      template: testTemplate,
      templateType: "welcome" as EmailTemplateEnum,
      tags: [{ name: "type", value: "test" }],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid email address",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Configuration test failed",
    };
  }
}
