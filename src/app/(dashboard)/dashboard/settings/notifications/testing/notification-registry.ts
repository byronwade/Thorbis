/**
 * Notification Registry - Centralized definition of all notification types
 *
 * This file contains the complete catalog of all notifications in the system:
 * - Email notifications (20 templates)
 * - SMS notifications (8 types)
 * - In-app notifications (10 event types)
 * - Push notifications (6 types)
 *
 * Each notification includes:
 * - Implementation status (complete, partial, missing)
 * - Template/trigger information
 * - Test data for previews
 * - Channel availability
 */

export type NotificationChannel = "email" | "sms" | "in_app" | "push";

export type ImplementationStatus = "complete" | "partial" | "missing";

export interface NotificationDefinition {
  id: string;
  name: string;
  description: string;
  category: "auth" | "job" | "billing" | "customer" | "team" | "system";
  channels: {
    email?: {
      status: ImplementationStatus;
      templatePath?: string;
      templateComponent?: string;
    };
    sms?: {
      status: ImplementationStatus;
      templateFunction?: string;
    };
    in_app?: {
      status: ImplementationStatus;
      triggerFunction?: string;
    };
    push?: {
      status: ImplementationStatus;
      serviceFunction?: string;
    };
  };
  testData: Record<string, any>;
  priority: "low" | "medium" | "high" | "urgent";
  userPreferenceKey?: string;
}

/**
 * Complete Notification Registry
 */
