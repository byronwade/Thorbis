"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEmailFolderAction } from "@/actions/email-folders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

type CreateFolderDialogProps = {
	onFolderCreated?: () => void;
	children?: React.ReactNode;
};

export function CreateFolderDialog({ onFolderCreated, children }: CreateFolderDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!name.trim()) {
			toast.error("Folder name is required");
			return;
		}

		setLoading(true);
		try {
			const result = await createEmailFolderAction({
				name: name.trim(),
				description: description.trim() || undefined,
			});

			if (result.success && result.folder) {
				toast.success("Folder created successfully");
				setOpen(false);
				setName("");
				setDescription("");
				
				// Navigate to the new folder
				router.push(`/dashboard/communication/folder/${result.folder.slug}`);
				
				// Refresh sidebar
				onFolderCreated?.();
			} else {
				toast.error(result.error || "Failed to create folder");
			}
		} catch (error) {
			toast.error("Failed to create folder", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="ghost" size="icon" className="h-6 w-6">
						<Plus className="h-4 w-4" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Folder</DialogTitle>
						<DialogDescription>
							Create a custom folder to organize your emails. You can add emails to this folder using labels.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Folder Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., CSLB, Important, Follow-up"
								required
								maxLength={100}
								disabled={loading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description (Optional)</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Add a description for this folder"
								maxLength={500}
								disabled={loading}
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || !name.trim()}>
							{loading ? "Creating..." : "Create Folder"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

