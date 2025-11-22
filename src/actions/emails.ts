/**
 * Email Server Actions - Type-safe email sending functions
 *
 * Features:
 * - Server-side email sending via Resend
 * - Type-safe template rendering
 * - Error handling and logging
 * - Development mode support
 */

"use server";

import { sendEmail } from "@/lib/email/email-sender";
import type {
	AppointmentReminderProps,
	EmailSendResult,
	EmailVerificationProps,
	EstimateSentProps,
	InvoiceSentProps,
	JobCompleteProps,
	JobConfirmationProps,
	MagicLinkProps,
	PasswordChangedProps,
	PasswordResetProps,
	PaymentReceivedProps,
	PaymentReminderProps,
	ReviewRequestProps,
	ServiceReminderProps,
	TechEnRouteProps,
	WelcomeCustomerProps,
	WelcomeEmailProps,
} from "@/lib/email/email-types";
import { EmailTemplate } from "@/lib/email/email-types";
import EmailVerificationEmail from "../../emails/templates/auth/email-verification";
import MagicLinkEmail from "../../emails/templates/auth/magic-link";
import PasswordChangedEmail from "../../emails/templates/auth/password-changed";
import PasswordResetEmail from "../../emails/templates/auth/password-reset";
import WelcomeEmail from "../../emails/templates/auth/welcome";
import EstimateSentEmail from "../../emails/templates/billing/estimate-sent";

import InvoiceSentEmail from "../../emails/templates/billing/invoice-sent";
import PaymentReceivedEmail from "../../emails/templates/billing/payment-received";
import PaymentReminderEmail from "../../emails/templates/billing/payment-reminder";
import ReviewRequestEmail from "../../emails/templates/customer/review-request";
import ServiceReminderEmail from "../../emails/templates/customer/service-reminder";
import WelcomeCustomerEmail from "../../emails/templates/customer/welcome-customer";
import AppointmentReminderEmail from "../../emails/templates/jobs/appointment-reminder";
import JobCompleteEmail from "../../emails/templates/jobs/job-complete";
import JobConfirmationEmail from "../../emails/templates/jobs/job-confirmation";
import TechEnRouteEmail from "../../emails/templates/jobs/tech-en-route";

// =============================================================================
// AUTHENTICATION EMAILS
// =============================================================================

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
	to: string,
	props: WelcomeEmailProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Welcome to Thorbis!",
		template: WelcomeEmail(props),
		templateType: EmailTemplate.WELCOME,
	});
}

/**
 * Send email verification link
 */
export async function sendEmailVerification(
	to: string,
	props: EmailVerificationProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Verify your email address",
		template: EmailVerificationEmail(props),
		templateType: EmailTemplate.EMAIL_VERIFICATION,
	});
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(
	to: string,
	props: PasswordResetProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Reset your password",
		template: PasswordResetEmail(props),
		templateType: EmailTemplate.PASSWORD_RESET,
	});
}

/**
 * Send password changed confirmation
 */
export async function sendPasswordChanged(
	to: string,
	props: PasswordChangedProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Your password has been changed",
		template: PasswordChangedEmail(props),
		templateType: EmailTemplate.PASSWORD_CHANGED,
	});
}

/**
 * Send magic link for passwordless authentication
 */
async function sendMagicLink(
	to: string,
	props: MagicLinkProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Sign in to Thorbis",
		template: MagicLinkEmail(props),
		templateType: EmailTemplate.MAGIC_LINK,
	});
}

// =============================================================================
// JOB LIFECYCLE EMAILS
// =============================================================================

/**
 * Send job confirmation email
 */
async function sendJobConfirmation(
	to: string,
	props: JobConfirmationProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: `Service Appointment Confirmed - ${props.jobType}`,
		template: JobConfirmationEmail(props),
		templateType: EmailTemplate.JOB_CONFIRMATION,
		tags: [{ name: "job_number", value: props.jobNumber }],
	});
}