export const NOTIFICATION_REGISTRY: NotificationDefinition[] = [
  // ========================================
  // AUTHENTICATION NOTIFICATIONS (5)
  // ========================================
  {
    id: "auth-welcome",
    name: "Welcome Email",
    description: "Welcome new users to the platform",
    category: "auth",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/auth/welcome.tsx",
        templateComponent: "WelcomeEmail",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifySystem",
      },
    },
    testData: {
      userName: "John Doe",
      userEmail: "john@example.com",
      dashboardUrl: "https://app.stratos.com/dashboard",
    },
    userPreferenceKey: "email_system",
  },
  {
    id: "auth-email-verification",
    name: "Email Verification",
    description: "Verify user email address with confirmation link",
    category: "auth",
    priority: "urgent",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/auth/email-verification.tsx",
        templateComponent: "EmailVerificationEmail",
      },
    },
    testData: {
      userName: "John Doe",
      verificationUrl: "https://app.stratos.com/auth/verify?token=abc123",
      expiresInHours: 24,
    },
  },
  {
    id: "auth-password-reset",
    name: "Password Reset",
    description: "Send password reset link to user",
    category: "auth",
    priority: "urgent",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/auth/password-reset.tsx",
        templateComponent: "PasswordResetEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsPasswordResetCode",
      },
    },
    testData: {
      userName: "John Doe",
      resetUrl: "https://app.stratos.com/auth/reset-password?token=xyz789",
      expiresInMinutes: 15,
    },
  },
  {
    id: "auth-password-changed",
    name: "Password Changed Confirmation",
    description: "Confirm password was successfully changed",
    category: "auth",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/auth/password-changed.tsx",
        templateComponent: "PasswordChangedEmail",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyAlert",
      },
    },
    testData: {
      userName: "John Doe",
      changedAt: new Date().toISOString(),
      ipAddress: "192.168.1.1",
      userAgent: "Chrome on macOS",
    },
  },
  {
    id: "auth-magic-link",
    name: "Magic Link Login",
    description: "Passwordless login via email link",
    category: "auth",
    priority: "urgent",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/auth/magic-link.tsx",
        templateComponent: "MagicLinkEmail",
      },
    },
    testData: {
      userName: "John Doe",
      loginUrl: "https://app.stratos.com/auth/magic?token=magic123",
      expiresInMinutes: 10,
    },
  },

  // ========================================
  // JOB LIFECYCLE NOTIFICATIONS (4)
  // ========================================
  {
    id: "job-confirmation",
    name: "Appointment Confirmation",
    description: "Confirm job appointment with customer",
    category: "job",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/jobs/job-confirmation.tsx",
        templateComponent: "JobConfirmationEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsAppointmentConfirmation",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyJobCreated",
      },
      push: {
        status: "missing",
        serviceFunction: "pushJobConfirmation",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      jobType: "HVAC Maintenance",
      scheduledDate: "2025-12-01",
      scheduledTime: "2:00 PM - 4:00 PM",
      technicianName: "Mike Smith",
      address: "123 Main St, Anytown, CA 90210",
      confirmationNumber: "JOB-2025-001",
    },
    userPreferenceKey: "email_new_jobs",
  },
  {
    id: "job-reminder",
    name: "Appointment Reminder",
    description: "Remind customer 24h before appointment",
    category: "job",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/jobs/appointment-reminder.tsx",
        templateComponent: "AppointmentReminderEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsAppointmentReminder",
      },
      push: {
        status: "missing",
        serviceFunction: "pushAppointmentReminder",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      jobType: "HVAC Maintenance",
      scheduledDate: "2025-12-01",
      scheduledTime: "2:00 PM",
      technicianName: "Mike Smith",
      confirmationNumber: "JOB-2025-001",
    },
  },
  {
    id: "job-tech-enroute",
    name: "Technician En Route",
    description: "Notify customer that technician is on the way",
    category: "job",
    priority: "urgent",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/jobs/tech-en-route.tsx",
        templateComponent: "TechEnRouteEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsTechEnRoute",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyJobUpdated",
      },
      push: {
        status: "missing",
        serviceFunction: "pushTechEnRoute",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      technicianName: "Mike Smith",
      technicianPhone: "+1 (555) 123-4567",
      estimatedArrival: "20 minutes",
      trackingUrl: "https://app.stratos.com/track/abc123",
    },
  },
  {
    id: "job-complete",
    name: "Job Completion",
    description: "Notify customer that service is complete",
    category: "job",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/jobs/job-complete.tsx",
        templateComponent: "JobCompleteEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsJobComplete",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyJobCompleted",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      jobType: "HVAC Maintenance",
      completedDate: new Date().toISOString(),
      technicianName: "Mike Smith",
      workPerformed: "Replaced air filter, cleaned coils, checked refrigerant levels",
      invoiceUrl: "https://app.stratos.com/invoices/INV-001",
      reviewUrl: "https://app.stratos.com/review/abc123",
    },
    userPreferenceKey: "email_job_updates",
  },

  // ========================================
  // BILLING NOTIFICATIONS (4)
  // ========================================
  {
    id: "billing-invoice-sent",
    name: "Invoice Sent",
    description: "Send invoice to customer",
    category: "billing",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/billing/invoice-sent.tsx",
        templateComponent: "InvoiceSentEmail",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyPaymentDue",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      invoiceNumber: "INV-2025-001",
      invoiceDate: "2025-11-18",
      dueDate: "2025-12-18",
      totalAmount: 450.00,
      items: [
        { description: "HVAC Maintenance", amount: 350.00 },
        { description: "Air Filter Replacement", amount: 100.00 },
      ],
      paymentUrl: "https://app.stratos.com/pay/inv-001",
    },
    userPreferenceKey: "email_invoices",
  },
  {
    id: "billing-payment-received",
    name: "Payment Received",
    description: "Confirm payment received from customer",
    category: "billing",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/billing/payment-received.tsx",
        templateComponent: "PaymentReceivedEmail",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyPaymentReceived",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      invoiceNumber: "INV-2025-001",
      paymentAmount: 450.00,
      paymentDate: new Date().toISOString(),
      paymentMethod: "Credit Card (**** 4242)",
      receiptUrl: "https://app.stratos.com/receipts/PAY-001",
    },
  },
  {
    id: "billing-payment-reminder",
    name: "Payment Reminder",
    description: "Remind customer of overdue payment",
    category: "billing",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/billing/payment-reminder.tsx",
        templateComponent: "PaymentReminderEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsPaymentReminder",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyAlert",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      invoiceNumber: "INV-2025-001",
      originalDueDate: "2025-12-18",
      daysOverdue: 7,
      totalAmount: 450.00,
      paymentUrl: "https://app.stratos.com/pay/inv-001",
    },
  },
  {
    id: "billing-estimate-sent",
    name: "Estimate Sent",
    description: "Send estimate/quote to customer",
    category: "billing",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/billing/estimate-sent.tsx",
        templateComponent: "EstimateSentEmail",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      estimateNumber: "EST-2025-001",
      estimateDate: "2025-11-18",
      validUntil: "2025-12-18",
      totalAmount: 1250.00,
      items: [
        { description: "HVAC System Installation", amount: 1000.00 },
        { description: "Thermostat Upgrade", amount: 250.00 },
      ],
      approveUrl: "https://app.stratos.com/estimates/EST-001/approve",
    },
  },

  // ========================================
  // CUSTOMER ENGAGEMENT NOTIFICATIONS (6)
  // ========================================
  {
    id: "customer-invoice",
    name: "Customer Invoice Notification",
    description: "Customer-facing invoice notification",
    category: "customer",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/customer/invoice-notification.tsx",
        templateComponent: "CustomerInvoiceEmail",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      companyName: "Acme HVAC Services",
      invoiceNumber: "INV-2025-001",
      totalAmount: 450.00,
      dueDate: "2025-12-18",
      viewUrl: "https://app.stratos.com/customer/invoices/INV-001",
    },
  },
  {
    id: "customer-estimate",
    name: "Customer Estimate Notification",
    description: "Customer-facing estimate notification",
    category: "customer",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/customer/estimate-notification.tsx",
        templateComponent: "CustomerEstimateEmail",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      companyName: "Acme HVAC Services",
      estimateNumber: "EST-2025-001",
      totalAmount: 1250.00,
      validUntil: "2025-12-18",
      viewUrl: "https://app.stratos.com/customer/estimates/EST-001",
    },
  },
  {
    id: "customer-review-request",
    name: "Review Request",
    description: "Request customer review after service completion",
    category: "customer",
    priority: "low",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/customer/review-request.tsx",
        templateComponent: "ReviewRequestEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsReviewRequest",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      companyName: "Acme HVAC Services",
      technicianName: "Mike Smith",
      serviceDate: "2025-11-18",
      reviewUrl: "https://app.stratos.com/review/abc123",
    },
  },
  {
    id: "customer-service-reminder",
    name: "Service Reminder",
    description: "Remind customer of upcoming maintenance",
    category: "customer",
    priority: "low",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/customer/service-reminder.tsx",
        templateComponent: "ServiceReminderEmail",
      },
      sms: {
        status: "missing",
        templateFunction: "smsServiceReminder",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      companyName: "Acme HVAC Services",
      serviceType: "Annual HVAC Maintenance",
      lastServiceDate: "2024-11-18",
      equipmentType: "HVAC System",
      scheduleUrl: "https://app.stratos.com/schedule",
    },
  },
  {
    id: "customer-welcome",
    name: "Welcome New Customer",
    description: "Welcome email for new customers",
    category: "customer",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/customer/welcome-customer.tsx",
        templateComponent: "WelcomeCustomerEmail",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      companyName: "Acme HVAC Services",
      supportEmail: "support@acmehvac.com",
      supportPhone: "+1 (555) 123-4567",
      portalUrl: "https://app.stratos.com/customer/portal",
    },
  },
  {
    id: "customer-portal-invitation",
    name: "Customer Portal Invitation",
    description: "Invite customer to access customer portal",
    category: "customer",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/customer/portal-invitation.tsx",
        templateComponent: "PortalInvitationEmail",
      },
    },
    testData: {
      customerName: "Sarah Johnson",
      companyName: "Acme HVAC Services",
      invitationUrl: "https://app.stratos.com/customer/accept/abc123",
      expiresInDays: 7,
    },
  },

  // ========================================
  // TEAM NOTIFICATIONS (1)
  // ========================================
  {
    id: "team-invitation",
    name: "Team Member Invitation",
    description: "Invite new team member to join company",
    category: "team",
    priority: "high",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/team/invitation.tsx",
        templateComponent: "TeamInvitationEmail",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifyTeamMemberAdded",
      },
    },
    testData: {
      inviteeName: "Alex Rodriguez",
      inviterName: "John Manager",
      companyName: "Acme HVAC Services",
      role: "Technician",
      invitationUrl: "https://app.stratos.com/invite/accept/xyz789",
      expiresInDays: 7,
    },
  },

  // ========================================
  // SYSTEM NOTIFICATIONS (1)
  // ========================================
  {
    id: "system-verification-submitted",
    name: "Telnyx Verification Submitted",
    description: "Confirm 10DLC verification submission to Telnyx",
    category: "system",
    priority: "medium",
    channels: {
      email: {
        status: "complete",
        templatePath: "/emails/templates/onboarding/verification-submitted.tsx",
        templateComponent: "VerificationSubmittedEmail",
      },
      in_app: {
        status: "complete",
        triggerFunction: "notifySystem",
      },
    },
    testData: {
      userName: "John Doe",
      businessName: "Acme HVAC Services",
      submissionDate: new Date().toISOString(),
      estimatedReviewTime: "2-3 business days",
    },
  },

  // ========================================
  // IN-APP ONLY NOTIFICATIONS (3)
  // ========================================
  {
    id: "inapp-new-message",
    name: "New Message",
    description: "New customer message received",
    category: "system",
    priority: "high",
    channels: {
      in_app: {
        status: "complete",
        triggerFunction: "notifyNewMessage",
      },
      push: {
        status: "missing",
        serviceFunction: "pushNewMessage",
      },
    },
    testData: {
      senderName: "Sarah Johnson",
      messagePreview: "Can we reschedule my appointment?",
      conversationUrl: "/dashboard/communications/messages/123",
    },
    userPreferenceKey: "email_messages",
  },
  {
    id: "inapp-missed-call",
    name: "Missed Call",
    description: "Missed call from customer",
    category: "system",
    priority: "medium",
    channels: {
      in_app: {
        status: "complete",
        triggerFunction: "notifyMissedCall",
      },
    },
    testData: {
      callerName: "Sarah Johnson",
      callerNumber: "+1 (555) 987-6543",
      callTime: new Date().toISOString(),
    },
  },
  {
    id: "inapp-team-assignment",
    name: "Team Assignment",
    description: "Assigned to a job or task",
    category: "team",
    priority: "medium",
    channels: {
      in_app: {
        status: "complete",
        triggerFunction: "notifyTeamAssignment",
      },
      push: {
        status: "missing",
        serviceFunction: "pushTeamAssignment",
      },
    },
    testData: {
      assignerName: "John Manager",
      jobType: "HVAC Maintenance",
      jobUrl: "/dashboard/work/jobs/456",
      scheduledDate: "2025-12-01",
    },
  },
];

