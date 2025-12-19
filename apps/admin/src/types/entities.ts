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
	email?: string;
	owner_email?: string;
	phone?: string;
	owner_phone?: string;
	plan: "free" | "starter" | "professional" | "enterprise" | string;
	subscription_tier?: string;
	status: "active" | "trial" | "suspended" | "cancelled" | string;
	stripe_subscription_status?: string;
	users_count?: number;
	usersCount?: number;
	jobs_count?: number;
	jobsCount?: number;
	invoices_count?: number;
	total_revenue?: number;
	monthlyRevenue?: number;
	created_at?: string;
	createdAt?: string;
	updated_at?: string;
	updatedAt?: string;
	trial_ends_at?: string;
	trialEndsAt?: string;
	industry?: string;
	website?: string;
	logo_url?: string;
	timezone?: string;
	address?: {
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
	};
	// Stripe fields
	stripe_customer_id?: string;
	stripe_subscription_id?: string;
	subscription_current_period_start?: string;
	subscription_current_period_end?: string;
	subscription_cancel_at_period_end?: boolean;
	// Company memberships
	memberships?: CompanyMembership[];
};

/**
 * Company membership - represents a user's role in a company
 */
export type CompanyMembership = {
	id: string;
	user_id: string;
	company_id: string;
	role_id?: string;
	status: "active" | "invited" | "suspended" | "deleted";
	created_at: string;
	updated_at?: string;
	// Joined data
	user?: User;
	role?: {
		id: string;
		name: string;
		color?: string;
	};
};

/**
 * Full company details with all relations (for detail pages)
 */
export type CompanyWithDetails = Company & {
	memberships: CompanyMembership[];
	subscription?: Subscription;
	stats?: {
		users_count: number;
		jobs_count: number;
		invoices_count: number;
		total_revenue: number;
	};
};

/**
 * User entity - represents a user on the Stratos platform
 */
export type User = {
	id: string;
	email: string;
	first_name?: string;
	firstName?: string;
	last_name?: string;
	lastName?: string;
	full_name?: string;
	fullName?: string;
	phone?: string;
	role?: "owner" | "admin" | "manager" | "technician" | string;
	status?: "active" | "pending" | "suspended" | "inactive" | "deleted" | string;
	company_id?: string;
	companyId?: string;
	company_name?: string;
	companyName?: string;
	last_sign_in_at?: string;
	lastLogin?: string;
	created_at?: string;
	createdAt?: string;
	updated_at?: string;
	avatar_url?: string;
	avatarUrl?: string;
	deleted_at?: string;
	// Company memberships
	memberships?: CompanyMembership[];
};

/**
 * User with full details for admin views
 */
export type UserWithDetails = User & {
	companies: Array<{
		company_id: string;
		company_name: string;
		role?: string;
		status: string;
	}>;
};

/**
 * Subscription entity - represents a billing subscription
 */
export type Subscription = {
	id: string;
	companyId?: string;
	company_id?: string;
	companyName?: string;
	company_name?: string;
	plan: "free" | "starter" | "professional" | "enterprise" | string;
	subscription_tier?: string;
	status: "active" | "trialing" | "past_due" | "cancelled" | "paused" | "incomplete" | "incomplete_expired" | string;
	stripe_subscription_status?: string;
	amount?: number;
	interval?: "monthly" | "yearly" | "month" | "year";
	currentPeriodStart?: string;
	current_period_start?: string;
	subscription_current_period_start?: string;
	currentPeriodEnd?: string;
	current_period_end?: string;
	subscription_current_period_end?: string;
	cancelAtPeriodEnd?: boolean;
	cancel_at_period_end?: boolean;
	subscription_cancel_at_period_end?: boolean;
	createdAt?: string;
	created_at?: string;
	updatedAt?: string;
	updated_at?: string;
	// Stripe fields
	stripe_customer_id?: string;
	stripe_subscription_id?: string;
	stripe_price_id?: string;
	// Trial fields
	trial_start?: string;
	trial_end?: string;
	trial_ends_at?: string;
	// Usage and metrics
	users_count?: number;
	jobs_count?: number;
	invoices_count?: number;
	total_revenue?: number;
};

/**
 * Subscription with full details for admin views
 */
export type SubscriptionWithDetails = Subscription & {
	company?: Company;
	invoices?: Array<{
		id: string;
		amount: number;
		status: string;
		created_at: string;
		paid_at?: string;
	}>;
	usage?: {
		users: number;
		jobs: number;
		storage_gb: number;
	};
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
