"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import type { SidebarConfig } from "@/lib/sidebar/types";

type LayoutConfig = {
  maxWidth?:
    | "full"
    | "7xl"
    | "6xl"
    | "5xl"
    | "4xl"
    | "3xl"
    | "2xl"
    | "xl"
    | "lg"
    | "md"
    | "sm";
  padding?: "none" | "sm" | "md" | "lg";
  gap?: "none" | "sm" | "md" | "lg";
  showToolbar?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
  sidebar?: SidebarConfig;
};

type LayoutConfigContextType = {
  config: LayoutConfig;
  setConfig: (config: LayoutConfig) => void;
};

const LayoutConfigContext = createContext<LayoutConfigContextType | undefined>(
  undefined
);

export function useLayoutConfig() {
  const context = useContext(LayoutConfigContext);

  // Return defaults when context is not available (e.g., during SSR)
  if (typeof window === "undefined" || !context) {
    return {
      config: {
        maxWidth: "7xl" as const,
        padding: "md" as const,
        gap: "md" as const,
        showToolbar: true,
        showSidebar: true,
        showHeader: true,
      },
      setConfig: () => {
        // No-op during SSR or outside provider
      },
    };
  }

  return context;
}

export function LayoutConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<LayoutConfig>({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
    showHeader: true,
  });

  const setConfig = useCallback((newConfig: LayoutConfig) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return (
    <LayoutConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </LayoutConfigContext.Provider>
  );
}

export function getMaxWidthClass(maxWidth: LayoutConfig["maxWidth"]): string {
  switch (maxWidth) {
    case "full":
      return "w-full max-w-none";
    case "7xl":
      return "max-w-7xl mx-auto";
    case "6xl":
      return "max-w-6xl mx-auto";
    case "5xl":
      return "max-w-5xl mx-auto";
    case "4xl":
      return "max-w-4xl mx-auto";
    case "3xl":
      return "max-w-3xl mx-auto";
    case "2xl":
      return "max-w-2xl mx-auto";
    case "xl":
      return "max-w-xl mx-auto";
    case "lg":
      return "max-w-lg mx-auto";
    case "md":
      return "max-w-md mx-auto";
    case "sm":
      return "max-w-sm mx-auto";
    default:
      return "max-w-7xl mx-auto";
  }
}

export function getPaddingClass(padding: LayoutConfig["padding"]): string {
  switch (padding) {
    case "none":
      return "p-0";
    case "sm":
      return "p-2";
    case "md":
      return "p-4";
    case "lg":
      return "p-6";
    default:
      return "p-4";
  }
}

export function getGapClass(gap: LayoutConfig["gap"]): string {
  switch (gap) {
    case "none":
      return "gap-0";
    case "sm":
      return "gap-2";
    case "md":
      return "gap-4";
    case "lg":
      return "gap-6";
    default:
      return "gap-4";
  }
}
