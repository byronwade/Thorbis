/**
 * Central exports for all Zustand stores
 *
 * All stores are consolidated in this directory for better organization.
 * Import stores from this file for consistency.
 */

// Feature stores (already in src/lib/stores/)
export { useActivityTimelineStore } from "./activity-timeline-store";
export { useCallPreferencesStore } from "./call-preferences-store";
export type { ChatStore } from "./chat-store";
export { chatSelectors, useChatStore } from "./chat-store";
export { useCommunicationStore } from "./communication-store";
export { useCustomersStore } from "./customers-store";
export { useEditModeStore } from "./edit-mode-store";
export { useEquipmentStore } from "./equipment-store";
export { useGanttSchedulerStore } from "./gantt-scheduler-store";
export { useJobCreationStore } from "./job-creation-store";
export { useJobDetailsLayoutStore } from "./job-details-layout-store";
export { useJobEditorStore } from "./job-editor-store";
export { useNotificationsStore } from "./notifications-store";
export { usePaymentsStore } from "./payments-store";
// Core stores (moved from src/lib/store/)
export type { PostsStore } from "./posts-store";
export { postsSelectors, usePostsStore } from "./posts-store";
export { usePriceBookStore } from "./pricebook-store";
export { useRecentCustomersStore } from "./recent-customers-store";
export { reportingSelectors, useReportingStore } from "./reporting-store";
export { useRoleStore } from "./role-store";
// Schedule stores (moved from src/stores/)
export { useScheduleStore } from "./schedule-store";
export { useScheduleViewStore } from "./schedule-view-store";
export { useSidebarStateStore } from "./sidebar-state-store";
export { useTranscriptStore } from "./transcript-store";
export type { ExtractState, Store, StoreActions, StoreState } from "./types";
export type { UIStore } from "./ui-store";
export { uiSelectors, useUIStore } from "./ui-store";
export type { UserStore } from "./user-store";
export { userSelectors, useUserStore } from "./user-store";
export { useViewStore, type ViewFilters, type ZoomLevel } from "./view-store";
export { useSetWorkView, useWorkView, useWorkViewStore } from "./work-view-store";

/**
 * Reset all stores to initial state
 * Useful for logout or clearing all state
 */
export const resetAllStores = () => {
	const stores = [
		require("./user-store").useUserStore,
		require("./ui-store").useUIStore,
		require("./posts-store").usePostsStore,
		require("./chat-store").useChatStore,
	];

	for (const store of stores) {
		store.getState().reset?.();
	}
};
