/**
 * Unified Layout Configuration System
 *
 * This file consolidates ALL layout configuration including:
 * - Page structure (maxWidth, padding, gap, fixedHeight)
 * - Header configuration (global navigation bar)
 * - Toolbar configuration (page-specific title/actions)
 * - Left sidebar configuration
 * - Right sidebar configuration
 *
 * Benefits:
 * - Single source of truth for layout
 * - Type-safe configuration
 * - Centralized route patterns
 * - Easy to add new pages
 * - No duplicate logic
 *
 * Architecture:
 * - Route patterns defined once in ROUTE_PATTERNS
 * - Configurations use these patterns
 * - Priority-based matching (higher priority checked first)
 * - Type-safe with comprehensive TypeScript types
 */

import Link from "next/link";
import type { ReactNode } from "react";
// Toolbar action components
import { CommunicationToolbarActions } from "@/components/communication/communication-toolbar-actions";
import { CustomerDetailBreadcrumbs } from "@/components/customers/customer-detail-breadcrumbs";
import { CustomerDetailToolbar } from "@/components/customers/customer-detail-toolbar";
import { CustomersToolbarActions } from "@/components/customers/customers-toolbar-actions";
// Toolbar breadcrumb components
import { CategoryBreadcrumbs } from "@/components/pricebook/category-breadcrumbs";
import { ScheduleToolbarActions } from "@/components/schedule/schedule-toolbar-actions";
import { ShopToolbarActions } from "@/components/shop/shop-toolbar-actions";
import { Button } from "@/components/ui/button";
import { EstimateDetailToolbarActions } from "@/components/work/estimate-detail-toolbar-actions";
import { EstimateToolbarActions } from "@/components/work/estimate-toolbar-actions";
import { InvoiceToolbarActions } from "@/components/work/invoice-toolbar-actions";
import { InvoicesListToolbarActions } from "@/components/work/invoices-list-toolbar-actions";
import { ItemDetailToolbarWrapper } from "@/components/work/item-detail-toolbar-wrapper";
import { JobDetailBreadcrumbs } from "@/components/work/job-details/job-detail-breadcrumbs";
import { JobDetailToolbarWrapper } from "@/components/work/job-details/job-detail-toolbar-wrapper";
import { ContractToolbarActions } from "@/components/work/contract-toolbar-actions";
import { MaintenancePlanToolbarActions } from "@/components/work/maintenance-plan-toolbar-actions";
import { ServiceAgreementToolbarActions } from "@/components/work/service-agreement-toolbar-actions";
import { PriceBookToolbarActions } from "@/components/work/pricebook-toolbar-actions";
import { WorkToolbarActions } from "@/components/work/work-toolbar-actions";
import { AppointmentsToolbarActions } from "@/components/work/appointments-toolbar-actions";
import { PaymentsToolbarActions } from "@/components/work/payments-toolbar-actions";
import { MaterialsToolbarActions } from "@/components/inventory/materials-toolbar-actions";
import { EquipmentToolbarActions } from "@/components/inventory/equipment-toolbar-actions";
import { PurchaseOrderToolbarActions } from "@/components/work/purchase-order-toolbar-actions";
import { TeamToolbarActions } from "@/components/work/team-toolbar-actions";
import { TeamMemberDetailBreadcrumbs } from "@/components/work/team-member-detail-breadcrumbs";
import { TeamMemberDetailToolbar } from "@/components/work/team-member-detail-toolbar";
import type { SidebarConfig } from "@/lib/sidebar/types";

// ============================================================================
// CENTRALIZED ROUTE PATTERNS
// Single source of truth - no duplication!
// ============================================================================

