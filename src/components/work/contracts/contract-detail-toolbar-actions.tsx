"use client";

/**
 * Contract Detail Toolbar Actions - Client Component
 *
 * Provides contract-specific toolbar actions:
 * - Send for signature
 * - Download PDF
 * - Duplicate contract
 * - Archive contract
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Copy, Download, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveContract } from "@/actions/contracts";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function ContractDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const contractId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		if (!contractId) {
			toast.error("Contract ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveContract(contractId);
			if (result.success) {
				toast.success("Contract archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/contracts");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive contract");
			}
		} catch {
			toast.error("Failed to archive contract");
		} finally {
			setIsArchiving(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Quick Actions - Standardized styling */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button size="sm" variant="outline">
								<Mail />
								<span className="hidden md:inline">Send</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Send for signature</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button size="sm" variant="outline">
								<Download />
								<span className="hidden lg:inline">PDF</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Download PDF</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a
									href={`/dashboard/work/contracts/new?cloneFrom=${contractId}`}
								>
									<Copy />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate contract</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-8" orientation="vertical" />
				<ImportExportDropdown dataType="contracts" />

				<Separator className="h-8" orientation="vertical" />
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
							<p>Archive contract</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Contract</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this contract? Archived contracts
							can be restored within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isArchiving}
							onClick={() => setIsArchiveDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isArchiving}
							onClick={handleArchive}
							variant="destructive"
						>
							{isArchiving ? "Archiving..." : "Archive Contract"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
