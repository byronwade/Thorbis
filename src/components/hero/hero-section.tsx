/**
 * Hero Section - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Composes header and hero rendered on server
 * - Reduced JavaScript bundle size
 */

import { CleanHero } from "../home/clean-hero";
import { MarketingHeader } from "./marketing-header";

export function HeroSection() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MarketingHeader />
      <CleanHero />
    </div>
  );
}
