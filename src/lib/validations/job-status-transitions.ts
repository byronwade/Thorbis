/**
 * Job Status Transition Validation
 *
 * Enforces business rules for job status changes:
 * - Valid transition paths (workflow validation)
 * - Required fields per status
 * - Blocking conditions
 *
 * Used by: updateJobStatus, updateJobData actions
 */

export type JobStatus =
	| "quoted"
	| "scheduled"
	| "in_progress"
	| "on_hold"
	| "completed"
	| "cancelled"
	| "invoiced"
	| "paid";

export type JobPriority = "low" | "medium" | "high" | "urgent";

export interface JobStatusTransitionContext {
	currentStatus: JobStatus;
	newStatus: JobStatus;
	job: {
		id: string;
		scheduled_start?: string | null;
		scheduled_end?: string | null;
		assigned_to?: string | null;
		customer_id?: string | null;
		property_id?: string | null;
		total_amount?: number | null;
		invoices?: Array<{ status: string; total_amount: number }>;
		estimates?: Array<{ status: string }>;
		teamAssignments?: Array<{ team_member_id: string }>;
	};
}

export interface StatusTransitionResult {
	allowed: boolean;
	reason?: string;
	requiredFields?: string[];
	warnings?: string[];
}

/**
 * Valid status transition paths
 * Key = current status, Value = allowed next statuses
 */
const VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
	quoted: ["scheduled", "cancelled"],
	scheduled: ["in_progress", "on_hold", "cancelled"],
	in_progress: ["on_hold", "completed", "cancelled"],
	on_hold: ["scheduled", "in_progress", "cancelled"],
	completed: ["invoiced"],
	cancelled: ["quoted", "scheduled"], // Allow re-opening cancelled jobs
	invoiced: ["paid"],
	paid: [], // Terminal state - no further transitions
};

/**
 * Required fields for each status
 */
const REQUIRED_FIELDS: Record<JobStatus, string[]> = {
	quoted: ["customer_id"], // At minimum need a customer
	scheduled: ["customer_id", "scheduled_start", "scheduled_end"],
	in_progress: ["customer_id", "scheduled_start", "assigned_to"],
	on_hold: ["customer_id"],
	completed: ["customer_id", "scheduled_start"],
	cancelled: [], // No required fields
	invoiced: ["customer_id", "total_amount"],
	paid: ["customer_id", "total_amount"],
};

/**
 * Field labels for user-friendly error messages
 */
const FIELD_LABELS: Record<string, string> = {
	customer_id: "Customer",
	scheduled_start: "Start Date",
	scheduled_end: "End Date",
	assigned_to: "Assigned Team Member",
	property_id: "Property",
	total_amount: "Total Amount",
};

/**
 * Validate if a status transition is allowed
 */
export function validateStatusTransition(
	context: JobStatusTransitionContext,
): StatusTransitionResult {
	const { currentStatus, newStatus, job } = context;

	// Same status - always allowed (no-op)
	if (currentStatus === newStatus) {
		return { allowed: true };
	}

	// Check if transition is in allowed paths
	const allowedNextStatuses = VALID_TRANSITIONS[currentStatus];
	if (!allowedNextStatuses.includes(newStatus)) {
		return {
			allowed: false,
			reason: `Cannot transition from "${currentStatus}" to "${newStatus}". Valid next statuses: ${allowedNextStatuses.join(", ")}`,
		};
	}

	// Check required fields for target status
	const requiredFields = REQUIRED_FIELDS[newStatus];
	const missingFields: string[] = [];

	for (const field of requiredFields) {
		const value = job[field as keyof typeof job];
		if (value === null || value === undefined || value === "") {
			missingFields.push(FIELD_LABELS[field] || field);
		}
	}

	if (missingFields.length > 0) {
		return {
			allowed: false,
			reason: `Cannot transition to "${newStatus}" - missing required fields`,
			requiredFields: missingFields,
		};
	}

	// Business rule validations
	const warnings: string[] = [];

	// Scheduled → In Progress: Should have team assignment
	if (currentStatus === "scheduled" && newStatus === "in_progress") {
		if (!job.teamAssignments || job.teamAssignments.length === 0) {
			warnings.push("No team members assigned to this job");
		}
	}

	// Completed → Invoiced: Should have estimates or total amount
	if (currentStatus === "completed" && newStatus === "invoiced") {
		const hasEstimates = job.estimates && job.estimates.length > 0;
		const hasTotalAmount = job.total_amount && job.total_amount > 0;

		if (!hasEstimates && !hasTotalAmount) {
			return {
				allowed: false,
				reason: "Cannot create invoice - no estimates or total amount defined",
			};
		}
	}

	// Invoiced → Paid: Should have invoices
	if (currentStatus === "invoiced" && newStatus === "paid") {
		if (!job.invoices || job.invoices.length === 0) {
			return {
				allowed: false,
				reason: "Cannot mark as paid - no invoices found",
			};
		}

		// Check if all invoices are paid
		const unpaidInvoices = job.invoices.filter(
			(inv) => inv.status !== "paid" && inv.status !== "cancelled",
		);

		if (unpaidInvoices.length > 0) {
			return {
				allowed: false,
				reason: `Cannot mark as paid - ${unpaidInvoices.length} invoice(s) still unpaid`,
			};
		}
	}

	// Paid → any: Should not be allowed (terminal state)
	if (currentStatus === "paid") {
		return {
			allowed: false,
			reason: "Cannot change status of paid jobs. Create a new job if needed.",
		};
	}

	return {
		allowed: true,
		warnings: warnings.length > 0 ? warnings : undefined,
	};
}

/**
 * Get all allowed next statuses for current status
 */
export function getAllowedNextStatuses(currentStatus: JobStatus): JobStatus[] {
	return VALID_TRANSITIONS[currentStatus] || [];
}

/**
 * Get required fields for a status
 */
export function getRequiredFieldsForStatus(status: JobStatus): string[] {
	return REQUIRED_FIELDS[status] || [];
}

/**
 * Check if a specific transition is valid (simple check without context)
 */
export function isTransitionAllowed(from: JobStatus, to: JobStatus): boolean {
	if (from === to) return true;
	return VALID_TRANSITIONS[from]?.includes(to) || false;
}

/**
 * Get user-friendly status name
 */
export function getStatusLabel(status: JobStatus): string {
	const labels: Record<JobStatus, string> = {
		quoted: "Quoted",
		scheduled: "Scheduled",
		in_progress: "In Progress",
		on_hold: "On Hold",
		completed: "Completed",
		cancelled: "Cancelled",
		invoiced: "Invoiced",
		paid: "Paid",
	};
	return labels[status] || status;
}

/**
 * Get status color/variant for UI
 */
export function getStatusVariant(
	status: JobStatus,
): "default" | "secondary" | "destructive" | "outline" {
	const variants: Record<
		JobStatus,
		"default" | "secondary" | "destructive" | "outline"
	> = {
		quoted: "outline",
		scheduled: "secondary",
		in_progress: "default",
		on_hold: "secondary",
		completed: "default",
		cancelled: "destructive",
		invoiced: "secondary",
		paid: "default",
	};
	return variants[status] || "default";
}

/**
 * Get recommended next status based on current status
 */
export function getRecommendedNextStatus(
	currentStatus: JobStatus,
): JobStatus | null {
	const recommendations: Record<JobStatus, JobStatus | null> = {
		quoted: "scheduled",
		scheduled: "in_progress",
		in_progress: "completed",
		on_hold: "in_progress",
		completed: "invoiced",
		cancelled: null,
		invoiced: "paid",
		paid: null,
	};
	return recommendations[currentStatus] || null;
}
