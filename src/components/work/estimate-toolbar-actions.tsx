"use client";

/**
 * Estimate Toolbar Actions - Client Component
 *
 * Provides estimate-specific toolbar actions
 * - New estimate button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function EstimateToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/estimates/new">
          <Plus className="mr-2 size-4" />
          New Estimate
        </Link>
      </Button>
      <ImportExportDropdown dataType="estimates" />
    </div>
  );
}