/**
 * Send appointment reminder (24h before)
 */
async function sendAppointmentReminder(
	to: string,
	props: AppointmentReminderProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Reminder: Your service appointment is tomorrow",
		template: AppointmentReminderEmail(props),
		templateType: EmailTemplate.APPOINTMENT_REMINDER,
	});
}

/**
 * Send technician en route notification
 */
async function sendTechEnRoute(
	to: string,
	props: TechEnRouteProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: `${props.technicianName} is on the way!`,
		template: TechEnRouteEmail(props),
		templateType: EmailTemplate.TECH_EN_ROUTE,
	});
}

/**
 * Send job completion notification
 */
async function sendJobComplete(
	to: string,
	props: JobCompleteProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Your service is complete!",
		template: JobCompleteEmail(props),
		templateType: EmailTemplate.JOB_COMPLETE,
		tags: [{ name: "job_number", value: props.jobNumber }],
	});
}

// =============================================================================
// BILLING EMAILS
// =============================================================================

/**
 * Send invoice to customer
 */
async function sendInvoice(
	to: string,
	props: InvoiceSentProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: `Invoice ${props.invoiceNumber} from Thorbis`,
		template: InvoiceSentEmail(props),
		templateType: EmailTemplate.INVOICE_SENT,
		tags: [
			{ name: "invoice_number", value: props.invoiceNumber },
			{ name: "amount", value: props.totalAmount },
		],
	});
}

/**
 * Send payment confirmation
 */
async function sendPaymentReceived(
	to: string,
	props: PaymentReceivedProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Payment received - Thank you!",
		template: PaymentReceivedEmail(props),
		templateType: EmailTemplate.PAYMENT_RECEIVED,
		tags: [
			{ name: "invoice_number", value: props.invoiceNumber },
			{ name: "amount", value: props.paymentAmount },
		],
	});
}

/**
 * Send payment reminder for overdue invoice
 */
async function sendPaymentReminder(
	to: string,
	props: PaymentReminderProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: `Payment reminder: Invoice ${props.invoiceNumber}`,
		template: PaymentReminderEmail(props),
		templateType: EmailTemplate.PAYMENT_REMINDER,
		tags: [
			{ name: "invoice_number", value: props.invoiceNumber },
			{ name: "days_overdue", value: props.daysOverdue.toString() },
		],
	});
}

/**
 * Send estimate/quote to customer
 */
async function sendEstimate(
	to: string,
	props: EstimateSentProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: `Estimate ${props.estimateNumber} from Thorbis`,
		template: EstimateSentEmail(props),
		templateType: EmailTemplate.ESTIMATE_SENT,
		tags: [
			{ name: "estimate_number", value: props.estimateNumber },
			{ name: "amount", value: props.totalAmount },
		],
	});
}

// =============================================================================
// CUSTOMER ENGAGEMENT EMAILS
// =============================================================================

/**
 * Send review request after job completion
 */
async function sendReviewRequest(
	to: string,
	props: ReviewRequestProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "How was your experience with Thorbis?",
		template: ReviewRequestEmail(props),
		templateType: EmailTemplate.REVIEW_REQUEST,
		tags: [{ name: "job_number", value: props.jobNumber }],
	});
}

/**
 * Send service/maintenance reminder
 */
async function sendServiceReminder(
	to: string,
	props: ServiceReminderProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: `Time for your ${props.serviceName} service`,
		template: ServiceReminderEmail(props),
		templateType: EmailTemplate.SERVICE_REMINDER,
	});
}

/**
 * Send welcome email to new customer
 */
async function sendWelcomeCustomer(
	to: string,
	props: WelcomeCustomerProps,
): Promise<EmailSendResult> {
	return await sendEmail({
		to,
		subject: "Welcome to Thorbis!",
		template: WelcomeCustomerEmail(props),
		templateType: EmailTemplate.WELCOME_CUSTOMER,
	});
}
