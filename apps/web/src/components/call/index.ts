/**
 * Call Window Components
 *
 * Enhanced components for the CSR call window interface.
 *
 * Phase 1 Components:
 * - CallToolbar: Enhanced call controls with mute/hold/recording indicators
 * - CustomerAlertBanner: Critical customer alerts (past due, VIP, etc.)
 * - CustomerStatsBar: Sticky stats bar showing key metrics
 * - CallWrapUpDialog: End-of-call disposition and follow-up
 * - KeyboardShortcutsHelp: Shortcuts help panel
 * - QuickActionsPanel: CSR quick actions (new job, schedule, etc.)
 * - PreviousCallSummary: Previous call context display
 *
 * Phase 2 Components (AI-Powered):
 * - AISuggestionsWidget: AI next-best-action suggestions
 * - SentimentIndicator: Real-time customer sentiment
 * - ExtractedInfoPanel: Auto-extracted information from transcript
 * - SmartCallNotes: Enhanced notes with templates and AI summary
 *
 * Usage:
 * ```tsx
 * import {
 *   CallToolbar,
 *   CustomerAlertBanner,
 *   CustomerStatsBar,
 *   CallWrapUpDialog,
 *   KeyboardShortcutsHelp,
 *   QuickActionsPanel,
 *   PreviousCallSummary,
 *   AISuggestionsWidget,
 *   SentimentIndicator,
 *   ExtractedInfoPanel,
 *   SmartCallNotes,
 * } from "@/components/call";
 * ```
 */

// Phase 2 AI-powered components
export {
	AISuggestionsWidget,
	generateMockSuggestions,
} from "./ai-suggestions-widget";
// Core components
export { CallToolbar } from "./call-toolbar";
export { CallWrapUpDialog } from "./call-wrap-up-dialog";
export { CSRScheduleView } from "./csr-schedule-view";
export { OutgoingCallRinging } from "./outgoing-call-ringing";

// Enhanced Phase 1 components
export { CustomerAlertBanner } from "./customer-alert-banner";
export { CustomerSidebar } from "./customer-sidebar";
export { CustomerStatsBar } from "./customer-stats-bar";
export {
	CustomerStatusDot,
	CustomerStatusIndicator,
} from "./customer-status-indicator";
export {
	ExtractedInfoBadge,
	ExtractedInfoPanel,
} from "./extracted-info-panel";
export {
	KeyboardShortcutsButton,
	KeyboardShortcutsHelp,
} from "./keyboard-shortcuts-help";
export { PreviousCallSummary } from "./previous-call-summary";
export {
	FloatingQuickActions,
	QuickActionsBar,
	QuickActionsPanel,
} from "./quick-actions-panel";
export {
	LastCommunicationBadge,
	RecentCommunications,
} from "./recent-communications";
export { ScheduleTimeline } from "./schedule-timeline";
export {
	getSentimentLevel,
	getSentimentTrend,
	SentimentBadge,
	SentimentIndicator,
} from "./sentiment-indicator";
export { FloatingNotes, SmartCallNotes } from "./smart-call-notes";
export {
	CALL_QUICK_REPLIES,
	InlineQuickReplies,
	SmsQuickRepliesBar,
} from "./sms-quick-replies-bar";
export type {
	QuickReplyTemplate,
	TemplateContext,
} from "./sms-quick-replies-bar";
