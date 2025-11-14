"use client";

import {
  BookOpen,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type HelpItem = {
  label: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  external?: boolean;
};

const helpItems: HelpItem[] = [
  {
    label: "Documentation",
    description: "Guides and tutorials for all features",
    href: "/docs",
    icon: BookOpen,
  },
  {
    label: "Video Tutorials",
    description: "Step-by-step video guides",
    href: "/docs/videos",
    icon: Video,
  },
  {
    label: "Support Center",
    description: "Get help from our support team",
    href: "/support",
    icon: LifeBuoy,
  },
  {
    label: "Contact Support",
    description: "Chat with our support team",
    href: "/support/contact",
    icon: MessageCircle,
  },
  {
    label: "What's New",
    description: "Latest features and updates",
    href: "/changelog",
    icon: HelpCircle,
  },
];

export function HelpDropdown() {
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
        title="Help"
        type="button"
      >
        <HelpCircle className="size-4" />
        <span className="sr-only">Help</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
          <div className="mb-2 border-b px-3 py-2">
            <h3 className="font-semibold text-sm">Help &amp; Support</h3>
            <p className="text-muted-foreground text-xs">
              Find answers and get assistance
            </p>
          </div>
          <div className="space-y-1">
            {helpItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsOpen(false)}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  target={item.external ? "_blank" : undefined}
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{item.label}</p>
                      {item.external && (
                        <ExternalLink className="size-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-2 border-t pt-2">
            <div className="rounded-md bg-accent/50 px-3 py-2">
              <p className="font-medium text-xs">Need more help?</p>
              <p className="text-muted-foreground text-xs">
                Email us at{" "}
                <a
                  className="text-primary hover:underline"
                  href="mailto:support@thorbis.com"
                >
                  support@thorbis.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
