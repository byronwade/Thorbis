"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Recent Customers Store - Zustand State Management
 *
 * Tracks recently accessed customers for quick access
 * - Persists to localStorage
 * - Automatically maintains top 10 recent customers
 * - Used by customer combobox for power-user speed
 */

type RecentCustomersStore = {
  recentCustomerIds: string[];
  addRecentCustomer: (customerId: string) => void;
  clearRecentCustomers: () => void;
};

const MAX_RECENT_CUSTOMERS = 10;

export const useRecentCustomersStore = create<RecentCustomersStore>()(
  persist(
    (set) => ({
      recentCustomerIds: [],

      addRecentCustomer: (customerId) =>
        set((state) => {
          // Remove if already exists
          const filtered = state.recentCustomerIds.filter(
            (id) => id !== customerId
          );

          // Add to front, limit to max
          return {
            recentCustomerIds: [customerId, ...filtered].slice(
              0,
              MAX_RECENT_CUSTOMERS
            ),
          };
        }),

      clearRecentCustomers: () => set({ recentCustomerIds: [] }),
    }),
    {
      name: "recent-customers-storage",
    }
  )
);
