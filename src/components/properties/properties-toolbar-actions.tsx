"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdownLazy as ImportExportDropdown } from "@/components/data/import-export-dropdown-lazy";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function PropertiesToolbarActions() {
	return (
		<div className="flex items-center gap-2">
			{/* Import/Export */}
			<ImportExportDropdown dataType="properties" />

			<Separator className="h-6" orientation="vertical" />

			{/* Add New Property */}
			<Button asChild className="gap-2 font-medium" size="sm">
				<Link href="/dashboard/work/properties/new">
					<Plus className="size-4" />
					Add Property
				</Link>
			</Button>
		</div>
	);
}
