/**
 * Invoice Preview Toggle
 *
 * Toggle between Edit and Preview modes.
 * - Preview (default): Shows PDF as customer will see it
 * - Edit: Editable Tiptap document
 *
 * Keyboard shortcuts:
 * - Cmd/Ctrl + P: Preview
 * - Cmd/Ctrl + E: Edit
 */

"use client";

import { Download, Edit, FileText } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ViewMode = "edit" | "preview";

interface InvoicePreviewToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onExportPDF?: () => void;
}

export function InvoicePreviewToggle({
  mode,
  onModeChange,
  onExportPDF,
}: InvoicePreviewToggleProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        onModeChange("preview");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        onModeChange("edit");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onModeChange]);

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Mode Toggle */}
      <div className="inline-flex rounded-lg border p-1">
        <Button
          className="gap-2"
          onClick={() => onModeChange("preview")}
          size="sm"
          variant={mode === "preview" ? "default" : "ghost"}
        >
          <FileText className="size-4" />
          Preview
        </Button>
        <Button
          className="gap-2"
          onClick={() => onModeChange("edit")}
          size="sm"
          variant={mode === "edit" ? "default" : "ghost"}
        >
          <Edit className="size-4" />
          Edit
        </Button>
      </div>

      {/* Export PDF */}
      {mode === "preview" && onExportPDF && (
        <Button
          className="gap-2"
          onClick={onExportPDF}
          size="sm"
          variant="outline"
        >
          <Download className="size-4" />
          Export PDF
        </Button>
      )}

      {/* Keyboard Hints */}
      <div className="text-muted-foreground text-xs">
        <kbd className="rounded border bg-muted px-1.5 py-0.5">⌘P</kbd> Preview
        <span className="mx-2">•</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5">⌘E</kbd> Edit
      </div>
    </div>
  );
}
