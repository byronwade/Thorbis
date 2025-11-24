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

// Core AI Configuration
export type { AIConfig, AIProvider } from "./config";
export { createAIProvider } from "./config";

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

// Tracing - OpenTelemetry-style trace and span management
export {
  type SpanType,
  type SpanStatus,
  type TraceContext,
  type SpanData,
  type SpanEvent,
  generateTraceId,
  createTraceContext,
  calculateCost,
  startSpan,
  endSpan,
  recordSpanEvent,
  getTraceSummary,
  getDailyMetrics,
} from "./tracing";

// Audit Trail - Tamper-evident logging
export {
  type AuditAction,
  type AuditSeverity,
  type AuditContext,
  type AuditLogEntry,
  type ReversalRequest,
  createAuditLog,
  verifyAuditLogIntegrity,
  getEntityAuditTrail,
  getChatAuditTrail,
  getHighSeverityAuditEntries,
  recordReversal,
  getAuditStatistics,
} from "./audit-trail";

// Action Reverter - Rubrik-style selective rollback
export {
  type SnapshotType,
  type RevertStatus,
  type ActionSnapshot,
  type RevertResult,
  createActionSnapshot,
  createBulkSnapshots,
  getMessageSnapshots,
  getRevertableActions,
  revertSnapshot,
  revertMessageActions,
  previewRevert,
  getEntityRevertHistory,
  batchRevert,
} from "./action-reverter";

// Feedback Service - User feedback and RLHF
export {
  type FeedbackType,
  type FeedbackCategory,
  type FeedbackStatus,
  type FeedbackSubmission,
  type FeedbackResponse,
  submitFeedback,
  submitQuickFeedback,
  submitCorrection,
  flagResponse,
  getMessageFeedback,
  getChatFeedbackSummary,
  getCompanyFeedbackAnalytics,
  getPendingFeedbackReview,
  updateFeedbackStatus,
  exportCorrectionsForTraining,
} from "./feedback-service";

// Memory Service - Semantic memory with embeddings
export {
  type MemoryType,
  type MemoryScope,
  type MemoryEntry,
  type MemorySearchResult,
  storeMemory,
  storeMemories,
  searchMemories,
  getEntityMemories,
  updateMemoryImportance,
  deleteMemory,
  extractMemoriesFromConversation,
  getMemoryStatistics,
  consolidateMemories,
  decayOldMemories,
} from "./memory-service";

// Planner - Multi-step planning with approval workflow
export {
  type PlanStatus,
  type StepStatus,
  type StepType,
  type PlanStep,
  type Plan,
  type PlanExecutionResult,
  createPlan,
  getPlan,
  approvePlan,
  rejectPlan,
  updatePlanProgress,
  startPlanExecution,
  cancelPlan,
  getChatPlans,
  getPendingApprovalPlans,
  getPlanStatistics,
  generatePlanFromDescription,
} from "./planner";

// Proactive Analyzer - Background analysis and insights
export {
  type InsightType,
  type InsightPriority,
  type InsightStatus,
  type InsightCategory,
  type Insight,
  type InsightResult,
  createInsight,
  getActiveInsights,
  acknowledgeInsight,
  dismissInsight,
  resolveInsight,
  analyzeRevenue,
  analyzeCustomers,
  analyzeScheduling,
  runFullAnalysis,
  getInsightStatistics,
} from "./proactive-analyzer";

// Action Approval - Owner-only approval for destructive AI actions
export {
  type PendingAction,
  type CreatePendingActionInput,
  type ApprovalResult,
  type DestructiveToolMetadata,
  type DestructiveActionType,
  type RiskLevel,
  isCompanyOwner,
  getCompanyOwners,
  createPendingAction,
  getPendingActionsForChat,
  getPendingActionsForCompany,
  getPendingAction,
  approveAction,
  rejectAction,
  markActionExecuted,
  markActionFailed,
  expireOldActions,
  shouldInterceptTool,
  isDestructiveTool,
  getDestructiveToolMetadata,
} from "./action-approval";

// ==========================================
// NEW: ai-sdk-tools Integration (2024)
// ==========================================

// Memory Provider (Supabase backend for @ai-sdk-tools/memory)
export {
	createSupabaseMemoryProvider,
	DEFAULT_WORKING_MEMORY_TEMPLATE,
} from "./memory-provider";

// Multi-Agent System (@ai-sdk-tools/agents)
export { createAgentSystem, Agent, type AgentConfig } from "./agents";

// Semantic Memory Tools (for agent use)
export {
	storeMemoryTool,
	searchMemoriesTool,
	getEntityMemoriesTool,
	recallContextTool,
} from "./agent-tools";

