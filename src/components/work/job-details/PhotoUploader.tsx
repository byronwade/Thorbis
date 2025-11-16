"use client";

import { Camera, FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { uploadDocument } from "@/actions/documents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { PhotoCategory } from "./photo-types";

type PhotoFile = {
	id: string;
	file: File;
	preview: string;
	category: PhotoCategory;
	caption: string;
	isDocument: boolean;
};

type PhotoUploaderProps = {
	jobId: string;
	companyId: string;
	onUpload?: (files: PhotoFile[]) => Promise<void>;
	onCancel?: () => void;
	className?: string;
};

// Comprehensive file type support
const ACCEPTED_FILE_TYPES = {
	// Images
	"image/jpeg": [".jpg", ".jpeg"],
	"image/png": [".png"],
	"image/heic": [".heic"],
	"image/heif": [".heif"],
	"image/webp": [".webp"],
	"image/gif": [".gif"],
	"image/bmp": [".bmp"],
	"image/tiff": [".tiff", ".tif"],
	// Documents
	"application/pdf": [".pdf"],
	"application/msword": [".doc"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
	"application/vnd.ms-excel": [".xls"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
	"text/plain": [".txt"],
	"text/csv": [".csv"],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for job files

export function PhotoUploader({ jobId, companyId, onUpload, onCancel, className }: PhotoUploaderProps) {
	const { toast } = useToast();
	const [isDragging, setIsDragging] = useState(false);
	const [files, setFiles] = useState<PhotoFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const generateId = () => Math.random().toString(36).substring(2, 15);

	const isImageFile = (mimeType: string): boolean => mimeType.startsWith("image/");

	const validateFile = (file: File): string | null => {
		// Check file type
		const fileType = file.type;
		const acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES);
		if (!acceptedTypes.includes(fileType)) {
			return `File type ${fileType} is not supported. Please upload images (JPG, PNG, HEIC, WEBP, etc.) or documents (PDF, DOC, XLS, etc.).`;
		}

		// Check file size
		if (file.size > MAX_FILE_SIZE) {
			return `File ${file.name} is too large. Maximum size is 100MB.`;
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
				toast.error(errors.join("\n"));
			}

			setFiles((prev) => [...prev, ...newFiles]);
		},
		[toast, generateId, isImageFile, validateFile]
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const { files: droppedFiles } = e.dataTransfer;
			processFiles(droppedFiles);
		},
		[processFiles]
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			processFiles(e.target.files);
			// Reset input value to allow selecting the same file again
			e.target.value = "";
		},
		[processFiles]
	);

	const removeFile = useCallback((id: string) => {
		setFiles((prev) => {
			const file = prev.find((f) => f.id === id);
			if (file) {
				URL.revokeObjectURL(file.preview);
			}
			return prev.filter((f) => f.id !== id);
		});
	}, []);

	const updateFileCategory = useCallback((id: string, category: PhotoCategory) => {
		setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, category } : f)));
	}, []);

	const updateFileCaption = useCallback((id: string, caption: string) => {
		setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, caption } : f)));
	}, []);

	const handleUpload = async () => {
		if (files.length === 0) {
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		try {
			let successCount = 0;
			let errorCount = 0;

			// Upload files one by one
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

					if (result.success) {
						successCount++;
					} else {
						errorCount++;
					}
				} catch (_error) {
    console.error("Error:", _error);
					errorCount++;
				}

				// Update progress
				setUploadProgress(Math.round(((i + 1) / files.length) * 100));
			}

			// Show results
			if (successCount > 0) {
				toast.success(
					`Successfully uploaded ${successCount} ${successCount === 1 ? "file" : "files"}${errorCount > 0 ? ` (${errorCount} failed)` : ""}`
				);
			}

			if (errorCount > 0 && successCount === 0) {
				toast.error("All uploads failed. Please try again.");
			}

			// Clean up previews
			files.forEach((file) => {
				URL.revokeObjectURL(file.preview);
			});

			// Call onUpload callback if provided
			if (onUpload) {
				await onUpload(files);
			}

			// Reset state
			setTimeout(() => {
				setFiles([]);
				setIsUploading(false);
				setUploadProgress(0);
				onCancel?.();
			}, 500);
		} catch (error) {
    console.error("Error:", error);
			toast.error(error instanceof Error ? error.message : "Failed to upload files");
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const handleCancel = () => {
		// Clean up previews
		files.forEach((file) => {
			URL.revokeObjectURL(file.preview);
		});
		setFiles([]);
		onCancel?.();
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

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="size-5" />
					Upload Photos & Documents
				</CardTitle>
				<CardDescription>
					Add photos and documents to this job. Supported formats: Images (JPG, PNG, HEIC, WEBP, etc.), Documents (PDF,
					DOC, DOCX, XLS, XLSX, TXT, CSV) up to 100MB
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Drop Zone */}
				<div
					className={cn(
						"relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
						isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
					)}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<input
						accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
						className="absolute inset-0 cursor-pointer opacity-0"
						id="file-upload"
						multiple
						onChange={handleFileInput}
						type="file"
					/>
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="flex gap-2">
							<div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
								<Camera className="size-6 text-primary" />
							</div>
							<div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
								<FileText className="size-6 text-primary" />
							</div>
						</div>
						<div>
							<p className="font-medium">Drag and drop files here, or click to browse</p>
							<p className="text-muted-foreground text-sm">Images and documents up to 100MB</p>
						</div>
					</div>
				</div>

				{/* File List */}
				{files.length > 0 && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-sm">Selected Files ({files.length})</h3>
							<Button
								onClick={() => {
									files.forEach((file) => {
										URL.revokeObjectURL(file.preview);
									});
									setFiles([]);
								}}
								size="sm"
								variant="ghost"
							>
								Clear All
							</Button>
						</div>

						<div className="space-y-3">
							{files.map((photoFile) => (
								<div className="flex gap-4 rounded-lg border bg-muted/30 p-3" key={photoFile.id}>
									{/* Preview */}
									<div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
										{photoFile.isDocument ? (
											<div className="flex size-full items-center justify-center">
												<FileText className="size-8 text-muted-foreground" />
											</div>
										) : (
											<Image alt={photoFile.file.name} className="object-cover" fill src={photoFile.preview} />
										)}
									</div>

									{/* Details */}
									<div className="flex flex-1 flex-col gap-2">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<p className="truncate font-medium text-sm">{photoFile.file.name}</p>
												<p className="text-muted-foreground text-xs">{formatFileSize(photoFile.file.size)}</p>
											</div>
											<Button onClick={() => removeFile(photoFile.id)} size="sm" variant="ghost">
												<X className="size-4" />
											</Button>
										</div>

										{/* Category Select */}
										<div className="flex items-center gap-2">
											<Label className="text-xs" htmlFor={`category-${photoFile.id}`}>
												Category:
											</Label>
											<Select
												onValueChange={(value) => updateFileCategory(photoFile.id, value as PhotoCategory)}
												value={photoFile.category}
											>
												<SelectTrigger className="h-8 w-[120px]" id={`category-${photoFile.id}`}>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="before">Before</SelectItem>
													<SelectItem value="during">During</SelectItem>
													<SelectItem value="after">After</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
											<Badge className={cn("text-xs", getCategoryColor(photoFile.category))}>
												{photoFile.category}
											</Badge>
										</div>

										{/* Caption Input */}
										<Input
											className="h-8 text-xs"
											onChange={(e) => updateFileCaption(photoFile.id, e.target.value)}
											placeholder="Add a caption (optional)"
											value={photoFile.caption}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Upload Progress */}
				{isUploading && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Uploading...</span>
							<span className="font-medium">{uploadProgress}%</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex justify-end gap-2">
					<Button disabled={isUploading} onClick={handleCancel} variant="outline">
						Cancel
					</Button>
					<Button disabled={files.length === 0 || isUploading} onClick={handleUpload}>
						{isUploading ? (
							<>Uploading...</>
						) : (
							<>
								<Upload className="mr-2 size-4" />
								Upload {files.length} {files.length === 1 ? "File" : "Files"}
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
