/**
 * Vercel Analytics Event Types
 *
 * Type-safe event definitions for comprehensive tracking across the application.
 * All events are categorized by domain (dashboard, marketing, user, etc.)
 */

/**
 * Base event structure
 */
export interface BaseAnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/**
 * Dashboard Events - Core business operations
 */
export type DashboardEvent =
  // Job Events
  | {
      name: "job.created";
      properties?: {
        jobId?: string;
        customerId?: string;
        jobType?: string;
        estimatedValue?: number;
        source?: string;
      };
    }
  | {
      name: "job.updated";
      properties?: {
        jobId?: string;
        field?: string;
        oldValue?: string;
        newValue?: string;
      };
    }
  | {
      name: "job.status_changed";
      properties?: {
        jobId?: string;
        oldStatus?: string;
        newStatus?: string;
      };
    }
  | {
      name: "job.deleted";
      properties?: {
        jobId?: string;
      };
    }
  | {
      name: "job.viewed";
      properties?: {
        jobId?: string;
        viewType?: "detail" | "list" | "calendar" | "map";
      };
    }
  | {
      name: "job.assigned";
      properties?: {
        jobId?: string;
        technicianId?: string;
        technicianName?: string;
      };
    }
  | {
      name: "job.completed";
      properties?: {
        jobId?: string;
        duration?: number;
        revenue?: number;
      };
    }
  // Customer Events
  | {
      name: "customer.created";
      properties?: {
        customerId?: string;
        source?: "manual" | "import" | "api";
        hasEmail?: boolean;
        hasPhone?: boolean;
      };
    }
  | {
      name: "customer.updated";
      properties?: {
        customerId?: string;
        field?: string;
      };
    }
  | {
      name: "customer.viewed";
      properties?: {
        customerId?: string;
        viewType?: "detail" | "list";
      };
    }
  | {
      name: "customer.deleted";
      properties?: {
        customerId?: string;
      };
    }
  | {
      name: "customer.contacted";
      properties?: {
        customerId?: string;
        method?: "email" | "sms" | "call";
      };
    }
  // Invoice Events
  | {
      name: "invoice.created";
      properties?: {
        invoiceId?: string;
        jobId?: string;
        customerId?: string;
        amount?: number;
        currency?: string;
      };
    }
  | {
      name: "invoice.sent";
      properties?: {
        invoiceId?: string;
        method?: "email" | "sms" | "link";
      };
    }
  | {
      name: "invoice.paid";
      properties?: {
        invoiceId?: string;
        amount?: number;
        paymentMethod?: string;
      };
    }
  | {
      name: "invoice.viewed";
      properties?: {
        invoiceId?: string;
        viewType?: "detail" | "list" | "pdf";
      };
    }
  // Estimate Events
  | {
      name: "estimate.created";
      properties?: {
        estimateId?: string;
        jobId?: string;
        customerId?: string;
        amount?: number;
      };
    }
  | {
      name: "estimate.sent";
      properties?: {
        estimateId?: string;
        method?: "email" | "sms" | "link";
      };
    }
  | {
      name: "estimate.accepted";
      properties?: {
        estimateId?: string;
        amount?: number;
      };
    }
  | {
      name: "estimate.declined";
      properties?: {
        estimateId?: string;
        reason?: string;
      };
    }
  // Equipment Events
  | {
      name: "equipment.created";
      properties?: {
        equipmentId?: string;
        type?: string;
        make?: string;
        model?: string;
      };
    }
  | {
      name: "equipment.assigned";
      properties?: {
        equipmentId?: string;
        jobId?: string;
      };
    }
  | {
      name: "equipment.maintenance_scheduled";
      properties?: {
        equipmentId?: string;
        maintenanceType?: string;
      };
    }
  // Schedule Events
  | {
      name: "schedule.viewed";
      properties?: {
        viewType?: "calendar" | "list" | "gantt" | "map";
        dateRange?: string;
      };
    }
  | {
      name: "schedule.job_scheduled";
      properties?: {
        jobId?: string;
        date?: string;
        technicianId?: string;
      };
    }
  | {
      name: "schedule.job_rescheduled";
      properties?: {
        jobId?: string;
        oldDate?: string;
        newDate?: string;
      };
    }
  // Team Events
  | {
      name: "team.member_added";
      properties?: {
        memberId?: string;
        role?: string;
      };
    }
  | {
      name: "team.member_removed";
      properties?: {
        memberId?: string;
      };
    }
  | {
      name: "team.role_changed";
      properties?: {
        memberId?: string;
        oldRole?: string;
        newRole?: string;
      };
    }
  // Document Events
  | {
      name: "document.uploaded";
      properties?: {
        documentId?: string;
        type?: string;
        size?: number;
        entityType?: string;
        entityId?: string;
      };
    }
  | {
      name: "document.viewed";
      properties?: {
        documentId?: string;
        type?: string;
      };
    }
  | {
      name: "document.downloaded";
      properties?: {
        documentId?: string;
        type?: string;
      };
    }
  // Communication Events
  | {
      name: "communication.sent";
      properties?: {
        type?: "email" | "sms" | "call";
        recipientType?: "customer" | "team";
        recipientCount?: number;
      };
    }
  | {
      name: "communication.call_started";
      properties?: {
        callId?: string;
        customerId?: string;
        duration?: number;
      };
    }
  | {
      name: "communication.call_ended";
      properties?: {
        callId?: string;
        duration?: number;
        outcome?: string;
      };
    }
  // Reporting Events
  | {
      name: "report.viewed";
      properties?: {
        reportType?: string;
        dateRange?: string;
      };
    }
  | {
      name: "report.exported";
      properties?: {
        reportType?: string;
        format?: "pdf" | "csv" | "excel";
      };
    }
  // Settings Events
  | {
      name: "settings.updated";
      properties?: {
        section?: string;
        setting?: string;
      };
    }
  | {
      name: "settings.integration_connected";
      properties?: {
        integrationType?: string;
        integrationName?: string;
      };
    }
  | {
      name: "settings.integration_disconnected";
      properties?: {
        integrationType?: string;
        integrationName?: string;
      };
    }
  // Automation Events
  | {
      name: "automation.created";
      properties?: {
        automationId?: string;
        trigger?: string;
        action?: string;
      };
    }
  | {
      name: "automation.triggered";
      properties?: {
        automationId?: string;
        entityType?: string;
        entityId?: string;
      };
    }
  | {
      name: "automation.enabled";
      properties?: {
        automationId?: string;
      };
    }
  | {
      name: "automation.disabled";
      properties?: {
        automationId?: string;
      };
    };

