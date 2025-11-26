/**
 * Email Campaign Types
 *
 * Type definitions for the email marketing campaign system.
 * Maps to database schema created in create_email_campaigns_v2 migration.
 */

// ============================================================================
// Enums (matching database enums)
// ============================================================================

export type EmailCampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled";

export type EmailCampaignAudienceType = "all_users" | "all_companies" | "waitlist" | "segment" | "custom";

export type EmailSendStatus =
	| "pending"
	| "queued"
	| "sent"
	| "delivered"
	| "opened"
	| "clicked"
	| "bounced"
	| "complained"
	| "unsubscribed"
	| "failed";

// ============================================================================
// Main Campaign Entity
// ============================================================================

export type EmailCampaign = {
	id: string;
	name: string;
	subject: string;
	previewText?: string;
	templateId?: string;
	templateData?: Record<string, unknown>;
	htmlContent?: string;
	plainTextContent?: string;
	status: EmailCampaignStatus;
	scheduledFor?: string;
	sendingStartedAt?: string;
	sentAt?: string;
	completedAt?: string;

	// Audience targeting
	audienceType: EmailCampaignAudienceType;
	audienceFilter?: AudienceFilter;

	// Stats
	totalRecipients: number;
	sentCount: number;
	deliveredCount: number;
	openedCount: number;
	uniqueOpens: number;
	clickedCount: number;
	uniqueClicks: number;
	bouncedCount: number;
	complainedCount: number;
	unsubscribedCount: number;
	failedCount: number;
	revenueAttributed: number;
	conversionsCount: number;

	// Sender configuration
	fromName: string;
	fromEmail: string;
	replyTo?: string;
	tags: string[];
	notes?: string;

	// Metadata
	createdBy?: string;
	createdAt: string;
	updatedAt: string;
};

// ============================================================================
// Campaign Send (Individual Recipient)
// ============================================================================

export type EmailCampaignSend = {
	id: string;
	campaignId: string;
	recipientEmail: string;
	recipientName?: string;
	recipientType?: "user" | "company" | "waitlist" | "custom";
	recipientId?: string;
	status: EmailSendStatus;
	resendId?: string;

	// Timestamps
	sentAt?: string;
	deliveredAt?: string;
	firstOpenedAt?: string;
	lastOpenedAt?: string;
	firstClickedAt?: string;
	lastClickedAt?: string;
	bouncedAt?: string;
	complainedAt?: string;
	unsubscribedAt?: string;

	// Engagement stats
	openCount: number;
	clickCount: number;
	linksClicked: LinkClick[];

	// Error info
	errorMessage?: string;
	errorCode?: string;

	// Metadata
	metadata?: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
};

export type LinkClick = {
	url: string;
	clickedAt: string;
	count: number;
};

// ============================================================================
// Campaign Link Tracking
// ============================================================================

export type EmailCampaignLink = {
	id: string;
	campaignId: string;
	originalUrl: string;
	trackedUrl: string;
	linkText?: string;
	position?: number;
	totalClicks: number;
	uniqueClicks: number;
	createdAt: string;
};

// ============================================================================
// Audience Segments
// ============================================================================

export type EmailAudienceSegment = {
	id: string;
	name: string;
	description?: string;
	audienceType: EmailCampaignAudienceType;
	filterCriteria: AudienceFilter;
	recipientCount: number;
	isSystem: boolean;
	createdBy?: string;
	createdAt: string;
	updatedAt: string;
};

export type AudienceFilter = {
	// User filters
	userRoles?: ("owner" | "admin" | "manager" | "technician")[];
	userStatuses?: ("active" | "pending" | "suspended")[];

	// Company filters
	companyPlans?: ("starter" | "professional" | "enterprise")[];
	companyStatuses?: ("active" | "trial" | "suspended" | "cancelled")[];
	industries?: string[];

	// Date filters
	createdAfter?: string;
	createdBefore?: string;
	lastLoginAfter?: string;
	lastLoginBefore?: string;

	// Waitlist filters
	waitlistSource?: string;
	waitlistTags?: string[];

	// Custom email list
	customEmails?: string[];

	// Exclusions
	excludeUnsubscribed?: boolean;
	excludeBounced?: boolean;
	excludeComplained?: boolean;
};

// ============================================================================
// Campaign Builder Types
// ============================================================================

export type CampaignDraft = {
	name: string;
	subject: string;
	previewText: string;
	templateId?: string;
	templateData?: Record<string, unknown>;
	htmlContent?: string;
	plainTextContent?: string;
	audienceType: EmailCampaignAudienceType;
	audienceFilter: AudienceFilter;
	fromName: string;
	fromEmail: string;
	replyTo?: string;
	tags: string[];
	notes?: string;
	scheduledFor?: string;
};

export type CampaignBuilderStep = "details" | "content" | "audience" | "review";

// ============================================================================
// Email Template Reference
// ============================================================================

export type EmailTemplate = {
	id: string;
	name: string;
	description?: string;
	category: "marketing" | "transactional" | "notification" | "waitlist";
	previewUrl?: string;
	variables: TemplateVariable[];
};

export type TemplateVariable = {
	name: string;
	label: string;
	type: "text" | "number" | "url" | "image" | "date" | "rich_text";
	required: boolean;
	defaultValue?: string;
	placeholder?: string;
};

// ============================================================================
// Analytics Types
// ============================================================================

export type CampaignAnalytics = {
	campaignId: string;
	deliveryRate: number;
	openRate: number;
	clickRate: number;
	bounceRate: number;
	unsubscribeRate: number;
	complaintRate: number;
	conversionRate: number;
	revenuePerRecipient: number;
	timeSeriesData: TimeSeriesDataPoint[];
	topLinks: TopLink[];
	deviceBreakdown: DeviceBreakdown;
	locationBreakdown: LocationBreakdown[];
};

export type TimeSeriesDataPoint = {
	timestamp: string;
	opens: number;
	clicks: number;
	unsubscribes: number;
};

export type TopLink = {
	url: string;
	linkText?: string;
	clicks: number;
	uniqueClicks: number;
};

export type DeviceBreakdown = {
	desktop: number;
	mobile: number;
	tablet: number;
	unknown: number;
};

export type LocationBreakdown = {
	country: string;
	region?: string;
	count: number;
	percentage: number;
};

// ============================================================================
// Waitlist Integration Types
// ============================================================================

export type WaitlistSubscriber = {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	createdAt: string;
	unsubscribed: boolean;
	tags?: string[];
	source?: string;
	metadata?: Record<string, unknown>;
};

export type WaitlistStats = {
	totalSubscribers: number;
	activeSubscribers: number;
	unsubscribedCount: number;
	recentSignups: number; // Last 7 days
	growthRate: number; // Percentage
};

// ============================================================================
// API Response Types
// ============================================================================

export type CampaignListResponse = {
	campaigns: EmailCampaign[];
	total: number;
	page: number;
	pageSize: number;
};

export type CampaignSendResponse = {
	success: boolean;
	campaignId: string;
	recipientCount: number;
	estimatedCompletionTime?: string;
	errors?: string[];
};

export type AudiencePreviewResponse = {
	estimatedRecipients: number;
	sampleRecipients: {
		email: string;
		name?: string;
		type: string;
	}[];
};
