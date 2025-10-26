"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface WorkPageLayoutProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children: ReactNode;
}

export function WorkPageLayout({ title, description, actionLabel = "Add New", actionHref, children }: WorkPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actionHref && (
          <Button asChild>
            <Link href={actionHref}>
              <Plus className="mr-2 size-4" />
              {actionLabel}
            </Link>
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
