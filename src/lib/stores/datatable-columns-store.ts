/**
 * DataTable Columns Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 * - Persisted to localStorage for user preferences
 *
 * Manages column visibility and ordering state per entity type (appointments, jobs, customers, etc.)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Column visibility state per entity
type EntityColumnsState = Record<string, boolean>; // { columnKey: visible }
type AllEntitiesState = Record<string, EntityColumnsState>; // { entityType: { columnKey: visible } }

// Column order state per entity
type EntityColumnOrder = string[]; // [columnKey1, columnKey2, ...]
type AllEntitiesOrderState = Record<string, EntityColumnOrder>; // { entityType: [columnKey1, columnKey2, ...] }

type DataTableColumnsStore = {
  // State - all entity column visibility states
  entities: AllEntitiesState;

  // State - all entity column order states
  columnOrder: AllEntitiesOrderState;

  // Actions - Visibility
  setColumnVisibility: (
    entity: string,
    columnKey: string,
    visible: boolean
  ) => void;
  toggleColumn: (entity: string, columnKey: string) => void;
  showAllColumns: (entity: string, columnKeys: string[]) => void;
  hideAllColumns: (entity: string, columnKeys: string[]) => void;
  isColumnVisible: (entity: string, columnKey: string) => boolean;
  getVisibleColumns: (entity: string) => string[];

  // Actions - Ordering
  setColumnOrder: (entity: string, columnOrder: string[]) => void;
  getColumnOrder: (entity: string) => string[] | undefined;
  reorderColumn: (entity: string, fromIndex: number, toIndex: number) => void;
  resetColumnOrder: (entity: string) => void;

  // General Actions
  resetEntity: (entity: string) => void;
  initializeEntity: (entity: string, columns: string[]) => void;
};

// Initial state
const initialState = {
  entities: {},
  columnOrder: {},
};

// Create store with persistence
export const useDataTableColumnsStore = create<DataTableColumnsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Visibility Actions
      setColumnVisibility: (entity, columnKey, visible) =>
        set((state) => ({
          entities: {
            ...state.entities,
            [entity]: {
              ...state.entities[entity],
              [columnKey]: visible,
            },
          },
        })),

      toggleColumn: (entity, columnKey) => {
        const current = get().isColumnVisible(entity, columnKey);
        get().setColumnVisibility(entity, columnKey, !current);
      },

      showAllColumns: (entity, columnKeys) =>
        set((state) => ({
          entities: {
            ...state.entities,
            [entity]: columnKeys.reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {} as EntityColumnsState),
          },
        })),

      hideAllColumns: (entity, columnKeys) =>
        set((state) => ({
          entities: {
            ...state.entities,
            [entity]: columnKeys.reduce((acc, key) => {
              acc[key] = false;
              return acc;
            }, {} as EntityColumnsState),
          },
        })),

      isColumnVisible: (entity, columnKey) => {
        const state = get();
        // Default to true if not set
        return state.entities[entity]?.[columnKey] ?? true;
      },

      getVisibleColumns: (entity) => {
        const state = get();
        const entityState = state.entities[entity] || {};
        return Object.entries(entityState)
          .filter(([, visible]) => visible)
          .map(([key]) => key);
      },

      // Ordering Actions
      setColumnOrder: (entity, columnOrder) =>
        set((state) => ({
          columnOrder: {
            ...state.columnOrder,
            [entity]: columnOrder,
          },
        })),

      getColumnOrder: (entity) => {
        const state = get();
        return state.columnOrder[entity];
      },

      reorderColumn: (entity, fromIndex, toIndex) => {
        const state = get();
        const currentOrder = state.columnOrder[entity];
        if (!currentOrder) {
          return;
        }

        const newOrder = [...currentOrder];
        const [removed] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, removed);

        get().setColumnOrder(entity, newOrder);
      },

      resetColumnOrder: (entity) =>
        set((state) => {
          const { [entity]: _, ...rest } = state.columnOrder;
          return { columnOrder: rest };
        }),

      // General Actions
      resetEntity: (entity) =>
        set((state) => {
          const { [entity]: _visibility, ...restEntities } = state.entities;
          const { [entity]: _order, ...restOrder } = state.columnOrder;
          return {
            entities: restEntities,
            columnOrder: restOrder,
          };
        }),

      initializeEntity: (entity, columns) => {
        const state = get();
        if (!state.entities[entity]) {
          set((currentState) => ({
            entities: {
              ...currentState.entities,
              [entity]: columns.reduce((acc, key) => {
                acc[key] = true;
                return acc;
              }, {} as EntityColumnsState),
            },
          }));
        }
        // Initialize column order if not set
        if (!state.columnOrder[entity]) {
          get().setColumnOrder(entity, columns);
        }
      },
    }),
    {
      name: "datatable-columns-storage", // localStorage key
      version: 2, // Increment version for new state structure
    }
  )
);
