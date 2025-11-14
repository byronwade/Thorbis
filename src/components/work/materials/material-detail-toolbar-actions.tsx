"use client";

import {
  Archive,
  ClipboardList,
  Package,
  Wrench,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveInventoryItem } from "@/actions/inventory";
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

export function MaterialDetailToolbarActions() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const materialId = pathname?.split("/").pop();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleAdjustStock = () => {
    toast.info("Stock adjustment workflow coming soon");
  };

  const handleReorder = () => {
    toast.info("Vendor reorder workflow coming soon");
  };

  const handleArchive = async () => {
    if (!materialId) {
      toast.error("Material ID not found");
      return;
    }

    setIsArchiving(true);
    try {
      const result = await archiveInventoryItem(materialId);

      if (result?.success) {
        toast.success("Material archived successfully");
        setIsArchiveDialogOpen(false);
        router.push("/dashboard/work/materials");
        router.refresh();
      } else {
        toast.error(result?.error ?? "Failed to archive material");
      }
    } catch {
      toast.error("Failed to archive material");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 gap-1.5"
                onClick={handleAdjustStock}
                size="sm"
                variant="outline"
              >
                <Wrench className="size-3.5" />
                <span className="hidden lg:inline">Adjust Stock</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust on-hand or reserved stock</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 gap-1.5"
                onClick={handleReorder}
                size="sm"
                variant="outline"
              >
                <Package className="size-3.5" />
                <span className="hidden lg:inline">Reorder</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start a vendor reorder workflow</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="h-8 gap-1.5" size="sm" variant="outline">
                <ClipboardList className="size-3.5" />
                <span className="hidden lg:inline">Stock Check</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule the next stock audit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="h-6" orientation="vertical" />
        <ImportExportDropdown dataType="materials" />

        <Separator className="h-6" orientation="vertical" />
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
              <p>Archive this material record</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Material</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this material? Archived items can
              be restored within 90 days.
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
              {isArchiving ? "Archiving..." : "Archive Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

