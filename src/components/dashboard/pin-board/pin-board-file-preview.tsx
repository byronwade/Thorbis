"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Image as ImageIcon,
  File,
  Download,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

// File type categories
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const PDF_TYPES = ["application/pdf"];
const DOCUMENT_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const SPREADSHEET_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Get icon for file type
function getFileIcon(type: string) {
  if (IMAGE_TYPES.includes(type)) return ImageIcon;
  if (PDF_TYPES.includes(type)) return FileText;
  if (SPREADSHEET_TYPES.includes(type)) return FileSpreadsheet;
  if (DOCUMENT_TYPES.includes(type)) return FileText;
  return File;
}

// Check if file can be previewed inline
function canPreviewInline(type: string): boolean {
  return IMAGE_TYPES.includes(type) || PDF_TYPES.includes(type);
}

interface FileAttachment {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  file_url: string;
}

interface PinBoardFilePreviewProps {
  attachments: FileAttachment[];
  compact?: boolean;
}

export function PinBoardFilePreview({
  attachments,
  compact = false,
}: PinBoardFilePreviewProps) {
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  const resetImageTransform = useCallback(() => {
    setImageZoom(1);
    setImageRotation(0);
  }, []);

  const handlePreview = useCallback((attachment: FileAttachment) => {
    resetImageTransform();
    setPreviewFile(attachment);
  }, [resetImageTransform]);

  const closePreview = useCallback(() => {
    setPreviewFile(null);
    resetImageTransform();
  }, [resetImageTransform]);

  const zoomIn = useCallback(() => {
    setImageZoom((z) => Math.min(z + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setImageZoom((z) => Math.max(z - 0.25, 0.5));
  }, []);

  const rotate = useCallback(() => {
    setImageRotation((r) => (r + 90) % 360);
  }, []);

  // Separate files into previewable (images) and others
  const imageAttachments = attachments.filter((a) =>
    IMAGE_TYPES.includes(a.file_type || "")
  );
  const otherAttachments = attachments.filter(
    (a) => !IMAGE_TYPES.includes(a.file_type || "")
  );

  if (attachments.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Image Grid - Show thumbnails for images */}
        {imageAttachments.length > 0 && (
          <div className="space-y-2">
            {!compact && (
              <p className="text-xs text-muted-foreground font-medium">Images</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {imageAttachments.map((attachment) => (
                <button
                  key={attachment.id}
                  className="relative aspect-video rounded-lg overflow-hidden bg-muted group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                  onClick={() => handlePreview(attachment)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachment.file_url}
                    alt={attachment.file_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                  {!compact && (
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-[10px] text-white truncate">
                        {attachment.file_name}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other Files List */}
        {otherAttachments.length > 0 && (
          <div className="space-y-2">
            {!compact && imageAttachments.length > 0 && (
              <p className="text-xs text-muted-foreground font-medium">Documents</p>
            )}
            <div className="space-y-1.5">
              {otherAttachments.map((attachment) => {
                const Icon = getFileIcon(attachment.file_type || "");
                const isPdf = PDF_TYPES.includes(attachment.file_type || "");

                return (
                  <div
                    key={attachment.id}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors group",
                      compact && "p-2"
                    )}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg bg-background flex items-center justify-center shrink-0",
                        compact && "h-8 w-8"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          isPdf && "text-red-500",
                          attachment.file_type?.includes("spreadsheet") &&
                            "text-green-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          compact && "text-xs"
                        )}
                      >
                        {attachment.file_name}
                      </p>
                      {!compact && attachment.file_size && (
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.file_size)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isPdf && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handlePreview(attachment)}
                          title="Preview"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        title="Open in new tab"
                      >
                        <a
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        title="Download"
                      >
                        <a href={attachment.file_url} download={attachment.file_name}>
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base truncate pr-4">
                {previewFile?.file_name}
              </DialogTitle>
              <div className="flex items-center gap-1 shrink-0">
                {previewFile &&
                  IMAGE_TYPES.includes(previewFile.file_type || "") && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={zoomOut}
                        title="Zoom out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
                        {Math.round(imageZoom * 100)}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={zoomIn}
                        title="Zoom in"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={rotate}
                        title="Rotate"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                  title="Download"
                >
                  <a
                    href={previewFile?.file_url}
                    download={previewFile?.file_name}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                  title="Open in new tab"
                >
                  <a
                    href={previewFile?.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-muted/30 min-h-[60vh]">
            {previewFile && IMAGE_TYPES.includes(previewFile.file_type || "") && (
              <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewFile.file_url}
                  alt={previewFile.file_name}
                  className="max-w-full transition-transform duration-200"
                  style={{
                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                  }}
                />
              </div>
            )}

            {previewFile && PDF_TYPES.includes(previewFile.file_type || "") && (
              <iframe
                src={`${previewFile.file_url}#toolbar=1&navpanes=0`}
                className="w-full h-[70vh] border-0"
                title={previewFile.file_name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Compact attachment indicator for cards
export function AttachmentIndicator({
  attachments,
}: {
  attachments: FileAttachment[];
}) {
  if (attachments.length === 0) return null;

  const hasImages = attachments.some((a) =>
    IMAGE_TYPES.includes(a.file_type || "")
  );
  const hasPdfs = attachments.some((a) =>
    PDF_TYPES.includes(a.file_type || "")
  );
  const hasOther = attachments.some(
    (a) =>
      !IMAGE_TYPES.includes(a.file_type || "") &&
      !PDF_TYPES.includes(a.file_type || "")
  );

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {hasImages && <ImageIcon className="h-3 w-3" />}
      {hasPdfs && <FileText className="h-3 w-3 text-red-500/70" />}
      {hasOther && <File className="h-3 w-3" />}
      <span className="text-xs">{attachments.length}</span>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
