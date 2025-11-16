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

import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  type DataType,
  ImportExportDropdown,
} from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";
import type { WorkSection } from "@/lib/stores/work-view-store";

export type BaseToolbarActionsProps = {
  /** Optional view switcher section (e.g., "jobs", "invoices", "customers") */
  viewSwitcherSection?: WorkSection;

  /** Primary action button configuration */
  primaryAction?: {
    href: string;
    label: string;
    icon?: ReactNode;
  };

  /** Import/Export data type */
  importExportDataType?: DataType;

  /** Additional custom actions to render */
  children?: ReactNode;

  /** Custom actions to render before primary action */
  beforePrimaryAction?: ReactNode;

  /** Custom actions to render after primary action */
  afterPrimaryAction?: ReactNode;
};

export function BaseToolbarActions({
  viewSwitcherSection,
  primaryAction,
  importExportDataType,
  children,
  beforePrimaryAction,
  afterPrimaryAction,
}: BaseToolbarActionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {viewSwitcherSection && (
        <WorkViewSwitcher section={viewSwitcherSection} />
      )}
      {beforePrimaryAction}
      {primaryAction && (
        <Button asChild className="font-medium" size="sm" variant="default">
          <Link href={primaryAction.href}>
            {primaryAction.icon || <Plus className="size-4" />}
            <span>{primaryAction.label}</span>
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
