/**
 * Job Details Layout Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 *
 * This store manages the customizable widget-based layout for job details pages.
 * Users can drag-and-drop widgets, resize them, and save their preferred layout.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Widget Types and Definitions
// ============================================================================

/**
 * Available widget types for job details page
 */
export type JobWidgetType =
  // Core job information
  | "job-header"
  | "job-timeline"
  | "job-financials"
  | "job-details"

  // Property and customer
  | "property-details"
  | "property-enrichment"
  | "customer-info"
  | "location-map"

  // Financial
  | "invoices"
  | "estimates"
  | "job-costing"
  | "profitability"
  | "payment-tracker"

  // Project management
  | "schedule"
  | "team-assignments"
  | "materials-list"
  | "equipment-list"
  | "purchase-orders"

  // Documentation
  | "photos"
  | "documents"
  | "permits"
  | "communications"
  | "activity-log"

  // Industry-specific
  | "hvac-equipment"
  | "plumbing-fixtures"
  | "electrical-panels"
  | "roofing-materials"
  | "landscape-zones"

  // Analytics
  | "time-tracking"
  | "labor-hours"
  | "material-costs"
  | "change-orders";

/**
 * Widget configuration
 */
export interface JobWidget {
  id: string;
  type: JobWidgetType;
  title: string;
  description?: string;

  // Layout properties
  position: {
    x: number; // Grid column position (0-based)
    y: number; // Grid row position (0-based)
  };
  size: {
    width: number; // 1 = half-width, 2+ = full-width
    height: number; // Height in rows (auto-flows with content)
  };

  // Widget behavior
  isVisible: boolean;
  isCollapsible: boolean; // Deprecated - no longer used
  isCollapsed: boolean; // Deprecated - no longer used
  isResizable: boolean; // Not implemented
  isDraggable: boolean;

  // Widget-specific settings
  settings?: Record<string, unknown>;
  // PERFORMANCE: Skip hydration to prevent SSR mismatches
  // Allows Next.js to generate static pages without Zustand errors
  skipHydration?: true,
}

/**
 * Industry-specific preset layouts
 */
export type IndustryType =
  | "hvac"
  | "plumbing"
  | "electrical"
  | "roofing"
  | "landscaping"
  | "general_contractor"
  | "remodeling"
  | "commercial"
  | "custom";

/**
 * Layout preset configuration
 */
export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  industry: IndustryType;
  widgets: JobWidget[];
  thumbnail?: string;
}

// ============================================================================
// Default Widget Configurations
// ============================================================================

/**
 * Default widget metadata
 */
export const WIDGET_METADATA: Record<
  JobWidgetType,
  {
    title: string;
    description: string;
    minSize: { width: number; height: number };
    defaultSize: { width: number; height: number };
    maxSize: { width: number; height: number };
    category:
      | "core"
      | "financial"
      | "project"
      | "documentation"
      | "analytics"
      | "industry";
    industries: IndustryType[]; // Which industries typically use this
  }
