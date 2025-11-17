/**
 * Custom Columns Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 * - Persisted to localStorage for user preferences
 *
 * Manages custom column definitions per entity type for datatables
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CustomColumn = {
	id: string;
	fieldPath: string; // e.g., "customer.email", "created_at", "status"
	label: string;
	width?: string; // "auto" | "sm" | "md" | "lg" | "xl"
	format?: "text" | "date" | "currency" | "number" | "badge";
	sortable?: boolean;
};

type CustomColumnsStore = {
	// State - custom columns per entity
	columns: Record<string, CustomColumn[]>; // entity -> columns

	// Actions
	addColumn: (entity: string, column: CustomColumn) => void;
	removeColumn: (entity: string, columnId: string) => void;
	updateColumn: (entity: string, columnId: string, updates: Partial<CustomColumn>) => void;
	reorderColumns: (entity: string, fromIndex: number, toIndex: number) => void;
	getColumns: (entity: string) => CustomColumn[];
	clearEntity: (entity: string) => void;
	clearAll: () => void;
};

// Initial state
const initialState = {
	columns: {},
};

// Create store with persistence
export const useCustomColumnsStore = create<CustomColumnsStore>()(
	persist(
		(set, get) => ({
			...initialState,

			addColumn: (entity, column) =>
				set((state) => ({
					columns: {
						...state.columns,
						[entity]: [...(state.columns[entity] || []), column],
					},
				})),

			removeColumn: (entity, columnId) =>
				set((state) => ({
					columns: {
						...state.columns,
						[entity]: (state.columns[entity] || []).filter((col) => col.id !== columnId),
					},
				})),

			updateColumn: (entity, columnId, updates) =>
				set((state) => ({
					columns: {
						...state.columns,
						[entity]: (state.columns[entity] || []).map((col) =>
							col.id === columnId ? { ...col, ...updates } : col
						),
					},
				})),

			reorderColumns: (entity, fromIndex, toIndex) =>
				set((state) => {
					const entityColumns = [...(state.columns[entity] || [])];
					const [removed] = entityColumns.splice(fromIndex, 1);
					entityColumns.splice(toIndex, 0, removed);

					return {
						columns: {
							...state.columns,
							[entity]: entityColumns,
						},
					};
				}),

			getColumns: (entity) => {
				const state = get();
				return state.columns[entity] || [];
			},

			clearEntity: (entity) =>
				set((state) => {
					const { [entity]: _, ...rest } = state.columns;
					return { columns: rest };
				}),

			clearAll: () => set({ columns: {} }),
		}),
		{
			name: "custom-columns-storage", // localStorage key
			skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
			version: 1,
		}
	)
);
