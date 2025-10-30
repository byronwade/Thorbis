/**
 * Invoice Layout Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 *
 * This store manages the customizable block-based layout for invoice details pages.
 * Users can customize colors, fonts, spacing, and save their preferred templates.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Types and Definitions
// ============================================================================

/**
 * Invoice block types for BlockNote editor
 */
export type InvoiceBlockType =
  | "header" // Invoice header with logo and company info
  | "invoice-number" // Invoice number and date
  | "bill-to" // Bill to address
  | "ship-to" // Ship to address
  | "line-items" // Invoice line items table
  | "subtotal" // Subtotal section
  | "tax" // Tax calculation
  | "total" // Total amount
  | "payment-terms" // Payment terms and conditions
  | "notes" // Additional notes
  | "footer" // Invoice footer
  | "custom-text" // Custom text block
  | "custom-image" // Custom image block
  | "divider"; // Visual divider

/**
 * Font family options
 * Uses website's Geist font family for consistency
 */
export type FontFamily =
  | "geist-sans" // Website default - Modern sans-serif (Geist)
  | "geist-mono"; // Website monospace - Technical/code font (Geist Mono)

/**
 * Spacing options
 */
export type SpacingMode = "compact" | "normal" | "relaxed";

/**
 * Layout template types
 */
export type LayoutTemplate =
  | "standard" // Traditional invoice layout
  | "professional" // Clean modern layout
  | "minimalist" // Minimal design
  | "creative" // Bold and colorful
  | "custom"; // User-defined

/**
 * Color scheme configuration
 */
export interface ColorScheme {
  primary: string; // Primary brand color
  accent: string; // Accent color for highlights
  text: string; // Main text color
  textLight: string; // Secondary text color
  background: string; // Background color
  border: string; // Border color
}

/**
 * Typography configuration
 */
export interface Typography {
  headingFont: FontFamily;
  bodyFont: FontFamily;
  headingSize: number; // in rem
  bodySize: number; // in rem
  lineHeight: number;
}

/**
 * Invoice customization settings
 */
export interface InvoiceCustomization {
  // Colors
  colors: ColorScheme;

  // Typography
  typography: Typography;

  // Spacing
  spacing: SpacingMode;

  // Layout
  template: LayoutTemplate;

  // Company branding
  logo?: string; // Logo URL
  logoPosition: "left" | "center" | "right";
  logoSize: number; // in pixels

  // Additional settings
  showBorder: boolean;
  borderRadius: number; // in pixels
  shadowEnabled: boolean;
}

/**
 * Invoice preset configuration
 */
export interface InvoicePreset {
  id: string;
  name: string;
  description: string;
  template: LayoutTemplate;
  customization: InvoiceCustomization;
  thumbnail?: string;
}

// ============================================================================
// Default Configurations
// ============================================================================

/**
 * Default color schemes
 */
export const DEFAULT_COLOR_SCHEMES: Record<LayoutTemplate, ColorScheme> = {
  standard: {
    primary: "#2563eb", // Blue
    accent: "#3b82f6",
    text: "#1f2937",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  professional: {
    primary: "#0f172a", // Slate
    accent: "#334155",
    text: "#0f172a",
    textLight: "#64748b",
    background: "#ffffff",
    border: "#cbd5e1",
  },
  minimalist: {
    primary: "#000000", // Black
    accent: "#404040",
    text: "#000000",
    textLight: "#737373",
    background: "#ffffff",
    border: "#d4d4d4",
  },
  creative: {
    primary: "#8b5cf6", // Purple
    accent: "#a78bfa",
    text: "#1f2937",
    textLight: "#6b7280",
    background: "#fafafa",
    border: "#e5e7eb",
  },
  custom: {
    primary: "#2563eb",
    accent: "#3b82f6",
    text: "#1f2937",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
};

/**
 * Default typography settings
 * Uses website's Geist font for consistency across the platform
 */
export const DEFAULT_TYPOGRAPHY: Typography = {
  headingFont: "geist-sans",
  bodyFont: "geist-sans",
  headingSize: 1.25, // 20px - Better for section headings
  bodySize: 0.9375, // 15px - Comfortable reading size
  lineHeight: 1.6, // Better readability
};

/**
 * Default customization
 */
export const DEFAULT_CUSTOMIZATION: InvoiceCustomization = {
  colors: DEFAULT_COLOR_SCHEMES.standard,
  typography: DEFAULT_TYPOGRAPHY,
  spacing: "normal",
  template: "standard",
  logoPosition: "left",
  logoSize: 120,
  showBorder: true,
  borderRadius: 8,
  shadowEnabled: false,
};

/**
 * Preset templates
 */
export const INVOICE_PRESETS: InvoicePreset[] = [
  {
    id: "standard",
    name: "Standard Invoice",
    description: "Traditional invoice layout with all essential elements",
    template: "standard",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.standard,
      template: "standard",
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean and modern layout for corporate use",
    template: "professional",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.professional,
      template: "professional",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "geist-sans",
        bodyFont: "geist-sans",
      },
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simple and elegant design with minimal elements",
    template: "minimalist",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.minimalist,
      template: "minimalist",
      spacing: "compact",
      showBorder: false,
      shadowEnabled: false,
    },
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and colorful design for creative businesses",
    template: "creative",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.creative,
      template: "creative",
      spacing: "relaxed",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "geist-sans",
        bodyFont: "geist-sans",
      },
      borderRadius: 12,
      shadowEnabled: true,
    },
  },
];

