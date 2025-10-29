"use client";

/**
 * JobPhotoGalleryWrapper Component - Client Component
 *
 * Client-side features:
 * - Wraps PhotoGallery with event handlers defined in client context
 * - Handles photo upload, delete, and download all actions
 * - Extracted from Server Component to isolate client-side event handlers
 *
 * This wrapper is necessary because event handlers cannot be passed from
 * Server Components to Client Components in Next.js 16+.
 */

import { PhotoGallery, type JobPhoto } from "./job-details/PhotoGallery";

type JobPhotoGalleryWrapperProps = {
  photos: JobPhoto[];
  className?: string;
};

export function JobPhotoGalleryWrapper({
  photos,
  className,
}: JobPhotoGalleryWrapperProps) {
  const handleUpload = () => {
    // TODO: Implement photo upload
    console.log("Upload photo");
  };

  const handleDelete = (photoId: string) => {
    // TODO: Implement photo deletion
    console.log("Delete photo:", photoId);
  };

  const handleDownloadAll = () => {
    // TODO: Implement download all photos
    console.log("Download all photos");
  };

  return (
    <PhotoGallery
      photos={photos}
      onUpload={handleUpload}
      onDelete={handleDelete}
      onDownloadAll={handleDownloadAll}
      className={className}
    />
  );
}
