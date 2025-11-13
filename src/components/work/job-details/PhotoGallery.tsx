"use client";

import {
  Camera,
  Download,
  MapPin,
  Trash2,
  User,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PhotoUploader } from "./PhotoUploader";
import type { JobPhoto, PhotoCategory } from "./photo-types";

interface PhotoGalleryProps {
  jobId: string;
  companyId: string;
  photos: JobPhoto[];
  onUpload?: () => void;
  onDelete?: (photoId: string) => void;
  onDownloadAll?: () => void;
  className?: string;
}

export function PhotoGallery({
  jobId,
  companyId,
  photos,
  onUpload,
  onDelete,
  onDownloadAll,
  className,
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<JobPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    PhotoCategory | "all"
  >("all");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showUploader, setShowUploader] = useState(false);

  const categories: { value: PhotoCategory | "all"; label: string }[] = [
    { value: "all", label: "All Photos" },
    { value: "before", label: "Before" },
    { value: "during", label: "During" },
    { value: "after", label: "After" },
    { value: "other", label: "Other" },
  ];

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);

  const getCategoryColor = (category: PhotoCategory): string => {
    switch (category) {
      case "before":
        return "bg-primary text-primary dark:bg-primary/20 dark:text-primary";
      case "during":
        return "bg-warning text-warning dark:bg-warning/20 dark:text-warning";
      case "after":
        return "bg-success text-success dark:bg-success/20 dark:text-success";
      default:
        return "bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground";
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownloadPhoto = (photo: JobPhoto) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `job-photo-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="size-5" />
              Photo Gallery ({photos.length})
            </CardTitle>
            <CardDescription>
              Job site photos organized by stage
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onDownloadAll && photos.length > 0 && (
              <Button onClick={onDownloadAll} size="sm" variant="outline">
                <Download className="mr-2 size-4" />
                Download All
              </Button>
            )}
            {onUpload && (
              <Button onClick={() => setShowUploader(true)} size="sm">
                <Camera className="mr-2 size-4" />
                Upload Photos
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              size="sm"
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
            >
              {category.label}
              {category.value !== "all" && (
                <Badge className="ml-2" variant="secondary">
                  {photos.filter((p) => p.category === category.value).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
            <Camera className="mb-2 size-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No photos {selectedCategory !== "all" && `in ${selectedCategory}`}{" "}
              category
            </p>
            {onUpload && (
              <Button
                className="mt-4"
                onClick={() => setShowUploader(true)}
                size="sm"
                variant="outline"
              >
                <Camera className="mr-2 size-4" />
                Upload Photos
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <div
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted transition-all hover:scale-105 hover:shadow-md"
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  alt={photo.caption || "Job photo"}
                  className="object-cover"
                  fill
                  src={photo.thumbnailUrl || photo.url}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-full flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <Badge
                        className={cn(
                          "text-xs",
                          getCategoryColor(photo.category)
                        )}
                      >
                        {photo.category}
                      </Badge>
                      {photo.gpsCoords && (
                        <MapPin className="size-4 text-white" />
                      )}
                    </div>
                    <div className="text-white text-xs">
                      <div className="flex items-center gap-1">
                        <User className="size-3" />
                        <span className="truncate">{photo.uploadedByName}</span>
                      </div>
                      <div className="mt-1">{formatDate(photo.uploadedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Dialog */}
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPhoto(null);
              setZoomLevel(1);
            }
          }}
          open={selectedPhoto !== null}
        >
          <DialogContent className="max-w-5xl">
            {selectedPhoto && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getCategoryColor(selectedPhoto.category)}
                      >
                        {selectedPhoto.category}
                      </Badge>
                      {selectedPhoto.caption && (
                        <span className="font-normal text-muted-foreground text-sm">
                          {selectedPhoto.caption}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        disabled={zoomLevel <= 0.5}
                        onClick={handleZoomOut}
                        size="sm"
                        variant="outline"
                      >
                        <ZoomOut className="size-4" />
                      </Button>
                      <Button
                        disabled={zoomLevel >= 3}
                        onClick={handleZoomIn}
                        size="sm"
                        variant="outline"
                      >
                        <ZoomIn className="size-4" />
                      </Button>
                      <Button
                        onClick={() => handleDownloadPhoto(selectedPhoto)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="size-4" />
                      </Button>
                      {onDelete && (
                        <Button
                          onClick={() => {
                            onDelete(selectedPhoto.id);
                            setSelectedPhoto(null);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="relative h-[60vh] overflow-auto bg-muted">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transition: "transform 0.2s",
                    }}
                  >
                    <Image
                      alt={selectedPhoto.caption || "Job photo"}
                      className="max-w-full"
                      height={selectedPhoto.metadata?.height || 800}
                      src={selectedPhoto.url}
                      width={selectedPhoto.metadata?.width || 1200}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="size-4" />
                      <span>Uploaded by</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {selectedPhoto.uploadedByName}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Camera className="size-4" />
                      <span>Date & Time</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {formatDate(selectedPhoto.uploadedAt)}
                    </p>
                  </div>
                  {selectedPhoto.gpsCoords && (
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-4" />
                        <span>Location</span>
                      </div>
                      <p className="mt-1 font-medium">
                        {selectedPhoto.gpsCoords.lat.toFixed(6)},{" "}
                        {selectedPhoto.gpsCoords.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                  {selectedPhoto.metadata && (
                    <div>
                      <div className="text-muted-foreground">File Info</div>
                      <p className="mt-1 font-medium">
                        {formatFileSize(selectedPhoto.metadata.fileSize)} •{" "}
                        {selectedPhoto.metadata.width}x
                        {selectedPhoto.metadata.height}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog onOpenChange={setShowUploader} open={showUploader}>
          <DialogContent className="max-w-3xl">
            <PhotoUploader
              companyId={companyId}
              jobId={jobId}
              onCancel={() => setShowUploader(false)}
              onUpload={async (files) => {
                setShowUploader(false);
                // Call the onUpload prop if provided
                onUpload?.();
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
