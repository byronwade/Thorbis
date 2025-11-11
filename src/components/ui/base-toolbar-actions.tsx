/**
 * BaseToolbarActions - Base Toolbar Actions Component
 * 
 * Provides a reusable base for toolbar actions with common patterns:
 * - Optional view switcher
 * - Primary action button (New/Create)
 * - Import/Export dropdown
 * - Additional custom actions
 * 
 * This reduces duplication across toolbar action components.
 */

"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";
import type { ReactNode } from "react";

export interface BaseToolbarActionsProps {
  /** Optional view switcher section (e.g., "jobs", "invoices", "customers") */
  viewSwitcherSection?: string;
  
  /** Primary action button configuration */
  primaryAction?: {
    href: string;
    label: string;
    icon?: ReactNode;
  };
  
  /** Import/Export data type */
  importExportDataType?: string;
  
  /** Additional custom actions to render */
  children?: ReactNode;
  
  /** Custom actions to render before primary action */
  beforePrimaryAction?: ReactNode;
  
  /** Custom actions to render after primary action */
  afterPrimaryAction?: ReactNode;
}

export function BaseToolbarActions({
  viewSwitcherSection,
  primaryAction,
  importExportDataType,
  children,
  beforePrimaryAction,
  afterPrimaryAction,
}: BaseToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {viewSwitcherSection && (
        <WorkViewSwitcher section={viewSwitcherSection} />
      )}
      {beforePrimaryAction}
      {primaryAction && (
        <Button asChild size="default" variant="default">
          <Link href={primaryAction.href}>
            {primaryAction.icon || <Plus className="mr-2 size-4" />}
            {primaryAction.label}
          </Link>
        </Button>
      )}
      {afterPrimaryAction}
      {importExportDataType && (
        <ImportExportDropdown dataType={importExportDataType} />
      )}
      {children}
    </div>
  );
}