export const ROUTE_PATTERNS = {
  // Dashboard root
  DASHBOARD_ROOT: /^\/dashboard$/,

  // Onboarding Welcome (no chrome)
  WELCOME: /^\/dashboard\/welcome$/,

  // TV Display
  TV_DISPLAY: /^\/dashboard\/tv$/,

  // AI Routes
  AI_ROOT: /^\/dashboard\/ai$/,
  AI_SUBPAGES: /^\/dashboard\/ai\//,

  // Work Routes
  WORK_ROOT: /^\/dashboard\/work$/,
  WORK_SCHEDULE: /^\/dashboard\/schedule/,
  WORK_INVOICES_LIST: /^\/dashboard\/work\/invoices$/,
  WORK_INVOICES_DETAILS: /^\/dashboard\/work\/invoices\/[^/]+$/,
  WORK_ESTIMATES_LIST: /^\/dashboard\/work\/estimates$/,
  WORK_APPOINTMENTS_LIST: /^\/dashboard\/work\/appointments$/,
  WORK_APPOINTMENTS_DETAIL: /^\/dashboard\/work\/appointments\/[^/]+$/,
  WORK_PAYMENTS_LIST: /^\/dashboard\/work\/payments$/,
  WORK_PAYMENTS_DETAIL: /^\/dashboard\/work\/payments\/[^/]+$/,
  WORK_ESTIMATES_DETAIL: /^\/dashboard\/work\/estimates\/[^/]+$/,
  WORK_MAINTENANCE_PLANS_DETAIL: /^\/dashboard\/work\/maintenance-plans\/[^/]+$/,
  WORK_SERVICE_AGREEMENTS_DETAIL: /^\/dashboard\/work\/service-agreements\/[^/]+$/,
  WORK_EQUIPMENT_DETAIL: /^\/dashboard\/work\/equipment\/[^/]+$/,
  WORK_CONTRACTS_LIST: /^\/dashboard\/work\/contracts$/,
  WORK_CONTRACTS_DETAIL: /^\/dashboard\/work\/contracts\/[^/]+$/,
  WORK_PURCHASE_ORDERS_LIST: /^\/dashboard\/work\/purchase-orders$/,
  WORK_TEAM_LIST: /^\/dashboard\/work\/team$/,
  WORK_TEAM_MEMBER_DETAIL: /^\/dashboard\/work\/team\/[^/]+$/,
  WORK_PRICEBOOK_LIST: /^\/dashboard\/work\/pricebook$/,
  WORK_PRICEBOOK_CATEGORIES: /^\/dashboard\/work\/pricebook\/c\//,
  WORK_PRICEBOOK_NEW: /^\/dashboard\/work\/pricebook\/new$/,
  WORK_PRICEBOOK_EXPORT: /^\/dashboard\/work\/pricebook\/export$/,
  WORK_PRICEBOOK_IMPORT: /^\/dashboard\/work\/pricebook\/import$/,
  WORK_PRICEBOOK_MASS_UPDATE: /^\/dashboard\/work\/pricebook\/mass-update$/,
  WORK_PRICEBOOK_DETAILS:
    /^\/dashboard\/work\/pricebook\/(?!new|export|import|mass-update|c\/)([^/]+)$/,
  // Purchase order details
  PURCHASE_ORDER_DETAILS: /^\/dashboard\/work\/purchase-orders\/[^/]+$/,
  // Job details - excludes known work subpages (schedule moved to /dashboard/schedule)
  JOB_DETAILS:
    /^\/dashboard\/work\/(?!invoices|pricebook|estimates|contracts|purchase-orders|maintenance-plans|service-agreements|tickets|materials|equipment|appointments|payments|team)([^/]+)$/,

  // Communication
  COMMUNICATION_DETAIL:
    /^\/dashboard\/communication\/(?!unread|starred|archive|trash|spam|teams|feed)[^/]+$/,
  COMMUNICATION: /^\/dashboard\/communication/,

  // Customers
  CUSTOMERS_LIST: /^\/dashboard\/customers$/,
  CUSTOMER_DETAIL: /^\/dashboard\/customers\/[^/]+$/,

  // Finance
  FINANCE_ROOT: /^\/dashboard\/finance$/,
  FINANCE_SUBPAGES: /^\/dashboard\/finance\//,

  // Reporting
  REPORTING: /^\/dashboard\/reporting/,

  // Marketing
  MARKETING: /^\/dashboard\/marketing/,

  // Shop
  SHOP_LIST: /^\/dashboard\/shop$/,
  SHOP_PRODUCT_DETAILS: /^\/dashboard\/shop\/[^/]+$/,

  // Training & Automation
  TRAINING_AUTOMATION: /^\/dashboard\/(automation|training)/,

  // Organization Creation (now uses welcome/onboarding page)
  ORGANIZATION_CREATE: /^\/dashboard\/welcome$/,

  // Add/Edit/Create Pages (Wizard-style full-screen experiences)
  JOB_CREATE: /^\/dashboard\/work\/(jobs\/)?new$/,
  CUSTOMER_NEW: /^\/dashboard\/customers\/new$/,
  CUSTOMER_EDIT: /^\/dashboard\/customers\/[^/]+\/edit$/,
  INVOICE_CREATE: /^\/dashboard\/invoices\/create$/,
  CONTRACT_NEW: /^\/dashboard\/work\/contracts\/new$/,
  PRICEBOOK_NEW: /^\/dashboard\/work\/pricebook\/new$/,

  // Catch-all for any dashboard page
  DASHBOARD_CATCHALL: /^\/dashboard/,
} as const;

