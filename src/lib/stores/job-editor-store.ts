/**
 * Job Editor Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 *
 * Manages:
 * - Active tab navigation
 * - Edit mode state
 * - Unsaved changes tracking
 * - Auto-save status
 * - Right sidebar visibility
 * - Command palette state
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Tab type definition
export type JobTab =
	| "overview"
	| "team-schedule"
	| "financials"
	| "materials"
	| "photos-docs"
	| "activity"
	| "equipment";

// Auto-save status
export type SaveStatus = "idle" | "saving" | "saved" | "error";

// Define store state type
type JobEditorStore = {
	// Tab Navigation
	activeTab: JobTab;
	setActiveTab: (tab: JobTab) => void;

	// Edit Mode
	isEditMode: boolean;
	toggleEditMode: () => void;
	setEditMode: (mode: boolean) => void;

	// Changes Tracking
	hasUnsavedChanges: boolean;
	setHasUnsavedChanges: (hasChanges: boolean) => void;

	// Auto-save Status
	saveStatus: SaveStatus;
	setSaveStatus: (status: SaveStatus) => void;
	saveError: string | null;
	setSaveError: (error: string | null) => void;

	// Right Sidebar
	isRightSidebarOpen: boolean;
	toggleRightSidebar: () => void;
	setRightSidebarOpen: (isOpen: boolean) => void;

	// Command Palette
	isCommandPaletteOpen: boolean;
	toggleCommandPalette: () => void;
	setCommandPaletteOpen: (isOpen: boolean) => void;

	// Mobile Bottom Navigation
	isMobileNavOpen: boolean;
	toggleMobileNav: () => void;
	setMobileNavOpen: (isOpen: boolean) => void;

	// Content State (for editor)
	editorContent: any | null;
	setEditorContent: (content: any) => void;
	originalContent: any | null;
	setOriginalContent: (content: any) => void;

	// Loading States
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;

	// Reset Functions
	resetChanges: () => void;
	reset: () => void;
};

// Initial state
const initialState = {
	activeTab: "overview" as JobTab,
	isEditMode: false,
	hasUnsavedChanges: false,
	saveStatus: "idle" as SaveStatus,
	saveError: null,
	isRightSidebarOpen: false,
	isCommandPaletteOpen: false,
	isMobileNavOpen: false,
	editorContent: null,
	originalContent: null,
	isLoading: false,
};

// Create store
export const useJobEditorStore = create<JobEditorStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				// Tab Navigation
				setActiveTab: (tab) => set({ activeTab: tab }),

				// Edit Mode
				toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
				setEditMode: (mode) => set({ isEditMode: mode }),

				// Changes Tracking
				setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

				// Auto-save Status
				setSaveStatus: (status) => set({ saveStatus: status }),
				setSaveError: (error) => set({ saveError: error }),

				// Right Sidebar
				toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
				setRightSidebarOpen: (isOpen) => set({ isRightSidebarOpen: isOpen }),

				// Command Palette
				toggleCommandPalette: () =>
					set((state) => ({
						isCommandPaletteOpen: !state.isCommandPaletteOpen,
					})),
				setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),

				// Mobile Bottom Navigation
				toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
				setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),

				// Content State
				setEditorContent: (content) => {
					set({ editorContent: content });
					// Auto-mark as having changes if content differs from original
					const { originalContent } = get();
					if (originalContent && content !== originalContent) {
						set({ hasUnsavedChanges: true });
					}
				},
				setOriginalContent: (content) => set({ originalContent: content }),

				// Loading States
				setIsLoading: (loading) => set({ isLoading: loading }),

				// Reset Functions
				resetChanges: () =>
					set((state) => ({
						hasUnsavedChanges: false,
						editorContent: state.originalContent,
						saveStatus: "idle",
						saveError: null,
					})),

				reset: () => set(initialState),
			}),
			{
				name: "job-editor-storage", // localStorage key
				partialize: (state) => ({
					activeTab: state.activeTab, // Persist active tab
					isRightSidebarOpen: state.isRightSidebarOpen, // Persist sidebar state
				}),
			}
		),
		{ name: "JobEditorStore" } // DevTools name
	)
);

// Selectors for optimized re-renders
export const useActiveTab = () => useJobEditorStore((state) => state.activeTab);
export const useSetActiveTab = () => useJobEditorStore((state) => state.setActiveTab);

export const useIsEditMode = () => useJobEditorStore((state) => state.isEditMode);
export const useToggleEditMode = () => useJobEditorStore((state) => state.toggleEditMode);

export const useHasUnsavedChanges = () => useJobEditorStore((state) => state.hasUnsavedChanges);

export const useSaveStatus = () =>
	useJobEditorStore((state) => ({
		status: state.saveStatus,
		error: state.saveError,
	}));

export const useIsRightSidebarOpen = () => useJobEditorStore((state) => state.isRightSidebarOpen);
export const useToggleRightSidebar = () => useJobEditorStore((state) => state.toggleRightSidebar);

export const useIsCommandPaletteOpen = () => useJobEditorStore((state) => state.isCommandPaletteOpen);
export const useToggleCommandPalette = () => useJobEditorStore((state) => state.toggleCommandPalette);

// Usage Example:
// import { useActiveTab, useSetActiveTab } from "@/lib/stores/job-editor-store";
//
// function MyComponent() {
//   const activeTab = useActiveTab();
//   const setActiveTab = useSetActiveTab();
//
//   return <button onClick={() => setActiveTab("financials")}>Financials</button>;
// }