/**
 * Marketing Events - User acquisition and engagement
 */
export type MarketingEvent =
  // Page View Events
  | {
      name: "page.viewed";
      properties?: {
        path?: string;
        title?: string;
        referrer?: string;
      };
    }
  // Tool Usage Events
  | {
      name: "tool.opened";
      properties?: {
        toolName?: string;
        toolCategory?: string;
        source?: string;
      };
    }
  | {
      name: "tool.completed";
      properties?: {
        toolName?: string;
        duration?: number;
        result?: string;
      };
    }
  | {
      name: "tool.shared";
      properties?: {
        toolName?: string;
        method?: "email" | "link" | "social";
      };
    }
  // Calculator Events
  | {
      name: "calculator.used";
      properties?: {
        calculatorType?: string;
        inputs?: Record<string, unknown>;
        result?: Record<string, unknown>;
      };
    }
  // Signup Events
  | {
      name: "signup.started";
      properties?: {
        source?: string;
        referrer?: string;
      };
    }
  | {
      name: "signup.completed";
      properties?: {
        userId?: string;
        plan?: string;
        source?: string;
      };
    }
  | {
      name: "signup.abandoned";
      properties?: {
        step?: string;
        reason?: string;
      };
    }
  // Authentication Events
  | {
      name: "auth.login";
      properties?: {
        method?: "email" | "google" | "magic_link";
        userId?: string;
      };
    }
  | {
      name: "auth.logout";
      properties?: {
        userId?: string;
        sessionDuration?: number;
      };
    }
  | {
      name: "auth.signup";
      properties?: {
        userId?: string;
        method?: "email" | "google";
        plan?: string;
      };
    }
  // Onboarding Events
  | {
      name: "onboarding.started";
      properties?: {
        userId?: string;
      };
    }
  | {
      name: "onboarding.step_completed";
      properties?: {
        userId?: string;
        step?: string;
        stepNumber?: number;
      };
    }
  | {
      name: "onboarding.completed";
      properties?: {
        userId?: string;
        duration?: number;
      };
    }
  | {
      name: "onboarding.skipped";
      properties?: {
        userId?: string;
        step?: string;
      };
    }
  // Feature Discovery Events
  | {
      name: "feature.discovered";
      properties?: {
        featureName?: string;
        source?: "tooltip" | "tour" | "notification" | "search";
      };
    }
  | {
      name: "feature.used";
      properties?: {
        featureName?: string;
        firstTime?: boolean;
      };
    }
  // Content Engagement Events
  | {
      name: "content.viewed";
      properties?: {
        contentType?: "blog" | "guide" | "kb" | "video";
        contentId?: string;
        contentTitle?: string;
      };
    }
  | {
      name: "content.shared";
      properties?: {
        contentType?: string;
        contentId?: string;
        method?: "email" | "link" | "social";
      };
    }
  | {
      name: "content.downloaded";
      properties?: {
        contentType?: string;
        contentId?: string;
        fileName?: string;
      };
    }
  // Search Events
  | {
      name: "search.performed";
      properties?: {
        query?: string;
        category?: string;
        resultsCount?: number;
      };
    }
  | {
      name: "search.result_clicked";
      properties?: {
        query?: string;
        resultIndex?: number;
        resultType?: string;
      };
    }
  // CTA Events
  | {
      name: "cta.clicked";
      properties?: {
        ctaName?: string;
        ctaLocation?: string;
        destination?: string;
      };
    }
  | {
      name: "cta.converted";
      properties?: {
        ctaName?: string;
        conversionType?: string;
      };
    }
  // Pricing Events
  | {
      name: "pricing.viewed";
      properties?: {
        plan?: string;
        source?: string;
      };
    }
  | {
      name: "pricing.plan_selected";
      properties?: {
        plan?: string;
        billingCycle?: "monthly" | "annual";
      };
    }
  | {
      name: "pricing.checkout_started";
      properties?: {
        plan?: string;
        amount?: number;
      };
    }
  | {
      name: "pricing.checkout_completed";
      properties?: {
        plan?: string;
        amount?: number;
        customerId?: string;
      };
    };

