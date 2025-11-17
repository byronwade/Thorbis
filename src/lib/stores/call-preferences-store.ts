/**
 * Call Preferences Store - Zustand State Management
 *
 * Manages CSR preferences for call interface layout including:
 * - Card visibility and order customization
 * - Popover width and size preferences
 * - Card collapsed/expanded states
 * - Auto-save preferences to localStorage
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - Persisted preferences across sessions
 * - Selective subscriptions prevent unnecessary re-renders
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Card types available in the interface
export type CardType =
	| "transcript"
	| "customer-info"
	| "ai-autofill"
	| "quick-actions"
	| "call-controls"
	| "notes"
	| "disposition"
	| "ai-analysis"
	| "call-scripts"
	| "transfer";

// Card preference configuration
export type CardPreference = {
	id: CardType;
	isVisible: boolean;
	isCollapsed: boolean;
	order: number;
	size?: "small" | "medium" | "large"; // For future grid sizing
};

// Position type - can be "default" (top-right) or specific coordinates
export type Position = { x: number; y: number } | "default";

// Store state type
type CallPreferencesStore = {
	// State
	popoverWidth: number; // in pixels
	position: Position; // popover position on screen
	cards: CardPreference[];
	layoutMode: "compact" | "comfortable" | "spacious";
	showAIConfidence: boolean;
	autoSaveNotes: boolean;
	keyboardShortcutsEnabled: boolean;

	// Actions
	setPopoverWidth: (width: number) => void;
	setPosition: (position: { x: number; y: number }) => void;
	resetPosition: () => void;
	setCardVisibility: (cardId: CardType, isVisible: boolean) => void;
	setCardCollapsed: (cardId: CardType, isCollapsed: boolean) => void;
	setCardOrder: (cardId: CardType, newOrder: number) => void;
	reorderCards: (newOrder: CardType[]) => void;
	toggleCard: (cardId: CardType) => void;
	setLayoutMode: (mode: "compact" | "comfortable" | "spacious") => void;
	setShowAIConfidence: (show: boolean) => void;
	setAutoSaveNotes: (enabled: boolean) => void;
	setKeyboardShortcutsEnabled: (enabled: boolean) => void;
	resetToDefaults: () => void;
	getVisibleCards: () => CardPreference[];
};

// Default card configuration
const defaultCards: CardPreference[] = [
	{ id: "call-controls", isVisible: true, isCollapsed: false, order: 0 },
	{ id: "transcript", isVisible: true, isCollapsed: false, order: 1 },
	{ id: "ai-autofill", isVisible: true, isCollapsed: false, order: 2 },
	{ id: "customer-info", isVisible: true, isCollapsed: false, order: 3 },
	{ id: "quick-actions", isVisible: true, isCollapsed: false, order: 4 },
	{ id: "ai-analysis", isVisible: true, isCollapsed: false, order: 5 },
	{ id: "notes", isVisible: true, isCollapsed: false, order: 6 },
	{ id: "disposition", isVisible: true, isCollapsed: false, order: 7 },
	{ id: "call-scripts", isVisible: false, isCollapsed: true, order: 8 },
	{ id: "transfer", isVisible: false, isCollapsed: true, order: 9 },
];

// Initial state
const initialState = {
	popoverWidth: 800, // Default to 800px
	position: "default" as Position, // Default to top-right corner
	cards: defaultCards,
	layoutMode: "comfortable" as const,
	showAIConfidence: true,
	autoSaveNotes: true,
	keyboardShortcutsEnabled: true,
};

// Create store with persistence
export const useCallPreferencesStore = create<CallPreferencesStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				setPopoverWidth: (width) => {
					// Clamp width between 420px and 1400px
					const clampedWidth = Math.max(420, Math.min(1400, width));
					set({ popoverWidth: clampedWidth });
				},

				setPosition: (position) => {
					set({ position });
				},

				resetPosition: () => {
					set({ position: "default" });
				},

				setCardVisibility: (cardId, isVisible) => {
					set((state) => ({
						cards: state.cards.map((card) => (card.id === cardId ? { ...card, isVisible } : card)),
					}));
				},

				setCardCollapsed: (cardId, isCollapsed) => {
					set((state) => ({
						cards: state.cards.map((card) =>
							card.id === cardId ? { ...card, isCollapsed } : card
						),
					}));
				},

				setCardOrder: (cardId, newOrder) => {
					set((state) => {
						const cards = [...state.cards];
						const cardIndex = cards.findIndex((c) => c.id === cardId);
						if (cardIndex === -1) {
							return state;
						}

						const [card] = cards.splice(cardIndex, 1);
						card.order = newOrder;

						// Reorder all cards
						const reordered = [...cards.slice(0, newOrder), card, ...cards.slice(newOrder)].map(
							(c, index) => ({
								...c,
								order: index,
							})
						);

						return { cards: reordered };
					});
				},

				reorderCards: (newOrder) => {
					set((state) => {
						const cards = state.cards.map((card) => {
							const newIndex = newOrder.indexOf(card.id);
							return newIndex !== -1 ? { ...card, order: newIndex } : card;
						});

						return { cards: cards.sort((a, b) => a.order - b.order) };
					});
				},

				toggleCard: (cardId) => {
					set((state) => ({
						cards: state.cards.map((card) =>
							card.id === cardId ? { ...card, isCollapsed: !card.isCollapsed } : card
						),
					}));
				},

				setLayoutMode: (mode) => set({ layoutMode: mode }),

				setShowAIConfidence: (show) => set({ showAIConfidence: show }),

				setAutoSaveNotes: (enabled) => set({ autoSaveNotes: enabled }),

				setKeyboardShortcutsEnabled: (enabled) => set({ keyboardShortcutsEnabled: enabled }),

				resetToDefaults: () => set(initialState),

				getVisibleCards: () => {
					const { cards } = get();
					return cards.filter((card) => card.isVisible).sort((a, b) => a.order - b.order);
				},
			}),
			{
				name: "call-preferences-storage",
				partialize: (state) => ({
					popoverWidth: state.popoverWidth,
					position: state.position,
					cards: state.cards,
					layoutMode: state.layoutMode,
					showAIConfidence: state.showAIConfidence,
					autoSaveNotes: state.autoSaveNotes,
					keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
				}),
				// PERFORMANCE: Skip hydration to prevent SSR mismatches
				// Allows Next.js to generate static pages without Zustand errors
				skipHydration: true,
			}
		),
		{ name: "CallPreferencesStore" }
	)
);
