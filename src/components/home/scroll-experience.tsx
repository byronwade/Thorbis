/**
 * Scroll Experience - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Composes multiple sections rendered on server
 * - Reduced JavaScript bundle size
 */

import { HeroSection } from "@/components/hero/hero-section";
import { Footer } from "@/components/layout/footer";
import { CleanFeaturesSection } from "./clean-features";
import { CleanTestimonialsSection } from "./clean-testimonials";
import { ComparisonSection } from "./comparison-section";
import { DemoShowcaseSection } from "./demo-showcase";
import { FAQSection } from "./faq-section";
import { FinalCTASection } from "./final-cta-section";
import { IntegrationsSection } from "./integrations-section";
import { IndustrySolutionsSection, ROICalculatorSection } from "./new-sections";

export function ScrollExperience() {
  return (
    <div className="relative space-y-8">
      {/* Hero Section - Clean dashboard aesthetic */}
      <section className="relative min-h-screen">
        <HeroSection />
      </section>

      {/* Features - Dashboard layout style */}
      <CleanFeaturesSection />

      {/* Demo Showcase */}
      <DemoShowcaseSection />

      {/* Customer Testimonials - Clean cards with metrics */}
      <CleanTestimonialsSection />

      {/* Integrations */}
      <IntegrationsSection />

      {/* ROI Calculator */}
      <ROICalculatorSection />

      {/* Comparison Table */}
      <ComparisonSection />

      {/* Industry Solutions */}
      <IndustrySolutionsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection />

      <Footer />
    </div>
  );
}