// ============================================================================
// UNIFIED LAYOUT CONFIGURATION TYPES
// ============================================================================

/**
 * Header configuration (global navigation bar at top)
 */
export type HeaderConfig = {
  /** Whether to show the header */
  show: boolean;
  /** Header variant - minimal shows logo only */
  variant?: "default" | "minimal";
};

/**
 * Toolbar configuration (page-specific toolbar below header)
 */
export type ToolbarConfig = {
  /** Whether to show the toolbar */
  show: boolean;
  /** Toolbar title */
  title?: string;
  /** Toolbar subtitle */
  subtitle?: string;
  /** Toolbar action buttons (React component) */
  actions?: ReactNode;
  /** Breadcrumb navigation (React component) */
  breadcrumbs?: ReactNode;
  /** Whether to show search bar */
  showSearch?: boolean;
};

/**
 * Left sidebar configuration
 */
export type LeftSidebarConfig = {
  /** Whether to show the left sidebar */
  show: boolean;
  /** Sidebar variant */
  variant?: "standard" | "compact";
  /** Custom sidebar configuration */
  customConfig?: SidebarConfig;
};

/**
 * Right sidebar configuration
 */
export type RightSidebarConfig = {
  /** Whether to show the right sidebar */
  show: boolean;
  /** Which sidebar component to render */
  component?: "invoice" | "pricebook" | "generic" | string;
  /** Sidebar width in pixels */
  width?: number;
  /** Whether sidebar can be collapsed */
  collapsible?: boolean;
  /** Whether sidebar is open by default */
  defaultOpen?: boolean;
};

/**
 * Page structure configuration
 */
export type PageStructureVariant = "default" | "detail";

export type PageStructureBackground =
  | "default"
  | "muted"
  | "subtle"
  | "transparent";

export type PageStructureInsetPadding = "none" | "sm" | "md" | "lg";

export type PageStructureConfig = {
  /** Max width constraint */
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
  /** Padding on all sides */
  padding?: "none" | "sm" | "md" | "lg";
  /** Padding on X axis (overrides padding) */
  paddingX?: "none" | "sm" | "md" | "lg";
  /** Padding on Y axis (overrides padding) */
  paddingY?: "none" | "sm" | "md" | "lg";
  /** Gap between elements */
  gap?: "none" | "sm" | "md" | "lg";
  /** Whether content area has fixed height */
  fixedHeight?: boolean;
  /** Layout variant for specialized styling */
  variant?: PageStructureVariant;
  /** Background treatment for the content area */
  background?: PageStructureBackground;
  /** Additional inset padding applied to the main container */
  insetPadding?: PageStructureInsetPadding;
};

/**
 * Complete unified layout configuration
 * Includes all layout elements in one type
 */
export type UnifiedLayoutConfig = {
  /** Page structure settings */
  structure: PageStructureConfig;
  /** Header (global navigation) configuration */
  header: HeaderConfig;
  /** Toolbar (page-specific) configuration */
  toolbar: ToolbarConfig;
  /** Left sidebar configuration */
  sidebar: LeftSidebarConfig;
  /** Right sidebar configuration */
  rightSidebar?: RightSidebarConfig;
};

