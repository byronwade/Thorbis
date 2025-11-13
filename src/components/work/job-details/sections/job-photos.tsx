/**
 * Job Photos Section
 * Displays categorized photos for this job
 */

"use client";

import { Camera, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type JobPhotosProps = {
  photos: any[];
};

export function JobPhotos({ photos }: JobPhotosProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group photos by category
  const groupedPhotos: Record<string, any[]> = photos.reduce((acc, photo) => {
    const category = photo.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(photo);
    return acc;
  }, {} as Record<string, any[]>);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Camera className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold text-lg">No Photos</h3>
        <p className="text-muted-foreground text-sm">
          No photos have been added to this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedPhotos).map(([category, categoryPhotos]: [string, any[]]) => (
        <div key={category}>
          <div className="mb-3 flex items-center gap-2">
            <Label className="capitalize">{category}</Label>
            <Badge variant="secondary">{categoryPhotos.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border"
              >
                <div className="relative aspect-video bg-muted">
                  {photo.url || photo.photo_url ? (
                    <Image
                      alt={photo.description || photo.title || "Job photo"}
                      className="object-cover transition-transform group-hover:scale-105"
                      fill
                      src={photo.url || photo.photo_url}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  {photo.title && (
                    <p className="mb-1 font-medium text-sm">{photo.title}</p>
                  )}
                  {photo.description && (
                    <p className="mb-2 text-muted-foreground text-xs">
                      {photo.description}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    {formatDate(photo.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="rounded-md bg-muted/50 p-4">
        <p className="font-medium text-sm">Total Photos</p>
        <p className="text-muted-foreground text-xs">
          {photos.length} photo{photos.length !== 1 ? "s" : ""} across{" "}
          {Object.keys(groupedPhotos).length} categor
          {Object.keys(groupedPhotos).length !== 1 ? "ies" : "y"}
        </p>
      </div>
    </div>
  );
}

