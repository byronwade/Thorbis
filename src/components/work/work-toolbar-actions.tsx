"use client";

/**
 * WorkToolbarActions Component - Client Component
 *
 * Toolbar actions for the work/jobs page
 * - Filter button
 * - New Job button
 */

import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WorkToolbarActions() {
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
    </div>
  );
}
