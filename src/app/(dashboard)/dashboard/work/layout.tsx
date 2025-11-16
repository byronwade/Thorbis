import type { ReactNode } from "react";
import { WorkSectionLayout } from "@/components/layout/work-section-layout";

/**
 * Work Section Layout - Server Component Wrapper
 *
 * This layout applies to all routes under /dashboard/work/*
 * It delegates to WorkSectionLayout which conditionally applies
 * the work layout only to list pages, not detail pages.
 *
 * Detail pages (like /dashboard/work/[id]) have their own nested layouts.
 */
export default function WorkLayout({ children }: { children: ReactNode }) {
  return <WorkSectionLayout>{children}</WorkSectionLayout>;
}
