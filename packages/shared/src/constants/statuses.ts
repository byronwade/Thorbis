/**
 * Status Enums and Mappings
 *
 * Centralized status definitions and their mappings
 */

// ============================================================================
// Status Enums
// ============================================================================

export const CUSTOMER_STATUS = {
	active: "active",
	inactive: "inactive",
	blocked: "blocked",
} as const;

export const JOB_STATUS = {
	scheduled: "scheduled",
	inProgress: "in_progress",
	completed: "completed",
	cancelled: "cancelled",
	onHold: "on_hold",
} as const;

export const INVOICE_STATUS = {
	draft: "draft",
	sent: "sent",
	paid: "paid",
	overdue: "overdue",
	cancelled: "cancelled",
	partial: "partial",
} as const;

export const ESTIMATE_STATUS = {
	draft: "draft",
	sent: "sent",
	accepted: "accepted",
	rejected: "rejected",
	expired: "expired",
	cancelled: "cancelled",
} as const;

export const PRIORITY = {
	low: "low",
	medium: "medium",
	high: "high",
	urgent: "urgent",
} as const;

export const APPOINTMENT_STATUS = {
	scheduled: "scheduled",
	confirmed: "confirmed",
	inProgress: "in_progress",
	completed: "completed",
	cancelled: "cancelled",
	noShow: "no_show",
} as const;

// ============================================================================
// Status Mappings
// ============================================================================

export const STATUS_MAPPINGS = {
	customer: CUSTOMER_STATUS,
	job: JOB_STATUS,
	invoice: INVOICE_STATUS,
	estimate: ESTIMATE_STATUS,
	priority: PRIORITY,
	appointment: APPOINTMENT_STATUS,
} as const;

// ============================================================================
// Status Display Names
// ============================================================================

export const STATUS_DISPLAY_NAMES = {
	customer: {
		active: "Active",
		inactive: "Inactive",
		blocked: "Blocked",
	},
	job: {
		scheduled: "Scheduled",
		in_progress: "In Progress",
		completed: "Completed",
		cancelled: "Cancelled",
		on_hold: "On Hold",
	},
	invoice: {
		draft: "Draft",
		sent: "Sent",
		paid: "Paid",
		overdue: "Overdue",
		cancelled: "Cancelled",
		partial: "Partial",
	},
	estimate: {
		draft: "Draft",
		sent: "Sent",
		accepted: "Accepted",
		rejected: "Rejected",
		expired: "Expired",
		cancelled: "Cancelled",
	},
	priority: {
		low: "Low",
		medium: "Medium",
		high: "High",
		urgent: "Urgent",
	},
	appointment: {
		scheduled: "Scheduled",
		confirmed: "Confirmed",
		in_progress: "In Progress",
		completed: "Completed",
		cancelled: "Cancelled",
		no_show: "No Show",
	},
} as const;