/**
 * Layout rule with pattern matching and priority
 */
export type LayoutRule = {
  /** Route pattern to match */
  pattern: RegExp;
  /** Unified layout configuration */
  config: UnifiedLayoutConfig;
  /** Priority (higher = checked first) */
  priority: number;
  /** Optional description for documentation */
  description?: string;
};

// ============================================================================
// DEFAULT CONFIGURATIONS
// Reusable config objects for common patterns
// ============================================================================

const DEFAULT_STRUCTURE: PageStructureConfig = {
  maxWidth: "full",
  padding: "md",
  gap: "md",
  fixedHeight: false,
  variant: "default",
  background: "default",
  insetPadding: "none",
};

const DEFAULT_HEADER: HeaderConfig = {
  show: true,
  variant: "default",
};

const DEFAULT_TOOLBAR: ToolbarConfig = {
  show: true,
};

const DEFAULT_SIDEBAR: LeftSidebarConfig = {
  show: true,
  variant: "standard",
};

// Full width page structure (for data tables, etc.)
// STANDARDIZED: All list pages use this structure
const FULL_WIDTH_STRUCTURE: PageStructureConfig = {
  maxWidth: "full",
  padding: "none",
  gap: "none",
  fixedHeight: true,
  variant: "default",
  background: "default",
  insetPadding: "none",
};

// STANDARDIZED: All detail pages use this structure
// This ensures consistent layout across all detail pages (customers, jobs, invoices, properties, etc.)
const DETAIL_PAGE_STRUCTURE: PageStructureConfig = {
  maxWidth: "full",
  padding: "none",
  gap: "lg",
  fixedHeight: false,
  variant: "detail",
  background: "default",
  insetPadding: "md",
};

// ============================================================================
// UNIFIED LAYOUT RULES
// All layout configurations in priority order
// ============================================================================

