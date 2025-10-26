"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function ArchitectureSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-foreground text-xs md:text-sm">ARCHITECTURE</div>
          <h2 className="mt-4 mb-8 text-pretty font-semibold text-4xl text-white md:text-6xl">
            Modern solutions. Timeless design.
          </h2>
          <p className="text-base text-foreground md:text-lg">
            Residential, commercial, and urban planning. Transform spaces into
            experiences with our comprehensive architectural solutions.
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <a
            className="group hover:-translate-y-0.5 relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 lg:col-span-2"
            href="#"
          >
            <div className="-z-10 absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            <img
              alt="Space station interior"
              className="-z-20 absolute inset-0 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
              src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="flex h-full flex-col justify-between p-10">
              <span className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-building2 lucide-building-2 size-5 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                  <path d="M10 6h4" />
                  <path d="M10 10h4" />
                  <path d="M10 14h4" />
                  <path d="M10 18h4" />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-white">Sustainable Design</h3>
                <p className="mt-2 text-white/70">
                  Create eco-friendly spaces that blend innovation with
                  environmental responsibility. Utilizing renewable materials
                  and energy-efficient solutions for tomorrow's world.
                </p>
              </div>
            </div>
          </a>

          <a
            className="group hover:-translate-y-0.5 relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300"
            href="#"
          >
            <div className="-z-10 absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            <img
              alt="Space colony"
              className="-z-20 absolute inset-0 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
              src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="flex h-full flex-col justify-between p-10">
              <span className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-landmark size-5 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="3" x2="21" y1="22" y2="22" />
                  <line x1="6" x2="6" y1="18" y2="11" />
                  <line x1="10" x2="10" y1="18" y2="11" />
                  <line x1="14" x2="14" y1="18" y2="11" />
                  <line x1="18" x2="18" y1="18" y2="11" />
                  <polygon points="12 2 20 7 4 7" />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-white">Urban Planning</h3>
                <p className="mt-2 text-white/70">
                  Design thriving communities that balance density with
                  livability, fostering growth.
                </p>
              </div>
            </div>
          </a>

          <a
            className="group hover:-translate-y-0.5 relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300"
            href="#"
          >
            <div className="-z-10 absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            <img
              alt="Space technology"
              className="-z-20 absolute inset-0 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="flex h-full flex-col justify-between p-10">
              <span className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-layout-grid size-5 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="7" rx="1" width="7" x="3" y="3" />
                  <rect height="7" rx="1" width="7" x="14" y="3" />
                  <rect height="7" rx="1" width="7" x="14" y="14" />
                  <rect height="7" rx="1" width="7" x="3" y="14" />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-white">Digital Integration</h3>
                <p className="mt-2 text-white/70">
                  Blend smart technology with architectural design, creating
                  responsive spaces for living.
                </p>
              </div>
            </div>
          </a>

          <a
            className="group hover:-translate-y-0.5 relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 lg:col-span-2"
            href="#"
          >
            <div className="-z-10 absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            <img
              alt="Space station exterior"
              className="-z-20 absolute inset-0 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2014&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="flex h-full flex-col justify-between p-10">
              <span className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-compass size-5 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-white">BIM Solutions</h3>
                <p className="mt-2 text-white/70">
                  From concept to construction, leverage advanced modeling tools
                  and AI-driven analytics for precise and efficient project
                  delivery.
                </p>
              </div>
            </div>
          </a>

          <a
            className="group hover:-translate-y-0.5 relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 lg:col-span-2"
            href="#"
          >
            <div className="-z-10 absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            <img
              alt="Space habitat"
              className="-z-20 absolute inset-0 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
              src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="flex h-full flex-col justify-between p-10">
              <span className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-house size-5 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-white">
                  Heritage Preservation
                </h3>
                <p className="mt-2 text-white/70">
                  Restore and adapt historical structures while preserving their
                  cultural significance and architectural heritage for future
                  generations.
                </p>
              </div>
            </div>
          </a>

          <a
            className="group hover:-translate-y-0.5 relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300"
            href="#"
          >
            <div className="-z-10 absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            <img
              alt="Space interior design"
              className="-z-20 absolute inset-0 size-full rounded-2xl object-cover grayscale-100 transition-all duration-300 group-hover:grayscale-50"
              src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1953&auto=format&fit=crop&ixlib=rb-4.0.3"
            />
            <div className="flex h-full flex-col justify-between p-10">
              <span className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-circle-dot size-5 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="1" />
                </svg>
              </span>
              <div>
                <h3 className="font-medium text-white">Interior Innovation</h3>
                <p className="mt-2 text-white/70">
                  Transform interior spaces with cutting-edge design solutions
                  for aesthetics functionality.
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(
    "Smart Scheduling & Dispatch"
  );

  const features = {
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

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 font-bold text-4xl text-white md:text-5xl lg:mb-20 lg:text-6xl">
          Discover Our Powerful Features
        </h1>
        <div className="relative gap-6 pb-72 md:grid md:grid-cols-5 md:pb-0">
          <div className="col-span-3 pb-4">
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() =>
                setActiveFeature("Smart Scheduling & Dispatch")
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "Smart Scheduling & Dispatch" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-all duration-300 ${activeFeature === "Smart Scheduling & Dispatch" ? "bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent" : "text-foreground group-hover:translate-x-1 group-hover:text-primary"}`}
                >
                  Smart Scheduling & Dispatch
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() =>
                setActiveFeature("Instant Invoicing & Payments")
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "Instant Invoicing & Payments" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-all duration-300 ${activeFeature === "Instant Invoicing & Payments" ? "bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent" : "text-foreground group-hover:translate-x-1 group-hover:text-primary"}`}
                >
                  Instant Invoicing & Payments
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Quotes & Estimates")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Quotes & Estimates" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Quotes & Estimates
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("CRM & Communication")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "CRM & Communication" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  CRM & Communication
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Mobile Field App")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Mobile Field App" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Mobile Field App
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Online Booking")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Online Booking" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Online Booking
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Reporting & Analytics")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Reporting & Analytics" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Reporting & Analytics
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Accounting Integration")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Accounting Integration" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Accounting Integration
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Service Agreements")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Service Agreements" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Service Agreements
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Automation & AI")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Automation & AI" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Automation & AI
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Inventory Management")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Inventory Management" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Inventory Management
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Job Costing")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Job Costing" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Job Costing
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("GPS Tracking")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "GPS Tracking" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  GPS Tracking
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Customer Portal")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Customer Portal" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Customer Portal
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Marketing Tools")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Marketing Tools" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Marketing Tools
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Digital Pricebook")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Digital Pricebook" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Digital Pricebook
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Photo Attachments")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Photo Attachments" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Photo Attachments
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Signature Capture")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Signature Capture" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Signature Capture
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Multi-Location")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Multi-Location" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Multi-Location
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Equipment Tracking")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Equipment Tracking" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Equipment Tracking
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Employee Management")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Employee Management" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Employee Management
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Payment Processing")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Payment Processing" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Payment Processing
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Text & Email Alerts")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Text & Email Alerts" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Text & Email Alerts
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Route Optimization")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Route Optimization" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Route Optimization
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Work Order Management")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Work Order Management" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Work Order Management
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Field Inspection Forms")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Field Inspection Forms" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Field Inspection Forms
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Parts & Labor Tracking")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Parts & Labor Tracking" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Parts & Labor Tracking
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Customer History")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Customer History" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Customer History
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Warranty Management")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Warranty Management" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Warranty Management
                </h2>
              </div>
            </div>
            <div
              className="feature-item group hover:-translate-y-0.5 relative cursor-pointer rounded-lg px-4 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/20"
              onMouseEnter={() => setActiveFeature("Dispatch Board")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full bg-primary shadow-primary/40 shadow-sm transition-all duration-300 md:size-3 ${activeFeature === "\x01" ? "visible scale-100 opacity-100" : "invisible scale-75 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-60"}`}
                />
                <h2
                  className={`font-bold text-[clamp(1.65rem,3vw,2.15rem)] transition-colors duration-200 ${activeFeature === "Dispatch Board" ? "text-foreground" : "text-foreground group-hover:text-white"}`}
                >
                  Dispatch Board
                </h2>
              </div>
            </div>
          </div>
          <div className="sticky bottom-3 left-3 col-span-2 h-72 w-fit transition-all duration-500 md:top-20 md:h-fit">
            <div className="group relative flex h-72 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/20 to-transparent transition-all duration-500 md:h-auto">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="mb-4 text-6xl transition-all duration-500 group-hover:scale-125">
                  {features[activeFeature as keyof typeof features]?.emoji ||
                    "🤝"}
                </div>
                <h3 className="mb-2 font-semibold text-white text-xl transition-all duration-300">
                  {activeFeature}
                </h3>
                <p className="mx-auto max-w-xs text-foreground text-sm leading-relaxed transition-all duration-300">
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

export function IntegrationsSection() {
  return (
    <section className="bg-black py-24 md:py-52">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="mx-auto w-full max-w-[43.125rem]">
            <div className="flex w-full items-end justify-center gap-[2.8%]">
              {/* QuickBooks */}
              <div className="relative w-full max-w-[8.25rem] origin-bottom scale-[.83] overflow-hidden rounded-[20%] border border-border bg-muted opacity-70 shadow-[inset_0_1px_1px_0_var(--color-stone-700)] blur-[3px] before:absolute before:top-0 before:left-0 before:z-10 before:block before:size-full before:bg-linear-to-tr before:from-primary before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      QB
                    </div>
                  </div>
                </div>
              </div>

              {/* Salesforce */}
              <div className="relative w-full max-w-[8.25rem] origin-bottom scale-90 overflow-hidden rounded-[20%] border border-border bg-muted shadow-[inset_0_1px_1px_0_var(--color-stone-700)] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-tr before:from-black/50 before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      SF
                    </div>
                  </div>
                </div>
              </div>

              {/* Stripe */}
              <div className="w-full max-w-[8.25rem] overflow-hidden rounded-[20%] border border-border bg-muted shadow-[inset_0_1px_1px_0_var(--color-stone-700)]">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      $
                    </div>
                  </div>
                </div>
              </div>

              {/* Slack */}
              <div className="relative w-full max-w-[8.25rem] origin-bottom scale-90 overflow-hidden rounded-[20%] border border-border bg-muted shadow-[inset_0_1px_1px_0_var(--color-stone-700)] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-tl before:from-black/50 before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      #
                    </div>
                  </div>
                </div>
              </div>

              {/* Google */}
              <div className="relative w-full max-w-[8.25rem] origin-bottom scale-[.83] overflow-hidden rounded-[20%] border border-border bg-muted opacity-70 shadow-[inset_0_1px_1px_0_var(--color-stone-700)] blur-[3px] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-tl before:from-primary before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      G
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full items-start justify-center gap-[2.8%] pt-[3%]">
              {/* GitHub */}
              <div className="relative w-full max-w-[7.625rem] origin-bottom scale-[.83] overflow-hidden rounded-[20%] border border-border bg-muted opacity-70 shadow-[inset_0_1px_1px_0_var(--color-stone-700)] blur-[3px] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-tr before:from-primary before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      GH
                    </div>
                  </div>
                </div>
              </div>

              {/* Microsoft */}
              <div className="relative w-full max-w-[7.625rem] overflow-hidden rounded-[20%] border border-border bg-muted opacity-90 shadow-[inset_0_1px_1px_0_var(--color-stone-700)] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-t before:from-primary before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      MS
                    </div>
                  </div>
                </div>
              </div>

              {/* Zoom */}
              <div className="relative w-full max-w-[7.625rem] overflow-hidden rounded-[20%] border border-border bg-muted opacity-90 shadow-[inset_0_1px_1px_0_var(--color-stone-700)] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-t before:from-primary before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      Z
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropbox */}
              <div className="relative w-full max-w-[7.625rem] origin-bottom scale-[.83] overflow-hidden rounded-[20%] border border-border bg-muted opacity-70 shadow-[inset_0_1px_1px_0_var(--color-stone-700)] blur-[3px] before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-full before:w-full before:bg-linear-to-tl before:from-primary before:to-transparent before:content-['']">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <div className="m-auto flex w-[60%] items-center justify-center font-bold text-lg text-white">
                      DB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-5 text-center font-sans font-semibold text-5xl text-white leading-tight md:text-7xl">
              Seamless Integrations
            </h1>
            <p className="max-w-[35rem] text-center font-sans text-foreground text-xl">
              Connect with the tools you already use. Streamline your workflow
              with our comprehensive integration ecosystem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComplianceSection() {
  return (
    <section className="bg-black py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-9 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Badge className="gap-1.5 bg-background" variant="outline">
              <span className="size-1.5 rounded-full bg-muted-foreground" />
              Compliance
            </Badge>
            <h1 className="text-balance font-medium text-4xl text-white lg:text-5xl">
              Complete Compliance & Security Readiness
            </h1>
            <p className="text-foreground text-lg">
              Stay compliant with privacy and healthcare regulations. Our
              platform meets GDPR and HIPAA requirements, providing data
              protection and compliance monitoring for regulated industries.
            </p>
            <div className="flex items-center gap-6">
              <img
                alt="GDPR"
                className="h-22 opacity-50 grayscale md:h-28 dark:invert"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/GDPR.svg"
              />
              <img
                alt="ISO-27001"
                className="h-22 opacity-60 grayscale md:h-28 dark:invert"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/CCPA.svg"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
            <div className="relative overflow-hidden border-border border-b p-6 lg:px-8 lg:py-11">
              <div>
                <h2 className="font-medium text-white text-xl lg:text-2xl">
                  Automated audit trails
                </h2>
                <p className="mt-2 w-3/4 pr-10 text-foreground text-sm md:text-base">
                  Every action is logged and timestamped with immutable audit
                  trails for complete regulatory compliance.
                </p>
              </div>
              <img
                alt="ISO-27001"
                className="-bottom-7 absolute right-4 size-24 text-muted-foreground opacity-80 grayscale lg:right-8 lg:size-32 dark:invert"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/ISO-27001.svg"
              />
            </div>
            <div className="relative overflow-hidden p-6 lg:px-8 lg:py-11">
              <div>
                <h2 className="font-medium text-white text-xl lg:text-2xl">
                  Compliance monitoring
                </h2>
                <p className="mt-2 w-3/4 pr-10 text-foreground text-sm md:text-base">
                  Real-time monitoring ensures continuous compliance with
                  industry standards and regulations.
                </p>
              </div>
              <img
                alt="ISO-27001"
                className="-bottom-7 absolute right-4 size-24 text-muted-foreground opacity-80 grayscale lg:right-8 lg:size-32 dark:invert"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/ISO-27017.svg"
              />
            </div>
            <div className="relative overflow-hidden border-border border-t p-6 lg:px-8 lg:py-11">
              <div>
                <h2 className="font-medium text-white text-xl lg:text-2xl">
                  Regulatory reporting
                </h2>
                <p className="mt-2 w-3/4 pr-10 text-foreground text-sm md:text-base">
                  Generate compliance reports automatically to meet regulatory
                  requirements and audit demands.
                </p>
              </div>
              <img
                alt="ISO-27001"
                className="-bottom-7 absolute right-4 size-24 text-muted-foreground opacity-80 grayscale lg:right-8 lg:size-32 dark:invert"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/compliance/ISO-27018.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
