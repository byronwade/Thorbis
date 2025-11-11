"use client";

/**
 * Customer Detail Toolbar - AppToolbar Actions
 *
 * Displays in AppToolbar for customer detail pages:
 * - Back button to customers list
 * - Edit mode toggle button
 * - Quick actions (New Job, New Invoice)
 */

import { Briefcase, Edit3, Eye, FileText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CustomerDetailToolbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditMode = searchParams.get("mode") === "edit";

  const toggleEditMode = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isEditMode) {
      params.delete("mode");
    } else {
      params.set("mode", "edit");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const customerId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-1.5">
      {/* Edit/View Mode Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={
                isEditMode
                  ? "gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  : "gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30"
              }
              onClick={toggleEditMode}
              size="sm"
              variant={isEditMode ? "default" : "outline"}
            >
              {isEditMode ? (
                <>
                  <Eye className="size-4" />
                  <span className="font-medium">View</span>
                </>
              ) : (
                <>
                  <Edit3 className="size-4" />
                  <span className="font-medium">Edit</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isEditMode ? "Switch to view mode" : "Switch to edit mode"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Quick Actions - Only show in view mode */}
      {!isEditMode && (
        <>
          <Separator className="h-6" orientation="vertical" />
          <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="gap-2 hover:bg-background"
                    size="sm"
                    variant="ghost"
                  >
                    <a href={`/dashboard/work/new?customerId=${customerId}`}>
                      <Briefcase className="size-4" />
                      <span className="hidden sm:inline">Job</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new job for this customer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="gap-2 hover:bg-background"
                    size="sm"
                    variant="ghost"
                  >
                    <a
                      href={`/dashboard/work/invoices/new?customerId=${customerId}`}
                    >
                      <FileText className="size-4" />
                      <span className="hidden sm:inline">Invoice</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new invoice for this customer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}

      {/* Ellipsis Menu - Export/Import & More */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="customers" />
    </div>
  );
}