export const UNIFIED_LAYOUT_RULES: LayoutRule[] = [
  // ========================================
  // SPECIAL CASES (Highest Priority: 100+)
  // ========================================

  {
    pattern: ROUTE_PATTERNS.DASHBOARD_ROOT,
    config: {
      structure: {
        maxWidth: "7xl",
        padding: "md",
        gap: "md",
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: false, // Dashboard has custom header, no toolbar
      },
      sidebar: {
        show: false, // Dashboard has its own layout
      },
    },
    priority: 110,
    description: "Main dashboard page with custom layout",
  },

  {
    pattern: ROUTE_PATTERNS.WELCOME,
    config: {
      structure: {
        maxWidth: "4xl",
        padding: "lg",
        gap: "md",
      },
      header: {
        show: false, // No header for onboarding
      },
      toolbar: {
        show: false, // No toolbar for onboarding
      },
      sidebar: {
        show: false, // No sidebar for onboarding
      },
    },
    priority: 105,
    description: "Onboarding welcome page - clean, no chrome",
  },

  {
    pattern: ROUTE_PATTERNS.TV_DISPLAY,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 100,
    description: "TV display mode - no chrome",
  },

  {
    pattern: ROUTE_PATTERNS.ORGANIZATION_CREATE,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 99,
    description: "Organization creation wizard - full page experience",
  },

  // ========================================
  // CREATION/EDIT WIZARDS (Priority: 95-98)
  // Full-screen experiences for creating/editing entities
  // ========================================

  {
    pattern: ROUTE_PATTERNS.JOB_CREATE,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 98,
    description: "Job creation wizard - full page experience",
  },

  {
    pattern: ROUTE_PATTERNS.CUSTOMER_NEW,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 97,
    description: "Customer creation wizard - full page experience",
  },

  {
    pattern: ROUTE_PATTERNS.CUSTOMER_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        breadcrumbs: <CustomerDetailBreadcrumbs />,
        title: "Customer Details",
        actions: <CustomerDetailToolbar />,
      },
      sidebar: { show: false },
    },
    priority: 98,
    description:
      "Customer detail page with inline editing - full width no sidebars",
  },

  {
    pattern: ROUTE_PATTERNS.CUSTOMER_EDIT,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 97,
    description: "Customer edit wizard - full page experience",
  },

  {
    pattern: ROUTE_PATTERNS.INVOICE_CREATE,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 96,
    description: "Invoice creation wizard - full page experience",
  },

  {
    pattern: ROUTE_PATTERNS.CONTRACT_NEW,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 96,
    description: "Contract creation wizard - full page experience",
  },

  {
    pattern: ROUTE_PATTERNS.PRICEBOOK_NEW,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: { show: false },
      toolbar: { show: false },
      sidebar: { show: false },
    },
    priority: 96,
    description: "Pricebook item creation wizard - full page experience",
  },

  {
    pattern: ROUTE_PATTERNS.AI_ROOT,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: process.env.NEXT_PUBLIC_APP_ENV !== "production",
      },
      header: {
        show: process.env.NEXT_PUBLIC_APP_ENV === "production",
      },
      toolbar: {
        show: false,
        title: "AI Assistant",
      },
      sidebar: { show: false },
    },
    priority: 100,
    description: "AI chat interface",
  },

  {
    pattern: ROUTE_PATTERNS.AI_SUBPAGES,
    config: {
      structure: {
        maxWidth: "7xl",
        padding: "none",
        gap: "lg",
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: false,
        title: "AI Assistant",
      },
      sidebar: { show: false },
    },
    priority: 90,
    description: "AI sub-pages",
  },

  // ========================================
  // RIGHT SIDEBAR PAGES (Priority: 70-80)
  // ========================================

  {
    pattern: ROUTE_PATTERNS.WORK_PRICEBOOK_LIST,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: false,
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Price Book",
        subtitle: "Manage services, materials, and equipment pricing",
        actions: <PriceBookToolbarActions />,
      },
      sidebar: {
        show: true,
        variant: "standard",
        customConfig: {
          width: "20rem",
        },
      },
    },
    priority: 77,
    description: "Price book with table view",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_PRICEBOOK_CATEGORIES,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: false,
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        breadcrumbs: <CategoryBreadcrumbs />,
        actions: <PriceBookToolbarActions />,
      },
      sidebar: {
        show: true,
        variant: "standard",
        customConfig: {
          width: "20rem",
        },
      },
    },
    priority: 78,
    description: "Price book category drill-down pages",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_PRICEBOOK_EXPORT,
    config: {
      structure: DEFAULT_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Bulk Export",
        subtitle: "Export price book items to CSV, Excel, or PDF",
        actions: (
          <Link href="/dashboard/work/pricebook">
            <Button size="sm" variant="outline">
              Back to Price Book
            </Button>
          </Link>
        ),
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 77,
    description: "Price book bulk export page",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_PRICEBOOK_IMPORT,
    config: {
      structure: DEFAULT_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Bulk Import",
        subtitle: "Import price book items from CSV or Excel",
        actions: (
          <Link href="/dashboard/work/pricebook">
            <Button size="sm" variant="outline">
              Back to Price Book
            </Button>
          </Link>
        ),
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 77,
    description: "Price book bulk import page",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_PRICEBOOK_MASS_UPDATE,
    config: {
      structure: DEFAULT_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Mass Price Update",
        subtitle: "Bulk adjust prices for multiple items",
        actions: (
          <Link href="/dashboard/work/pricebook">
            <Button size="sm" variant="outline">
              Back to Price Book
            </Button>
          </Link>
        ),
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 77,
    description: "Price book mass price update page",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_PRICEBOOK_DETAILS,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Item Details",
        subtitle: "View and manage price book item",
        actions: <ItemDetailToolbarWrapper />,
      },
      sidebar: {
        show: true,
        variant: "standard",
        customConfig: {
          width: "20rem",
        },
      },
      rightSidebar: {
        show: true,
        component: "pricebook",
        width: 320,
        collapsible: true,
        defaultOpen: true,
      },
    },
    priority: 76,
    description: "Price book item details with right sidebar tools",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_INVOICES_DETAILS,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Invoice Editor",
        subtitle: "Edit invoice details and manage payments",
        actions: <InvoiceToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
      rightSidebar: {
        show: true,
        component: "invoice",
        width: 380,
        collapsible: true,
        defaultOpen: true,
      },
    },
    priority: 75,
    description: "Invoice editor with options sidebar and payment management",
  },

  // ========================================
  // WORK SECTION (Priority: 50-70)
  // ========================================

  {
    pattern: ROUTE_PATTERNS.WORK_SCHEDULE,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: true,
      },
      header: {
        show: false, // Full screen - no header
      },
      toolbar: {
        show: false, // Full screen - no toolbar
      },
      sidebar: {
        show: false, // Full screen - no sidebar
      },
    },
    priority: 70,
    description: "Schedule/calendar view - full screen",
  },

  {
    pattern: ROUTE_PATTERNS.WORK_ROOT,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Job Flow",
        subtitle: "81 total jobs today",
        actions: <WorkToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 50,
    description: "Work hub/job board",
  },

  // Purchase order details pages
  {
    pattern: ROUTE_PATTERNS.PURCHASE_ORDER_DETAILS,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: false, // Purchase order details page has its own header, no toolbar needed
      },
      sidebar: {
        show: false,
      },
    },
    priority: 57,
    description:
      "Purchase order details page - full width with custom header, no toolbar",
  },

  // Job details pages
  {
    pattern: ROUTE_PATTERNS.JOB_DETAILS,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        breadcrumbs: <JobDetailBreadcrumbs />,
        title: "Job Details",
        actions: <JobDetailToolbarWrapper />,
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Job detail pages - full width with toolbar and back button",
  },

  // Appointments detail page
  {
    pattern: ROUTE_PATTERNS.WORK_APPOINTMENTS_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Appointment Details",
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Appointment detail page - full width with toolbar",
  },

  // Payments detail page
  {
    pattern: ROUTE_PATTERNS.WORK_PAYMENTS_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Payment Details",
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Payment detail page - full width with toolbar",
  },

  // Estimates detail page
  {
    pattern: ROUTE_PATTERNS.WORK_ESTIMATES_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Estimate Details",
        actions: <EstimateDetailToolbarActions />,
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Estimate detail page - full width with toolbar",
  },

  // Maintenance Plans detail page
  {
    pattern: ROUTE_PATTERNS.WORK_MAINTENANCE_PLANS_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Maintenance Plan Details",
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Maintenance plan detail page - full width with toolbar",
  },

  // Service Agreements detail page
  {
    pattern: ROUTE_PATTERNS.WORK_SERVICE_AGREEMENTS_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Service Agreement Details",
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Service agreement detail page - full width with toolbar",
  },

  // Equipment detail page
  {
    pattern: ROUTE_PATTERNS.WORK_EQUIPMENT_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Equipment Details",
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Equipment detail page - full width with toolbar",
  },

  // Contracts detail page
  {
    pattern: ROUTE_PATTERNS.WORK_CONTRACTS_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Contract Details",
      },
      sidebar: {
        show: false,
      },
    },
    priority: 56,
    description: "Contract detail page - full width with toolbar",
  },

  // Invoices list page (specific config with toolbar actions)
  {
    pattern: ROUTE_PATTERNS.WORK_INVOICES_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Invoices",
        subtitle: "Create, track, and manage customer invoices",
        actions: <InvoicesListToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Invoices list page with view switcher in toolbar",
  },

  // Appointments list page
  {
    pattern: ROUTE_PATTERNS.WORK_APPOINTMENTS_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Appointments",
        subtitle: "Manage customer appointments and schedules",
        actions: <AppointmentsToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Appointments list page with view switcher in toolbar",
  },

  // Payments list page
  {
    pattern: ROUTE_PATTERNS.WORK_PAYMENTS_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Payments",
        subtitle: "Track and manage customer payments",
        actions: <PaymentsToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Payments list page with view switcher in toolbar",
  },

  // Estimates list page
  {
    pattern: ROUTE_PATTERNS.WORK_ESTIMATES_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Estimates",
        subtitle: "Create and manage project estimates and quotes",
        actions: <EstimateToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Estimates list page with view switcher in toolbar",
  },

  // Contracts list page
  {
    pattern: ROUTE_PATTERNS.WORK_CONTRACTS_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Contracts",
        subtitle: "Create and manage digital contracts and agreements",
        actions: <ContractToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Contracts list page with view switcher in toolbar",
  },

  // Maintenance Plans list page
  {
    pattern: /^\/dashboard\/work\/maintenance-plans$/,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Maintenance Plans",
        subtitle: "Manage recurring maintenance contracts and schedules",
        actions: <MaintenancePlanToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Maintenance plans list page with view switcher in toolbar",
  },

  // Service Agreements list page
  {
    pattern: /^\/dashboard\/work\/service-agreements$/,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Service Agreements",
        subtitle: "Manage customer service contracts and warranties",
        actions: <ServiceAgreementToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Service agreements list page with view switcher in toolbar",
  },

  // Materials list page
  {
    pattern: /^\/dashboard\/work\/materials$/,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Materials Inventory",
        subtitle: "Track and manage company materials, parts, and supplies",
        actions: <MaterialsToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Materials list page with view switcher in toolbar",
  },

  // Equipment list page
  {
    pattern: /^\/dashboard\/work\/equipment$/,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Equipment & Tools",
        subtitle: "Track company equipment, tools, and vehicles",
        actions: <EquipmentToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Equipment list page with view switcher in toolbar",
  },

  // Purchase Orders list page
  {
    pattern: ROUTE_PATTERNS.WORK_PURCHASE_ORDERS_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Purchase Orders",
        subtitle: "Manage vendor orders and track inventory purchases",
        actions: <PurchaseOrderToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Purchase orders list page with view switcher in toolbar",
  },

  // Team list page
  {
    pattern: ROUTE_PATTERNS.WORK_TEAM_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Team Members",
        subtitle: "Manage team members, roles, and permissions",
        actions: <TeamToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Team members list page with view switcher in toolbar",
  },

  // Team member detail page
  {
    pattern: ROUTE_PATTERNS.WORK_TEAM_MEMBER_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        breadcrumbs: <TeamMemberDetailBreadcrumbs />,
        title: "Team Member Details",
        actions: <TeamMemberDetailToolbar />,
      },
      sidebar: {
        show: false,
      },
    },
    priority: 57,
    description: "Team member detail page - full width with toolbar, no sidebar",
  },

  // Other work list pages
  {
    pattern:
      /^\/dashboard\/work\/(pricebook)/,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: DEFAULT_TOOLBAR,
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 55,
    description: "Work list pages (pricebook)",
  },

  // ========================================
  // OTHER MAJOR SECTIONS (Priority: 60-65)
  // ========================================

  {
    pattern: ROUTE_PATTERNS.COMMUNICATION_DETAIL,
    config: {
      structure: DETAIL_PAGE_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Message Details",
        actions: <CommunicationToolbarActions />,
      },
      sidebar: {
        show: true,
        variant: "compact",
        customConfig: {
          width: "16rem",
        },
      },
    },
    priority: 66,
    description: "Email/message detail view with back button",
  },

  {
    pattern: ROUTE_PATTERNS.COMMUNICATION,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Communications",
        actions: <CommunicationToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 65,
    description: "Communication hub",
  },

  // Customers list page
  {
    pattern: ROUTE_PATTERNS.CUSTOMERS_LIST,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Customers",
        subtitle: "Manage customer relationships and contacts",
        actions: <CustomersToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 64,
    description: "Customers list page with view switcher",
  },

  {
    pattern: ROUTE_PATTERNS.REPORTING,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: false,
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: false,
      },
      sidebar: {
        show: false,
      },
    },
    priority: 63,
    description: "Reports and analytics - Coming Soon layout",
  },

  {
    pattern: ROUTE_PATTERNS.FINANCE_ROOT,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: false,
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: false,
      },
      sidebar: {
        show: false,
      },
    },
    priority: 63,
    description: "Finance dashboard - Coming Soon layout",
  },

  {
    pattern: ROUTE_PATTERNS.FINANCE_SUBPAGES,
    config: {
      structure: {
        maxWidth: "full",
        padding: "none",
        gap: "none",
        fixedHeight: false,
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: false,
      },
      sidebar: {
        show: false,
      },
    },
    priority: 62,
    description: "Finance sub-pages - Coming Soon layout",
  },

  {
    pattern: ROUTE_PATTERNS.MARKETING,
    config: {
      structure: FULL_WIDTH_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Marketing",
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 61,
    description: "Marketing hub",
  },

  {
    pattern: ROUTE_PATTERNS.TRAINING_AUTOMATION,
    config: {
      structure: {
        maxWidth: "7xl",
        padding: "none",
        gap: "lg",
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: false,
      },
      sidebar: { show: false },
    },
    priority: 60,
    description: "Training and automation pages",
  },

  // ========================================
  // CUSTOMERS & SHOP (Priority: 50-57)
  // ========================================

  {
    pattern: ROUTE_PATTERNS.SHOP_PRODUCT_DETAILS,
    config: {
      structure: {
        maxWidth: "7xl",
        padding: "none",
        gap: "lg",
        fixedHeight: false,
        variant: "detail",
        background: "default",
        insetPadding: "md",
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Product Details",
        actions: <ShopToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 56,
    description: "Shop product details",
  },

  {
    pattern: ROUTE_PATTERNS.SHOP_LIST,
    config: {
      structure: {
        maxWidth: "full",
        padding: "md",
        gap: "md",
      },
      header: DEFAULT_HEADER,
      toolbar: {
        show: true,
        title: "Thorbis Shop",
        subtitle: "Essential tools and supplies for your business",
        actions: <ShopToolbarActions />,
      },
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 57,
    description: "Shop listing page",
  },

  // ========================================
  // DEFAULT FALLBACK (Priority: 0)
  // ========================================

  {
    pattern: ROUTE_PATTERNS.DASHBOARD_CATCHALL,
    config: {
      structure: DEFAULT_STRUCTURE,
      header: DEFAULT_HEADER,
      toolbar: DEFAULT_TOOLBAR,
      sidebar: DEFAULT_SIDEBAR,
    },
    priority: 0,
    description: "Default layout for all other dashboard pages",
  },
];

// ============================================================================
// CONFIGURATION GETTER FUNCTION
// ============================================================================

/**
 * Get unified layout configuration for a given pathname
 * Checks rules in priority order (highest first)
 *
 * @param pathname - Current route pathname
 * @returns Complete unified layout configuration
 */
export function getUnifiedLayoutConfig(pathname: string): UnifiedLayoutConfig {
  // Sort rules by priority (highest first)
  const sortedRules = [...UNIFIED_LAYOUT_RULES].sort(
    (a, b) => b.priority - a.priority
  );

  // Find first matching rule
  for (const rule of sortedRules) {
    if (rule.pattern.test(pathname)) {
      return rule.config;
    }
  }

  // Should never reach here due to catch-all rule, but TypeScript needs this
  return {
    structure: DEFAULT_STRUCTURE,
    header: DEFAULT_HEADER,
    toolbar: DEFAULT_TOOLBAR,
    sidebar: DEFAULT_SIDEBAR,
  };
}

// ============================================================================
// HELPER FUNCTIONS (from old layout-config.ts)
// ============================================================================

export function getMaxWidthClass(
  maxWidth: PageStructureConfig["maxWidth"]
): string {
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
  padding: PageStructureConfig["padding"],
  paddingX?: PageStructureConfig["paddingX"],
  paddingY?: PageStructureConfig["paddingY"]
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
  padding: PageStructureConfig["paddingX"] | PageStructureConfig["padding"]
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
  padding: PageStructureConfig["paddingY"] | PageStructureConfig["padding"]
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

export function getGapClass(gap: PageStructureConfig["gap"]): string {
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

export function getBackgroundClass(
  background: PageStructureConfig["background"]
): string {
  switch (background) {
    case "muted":
      return "bg-muted";
    case "subtle":
      return "bg-muted/40";
    case "transparent":
      return "bg-transparent";
    default:
      return "bg-background";
  }
}

export function getInsetPaddingClass(
  insetPadding: PageStructureConfig["insetPadding"]
): string {
  switch (insetPadding) {
    case "sm":
      return "px-4 py-4";
    case "md":
      return "px-6 py-6";
    case "lg":
      return "px-8 py-8";
    default:
      return "";
  }
}
