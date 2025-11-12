"use client";

/**
 * Contract Actions Component - Client Component
 *
 * Handles interactive actions for contracts like archiving.
 * This is extracted as a client component to keep the main page as a Server Component.
 */

import { Archive } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { archiveContract } from "@/actions/contracts";
import { toast } from "sonner";

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
        variant="outline"
        size="sm"
        onClick={() => setIsArchiveDialogOpen(true)}
      >
        <Archive className="mr-2 size-4" />
        Archive
      </Button>

      {/* Archive Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
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
              variant="outline"
              onClick={() => setIsArchiveDialogOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchiveContract}
              disabled={isArchiving}
            >
              {isArchiving ? "Archiving..." : "Archive Contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
