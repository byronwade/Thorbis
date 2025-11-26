"use client";

import {
	AlertCircle,
	CheckCircle,
	File,
	FileText,
	Image as ImageIcon,
	Loader2,
	Upload,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// File type icons
const FILE_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	"application/pdf": FileText,
	"image/jpeg": ImageIcon,
	"image/png": ImageIcon,
	"image/gif": ImageIcon,
	"image/webp": ImageIcon,
	"text/plain": FileText,
	"application/msword": FileText,
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		FileText,
};

// Allowed file types for Pin Board
const ALLOWED_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"text/plain",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10;

export interface UploadedFile {
	id: string;
	name: string;
	size: number;
	type: string;
	url: string;
	status: "uploading" | "success" | "error";
	progress: number;
	error?: string;
}

interface PinBoardFileUploadProps {
	files: UploadedFile[];
	onFilesChange: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
	onUpload: (file: File) => Promise<{ url: string; id: string } | null>;
	disabled?: boolean;
	maxFiles?: number;
}

export function PinBoardFileUpload({
	files,
	onFilesChange,
	onUpload,
	disabled = false,
	maxFiles = MAX_FILES,
}: PinBoardFileUploadProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFiles = useCallback(
		async (selectedFiles: FileList | null) => {
			if (!selectedFiles || disabled) return;

			const validFiles: File[] = [];
			const errors: string[] = [];

			// Validate files
			for (const file of Array.from(selectedFiles)) {
				if (files.length + validFiles.length >= maxFiles) {
					errors.push(`Maximum ${maxFiles} files allowed`);
					break;
				}

				if (!ALLOWED_TYPES.includes(file.type)) {
					errors.push(`${file.name}: File type not allowed`);
					continue;
				}

				if (file.size > MAX_FILE_SIZE) {
					errors.push(`${file.name}: File too large (max 50MB)`);
					continue;
				}

				validFiles.push(file);
			}

			// Upload valid files
			for (const file of validFiles) {
				const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

				// Add file with uploading status
				const newFile: UploadedFile = {
					id: tempId,
					name: file.name,
					size: file.size,
					type: file.type,
					url: "",
					status: "uploading",
					progress: 0,
				};

				onFilesChange([...files, newFile]);

				try {
					// Simulate progress updates
					const progressInterval = setInterval(() => {
						onFilesChange((prev) =>
							prev.map((f) =>
								f.id === tempId && f.progress < 90
									? { ...f, progress: f.progress + 10 }
									: f,
							),
						);
					}, 200);

					const result = await onUpload(file);

					clearInterval(progressInterval);

					if (result) {
						onFilesChange((prev) =>
							prev.map((f) =>
								f.id === tempId
									? {
											...f,
											id: result.id,
											url: result.url,
											status: "success",
											progress: 100,
										}
									: f,
							),
						);
					} else {
						onFilesChange((prev) =>
							prev.map((f) =>
								f.id === tempId
									? { ...f, status: "error", error: "Upload failed" }
									: f,
							),
						);
					}
				} catch (error) {
					onFilesChange((prev) =>
						prev.map((f) =>
							f.id === tempId
								? {
										...f,
										status: "error",
										error:
											error instanceof Error ? error.message : "Upload failed",
									}
								: f,
						),
					);
				}
			}
		},
		[files, onFilesChange, onUpload, disabled, maxFiles],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		},
		[handleFiles],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const removeFile = useCallback(
		(id: string) => {
			onFilesChange(files.filter((f) => f.id !== id));
		},
		[files, onFilesChange],
	);

	const formatSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className="space-y-3">
			{/* Drop Zone */}
			<div
				className={cn(
					"relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
					isDragging
						? "border-primary bg-primary/5"
						: "border-muted-foreground/25 hover:border-primary/50",
					disabled && "opacity-50 cursor-not-allowed",
				)}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onClick={() => !disabled && fileInputRef.current?.click()}
			>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept={ALLOWED_TYPES.join(",")}
					className="hidden"
					onChange={(e) => handleFiles(e.target.files)}
					disabled={disabled}
				/>

				<div className="flex flex-col items-center gap-2 text-center">
					<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
						<Upload className="h-6 w-6 text-muted-foreground" />
					</div>
					<div>
						<p className="font-medium text-sm">
							Drop files here or click to upload
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							PDF, images, Word, Excel up to 50MB ({files.length}/{maxFiles}{" "}
							files)
						</p>
					</div>
				</div>
			</div>

			{/* File List */}
			{files.length > 0 && (
				<div className="space-y-2">
					{files.map((file) => {
						const Icon = FILE_ICONS[file.type] || File;

						return (
							<div
								key={file.id}
								className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group"
							>
								<div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shrink-0">
									<Icon className="h-5 w-5 text-muted-foreground" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="text-sm font-medium truncate">{file.name}</p>
										{file.status === "uploading" && (
											<Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
										)}
										{file.status === "success" && (
											<CheckCircle className="h-3 w-3 text-green-500" />
										)}
										{file.status === "error" && (
											<AlertCircle className="h-3 w-3 text-destructive" />
										)}
									</div>

									{file.status === "uploading" ? (
										<Progress value={file.progress} className="h-1 mt-1" />
									) : file.status === "error" ? (
										<p className="text-xs text-destructive">{file.error}</p>
									) : (
										<p className="text-xs text-muted-foreground">
											{formatSize(file.size)}
										</p>
									)}
								</div>

								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
									onClick={(e) => {
										e.stopPropagation();
										removeFile(file.id);
									}}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
