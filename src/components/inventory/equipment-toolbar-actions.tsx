"use client";

/**
 * Equipment Toolbar Actions - Client Component
 *
 * Provides equipment inventory-specific toolbar actions
 * - Add equipment button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function EquipmentToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/inventory/equipment/new">
          <Plus className="mr-2 size-4" />
          Add Equipment
        </Link>
      </Button>
      <ImportExportDropdown dataType="equipment" />
    </div>
  );
}
