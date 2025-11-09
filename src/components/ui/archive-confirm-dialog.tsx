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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
              <Archive className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
            <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/30">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
              <div className="text-orange-900 text-sm dark:text-orange-200">
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
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
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
