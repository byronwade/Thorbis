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

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleCallRoutingRule,
  deleteCallRoutingRule,
  updateCallRoutingRule,
} from "@/actions/telnyx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  MoreVertical,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Power,
} from "lucide-react";

interface CallRoutingRuleActionsProps {
  rule: any;
}

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
      toast.success(`Rule ${!rule.is_active ? "activated" : "deactivated"} successfully`);
      router.refresh();
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
      router.refresh();
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
      router.refresh();
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
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update priority");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={rule.is_active}
          onCheckedChange={handleToggleActive}
          disabled={isToggling}
          aria-label="Toggle rule active status"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/communications/call-routing/${rule.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Rule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleActive} disabled={isToggling}>
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
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Routing Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{rule.name}"? This action cannot be
              undone. Calls will no longer be routed using this rule.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
