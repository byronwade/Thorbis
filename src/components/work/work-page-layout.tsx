"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type SecondaryAction = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type WorkPageLayoutProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActions?: SecondaryAction[];
  children: ReactNode;
};

export function WorkPageLayout({
  title,
  description,
  actionLabel = "Add New",
  actionHref,
  secondaryActions = [],
  children,
}: WorkPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          {secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button asChild key={action.href} variant="outline">
                <Link href={action.href}>
                  {Icon && <Icon className="mr-2 size-4" />}
                  {action.label}
                </Link>
              </Button>
            );
          })}
          {actionHref && (
            <Button asChild>
              <Link href={actionHref}>
                <Plus className="mr-2 size-4" />
                {actionLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
