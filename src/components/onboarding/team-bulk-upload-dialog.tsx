/**
 * Team Bulk Upload Dialog
 *
 * Dialog for bulk importing team members from Excel/CSV files
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  generateCSVTemplate,
  generateTemplate,
  parseCSV,
  parseExcel,
  type TeamMemberRow,
} from "@/lib/onboarding/team-bulk-upload";

type TeamBulkUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (members: TeamMemberRow[]) => void;
};

export function TeamBulkUploadDialog({
  open,
  onOpenChange,
  onImport,
}: TeamBulkUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<TeamMemberRow[] | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(fileExtension || "")) {
      setErrors([
        "Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file",
      ]);
      return;
    }

    setIsUploading(true);
    setErrors(null);
    setPreviewData(null);
    setFileName(file.name);

    try {
      let result;
      if (fileExtension === "csv") {
        result = await parseCSV(file);
      } else {
        result = await parseExcel(file);
      }

      if (result.success && result.data) {
        setPreviewData(result.data);
        setErrors(null);
      } else {
        setErrors(result.errors || ["Failed to parse file"]);
        setPreviewData(null);
      }
    } catch (_error) {
      setErrors([
        "Failed to parse file. Please check the format and try again.",
      ]);
      setPreviewData(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleImport = () => {
    if (previewData) {
      onImport(previewData);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreviewData(null);
    setErrors(null);
    setFileName(null);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="size-5" />
            Bulk Import Team Members
          </DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to add multiple team members at once
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto py-4">
          {/* Instructions */}
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              <strong>Required columns:</strong> firstName, lastName, email,
              role (owner/admin/manager/dispatcher/technician), phone (optional)
            </AlertDescription>
          </Alert>

          {/* Download Templates */}
          <div className="space-y-3">
            <Label>Step 1: Download a template</Label>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => generateTemplate()}
                type="button"
                variant="outline"
              >
                <Download className="mr-2 size-4" />
                Download Excel Template
              </Button>
              <Button
                className="flex-1"
                onClick={() => generateCSVTemplate()}
                type="button"
                variant="outline"
              >
                <Download className="mr-2 size-4" />
                Download CSV Template
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Download a template with the correct format and example data
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="bulk-upload-file">
              Step 2: Upload your completed file
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  accept=".xlsx,.xls,.csv"
                  className="cursor-pointer"
                  disabled={isUploading}
                  id="bulk-upload-file"
                  onChange={handleFileUpload}
                  type="file"
                />
              </div>
              {isUploading && (
                <Loader2 className="size-5 animate-spin text-primary" />
              )}
            </div>
            {fileName && !isUploading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileSpreadsheet className="size-4" />
                <span>{fileName}</span>
              </div>
            )}
          </div>

          {/* Errors */}
          {errors && errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                <p className="font-medium">Found {errors.length} error(s):</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {errors.slice(0, 10).map((error, index) => (
                    <li className="text-sm" key={index}>
                      {error}
                    </li>
                  ))}
                </ul>
                {errors.length > 10 && (
                  <p className="mt-2 text-sm">
                    ...and {errors.length - 10} more errors
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {previewData && previewData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Step 3: Preview & confirm</Label>
                <Badge variant="secondary">
                  <CheckCircle2 className="mr-1 size-3" />
                  {previewData.length} members ready to import
                </Badge>
              </div>
              <div className="overflow-hidden rounded-lg border">
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {member.firstName} {member.lastName}
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge className="capitalize" variant="outline">
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {member.phone || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleClose} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={!previewData || previewData.length === 0}
            onClick={handleImport}
          >
            <Upload className="mr-2 size-4" />
            Import {previewData?.length || 0} Members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
