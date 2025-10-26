"use client";

import { ExternalLink, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Tool = {
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

const tools: Tool[] = [
  {
    label: "Pricing Calculator",
    description: "Calculate your company's pricing and margins",
    href: "/dashboard/tools/pricing-calculator",
  },
  {
    label: "NextStar Portal",
    description: "Access NextStar features and integrations",
    href: "https://nextstar.com",
    external: true,
  },
  {
    label: "ROI Calculator",
    description: "Calculate return on investment for projects",
    href: "/dashboard/tools/roi-calculator",
  },
  {
    label: "Time Estimator",
    description: "Estimate job duration and resource needs",
    href: "/dashboard/tools/time-estimator",
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
            <h3 className="font-semibold text-sm">Tools</h3>
            <p className="text-muted-foreground text-xs">
              Helpful calculators and utilities
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
              href="/dashboard/tools"
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
