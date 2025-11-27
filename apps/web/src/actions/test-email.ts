"use server";

/**
 * Send a test email via SendGrid
 * 
 * This action sends a simple test email to verify SendGrid configuration.
 * It will use company-specific settings if companyId is provided,
 * otherwise falls back to admin SendGrid configuration.
 */

import { sendSendGridEmail } from "@/lib/email/sendgrid-client";
import { createAdminSendGridClient } from "@/lib/email/sendgrid-client";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import sgMail from "@sendgrid/mail";

export async function sendTestEmail(params: {
	to: string;
	companyId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
	const { to, companyId: providedCompanyId } = params;

	// Validate email
	if (!to || !to.includes("@")) {
		return { success: false, error: "Invalid email address" };
	}

	// Try to get company ID if not provided
	let companyId = providedCompanyId;
	if (!companyId) {
		try {
			companyId = await getActiveCompanyId();
		} catch (error) {
			console.log("Could not get active company ID, using admin SendGrid");
		}
	}

	// If we have a company ID, use company-specific SendGrid
	if (companyId) {
		const result = await sendSendGridEmail({
			companyId,
			to,
			subject: "Test Email - SendGrid Configuration",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Test Email</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
						<h1 style="color: white; margin: 0;">✅ SendGrid Test Email</h1>
					</div>
					<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
						<p style="font-size: 16px; margin-bottom: 20px;">
							This is a test email from your Thorbis application to verify SendGrid configuration.
						</p>
						<div style="background: white; padding: 20px; border-radius: 4px; border-left: 4px solid #667eea; margin: 20px 0;">
							<p style="margin: 0; font-weight: bold;">Email Details:</p>
							<ul style="margin: 10px 0; padding-left: 20px;">
								<li><strong>Sent to:</strong> ${to}</li>
								<li><strong>Company ID:</strong> ${companyId}</li>
								<li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
							</ul>
						</div>
						<p style="font-size: 14px; color: #666; margin-top: 30px;">
							If you received this email, your SendGrid configuration is working correctly! 🎉
						</p>
					</div>
				</body>
				</html>
			`,
			text: `Test Email - SendGrid Configuration

This is a test email from your Thorbis application to verify SendGrid configuration.

Email Details:
- Sent to: ${to}
- Company ID: ${companyId}
- Timestamp: ${new Date().toLocaleString()}

If you received this email, your SendGrid configuration is working correctly!`,
		});

		return result;
	}

	// Fallback to admin SendGrid client
	const adminClient = createAdminSendGridClient();
	if (!adminClient) {
		return {
			success: false,
			error: "SendGrid not configured. Please set SENDGRID_API_KEY environment variable or configure company SendGrid settings.",
		};
	}

	try {
		// Get verified sender email from environment
		const fromEmail = process.env.SENDGRID_FROM_EMAIL;
		if (!fromEmail) {
			return {
				success: false,
				error: "SENDGRID_FROM_EMAIL not set. Please set a verified sender email address in your .env.local file. The email must be verified in your SendGrid account.",
			};
		}

		const msg: sgMail.MailDataRequired = {
			to,
			from: fromEmail,
			subject: "Test Email - SendGrid Configuration (Admin)",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Test Email</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
						<h1 style="color: white; margin: 0;">✅ SendGrid Test Email</h1>
					</div>
					<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
						<p style="font-size: 16px; margin-bottom: 20px;">
							This is a test email from your Thorbis application to verify SendGrid configuration.
						</p>
						<div style="background: white; padding: 20px; border-radius: 4px; border-left: 4px solid #667eea; margin: 20px 0;">
							<p style="margin: 0; font-weight: bold;">Email Details:</p>
							<ul style="margin: 10px 0; padding-left: 20px;">
								<li><strong>Sent to:</strong> ${to}</li>
								<li><strong>Mode:</strong> Admin SendGrid (no company ID)</li>
								<li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
							</ul>
						</div>
						<p style="font-size: 14px; color: #666; margin-top: 30px;">
							If you received this email, your SendGrid configuration is working correctly! 🎉
						</p>
					</div>
				</body>
				</html>
			`,
			text: `Test Email - SendGrid Configuration (Admin)

This is a test email from your Thorbis application to verify SendGrid configuration.

Email Details:
- Sent to: ${to}
- Mode: Admin SendGrid (no company ID)
- Timestamp: ${new Date().toLocaleString()}

If you received this email, your SendGrid configuration is working correctly!`,
		};

		const [response] = await adminClient.send(msg);
		const messageId = response.headers["x-message-id"] as string | undefined;

		return {
			success: true,
			messageId: messageId || `sg-admin-${Date.now()}`,
		};
	} catch (error: any) {
		console.error("SendGrid admin send error:", error);

		const errorMessage =
			error?.response?.body?.errors?.[0]?.message ||
			error?.message ||
			"Failed to send email";

		return {
			success: false,
			error: errorMessage,
		};
	}
}

