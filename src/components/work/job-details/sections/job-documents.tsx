/**
 * Job Documents Section
 * Displays documents attached to this job
 */

"use client";

import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type JobDocumentsProps = {
  documents: any[];
};

export function JobDocuments({ documents }: JobDocumentsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "—";
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) {
      return "—";
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) {
      return <FileText className="size-4 text-muted-foreground" />;
    }
    // You can add more file type icons here
    return <FileText className="size-4 text-muted-foreground" />;
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold text-lg">No Documents</h3>
        <p className="text-muted-foreground text-sm">
          No documents have been attached to this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.file_type || doc.type)}
                    <span className="font-medium">
                      {doc.name || doc.file_name || "Untitled"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.file_type || doc.type ? (
                    <Badge className="uppercase" variant="outline">
                      {(doc.file_type || doc.type).split("/").pop()}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {formatFileSize(doc.file_size || doc.size)}
                </TableCell>
                <TableCell>
                  {formatDate(doc.created_at || doc.uploaded_at)}
                </TableCell>
                <TableCell className="text-right">
                  {(doc.url || doc.file_url) && (
                    <Button asChild size="sm" variant="ghost">
                      <a
                        download
                        href={doc.url || doc.file_url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Download className="mr-1 size-4" />
                        Download
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="rounded-md bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Total Documents</p>
            <p className="text-muted-foreground text-xs">
              {documents.length} document{documents.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">
              {formatFileSize(
                documents.reduce(
                  (sum, doc) => sum + (doc.file_size || doc.size || 0),
                  0
                )
              )}
            </p>
            <p className="text-muted-foreground text-xs">Total Size</p>
          </div>
        </div>
      </div>
    </div>
  );
}
