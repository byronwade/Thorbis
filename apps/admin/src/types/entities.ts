/**
 * Admin Entity Types
 *
 * Type definitions for admin panel entities.
 */

/**
 * Company entity - represents a contractor company on the Stratos platform
 */
export type Company = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	plan: "starter" | "professional" | "enterprise";
	status: "active" | "trial" | "suspended" | "cancelled";
	usersCount: number;
	jobsCount?: number;
	monthlyRevenue?: number;
	createdAt: string;
	updatedAt?: string;
	trialEndsAt?: string;
	industry?: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
	};
};

/**
 * User entity - represents a user on the Stratos platform
 */
export type User = {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	role: "owner" | "admin" | "manager" | "technician";
	status: "active" | "pending" | "suspended" | "inactive";
	companyId?: string;
	companyName?: string;
	lastLogin?: string;
	createdAt: string;
	avatarUrl?: string;
};

/**
 * Subscription entity - represents a billing subscription
 */
export type Subscription = {
	id: string;
	companyId: string;
	companyName: string;
	plan: "starter" | "professional" | "enterprise";
	status: "active" | "trialing" | "past_due" | "cancelled" | "paused";
	amount: number;
	interval: "monthly" | "yearly";
	currentPeriodStart: string;
	currentPeriodEnd: string;
	cancelAtPeriodEnd?: boolean;
	createdAt: string;
};

/**
 * Support Ticket entity
 */
export type SupportTicket = {
	id: string;
	ticketNumber: string;
	subject: string;
	description?: string;
	status: "open" | "in_progress" | "resolved" | "closed";
	priority: "low" | "medium" | "high" | "urgent";
	companyId?: string;
	companyName?: string;
	userId?: string;
	userName?: string;
	assignedTo?: string;
	createdAt: string;
	updatedAt?: string;
	resolvedAt?: string;
};

/**
 * Communication/Message entity
 */
export type Message = {
	id: string;
	type: "email" | "sms" | "call";
	direction: "inbound" | "outbound";
	subject?: string;
	preview?: string;
	from: string;
	to: string;
	companyId?: string;
	companyName?: string;
	status: "sent" | "delivered" | "read" | "failed";
	createdAt: string;
};

/**
 * Call entity
 */
export type Call = {
	id: string;
	direction: "inbound" | "outbound";
	from: string;
	to: string;
	duration?: number; // in seconds
	status: "completed" | "missed" | "voicemail" | "busy";
	recordingUrl?: string;
	companyId?: string;
	companyName?: string;
	createdAt: string;
};

/**
 * Unified Admin Communication entity
 * Used for the unified inbox view showing all communication types
 */
export type AdminCommunication = {
	id: string;
	type: "email" | "sms" | "call" | "voicemail" | "ticket";
	direction: "inbound" | "outbound";
	subject?: string;
	preview?: string;
	from?: string;
	to?: string;
	companyId?: string;
	companyName?: string;
	userId?: string;
	userName?: string;
	status: "new" | "unread" | "read" | "sent" | "delivered" | "failed" | "resolved";
	priority?: "low" | "medium" | "high" | "urgent";
	duration?: number; // for calls, in seconds
	recordingUrl?: string; // for calls/voicemails
	createdAt: string;
	updatedAt?: string;
};
