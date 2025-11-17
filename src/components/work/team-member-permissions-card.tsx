"use client";

/**
 * Team Member Permissions Card
 *
 * Shows and allows editing of team member permissions
 * Only visible to owners/managers
 */

import { Shield, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	getTeamMemberPermissions,
	updateTeamMemberPermissions,
} from "@/actions/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const AVAILABLE_ROLES = [
	{ value: "owner", label: "Owner", description: "Full system access" },
	{ value: "admin", label: "Admin", description: "System administration" },
	{
		value: "manager",
		label: "Manager",
		description: "Team and operations management",
	},
	{
		value: "dispatcher",
		label: "Dispatcher",
		description: "Schedule and dispatch",
	},
	{ value: "technician", label: "Technician", description: "Field operations" },
	{ value: "csr", label: "CSR", description: "Customer service" },
];

export function TeamMemberPermissionsCard() {
	const params = useParams();
	const router = useRouter();
	const memberId = params?.id as string;

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentRole, setCurrentRole] = useState<string>("");
	const [selectedRole, setSelectedRole] = useState<string>("");
	const [canManage, setCanManage] = useState(false);
	const [permissions, setPermissions] = useState<Record<string, boolean>>({});

	useEffect(() => {
		async function loadPermissions() {
			setIsLoading(true);
			const result = await getTeamMemberPermissions(memberId);

			if (result.success && result.data) {
				setCurrentRole(result.data.role);
				setSelectedRole(result.data.role);
				setPermissions(result.data.permissions);
				setCanManage(result.data.canManage);
			} else {
				toast.error("Failed to load permissions");
			}

			setIsLoading(false);
		}

		if (memberId) {
			loadPermissions();
		}
	}, [memberId]);

	const handleSaveRole = async () => {
		if (selectedRole === currentRole) {
			toast.info("No changes to save");
			return;
		}

		setIsSaving(true);
		const result = await updateTeamMemberPermissions(memberId, selectedRole);

		if (result.success) {
			toast.success("Role updated successfully");
			setCurrentRole(selectedRole);
			// Server Action handles revalidation automatically
		} else {
			toast.error(result.error || "Failed to update role");
			setSelectedRole(currentRole); // Reset to current role
		}

		setIsSaving(false);
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Permissions & Access</CardTitle>
					<CardDescription>Loading permissions...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex h-32 items-center justify-center">
						<div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!canManage) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="size-5" />
						Permissions & Access
					</CardTitle>
					<CardDescription>Current role and permissions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<p className="mb-2 font-medium text-sm">Current Role</p>
							<Badge className="capitalize" variant="secondary">
								{currentRole}
							</Badge>
						</div>
						<p className="text-muted-foreground text-sm">
							Only owners and managers can modify permissions
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const hasChanges = selectedRole !== currentRole;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<ShieldCheck className="size-5" />
					Permissions & Access
				</CardTitle>
				<CardDescription>
					Manage role and permissions for this team member
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Role Selection */}
				<div className="space-y-2">
					<label className="font-medium text-sm">Role</label>
					<Select onValueChange={setSelectedRole} value={selectedRole}>
						<SelectTrigger>
							<SelectValue placeholder="Select a role" />
						</SelectTrigger>
						<SelectContent>
							{AVAILABLE_ROLES.map((role) => (
								<SelectItem key={role.value} value={role.value}>
									<div className="flex flex-col">
										<span className="font-medium">{role.label}</span>
										<span className="text-muted-foreground text-xs">
											{role.description}
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Key Permissions Display */}
				<div className="space-y-2">
					<label className="font-medium text-sm">Key Permissions</label>
					<div className="flex flex-wrap gap-2">
						{Object.entries(permissions).length > 0 ? (
							Object.entries(permissions)
								.filter(([, enabled]) => enabled)
								.slice(0, 6)
								.map(([key]) => (
									<Badge key={key} variant="outline">
										{key.replace(/_/g, " ")}
									</Badge>
								))
						) : (
							<p className="text-muted-foreground text-sm">
								No permissions configured
							</p>
						)}
					</div>
					{Object.entries(permissions).filter(([, enabled]) => enabled).length >
						6 && (
						<p className="text-muted-foreground text-xs">
							+
							{Object.entries(permissions).filter(([, enabled]) => enabled)
								.length - 6}{" "}
							more permissions
						</p>
					)}
				</div>

				{/* Save Button */}
				{hasChanges && (
					<div className="flex items-center justify-end gap-2 border-t pt-4">
						<Button
							disabled={isSaving}
							onClick={() => setSelectedRole(currentRole)}
							size="sm"
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isSaving} onClick={handleSaveRole} size="sm">
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
