/**
 * Email Preview Page - Development-only preview for email templates
 *
 * Features:
 * - Preview all email templates with sample data
 * - Renders actual React Email templates
 * - Useful for development and design review
 */

import { render } from "@react-email/components";
import { notFound } from "next/navigation";
import EmailVerificationEmail from "../../../../../emails/templates/auth/email-verification";
import MagicLinkEmail from "../../../../../emails/templates/auth/magic-link";
import PasswordChangedEmail from "../../../../../emails/templates/auth/password-changed";
import PasswordResetEmail from "../../../../../emails/templates/auth/password-reset";
// Import all email templates
import WelcomeEmail from "../../../../../emails/templates/auth/welcome";
import EstimateSentEmail from "../../../../../emails/templates/billing/estimate-sent";
import InvoiceSentEmail from "../../../../../emails/templates/billing/invoice-sent";
import PaymentReceivedEmail from "../../../../../emails/templates/billing/payment-received";
import PaymentReminderEmail from "../../../../../emails/templates/billing/payment-reminder";
import ReviewRequestEmail from "../../../../../emails/templates/customer/review-request";
import ServiceReminderEmail from "../../../../../emails/templates/customer/service-reminder";
import WelcomeCustomerEmail from "../../../../../emails/templates/customer/welcome-customer";
import AppointmentReminderEmail from "../../../../../emails/templates/jobs/appointment-reminder";
import JobCompleteEmail from "../../../../../emails/templates/jobs/job-complete";
import JobConfirmationEmail from "../../../../../emails/templates/jobs/job-confirmation";
import TechEnRouteEmail from "../../../../../emails/templates/jobs/tech-en-route";

// Sample data for each template
const sampleData: Record<string, any> = {
	welcome: {
		name: "John Doe",
		loginUrl: "https://thorbis.com/login",
	},
	"email-verification": {
		name: "John Doe",
		verificationUrl: "https://thorbis.com/verify?token=abc123",
	},
	"password-reset": {
		name: "John Doe",
		resetUrl: "https://thorbis.com/reset?token=abc123",
		expiresInMinutes: 60,
	},
	"password-changed": {
		name: "John Doe",
		changedAt: new Date(),
	},
	"magic-link": {
		loginUrl: "https://thorbis.com/magic?token=abc123",
		expiresInMinutes: 15,
	},
	"job-confirmation": {
		customerName: "Jane Smith",
		jobDate: "Monday, March 15th, 2025",
		jobTime: "10:00 AM - 12:00 PM",
		technicianName: "Mike Johnson",
		jobType: "HVAC Maintenance",
		address: "123 Main St, Anytown, CA 12345",
		jobNumber: "JOB-2025-001",
		viewJobUrl: "https://thorbis.com/jobs/001",
	},
	"appointment-reminder": {
		customerName: "Jane Smith",
		appointmentDate: "Tomorrow, March 16th",
		appointmentTime: "10:00 AM - 12:00 PM",
		technicianName: "Mike Johnson",
		address: "123 Main St, Anytown, CA 12345",
		rescheduleUrl: "https://thorbis.com/reschedule/001",
	},
	"tech-en-route": {
		customerName: "Jane Smith",
		technicianName: "Mike Johnson",
		estimatedArrival: "30 minutes",
		trackingUrl: "https://thorbis.com/track/001",
	},
	"job-complete": {
		customerName: "Jane Smith",
		jobNumber: "JOB-2025-001",
		completedDate: "March 15th, 2025",
		totalAmount: "$450.00",
		invoiceUrl: "https://thorbis.com/invoices/001",
		reviewUrl: "https://thorbis.com/review/001",
	},
	"invoice-sent": {
		customerName: "Jane Smith",
		invoiceNumber: "INV-2025-001",
		totalAmount: "$450.00",
		dueDate: "April 15th, 2025",
		items: [
			{
				description: "HVAC Maintenance Service",
				quantity: 1,
				amount: "$350.00",
			},
			{ description: "Air Filter Replacement", quantity: 2, amount: "$100.00" },
		],
		paymentUrl: "https://thorbis.com/pay/001",
		downloadUrl: "https://thorbis.com/invoice/001/download",
	},
	"payment-received": {
		customerName: "Jane Smith",
		invoiceNumber: "INV-2025-001",
		paymentAmount: "$450.00",
		paymentMethod: "Visa ending in 4242",
		paymentDate: "March 15th, 2025",
		receiptUrl: "https://thorbis.com/receipt/001",
	},
	"payment-reminder": {
		customerName: "Jane Smith",
		invoiceNumber: "INV-2025-001",
		totalAmount: "$450.00",
		dueDate: "March 1st, 2025",
		daysOverdue: 14,
		paymentUrl: "https://thorbis.com/pay/001",
	},
	"estimate-sent": {
		customerName: "Jane Smith",
		estimateNumber: "EST-2025-001",
		totalAmount: "$450.00",
		validUntil: "April 15th, 2025",
		items: [
			{ description: "HVAC Maintenance Service", amount: "$350.00" },
			{ description: "Air Filter Replacement", amount: "$100.00" },
		],
		acceptUrl: "https://thorbis.com/estimate/001/accept",
		viewUrl: "https://thorbis.com/estimate/001",
	},
	"review-request": {
		customerName: "Jane Smith",
		jobNumber: "JOB-2025-001",
		technicianName: "Mike Johnson",
		completedDate: "March 15th, 2025",
		reviewUrl: "https://thorbis.com/review/001",
	},
	"service-reminder": {
		customerName: "Jane Smith",
		serviceName: "Annual HVAC Maintenance",
		lastServiceDate: "March 15th, 2024",
		scheduleUrl: "https://thorbis.com/schedule",
	},
	"welcome-customer": {
		customerName: "Jane Smith",
		accountUrl: "https://thorbis.com/account",
		supportEmail: "support@thorbis.com",
		supportPhone: "(555) 123-4567",
	},
};

// Template component mapping
const templates: Record<string, any> = {
	welcome: WelcomeEmail,
	"email-verification": EmailVerificationEmail,
	"password-reset": PasswordResetEmail,
	"password-changed": PasswordChangedEmail,
	"magic-link": MagicLinkEmail,
	"job-confirmation": JobConfirmationEmail,
	"appointment-reminder": AppointmentReminderEmail,
	"tech-en-route": TechEnRouteEmail,
	"job-complete": JobCompleteEmail,
	"invoice-sent": InvoiceSentEmail,
	"payment-received": PaymentReceivedEmail,
	"payment-reminder": PaymentReminderEmail,
	"estimate-sent": EstimateSentEmail,
	"review-request": ReviewRequestEmail,
	"service-reminder": ServiceReminderEmail,
	"welcome-customer": WelcomeCustomerEmail,
};

export default async function EmailPreviewPage({
	params,
}: {
	params: Promise<{ template: string }>;
}) {
	const { template } = await params;

	// Check if template exists
	const TemplateComponent = templates[template];
	const data = sampleData[template];

	if (!(TemplateComponent && data)) {
		notFound();
	}

	// Render template to HTML
	const html = await render(TemplateComponent(data));

	return (
		<div className="min-h-screen bg-muted p-8">
			<div className="mx-auto max-w-4xl space-y-4">
				<div className="rounded-lg bg-card p-4 shadow">
					<h1 className="font-bold text-2xl">Email Preview: {template}</h1>
					<p className="text-muted-foreground text-sm">
						Development preview - This email template uses sample data
					</p>
				</div>

				<div className="overflow-hidden rounded-lg bg-card shadow">
					<div dangerouslySetInnerHTML={{ __html: html }} />
				</div>
			</div>
		</div>
	);
}
