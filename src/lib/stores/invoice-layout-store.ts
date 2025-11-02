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
 * Expanded to include popular professional fonts based on business feedback
 */
export type FontFamily =
  | "geist-sans" // Website default - Modern sans-serif (Geist)
  | "geist-mono" // Website monospace - Technical/code font (Geist Mono)
  | "inter" // Clean, professional sans-serif
  | "roboto" // Google's versatile font
  | "open-sans" // Highly readable humanist sans-serif
  | "lato" // Professional, elegant sans-serif
  | "montserrat" // Geometric, modern sans-serif
  | "playfair" // Elegant serif for luxury brands
  | "merriweather" // Readable serif for traditional look
  | "source-sans" // Adobe's clean sans-serif
  | "helvetica" // Classic professional font
  | "arial"; // Universal fallback

/**
 * Spacing options
 */
export type SpacingMode = "compact" | "normal" | "relaxed";

/**
 * Layout template types
 * Expanded based on industry-specific needs and business feedback
 */
export type LayoutTemplate =
  | "standard" // Traditional invoice layout
  | "professional" // Clean modern layout
  | "minimalist" // Minimal design
  | "creative" // Bold and colorful
  | "corporate" // Enterprise-level formal design
  | "modern" // Contemporary with geometric elements
  | "elegant" // Sophisticated with refined typography
  | "construction" // Industry-specific for contractors
  | "consulting" // Professional services focused
  | "retail" // Product-focused with inventory emphasis
  | "healthcare" // Medical/insurance compliant
  | "tech" // Technology/SaaS oriented
  | "luxury" // High-end brands with premium feel
  | "classic" // Timeless traditional design
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
 * Enhanced with business compliance and branding features
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

  // Advanced branding (NEW)
  watermarkEnabled: boolean;
  watermarkText: string; // "DRAFT", "PAID", "OVERDUE", etc.
  watermarkOpacity: number; // 0-100
  watermarkPosition: "center" | "diagonal" | "top-right";

  // Payment features (NEW)
  qrCodeEnabled: boolean;
  qrCodeType: "payment-link" | "venmo" | "crypto" | "custom";
  qrCodeData?: string;
  paymentLinkEnabled: boolean;
  paymentLinkURL?: string;

  // Multi-currency support (NEW)
  currency: string; // "USD", "EUR", "GBP", etc.
  currencySymbol: string;
  currencyPosition: "before" | "after";
  showCurrencyCode: boolean;

  // Compliance & Legal (NEW)
  digitalSignatureEnabled: boolean;
  digitalSignatureImage?: string;
  showBusinessRegistration: boolean;
  businessRegistrationNumber?: string;
  vatEnabled: boolean;
  vatNumber?: string;
  vatRate?: number;

  // Custom fields (NEW)
  customFields: Array<{
    id: string;
    label: string;
    value: string;
    position: "header" | "footer" | "body";
  }>;

  // Header/Footer customization (NEW)
  customHeader?: string;
  customFooter?: string;
  headerHeight: number;
  footerHeight: number;

  // Page settings (NEW)
  pageSize: "A4" | "Letter" | "Legal" | "A5";
  pageOrientation: "portrait" | "landscape";
  showPageNumbers: boolean;
  pageNumberPosition: "top" | "bottom";

  // Column layout (NEW)
  columnLayout: "single" | "two-column" | "three-column";

  // Industry-specific (NEW)
  industryType?:
    | "construction"
    | "consulting"
    | "retail"
    | "healthcare"
    | "tech"
    | "general";
  showProgressBilling?: boolean; // Construction
  showTimeTracking?: boolean; // Consulting
  showInventoryDetails?: boolean; // Retail
  showInsuranceInfo?: boolean; // Healthcare
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
 * Expanded with industry-specific and design-focused palettes
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
  corporate: {
    primary: "#1e40af", // Deep Blue
    accent: "#3b82f6",
    text: "#111827",
    textLight: "#4b5563",
    background: "#ffffff",
    border: "#d1d5db",
  },
  modern: {
    primary: "#0ea5e9", // Sky Blue
    accent: "#06b6d4",
    text: "#0f172a",
    textLight: "#475569",
    background: "#f8fafc",
    border: "#e2e8f0",
  },
  elegant: {
    primary: "#6b21a8", // Royal Purple
    accent: "#9333ea",
    text: "#18181b",
    textLight: "#52525b",
    background: "#fafafa",
    border: "#e4e4e7",
  },
  construction: {
    primary: "#ea580c", // Construction Orange
    accent: "#fb923c",
    text: "#1c1917",
    textLight: "#57534e",
    background: "#ffffff",
    border: "#e7e5e4",
  },
  consulting: {
    primary: "#0891b2", // Professional Teal
    accent: "#06b6d4",
    text: "#0c4a6e",
    textLight: "#475569",
    background: "#ffffff",
    border: "#cbd5e1",
  },
  retail: {
    primary: "#dc2626", // Retail Red
    accent: "#ef4444",
    text: "#18181b",
    textLight: "#71717a",
    background: "#ffffff",
    border: "#e4e4e7",
  },
  healthcare: {
    primary: "#0d9488", // Medical Teal
    accent: "#14b8a6",
    text: "#134e4a",
    textLight: "#6b7280",
    background: "#f0fdfa",
    border: "#99f6e4",
  },
  tech: {
    primary: "#4f46e5", // Tech Indigo
    accent: "#6366f1",
    text: "#1e1b4b",
    textLight: "#64748b",
    background: "#fafafa",
    border: "#e0e7ff",
  },
  luxury: {
    primary: "#713f12", // Luxury Gold/Brown
    accent: "#a16207",
    text: "#292524",
    textLight: "#78716c",
    background: "#fafaf9",
    border: "#e7e5e4",
  },
  classic: {
    primary: "#1e3a8a", // Navy Blue
    accent: "#3b82f6",
    text: "#1e293b",
    textLight: "#64748b",
    background: "#ffffff",
    border: "#cbd5e1",
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
 * Enhanced with new compliance and branding defaults
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

  // Advanced branding defaults
  watermarkEnabled: false,
  watermarkText: "DRAFT",
  watermarkOpacity: 20,
  watermarkPosition: "diagonal",

  // Payment features defaults
  qrCodeEnabled: false,
  qrCodeType: "payment-link",
  qrCodeData: undefined,
  paymentLinkEnabled: false,
  paymentLinkURL: undefined,

  // Multi-currency defaults
  currency: "USD",
  currencySymbol: "$",
  currencyPosition: "before",
  showCurrencyCode: false,

  // Compliance & Legal defaults
  digitalSignatureEnabled: false,
  digitalSignatureImage: undefined,
  showBusinessRegistration: false,
  businessRegistrationNumber: undefined,
  vatEnabled: false,
  vatNumber: undefined,
  vatRate: undefined,

  // Custom fields default
  customFields: [],

  // Header/Footer defaults
  customHeader: undefined,
  customFooter: undefined,
  headerHeight: 100,
  footerHeight: 80,

  // Page settings defaults
  pageSize: "Letter",
  pageOrientation: "portrait",
  showPageNumbers: true,
  pageNumberPosition: "bottom",

  // Column layout default
  columnLayout: "single",

  // Industry-specific defaults
  industryType: "general",
  showProgressBilling: false,
  showTimeTracking: false,
  showInventoryDetails: false,
  showInsuranceInfo: false,
};

