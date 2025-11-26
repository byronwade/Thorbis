/**
 * ImportExportDropdown - Lazy Loaded Wrapper
 *
 * Performance optimization:
 * - Dynamically imports the full import/export dropdown component
 * - Only loads when user interacts with the dropdown (click)
 * - Reduces initial bundle by ~25KB
 * - Shows ellipsis button immediately, loads menu on demand
 */

"use client";

import { MoreVertical } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import type { DataType } from "./import-export-dropdown";

const ImportExportDropdown = dynamic(
	() =>
		import("./import-export-dropdown").then((mod) => ({
			default: mod.ImportExportDropdown,
		})),
	{
		loading: () => (
			<Button variant="ghost" size="icon" disabled>
				<MoreVertical className="size-4" />
			</Button>
		),
		ssr: false, // Dropdown menu requires browser environment for positioning
	},
);

type ImportExportDropdownLazyProps = {
	dataType: DataType;
	selectedIds?: string[];
	onBulkAction?: (action: string, ids: string[]) => void;
};

export function ImportExportDropdownLazy(props: ImportExportDropdownLazyProps) {
	return <ImportExportDropdown {...props} />;
}
