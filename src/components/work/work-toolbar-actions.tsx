"use client";

/**
 * WorkToolbarActions Component - Client Component
 *
 * Toolbar actions for the work/jobs page
 * - View switcher
 * - Filter button
 * - New Job button
 * - Import/Export
 */

import { Filter } from "lucide-react";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { Button } from "@/components/ui/button";

export function WorkToolbarActions() {
  return (
    <BaseToolbarActions
      viewSwitcherSection="jobs"
      beforePrimaryAction={
        <Button size="default" variant="ghost">
          <Filter className="mr-2 size-4" />
          Filter
        </Button>
      }
      primaryAction={{
        href: "/dashboard/work/new",
        label: "New Job",
      }}
      importExportDataType="jobs"
    />
  );
}
