/**
 * Document Uploader Component
 *
 * Feature-rich file upload component with:
 * - Drag and drop support
 * - Multiple file selection
 * - Progress tracking per file
 * - File preview
 * - Validation and error handling
 * - Retry failed uploads
 */

"use client";

import {
  AlertCircle,
  CheckCircle,
  FileIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { uploadDocument } from "@/actions/documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DocumentContext } from "@/lib/storage/document-manager";
import {
  formatFileSize,
  type ValidationResult,
  validateFile,
} from "@/lib/storage/file-validator";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

interface FileUploadState {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  warnings?: string[];
  attachmentId?: string;
  validation?: ValidationResult;
}

interface DocumentUploaderProps {
  companyId: string;
  context: DocumentContext;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  onUploadComplete?: (attachmentIds: string[]) => void;
  onUploadError?: (errors: string[]) => void;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DocumentUploader({
  companyId,
  context,
  maxFiles = 10,
  maxSize = 250 * 1024 * 1024, // 250MB
  acceptedTypes,
  onUploadComplete,
  onUploadError,
  className,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // FILE SELECTION
  // ============================================================================

  const handleFiles = useCallback(
    async (selectedFiles: FileList | File[]) => {
      const fileArray = Array.from(selectedFiles);

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate and prepare files
      const newFiles: FileUploadState[] = [];

      for (const file of fileArray) {
        // Validate file
        const validation = await validateFile(file, {
          maxSize,
          allowedMimeTypes: acceptedTypes,
        });

        newFiles.push({
          file,
          id: Math.random().toString(36).substring(7),
          status: validation.valid ? "pending" : "error",
          progress: 0,
          error: validation.valid ? undefined : validation.errors.join("; "),
          warnings: validation.warnings,
          validation,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length, maxFiles, maxSize, acceptedTypes]
  );

  // ============================================================================
  // DRAG AND DROP
  // ============================================================================

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
  );

  // ============================================================================
  // FILE INPUT
  // ============================================================================

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ============================================================================
  // UPLOAD FUNCTIONS
  // ============================================================================

  const uploadFile = useCallback(
    async (fileState: FileUploadState) => {
      const formData = new FormData();
      formData.append("file", fileState.file);
      formData.append("companyId", companyId);
      formData.append("contextType", context.type);
      if (context.id) formData.append("contextId", context.id);
      if (context.folder) formData.append("folder", context.folder);

      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: "uploading", progress: 0 }
              : f
          )
        );

        // Simulate progress (in production, use XMLHttpRequest for real progress)
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileState.id && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        const result = await uploadDocument(formData);

        clearInterval(progressInterval);

        if (result.success && result.data) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileState.id
                ? {
                    ...f,
                    status: "success",
                    progress: 100,
                    attachmentId: result.data!.attachmentId,
                    warnings: result.warnings,
                  }
                : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileState.id
                ? {
                    ...f,
                    status: "error",
                    progress: 0,
                    error: result.error || "Upload failed",
                  }
                : f
            )
          );
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? {
                  ...f,
                  status: "error",
                  progress: 0,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        );
      }
    },
    [companyId, context]
  );

  const uploadAllFiles = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");

    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    // Call completion callback
    const successfulUploads = files
      .filter((f) => f.status === "success" && f.attachmentId)
      .map((f) => f.attachmentId!);

    if (successfulUploads.length > 0 && onUploadComplete) {
      onUploadComplete(successfulUploads);
    }

    const errors = files
      .filter((f) => f.status === "error" && f.error)
      .map((f) => f.error!);

    if (errors.length > 0 && onUploadError) {
      onUploadError(errors);
    }
  }, [files, uploadFile, onUploadComplete, onUploadError]);

  // ============================================================================
  // FILE MANAGEMENT
  // ============================================================================

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const retryFile = useCallback(
    (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        uploadFile(file);
      }
    },
    [files, uploadFile]
  );

  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== "success"));
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
        )}
        onClick={openFilePicker}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          accept={acceptedTypes?.join(",")}
          className="hidden"
          multiple
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-1">
            <p className="font-medium text-sm">
              Drop files here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">Files ({files.length})</h3>
                {successCount > 0 && (
                  <Badge className="text-xs" variant="default">
                    {successCount} uploaded
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge className="text-xs" variant="destructive">
                    {errorCount} failed
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {successCount > 0 && (
                  <Button onClick={clearCompleted} size="sm" variant="ghost">
                    Clear completed
                  </Button>
                )}
                {pendingCount > 0 && (
                  <Button onClick={uploadAllFiles} size="sm">
                    Upload {pendingCount} file{pendingCount > 1 ? "s" : ""}
                  </Button>
                )}
              </div>
            </div>

            {/* File Items */}
            <div className="space-y-2">
              {files.map((file) => (
                <FileUploadItem
                  file={file}
                  key={file.id}
                  onRemove={removeFile}
                  onRetry={retryFile}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// FILE ITEM COMPONENT
// ============================================================================

interface FileUploadItemProps {
  file: FileUploadState;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

function FileUploadItem({ file, onRemove, onRetry }: FileUploadItemProps) {
  const getStatusIcon = () => {
    switch (file.status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      {/* Icon */}
      <div className="flex-shrink-0">{getStatusIcon()}</div>

      {/* File Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{file.file.name}</p>
        <p className="text-muted-foreground text-xs">
          {formatFileSize(file.file.size)}
        </p>

        {/* Progress */}
        {file.status === "uploading" && (
          <Progress className="mt-2 h-1" value={file.progress} />
        )}

        {/* Error */}
        {file.status === "error" && file.error && (
          <p className="mt-1 text-destructive text-xs">{file.error}</p>
        )}

        {/* Warnings */}
        {file.warnings && file.warnings.length > 0 && (
          <p className="mt-1 text-warning text-xs">
            {file.warnings.join("; ")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 gap-1">
        {file.status === "error" && (
          <Button onClick={() => onRetry(file.id)} size="sm" variant="ghost">
            Retry
          </Button>
        )}
        {file.status !== "uploading" && (
          <Button onClick={() => onRemove(file.id)} size="sm" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
