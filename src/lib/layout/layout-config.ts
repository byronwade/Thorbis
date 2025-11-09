import type { SidebarConfig } from "@/lib/sidebar/types";

export type LayoutConfig = {
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
  // Right sidebar configuration
  showRightSidebar?: boolean;
  rightSidebarComponent?: "invoice" | "pricebook" | "generic" | string;
  rightSidebarCollapsible?: boolean;
  rightSidebarDefaultOpen?: boolean;
  rightSidebarWidth?: number; // In pixels (default 320)
};

type LayoutRule = {
  pattern: string | RegExp;
  config: LayoutConfig;
  priority?: number; // Higher priority = checked first
};

// Define layout rules by pathname pattern
const LAYOUT_RULES: LayoutRule[] = [
  // Special cases (high priority)
  {
    pattern: /^\/dashboard$/,
    config: {
      maxWidth: "7xl",
      padding: "md",
      gap: "md",
      showToolbar: false,
      showSidebar: false,
      showHeader: true,
    },
    priority: 110,
  },
  {
    pattern: /^\/dashboard\/ai$/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: false,
      showSidebar: false,
      showHeader: process.env.NEXT_PUBLIC_APP_ENV === "production",
      fixedHeight: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    },
    priority: 100,
  },
  {
    pattern: /^\/dashboard\/ai\//,
    config: {
      maxWidth: "7xl",
      padding: "none",
      gap: "lg",
      showToolbar: false,
      showSidebar: false,
      showHeader: true,
    },
    priority: 90,
  },
  {
    pattern: /^\/dashboard\/tv$/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: false,
      showSidebar: false,
      showHeader: false,
      fixedHeight: true,
    },
    priority: 80,
  },
  {
    pattern: /^\/dashboard\/work\/schedule/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: false,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 70,
  },
  {
    pattern: /^\/dashboard\/communication/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 65,
  },
  // Right sidebar pages (high priority)
  {
    pattern: /^\/dashboard\/work\/invoices\/[^/]+$/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
      showRightSidebar: true,
      rightSidebarComponent: "invoice",
      rightSidebarCollapsible: true,
      rightSidebarDefaultOpen: true,
      rightSidebarWidth: 320,
    },
    priority: 75,
  },
  {
    pattern: /^\/dashboard\/work\/pricebook/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
      showRightSidebar: true,
      rightSidebarComponent: "pricebook",
      rightSidebarCollapsible: true,
      rightSidebarDefaultOpen: true,
      rightSidebarWidth: 320,
    },
    priority: 76,
  },
  {
    pattern: /^\/dashboard\/work\/new$/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: false,
      showSidebar: false,
      showHeader: true,
    },
    priority: 78,
  },
  {
    pattern: /^\/dashboard\/work\/jobs\/new$/,
    config: {
      maxWidth: "4xl",
      padding: "md",
      gap: "md",
      showToolbar: false,
      showSidebar: false,
      showHeader: true,
    },
    priority: 77,
  },
  {
    pattern: /^\/dashboard\/(automation|training)/,
    config: {
      maxWidth: "7xl",
      padding: "none",
      gap: "lg",
      showToolbar: false,
      showSidebar: false,
      showHeader: true,
    },
    priority: 60,
  },
  {
    pattern: /^\/dashboard\/reporting/,
    config: {
      maxWidth: "full",
      padding: "md",
      gap: "md",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 64,
  },
  {
    pattern: /^\/dashboard\/marketing/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 61,
  },
  {
    pattern: /^\/dashboard\/finance$/,
    config: {
      maxWidth: "full",
      padding: "md",
      gap: "md",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 63,
  },
  {
    pattern: /^\/dashboard\/finance\//,
    config: {
      maxWidth: "full",
      padding: "md",
      gap: "md",
      showToolbar: false,
      showSidebar: true,
      showHeader: true,
      fixedHeight: false,
    },
    priority: 62,
  },
  {
    pattern: /^\/dashboard\/shop\/[^/]+$/,
    config: {
      maxWidth: "7xl",
      padding: "md",
      gap: "md",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: false,
    },
    priority: 56,
  },
  {
    pattern: /^\/dashboard\/shop$/,
    config: {
      maxWidth: "full",
      padding: "md",
      gap: "md",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: false,
    },
    priority: 57,
  },
  {
    pattern:
      /^\/dashboard\/work\/(invoices|estimates|materials|equipment|maintenance-plans|service-agreements|purchase-orders|pricebook)/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 55,
  },
  {
    pattern: /^\/dashboard\/work$/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 50,
  },
  {
    pattern: /^\/dashboard\/customers$/,
    config: {
      maxWidth: "full",
      padding: "none",
      gap: "none",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
      fixedHeight: true,
    },
    priority: 50,
  },

  // Default standard layout (lowest priority)
  {
    pattern: /^\/dashboard/,
    config: {
      maxWidth: "full",
      padding: "md",
      gap: "md",
      showToolbar: true,
      showSidebar: true,
      showHeader: true,
    },
    priority: 0,
  },
];

/**
 * Server-side function to get layout config for a pathname
 * No client-side hooks needed!
 */
export function getLayoutConfig(pathname: string): LayoutConfig {
  // Sort by priority (highest first)
  const sortedRules = [...LAYOUT_RULES].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  );

  // Find first matching rule
  for (const rule of sortedRules) {
    const matches =
      typeof rule.pattern === "string"
        ? pathname === rule.pattern
        : rule.pattern.test(pathname);

    if (matches) {
      return rule.config;
    }
  }

  // Fallback to default
  return {
    maxWidth: "full",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
    showHeader: true,
  };
}

// Helper functions (moved from provider)
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

export function getPaddingClass(
  padding: LayoutConfig["padding"],
  paddingX?: LayoutConfig["paddingX"],
  paddingY?: LayoutConfig["paddingY"]
): string {
  if (paddingX !== undefined || paddingY !== undefined) {
    const px = getPaddingXClass(paddingX ?? padding);
    const py = getPaddingYClass(paddingY ?? padding);
    return `${px} ${py}`;
  }

  switch (padding) {
    case "none":
      return "p-0";
    case "sm":
      return "px-2 py-4";
    case "md":
      return "px-4 py-6";
    case "lg":
      return "px-6 py-8";
    default:
      return "px-4 py-6";
  }
}

function getPaddingXClass(
  padding: LayoutConfig["paddingX"] | LayoutConfig["padding"]
): string {
  switch (padding) {
    case "none":
      return "px-0";
    case "sm":
      return "px-2";
    case "md":
      return "px-4";
    case "lg":
      return "px-6";
    default:
      return "px-4";
  }
}

function getPaddingYClass(
  padding: LayoutConfig["paddingY"] | LayoutConfig["padding"]
): string {
  switch (padding) {
    case "none":
      return "py-0";
    case "sm":
      return "py-4";
    case "md":
      return "py-6";
    case "lg":
      return "py-8";
    default:
      return "py-6";
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
