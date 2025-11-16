"use client";

import { Archive, Download, MoreVertical, Plus, Printer, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function VendorDetailToolbarActions() {
	const params = useParams();
	const router = useRouter();
	const vendorId = params?.id as string;
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		setIsArchiving(true);
		try {
			// TODO: Implement archiveVendor server action
			// const result = await archiveVendor(vendorId);
			// if (result.success) {
			toast.success("Vendor archived successfully");
			setIsArchiveDialogOpen(false);
			router.push("/dashboard/work/vendors");
			router.refresh();
			// } else {
			//   toast.error(result.error || "Failed to archive vendor");
			// }
		} catch (_error) {
    console.error("Error:", _error);
			toast.error("Failed to archive vendor");
		} finally {
			setIsArchiving(false);
		}
	};

	const handleExport = () => {
		toast.success("Export functionality coming soon");
	};

	const handlePrint = () => {
		window.print();
	};

	const handleShare = () => {
		toast.success("Share functionality coming soon");
	};

	return (
		<>
			<div className="flex items-center gap-2">
				{/* Quick Actions */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<Link href={`/dashboard/work/purchase-orders/new?vendorId=${vendorId}`}>
									<Plus className="size-4" />
									<span className="hidden md:inline">Create PO</span>
								</Link>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Create purchase order from this vendor</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Separator */}
				<Separator className="h-8" orientation="vertical" />

				{/* Archive Button - Destructive */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
								onClick={() => setIsArchiveDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Archive className="size-3.5" />
								<span className="hidden lg:inline">Archive</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Archive this vendor</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* More Actions Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-8 w-8 p-0" size="sm" variant="outline">
							<MoreVertical className="size-4" />
							<span className="sr-only">More actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={handleExport}>
							<Download className="mr-2 size-4" />
							Export Vendor Data
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handlePrint}>
							<Printer className="mr-2 size-4" />
							Print Details
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleShare}>
							<Share2 className="mr-2 size-4" />
							Share Vendor
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive" onClick={() => setIsArchiveDialogOpen(true)}>
							<Archive className="mr-2 size-4" />
							Archive Vendor
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Archive Confirmation Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Vendor?</DialogTitle>
						<DialogDescription>
							This vendor will be moved to the archive. You can restore it later from the archive page. All purchase
							orders will remain accessible.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button disabled={isArchiving} onClick={() => setIsArchiveDialogOpen(false)} variant="outline">
							Cancel
						</Button>
						<Button disabled={isArchiving} onClick={handleArchive} variant="destructive">
							{isArchiving ? "Archiving..." : "Archive Vendor"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
