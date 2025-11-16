import type { ReactNode } from "react";
import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

/**
 * Settings Section Layout - Server Component
 *
 * This layout applies to all routes under /dashboard/settings/*
 * Matches the configuration from unified-layout-config.tsx for SETTINGS_ALL
 *
 * Performance: Pure server component, no client JS needed
 */
export default function SettingsLayout({ children }: { children: ReactNode }) {
  // Settings section configuration
  const config: UnifiedLayoutConfig = {
    structure: {
      maxWidth: "7xl",
      padding: "lg",
      gap: "lg",
      fixedHeight: false,
      variant: "default",
      background: "default",
      insetPadding: "none",
    },
    header: {
      show: true,
    },
    toolbar: {
      show: true,
      title: "Settings",
      subtitle: "Workspace controls & advanced configuration",
    },
    sidebar: {
      show: true,
      variant: "standard",
    },
  };

  return (
    <SectionLayout config={config} pathname="/dashboard/settings">
      {children}
    </SectionLayout>
  );
}
