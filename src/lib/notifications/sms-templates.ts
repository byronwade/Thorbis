/**
 * SMS Notification Templates
 *
 * Plain text message templates for SMS notifications via Telnyx.
 * All messages are under 160 characters for single-segment SMS when possible.
 *
 * Template functions accept data objects and return formatted SMS text.
 */

/**
 * 1. Appointment Confirmation
 * Sent: Immediately after appointment is scheduled
 */
export function smsAppointmentConfirmation(data: {
	customerName: string;
	jobType: string;
	scheduledDate: string;
	scheduledTime: string;
	technicianName: string;
	confirmationNumber: string;
}): string {
	return `Hi ${data.customerName}, your ${data.jobType} appointment is confirmed for ${data.scheduledDate} at ${data.scheduledTime} with ${data.technicianName}. Confirmation: ${data.confirmationNumber}`;
}

/**
 * 2. Appointment Reminder
 * Sent: 24 hours before appointment
 */
export function smsAppointmentReminder(data: {
	customerName: string;
	jobType: string;
	scheduledTime: string;
	technicianName: string;
}): string {
	return `Reminder: ${data.customerName}, your ${data.jobType} appointment is tomorrow at ${data.scheduledTime} with ${data.technicianName}. Reply CANCEL to reschedule.`;
}

/**
 * 3. Technician En Route
 * Sent: When technician starts heading to job site
 */
export function smsTechEnRoute(data: {
	customerName: string;
	technicianName: string;
	estimatedArrival: string;
	technicianPhone?: string;
}): string {
	const phoneInfo = data.technicianPhone
		? ` Call ${data.technicianPhone} if needed.`
		: "";
	return `${data.customerName}, ${data.technicianName} is on the way! ETA: ${data.estimatedArrival}.${phoneInfo}`;
}

/**
 * 4. Job Completion with Payment Link
 * Sent: After service is completed
 */
export function smsJobComplete(data: {
	customerName: string;
	jobType: string;
	totalAmount?: number;
	paymentUrl?: string;
}): string {
	if (data.totalAmount && data.paymentUrl) {
		return `${data.customerName}, your ${data.jobType} is complete! Total: $${data.totalAmount.toFixed(2)}. Pay now: ${data.paymentUrl}`;
	}
	return `${data.customerName}, your ${data.jobType} service is complete! Thank you for choosing us.`;
}

/**
 * 5. Verification Code (2FA)
 * Sent: For two-factor authentication or email verification
 */
export function smsVerificationCode(data: {
	code: string;
	expiresInMinutes: number;
}): string {
	return `Your verification code is: ${data.code}. This code expires in ${data.expiresInMinutes} minutes. Do not share this code.`;
}

/**
 * 6. Password Reset Code
 * Sent: For password reset verification
 */
export function smsPasswordResetCode(data: {
	code: string;
	expiresInMinutes: number;
}): string {
	return `Your password reset code is: ${data.code}. This code expires in ${data.expiresInMinutes} minutes. If you didn't request this, please ignore.`;
}

/**
 * 7. Payment Reminder
 * Sent: 7 days after invoice is overdue
 */
export function smsPaymentReminder(data: {
	customerName: string;
	invoiceNumber: string;
	totalAmount: number;
	daysOverdue: number;
	paymentUrl: string;
}): string {
	return `${data.customerName}, invoice ${data.invoiceNumber} for $${data.totalAmount.toFixed(2)} is ${data.daysOverdue} days overdue. Pay now: ${data.paymentUrl}`;
}

/**
 * 8. Service Reminder
 * Sent: Annual maintenance reminder
 */
export function smsServiceReminder(data: {
	customerName: string;
	serviceType: string;
	equipmentType: string;
	scheduleUrl: string;
}): string {
	return `${data.customerName}, it's time for ${data.serviceType} on your ${data.equipmentType}. Schedule now: ${data.scheduleUrl}`;
}

/**
 * 9. Schedule Change Notification
 * Sent: When appointment is rescheduled or cancelled
 */
export function smsScheduleChange(data: {
	customerName: string;
	changeType: "rescheduled" | "cancelled";
	originalDate?: string;
	newDate?: string;
	newTime?: string;
	reason?: string;
}): string {
	if (data.changeType === "cancelled") {
		return `${data.customerName}, your appointment on ${data.originalDate} has been cancelled. ${data.reason || "Please call to reschedule."}`;
	}

	return `${data.customerName}, your appointment has been rescheduled from ${data.originalDate} to ${data.newDate} at ${data.newTime}. ${data.reason || ""}`;
}

/**
 * 10. Review Request
 * Sent: 2-3 days after job completion
 */