> = {
  // Core job information
  "job-header": {
    title: "Job Header",
    description: "Job number, title, status, and priority",
    minSize: { width: 4, height: 1 },
    defaultSize: { width: 4, height: 1 },
    maxSize: { width: 4, height: 1 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "job-timeline": {
    title: "Process Timeline",
    description: "Visual timeline of job progress stages",
    minSize: { width: 2, height: 1 },
    defaultSize: { width: 4, height: 1 },
    maxSize: { width: 4, height: 2 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "job-financials": {
    title: "Financial Summary",
    description: "Quick overview of job finances",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 1, height: 1 }, // Half-width
    maxSize: { width: 2, height: 1 },
    category: "financial",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "job-details": {
    title: "Job Information",
    description: "Detailed job information and notes",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 2, height: 1 }, // Full-width
    maxSize: { width: 2, height: 1 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },

  // Property and customer
  "property-details": {
    title: "Property Details",
    description: "Basic property information",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 1, height: 1 }, // Half-width
    maxSize: { width: 2, height: 1 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "property-enrichment": {
    title: "Property Intelligence",
    description: "Enriched property data (ownership, permits, tax info)",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 1, height: 1 }, // Half-width
    maxSize: { width: 2, height: 1 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "customer-info": {
    title: "Customer Information",
    description: "Customer contact and billing details",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 1, height: 1 }, // Half-width
    maxSize: { width: 2, height: 1 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "location-map": {
    title: "Location Map",
    description: "Interactive map with property location",
    minSize: { width: 1, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "core",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },

  // Financial
  invoices: {
    title: "Invoices",
    description: "Job invoices and payment history",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "financial",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  estimates: {
    title: "Estimates",
    description: "Job estimates and quotes",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "financial",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "job-costing": {
    title: "Job Costing",
    description: "Detailed cost breakdown by category",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "financial",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  profitability: {
    title: "Profitability Analysis",
    description: "Profit margin and revenue analysis",
    minSize: { width: 1, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "financial",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "payment-tracker": {
    title: "Payment Tracker",
    description: "Visual payment progress and reminders",
    minSize: { width: 1, height: 1 },
    defaultSize: { width: 1, height: 2 },
    maxSize: { width: 2, height: 3 },
    category: "financial",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },

  // Project management
  schedule: {
    title: "Schedule",
    description: "Job schedule and milestones",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "project",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "team-assignments": {
    title: "Team Assignments",
    description: "Assigned technicians and crew",
    minSize: { width: 1, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "project",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "materials-list": {
    title: "Materials List",
    description: "Required and used materials",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "project",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "equipment-list": {
    title: "Equipment List",
    description: "Equipment and tools needed",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "project",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "purchase-orders": {
    title: "Purchase Orders",
    description: "Material and equipment purchase orders",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "project",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },

  // Documentation
  photos: {
    title: "Photo Gallery",
    description: "Before, during, and after photos",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "documentation",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  documents: {
    title: "Documents",
    description: "Contracts, specs, and files",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "documentation",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  permits: {
    title: "Permits",
    description: "Required permits and inspections",
    minSize: { width: 1, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "documentation",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  communications: {
    title: "Communications",
    description: "Messages, emails, and notes",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "documentation",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "activity-log": {
    title: "Activity Log",
    description: "Timeline of all job activities",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 3 },
    maxSize: { width: 4, height: 4 },
    category: "documentation",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },

  // Industry-specific
  "hvac-equipment": {
    title: "HVAC Equipment",
    description: "Units, tonnage, and specifications",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "industry",
    industries: ["hvac"],
  },
  "plumbing-fixtures": {
    title: "Plumbing Fixtures",
    description: "Fixtures, piping, and connections",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "industry",
    industries: ["plumbing"],
  },
  "electrical-panels": {
    title: "Electrical Panels",
    description: "Panels, circuits, and load calculations",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "industry",
    industries: ["electrical"],
  },
  "roofing-materials": {
    title: "Roofing Materials",
    description: "Shingles, underlayment, and squares",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "industry",
    industries: ["roofing"],
  },
  "landscape-zones": {
    title: "Landscape Zones",
    description: "Planting zones and irrigation",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "industry",
    industries: ["landscaping"],
  },

  // Analytics
  "time-tracking": {
    title: "Time Tracking",
    description: "Labor hours and time on site",
    minSize: { width: 1, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "analytics",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "labor-hours": {
    title: "Labor Hours",
    description: "Detailed labor breakdown by crew",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "analytics",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "material-costs": {
    title: "Material Costs",
    description: "Actual vs estimated material costs",
    minSize: { width: 1, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "analytics",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
  "change-orders": {
    title: "Change Orders",
    description: "Scope changes and additional work",
    minSize: { width: 2, height: 2 },
    defaultSize: { width: 2, height: 2 },
    maxSize: { width: 4, height: 3 },
    category: "analytics",
    industries: [
      "hvac",
      "plumbing",
      "electrical",
      "roofing",
      "landscaping",
      "general_contractor",
      "remodeling",
      "commercial",
      "custom",
    ],
  },
};

// ============================================================================
// Store State and Actions
// ============================================================================

interface JobDetailsLayoutStore {
  // Current layout
  widgets: JobWidget[];
  industry: IndustryType;
  version: number; // Layout version for migrations

  // Layout management
  addWidget: (widgetType: JobWidgetType) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<JobWidget>) => void;
  moveWidget: (widgetId: string, position: { x: number; y: number }) => void;
  resizeWidget: (
    widgetId: string,
    size: { width: number; height: number }
  ) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  toggleWidgetCollapse: (widgetId: string) => void;

  // Preset management
  loadPreset: (preset: LayoutPreset) => void;
  setIndustry: (industry: IndustryType) => void;
  resetToDefault: () => void;

  // Utility
  getWidgetById: (widgetId: string) => JobWidget | undefined;
  getVisibleWidgets: () => JobWidget[];
}

// ============================================================================
// Create Store
// ============================================================================

// Version number for layout migrations
// Increment this when making breaking changes to initialWidgets
// v2: Added new Priority 1 widgets (12 total)
// v3: Removed job-timeline widget (redundant - built into page)
const LAYOUT_VERSION = 3;

const initialWidgets: JobWidget[] = [
  // Default layout - comprehensive view with newly implemented widgets
  // Note: job-timeline removed - JobProcessIndicatorEditable is built into page

  // Row 1: Financials
  {
    id: "financials",
    type: "job-financials",
    title: "Financial Summary",
    position: { x: 0, y: 0 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },
  {
    id: "profitability",
    type: "profitability",
    title: "Profitability Analysis",
    position: { x: 1, y: 0 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },

  // Row 2: Customer & Property
  {
    id: "customer",
    type: "customer-info",
    title: "Customer Information",
    position: { x: 0, y: 1 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },
  {
    id: "property-details",
    type: "property-details",
    title: "Property Details",
    position: { x: 1, y: 1 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },

  // Row 3: Job Details
  {
    id: "job-details",
    type: "job-details",
    title: "Job Information",
    position: { x: 0, y: 2 },
    size: { width: 2, height: 1 }, // Full-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },

  // Row 4: Schedule & Team
  {
    id: "schedule",
    type: "schedule",
    title: "Schedule",
    position: { x: 0, y: 3 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },
  {
    id: "team-assignments",
    type: "team-assignments",
    title: "Team Assignments",
    position: { x: 1, y: 3 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },

  // Row 5: Materials & Permits
  {
    id: "materials-list",
    type: "materials-list",
    title: "Materials List",
    position: { x: 0, y: 4 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },
  {
    id: "permits",
    type: "permits",
    title: "Permits",
    position: { x: 1, y: 4 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },

  // Row 6: Photos & Payments
  {
    id: "photos",
    type: "photos",
    title: "Photo Gallery",
    position: { x: 0, y: 5 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },
  {
    id: "payment-tracker",
    type: "payment-tracker",
    title: "Payment Tracker",
    position: { x: 1, y: 5 },
    size: { width: 1, height: 1 }, // Half-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },

  // Row 7: Activity Log
  {
    id: "activity-log",
    type: "activity-log",
    title: "Activity Log",
    position: { x: 0, y: 6 },
    size: { width: 2, height: 1 }, // Full-width
    isVisible: true,
    isCollapsible: false,
    isCollapsed: false,
    isResizable: true,
    isDraggable: true,
  },
];

export const useJobDetailsLayoutStore = create<JobDetailsLayoutStore>()(
  devtools(
    persist(
      (set, get) => ({
        widgets: initialWidgets,
        industry: "general_contractor",
        version: LAYOUT_VERSION,

        addWidget: (widgetType) => {
          const metadata = WIDGET_METADATA[widgetType];
          const newWidget: JobWidget = {
            id: `${widgetType}-${Date.now()}`,
            type: widgetType,
            title: metadata.title,
            description: metadata.description,
            position: { x: 0, y: 0 }, // Will be auto-positioned
            size: metadata.defaultSize,
            isVisible: true,
            isCollapsible: true,
            isCollapsed: false,
            isResizable: true,
            isDraggable: true,
          };

          set((state) => ({
            widgets: [...state.widgets, newWidget],
          }));
        },

        removeWidget: (widgetId) => {
          set((state) => ({
            widgets: state.widgets.filter((w) => w.id !== widgetId),
          }));
        },

        updateWidget: (widgetId, updates) => {
          set((state) => ({
            widgets: state.widgets.map((w) =>
              w.id === widgetId ? { ...w, ...updates } : w
            ),
          }));
        },

        moveWidget: (widgetId, position) => {
          get().updateWidget(widgetId, { position });
        },

        resizeWidget: (widgetId, size) => {
          get().updateWidget(widgetId, { size });
        },

        toggleWidgetVisibility: (widgetId) => {
          const widget = get().getWidgetById(widgetId);
          if (widget) {
            get().updateWidget(widgetId, { isVisible: !widget.isVisible });
          }
        },

        toggleWidgetCollapse: (widgetId) => {
          const widget = get().getWidgetById(widgetId);
          if (widget && widget.isCollapsible) {
            get().updateWidget(widgetId, { isCollapsed: !widget.isCollapsed });
          }
        },

        loadPreset: (preset) => {
          set({
            widgets: preset.widgets,
            industry: preset.industry,
          });
        },

        setIndustry: (industry) => {
          set({ industry });
        },

        resetToDefault: () => {
          set({
            widgets: initialWidgets,
            industry: "general_contractor",
            version: LAYOUT_VERSION,
          });
        },

        getWidgetById: (widgetId) =>
          get().widgets.find((w) => w.id === widgetId),

        getVisibleWidgets: () => get().widgets.filter((w) => w.isVisible),
      }),
      {
        name: "job-details-layout-storage-v2", // v2: masonry grid with half/full width
        version: LAYOUT_VERSION,
        partialize: (state) => ({
          widgets: state.widgets,
          industry: state.industry,
          version: state.version,
        }),
        migrate: (persistedState: any, version: number) => {
          // If version mismatch, reset to default layout with new widgets
          if (version < LAYOUT_VERSION) {
            return {
              widgets: initialWidgets,
              industry: "general_contractor",
              version: LAYOUT_VERSION,
            };
          }
          return persistedState;
        },
      }
    ),
    { name: "JobDetailsLayoutStore" }
  )
);
