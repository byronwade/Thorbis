/**
 * Invoice Sidebar Store - Zustand State Management
 *
 * Manages the open/closed state of the invoice right sidebar
 * independently from the left app sidebar.
 */

import { create } from "zustand";

interface InvoiceSidebarStore {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useInvoiceSidebarStore = create<InvoiceSidebarStore>((set) => ({
  isOpen: true, // Default to open
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));
