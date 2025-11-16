/**
 * Settings Hook
 *
 * Reusable hook for loading and saving settings with proper state management.
 * Handles loading states, error handling, and toast notifications automatically.
 *
 * @example
 * ```typescript
 * const { settings, isLoading, updateSettings, saveSettings, isPending } = useSettings({
 *   getter: getEmailSettings,
 *   setter: updateEmailSettings,
 *   initialState: { smtpFromEmail: "" },
 *   settingsName: "email",
 * });
 * ```
 */

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ActionResult } from "@/lib/errors/with-error-handling";

type UseSettingsOptions<T> = {
  /** Server action to fetch settings */
  getter: () => Promise<ActionResult<T>>;
  /** Server action to save settings */
  setter: (formData: FormData) => Promise<ActionResult<void>>;
  /** Initial state before data loads */
  initialState: T;
  /** Name of settings for toast messages (e.g., "email", "job", "invoice") */
  settingsName: string;
  /** Optional: Transform database data to UI state */
  transformLoad?: (data: any) => Partial<T>;
  /** Optional: Transform UI state to FormData */
  transformSave?: (settings: T) => FormData;
  /** Optional: Prefetched settings to avoid client-side re-fetch */
  prefetchedData?: Partial<T>;
};

type UseSettingsReturn<T> = {
  /** Current settings state */
  settings: T;
  /** Whether initial load is in progress */
  isLoading: boolean;
  /** Whether save operation is in progress */
  isPending: boolean;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Update a single setting field */
  updateSetting: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Update multiple settings at once */
  updateSettings: (updates: Partial<T>) => void;
  /** Save settings to database */
  saveSettings: (formData?: FormData) => Promise<void>;
  /** Reset to initial state */
  reset: () => void;
  /** Reload settings from database */
  reload: () => Promise<void>;
};

export function useSettings<T extends Record<string, any>>({
  getter,
  setter,
  initialState,
  settingsName,
  transformLoad,
  transformSave,
  prefetchedData,
}: UseSettingsOptions<T>): UseSettingsReturn<T> {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const hasPrefetchedDataRef = useRef(Boolean(prefetchedData));
  const mergedInitialStateRef = useRef<T>({
    ...initialState,
    ...(prefetchedData ?? {}),
  });
  const [settings, setSettings] = useState<T>(mergedInitialStateRef.current);
  const [baseline, setBaseline] = useState<T>(mergedInitialStateRef.current);
  const [isLoading, setIsLoading] = useState(!prefetchedData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from database on mount
  async function loadSettings() {
    setIsLoading(true);
    try {
      const result = await getter();

      if (result.success && result.data) {
        const transformed = transformLoad
          ? transformLoad(result.data)
          : (result.data as Partial<T>);
        const merged = { ...initialState, ...transformed } as T;
        setSettings(merged);
        setBaseline(merged);
        setHasUnsavedChanges(false);
      }
    } catch (_error) {
      toast.error(`Failed to load ${settingsName} settings`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (hasPrefetchedDataRef.current) {
      hasPrefetchedDataRef.current = false;
      return;
    }
    void loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSettings]);

  // Update a single setting
  const updateSetting = <K extends keyof T>(key: K, value: T[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Update multiple settings at once
  const updateSettings = (updates: Partial<T>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  // Save settings to database
  const saveSettings = async (customFormData?: FormData) => {
    startTransition(async () => {
      try {
        const formData =
          customFormData ||
          (transformSave ? transformSave(settings) : new FormData());

        const result = await setter(formData);

        if (result.success) {
          setBaseline(settings);
          setHasUnsavedChanges(false);
          toast.success(
            `${settingsName.charAt(0).toUpperCase() + settingsName.slice(1)} settings saved successfully`
          );
        } else {
          toast.error(
            result.error || `Failed to save ${settingsName} settings`
          );
        }
      } catch (_error) {
        toast.error(
          `An unexpected error occurred while saving ${settingsName} settings`
        );
      }
    });
  };

  // Reset to initial state
  const reset = () => {
    setSettings(baseline);
    setHasUnsavedChanges(false);
  };

  // Reload from database
  const reload = async () => {
    await loadSettings();
  };

  return {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    updateSettings,
    saveSettings,
    reset,
    reload,
  };
}
