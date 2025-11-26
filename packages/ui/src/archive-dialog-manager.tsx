"use client";

/**
 * Archive Dialog Manager
 * Reusable component for managing archive/restore dialogs across tables
 *
 * Usage:
 * ```tsx
 * const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
 *   onConfirm: async (id) => {
 *     await archiveItem(id);
 *     router.refresh();
 *   }
 * });
 *
 * // In your table:
 * <Button onClick={() => openArchiveDialog(item.id)}>Archive</Button>
 * <ArchiveDialogComponent />
 * ```
 */

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./alert-dialog";

type ArchiveDialogOptions = {
	/** Callback when archive is confirmed */
	onConfirm: (itemId: string) => Promise<void> | void;
	/** Title for the dialog (default: "Archive Item?") */
	title?: string;
	/** Description text (default: "This item will be archived...") */
	description?: string;
	/** Confirm button text (default: "Archive") */
	confirmText?: string;
	/** Cancel button text (default: "Cancel") */
	cancelText?: string;
	/** Whether this is a restore action instead (changes text) */
	isRestore?: boolean;
};

export function useArchiveDialog({
	onConfirm,
	title,
	description,
	confirmText,
	cancelText,
	isRestore = false,
}: ArchiveDialogOptions) {
	const [isOpen, setIsOpen] = useState(false);
	const [itemId, setItemId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const openArchiveDialog = (id: string) => {
		setItemId(id);
		setIsOpen(true);
	};

	const closeArchiveDialog = () => {
		setIsOpen(false);
		setItemId(null);
		setIsLoading(false);
	};

	const handleConfirm = async () => {
		if (!itemId) return;

		setIsLoading(true);
		try {
			await onConfirm(itemId);
			closeArchiveDialog();
		} catch (error) {
			console.error(
				`Failed to ${isRestore ? "restore" : "archive"} item:`,
				error,
			);
			setIsLoading(false);
		}
	};

	const defaultTitle = isRestore ? "Restore Item?" : "Archive Item?";
	const defaultDescription = isRestore
		? "This item will be restored and become active again. You can archive it again later."
		: "This item will be archived and hidden from the main view. You can restore it later from the archived items view.";
	const defaultConfirmText = isRestore ? "Restore" : "Archive";

	const ArchiveDialogComponent = () => (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title || defaultTitle}</AlertDialogTitle>
					<AlertDialogDescription>
						{description || defaultDescription}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading} onClick={closeArchiveDialog}>
						{cancelText || "Cancel"}
					</AlertDialogCancel>
					<AlertDialogAction disabled={isLoading} onClick={handleConfirm}>
						{isLoading ? "Processing..." : confirmText || defaultConfirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	return {
		openArchiveDialog,
		closeArchiveDialog,
		isOpen,
		itemId,
		ArchiveDialogComponent,
	};
}
