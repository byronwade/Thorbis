"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createTeamChannelAction } from "@/actions/teams-actions";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/lib/utils/error-logger";

type CreateTeamChannelDialogProps = {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onChannelCreated?: () => void;
	children?: React.ReactNode;
};

export function CreateTeamChannelDialog({
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	onChannelCreated,
	children,
}: CreateTeamChannelDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = controlledOnOpenChange || setInternalOpen;
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<"public" | "private">("public");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("Channel name is required");
			return;
		}

		setLoading(true);
		try {
			const result = await createTeamChannelAction({
				name: name.trim(),
				description: description.trim() || undefined,
				type,
			});

			if (result.success && result.channelId) {
				toast.success("Channel created successfully");
				setOpen(false);
				setName("");
				setDescription("");
				setType("public");

				// Navigate to the new channel
				router.push(`/dashboard/communication?channel=${name.trim().toLowerCase()}`);

				// Refresh sidebar
				onChannelCreated?.();
			} else {
				toast.error(result.error || "Failed to create channel");
			}
		} catch (error) {
			logError(error, "CreateTeamChannel");
			toast.error("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{controlledOpen === undefined && (
				<DialogTrigger asChild>
					{children || (
						<Button variant="ghost" size="icon" className="h-6 w-6">
							<Plus className="h-4 w-4" />
						</Button>
					)}
				</DialogTrigger>
			)}
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Channel</DialogTitle>
						<DialogDescription>
							Create a new team channel for group communication. Channels can be
							public (visible to all team members) or private (invite-only).
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Channel Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., general, sales, support"
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
								placeholder="Add a description for this channel"
								maxLength={500}
								disabled={loading}
								rows={3}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="type">Channel Type</Label>
							<Select
								value={type}
								onValueChange={(value) => setType(value as "public" | "private")}
								disabled={loading}
							>
								<SelectTrigger id="type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">Public</SelectItem>
									<SelectItem value="private">Private</SelectItem>
								</SelectContent>
							</Select>
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
							{loading ? "Creating..." : "Create Channel"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

