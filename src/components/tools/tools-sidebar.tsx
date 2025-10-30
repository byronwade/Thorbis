"use client";

/**
 * Tools Sidebar Navigation - Client Component
 *
 * Client-side features:
 * - Active link state management
 * - Smooth navigation transitions
 * - Mobile responsive menu
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

type SidebarItem = {
  title: string;
  href: string;
  badge?: string;
};

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Sections",
    items: [
      { title: "Overview", href: "/tools" },
      { title: "Marketing", href: "/tools/marketing" },
      { title: "Business Setup", href: "/tools/business" },
      { title: "Financing", href: "/tools/financing" },
      { title: "Networks", href: "/tools/networks" },
      { title: "Training", href: "/tools/training" },
      { title: "Calculators", href: "/tools/calculators" },
    ],
  },
  {
    label: "Marketing & Social Media",
    items: [
      {
        title: "Google Business Profile",
        href: "/tools/marketing/google-business",
        badge: "Essential",
      },
      {
        title: "Local Services Ads",
        href: "/tools/marketing/local-services",
        badge: "Recommended",
      },
      { title: "Facebook Business", href: "/tools/marketing/facebook" },
      { title: "Instagram", href: "/tools/marketing/instagram" },
      { title: "X (Twitter)", href: "/tools/marketing/twitter" },
      { title: "LinkedIn", href: "/tools/marketing/linkedin" },
    ],
  },
  {
    label: "Business Setup & Legal",
    items: [
      {
        title: "Business Registration",
        href: "/tools/business/registration",
        badge: "Required",
      },
      {
        title: "Licensing & Permits",
        href: "/tools/business/licensing",
        badge: "Required",
      },
      {
        title: "Business Insurance",
        href: "/tools/business/insurance",
        badge: "Essential",
      },
      { title: "Banking & Payroll", href: "/tools/business/banking" },
      { title: "Legal Resources", href: "/tools/business/legal" },
    ],
  },
  {
    label: "Financing & Payments",
    items: [
      {
        title: "Consumer Financing",
        href: "/tools/financing/consumer",
        badge: "Popular",
      },
      { title: "Business Loans", href: "/tools/financing/business-loans" },
      { title: "Equipment Financing", href: "/tools/financing/equipment" },
      { title: "Credit Card Processing", href: "/tools/financing/credit-card" },
    ],
  },
  {
    label: "Networks & Associations",
    items: [
      {
        title: "Nexstar Network",
        href: "/tools/networks/nexstar",
        badge: "Premium",
      },
      {
        title: "Service Nation",
        href: "/tools/networks/service-nation",
        badge: "Premium",
      },
      { title: "ACCA", href: "/tools/networks/acca" },
      { title: "PHCC", href: "/tools/networks/phcc" },
      { title: "NECA", href: "/tools/networks/neca" },
    ],
  },
  {
    label: "Training & Certification",
    items: [
      { title: "Trade Certifications", href: "/tools/training/certifications" },
      {
        title: "OSHA Safety Training",
        href: "/tools/training/osha",
        badge: "Required",
      },
      { title: "EPA Certifications", href: "/tools/training/epa" },
      { title: "Business Management", href: "/tools/training/business" },
    ],
  },
  {
    label: "Business Calculators",
    items: [
      {
        title: "Hourly Rate Calculator",
        href: "/tools/calculators/hourly-rate",
        badge: "Popular",
      },
      {
        title: "Job Pricing Calculator",
        href: "/tools/calculators/job-pricing",
        badge: "Essential",
      },
      {
        title: "Profit & Loss Calculator",
        href: "/tools/calculators/profit-loss",
        badge: "Popular",
      },
      { title: "Commission Calculator", href: "/tools/calculators/commission" },
      { title: "Break-Even Calculator", href: "/tools/calculators/break-even" },
      {
        title: "Industry Pricing Standards",
        href: "/tools/calculators/industry-pricing",
        badge: "Premium",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Industry News", href: "/tools/resources/news" },
      { title: "Vendor Directories", href: "/tools/resources/vendors" },
      { title: "Emergency Services", href: "/tools/resources/emergency" },
    ],
  },
];

export function ToolsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 py-2">
      {sidebarGroups.map((group) => (
        <div
          className="relative flex w-full min-w-0 flex-col p-2"
          key={group.label}
        >
          <div className="flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-muted-foreground text-xs">
            {group.label}
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li className="group/menu-item relative" key={item.href}>
                  <Link
                    className={cn(
                      "flex items-center gap-2 rounded-md p-2 text-left outline-hidden transition-all",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      "hover:bg-accent hover:text-accent-foreground",
                      "h-[30px] w-full border border-transparent font-medium text-[0.8rem]",
                      isActive &&
                        "border-accent bg-accent font-medium text-accent-foreground"
                    )}
                    href={item.href}
                  >
                    {item.title}
                    {item.badge && (
                      <span
                        className="ml-auto flex size-2 rounded-full bg-blue-500"
                        title={item.badge}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
