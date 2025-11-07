"use client";

/**
 * Customer Page Editor Wrapper - Mode Management
 *
 * Manages view/edit mode state and integrates Novel editor with Server Actions
 *
 * Features:
 * - Toggle edit mode with Cmd+E keyboard shortcut
 * - Auto-save customer page content
 * - Unsaved changes warning
 * - Success/error toast notifications
 * - URL state sync (?mode=edit)
 */

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { updateCustomerPageContent } from "@/actions/customers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangesConfirmationDialog } from "./changes-confirmation-dialog";
import { extractChanges } from "@/lib/utils/content-diff";

// Lazy load editor to reduce initial bundle size
const CustomerPageEditor = dynamic(
  () => import("./customer-page-editor").then((mod) => ({ default: mod.CustomerPageEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-[600px] w-full max-w-4xl" />
      </div>
    ),
  }
);

interface CustomerPageEditorWrapperProps {
  customer: any;
  properties: any[];
  jobs: any[];
  invoices: any[];
  activities: any[];
  equipment: any[];
  attachments: any[];
  paymentMethods: any[];
  metrics: {
    totalRevenue: number;
    totalJobs: number;
    totalProperties: number;
    outstandingBalance: number;
  };
  initialMode?: "view" | "edit";
}

export function CustomerPageEditorWrapper({
  customer,
  properties,
  jobs,
  invoices,
  activities,
  equipment,
  attachments,
  paymentMethods,
  metrics,
  initialMode = "view",
}: CustomerPageEditorWrapperProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const originalContentRef = useRef<any>(null);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // Handle content change
  const handleContentChange = useCallback((newContent: any) => {
    // Store original content on first change
    if (!originalContentRef.current) {
      originalContentRef.current = content || newContent;
    }

    setContent(newContent);
    setHasChanges(true);
  }, [content]);

  // Handle save click - show confirmation dialog
  const handleSaveClick = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  // Handle confirmed save
  const handleConfirmedSave = useCallback(
    async () => {
      if (!content) return;

      setIsSaving(true);

      const result = await updateCustomerPageContent(customer.id, content);

      if (!result.success) {
        toast.error(result.error || "Failed to save changes");
      } else {
        setHasChanges(false);
        originalContentRef.current = content; // Update original after successful save
        setShowConfirmDialog(false);
        toast.success("Customer page saved successfully");
      }

      setIsSaving(false);
    },
    [customer.id, content, toast]
  );

  // Extract changes for confirmation dialog
  const changes = content && originalContentRef.current
    ? extractChanges(originalContentRef.current, content)
    : [];

  return (
    <div className="relative min-h-screen">
      {/* Save Button - Floating in bottom right */}
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            size="lg"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="gap-2 shadow-lg"
          >
            <Save className="size-4" />
            Review & Save Changes
          </Button>
        </div>
      )}

      {/* Changes Confirmation Dialog */}
      <ChangesConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        changes={changes}
        onConfirm={handleConfirmedSave}
        onCancel={() => setShowConfirmDialog(false)}
        isLoading={isSaving}
      />

      {/* Novel Editor - Full Width No Padding - Always Editable */}
      {/* Note: Customer badges are the first block inside the editor, above Customer Information */}
      <CustomerPageEditor
        customerId={customer.id}
        initialContent={customer.page_content}
        initialData={{
          ...customer,
          properties,
          jobs,
          invoices,
          activities,
          equipment,
          attachments,
          paymentMethods,
          metrics,
        }}
        isEditable={true}
        onChange={handleContentChange}
      />
    </div>
  );
}
