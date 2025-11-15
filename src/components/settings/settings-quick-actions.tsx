"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { trackCustomEvent } from "@/lib/analytics/client";
import type { SettingsQuickAction } from "@/lib/settings/overview-data";
import { cn } from "@/lib/utils";

interface SettingsQuickActionsProps {
  actions: SettingsQuickAction[];
  section: string;
}

export function SettingsQuickActions({
  actions,
  section,
}: SettingsQuickActionsProps) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          className={cn(
            buttonVariants({
              variant: action.variant ?? "default",
              size: "sm",
            }),
            "group justify-between"
          )}
          href={action.href}
          key={action.key}
          onClick={() =>
            trackCustomEvent("settings.quick_action", {
              action: action.analyticsEvent ?? action.key,
              section,
            })
          }
        >
          {action.label}
          <span className="ml-2 text-muted-foreground transition-transform group-hover:translate-x-0.5">
            ↗
          </span>
        </Link>
      ))}
    </div>
  );
}