// Communication Learning Tools (learn from customer interactions)
export {
	searchCommunicationsFullTextTool,
	getCallTranscriptTool,
	searchVoicemailTranscriptsTool,
	getCustomerCommunicationHistoryTool,
	extractCommunicationInsightsTool,
} from "./agent-tools";

// External Data Tools (weather, traffic, GPS)
export {
	getWeatherForLocationTool,
	checkWeatherForJobTool,
	getWeatherAlertsTool,
	getTrafficConditionsTool,
	geocodeAddressTool,
	getPropertyConditionsTool,
} from "./agent-tools";

// Code Search Tools (building, plumbing, electrical codes)
export {
	searchBuildingCodesTool,
	getPermitRequirementsTool,
	getCodeComplianceChecklistTool,
} from "./agent-tools";

// Proactive Learning System (auto-learn from interactions)
export {
	analyzeRecentCommunicationsTool,
	learnFromCompletedJobsTool,
	buildCustomerProfileTool,
} from "./agent-tools";

// Route Optimization Tools (directions and supplier finding)
export {
	getRouteTool,
	findNearbySuppliersTool,
} from "./agent-tools";

// Inventory & Parts Tools
export {
	searchInventoryTool,
	checkPartsAvailabilityTool,
	getLowStockAlertsTool,
} from "./agent-tools";

// Equipment History Tools
export {
	getPropertyEquipmentTool,
	getEquipmentServiceHistoryTool,
	checkEquipmentWarrantyTool,
} from "./agent-tools";

// Technician Matching Tools
export {
	findTechniciansBySkillsTool,
	getTechnicianWorkloadTool,
} from "./agent-tools";

// Pricing & Estimation Tools
export {
	searchPriceBookTool,
	calculateEstimateTool,
} from "./agent-tools";

// Smart Scheduling Tools
export {
	suggestTechnicianForJobTool,
	optimizeJobOrderTool,
} from "./agent-tools";

// Caching Layer (@ai-sdk-tools/cache)
export {
	cacheAITool,
	createCachedToolFactory,
	stratosCache,
	cacheKeyGenerators,
	cacheInvalidation,
	shouldCachePredicates,
} from "./cache";

// Artifacts (@ai-sdk-tools/artifacts)
export {
	// Schemas
	customerCardSchema,
	jobSummarySchema,
	invoiceArtifactSchema,
	scheduleViewSchema,
	chartDataSchema,
	tableDataSchema,
	estimateArtifactSchema,
	// Artifact instances
	customerCardArtifact,
	jobSummaryArtifact,
	invoiceArtifact,
	scheduleViewArtifact,
	chartDataArtifact,
	tableDataArtifact,
	estimateArtifact,
	stratosArtifacts,
	ARTIFACT_IDS,
	getWriter,
	// Types
	type CustomerCardArtifact,
	type JobSummaryArtifact,
	type InvoiceArtifact,
	type ScheduleViewArtifact,
	type ChartDataArtifact,
	type TableDataArtifact,
	type EstimateArtifact,
	type ArtifactId,
} from "./artifacts";

// Structured Output (generateObject/streamObject)
export {
	// Schemas
	customerInsightsSchema,
	jobAnalysisSchema,
	scheduleOptimizationSchema,
	financialSummarySchema,
	emailDraftSchema,
	responseSuggestionsSchema,
	// Generator functions
	generateCustomerInsights,
	streamJobAnalysis,
	generateScheduleOptimization,
	generateFinancialSummary,
	generateEmailDraft,
	streamResponseSuggestions,
	// Types
	type CustomerInsights,
	type JobAnalysis,
	type ScheduleOptimization,
	type FinancialSummary,
	type EmailDraft,
	type ResponseSuggestions,
} from "./structured-output";

// Re-export types from ai-sdk-tools packages
export type {
	MemoryProvider as AIToolsMemoryProvider,
	WorkingMemory as AIToolsWorkingMemory,
	ConversationMessage as AIToolsConversationMessage,
	ChatSession as AIToolsChatSession,
} from "@ai-sdk-tools/memory";

export type { CachedTool, CacheOptions } from "@ai-sdk-tools/cache";

// Store (@ai-sdk-tools/store) - Chat state management
export {
	createStratosChatStore,
	StratosChatProvider,
	useChatStore,
	useChatMessages,
	useChatStatus,
	useChatError,
	useChatId,
	useChatActions,
	useChatReset,
	useMessageById,
	useMessageIds,
	useMessageCount,
	useVirtualMessages,
	useSelector,
	useDataPart,
	useDataParts,
	// Custom hooks
	useAgentStatus,
	useAgentHandoff,
	useRateLimit,
	useSuggestions,
	useLastAssistantMessage,
	useMessageCountByRole,
	useIsStreaming,
	useArtifacts,
	// Types
	type StratosMessage,
	type StoreState,
	type ChatActions,
} from "./store";
