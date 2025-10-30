"use client";

import { ExternalLink, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Tool = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
  badge?: string;
};

const tools: Tool[] = [
  {
    label: "Job Pricing Calculator",
    description: "Price jobs with materials, labor, and overhead",
    href: "/tools/calculators/job-pricing",
    badge: "Essential",
  },
  {
    label: "Hourly Rate Calculator",
    description: "Calculate your ideal hourly billing rate",
    href: "/tools/calculators/hourly-rate",
    badge: "Popular",
  },
  {
    label: "Profit & Loss Calculator",
    description: "Track revenue and calculate profit margins",
    href: "/tools/calculators/profit-loss",
    badge: "Popular",
  },
  {
    label: "Google Business Profile",
    description: "Get found in local searches",
    href: "/tools/marketing/google-business",
  },
  {
    label: "Consumer Financing",
    description: "Offer customer financing options",
    href: "/tools/financing/consumer",
  },
];

export function ToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="hover-gradient flex h-8 w-8 items-center justify-center rounded-md border border-transparent outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        title="Tools"
        type="button"
      >
        <Wrench className="size-4" />
        <span className="sr-only">Tools</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
          <div className="mb-2 border-b px-3 py-2">
            <h3 className="font-semibold text-sm">Tools & Resources</h3>
            <p className="text-muted-foreground text-xs">
              Everything you need to grow your business
            </p>
          </div>
          <div className="space-y-1">
            {tools.map((tool) => (
              <Link
                className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
                href={tool.href}
                key={tool.label}
                onClick={() => setIsOpen(false)}
                rel={tool.external ? "noopener noreferrer" : undefined}
                target={tool.external ? "_blank" : undefined}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{tool.label}</p>
                    {tool.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
                        {tool.badge}
                      </span>
                    )}
                    {tool.external && (
                      <ExternalLink className="size-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-2 border-t pt-2">
            <Link
              className="flex items-center justify-center gap-2 rounded-md px-3 py-2 font-medium text-primary text-xs transition-colors hover:bg-accent"
              href="/tools"
              onClick={() => setIsOpen(false)}
            >
              View all tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
