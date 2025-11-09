"use client";

/**
 * Maintenance Plan Toolbar Actions - Client Component
 *
 * Provides maintenance plan-specific toolbar actions
 * - New plan button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function MaintenancePlanToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/maintenance-plans/new">
          <Plus className="mr-2 size-4" />
          New Plan
        </Link>
      </Button>
      <ImportExportDropdown dataType="maintenance-plans" />
    </div>
  );
}
