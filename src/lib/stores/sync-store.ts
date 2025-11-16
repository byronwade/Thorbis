/**
 * Sync Store - Global state management for sync operations
 *
 * Manages:
 * - Active sync operations (bulk send, data sync, etc.)
 * - Offline queue
 * - Real-time progress tracking
 * - Operation history
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SyncOperationType =
  | "bulk_send_invoices"
  | "bulk_send_estimates"
  | "data_sync"
  | "offline_sync"
  | "file_upload"
  | "export";

export type SyncOperationStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "queued";

export type SyncOperation = {
  id: string;
  type: SyncOperationType;
  status: SyncOperationStatus;
  title: string;
  description?: string;
  progress: number; // 0-100
  total?: number;
  current?: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
};

export type OfflineOperation = {
  id: string;
  type: SyncOperationType;
  action: string;
  payload: any;
  createdAt: Date;
  retryCount: number;
};

type SyncState = {
  // Active operations
  operations: SyncOperation[];

  // Offline queue
  offlineQueue: OfflineOperation[];
  isOnline: boolean;

  // UI state
  isPanelOpen: boolean;

  // Actions
  startOperation: (
    operation: Omit<SyncOperation, "id" | "startedAt" | "progress" | "status">
  ) => string;
  updateOperation: (id: string, updates: Partial<SyncOperation>) => void;
  completeOperation: (id: string, success: boolean, error?: string) => void;
  removeOperation: (id: string) => void;
  clearCompleted: () => void;

  // Offline queue actions
  queueOperation: (
    operation: Omit<OfflineOperation, "id" | "createdAt" | "retryCount">
  ) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setOnlineStatus: (isOnline: boolean) => void;

  // UI actions
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
};

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      operations: [],
      offlineQueue: [],
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      isPanelOpen: false,

      startOperation: (operation) => {
        const id = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newOperation: SyncOperation = {
          ...operation,
          id,
          status: "in_progress",
          progress: 0,
          startedAt: new Date(),
        };

        set((state) => ({
          operations: [...state.operations, newOperation],
        }));

        return id;
      },

      updateOperation: (id, updates) => {
        set((state) => ({
          operations: state.operations.map((op) =>
            op.id === id ? { ...op, ...updates } : op
          ),
        }));
      },

      completeOperation: (id, success, error) => {
        set((state) => ({
          operations: state.operations.map((op) =>
            op.id === id
              ? {
                  ...op,
                  status: success ? "completed" : "failed",
                  progress: success ? 100 : op.progress,
                  completedAt: new Date(),
                  error,
                }
              : op
          ),
        }));

        // Auto-remove completed operations after 10 seconds
        if (success) {
          setTimeout(() => {
            get().removeOperation(id);
          }, 10_000);
        }
      },

      removeOperation: (id) => {
        set((state) => ({
          operations: state.operations.filter((op) => op.id !== id),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          operations: state.operations.filter(
            (op) => op.status !== "completed" && op.status !== "failed"
          ),
        }));
      },

      queueOperation: (operation) => {
        const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const queuedOp: OfflineOperation = {
          ...operation,
          id,
          createdAt: new Date(),
          retryCount: 0,
        };

        set((state) => ({
          offlineQueue: [...state.offlineQueue, queuedOp],
        }));
      },

      removeFromQueue: (id) => {
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((op) => op.id !== id),
        }));
      },

      clearQueue: () => {
        set({ offlineQueue: [] });
      },

      setOnlineStatus: (isOnline) => {
        set({ isOnline });
      },

      togglePanel: () => {
        set((state) => ({ isPanelOpen: !state.isPanelOpen }));
      },

      openPanel: () => {
        set({ isPanelOpen: true });
      },

      closePanel: () => {
        set({ isPanelOpen: false });
      },
    }),
    {
      name: "thorbis-sync-store",
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
        // Don't persist operations or UI state
      }),
    }
  )
);

// Hook to get active operations count
export const useActiveOperationsCount = () =>
  useSyncStore(
    (state) =>
      state.operations.filter((op) => op.status === "in_progress").length
  );

// Hook to get queued operations count
export const useQueuedOperationsCount = () =>
  useSyncStore((state) => state.offlineQueue.length);

// Hook to get if syncing
export const useIsSyncing = () =>
  useSyncStore((state) =>
    state.operations.some((op) => op.status === "in_progress")
  );
