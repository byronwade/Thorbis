/**
 * Communication Store - Zustand state management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Automatic re-renders only for components using this state
 * - Shares active tab state between page and toolbar
 * - Tracks selected message for detail view navigation
 */

import { create } from "zustand";

type MessageType = "email" | "sms" | "phone" | "ticket";
type ActiveFilter = MessageType | "all";

type CommunicationStore = {
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  isDetailView: boolean;
  setIsDetailView: (isDetailView: boolean) => void;
};

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  activeFilter: "all",
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  selectedMessageId: null,
  setSelectedMessageId: (id) => set({ selectedMessageId: id }),
  isDetailView: false,
  setIsDetailView: (isDetailView) => set({ isDetailView }),
}));
