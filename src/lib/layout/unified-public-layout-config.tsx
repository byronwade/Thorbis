/**
 * Unified Public Layout Configuration System
 *
 * Centralized layout configuration for all public-facing pages:
 * - Marketing pages (homepage, features, pricing, etc.)
 * - Auth pages (login, register, verification)
 * - Documentation pages (KB, API docs)
 * - Legal pages (terms, privacy, etc.)
 * - Special pages (contract signing, embedded widgets, status)
 *
 * Benefits:
 * - Single source of truth for public page layouts
 * - Type-safe configuration
 * - Consistent UX across all public pages
 * - Easy to add new page variants
 * - No duplicate layout code
 *
 * Architecture:
 * - Route patterns defined once in PUBLIC_ROUTE_PATTERNS
 * - Layout variants for different page types
 * - Priority-based matching (higher priority checked first)
 * - Type-safe with comprehensive TypeScript types
 */

// ============================================================================
// CENTRALIZED PUBLIC ROUTE PATTERNS
// ============================================================================

export const PUBLIC_ROUTE_PATTERNS = {
  // Homepage
  HOME: /^\/$/,

  // Auth Pages
  LOGIN: /^\/login$/,
  REGISTER: /^\/register$/,
  FORGOT_PASSWORD: /^\/forgot-password$/,
  RESET_PASSWORD: /^\/reset-password$/,
  VERIFY_EMAIL: /^\/verify-email$/,
  AUTH_CALLBACK: /^\/auth\/callback$/,

  // Marketing Pages - Landing
  PRICING: /^\/pricing$/,
  DEMO: /^\/demo$/,
  CONTACT: /^\/contact$/,

  // Marketing Pages - Features
  FEATURES_LIST: /^\/features$/,
  FEATURES_DETAIL: /^\/features\/[^/]+$/,

  // Marketing Pages - Industries
  INDUSTRIES_LIST: /^\/industries$/,
  INDUSTRIES_DETAIL: /^\/industries\/[^/]+$/,

  // Marketing Pages - Integrations
  INTEGRATIONS_LIST: /^\/integrations$/,
  INTEGRATIONS_DETAIL: /^\/integrations\/[^/]+$/,

  // Marketing Pages - Comparisons
  VS_LIST: /^\/vs$/,
  VS_DETAIL: /^\/vs\/[^/]+$/,

  // Marketing Pages - Resources
  BLOG_LIST: /^\/blog$/,
  BLOG_POST: /^\/blog\/[^/]+$/,
  CASE_STUDIES: /^\/case-studies$/,
  WEBINARS: /^\/webinars$/,
  TEMPLATES: /^\/templates$/,
  FREE_TOOLS: /^\/free-tools$/,

  // Documentation Pages
  KB_HOME: /^\/kb$/,
  KB_SEARCH: /^\/kb\/search$/,
  KB_CATEGORY: /^\/kb\/[^/]+$/,
  KB_ARTICLE: /^\/kb\/[^/]+\/[^/]+$/,
  API_DOCS: /^\/api-docs/,
  HELP: /^\/help$/,

  // Legal Pages
  TERMS: /^\/terms$/,
  PRIVACY: /^\/privacy$/,
  COOKIES: /^\/cookies$/,
  GDPR: /^\/gdpr$/,
  SECURITY: /^\/security$/,
  ACCESSIBILITY: /^\/accessibility$/,

  // Company Pages
  ABOUT: /^\/about$/,
  CAREERS: /^\/careers$/,
  PRESS: /^\/press$/,
  PARTNERS: /^\/partners$/,
  COMMUNITY: /^\/community$/,
  STATUS: /^\/status$/,

  // Special Pages (No Chrome)
  CONTRACT_SIGN: /^\/contracts\/sign\/[^/]+$/,
  CONTRACT_SUCCESS: /^\/contracts\/sign\/[^/]+\/success$/,

  // Other
  SITEMAP: /^\/sitemap$/,
  REVIEWS: /^\/reviews$/,
  IMPLEMENTATION: /^\/implementation$/,
  ROI: /^\/roi$/,
  SWITCH: /^\/switch$/,
} as const;

