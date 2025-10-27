"use client";

import { useEffect, useRef } from "react";
import { useLayoutConfig } from "@/components/layout/layout-config-provider";
import type { SidebarConfig } from "@/lib/sidebar/types";

type PageLayoutConfig = {
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
  paddingX?: "none" | "sm" | "md" | "lg";
  paddingY?: "none" | "sm" | "md" | "lg";
  gap?: "none" | "sm" | "md" | "lg";
  showToolbar?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
  sidebar?: SidebarConfig;
  fixedHeight?: boolean;
};

export function usePageLayout(config: PageLayoutConfig) {
  const { setConfig } = useLayoutConfig();

  useEffect(() => {
    setConfig(config);

    // Reset to defaults when component unmounts (including sidebar!)
    return () => {
      setConfig({
        maxWidth: "7xl",
        padding: "md",
        paddingX: undefined,
        paddingY: undefined,
        gap: "md",
        showToolbar: true,
        showSidebar: true,
        showHeader: true,
        sidebar: undefined, // Clear custom sidebar config
        fixedHeight: false, // Reset to scrollable layout
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setConfig]);
}
