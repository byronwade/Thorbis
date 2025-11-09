"use client";

/**
 * Materials Toolbar Actions - Client Component
 *
 * Provides materials inventory-specific toolbar actions
 * - Add material button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function MaterialsToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/inventory/materials/new">
          <Plus className="mr-2 size-4" />
          Add Material
        </Link>
      </Button>
      <ImportExportDropdown dataType="materials" />
    </div>
  );
}
