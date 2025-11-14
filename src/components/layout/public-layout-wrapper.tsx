"use client";

/**
 * PublicLayoutWrapper - Unified Public Layout System (Client Component)
 *
 * Renders public page layouts based on unified configuration:
 * - Header (marketing navigation)
 * - Main content area (variant-specific structure)
 * - Sidebar (for documentation pages)
 * - Footer
 *
 * Supports multiple page variants:
 * - hero: Full-width hero + content (Homepage)
 * - standard: Container-width content (Most pages)
 * - wide: Wider container (Pricing, comparisons)
 * - documentation: Sidebar + content (KB, API docs)
 * - minimal: Simple centered content (Legal pages)
 * - auth-centered: Centered form with background (Login, register)
 * - auth-wizard: Full-screen stepped flow (Onboarding)
 * - auth-verification: Simple centered message (Email verification)
 * - embedded: No chrome (Contract signing)
 * - status: Minimal status page
 *
 * All layout elements are config-driven from unified-public-layout-config.tsx
 */

import { usePathname } from "next/navigation";
import { MarketingHeader } from "@/components/hero/marketing-header";
import { KBSidebarContent } from "@/components/kb/kb-sidebar";
import { Footer } from "@/components/layout/footer";
import {
  getPublicBackgroundClass,
  getPublicLayoutConfig,
  getPublicMaxWidthClass,
  getPublicMinHeightClass,
  getPublicPaddingClass,
  getPublicPaddingYClass,
} from "@/lib/layout/unified-public-layout-config";
import { cn } from "@/lib/utils";

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const safePathname = pathname || "/";

  // Get unified configuration for this route
  const config = getPublicLayoutConfig(safePathname);

  // Extract configuration sections
  const { variant, header, footer, sidebar, content } = config;

  // Calculate CSS classes from content config
  const maxWidthClass = getPublicMaxWidthClass(content.maxWidth);
  const paddingClass = getPublicPaddingClass(content.padding);
  const paddingYClass = getPublicPaddingYClass(content.paddingY);
  const backgroundClass = getPublicBackgroundClass(content.background);
  const minHeightClass = getPublicMinHeightClass(content.minHeight);

  // ========================================
  // EMBEDDED VARIANT (No Chrome)
  // ========================================
  if (variant === "embedded") {
    return (
      <div className={cn("w-full", minHeightClass, backgroundClass)}>
        {children}
      </div>
    );
  }

  // ========================================
  // AUTH VARIANTS
  // ========================================
  if (
    variant === "auth-centered" ||
    variant === "auth-wizard" ||
    variant === "auth-verification"
  ) {
    return (
      <div
        className={cn(
          "relative flex w-full flex-col",
          minHeightClass,
          backgroundClass,
          variant === "auth-centered" && "md:items-center md:justify-center"
        )}
      >
        {children}
      </div>
    );
  }

  // ========================================
  // DOCUMENTATION VARIANT (With Sidebar)
  // ========================================
  if (variant === "documentation" && sidebar?.show) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        {header.show && <MarketingHeader />}

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-1">
          {/* Sidebar */}
          {sidebar.position === "left" && sidebar.type === "kb" && (
            <KBSidebarContent />
          )}

          {/* Content */}
          <main
            className={cn(
              "flex-1",
              backgroundClass,
              paddingYClass,
              minHeightClass
            )}
          >
            <div className={cn("mx-auto w-full", maxWidthClass, paddingClass)}>
              {children}
            </div>
          </main>

          {/* Right Sidebar (if needed in future) */}
          {sidebar.position === "right" && (
            <aside className="w-64 border-border/50 border-l bg-muted/30">
              {/* Right sidebar content */}
            </aside>
          )}
        </div>

        {/* Footer */}
        {footer.show && <Footer />}
      </div>
    );
  }

  // ========================================
  // HERO VARIANT (Full-Width Sections)
  // ========================================
  if (variant === "hero") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header - Transparent overlay on hero */}
        {header.show && <MarketingHeader />}

        {/* Main Content - Full width, no padding */}
        <main className={cn("flex-1", backgroundClass, minHeightClass)}>
          {children}
        </main>

        {/* Footer */}
        {footer.show && <Footer />}
      </div>
    );
  }

  // ========================================
  // STANDARD, WIDE, MINIMAL, STATUS VARIANTS
  // ========================================
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      {header.show && <MarketingHeader />}

      {/* Main Content */}
      <main
        className={cn("flex-1", backgroundClass, paddingYClass, minHeightClass)}
      >
        <div className={cn("mx-auto w-full", maxWidthClass, paddingClass)}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {footer.show && <Footer />}
    </div>
  );
}