// ============================================================================
// Store State and Actions
// ============================================================================

interface InvoiceLayoutStore {
  // Current customization
  customization: InvoiceCustomization;
  version: number; // Store version for migrations

  // BlockNote content (JSON)
  content: unknown; // BlockNote JSON content

  // Customization actions
  updateColors: (colors: Partial<ColorScheme>) => void;
  updateTypography: (typography: Partial<Typography>) => void;
  updateSpacing: (spacing: SpacingMode) => void;
  updateTemplate: (template: LayoutTemplate) => void;
  updateLogo: (logo?: string) => void;
  updateLogoPosition: (position: "left" | "center" | "right") => void;
  updateLogoSize: (size: number) => void;
  updateBorderSettings: (
    showBorder: boolean,
    borderRadius: number,
    shadowEnabled: boolean
  ) => void;

  // Content actions
  updateContent: (content: unknown) => void;

  // Preset management
  loadPreset: (preset: InvoicePreset) => void;
  resetToDefault: () => void;

  // Utility
  getCustomization: () => InvoiceCustomization;
}

// ============================================================================
// Create Store
// ============================================================================

// Version number for store migrations
const STORE_VERSION = 1;

export const useInvoiceLayoutStore = create<InvoiceLayoutStore>()(
  devtools(
    persist(
      (set, get) => ({
        customization: DEFAULT_CUSTOMIZATION,
        version: STORE_VERSION,
        content: null,

        updateColors: (colors) => {
          set((state) => ({
            customization: {
              ...state.customization,
              colors: {
                ...state.customization.colors,
                ...colors,
              },
            },
          }));
        },

        updateTypography: (typography) => {
          set((state) => ({
            customization: {
              ...state.customization,
              typography: {
                ...state.customization.typography,
                ...typography,
              },
            },
          }));
        },

        updateSpacing: (spacing) => {
          set((state) => ({
            customization: {
              ...state.customization,
              spacing,
            },
          }));
        },

        updateTemplate: (template) => {
          set((state) => ({
            customization: {
              ...state.customization,
              template,
              colors: DEFAULT_COLOR_SCHEMES[template],
            },
          }));
        },

        updateLogo: (logo) => {
          set((state) => ({
            customization: {
              ...state.customization,
              logo,
            },
          }));
        },

        updateLogoPosition: (logoPosition) => {
          set((state) => ({
            customization: {
              ...state.customization,
              logoPosition,
            },
          }));
        },

        updateLogoSize: (logoSize) => {
          set((state) => ({
            customization: {
              ...state.customization,
              logoSize,
            },
          }));
        },

        updateBorderSettings: (showBorder, borderRadius, shadowEnabled) => {
          set((state) => ({
            customization: {
              ...state.customization,
              showBorder,
              borderRadius,
              shadowEnabled,
            },
          }));
        },

        updateContent: (content) => {
          set({ content });
        },

        loadPreset: (preset) => {
          set({
            customization: preset.customization,
          });
        },

        resetToDefault: () => {
          set({
            customization: DEFAULT_CUSTOMIZATION,
            content: null,
            version: STORE_VERSION,
          });
        },

        getCustomization: () => get().customization,
      }),
      {
        name: "invoice-layout-storage",
        version: STORE_VERSION,
        partialize: (state) => ({
          customization: state.customization,
          content: state.content,
          version: state.version,
        }),
        migrate: (persistedState: unknown, version: number) => {
          // If version mismatch, reset to default
          if (version < STORE_VERSION) {
            return {
              customization: DEFAULT_CUSTOMIZATION,
              content: null,
              version: STORE_VERSION,
            };
          }
          return persistedState;
        },
      }
    ),
    { name: "InvoiceLayoutStore" }
  )
);
