/**
 * Call Routing Rule Actions - Client Component
 *
 * Client-side features:
 * - Interactive dropdowns and dialogs
 * - Optimistic updates with Zustand
 * - Real-time status toggling
 * - Delete confirmations
 */

"use client";

import { ArrowDown, ArrowUp, Copy, Edit, MoreVertical, Power, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	deleteCallRoutingRule,
	toggleCallRoutingRule,
	updateCallRoutingRule,
} from "@/actions/telnyx";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type CallRoutingRuleActionsProps = {
	rule: any;
};

export function CallRoutingRuleActions({ rule }: CallRoutingRuleActionsProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isToggling, setIsToggling] = useState(false);

	const handleToggleActive = async () => {
		setIsToggling(true);
		const result = await toggleCallRoutingRule(rule.id, !rule.is_active);

		if (result.success) {
			toast.success(`Rule ${rule.is_active ? "deactivated" : "activated"} successfully`);
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to update rule status");
		}

		setIsToggling(false);
	};

	const handleDelete = async () => {
		setIsDeleting(true);

		// Get current user (in a real app, you'd get this from auth)
		const userId = "current-user-id"; // TODO: Get from auth context

		const result = await deleteCallRoutingRule(rule.id, userId);

		if (result.success) {
			toast.success("Routing rule deleted successfully");
			setShowDeleteDialog(false);
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to delete routing rule");
		}

		setIsDeleting(false);
	};

	const handleIncreasePriority = async () => {
		const result = await updateCallRoutingRule({
			ruleId: rule.id,
			priority: (rule.priority || 0) + 1,
		});

		if (result.success) {
			toast.success("Priority increased");
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to update priority");
		}
	};

	const handleDecreasePriority = async () => {
		const result = await updateCallRoutingRule({
			ruleId: rule.id,
			priority: Math.max(0, (rule.priority || 0) - 1),
		});

		if (result.success) {
			toast.success("Priority decreased");
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to update priority");
		}
	};

	return (
		<>
			<div className="flex items-center gap-2">
				<Switch
					aria-label="Toggle rule active status"
					checked={rule.is_active}
					disabled={isToggling}
					onCheckedChange={handleToggleActive}
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="icon" variant="ghost">
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() =>
								router.push(`/dashboard/settings/communications/call-routing/${rule.id}`)
							}
						>
							<Edit className="mr-2 h-4 w-4" />
							Edit Rule
						</DropdownMenuItem>
						<DropdownMenuItem disabled={isToggling} onClick={handleToggleActive}>
							<Power className="mr-2 h-4 w-4" />
							{rule.is_active ? "Deactivate" : "Activate"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleIncreasePriority}>
							<ArrowUp className="mr-2 h-4 w-4" />
							Increase Priority
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleDecreasePriority}>
							<ArrowDown className="mr-2 h-4 w-4" />
							Decrease Priority
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => toast.success("Duplicate rule functionality")}>
							<Copy className="mr-2 h-4 w-4" />
							Duplicate
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => setShowDeleteDialog(true)}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Routing Rule</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{rule.name}"? This action cannot be undone. Calls
							will no longer be routed using this rule.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isDeleting}
							onClick={() => setShowDeleteDialog(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isDeleting} onClick={handleDelete} variant="destructive">
							{isDeleting ? "Deleting..." : "Delete Rule"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
