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

import { type JobPhoto, PhotoGallery } from "./job-details/PhotoGallery";

type JobPhotoGalleryWrapperProps = {
  jobId: string;
  companyId: string;
  photos: JobPhoto[];
  className?: string;
};

export function JobPhotoGalleryWrapper({
  jobId,
  companyId,
  photos,
  className,
}: JobPhotoGalleryWrapperProps) {
  const handleUpload = () => {
    // Handled by PhotoUploader component
    console.log("Upload triggered");
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
      className={className}
      companyId={companyId}
      jobId={jobId}
      onDelete={handleDelete}
      onDownloadAll={handleDownloadAll}
      onUpload={handleUpload}
      photos={photos}
    />
  );
}
