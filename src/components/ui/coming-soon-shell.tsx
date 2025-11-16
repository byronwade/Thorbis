/**
 * Coming Soon Shell - Reusable Component
 *
 * Standard "Coming Soon" page layout for unreleased features.
 * Provides consistent branding and messaging across placeholder pages.
 *
 * Performance:
 * - Static server component (renders instantly)
 * - No data fetching required
 * - Optimized for Core Web Vitals
 *
 * Usage:
 * ```tsx
 * <ComingSoonShell
 *   title="Advanced Analytics"
 *   icon={BarChart3}
 *   description="Powerful insights and reporting tools coming soon"
 * >
 *   <FeatureCards />
 * </ComingSoonShell>
 * ```
 */

import { Clock, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ComingSoonShellProps = {
  title: string;
  icon: LucideIcon;
  description: string;
  children?: ReactNode;
};

export function ComingSoonShell({
  title,
  icon: Icon,
  description,
  children,
}: ComingSoonShellProps) {
  return (
    <div className="relative space-y-10 py-8 md:py-12">
      {/* Background gradients - purely decorative */}
      <div className="-z-10 pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="mx-auto w-full max-w-5xl space-y-10 text-center">
        {/* Status badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm backdrop-blur-sm">
            <Clock className="mr-2 size-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Feature icon */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Animated glow effect */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />

            {/* Icon container */}
            <div className="relative flex size-24 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
              <Icon className="size-12 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title and description */}
        <div className="space-y-3">
          <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-3xl text-foreground/60 text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Custom content (feature cards, CTA, etc.) */}
        {children && <div className="pt-4">{children}</div>}

        {/* Footer message */}
        <div className="pt-8">
          <p className="text-muted-foreground text-sm">
            This feature is currently under development. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
