"use client";

import { Download, FileText, Paperclip, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";

interface AttachmentsSectionProps {
  attachments: any[];
  entityType?: string;
  entityId?: string;
  onUpload?: (files: FileList) => Promise<void>;
}

export function AttachmentsSection({
  attachments,
  entityType,
  entityId,
  onUpload,
}: AttachmentsSectionProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      if (onUpload) {
        await onUpload(files);
      }
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <UnifiedAccordionContent>
      <div className="space-y-4">
        {/* Upload Button */}
        {onUpload && (
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Upload className="size-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4 mr-2" />
                      Upload Files
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        )}

        {/* Attachments List */}
        {attachments && attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment: any) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="size-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attachment.original_file_name ||
                        attachment.file_name ||
                        "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {attachment.file_size
                        ? `${(attachment.file_size / 1024).toFixed(1)} KB`
                        : ""}
                      {attachment.category && ` • ${attachment.category}`}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="flex-shrink-0"
                >
                  <a
                    href={attachment.storage_url || attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="size-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <Paperclip className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No attachments yet
              </p>
            </div>
          </div>
        )}
      </div>
    </UnifiedAccordionContent>
  );
}

