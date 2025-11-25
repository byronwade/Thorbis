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
 * } from "@/components/call-window";
 * ```
 */

// Core components
export { CallToolbar } from "./call-toolbar";
export { CustomerSidebar } from "./customer-sidebar";
export { CSRScheduleView } from "./csr-schedule-view";
export { ScheduleTimeline } from "./schedule-timeline";

// Enhanced Phase 1 components
export { CustomerAlertBanner } from "./customer-alert-banner";
export { CustomerStatsBar } from "./customer-stats-bar";
export { CallWrapUpDialog } from "./call-wrap-up-dialog";
export {
	KeyboardShortcutsHelp,
	KeyboardShortcutsButton,
} from "./keyboard-shortcuts-help";
export {
	QuickActionsPanel,
	QuickActionsBar,
	FloatingQuickActions,
} from "./quick-actions-panel";
export { PreviousCallSummary } from "./previous-call-summary";

// Phase 2 AI-powered components
export {
	AISuggestionsWidget,
	generateMockSuggestions,
} from "./ai-suggestions-widget";
export {
	SentimentIndicator,
	SentimentBadge,
	getSentimentLevel,
	getSentimentTrend,
} from "./sentiment-indicator";
export {
	ExtractedInfoPanel,
	ExtractedInfoBadge,
} from "./extracted-info-panel";
export { SmartCallNotes, FloatingNotes } from "./smart-call-notes";
