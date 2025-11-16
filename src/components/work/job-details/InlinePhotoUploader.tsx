"use client";

import { Camera, Check, FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { uploadDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { PhotoCategory } from "./photo-types";

type PhotoFile = {
	id: string;
	file: File;
	preview: string;
	category: PhotoCategory;
	caption: string;
	isDocument: boolean;
};

type InlinePhotoUploaderProps = {
	jobId: string;
	companyId: string;
	onUploadComplete?: () => void;
	onCancel?: () => void;
};

const ACCEPTED_FILE_TYPES = {
	"image/jpeg": [".jpg", ".jpeg"],
	"image/png": [".png"],
	"image/heic": [".heic"],
	"image/heif": [".heif"],
	"image/webp": [".webp"],
	"image/gif": [".gif"],
	"image/bmp": [".bmp"],
	"image/tiff": [".tiff", ".tif"],
	"application/pdf": [".pdf"],
	"application/msword": [".doc"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
	"application/vnd.ms-excel": [".xls"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
	"text/plain": [".txt"],
	"text/csv": [".csv"],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function InlinePhotoUploader({ jobId, companyId, onUploadComplete, onCancel }: InlinePhotoUploaderProps) {
	const { toast } = useToast();
	const [files, setFiles] = useState<PhotoFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const generateId = () => Math.random().toString(36).substring(2, 15);
	const isImageFile = (mimeType: string): boolean => mimeType.startsWith("image/");

	const validateFile = (file: File): string | null => {
		const fileType = file.type;
		const acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES);
		if (!acceptedTypes.includes(fileType)) {
			return `${file.name}: Unsupported file type`;
		}
		if (file.size > MAX_FILE_SIZE) {
			return `${file.name}: Too large (max 100MB)`;
		}
		return null;
	};

	const processFiles = useCallback(
		(fileList: FileList | null) => {
			if (!fileList) {
				return;
			}

			const newFiles: PhotoFile[] = [];
			const errors: string[] = [];

			Array.from(fileList).forEach((file) => {
				const error = validateFile(file);
				if (error) {
					errors.push(error);
					return;
				}

				const preview = URL.createObjectURL(file);
				const isDoc = !isImageFile(file.type);

				newFiles.push({
					id: generateId(),
					file,
					preview,
					category: "other",
					caption: "",
					isDocument: isDoc,
				});
			});

			if (errors.length > 0) {
				toast.error(`Some files couldn't be added: ${errors.join(", ")}`);
			}

			setFiles((prev) => [...prev, ...newFiles]);
		},
		[toast, generateId, isImageFile, validateFile]
	);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		processFiles(e.target.files);
		e.target.value = "";
	};

	const removeFile = (id: string) => {
		setFiles((prev) => {
			const file = prev.find((f) => f.id === id);
			if (file) {
				URL.revokeObjectURL(file.preview);
			}
			return prev.filter((f) => f.id !== id);
		});
	};

	const updateFileCategory = (id: string, category: PhotoCategory) => {
		setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, category } : f)));
	};

	const updateFileCaption = (id: string, caption: string) => {
		setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, caption } : f)));
	};

	const handleUpload = async () => {
		if (files.length === 0) {
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		try {
			let successCount = 0;
			let errorCount = 0;

			for (let i = 0; i < files.length; i++) {
				const photoFile = files[i];

				try {
					const formData = new FormData();
					formData.append("file", photoFile.file);
					formData.append("companyId", companyId);
					formData.append("contextType", "job");
					formData.append("contextId", jobId);

					// Add folder based on file type
					if (photoFile.isDocument) {
						formData.append("folder", "documents");
					} else {
						formData.append("folder", "photos");
					}

					// Add description if provided
					if (photoFile.caption) {
						formData.append("description", photoFile.caption);
					}

					// Add category as a tag
					if (photoFile.category) {
						formData.append("tags", JSON.stringify([photoFile.category]));
					}

					const result = await uploadDocument(formData);

					if (result?.success) {
						successCount++;
					} else {
						errorCount++;
						const errorMessage = result?.error || "Unknown error";

						// Show specific error messages
						if (errorMessage.includes("Access denied")) {
							toast.error(
								`Access denied for ${photoFile.file.name}. Please verify you have permission to upload files to this job.`
							);
						} else if (errorMessage.includes("Storage upload failed")) {
							toast.error(
								`Storage error for ${photoFile.file.name}. The file may be too large or the storage service is unavailable.`
							);
						} else {
							toast.error(`Failed to upload ${photoFile.file.name}: ${errorMessage}`);
						}
					}
				} catch (error) {
					errorCount++;
					const errorMessage = error instanceof Error ? error.message : String(error);

					// Handle different error types
					if (errorMessage.includes("unexpected response")) {
						toast.error(
							`Server error uploading ${photoFile.file.name}. Please try again or contact support if the problem persists.`
						);
					} else {
						toast.error(`Error uploading ${photoFile.file.name}: ${errorMessage}`);
					}
				}

				setUploadProgress(Math.round(((i + 1) / files.length) * 100));
			}

			if (successCount > 0) {
				toast.success(
					`Successfully uploaded ${successCount} ${successCount === 1 ? "file" : "files"}${errorCount > 0 ? ` (${errorCount} failed)` : ""}`
				);
			}

			if (errorCount > 0 && successCount === 0) {
				toast.error("All uploads failed. Please check your permissions and try again.");
			}

			// Clean up object URLs
			files.forEach((file) => URL.revokeObjectURL(file.preview));

			// Reset state
			setFiles([]);

			// Call completion callback
			if (onUploadComplete) {
				onUploadComplete();
			}

			// Close uploader
			if (onCancel) {
				setTimeout(() => onCancel(), 100);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to upload files";
			toast.error(errorMessage);
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) {
			return `${bytes} B`;
		}
		if (bytes < 1024 * 1024) {
			return `${(bytes / 1024).toFixed(1)} KB`;
		}
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className="space-y-3 rounded-lg border bg-muted/30 p-4">
			{/* Quick Upload Zone */}
			<div className="relative">
				<input
					accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
					className="absolute inset-0 cursor-pointer opacity-0"
					id="inline-file-upload"
					multiple
					onChange={handleFileInput}
					type="file"
				/>
				<div className="flex items-center gap-3 rounded-md border-2 border-muted-foreground/25 border-dashed bg-background p-3 hover:border-muted-foreground/50">
					<div className="flex gap-1">
						<div className="flex size-8 items-center justify-center rounded bg-primary/10">
							<Camera className="size-4 text-primary" />
						</div>
						<div className="flex size-8 items-center justify-center rounded bg-primary/10">
							<FileText className="size-4 text-primary" />
						</div>
					</div>
					<div className="flex-1">
						<p className="font-medium text-sm">Click or drag files here</p>
						<p className="text-muted-foreground text-xs">Images & documents up to 100MB</p>
					</div>
					<Upload className="size-5 text-muted-foreground" />
				</div>
			</div>

			{/* Selected Files */}
			{files.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">
							{files.length} file{files.length !== 1 ? "s" : ""} selected
						</span>
						<Button onClick={() => files.forEach((f) => removeFile(f.id))} size="sm" variant="ghost">
							Clear all
						</Button>
					</div>

					<div className="grid gap-2">
						{files.map((photoFile) => (
							<div className="flex items-center gap-3 rounded-md border bg-background p-2" key={photoFile.id}>
								{/* Thumbnail */}
								<div className="relative size-12 shrink-0 overflow-hidden rounded bg-muted">
									{photoFile.isDocument ? (
										<div className="flex size-full items-center justify-center">
											<FileText className="size-6 text-muted-foreground" />
										</div>
									) : (
										<Image alt={photoFile.file.name} className="object-cover" fill src={photoFile.preview} />
									)}
								</div>

								{/* Details */}
								<div className="flex min-w-0 flex-1 items-center gap-2">
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">{photoFile.file.name}</p>
										<p className="text-muted-foreground text-xs">{formatFileSize(photoFile.file.size)}</p>
									</div>

									{/* Category */}
									<Select
										onValueChange={(value) => updateFileCategory(photoFile.id, value as PhotoCategory)}
										value={photoFile.category}
									>
										<SelectTrigger className="h-7 w-24 text-xs">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="before">Before</SelectItem>
											<SelectItem value="during">During</SelectItem>
											<SelectItem value="after">After</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>

									{/* Caption */}
									<Input
										className="h-7 w-32 text-xs"
										onChange={(e) => updateFileCaption(photoFile.id, e.target.value)}
										placeholder="Caption"
										value={photoFile.caption}
									/>

									{/* Remove */}
									<Button className="size-7 p-0" onClick={() => removeFile(photoFile.id)} size="sm" variant="ghost">
										<X className="size-4" />
									</Button>
								</div>
							</div>
						))}
					</div>

					{/* Upload Progress */}
					{isUploading && (
						<div className="space-y-1">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">Uploading...</span>
								<span className="font-medium">{uploadProgress}%</span>
							</div>
							<div className="h-1.5 overflow-hidden rounded-full bg-muted">
								<div
									className="h-full bg-primary transition-all duration-300"
									style={{ width: `${uploadProgress}%` }}
								/>
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex justify-end gap-2">
						<Button disabled={isUploading} onClick={onCancel} size="sm" variant="outline">
							Cancel
						</Button>
						<Button disabled={files.length === 0 || isUploading} onClick={handleUpload} size="sm">
							{isUploading ? (
								<>Uploading...</>
							) : (
								<>
									<Check className="mr-1 size-4" />
									Upload {files.length} {files.length === 1 ? "File" : "Files"}
								</>
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