/**
 * Preset templates
 * Comprehensive collection addressing business complaints and industry needs
 */
export const INVOICE_PRESETS: InvoicePreset[] = [
  {
    id: "standard",
    name: "Standard Invoice",
    description:
      "Traditional invoice layout with all essential elements. Perfect for general business use with familiar formatting.",
    template: "standard",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.standard,
      template: "standard",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "inter",
        bodyFont: "inter",
      },
    },
  },
  {
    id: "professional",
    name: "Professional",
    description:
      "Clean and modern layout for corporate use. Emphasizes professionalism with refined typography.",
    template: "professional",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.professional,
      template: "professional",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "helvetica",
        bodyFont: "open-sans",
      },
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description:
      "Simple and elegant design with minimal elements. Clean aesthetic focusing on essential information.",
    template: "minimalist",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.minimalist,
      template: "minimalist",
      spacing: "compact",
      showBorder: false,
      shadowEnabled: false,
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "helvetica",
        bodyFont: "helvetica",
      },
    },
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Bold and colorful design for creative businesses. Eye-catching layout with modern aesthetics.",
    template: "creative",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.creative,
      template: "creative",
      spacing: "relaxed",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "montserrat",
        bodyFont: "open-sans",
      },
      borderRadius: 12,
      shadowEnabled: true,
    },
  },
  {
    id: "corporate",
    name: "Corporate Enterprise",
    description:
      "Formal design for large organizations. Features structured layout with emphasis on business identity.",
    template: "corporate",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.corporate,
      template: "corporate",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "helvetica",
        bodyFont: "arial",
      },
      spacing: "normal",
      showBusinessRegistration: true,
      vatEnabled: true,
    },
  },
  {
    id: "modern",
    name: "Modern Design",
    description:
      "Contemporary layout with geometric elements. Fresh approach perfect for tech-forward companies.",
    template: "modern",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.modern,
      template: "modern",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "montserrat",
        bodyFont: "lato",
      },
      borderRadius: 16,
      columnLayout: "two-column",
    },
  },
  {
    id: "elegant",
    name: "Elegant & Refined",
    description:
      "Sophisticated design with refined typography. Ideal for luxury services and premium brands.",
    template: "elegant",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.elegant,
      template: "elegant",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "playfair",
        bodyFont: "lato",
        headingSize: 1.5,
      },
      spacing: "relaxed",
      shadowEnabled: true,
    },
  },
  {
    id: "construction",
    name: "Construction & Contractors",
    description:
      "Industry-specific for construction businesses. Includes progress billing and job costing features.",
    template: "construction",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.construction,
      template: "construction",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "roboto",
        bodyFont: "roboto",
      },
      industryType: "construction",
      showProgressBilling: true,
    },
  },
  {
    id: "consulting",
    name: "Professional Services",
    description:
      "Optimized for consulting and professional services. Features time tracking and project details.",
    template: "consulting",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.consulting,
      template: "consulting",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "source-sans",
        bodyFont: "source-sans",
      },
      industryType: "consulting",
      showTimeTracking: true,
    },
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    description:
      "Product-focused with inventory emphasis. Perfect for retail businesses and online stores.",
    template: "retail",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.retail,
      template: "retail",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "montserrat",
        bodyFont: "open-sans",
      },
      industryType: "retail",
      showInventoryDetails: true,
    },
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    description:
      "Medical and insurance compliant. Includes fields for insurance information and HIPAA compliance.",
    template: "healthcare",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.healthcare,
      template: "healthcare",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "roboto",
        bodyFont: "open-sans",
      },
      industryType: "healthcare",
      showInsuranceInfo: true,
      showBusinessRegistration: true,
    },
  },
  {
    id: "tech",
    name: "Technology & SaaS",
    description:
      "Modern design for tech companies. Clean interface optimized for subscription billing.",
    template: "tech",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.tech,
      template: "tech",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "inter",
        bodyFont: "inter",
      },
      industryType: "tech",
      columnLayout: "two-column",
      qrCodeEnabled: true,
      paymentLinkEnabled: true,
    },
  },
  {
    id: "luxury",
    name: "Luxury & Premium",
    description:
      "High-end design for luxury brands. Emphasizes exclusivity with premium typography and spacing.",
    template: "luxury",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.luxury,
      template: "luxury",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "playfair",
        bodyFont: "merriweather",
        headingSize: 1.6,
      },
      spacing: "relaxed",
      digitalSignatureEnabled: true,
    },
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description:
      "Timeless traditional design. Professional and trustworthy for established businesses.",
    template: "classic",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      colors: DEFAULT_COLOR_SCHEMES.classic,
      template: "classic",
      typography: {
        ...DEFAULT_TYPOGRAPHY,
        headingFont: "merriweather",
        bodyFont: "lato",
      },
      showBusinessRegistration: true,
      vatEnabled: true,
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

  // Advanced branding actions (NEW)
  updateWatermark: (
    enabled: boolean,
    text: string,
    opacity: number,
    position: "center" | "diagonal" | "top-right"
  ) => void;

  // Payment features actions (NEW)
  updateQRCode: (
    enabled: boolean,
    type: "payment-link" | "venmo" | "crypto" | "custom",
    data?: string
  ) => void;
  updatePaymentLink: (enabled: boolean, url?: string) => void;

  // Multi-currency actions (NEW)
  updateCurrency: (
    currency: string,
    symbol: string,
    position: "before" | "after",
    showCode: boolean
  ) => void;

  // Compliance & Legal actions (NEW)
  updateDigitalSignature: (enabled: boolean, image?: string) => void;
  updateBusinessRegistration: (enabled: boolean, number?: string) => void;
  updateVAT: (enabled: boolean, number?: string, rate?: number) => void;

  // Custom fields actions (NEW)
  addCustomField: (
    label: string,
    value: string,
    position: "header" | "footer" | "body"
  ) => void;
  removeCustomField: (id: string) => void;
  updateCustomField: (
    id: string,
    updates: {
      label?: string;
      value?: string;
      position?: "header" | "footer" | "body";
    }
  ) => void;

  // Header/Footer actions (NEW)
  updateCustomHeader: (header?: string) => void;
  updateCustomFooter: (footer?: string) => void;
  updateHeaderHeight: (height: number) => void;
  updateFooterHeight: (height: number) => void;

  // Page settings actions (NEW)
  updatePageSettings: (
    size: "A4" | "Letter" | "Legal" | "A5",
    orientation: "portrait" | "landscape",
    showPageNumbers: boolean,
    pageNumberPosition: "top" | "bottom"
  ) => void;

  // Column layout actions (NEW)
  updateColumnLayout: (
    layout: "single" | "two-column" | "three-column"
  ) => void;

  // Industry-specific actions (NEW)
  updateIndustryType: (
    type:
      | "construction"
      | "consulting"
      | "retail"
      | "healthcare"
      | "tech"
      | "general"
  ) => void;
  updateIndustryFeatures: (features: {
    showProgressBilling?: boolean;
    showTimeTracking?: boolean;
    showInventoryDetails?: boolean;
    showInsuranceInfo?: boolean;
  }) => void;
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

        // Advanced branding implementations
        updateWatermark: (enabled, text, opacity, position) => {
          set((state) => ({
            customization: {
              ...state.customization,
              watermarkEnabled: enabled,
              watermarkText: text,
              watermarkOpacity: opacity,
              watermarkPosition: position,
            },
          }));
        },

        // Payment features implementations
        updateQRCode: (enabled, type, data) => {
          set((state) => ({
            customization: {
              ...state.customization,
              qrCodeEnabled: enabled,
              qrCodeType: type,
              qrCodeData: data,
            },
          }));
        },

        updatePaymentLink: (enabled, url) => {
          set((state) => ({
            customization: {
              ...state.customization,
              paymentLinkEnabled: enabled,
              paymentLinkURL: url,
            },
          }));
        },

        // Multi-currency implementations
        updateCurrency: (currency, symbol, position, showCode) => {
          set((state) => ({
            customization: {
              ...state.customization,
              currency,
              currencySymbol: symbol,
              currencyPosition: position,
              showCurrencyCode: showCode,
            },
          }));
        },

        // Compliance & Legal implementations
        updateDigitalSignature: (enabled, image) => {
          set((state) => ({
            customization: {
              ...state.customization,
              digitalSignatureEnabled: enabled,
              digitalSignatureImage: image,
            },
          }));
        },

        updateBusinessRegistration: (enabled, number) => {
          set((state) => ({
            customization: {
              ...state.customization,
              showBusinessRegistration: enabled,
              businessRegistrationNumber: number,
            },
          }));
        },

        updateVAT: (enabled, number, rate) => {
          set((state) => ({
            customization: {
              ...state.customization,
              vatEnabled: enabled,
              vatNumber: number,
              vatRate: rate,
            },
          }));
        },

        // Custom fields implementations
        addCustomField: (label, value, position) => {
          set((state) => ({
            customization: {
              ...state.customization,
              customFields: [
                ...state.customization.customFields,
                {
                  id: `field_${Date.now()}`,
                  label,
                  value,
                  position,
                },
              ],
            },
          }));
        },

        removeCustomField: (id) => {
          set((state) => ({
            customization: {
              ...state.customization,
              customFields: state.customization.customFields.filter(
                (field) => field.id !== id
              ),
            },
          }));
        },

        updateCustomField: (id, updates) => {
          set((state) => ({
            customization: {
              ...state.customization,
              customFields: state.customization.customFields.map((field) =>
                field.id === id ? { ...field, ...updates } : field
              ),
            },
          }));
        },

        // Header/Footer implementations
        updateCustomHeader: (header) => {
          set((state) => ({
            customization: {
              ...state.customization,
              customHeader: header,
            },
          }));
        },

        updateCustomFooter: (footer) => {
          set((state) => ({
            customization: {
              ...state.customization,
              customFooter: footer,
            },
          }));
        },

        updateHeaderHeight: (height) => {
          set((state) => ({
            customization: {
              ...state.customization,
              headerHeight: height,
            },
          }));
        },

        updateFooterHeight: (height) => {
          set((state) => ({
            customization: {
              ...state.customization,
              footerHeight: height,
            },
          }));
        },

        // Page settings implementations
        updatePageSettings: (
          size,
          orientation,
          showPageNumbers,
          pageNumberPosition
        ) => {
          set((state) => ({
            customization: {
              ...state.customization,
              pageSize: size,
              pageOrientation: orientation,
              showPageNumbers,
              pageNumberPosition,
            },
          }));
        },

        // Column layout implementation
        updateColumnLayout: (layout) => {
          set((state) => ({
            customization: {
              ...state.customization,
              columnLayout: layout,
            },
          }));
        },

        // Industry-specific implementations
        updateIndustryType: (type) => {
          set((state) => ({
            customization: {
              ...state.customization,
              industryType: type,
            },
          }));
        },

        updateIndustryFeatures: (features) => {
          set((state) => ({
            customization: {
              ...state.customization,
              ...features,
            },
          }));
        },
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
        // PERFORMANCE: Skip hydration to prevent SSR mismatches
        // Allows Next.js to generate static pages without Zustand errors
        skipHydration: true,
      }
    ),
    { name: "InvoiceLayoutStore" }
  )
);
