/**
 * AI Module - Vercel AI SDK with Gateway Integration
 * Plus comprehensive AI agent infrastructure including:
 * - OpenTelemetry-style tracing and observability
 * - Tamper-evident audit trails
 * - Rubrik-style undo/rollback
 * - User feedback collection (RLHF/RLUF)
 * - Semantic memory with embeddings
 * - Multi-step planning with approval workflow
 * - Proactive analysis and insights
 */

// Action Approval - Owner-only approval for destructive AI actions
export {
	type ApprovalResult,
	approveAction,
	type CreatePendingActionInput,
	createPendingAction,
	type DestructiveActionType,
	type DestructiveToolMetadata,
	expireOldActions,
	getCompanyOwners,
	getDestructiveToolMetadata,
	getPendingAction,
	getPendingActionsForChat,
	getPendingActionsForCompany,
	isCompanyOwner,
	isDestructiveTool,
	markActionExecuted,
	markActionFailed,
	type PendingAction,
	type RiskLevel,
	rejectAction,
	shouldInterceptTool,
} from "./action-approval";
// Action Reverter - Rubrik-style selective rollback
export {
	type ActionSnapshot,
	batchRevert,
	createActionSnapshot,
	createBulkSnapshots,
	getEntityRevertHistory,
	getMessageSnapshots,
	getRevertableActions,
	previewRevert,
	type RevertResult,
	type RevertStatus,
	revertMessageActions,
	revertSnapshot,
	type SnapshotType,
} from "./action-reverter";
// Audit Trail - Tamper-evident logging
export {
	type AuditAction,
	type AuditContext,
	type AuditLogEntry,
	type AuditSeverity,
	createAuditLog,
	getAuditStatistics,
	getChatAuditTrail,
	getEntityAuditTrail,
	getHighSeverityAuditEntries,
	type ReversalRequest,
	recordReversal,
	verifyAuditLogIntegrity,
} from "./audit-trail";
// Core AI Configuration
export type { AIConfig, AIProvider } from "./config";
export { createAIProvider } from "./config";
// Feedback Service - User feedback and RLHF
export {
	exportCorrectionsForTraining,
	type FeedbackCategory,
	type FeedbackResponse,
	type FeedbackStatus,
	type FeedbackSubmission,
	type FeedbackType,
	flagResponse,
	getChatFeedbackSummary,
	getCompanyFeedbackAnalytics,
	getMessageFeedback,
	getPendingFeedbackReview,
	submitCorrection,
	submitFeedback,
	submitQuickFeedback,
	updateFeedbackStatus,
} from "./feedback-service";
// Memory Service - Semantic memory with embeddings
export {
	consolidateMemories,
	decayOldMemories,
	deleteMemory,
	extractMemoriesFromConversation,
	getEntityMemories,
	getMemoryStatistics,
	type MemoryEntry,
	type MemoryScope,
	type MemorySearchResult,
	type MemoryType,
	searchMemories,
	storeMemories,
	storeMemory,
	updateMemoryImportance,
} from "./memory-service";
// Planner - Multi-step planning with approval workflow
export {
	approvePlan,
	cancelPlan,
	createPlan,
	generatePlanFromDescription,
	getChatPlans,
	getPendingApprovalPlans,
	getPlan,
	getPlanStatistics,
	type Plan,
	type PlanExecutionResult,
	type PlanStatus,
	type PlanStep,
	rejectPlan,
	type StepStatus,
	type StepType,
	startPlanExecution,
	updatePlanProgress,
} from "./planner";
// Proactive Analyzer - Background analysis and insights
export {
	acknowledgeInsight,
	analyzeCustomers,
	analyzeRevenue,
	analyzeScheduling,
	createInsight,
	dismissInsight,
	getActiveInsights,
	getInsightStatistics,
	type Insight,
	type InsightCategory,
	type InsightPriority,
	type InsightResult,
	type InsightStatus,
	type InsightType,
	resolveInsight,
	runFullAnalysis,
} from "./proactive-analyzer";
// Tracing - OpenTelemetry-style trace and span management
export {
	calculateCost,
	createTraceContext,
	endSpan,
	generateTraceId,
	getDailyMetrics,
	getTraceSummary,
	recordSpanEvent,
	type SpanData,
	type SpanEvent,
	type SpanStatus,
	type SpanType,
	startSpan,
	type TraceContext,
} from "./tracing";
// Workflow Types
export type {
	AgentContext,
	AgentMessage,
	AgentResult,
	AgentRole,
	ToolDefinition,
	WorkflowContext,
	WorkflowDefinition,
	WorkflowResult,
	WorkflowStatus,
	WorkflowStep,
	WorkflowStepResult,
} from "./workflows";

// ==========================================
// NEW: ai-sdk-tools Integration (2024)
// ==========================================

