"use client";

/**
 * Contract Actions Component - Client Component
 *
 * Handles interactive actions for contracts like archiving.
 * This is extracted as a client component to keep the main page as a Server Component.
 */

import { Archive } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { archiveContract } from "@/actions/contracts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContractActionsProps = {
  contractId: string;
  contractNumber: string;
  status: string;
};

export function ContractActions({
  contractId,
  contractNumber,
  status,
}: ContractActionsProps) {
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchiveContract = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveContract(contractId);
      if (result.success) {
        toast.success("Contract archived successfully");
        setIsArchiveDialogOpen(false);
        // Redirect to contracts list
        window.location.href = "/dashboard/work/contracts";
      } else {
        toast.error(result.error || "Failed to archive contract");
      }
    } catch (error) {
      toast.error("Failed to archive contract");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      {/* Archive Button */}
      <Button
        onClick={() => setIsArchiveDialogOpen(true)}
        size="sm"
        variant="outline"
      >
        <Archive className="mr-2 size-4" />
        Archive
      </Button>

      {/* Archive Dialog */}
      <Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Contract?</DialogTitle>
            <DialogDescription>
              This will archive contract #{contractNumber}. You can restore it
              from the archive within 90 days.
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
              onClick={handleArchiveContract}
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
