"use client";

import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Camera,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  History,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  RefreshCw,
  Route,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Feature = {
  name: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  color: string;
  details?: string[];
};

type FeatureCategory = {
  name: string;
  description: string;
  icon: React.ElementType;
  features: Feature[];
  color: string;
};

export function ImprovedFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const categories: FeatureCategory[] = [
    {
      name: "Scheduling & Dispatch",
      description: "Intelligent scheduling that maximizes efficiency",
      icon: Calendar,
      color: "from-blue-500/20 to-cyan-500/20",
      features: [
        {
          name: "Smart Scheduling",
          icon: Calendar,
          description: "AI-powered scheduling and route optimization",
          badge: "AI Powered",
          color: "blue",
          details: [
            "Drag-and-drop calendar interface",
            "Automatic conflict detection",
            "Skill-based technician matching",
            "Recurring job automation",
          ],
        },
        {
          name: "Route Optimization",
          icon: Route,
          description: "One-click route optimization for efficiency",
          color: "cyan",
          details: [
            "Real-time traffic integration",
            "Multi-stop optimization",
            "Reduce drive time by 40%",
            "Save on fuel costs",
          ],
        },
        {
          name: "GPS Tracking",
          icon: MapPin,
          description: "Live technician location and ETA updates",
          color: "sky",
          details: [
            "Real-time location tracking",
            "Automatic ETA updates",
            "Geofencing alerts",
            "Historical route playback",
          ],
        },
        {
          name: "Dispatch Board",
          icon: Target,
          description: "Visual drag-and-drop dispatch interface",
          color: "indigo",
          details: [
            "Visual workflow board",
            "Drag-and-drop assignment",
            "Color-coded priorities",
            "Team capacity overview",
          ],
        },
      ],
    },
    {
      name: "Payments & Invoicing",
      description: "Get paid faster with seamless payment processing",
      icon: DollarSign,
      color: "from-emerald-500/20 to-green-500/20",
      features: [
        {
          name: "Instant Invoicing",
          icon: DollarSign,
          description: "Get paid faster with on-the-spot payments",
          badge: "Popular",
          color: "emerald",
          details: [
            "Create invoices in seconds",
            "Accept payments on-site",
            "Automatic payment reminders",
            "2x faster payment collection",
          ],
        },
        {
          name: "Payment Processing",
          icon: CreditCard,
          description: "Multiple payment methods and instant payouts",
          color: "green",
          details: [
            "Credit/debit cards",
            "ACH bank transfers",
            "Digital wallets",
            "Next-day funding",
          ],
        },
        {
          name: "Quotes & Estimates",
          icon: FileText,
          description: "Interactive quotes that win more jobs",
          color: "teal",
          details: [
            "Professional branded quotes",
            "Online approval",
            "Customer financing options",
            "Automatic follow-ups",
          ],
        },
        {
          name: "Digital Pricebook",
          icon: BookOpen,
          description: "Dynamic pricing with automatic markups",
          color: "lime",
          details: [
            "Custom pricing tiers",
            "Automatic markup calculation",
            "Service bundles",
            "Seasonal pricing",
          ],
        },
      ],
    },
    {
      name: "Customer Management",
      description: "Build lasting relationships with powerful CRM",
      icon: Users,
      color: "from-purple-500/20 to-pink-500/20",
      features: [
        {
          name: "CRM & Communication",
          icon: MessageSquare,
          description: "Unified customer hub with all communications",
          color: "purple",
          details: [
            "Complete customer profiles",
            "Communication history",
            "Notes and attachments",
            "Custom fields",
          ],
        },
        {
          name: "Customer Portal",
          icon: Users,
          description: "Self-service portal for all account needs",
          badge: "New",
          color: "fuchsia",
          details: [
            "Online booking",
            "Invoice viewing & payment",
            "Service history access",
            "Request quotes",
          ],
        },
        {
          name: "Marketing Tools",
          icon: Mail,
          description: "Email campaigns and review management",
          color: "pink",
          details: [
            "Email marketing campaigns",
            "Review generation",
            "Referral tracking",
            "Customer segmentation",
          ],
        },
        {
          name: "Text & Email Alerts",
          icon: Bell,
          description: "Automated customer communication",
          color: "rose",
          details: [
            "Appointment reminders",
            "On-the-way notifications",
            "Follow-up requests",
            "Custom templates",
          ],
        },
      ],
    },
    {
      name: "Field Operations",
      description: "Empower your team with mobile-first tools",
      icon: Smartphone,
      color: "from-amber-500/20 to-orange-500/20",
      features: [
        {
          name: "Mobile Field App",
          icon: Smartphone,
          description: "Offline-first app for technicians in the field",
          badge: "Offline Mode",
          color: "amber",
          details: [
            "Works without internet",
            "Digital forms & checklists",
            "Photo & video capture",
            "E-signature collection",
          ],
        },
        {
          name: "Work Order Management",
          icon: ClipboardList,
          description: "Complete work order lifecycle tracking",
          color: "orange",
          details: [
            "Job details & instructions",
            "Parts & materials tracking",
            "Time tracking",
            "Customer approvals",
          ],
        },
        {
          name: "Field Inspection Forms",
          icon: CheckSquare,
          description: "Customizable digital inspection forms",
          color: "yellow",
          details: [
            "Custom form builder",
            "Conditional logic",
            "Photo annotations",
            "PDF export",
          ],
        },
        {
          name: "Photo Attachments",
          icon: Camera,
          description: "Before/after photos and inspections",
          color: "red",
          details: [
            "Unlimited photo storage",
            "Before/after galleries",
            "Automatic organization",
            "Share with customers",
          ],
        },
      ],
    },
    {
      name: "Business Intelligence",
      description: "Make data-driven decisions with real-time insights",
      icon: BarChart3,
      color: "from-violet-500/20 to-purple-500/20",
      features: [
        {
          name: "Reporting & Analytics",
          icon: BarChart3,
          description: "Live dashboards with AI-driven insights",
          badge: "AI Insights",
          color: "violet",
          details: [
            "Real-time dashboards",
            "Custom report builder",
            "Performance metrics",
            "Trend analysis",
          ],
        },
        {
          name: "Job Costing",
          icon: TrendingUp,
          description: "Real-time profit tracking and analytics",
          color: "purple",
          details: [
            "Real-time profit margins",
            "Cost vs. revenue tracking",
            "Technician profitability",
            "Material cost tracking",
          ],
        },
        {
          name: "Customer History",
          icon: History,
          description: "Complete service history and notes",
          color: "indigo",
          details: [
            "Complete service timeline",
            "Equipment history",
            "Warranty tracking",
            "Notes & attachments",
          ],
        },
        {
          name: "Performance Tracking",
          icon: Target,
          description: "Monitor team and business performance",
          color: "blue",
          details: [
            "Technician scorecards",
            "Revenue by service",
            "Customer satisfaction",
            "Goal tracking",
          ],
        },
      ],
    },
    {
      name: "Automation & AI",
      description: "Work smarter with intelligent automation",
      icon: Sparkles,
      color: "from-pink-500/20 to-rose-500/20",
      features: [
        {
          name: "AI Automation",
          icon: Sparkles,
          description: "Smart workflows and AI assistance",
          badge: "AI Powered",
          color: "pink",
          details: [
            "Intelligent job routing",
            "Predictive scheduling",
            "Smart pricing suggestions",
            "Automated follow-ups",
          ],
        },
        {
          name: "Service Agreements",
          icon: RefreshCw,
          description: "Manage recurring revenue and maintenance plans",
          color: "rose",
          details: [
            "Recurring service management",
            "Automatic renewals",
            "Member pricing tiers",
            "Payment plans",
          ],
        },
        {
          name: "Accounting Integration",
          icon: Link2,
          description: "Seamless sync with QuickBooks and more",
          color: "red",
          details: [
            "QuickBooks sync",
            "Xero integration",
            "Automatic reconciliation",
            "Tax categorization",
          ],
        },
        {
          name: "Inventory Management",
          icon: Package,
          description: "Track parts and materials efficiently",
          color: "orange",
          details: [
            "Real-time stock levels",
            "Low stock alerts",
            "Vendor management",
            "Purchase orders",
          ],
        },
      ],
    },
  ];

  const activeData = categories[activeCategory];
  const activeFeatureData = activeData.features[activeFeature];

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            className="mb-4 gap-1.5 bg-primary/10 text-primary"
            variant="outline"
          >
            <Sparkles className="size-3" />
            Features
          </Badge>
          <h2 className="mb-4 text-balance font-semibold text-4xl text-white md:text-6xl">
            Everything You Need in One Platform
          </h2>
          <p className="mx-auto max-w-2xl text-foreground text-lg md:text-xl">
            Powerful features designed to streamline every aspect of your field
            service business
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex gap-3 md:justify-center">
            {categories.map((category, idx) => (
              <button
                className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-6 py-4 transition-all duration-300 ${
                  idx === activeCategory
                    ? "scale-105 border-primary bg-gradient-to-br from-primary/10 to-transparent shadow-lg shadow-primary/20"
                    : "border-border bg-black/50 hover:border-primary/50 hover:bg-primary/5"
                }`}
                key={idx}
                onClick={() => {
                  setActiveCategory(idx);
                  setActiveFeature(0);
                }}
                type="button"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${idx === activeCategory ? "bg-primary/20" : "bg-border transition-colors group-hover:bg-primary/10"}`}
                >
                  <category.icon
                    className={`size-5 ${idx === activeCategory ? "text-primary" : "text-foreground transition-colors group-hover:text-primary"}`}
                  />
                </div>
                <div className="text-left">
                  <div
                    className={`font-semibold text-sm ${idx === activeCategory ? "text-white" : "text-foreground transition-colors group-hover:text-white"}`}
                  >
                    {category.name}
                  </div>
                  <div className="hidden text-foreground text-xs md:block">
                    {category.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Feature List */}
          <div className="space-y-3 lg:col-span-5">
            {activeData.features.map((feature, idx) => (
              <button
                className={`group w-full rounded-2xl border p-6 text-left transition-all duration-300 ${
                  idx === activeFeature
                    ? "scale-105 border-primary bg-gradient-to-br from-primary/10 to-transparent shadow-lg shadow-primary/20"
                    : "border-border bg-black/30 hover:scale-102 hover:border-primary/30 hover:bg-primary/5"
                }`}
                key={idx}
                onClick={() => setActiveFeature(idx)}
                onMouseEnter={() => setActiveFeature(idx)}
                type="button"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${idx === activeFeature ? "scale-110 bg-primary/20" : "bg-border group-hover:scale-110 group-hover:bg-primary/10"}`}
                  >
                    <feature.icon
                      className={`size-6 ${idx === activeFeature ? "text-primary" : "text-foreground transition-colors group-hover:text-primary"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3
                        className={`font-semibold text-lg ${idx === activeFeature ? "text-white" : "text-foreground transition-colors group-hover:text-white"}`}
                      >
                        {feature.name}
                      </h3>
                      {feature.badge && (
                        <Badge
                          className="gap-1 bg-primary/20 text-primary text-xs"
                          variant="outline"
                        >
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-sm ${idx === activeFeature ? "text-foreground" : "text-foreground/70 transition-colors group-hover:text-foreground"}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`size-5 shrink-0 transition-all duration-300 ${idx === activeFeature ? "translate-x-1 text-primary" : "text-border group-hover:translate-x-1 group-hover:text-primary"}`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Feature Detail Panel */}
          <div className="lg:col-span-7">
            <div
              className={`sticky top-24 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br ${activeData.color} p-8 lg:p-12`}
            >
              {/* Icon & Title */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-black/40 backdrop-blur-sm">
                    <activeFeatureData.icon className="size-8 text-primary" />
                  </div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-bold text-3xl text-white">
                      {activeFeatureData.name}
                    </h3>
                    {activeFeatureData.badge && (
                      <Badge
                        className="gap-1.5 bg-primary/20 text-primary"
                        variant="outline"
                      >
                        <Sparkles className="size-3" />
                        {activeFeatureData.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-foreground text-lg">
                    {activeFeatureData.description}
                  </p>
                </div>
              </div>

              {/* Feature Details */}
              {activeFeatureData.details && (
                <div className="mb-8 space-y-3">
                  <h4 className="mb-4 font-semibold text-white text-xl">
                    Key Features
                  </h4>
                  {activeFeatureData.details.map((detail, idx) => (
                    <div
                      className="flex items-start gap-3 rounded-xl border border-primary/20 bg-black/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-black/60"
                      key={idx}
                    >
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <div className="size-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Button className="gap-2" size="lg">
                  Try This Feature
                  <ArrowRight className="size-4" />
                </Button>
                <Button className="gap-2" size="lg" variant="outline">
                  Learn More
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              {/* Decorative gradient blob */}
              <div className="pointer-events-none absolute top-0 right-0 size-64 bg-primary/10 opacity-50 blur-3xl" />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-foreground text-lg">
            Ready to see all{" "}
            {categories.reduce((acc, cat) => acc + cat.features.length, 0)}{" "}
            features in action?
          </p>
          <Button className="gap-2" size="lg">
            Start Free Trial
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
