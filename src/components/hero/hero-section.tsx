"use client";

import { HeroContent } from "./hero-content";
import { MarketingHeader } from "./marketing-header";

export function HeroSection() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <MarketingHeader />
      <HeroContent />
    </div>
  );
}
