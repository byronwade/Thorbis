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

import {
	Archive,
	ArrowLeft,
	Copy,
	Edit,
	Loader2,
	MoreVertical,
	RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	archivePriceBookItem,
	duplicatePriceBookItem,
	restorePriceBookItem,
} from "@/actions/price-book";
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
import { useToast } from "@/hooks/use-toast";

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
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleDuplicate = async () => {
		setIsLoading(true);
		try {
			const result = await duplicatePriceBookItem(itemId);
			if (result.success && result.newItemId) {
				toast.success("Item duplicated successfully");
				router.push(`/dashboard/work/pricebook/${result.newItemId}`);
			} else {
				toast.error(result.error || "Failed to duplicate item");
			}
		} catch (_error) {
			toast.error("Failed to duplicate item");
		} finally {
			setIsLoading(false);
		}
	};

	const handleArchiveOrRestore = async () => {
		setIsLoading(true);
		try {
			const result = isActive
				? await archivePriceBookItem(itemId)
				: await restorePriceBookItem(itemId);

			if (result.success) {
				toast.success(
					isActive ? "Item archived successfully" : "Item restored successfully",
				);
				if (isActive) {
					router.push("/dashboard/work/pricebook");
				} else {
					router.refresh();
				}
			} else {
				toast.error(result.error || "Operation failed");
			}
		} catch (_error) {
			toast.error("Operation failed");
		} finally {
			setIsLoading(false);
		}
	};

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
					<Button
						className="hover:bg-muted gap-2"
						disabled={isLoading}
						size="sm"
						variant="ghost"
					>
						{isLoading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<MoreVertical className="size-4" />
						)}
						<span className="hidden sm:inline">More</span>
						<span className="sr-only">More actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem disabled={isLoading} onClick={handleDuplicate}>
						<Copy className="mr-2 size-4" />
						Duplicate Item
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className={isActive ? "text-destructive" : ""}
						disabled={isLoading}
						onClick={handleArchiveOrRestore}
					>
						{isActive ? (
							<>
								<Archive className="mr-2 size-4" />
								Archive Item
							</>
						) : (
							<>
								<RotateCcw className="mr-2 size-4" />
								Restore Item
							</>
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Ellipsis Menu - Export/Import & More */}
			<Separator className="h-6" orientation="vertical" />
			<ImportExportDropdown dataType="pricebook" />
		</div>
	);
}