// ============================================================================
// LAYOUT CONFIGURATION TYPES
// ============================================================================

/**
 * Page structure variants for public pages
 */
export type PublicPageVariant =
  | "hero" // Full-width hero + content (Homepage, Landing Pages)
  | "standard" // Container-width content (Features, About)
  | "wide" // Wider container (Pricing, Comparisons)
  | "documentation" // Sidebar + content (KB, API Docs)
  | "minimal" // Simple centered content (Legal, 404)
  | "auth-centered" // Centered auth form with background
  | "auth-wizard" // Full-screen stepped flow
  | "auth-verification" // Simple centered message
  | "embedded" // No chrome (Contract signing, widgets)
  | "status"; // Minimal status page

/**
 * Header configuration for public pages
 */
export type PublicHeaderConfig = {
  /** Whether to show the header */
  show: boolean;
  /** Header variant */
  variant?: "default" | "minimal" | "transparent";
  /** Show CTA button in header */
  showCTA?: boolean;
};

/**
 * Footer configuration for public pages
 */
export type PublicFooterConfig = {
  /** Whether to show the footer */
  show: boolean;
  /** Footer variant */
  variant?: "default" | "minimal";
};

/**
 * Sidebar configuration for documentation pages
 */
export type PublicSidebarConfig = {
  /** Whether to show the sidebar */
  show: boolean;
  /** Sidebar type */
  type?: "kb" | "api-docs" | "custom";
  /** Sidebar position */
  position?: "left" | "right";
  /** Whether sidebar is collapsible on mobile */
  collapsible?: boolean;
};

/**
 * Content area configuration
 */
export type PublicContentConfig = {
  /** Max width constraint */
  maxWidth?:
    | "full"
    | "screen-2xl" // 1536px
    | "screen-xl" // 1280px
    | "7xl" // 80rem
    | "6xl" // 72rem
    | "5xl" // 64rem
    | "4xl" // 56rem
    | "3xl" // 48rem
    | "2xl" // 42rem
    | "xl"; // 36rem
  /** Padding on all sides */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Padding on Y axis (top/bottom) */
  paddingY?: "none" | "sm" | "md" | "lg" | "xl";
  /** Background treatment */
  background?: "default" | "muted" | "gradient" | "pattern" | "transparent";
  /** Whether content fills viewport height */
  minHeight?: "none" | "screen" | "screen-header";
};

/**
 * Complete public layout configuration
 */
export type PublicLayoutConfig = {
  /** Page variant - determines overall layout structure */
  variant: PublicPageVariant;
  /** Header configuration */
  header: PublicHeaderConfig;
  /** Footer configuration */
  footer: PublicFooterConfig;
  /** Sidebar configuration (for documentation pages) */
  sidebar?: PublicSidebarConfig;
  /** Content area configuration */
  content: PublicContentConfig;
};

/**
 * Layout rule with pattern matching and priority
 */
export type PublicLayoutRule = {
  /** Route pattern to match */
  pattern: RegExp;
  /** Public layout configuration */
  config: PublicLayoutConfig;
  /** Priority (higher = checked first) */
  priority: number;
  /** Optional description for documentation */
  description?: string;
};

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

const DEFAULT_HEADER: PublicHeaderConfig = {
  show: true,
  variant: "default",
  showCTA: true,
};

const DEFAULT_FOOTER: PublicFooterConfig = {
  show: true,
  variant: "default",
};

const NO_CHROME_HEADER: PublicHeaderConfig = {
  show: false,
};

const NO_CHROME_FOOTER: PublicFooterConfig = {
  show: false,
};

const MINIMAL_FOOTER: PublicFooterConfig = {
  show: true,
  variant: "minimal",
};

// ============================================================================
// REUSABLE CONTENT CONFIGURATIONS
// ============================================================================

const HERO_CONTENT: PublicContentConfig = {
  maxWidth: "full",
  padding: "none",
  paddingY: "none",
  background: "default",
  minHeight: "none",
};

