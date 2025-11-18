"use client";

import { AlertTriangle, Archive } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ArchiveConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void | Promise<void>;
	itemCount: number;
	entityType?: string;
	isLoading?: boolean;
};

export function ArchiveConfirmDialog({
	open,
	onOpenChange,
	onConfirm,
	itemCount,
	entityType = "item",
	isLoading = false,
}: ArchiveConfirmDialogProps) {
	const pluralEntity = itemCount === 1 ? entityType : `${entityType}s`;

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center gap-3">
						<div className="bg-warning dark:bg-warning flex h-10 w-10 items-center justify-center rounded-full">
							<Archive className="text-warning dark:text-warning h-5 w-5" />
						</div>
						<AlertDialogTitle>
							Archive {itemCount} {pluralEntity}?
						</AlertDialogTitle>
					</div>
					<AlertDialogDescription className="space-y-3 pt-4">
						<p>
							{itemCount === 1 ? "This item" : "These items"} will be moved to
							the archive and {itemCount === 1 ? "will" : "will"} no longer
							appear in your active lists.
						</p>
						<div className="border-warning bg-warning dark:border-warning dark:bg-warning/30 flex items-start gap-2 rounded-lg border p-3">
							<AlertTriangle className="text-warning dark:text-warning mt-0.5 h-4 w-4 shrink-0" />
							<div className="text-warning dark:text-warning text-sm">
								<p className="font-medium">Archived items will be:</p>
								<ul className="mt-1 list-inside list-disc space-y-0.5">
									<li>Hidden from all active views</li>
									<li>Restorable from the Archive page</li>
									<li>Automatically deleted after 90 days</li>
								</ul>
							</div>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-warning hover:bg-warning dark:bg-warning dark:hover:bg-warning"
						disabled={isLoading}
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
					>
						{isLoading ? (
							<>
								<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
								Archiving...
							</>
						) : (
							<>
								<Archive className="mr-2 h-4 w-4" />
								Archive {pluralEntity}
							</>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
