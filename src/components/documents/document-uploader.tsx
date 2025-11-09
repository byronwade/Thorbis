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

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { uploadDocument } from "@/actions/documents";
import { validateFile, formatFileSize, type ValidationResult } from "@/lib/storage/file-validator";
import { cn } from "@/lib/utils";
import type { DocumentContext } from "@/lib/storage/document-manager";

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
                  error: error instanceof Error ? error.message : "Upload failed",
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes?.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
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
                <h3 className="text-sm font-medium">
                  Files ({files.length})
                </h3>
                {successCount > 0 && (
                  <Badge variant="default" className="text-xs">
                    {successCount} uploaded
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {errorCount} failed
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {successCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearCompleted}
                  >
                    Clear completed
                  </Button>
                )}
                {pendingCount > 0 && (
                  <Button size="sm" onClick={uploadAllFiles}>
                    Upload {pendingCount} file{pendingCount > 1 ? "s" : ""}
                  </Button>
                )}
              </div>
            </div>

            {/* File Items */}
            <div className="space-y-2">
              {files.map((file) => (
                <FileUploadItem
                  key={file.id}
                  file={file}
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.file.size)}
        </p>

        {/* Progress */}
        {file.status === "uploading" && (
          <Progress value={file.progress} className="mt-2 h-1" />
        )}

        {/* Error */}
        {file.status === "error" && file.error && (
          <p className="text-xs text-destructive mt-1">{file.error}</p>
        )}

        {/* Warnings */}
        {file.warnings && file.warnings.length > 0 && (
          <p className="text-xs text-yellow-600 mt-1">
            {file.warnings.join("; ")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex gap-1">
        {file.status === "error" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRetry(file.id)}
          >
            Retry
          </Button>
        )}
        {file.status !== "uploading" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(file.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

