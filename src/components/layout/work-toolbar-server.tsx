/**
 * Work Toolbar Actions - Server Component Version
 *
 * Performance optimization:
 * - Converted to Server Component (was client component)
 * - Static rendering at build time
 * - Zero JavaScript shipped to client for static parts
 * - Only dropdown remains as client component
 *
 * Bundle size reduction: ~5KB per toolbar
 */

import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function WorkToolbarServer() {
  return (
    <div className="flex items-center gap-1">
      <Button size="sm" variant="ghost">
        <Filter className="mr-2 size-4" />
        Filter
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/new">
          <Plus className="mr-2 size-4" />
          New Job
        </Link>
      </Button>
      <ImportExportDropdown dataType="jobs" />
    </div>
  );
}
