/**
 * Photo Types - Shared types for PhotoGallery and PhotoUploader
 *
 * Extracted to prevent circular dependencies
 */

export type PhotoCategory = "before" | "during" | "after" | "other";

export type JobPhoto = {
	id: string;
	url: string;
	thumbnailUrl?: string;
	category: PhotoCategory;
	caption?: string;
	uploadedBy: string;
	uploadedByName: string;
	uploadedAt: Date;
	gpsCoords?: {
		lat: number;
		lng: number;
	};
	metadata?: {
		fileSize: number;
		mimeType: string;
		width: number;
		height: number;
	};
};
