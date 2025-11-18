/**
 * Notification Testing API
 *
 * Endpoint for sending test notifications from the notification testing dashboard.
 * Supports: Email, SMS, In-App, and Push notifications
 *
 * POST /api/notifications/test
 */

import { NextResponse } from "next/server";
import { sendWelcomeEmail, sendEmailVerification, sendPasswordReset } from "@/actions/emails";
import { sendSMS } from "@/lib/telnyx/messaging";
import { getSmsTemplate, SMS_TEST_DATA } from "@/lib/notifications/sms-templates";
import { getNotificationById } from "@/app/(dashboard)/dashboard/settings/notifications/testing/notification-registry";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, channel, recipient, testData } = body;

    // Validate inputs
    if (!notificationId || !channel || !recipient) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: notificationId, channel, recipient" },
        { status: 400 }
      );
    }

    // Get notification definition
    const notification = getNotificationById(notificationId);
    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      );
    }

    // Check if channel is implemented
    const channelData = notification.channels[channel];
    if (!channelData) {
      return NextResponse.json(
        { success: false, error: `Channel ${channel} not available for this notification` },
        { status: 400 }
      );
    }

    if (channelData.status !== "complete") {
      return NextResponse.json(
        { success: false, error: `Channel ${channel} is not fully implemented (status: ${channelData.status})` },
        { status: 400 }
      );
    }

    // Use provided test data or default from registry
    const emailProps = testData || notification.testData;

    // Send based on channel
    let result;

    if (channel === "email") {
      result = await sendTestEmail(notificationId, recipient, emailProps);
    } else if (channel === "sms") {
      result = await sendTestSMS(notificationId, recipient, emailProps);
    } else if (channel === "in_app") {
      result = await sendTestInApp(notificationId, recipient, emailProps);
    } else if (channel === "push") {
      return NextResponse.json(
        { success: false, error: "Push notifications not yet implemented" },
        { status: 501 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: `Unknown channel: ${channel}` },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${channel} notification sent successfully to ${recipient}`,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * Send test email
 */
async function sendTestEmail(notificationId: string, recipient: string, props: any) {
  try {
    let result;

    switch (notificationId) {
      case "auth-welcome":
        result = await sendWelcomeEmail(recipient, {
          name: props.userName || "Test User",
          loginUrl: props.dashboardUrl || "https://app.stratos.com/dashboard",
        });
        break;

      case "auth-email-verification":
        result = await sendEmailVerification(recipient, {
          name: props.userName || "Test User",
          verificationUrl: props.verificationUrl || "https://app.stratos.com/auth/verify?token=test123",
          expiresInHours: props.expiresInHours || 24,
        });
        break;

      case "auth-password-reset":
        result = await sendPasswordReset(recipient, {
          name: props.userName || "Test User",
          resetUrl: props.resetUrl || "https://app.stratos.com/auth/reset-password?token=test789",
          expiresInMinutes: props.expiresInMinutes || 15,
        });
        break;

      // Add more email types here as needed
      // TODO: Implement remaining email templates

      default:
        return {
          success: false,
          error: `Email template for ${notificationId} not yet implemented in test API`,
        };
    }

    return result;
  } catch (error) {
    console.error("Error sending test email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send test email",
    };
  }
}

/**
 * Send test SMS
 */
async function sendTestSMS(notificationId: string, recipient: string, props: any) {
  try {
    // Get SMS template function name from notification ID
    const templateMap: Record<string, string> = {
      "job-confirmation": "appointment-confirmation",
      "job-reminder": "appointment-reminder",
      "job-tech-enroute": "tech-en-route",
      "job-complete": "job-complete",
      "billing-payment-reminder": "payment-reminder",
      "customer-service-reminder": "service-reminder",
      "customer-review-request": "review-request",
    };

    const templateId = templateMap[notificationId];
    if (!templateId) {
      return {
        success: false,
        error: `SMS template for ${notificationId} not yet mapped`,
      };
    }

    // Get SMS template function
    const template = getSmsTemplate(templateId);
    if (!template) {
      return {
        success: false,
        error: `SMS template ${templateId} not found`,
      };
    }

    // Generate SMS text
    const message = template(props);

    // Send SMS via Telnyx
    const result = await sendSMS({
      to: recipient,
      text: message,
      from: process.env.TELNYX_PHONE_NUMBER || "+15555555555", // Use configured Telnyx number
    });

    if (result.success) {
      return {
        success: true,
        data: { messageId: result.data?.id, message },
      };
    } else {
      return {
        success: false,
        error: result.error || "Failed to send SMS",
      };
    }
  } catch (error) {
    console.error("Error sending test SMS:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send test SMS",
    };
  }
}

/**
 * Send test in-app notification
 */
async function sendTestInApp(notificationId: string, recipient: string, props: any) {
  try {
    const supabase = createServiceSupabaseClient();

    // Get user by ID or email
    let userId = recipient;
    if (recipient.includes("@")) {
      // Look up user by email
      const { data: user, error: userError } = await supabase
        .from("user_metadata")
        .select("user_id")
        .eq("email", recipient)
        .single();

      if (userError || !user) {
        return {
          success: false,
          error: "User not found with email: " + recipient,
        };
      }
      userId = user.user_id;
    }

    // Create notification in database
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        company_id: props.companyId || "00000000-0000-0000-0000-000000000000", // Use test company ID
        type: props.type || "message",
        priority: props.priority || "medium",
        title: props.title || "Test Notification",
        message: props.message || "This is a test notification from the notification testing dashboard.",
        action_url: props.action_url || null,
        action_label: props.action_label || null,
        metadata: props.metadata || null,
        read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating in-app notification:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: { notificationId: data.id },
    };
  } catch (error) {
    console.error("Error sending test in-app notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send in-app notification",
    };
  }
}