export function smsReviewRequest(data: {
	customerName: string;
	companyName: string;
	technicianName: string;
	reviewUrl: string;
}): string {
	return `Hi ${data.customerName}, how was your experience with ${data.technicianName} from ${data.companyName}? Leave a review: ${data.reviewUrl}`;
}

/**
 * 11. Urgent Alert
 * Sent: For emergency situations or critical updates
 */
export function smsUrgentAlert(data: {
	customerName: string;
	message: string;
	contactNumber?: string;
}): string {
	const contactInfo = data.contactNumber
		? ` Call ${data.contactNumber} immediately.`
		: "";
	return `URGENT: ${data.customerName}, ${data.message}${contactInfo}`;
}

/**
 * Helper: Get SMS character count
 * Single segment: 160 characters
 * Multi-segment: 153 characters per segment (with concatenation header)
 */
export function getSmsSegmentCount(message: string): number {
	const length = message.length;
	if (length <= 160) return 1;
	return Math.ceil(length / 153);
}

/**
 * Helper: Validate SMS message length
 * Returns true if message is within recommended limits
 */
export function validateSmsLength(message: string): {
	valid: boolean;
	length: number;
	segments: number;
	warning?: string;
} {
	const length = message.length;
	const segments = getSmsSegmentCount(message);

	if (length <= 160) {
		return { valid: true, length, segments: 1 };
	}

	if (length <= 306) {
		// 2 segments
		return {
			valid: true,
			length,
			segments,
			warning: "Message will be sent as 2 SMS segments",
		};
	}

	return {
		valid: false,
		length,
		segments,
		warning: `Message is too long (${segments} segments). Consider shortening.`,
	};
}

/**
 * Helper: Shorten URLs using a URL shortener service
 * (Placeholder - implement with Bitly, TinyURL, or custom shortener)
 */
export async function shortenUrl(longUrl: string): Promise<string> {
	// TODO: Implement URL shortening service integration
	// For now, return the original URL
	return longUrl;
}

/**
 * SMS Template Test Data
 * Used for testing and previewing SMS templates
 */
export const SMS_TEST_DATA = {
	appointmentConfirmation: {
		customerName: "Sarah Johnson",
		jobType: "HVAC Maintenance",
		scheduledDate: "Dec 1, 2025",
		scheduledTime: "2:00 PM",
		technicianName: "Mike Smith",
		confirmationNumber: "JOB-2025-001",
	},
	appointmentReminder: {
		customerName: "Sarah",
		jobType: "HVAC service",
		scheduledTime: "2:00 PM",
		technicianName: "Mike",
	},
	techEnRoute: {
		customerName: "Sarah",
		technicianName: "Mike",
		estimatedArrival: "20 min",
		technicianPhone: "+1-555-123-4567",
	},
	jobComplete: {
		customerName: "Sarah",
		jobType: "HVAC maintenance",
		totalAmount: 450.0,
		paymentUrl: "https://pay.co/abc123",
	},
	verificationCode: {
		code: "123456",
		expiresInMinutes: 10,
	},
	passwordResetCode: {
		code: "789012",
		expiresInMinutes: 15,
	},
	paymentReminder: {
		customerName: "Sarah",
		invoiceNumber: "INV-001",
		totalAmount: 450.0,
		daysOverdue: 7,
		paymentUrl: "https://pay.co/inv001",
	},
	serviceReminder: {
		customerName: "Sarah",
		serviceType: "annual HVAC maintenance",
		equipmentType: "heating system",
		scheduleUrl: "https://book.co/abc",
	},
	scheduleChange: {
		customerName: "Sarah",
		changeType: "rescheduled" as const,
		originalDate: "Dec 1",
		newDate: "Dec 3",
		newTime: "10:00 AM",
		reason: "Weather delay",
	},
	reviewRequest: {
		customerName: "Sarah",
		companyName: "Acme HVAC",
		technicianName: "Mike",
		reviewUrl: "https://review.co/abc",
	},
	urgentAlert: {
		customerName: "Sarah",
		message: "Gas leak detected in your area. Please evacuate immediately.",
		contactNumber: "911",
	},
};

/**
 * Get SMS template function by ID
 */
export function getSmsTemplate(
	templateId: string,
): ((data: any) => string) | null {
	const templates: Record<string, (data: any) => string> = {
		"appointment-confirmation": smsAppointmentConfirmation,
		"appointment-reminder": smsAppointmentReminder,
		"tech-en-route": smsTechEnRoute,
		"job-complete": smsJobComplete,
		"verification-code": smsVerificationCode,
		"password-reset-code": smsPasswordResetCode,
		"payment-reminder": smsPaymentReminder,
		"service-reminder": smsServiceReminder,
		"schedule-change": smsScheduleChange,
		"review-request": smsReviewRequest,
		"urgent-alert": smsUrgentAlert,
	};

	return templates[templateId] || null;
}
