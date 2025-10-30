/**
 * Edit Mode Store - Zustand State Management
 *
 * Manages edit mode state for job details page
 * Replaces React Context for better performance and simpler architecture
 */

import { create } from "zustand";

type EditModeStore = {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
  reset: () => void;
};

export const useEditModeStore = create<EditModeStore>((set) => ({
  isEditMode: false,

  setIsEditMode: (value) => set({ isEditMode: value }),

  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

  reset: () => set({ isEditMode: false }),
}));
