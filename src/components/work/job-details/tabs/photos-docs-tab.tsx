/**
 * Photos & Docs Tab - Media & Document Management
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, FileText, Upload, Pen } from "lucide-react";

interface PhotosDocsTabProps {
  job: any;
  photos: any[];
  photosByCategory: Record<string, any[]>;
  documents: any[];
  signatures: any[];
  customerSignature: any;
  technicianSignature: any;
  isEditMode: boolean;
}

export function PhotosDocsTab({
  job,
  photos,
  photosByCategory,
  documents,
  signatures,
  customerSignature,
  technicianSignature,
  isEditMode,
}: PhotosDocsTabProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Photos by Category */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Photos</CardTitle>
              <Badge variant="secondary">{photos.length}</Badge>
            </div>
            {isEditMode && (
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(photosByCategory).map(([category, categoryPhotos]) => (
              <div key={category} className="rounded-lg border p-4">
                <p className="mb-2 text-sm font-medium capitalize">{category}</p>
                <p className="text-2xl font-bold">{categoryPhotos.length}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Documents</CardTitle>
              <Badge variant="secondary">{documents.length}</Badge>
            </div>
            {isEditMode && (
              <Button size="sm" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">{doc.file_name}</span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No documents uploaded
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signatures */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Pen className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Signatures</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Customer Signature</p>
              {customerSignature ? (
                <Badge variant="default">Signed</Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Technician Signature</p>
              {technicianSignature ? (
                <Badge variant="default">Signed</Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