export type { CachedTool, CacheOptions } from "@ai-sdk-tools/cache";
// Re-export types from ai-sdk-tools packages
export type {
	ChatSession as AIToolsChatSession,
	ConversationMessage as AIToolsConversationMessage,
	MemoryProvider as AIToolsMemoryProvider,
	WorkingMemory as AIToolsWorkingMemory,
} from "@ai-sdk-tools/memory";
// Semantic Memory Tools (for agent use)
// Communication Learning Tools (learn from customer interactions)
// External Data Tools (weather, traffic, GPS)
// Code Search Tools (building, plumbing, electrical codes)
// Proactive Learning System (auto-learn from interactions)
// Route Optimization Tools (directions and supplier finding)
// Inventory & Parts Tools
// Equipment History Tools
// Technician Matching Tools
// Pricing & Estimation Tools
// Smart Scheduling Tools
export {
	analyzeRecentCommunicationsTool,
	buildCustomerProfileTool,
	calculateEstimateTool,
	checkEquipmentWarrantyTool,
	checkPartsAvailabilityTool,
	checkWeatherForJobTool,
	extractCommunicationInsightsTool,
	findNearbySuppliersTool,
	findTechniciansBySkillsTool,
	geocodeAddressTool,
	getCallTranscriptTool,
	getCodeComplianceChecklistTool,
	getCustomerCommunicationHistoryTool,
	getEntityMemoriesTool,
	getEquipmentServiceHistoryTool,
	getLowStockAlertsTool,
	getPermitRequirementsTool,
	getPropertyConditionsTool,
	getPropertyEquipmentTool,
	getRouteTool,
	getTechnicianWorkloadTool,
	getTrafficConditionsTool,
	getWeatherAlertsTool,
	getWeatherForLocationTool,
	learnFromCompletedJobsTool,
	optimizeJobOrderTool,
	recallContextTool,
	searchBuildingCodesTool,
	searchCommunicationsFullTextTool,
	searchInventoryTool,
	searchMemoriesTool,
	searchPriceBookTool,
	searchVoicemailTranscriptsTool,
	storeMemoryTool,
	suggestTechnicianForJobTool,
} from "./agent-tools";
// Multi-Agent System (@ai-sdk-tools/agents)
export { Agent, type AgentConfig, createAgentSystem } from "./agents";

// Artifacts (@ai-sdk-tools/artifacts)
export {
	ARTIFACT_IDS,
	type ArtifactId,
	type ChartDataArtifact,
	// Types
	type CustomerCardArtifact,
	chartDataArtifact,
	chartDataSchema,
	// Artifact instances
	customerCardArtifact,
	// Schemas
	customerCardSchema,
	type EstimateArtifact,
	estimateArtifact,
	estimateArtifactSchema,
	getWriter,
	type InvoiceArtifact,
	invoiceArtifact,
	invoiceArtifactSchema,
	type JobSummaryArtifact,
	jobSummaryArtifact,
	jobSummarySchema,
	type ScheduleViewArtifact,
	scheduleViewArtifact,
	scheduleViewSchema,
	stratosArtifacts,
	type TableDataArtifact,
	tableDataArtifact,
	tableDataSchema,
} from "./artifacts";
// Caching Layer (@ai-sdk-tools/cache)
export {
	cacheAITool,
	cacheInvalidation,
	cacheKeyGenerators,
	createCachedToolFactory,
	shouldCachePredicates,
	stratosCache,
} from "./cache";
// Memory Provider (Supabase backend for @ai-sdk-tools/memory)
export {
	createSupabaseMemoryProvider,
	DEFAULT_WORKING_MEMORY_TEMPLATE,
} from "./memory-provider";
// Store (@ai-sdk-tools/store) - Chat state management
export {
	type ChatActions,
	createStratosChatStore,
	type StoreState,
	StratosChatProvider,
	// Types
	type StratosMessage,
	useAgentHandoff,
	// Custom hooks
	useAgentStatus,
	useArtifacts,
	useChatActions,
	useChatError,
	useChatId,
	useChatMessages,
	useChatReset,
	useChatStatus,
	useChatStore,
	useDataPart,
	useDataParts,
	useIsStreaming,
	useLastAssistantMessage,
	useMessageById,
	useMessageCount,
	useMessageCountByRole,
	useMessageIds,
	useRateLimit,
	useSelector,
	useSuggestions,
	useVirtualMessages,
} from "./store";
// Structured Output (generateObject/streamObject)
export {
	// Types
	type CustomerInsights,
	// Schemas
	customerInsightsSchema,
	type EmailDraft,
	emailDraftSchema,
	type FinancialSummary,
	financialSummarySchema,
	// Generator functions
	generateCustomerInsights,
	generateEmailDraft,
	generateFinancialSummary,
	generateScheduleOptimization,
	type JobAnalysis,
	jobAnalysisSchema,
	type ResponseSuggestions,
	responseSuggestionsSchema,
	type ScheduleOptimization,
	scheduleOptimizationSchema,
	streamJobAnalysis,
	streamResponseSuggestions,
} from "./structured-output";
