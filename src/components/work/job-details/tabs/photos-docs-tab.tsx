/**
 * Photos & Docs Tab - Media & Document Management
 */

"use client";

import { Camera, FileText, Pen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlinePhotoUploader } from "../InlinePhotoUploader";

type PhotosDocsTabProps = {
	job: any;
	photos: any[];
	photosByCategory: Record<string, any[]>;
	documents: any[];
	signatures: any[];
	customerSignature: any;
	technicianSignature: any;
	isEditMode: boolean;
};

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
	const router = useRouter();
	const [showUploader, setShowUploader] = useState(false);
	return (
		<div className="mx-auto max-w-6xl space-y-6">
			{/* Upload Section */}
			{isEditMode && showUploader && (
				<InlinePhotoUploader
					companyId={job.company_id}
					jobId={job.id}
					onCancel={() => setShowUploader(false)}
					onUploadComplete={() => {
						setShowUploader(false);
						router.refresh();
					}}
				/>
			)}

			{/* Photos by Category */}
			<Card>
				<CardHeader>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-2">
							<Camera className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Photos</CardTitle>
							<Badge variant="secondary">{photos.length}</Badge>
						</div>
						{isEditMode && !showUploader && (
							<Button onClick={() => setShowUploader(true)} size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Upload
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						{Object.entries(photosByCategory).map(([category, categoryPhotos]) => (
							<div className="rounded-lg border p-4" key={category}>
								<p className="mb-2 font-medium text-sm capitalize">{category}</p>
								<p className="font-bold text-2xl">{categoryPhotos.length}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Documents */}
			<Card>
				<CardHeader>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Documents</CardTitle>
							<Badge variant="secondary">{documents.length}</Badge>
						</div>
						{isEditMode && !showUploader && (
							<Button onClick={() => setShowUploader(true)} size="sm" variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Upload
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{documents.length > 0 ? (
						<div className="space-y-2">
							{documents.map((doc) => (
								<div className="flex items-center justify-between rounded-lg border p-3" key={doc.id}>
									<span className="text-sm">{doc.file_name}</span>
									<Button size="sm" variant="ghost">
										View
									</Button>
								</div>
							))}
						</div>
					) : (
						<div className="text-center text-muted-foreground text-sm">No documents uploaded</div>
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
							<p className="mb-2 font-medium text-sm">Customer Signature</p>
							{customerSignature ? <Badge variant="default">Signed</Badge> : <Badge variant="secondary">Pending</Badge>}
						</div>
						<div className="rounded-lg border p-4">
							<p className="mb-2 font-medium text-sm">Technician Signature</p>
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