/**
 * Get notification by ID
 */
export function getNotificationById(id: string): NotificationDefinition | undefined {
  return NOTIFICATION_REGISTRY.find((n) => n.id === id);
}

/**
 * Get notifications by category
 */
export function getNotificationsByCategory(category: NotificationDefinition["category"]): NotificationDefinition[] {
  return NOTIFICATION_REGISTRY.filter((n) => n.category === category);
}

/**
 * Get notifications by channel
 */
export function getNotificationsByChannel(channel: NotificationChannel): NotificationDefinition[] {
  return NOTIFICATION_REGISTRY.filter((n) => n.channels[channel] !== undefined);
}

/**
 * Get implementation status summary
 */
export function getImplementationStats() {
  const stats = {
    total: NOTIFICATION_REGISTRY.length,
    byChannel: {
      email: { complete: 0, partial: 0, missing: 0, total: 0 },
      sms: { complete: 0, partial: 0, missing: 0, total: 0 },
      in_app: { complete: 0, partial: 0, missing: 0, total: 0 },
      push: { complete: 0, partial: 0, missing: 0, total: 0 },
    },
    byCategory: {} as Record<string, number>,
  };

  NOTIFICATION_REGISTRY.forEach((notification) => {
    // Count by category
    stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1;

    // Count by channel
    (Object.keys(notification.channels) as NotificationChannel[]).forEach((channel) => {
      const channelData = notification.channels[channel];
      if (channelData) {
        stats.byChannel[channel].total++;
        stats.byChannel[channel][channelData.status]++;
      }
    });
  });

  return stats;
}

/**
 * Get incomplete notifications (partial or missing implementations)
 */
export function getIncompleteNotifications(): NotificationDefinition[] {
  return NOTIFICATION_REGISTRY.filter((notification) => {
    return Object.values(notification.channels).some(
      (channel) => channel && (channel.status === "partial" || channel.status === "missing")
    );
  });
}
