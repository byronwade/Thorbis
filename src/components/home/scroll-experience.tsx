"use client";

import { HeroSection } from "@/components/hero/hero-section";
import { Footer } from "@/components/layout/footer";
import {
  ArchitectureSection,
  ComplianceSection,
  FeaturesSection,
  IntegrationsSection,
} from "./scroll-sections";

export function ScrollExperience() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-black">
        <HeroSection />
      </section>

      {/* Features Section */}
      <FeaturesSection />

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

      <Footer />
    </div>
  );
}
