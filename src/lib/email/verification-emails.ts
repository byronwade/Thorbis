/**
 * Verification Email Utilities
 * Helper functions for sending onboarding verification emails
 *
 * Features:
 * - Send "verification submitted" email
 * - Send "verification complete" email
 * - Type-safe email sending
 * - Company-specific context
 */

"use server";

import type { ReactElement } from "react";
import VerificationCompleteEmail from "../../../emails/templates/onboarding/verification-complete";
import VerificationSubmittedEmail from "../../../emails/templates/onboarding/verification-submitted";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "./email-sender";
import { EmailTemplate } from "./email-types";
import type { EmailSendResult } from "./email-types";
import { emailConfig } from "./resend-client";

/**
 * Send "Verification Submitted" email
 * Called immediately after user submits toll-free/10DLC verification during onboarding
 *
 * @param companyId - Company UUID
 * @param recipientEmail - Email address to send to (usually company owner)
 * @param context - Additional context about the verification
 */
export async function sendVerificationSubmittedEmail(
	companyId: string,
	recipientEmail: string,
	context: {
		hasTollFreeNumbers: boolean;
		has10DLCNumbers: boolean;
		tollFreeCount?: number;
		dlcCount?: number;
	},
): Promise<EmailSendResult> {
	try {
		const supabase = await createClient();

		// Fetch company details
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("name")
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			return {
				success: false,
				error: `Company not found: ${companyError?.message}`,
			};
		}

		// Fetch user details (company owner)
		const { data: owner, error: ownerError } = await supabase
			.from("team_members")
			.select("full_name")
			.eq("company_id", companyId)
			.eq("role", "owner")
			.single();

		const contactName = owner?.full_name || "there";

		// Build dashboard URL
		const dashboardUrl = `${emailConfig.appUrl}/dashboard`;

		// Create email template
		const emailTemplate = VerificationSubmittedEmail({
			companyName: company.name,
			contactName,
			hasTollFreeNumbers: context.hasTollFreeNumbers,
			has10DLCNumbers: context.has10DLCNumbers,
			tollFreeCount: context.tollFreeCount || 0,
			dlcCount: context.dlcCount || 0,
			dashboardUrl,
		}) as ReactElement;

		// Send email
		return await sendEmail({
			to: recipientEmail,
			subject: `Messaging Verification Submitted - ${company.name}`,
			template: emailTemplate,
			templateType: EmailTemplate.VERIFICATION_SUBMITTED,
			companyId,
			tags: [
				{ name: "type", value: "onboarding" },
				{ name: "verification", value: "submitted" },
			],
		});
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to send verification submitted email",
		};
	}
}

/**
 * Send "Verification Complete" email
 * Called when toll-free verification is approved (or all verifications complete)
 *
 * @param companyId - Company UUID
 * @param recipientEmail - Email address to send to
 * @param verificationTypes - Array of verification types that completed (["toll-free", "10dlc"])
 */
export async function sendVerificationCompleteEmail(
	companyId: string,
	recipientEmail: string,
	verificationTypes: string[],
): Promise<EmailSendResult> {
	try {
		const supabase = await createClient();

		// Fetch company details
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("name")
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			return {
				success: false,
				error: `Company not found: ${companyError?.message}`,
			};
		}

		// Fetch user details (company owner)
		const { data: owner } = await supabase
			.from("team_members")
			.select("full_name")
			.eq("company_id", companyId)
			.eq("role", "owner")
			.single();

		const contactName = owner?.full_name || "there";

		// Build URLs
		const dashboardUrl = `${emailConfig.appUrl}/dashboard`;
		const messagingUrl = `${emailConfig.appUrl}/dashboard/communications/messaging`;

		// Create email template
		const emailTemplate = VerificationCompleteEmail({
			companyName: company.name,
			contactName,
			verificationTypes,
			dashboardUrl,
			messagingUrl,
		}) as ReactElement;

		// Send email
		return await sendEmail({
			to: recipientEmail,
			subject: `🎉 Messaging Approved - ${company.name}`,
			template: emailTemplate,
			templateType: EmailTemplate.VERIFICATION_COMPLETE,
			companyId,
			tags: [
				{ name: "type", value: "onboarding" },
				{ name: "verification", value: "complete" },
			],
		});
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to send verification complete email",
		};
	}
}
