"use client";

/**
 * Changes Confirmation Dialog
 *
 * Shows a detailed list of all changes made to customer data
 * before saving. Helps prevent unwanted edits.
 *
 * Displays:
 * - Field name
 * - Old value → New value
 * - Visual diff highlighting
 */

import { AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type Change = {
  field: string;
  oldValue: any;
  newValue: any;
  section: string;
};

type ChangesConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changes: Change[];
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ChangesConfirmationDialog({
  open,
  onOpenChange,
  changes,
  onConfirm,
  onCancel,
  isLoading = false,
}: ChangesConfirmationDialogProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "(empty)";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    if (typeof value === "string" && value.length > 100) {
      return `${value.substring(0, 100)}...`;
    }
    return String(value);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="size-5 text-warning" />
            Confirm Changes
          </DialogTitle>
          <DialogDescription>
            Review the changes below before saving. This helps prevent unwanted
            edits.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {changes.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No changes detected
              </p>
            ) : (
              changes.map((change, index) => (
                <div className="rounded-lg border bg-muted/30 p-4" key={index}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs" variant="outline">
                        {change.section}
                      </Badge>
                      <span className="font-medium text-sm">
                        {change.field}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 rounded bg-destructive/10 px-3 py-2">
                      <p className="text-muted-foreground text-xs">Old Value</p>
                      <p className="mt-1 font-mono text-destructive">
                        {formatValue(change.oldValue)}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 rounded bg-success/10 px-3 py-2">
                      <p className="text-muted-foreground text-xs">New Value</p>
                      <p className="mt-1 font-mono text-success">
                        {formatValue(change.newValue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button disabled={isLoading} onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={isLoading || changes.length === 0}
            onClick={onConfirm}
          >
            {isLoading
              ? "Saving..."
              : `Confirm & Save ${changes.length} Change${changes.length === 1 ? "" : "s"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
