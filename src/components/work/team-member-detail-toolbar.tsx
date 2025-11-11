"use client";

/**
 * Team Member Detail Toolbar - Actions for team member detail page
 *
 * Shows actions like Send Email, Edit, etc.
 */

import { Archive, KeyRound, Mail, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  activateTeamMember,
  archiveTeamMember,
  canManageTeamMember,
  sendPasswordResetEmail,
  suspendTeamMember,
} from "@/actions/team";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TeamMemberDetailToolbar() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    async function checkManagePermission() {
      const result = await canManageTeamMember(memberId);
      if (result.success && result.data) {
        setCanManage(result.data);
      }
    }

    if (memberId) {
      checkManagePermission();
    }
  }, [memberId]);

  const handleSuspendMember = async () => {
    if (!confirm("Are you sure you want to suspend this team member?")) {
      return;
    }

    setIsLoading(true);
    const result = await suspendTeamMember(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Team member suspended successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to suspend team member");
    }
  };

  const handleActivateMember = async () => {
    setIsLoading(true);
    const result = await activateTeamMember(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Team member activated successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to activate team member");
    }
  };

  const handleArchiveMember = async () => {
    if (!confirm("Are you sure you want to permanently archive this team member? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    const result = await archiveTeamMember(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Team member archived successfully");
      router.push("/dashboard/work/team");
    } else {
      toast.error(result.error || "Failed to archive team member");
    }
  };

  const handlePasswordReset = async () => {
    if (!confirm("Send a password reset email to this team member?")) {
      return;
    }

    setIsLoading(true);
    const result = await sendPasswordResetEmail(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Password reset email sent successfully");
    } else {
      toast.error(result.error || "Failed to send password reset email");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isLoading} size="sm" variant="outline">
            <MoreHorizontal className="size-4" />
            <span className="ml-2">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Owner/Manager Only Actions */}
          {canManage && (
            <>
              <DropdownMenuItem onClick={handlePasswordReset}>
                <KeyRound className="mr-2 size-4" />
                Send Password Reset
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={handleActivateMember}>
            <UserCheck className="mr-2 size-4" />
            Activate Member
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={handleSuspendMember}
          >
            <UserX className="mr-2 size-4" />
            Suspend Member
          </DropdownMenuItem>

          {/* Owner/Manager Only Actions */}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleArchiveMember}
              >
                <Archive className="mr-2 size-4" />
                Archive Member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
