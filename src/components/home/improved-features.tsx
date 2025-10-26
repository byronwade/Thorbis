"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type Feature = {
  emoji: string;
  description: string;
};

type Features = Record<string, Feature>;

export function ImprovedFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(
    "Smart Scheduling & Dispatch"
  );

  const features: Features = {
    "Smart Scheduling & Dispatch": {
      emoji: "📅",
      description: "AI-powered scheduling and route optimization",
    },
    "Instant Invoicing & Payments": {
      emoji: "💰",
      description: "Get paid faster with on-the-spot payments",
    },
    "Quotes & Estimates": {
      emoji: "📝",
      description: "Interactive quotes that win more jobs",
    },
    "CRM & Communication": {
      emoji: "📞",
      description: "Unified customer hub with all communications",
    },
    "Mobile Field App": {
      emoji: "📱",
      description: "Offline-first app for technicians in the field",
    },
    "Online Booking": {
      emoji: "🌐",
      description: "24/7 online booking and lead generation",
    },
    "Reporting & Analytics": {
      emoji: "📊",
      description: "Live dashboards with AI-driven insights",
    },
    "Accounting Integration": {
      emoji: "🔗",
      description: "Seamless sync with QuickBooks and more",
    },
    "Service Agreements": {
      emoji: "🔄",
      description: "Manage recurring revenue and maintenance plans",
    },
    "Automation & AI": {
      emoji: "🤖",
      description: "Smart workflows and AI assistance",
    },
    "Inventory Management": {
      emoji: "📦",
      description: "Track parts and materials efficiently",
    },
    "Job Costing": {
      emoji: "📈",
      description: "Real-time profit tracking and analytics",
    },
    "GPS Tracking": {
      emoji: "📍",
      description: "Live technician location and ETA updates",
    },
    "Customer Portal": {
      emoji: "👥",
      description: "Self-service portal for all account needs",
    },
    "Marketing Tools": {
      emoji: "📧",
      description: "Email campaigns and review management",
    },
    "Digital Pricebook": {
      emoji: "💵",
      description: "Dynamic pricing with automatic markups",
    },
    "Photo Attachments": {
      emoji: "📷",
      description: "Before/after photos and inspections",
    },
    "Signature Capture": {
      emoji: "✍️",
      description: "Digital signatures on the go",
    },
    "Multi-Location": {
      emoji: "🏢",
      description: "Manage multiple service territories",
    },
    "Equipment Tracking": {
      emoji: "🔧",
      description: "Track customer equipment and service history",
    },
    "Employee Management": {
      emoji: "👔",
      description: "Timesheets, scheduling, and performance tracking",
    },
    "Payment Processing": {
      emoji: "💳",
      description: "Multiple payment methods and instant payouts",
    },
    "Text & Email Alerts": {
      emoji: "📲",
      description: "Automated customer communication",
    },
    "Route Optimization": {
      emoji: "🗺️",
      description: "One-click route optimization for efficiency",
    },
    "Work Order Management": {
      emoji: "📋",
      description: "Complete work order lifecycle tracking",
    },
    "Field Inspection Forms": {
      emoji: "✅",
      description: "Customizable digital inspection forms",
    },
    "Parts & Labor Tracking": {
      emoji: "⚙️",
      description: "Accurate job costing with parts and labor",
    },
    "Customer History": {
      emoji: "📚",
      description: "Complete service history and notes",
    },
    "Warranty Management": {
      emoji: "🛡️",
      description: "Track warranties and service agreements",
    },
    "Dispatch Board": {
      emoji: "🎯",
      description: "Visual drag-and-drop dispatch interface",
    },
  };

  const featuresList = Object.keys(features);

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Features
          </Badge>
          <h1 className="mb-4 font-bold text-4xl text-white md:text-5xl lg:text-6xl">
            Discover Our Powerful Features
          </h1>
          <p className="mx-auto max-w-2xl text-foreground text-lg md:text-xl">
            Everything you need to run a successful field service business, all
            in one platform
          </p>
        </div>
        <div className="relative gap-8 pb-72 md:grid md:grid-cols-5 md:pb-0">
          <div className="col-span-3 space-y-2 pb-4">
            {featuresList.map((featureName) => (
              <div
                className="feature-item group hover:-translate-y-1 relative cursor-pointer rounded-xl border border-transparent px-5 py-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10"
                key={featureName}
                onMouseEnter={() => setActiveFeature(featureName)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === featureName ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                  />
                  <h2
                    className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-all duration-300 ${activeFeature === featureName ? "bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent" : "text-foreground group-hover:translate-x-1 group-hover:text-white"}`}
                  >
                    {featureName}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          <div className="sticky bottom-3 left-3 col-span-2 h-72 w-fit transition-all duration-500 md:top-20 md:h-fit">
            <div className="group relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/20 md:h-auto">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Animated gradient blob */}
              <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 size-64 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60" />

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="mb-6 text-7xl transition-all duration-500 group-hover:scale-110">
                  {features[activeFeature as keyof typeof features]?.emoji ||
                    "🤝"}
                </div>
                <h3 className="mb-3 font-bold text-2xl text-white transition-all duration-300">
                  {activeFeature}
                </h3>
                <p className="mx-auto max-w-sm text-foreground leading-relaxed transition-all duration-300">
                  {features[activeFeature as keyof typeof features]
                    ?.description || "Work together seamlessly"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
