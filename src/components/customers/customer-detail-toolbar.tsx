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
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex items-center gap-2">
      {/* Edit/View Toggle */}
      <Button
        onClick={toggleEditMode}
        size="sm"
        variant={isEditMode ? "default" : "outline"}
      >
        {isEditMode ? (
          <>
            <Eye className="mr-2 size-4" />
            View Mode
          </>
        ) : (
          <>
            <Edit3 className="mr-2 size-4" />
            Edit Mode
          </>
        )}
      </Button>

      {/* Quick Actions */}
      {!isEditMode && (
        <>
          <Button asChild size="sm" variant="outline">
            <a
              href={`/dashboard/work/new?customerId=${pathname.split("/").pop()}`}
            >
              <Briefcase className="mr-2 size-4" />
              New Job
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={`/dashboard/work/invoices/new?customerId=${pathname.split("/").pop()}`}
            >
              <FileText className="mr-2 size-4" />
              New Invoice
            </a>
          </Button>
        </>
      )}
    </div>
  );
}
