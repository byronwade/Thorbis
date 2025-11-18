/**
 * Message UI Store - Manages UI state for messaging interface
 *
 * Features:
 * - Sidebar visibility
 * - Active view modes
 * - Modal states
 * - Layout preferences
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MessageView =
	| "inbox"
	| "unassigned"
	| "assigned"
	| "resolved"
	| "snoozed"
	| "all";
export type ConversationPanelView = "info" | "notes" | "activity";

interface MessageUIState {
	// Sidebar and panels
	isCustomerPanelOpen: boolean;
	conversationPanelView: ConversationPanelView;

	// Layout
	threadListWidth: number; // In pixels, for resizable panels
	customerPanelWidth: number;

	// Views
	activeView: MessageView;

	// Modals and dialogs
	isNewMessageModalOpen: boolean;
	isTemplateManagerOpen: boolean;
	isAssignmentDialogOpen: boolean;
	isCommandPaletteOpen: boolean;

	// Mobile responsiveness
	isMobile: boolean;
	mobileView: "list" | "conversation" | "panel";

	// Actions - Sidebar and panels
	toggleCustomerPanel: () => void;
	setCustomerPanelOpen: (open: boolean) => void;
	setConversationPanelView: (view: ConversationPanelView) => void;

	// Actions - Layout
	setThreadListWidth: (width: number) => void;
	setCustomerPanelWidth: (width: number) => void;
	resetLayout: () => void;

	// Actions - Views
	setActiveView: (view: MessageView) => void;

	// Actions - Modals
	setNewMessageModalOpen: (open: boolean) => void;
	setTemplateManagerOpen: (open: boolean) => void;
	setAssignmentDialogOpen: (open: boolean) => void;
	setCommandPaletteOpen: (open: boolean) => void;

	// Actions - Mobile
	setIsMobile: (isMobile: boolean) => void;
	setMobileView: (view: "list" | "conversation" | "panel") => void;
}

const DEFAULT_THREAD_LIST_WIDTH = 280;
const DEFAULT_CUSTOMER_PANEL_WIDTH = 320;

export const useMessageUIStore = create<MessageUIState>()(
	persist(
		(set) => ({
			// Initial state - Sidebar and panels
			isCustomerPanelOpen: true,
			conversationPanelView: "info",

			// Layout
			threadListWidth: DEFAULT_THREAD_LIST_WIDTH,
			customerPanelWidth: DEFAULT_CUSTOMER_PANEL_WIDTH,

			// Views
			activeView: "inbox",

			// Modals
			isNewMessageModalOpen: false,
			isTemplateManagerOpen: false,
			isAssignmentDialogOpen: false,
			isCommandPaletteOpen: false,

			// Mobile
			isMobile: false,
			mobileView: "list",

			// Actions - Sidebar and panels
			toggleCustomerPanel: () =>
				set((state) => ({
					isCustomerPanelOpen: !state.isCustomerPanelOpen,
				})),

			setCustomerPanelOpen: (open) => set({ isCustomerPanelOpen: open }),

			setConversationPanelView: (view) => set({ conversationPanelView: view }),

			// Actions - Layout
			setThreadListWidth: (width) =>
				set({
					threadListWidth: Math.max(200, Math.min(width, 400)), // Clamp between 200-400px
				}),

			setCustomerPanelWidth: (width) =>
				set({
					customerPanelWidth: Math.max(280, Math.min(width, 500)), // Clamp between 280-500px
				}),

			resetLayout: () =>
				set({
					threadListWidth: DEFAULT_THREAD_LIST_WIDTH,
					customerPanelWidth: DEFAULT_CUSTOMER_PANEL_WIDTH,
					isCustomerPanelOpen: true,
				}),

			// Actions - Views
			setActiveView: (view) => set({ activeView: view }),

			// Actions - Modals
			setNewMessageModalOpen: (open) => set({ isNewMessageModalOpen: open }),

			setTemplateManagerOpen: (open) => set({ isTemplateManagerOpen: open }),

			setAssignmentDialogOpen: (open) => set({ isAssignmentDialogOpen: open }),

			setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

			// Actions - Mobile
			setIsMobile: (isMobile) => set({ isMobile }),

			setMobileView: (view) => set({ mobileView: view }),
		}),
		{
			name: "message-ui-storage",
			// Only persist layout preferences and view states
			partialize: (state) => ({
				threadListWidth: state.threadListWidth,
				customerPanelWidth: state.customerPanelWidth,
				isCustomerPanelOpen: state.isCustomerPanelOpen,
				conversationPanelView: state.conversationPanelView,
				activeView: state.activeView,
			}),
		},
	),
);
