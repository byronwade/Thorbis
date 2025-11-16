"use client";

/**
 * Price Book Toolbar Actions - Client Component
 *
 * Provides quick actions for the price book page:
 * - Add new item button
 * - Labor calculator quick access
 * - Export/import actions
 * - Bulk operations
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { LaborCalculatorModal } from "@/components/work/labor-calculator-modal";

export function PriceBookToolbarActions() {
	return (
		<div className="flex items-center gap-2">
			<LaborCalculatorModal />
			<Button asChild size="default" variant="default">
				<Link href="/dashboard/work/pricebook/new">
					<Plus className="mr-2 size-4" />
					Add Item
				</Link>
			</Button>
			<ImportExportDropdown dataType="pricebook" />
		</div>
	);
}
