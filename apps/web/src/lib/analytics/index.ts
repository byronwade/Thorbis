/**
 * Analytics Module
 *
 * Centralized analytics tracking for the entire application.
 * Provides type-safe event tracking using Vercel Analytics and internal tracking.
 *
 * @example
 * // Vercel Analytics
 * import { trackEvent } from "@/lib/analytics";
 * trackEvent({ name: "job.created", properties: { jobId: "123" } });
 *
 * // Internal API Call Tracking
 * import { withApiTracking } from "@/lib/analytics";
 * export const GET = withApiTracking(async (request) => { ... });
 *
 * // Server Action Tracking
 * import { withJobsTracking } from "@/lib/analytics";
 * export const createJob = withJobsTracking(async (data) => { ... });
 */

// Original Vercel Analytics exports
export * from "./client";
export * from "./hooks";
export * from "./server";
export * from "./types";

// ============================================
// Internal Analytics Tracking (New)
// ============================================

// API Call Tracking
export {
	withApiTracking,
	startApiCall,
	getOrCreateTraceId,
	getApiCallStats,
	getRecentApiCalls,
	getSlowApiCalls,
	getApiErrorRates,
	logApiCallBatched,
} from "./api-call-tracker";

// Server Action Tracking
export {
	withActionTracking,
	startActionExecution,
	createCategoryTracker,
	withJobsTracking,
	withInvoicesTracking,
	withEstimatesTracking,
	withPaymentsTracking,
	withCustomersTracking,
	withPropertiesTracking,
	withEquipmentTracking,
	withContractsTracking,
	withTeamTracking,
	withCommunicationsTracking,
	withSettingsTracking,
	withAuthTracking,
	withAITracking,
	getActionStats,
	getRecentActions,
	getFailedActions,
	getSlowActions,
	getActionVolumeByCategory,
} from "./action-tracker";

// Feature Usage Tracking (Client-Side)
export {
	trackFeature,
	trackClick,
	trackSubmit,
	trackToggle,
	trackPageView,
	trackSearch,
	trackWebVitals,
	useFeatureTracker,
	usePageViewTracker,
} from "./feature-tracker";

// Communication Analytics
export {
	trackEmailSent,
	trackEmailDelivered,
	trackEmailOpen,
	trackEmailClick,
	trackEmailBounce,
	trackEmailComplaint,
	trackEmailUnsubscribe,
	trackEmailReply,
	trackSmsSent,
	trackSmsDelivered,
	trackSmsFailed,
	trackSmsReply,
	trackSmsOptOut,
	trackCallInitiated,
	trackCallConnected,
	trackCallCompleted,
	trackCallFailed,
	trackCallVoicemail,
	trackCallNoAnswer,
	getCommunicationStats,
	getEmailEngagement,
	getTopEmailTemplates,
	getCallStats,
} from "./communication-tracker";

// AI/LLM Tracking
export {
	trackAIUsage,
	startAICall,
	withAITracking as withAIUsageTracking,
	trackOpenAICall,
	trackAnthropicCall,
	trackGoogleAICall,
	calculateTokenCost,
	getAIUsageSummary,
	getAICostByDay,
	getToolCallStats,
	getApprovalStats,
	getRecentAIErrors,
} from "./ai-tracker";
