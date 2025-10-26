"use client";

import { HeroSection } from "@/components/hero/hero-section";
import { Footer } from "@/components/layout/footer";
import {
  ArchitectureSection,
  ComplianceSection,
  FeaturesSection,
  IntegrationsSection,
} from "./scroll-sections";
import {
  CustomerSuccessSection,
  ROICalculatorSection,
  IndustrySolutionsSection,
  TrustStatsSection,
  PricingPreviewSection,
} from "./new-sections";

export function ScrollExperience() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-black">
        <HeroSection />
      </section>

      {/* Trust & Stats Section - Early social proof */}
      <TrustStatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Customer Success Stories - Real results */}
      <CustomerSuccessSection />

      {/* ROI Calculator - Interactive value prop */}
      <ROICalculatorSection />

      {/* Industry Solutions - Targeted messaging */}
      <IndustrySolutionsSection />

      {/* Architecture Section */}
      <section className="bg-black py-24">
        <ArchitectureSection />
      </section>

      {/* Integrations Showcase Section */}
      <section className="bg-black py-24">
        <IntegrationsSection />
      </section>

      {/* Compliance Section */}
      <ComplianceSection />

      {/* Pricing Preview - Clear next step */}
      <PricingPreviewSection />

      <Footer />
    </div>
  );
}
