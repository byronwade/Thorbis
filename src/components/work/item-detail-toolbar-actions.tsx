"use client";

/**
 * Item Detail Toolbar Actions - Client Component
 *
 * Provides quick actions for price book item detail pages:
 * - Back to Price Book button
 * - Edit item button
 * - Actions dropdown (Duplicate, Archive)
 *
 * Follows existing AppToolbar pattern - no custom headers!
 */

import { Archive, ArrowLeft, Copy, Edit, MoreVertical } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdownLazy as ImportExportDropdown } from "@/components/data/import-export-dropdown-lazy";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type ItemDetailToolbarActionsProps = {
	/** Item ID for edit/delete operations */
	itemId: string;
	/** Whether item is currently active */
	isActive?: boolean;
};

export function ItemDetailToolbarActions({
	itemId,
	isActive = true,
}: ItemDetailToolbarActionsProps) {
	return (
		<div className="flex items-center gap-1.5">
			{/* Back to Price Book */}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button asChild size="sm" variant="ghost">
							<Link href="/dashboard/work/pricebook">
								<ArrowLeft className="size-4" />
								<span className="hidden sm:inline">Back</span>
							</Link>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Return to price book</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Separator className="h-6" orientation="vertical" />

			{/* Edit Item */}
			<Button asChild className="gap-2 font-medium" size="sm" variant="default">
				<Link href={`/dashboard/work/pricebook/${itemId}/edit`}>
					<Edit className="size-4" />
					Edit
				</Link>
			</Button>

			{/* More Actions Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="hover:bg-muted gap-2" size="sm" variant="ghost">
						<MoreVertical className="size-4" />
						<span className="hidden sm:inline">More</span>
						<span className="sr-only">More actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => {
							/* TODO: implement duplicate */
						}}
					>
						<Copy className="mr-2 size-4" />
						Duplicate Item
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							/* TODO: implement archive/activate toggle */
						}}
					>
						<Archive className="mr-2 size-4" />
						{isActive ? "Archive" : "Activate"}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Ellipsis Menu - Export/Import & More */}
			<Separator className="h-6" orientation="vertical" />
			<ImportExportDropdown dataType="pricebook" />
		</div>
	);
}
