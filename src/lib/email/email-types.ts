/**
 * Email Types - Type definitions for email templates
 *
 * Features:
 * - Type-safe email data
 * - Template props interfaces
 * - Email send result types
 * - Validation schemas
 */

import { z } from "zod";

// Email send result type
export type EmailSendResult = {
	success: boolean;
	error?: string;
	data?: {
		id?: string;
		message?: string;
	};
};

// Company branding for tenant emails
export type CompanyBranding = {
	companyName: string;
	logoUrl?: string;
	primaryColor?: string;
	supportEmail?: string;
	supportPhone?: string;
	websiteUrl?: string;
	address?: string;
};

// Base email template props
export type BaseEmailProps = {
	previewText?: string;
	companyName?: string; // Deprecated - use company.companyName
	company?: CompanyBranding; // For company-branded emails
};

// Authentication Email Props
export interface WelcomeEmailProps extends BaseEmailProps {
	name: string;
	loginUrl: string;
}

export interface EmailVerificationProps extends BaseEmailProps {
	name: string;
	verificationUrl: string;
}

export interface PasswordResetProps extends BaseEmailProps {
	name?: string;
	resetUrl: string;
	expiresInMinutes?: number;
}

export interface PasswordChangedProps extends BaseEmailProps {
	name: string;
	changedAt: Date;
}

export interface MagicLinkProps extends BaseEmailProps {
	loginUrl: string;
	expiresInMinutes?: number;
}

// Job Lifecycle Email Props
export interface JobConfirmationProps extends BaseEmailProps {
	customerName: string;
	jobDate: string;
	jobTime: string;
	technicianName: string;
	jobType: string;
	address: string;
	jobNumber: string;
	viewJobUrl: string;
}

export interface AppointmentReminderProps extends BaseEmailProps {
	customerName: string;
	appointmentDate: string;
	appointmentTime: string;
	technicianName: string;
	address: string;
	rescheduleUrl: string;
}

export interface TechEnRouteProps extends BaseEmailProps {
	customerName: string;
	technicianName: string;
	estimatedArrival: string;
	technicianPhoto?: string;
	trackingUrl?: string;
}

export interface JobCompleteProps extends BaseEmailProps {
	customerName: string;
	jobNumber: string;
	completedDate: string;
	totalAmount: string;
	invoiceUrl: string;
	reviewUrl: string;
}

// Billing Email Props
export interface InvoiceSentProps extends BaseEmailProps {
	customerName: string;
	invoiceNumber: string;
	totalAmount: string;
	dueDate: string;
	items: Array<{
		description: string;
		quantity: number;
		amount: string;
	}>;
	paymentUrl: string;
	downloadUrl: string;
}

export interface InvoiceNotificationProps extends BaseEmailProps {
	customerName: string;
	invoiceNumber: string;
	invoiceDate: string;
	dueDate?: string;
	totalAmount: number; // in cents
	invoiceUrl: string;
	currency?: string;
	items?: Array<{
		description: string;
		quantity: number;
		amount: number; // in cents
	}>;
	notes?: string;
	paymentLink?: string; // Secure payment portal link
	customBody?: string; // Custom email body from template
	customFooter?: string; // Custom email footer from template
}

export interface EstimateNotificationProps extends BaseEmailProps {
	customerName: string;
	estimateNumber: string;
	estimateDate: string;
	validUntil?: string;
	totalAmount: number; // in cents
	estimateUrl: string;
	currency?: string;
	items?: Array<{
		description: string;
		quantity: number;
		amount: number; // in cents
	}>;
	notes?: string;
}

export interface PaymentReceivedProps extends BaseEmailProps {
	customerName: string;
	invoiceNumber: string;
	paymentAmount: string;
	paymentMethod: string;
	paymentDate: string;
	receiptUrl: string;
}

export interface PaymentReminderProps extends BaseEmailProps {
	customerName: string;
	invoiceNumber: string;
	totalAmount: string;
	dueDate: string;
	daysOverdue: number;
	paymentUrl: string;
}

export interface EstimateSentProps extends BaseEmailProps {
	customerName: string;
	estimateNumber: string;
	totalAmount: string;
	validUntil: string;
	items: Array<{
		description: string;
		amount: string;
	}>;
	acceptUrl: string;
	viewUrl: string;
}

// Customer Engagement Email Props
export interface ReviewRequestProps extends BaseEmailProps {
	customerName: string;
	jobNumber: string;
	technicianName: string;
	completedDate: string;
	reviewUrl: string;
}

export interface ServiceReminderProps extends BaseEmailProps {
	customerName: string;
	serviceName: string;
	lastServiceDate: string;
	scheduleUrl: string;
}

export interface WelcomeCustomerProps extends BaseEmailProps {
	customerName: string;
	accountUrl: string;
	supportEmail: string;
	supportPhone: string;
}

export interface PortalInvitationProps extends BaseEmailProps {
	customerName: string;
	portalUrl: string;
	expiresInHours?: number;
	companyName?: string;
	supportEmail?: string;
	supportPhone?: string;
}

// Verification Email Props
export interface VerificationSubmittedProps extends BaseEmailProps {
	companyName: string;
	contactName: string;
	hasTollFreeNumbers: boolean;
	has10DLCNumbers: boolean;
	tollFreeCount?: number;
	dlcCount?: number;
	dashboardUrl: string;
}

export interface VerificationCompleteProps extends BaseEmailProps {
	companyName: string;
	contactName: string;
	verificationTypes: string[]; // ["toll-free", "10dlc"]
	dashboardUrl: string;
	messagingUrl: string;
}

// Validation Schemas
export const emailAddressSchema = z
	.string()
	.email("Invalid email address")
	.min(1, "Email is required");

export const emailSendSchema = z.object({
	to: z.union([emailAddressSchema, z.array(emailAddressSchema)]),
	subject: z.string().min(1, "Subject is required").max(200),
	replyTo: emailAddressSchema.optional(),
});

// Template types enum
export enum EmailTemplate {
	// Auth
	WELCOME = "welcome",
	EMAIL_VERIFICATION = "email-verification",
	PASSWORD_RESET = "password-reset",
	PASSWORD_CHANGED = "password-changed",
	MAGIC_LINK = "magic-link",

	// Jobs
	JOB_CONFIRMATION = "job-confirmation",
	APPOINTMENT_REMINDER = "appointment-reminder",
	TECH_EN_ROUTE = "tech-en-route",
	JOB_COMPLETE = "job-complete",

	// Billing
	INVOICE = "invoice",
	ESTIMATE = "estimate",
	INVOICE_SENT = "invoice-sent",
	PAYMENT_RECEIVED = "payment-received",
	PAYMENT_REMINDER = "payment-reminder",
	ESTIMATE_SENT = "estimate-sent",

	// Customer
	REVIEW_REQUEST = "review-request",
	SERVICE_REMINDER = "service-reminder",
	WELCOME_CUSTOMER = "welcome-customer",
	PORTAL_INVITATION = "portal-invitation",

	// Team
	TEAM_INVITATION = "team-invitation",

	// Onboarding & Verification
	VERIFICATION_SUBMITTED = "verification-submitted",
	VERIFICATION_COMPLETE = "verification-complete",

	// Generic
	GENERIC = "generic",
}
