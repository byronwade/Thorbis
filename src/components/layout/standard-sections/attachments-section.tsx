"use client";

import { Download, FileText, Paperclip, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";

type AttachmentsSectionProps = {
	attachments: any[];
	entityType?: string;
	entityId?: string;
	onUpload?: (files: FileList) => Promise<void>;
};

export function AttachmentsSection({
	attachments,
	entityType,
	entityId,
	onUpload,
}: AttachmentsSectionProps) {
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) {
			return;
		}

		setIsUploading(true);
		try {
			if (onUpload) {
				await onUpload(files);
			}
			toast.success(`${files.length} file(s) uploaded successfully`);
		} catch (_error) {
			toast.error("Failed to upload files");
		} finally {
			setIsUploading(false);
			// Reset input
			e.target.value = "";
		}
	};

	return (
		<UnifiedAccordionContent>
			<div className="space-y-4">
				{/* Upload Button */}
				{onUpload && (
					<div>
						<input
							className="hidden"
							disabled={isUploading}
							id="file-upload"
							multiple
							onChange={handleFileChange}
							type="file"
						/>
						<label htmlFor="file-upload">
							<Button
								asChild
								className="w-full cursor-pointer"
								disabled={isUploading}
								size="sm"
								variant="outline"
							>
								<span>
									{isUploading ? (
										<>
											<Upload className="mr-2 size-4 animate-pulse" />
											Uploading...
										</>
									) : (
										<>
											<Plus className="mr-2 size-4" />
											Upload Files
										</>
									)}
								</span>
							</Button>
						</label>
					</div>
				)}

				{/* Attachments List */}
				{attachments && attachments.length > 0 ? (
					<div className="space-y-2">
						{attachments.map((attachment: any) => (
							<div
								className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
								key={attachment.id}
							>
								<div className="flex min-w-0 flex-1 items-center gap-3">
									<FileText className="text-muted-foreground size-4 flex-shrink-0" />
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">
											{attachment.original_file_name ||
												attachment.file_name ||
												"Untitled"}
										</p>
										<p className="text-muted-foreground text-xs">
											{attachment.file_size
												? `${(attachment.file_size / 1024).toFixed(1)} KB`
												: ""}
											{attachment.category && ` • ${attachment.category}`}
										</p>
									</div>
								</div>
								<Button
									asChild
									className="flex-shrink-0"
									size="sm"
									variant="ghost"
								>
									<a
										download
										href={attachment.storage_url || attachment.url}
										rel="noopener noreferrer"
										target="_blank"
									>
										<Download className="size-4" />
									</a>
								</Button>
							</div>
						))}
					</div>
				) : (
					<div className="flex h-32 items-center justify-center">
						<div className="text-center">
							<Paperclip className="text-muted-foreground/50 mx-auto size-8" />
							<p className="text-muted-foreground mt-2 text-sm">
								No attachments yet
							</p>
						</div>
					</div>
				)}
			</div>
		</UnifiedAccordionContent>
	);
}