/**
 * User Engagement Events - Feature usage and navigation
 */
export type UserEngagementEvent =
  // Navigation Events
  | {
      name: "navigation.page_viewed";
      properties?: {
        path?: string;
        previousPath?: string;
        referrer?: string;
      };
    }
  | {
      name: "navigation.section_changed";
      properties?: {
        fromSection?: string;
        toSection?: string;
      };
    }
  // Feature Usage Events
  | {
      name: "feature.quick_action_used";
      properties?: {
        action?: string;
        context?: string;
      };
    }
  | {
      name: "feature.bulk_action_used";
      properties?: {
        action?: string;
        itemCount?: number;
        entityType?: string;
      };
    }
  | {
      name: "feature.filter_applied";
      properties?: {
        filterType?: string;
        filterValue?: string;
        entityType?: string;
      };
    }
  | {
      name: "feature.sort_applied";
      properties?: {
        sortField?: string;
        sortDirection?: "asc" | "desc";
        entityType?: string;
      };
    }
  | {
      name: "feature.search_used";
      properties?: {
        query?: string;
        entityType?: string;
        resultsCount?: number;
      };
    }
  // UI Interaction Events
  | {
      name: "ui.modal_opened";
      properties?: {
        modalType?: string;
        trigger?: string;
      };
    }
  | {
      name: "ui.modal_closed";
      properties?: {
        modalType?: string;
        duration?: number;
        action?: "submit" | "cancel" | "dismiss";
      };
    }
  | {
      name: "ui.dropdown_opened";
      properties?: {
        dropdownType?: string;
        context?: string;
      };
    }
  | {
      name: "ui.tab_switched";
      properties?: {
        tabName?: string;
        section?: string;
      };
    }
  | {
      name: "ui.toggle_changed";
      properties?: {
        toggleName?: string;
        value?: boolean;
      };
    }
  // Form Events
  | {
      name: "form.started";
      properties?: {
        formType?: string;
        formName?: string;
      };
    }
  | {
      name: "form.field_focused";
      properties?: {
        formType?: string;
        fieldName?: string;
      };
    }
  | {
      name: "form.validation_error";
      properties?: {
        formType?: string;
        fieldName?: string;
        errorType?: string;
      };
    }
  | {
      name: "form.submitted";
      properties?: {
        formType?: string;
        success?: boolean;
        errorCount?: number;
      };
    }
  | {
      name: "form.abandoned";
      properties?: {
        formType?: string;
        fieldsCompleted?: number;
        totalFields?: number;
      };
    }
  // Error Events
  | {
      name: "error.occurred";
      properties?: {
        errorType?: string;
        errorMessage?: string;
        page?: string;
        userId?: string;
      };
    }
  | {
      name: "error.reported";
      properties?: {
        errorType?: string;
        errorMessage?: string;
        context?: string;
      };
    }
  // Performance Events
  | {
      name: "performance.slow_load";
      properties?: {
        page?: string;
        loadTime?: number;
        threshold?: number;
      };
    }
  | {
      name: "performance.timeout";
      properties?: {
        operation?: string;
        timeout?: number;
      };
    }
  // Export/Import Events
  | {
      name: "export.started";
      properties?: {
        entityType?: string;
        format?: "csv" | "excel" | "pdf";
        recordCount?: number;
      };
    }
  | {
      name: "export.completed";
      properties?: {
        entityType?: string;
        format?: string;
        recordCount?: number;
        duration?: number;
      };
    }
  | {
      name: "import.started";
      properties?: {
        entityType?: string;
        format?: string;
        recordCount?: number;
      };
    }
  | {
      name: "import.completed";
      properties?: {
        entityType?: string;
        format?: string;
        recordCount?: number;
        successCount?: number;
        errorCount?: number;
      };
    }
  // AI Events
  | {
      name: "ai.feature_used";
      properties?: {
        featureName?: string;
        model?: string;
        tokensUsed?: number;
      };
    }
  | {
      name: "ai.suggestion_accepted";
      properties?: {
        featureName?: string;
        suggestionType?: string;
      };
    }
  | {
      name: "ai.suggestion_rejected";
      properties?: {
        featureName?: string;
        suggestionType?: string;
      };
    };

/**
 * Union of all event types
 */
export type AnalyticsEvent =
  | DashboardEvent
  | MarketingEvent
  | UserEngagementEvent;

/**
 * Event category for filtering
 */
export type EventCategory = "dashboard" | "marketing" | "user" | "all";