const STANDARD_CONTENT: PublicContentConfig = {
  maxWidth: "7xl",
  padding: "md",
  paddingY: "lg",
  background: "default",
  minHeight: "none",
};

const WIDE_CONTENT: PublicContentConfig = {
  maxWidth: "screen-xl",
  padding: "md",
  paddingY: "lg",
  background: "default",
  minHeight: "none",
};

const DOCUMENTATION_CONTENT: PublicContentConfig = {
  maxWidth: "screen-2xl",
  padding: "none",
  paddingY: "md",
  background: "default",
  minHeight: "screen-header",
};

const MINIMAL_CONTENT: PublicContentConfig = {
  maxWidth: "3xl",
  padding: "md",
  paddingY: "xl",
  background: "default",
  minHeight: "none",
};

const AUTH_CENTERED_CONTENT: PublicContentConfig = {
  maxWidth: "xl",
  padding: "md",
  paddingY: "none",
  background: "gradient",
  minHeight: "screen",
};

const AUTH_WIZARD_CONTENT: PublicContentConfig = {
  maxWidth: "full",
  padding: "none",
  paddingY: "none",
  background: "default",
  minHeight: "screen",
};

const EMBEDDED_CONTENT: PublicContentConfig = {
  maxWidth: "full",
  padding: "none",
  paddingY: "none",
  background: "transparent",
  minHeight: "screen",
};

// ============================================================================
// PUBLIC LAYOUT RULES
// ============================================================================

