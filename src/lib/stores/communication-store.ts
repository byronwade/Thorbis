/**
 * Communication Store - Zustand state management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Automatic re-renders only for components using this state
 * - Shares active tab state between page and toolbar
 */

import { create } from "zustand";

type MessageType = "email" | "sms" | "phone" | "ticket";
type ActiveFilter = MessageType | "all";

type CommunicationStore = {
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
};

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  activeFilter: "all",
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
