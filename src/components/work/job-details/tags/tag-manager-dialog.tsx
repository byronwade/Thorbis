/**
 * Tag Manager Dialog
 * Allows adding/editing/removing tags for customers and jobs
 */

"use client";

import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateCustomerTags, updateJobTags } from "@/actions/job-tags";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TagBadge } from "./tag-badge";

type TagManagerDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	customerId?: string;
	jobId?: string;
	customerTags?: string[];
	jobTags?: string[];
	onUpdate?: () => void;
};

// Common tags for quick-add
const COMMON_CUSTOMER_TAGS = [
	"DNS - Do Not Service",
	"Family Friend",
	"10% Discount",
	"VIP Customer",
	"Payment Plan",
	"Requires Appointment",
];

const COMMON_JOB_TAGS = [
	"Warranty Work",
	"Follow-up Required",
	"Emergency",
	"Inspection Needed",
	"Parts on Order",
	"Callback Scheduled",
];

export function TagManagerDialog({
	open,
	onOpenChange,
	customerId,
	jobId,
	customerTags = [],
	jobTags = [],
	onUpdate,
}: TagManagerDialogProps) {
	const [localCustomerTags, setLocalCustomerTags] =
		useState<string[]>(customerTags);
	const [localJobTags, setLocalJobTags] = useState<string[]>(jobTags);
	const [newCustomerTag, setNewCustomerTag] = useState("");
	const [newJobTag, setNewJobTag] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const handleAddCustomerTag = (tag: string) => {
		if (tag && !localCustomerTags.includes(tag)) {
			setLocalCustomerTags([...localCustomerTags, tag]);
		}
		setNewCustomerTag("");
	};

	const handleAddJobTag = (tag: string) => {
		if (tag && !localJobTags.includes(tag)) {
			setLocalJobTags([...localJobTags, tag]);
		}
		setNewJobTag("");
	};

	const handleRemoveCustomerTag = (tag: string) => {
		setLocalCustomerTags(localCustomerTags.filter((t) => t !== tag));
	};

	const handleRemoveJobTag = (tag: string) => {
		setLocalJobTags(localJobTags.filter((t) => t !== tag));
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const promises = [];

			if (
				customerId &&
				JSON.stringify(localCustomerTags) !== JSON.stringify(customerTags)
			) {
				promises.push(updateCustomerTags(customerId, localCustomerTags));
			}

			if (jobId && JSON.stringify(localJobTags) !== JSON.stringify(jobTags)) {
				promises.push(updateJobTags(jobId, localJobTags));
			}

			const results = await Promise.all(promises);

			if (results.every((r) => r.success)) {
				toast.success("Tags updated successfully");
				onUpdate?.();
				onOpenChange(false);
			} else {
				const error = results.find((r) => !r.success)?.error;
				toast.error(error || "Failed to update tags");
			}
		} catch (_error) {
			toast.error("Failed to update tags");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Manage Tags</DialogTitle>
					<DialogDescription>
						Add tags to organize and categorize this customer and job
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Customer Tags Section */}
					{customerId && (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Tag className="size-4 text-blue-600" />
								<h3 className="font-semibold text-sm">Customer Tags</h3>
								<span className="text-muted-foreground text-xs">
									(Apply to all jobs for this customer)
								</span>
							</div>

							{/* Current Customer Tags */}
							{localCustomerTags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{localCustomerTags.map((tag) => (
										<TagBadge
											key={tag}
											onRemove={() => handleRemoveCustomerTag(tag)}
											showRemove
											tag={tag}
											type="customer"
										/>
									))}
								</div>
							)}

							{/* Quick-add Common Tags */}
							<div className="space-y-2">
								<Label className="text-xs">Quick Add</Label>
								<div className="flex flex-wrap gap-2">
									{COMMON_CUSTOMER_TAGS.filter(
										(tag) => !localCustomerTags.includes(tag),
									).map((tag) => (
										<Button
											className="h-7 gap-1 text-xs"
											key={tag}
											onClick={() => handleAddCustomerTag(tag)}
											size="sm"
											variant="outline"
										>
											<Plus className="size-3" />
											{tag}
										</Button>
									))}
								</div>
							</div>

							{/* Custom Customer Tag Input */}
							<div className="flex gap-2">
								<Input
									onChange={(e) => setNewCustomerTag(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleAddCustomerTag(newCustomerTag);
										}
									}}
									placeholder="Add custom customer tag..."
									value={newCustomerTag}
								/>
								<Button
									onClick={() => handleAddCustomerTag(newCustomerTag)}
									size="sm"
									variant="outline"
								>
									<Plus className="size-4" />
								</Button>
							</div>
						</div>
					)}

					{customerId && jobId && <Separator />}

					{/* Job Tags Section */}
					{jobId && (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Tag className="size-4 text-purple-600" />
								<h3 className="font-semibold text-sm">Job Tags</h3>
								<span className="text-muted-foreground text-xs">
									(Apply to this job only)
								</span>
							</div>

							{/* Current Job Tags */}
							{localJobTags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{localJobTags.map((tag) => (
										<TagBadge
											key={tag}
											onRemove={() => handleRemoveJobTag(tag)}
											showRemove
											tag={tag}
											type="job"
										/>
									))}
								</div>
							)}

							{/* Quick-add Common Tags */}
							<div className="space-y-2">
								<Label className="text-xs">Quick Add</Label>
								<div className="flex flex-wrap gap-2">
									{COMMON_JOB_TAGS.filter(
										(tag) => !localJobTags.includes(tag),
									).map((tag) => (
										<Button
											className="h-7 gap-1 text-xs"
											key={tag}
											onClick={() => handleAddJobTag(tag)}
											size="sm"
											variant="outline"
										>
											<Plus className="size-3" />
											{tag}
										</Button>
									))}
								</div>
							</div>

							{/* Custom Job Tag Input */}
							<div className="flex gap-2">
								<Input
									onChange={(e) => setNewJobTag(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleAddJobTag(newJobTag);
										}
									}}
									placeholder="Add custom job tag..."
									value={newJobTag}
								/>
								<Button
									onClick={() => handleAddJobTag(newJobTag)}
									size="sm"
									variant="outline"
								>
									<Plus className="size-4" />
								</Button>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button disabled={isSaving} onClick={handleSave}>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