export const PUBLIC_LAYOUT_RULES: PublicLayoutRule[] = [
  // ========================================
  // SPECIAL PAGES (Highest Priority: 100+)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.CONTRACT_SIGN,
    config: {
      variant: "embedded",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: EMBEDDED_CONTENT,
    },
    priority: 110,
    description: "Contract signing - embedded, no chrome",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.CONTRACT_SUCCESS,
    config: {
      variant: "embedded",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: {
        ...EMBEDDED_CONTENT,
        maxWidth: "2xl",
        padding: "md",
      },
    },
    priority: 109,
    description: "Contract success - minimal centered message",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.STATUS,
    config: {
      variant: "status",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 108,
    description: "System status page - minimal layout",
  },

  // ========================================
  // AUTH PAGES (Priority: 90-99)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.LOGIN,
    config: {
      variant: "auth-centered",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: AUTH_CENTERED_CONTENT,
    },
    priority: 95,
    description: "Login page - centered form with background",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.REGISTER,
    config: {
      variant: "auth-centered",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: AUTH_CENTERED_CONTENT,
    },
    priority: 94,
    description: "Register page - centered form with background",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.FORGOT_PASSWORD,
    config: {
      variant: "auth-centered",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: AUTH_CENTERED_CONTENT,
    },
    priority: 93,
    description: "Forgot password - centered form",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.RESET_PASSWORD,
    config: {
      variant: "auth-centered",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: AUTH_CENTERED_CONTENT,
    },
    priority: 92,
    description: "Reset password - centered form",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.VERIFY_EMAIL,
    config: {
      variant: "auth-verification",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: {
        ...AUTH_CENTERED_CONTENT,
        maxWidth: "2xl",
      },
    },
    priority: 91,
    description: "Email verification - simple centered message",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.AUTH_CALLBACK,
    config: {
      variant: "auth-verification",
      header: NO_CHROME_HEADER,
      footer: NO_CHROME_FOOTER,
      content: {
        ...AUTH_CENTERED_CONTENT,
        maxWidth: "2xl",
      },
    },
    priority: 90,
    description: "Auth callback - loading/verification state",
  },

  // ========================================
  // DOCUMENTATION PAGES (Priority: 80-89)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.KB_ARTICLE,
    config: {
      variant: "documentation",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      sidebar: {
        show: true,
        type: "kb",
        position: "left",
        collapsible: true,
      },
      content: DOCUMENTATION_CONTENT,
    },
    priority: 85,
    description: "KB article - documentation layout with sidebar",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.KB_CATEGORY,
    config: {
      variant: "documentation",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      sidebar: {
        show: true,
        type: "kb",
        position: "left",
        collapsible: true,
      },
      content: DOCUMENTATION_CONTENT,
    },
    priority: 84,
    description: "KB category - documentation layout with sidebar",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.KB_HOME,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 83,
    description: "KB homepage - standard layout, no sidebar",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.KB_SEARCH,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 82,
    description: "KB search - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.API_DOCS,
    config: {
      variant: "documentation",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      sidebar: {
        show: true,
        type: "api-docs",
        position: "left",
        collapsible: true,
      },
      content: DOCUMENTATION_CONTENT,
    },
    priority: 81,
    description: "API docs - documentation layout with sidebar",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.HELP,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 80,
    description: "Help center - standard layout",
  },

  // ========================================
  // LEGAL PAGES (Priority: 70-79)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.TERMS,
    config: {
      variant: "minimal",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: MINIMAL_CONTENT,
    },
    priority: 75,
    description: "Terms of service - minimal layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.PRIVACY,
    config: {
      variant: "minimal",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: MINIMAL_CONTENT,
    },
    priority: 74,
    description: "Privacy policy - minimal layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.COOKIES,
    config: {
      variant: "minimal",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: MINIMAL_CONTENT,
    },
    priority: 73,
    description: "Cookie policy - minimal layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.GDPR,
    config: {
      variant: "minimal",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: MINIMAL_CONTENT,
    },
    priority: 72,
    description: "GDPR compliance - minimal layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.SECURITY,
    config: {
      variant: "minimal",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: MINIMAL_CONTENT,
    },
    priority: 71,
    description: "Security information - minimal layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.ACCESSIBILITY,
    config: {
      variant: "minimal",
      header: { show: true, variant: "minimal", showCTA: false },
      footer: MINIMAL_FOOTER,
      content: MINIMAL_CONTENT,
    },
    priority: 70,
    description: "Accessibility statement - minimal layout",
  },

  // ========================================
  // MARKETING PAGES - LANDING (Priority: 60-69)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.HOME,
    config: {
      variant: "hero",
      header: { show: true, variant: "transparent", showCTA: true },
      footer: DEFAULT_FOOTER,
      content: HERO_CONTENT,
    },
    priority: 69,
    description: "Homepage - hero layout with full-width sections",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.PRICING,
    config: {
      variant: "wide",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: WIDE_CONTENT,
    },
    priority: 68,
    description: "Pricing - wide layout for calculator",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.DEMO,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 67,
    description: "Demo request - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.CONTACT,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 66,
    description: "Contact page - standard layout",
  },

  // ========================================
  // MARKETING PAGES - FEATURES (Priority: 50-59)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.FEATURES_DETAIL,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 55,
    description: "Feature detail - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.FEATURES_LIST,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 54,
    description: "Features list - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.INDUSTRIES_DETAIL,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 53,
    description: "Industry detail - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.INDUSTRIES_LIST,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 52,
    description: "Industries list - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.INTEGRATIONS_DETAIL,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 51,
    description: "Integration detail - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.INTEGRATIONS_LIST,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 50,
    description: "Integrations list - standard layout",
  },

  // ========================================
  // MARKETING PAGES - COMPARISONS (Priority: 45-49)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.VS_DETAIL,
    config: {
      variant: "wide",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: WIDE_CONTENT,
    },
    priority: 46,
    description: "Comparison detail - wide layout for tables",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.VS_LIST,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 45,
    description: "Comparisons list - standard layout",
  },

  // ========================================
  // MARKETING PAGES - RESOURCES (Priority: 40-44)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.BLOG_POST,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: {
        ...STANDARD_CONTENT,
        maxWidth: "4xl", // Narrower for better readability
      },
    },
    priority: 44,
    description: "Blog post - standard layout, narrower width",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.BLOG_LIST,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 43,
    description: "Blog list - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.CASE_STUDIES,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 42,
    description: "Case studies - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.WEBINARS,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 41,
    description: "Webinars - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.TEMPLATES,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 40,
    description: "Templates - standard layout",
  },

  // ========================================
  // COMPANY PAGES (Priority: 30-39)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.ABOUT,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 35,
    description: "About - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.CAREERS,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 34,
    description: "Careers - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.PRESS,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 33,
    description: "Press - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.PARTNERS,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 32,
    description: "Partners - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.COMMUNITY,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 31,
    description: "Community - standard layout",
  },

  // ========================================
  // OTHER PAGES (Priority: 20-29)
  // ========================================

  {
    pattern: PUBLIC_ROUTE_PATTERNS.SITEMAP,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 25,
    description: "Sitemap - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.REVIEWS,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 24,
    description: "Reviews - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.IMPLEMENTATION,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 23,
    description: "Implementation - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.ROI,
    config: {
      variant: "wide",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: WIDE_CONTENT,
    },
    priority: 22,
    description: "ROI calculator - wide layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.SWITCH,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 21,
    description: "Switch guide - standard layout",
  },

  {
    pattern: PUBLIC_ROUTE_PATTERNS.FREE_TOOLS,
    config: {
      variant: "standard",
      header: DEFAULT_HEADER,
      footer: DEFAULT_FOOTER,
      content: STANDARD_CONTENT,
    },
    priority: 20,
    description: "Free tools - standard layout",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get public layout configuration for a given pathname
 */
export function getPublicLayoutConfig(pathname: string): PublicLayoutConfig {
  // Sort rules by priority (highest first)
  const sortedRules = [...PUBLIC_LAYOUT_RULES].sort(
    (a, b) => b.priority - a.priority
  );

  // Find first matching rule
  for (const rule of sortedRules) {
    if (rule.pattern.test(pathname)) {
      return rule.config;
    }
  }

  // Default fallback config
  return {
    variant: "standard",
    header: DEFAULT_HEADER,
    footer: DEFAULT_FOOTER,
    content: STANDARD_CONTENT,
  };
}

/**
 * Get CSS classes for content max-width
 */
export function getPublicMaxWidthClass(
  maxWidth: PublicContentConfig["maxWidth"]
): string {
  const widthMap = {
    full: "w-full",
    "screen-2xl": "max-w-screen-2xl",
    "screen-xl": "max-w-screen-xl",
    "7xl": "max-w-7xl",
    "6xl": "max-w-6xl",
    "5xl": "max-w-5xl",
    "4xl": "max-w-4xl",
    "3xl": "max-w-3xl",
    "2xl": "max-w-2xl",
    xl: "max-w-xl",
  };
  return widthMap[maxWidth || "full"];
}

/**
 * Get CSS classes for content padding
 */
export function getPublicPaddingClass(
  padding: PublicContentConfig["padding"]
): string {
  const paddingMap = {
    none: "",
    sm: "px-4 py-6",
    md: "px-4 py-8 sm:px-6 lg:px-8",
    lg: "px-6 py-12 sm:px-8 lg:px-12",
    xl: "px-8 py-16 sm:px-12 lg:px-16",
  };
  return paddingMap[padding || "md"];
}

/**
 * Get CSS classes for content padding Y
 */
export function getPublicPaddingYClass(
  paddingY: PublicContentConfig["paddingY"]
): string {
  const paddingYMap = {
    none: "",
    sm: "py-6",
    md: "py-8 sm:py-12",
    lg: "py-12 sm:py-16",
    xl: "py-16 sm:py-24",
  };
  return paddingYMap[paddingY || "md"];
}

/**
 * Get CSS classes for content background
 */
export function getPublicBackgroundClass(
  background: PublicContentConfig["background"]
): string {
  const backgroundMap = {
    default: "bg-background",
    muted: "bg-muted/30",
    gradient: "bg-gradient-to-br from-primary/5 via-background to-background",
    pattern:
      "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
    transparent: "bg-transparent",
  };
  return backgroundMap[background || "default"];
}

/**
 * Get CSS classes for min-height
 */
export function getPublicMinHeightClass(
  minHeight: PublicContentConfig["minHeight"]
): string {
  const minHeightMap = {
    none: "",
    screen: "min-h-screen",
    "screen-header": "min-h-[calc(100vh-4rem)]", // Assuming header is 4rem
  };
  return minHeightMap[minHeight || "none"];
}
