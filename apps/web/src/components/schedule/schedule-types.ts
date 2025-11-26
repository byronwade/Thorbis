// ============================================
// CORE DATA TYPES
// ============================================

export type Address = {
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;
};

export type Location = {
	address: Address;
	coordinates: {
		lat: number;
		lng: number;
	};
	placeId?: string; // Google Places ID
};

export type Customer = {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	company?: string;
	location: Location;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type RecurrenceRule = {
	frequency: "daily" | "weekly" | "monthly" | "yearly";
	interval: number; // Every N days/weeks/months/years
	endDate?: Date;
	count?: number; // Stop after N occurrences
	daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
	dayOfMonth?: number; // 1-31
	monthOfYear?: number; // 1-12
};

export type JobMetadata = {
	estimatedDuration?: number; // minutes
	actualDuration?: number; // minutes
	materials?: string[];
	notes?: string;
	internalNotes?: string;
	attachments?: string[]; // URLs
	tags?: string[];
	customFields?: Record<string, any>;
};

export type JobAssignmentRole = "primary" | "assistant" | "crew" | "supervisor";

export type JobAssignment = {
	technicianId: string | null;
	teamMemberId?: string | null;
	displayName: string;
	avatar?: string | null;
	role: JobAssignmentRole;
	status?: Technician["status"];
	isActive: boolean;
};

export type JobType =
	| "service"
	| "service_call"
	| "repair"
	| "installation"
	| "maintenance"
	| "premium_maintenance"
	| "inspection"
	| "emergency"
	| "estimate"
	| "callback"
	| "other";

// Appointment category for visual differentiation (meeting vs job vs event)
export type AppointmentCategory = "job" | "meeting" | "event";

// Maps database appointment types to display categories
export function getAppointmentCategory(
	type?: string | null,
	allDay?: boolean,
): AppointmentCategory {
	// All-day appointments are events
	if (allDay) return "event";

	switch (type?.toLowerCase()) {
		case "meeting":
		case "appointment":
		case "follow_up":
		case "consultation":
		case "call":
			return "meeting";
		case "event":
		case "training":
		case "conference":
		case "holiday":
			return "event";
		case "job":
		case "service":
		case "repair":
		case "installation":
		case "maintenance":
		case "inspection":
		case "estimate":
		case "callback":
		default:
			return "job";
	}
}

export type Job = {
	id: string; // Schedule ID
	jobId?: string; // Actual job ID (for linking to job details)
	technicianId: string; // Primary technician id (falls back to first assignment or empty string)
	assignments: JobAssignment[];
	isUnassigned: boolean;

	// Job details
	title: string;
	description?: string;
	jobType?: JobType;
	appointmentType?: string; // Raw type from appointments table (job, appointment, meeting, etc.)
	appointmentCategory?: AppointmentCategory; // Derived: job | meeting | event
	customer: Customer;
	location: Location;

	// Scheduling
	startTime: Date;
	endTime: Date;
	allDay?: boolean; // For meetings, events

	// Status
	status:
		| "scheduled"
		| "dispatched"
		| "arrived"
		| "in-progress"
		| "closed"
		| "completed"
		| "cancelled";
	priority: "low" | "medium" | "high" | "urgent";

	// Recurrence
	recurrence?: RecurrenceRule;
	parentJobId?: string; // For recurring job instances

	// Metadata
	metadata: JobMetadata;

	// Audit
	createdAt: Date;
	updatedAt: Date;
	createdBy?: string;
	updatedBy?: string;
};

export type TechnicianSchedule = {
	availableHours: {
		start: number; // 0-23
		end: number; // 0-23
	};
	daysOff: Date[];
	breakTimes?: Array<{
		start: number; // minutes from day start
		end: number;
	}>;
};

export type Technician = {
	id: string;
	userId?: string;
	teamMemberId?: string;
	name: string;
	email?: string;
	phone?: string;
	avatar?: string;
	color?: string;

	// Employment
	role: string;
	department?: string;
	skills?: string[];
	certifications?: string[];

	// Status
	status: "available" | "on-job" | "on-break" | "offline";
	isActive?: boolean;
	currentLocation?: Location;

	// Schedule
	schedule: TechnicianSchedule;

	// Audit
	createdAt: Date;
	updatedAt: Date;
};

// ============================================
// LEGACY COMPATIBILITY (for migration)
// ============================================

/** @deprecated Use Job with Date objects instead */
export type LegacyJob = {
	id: string;
	title: string;
	customer: string;
	startTime: string; // HH:MM format
	endTime: string; // HH:MM format
	status: "scheduled" | "in-progress" | "completed" | "cancelled";
	priority: "low" | "medium" | "high" | "urgent";
	location: string;
	address: string;
	lat: number;
	lng: number;
	description?: string;
	estimatedDuration?: string;
};
