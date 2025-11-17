"use client";

/**
 * Permissions Editor Component
 *
 * Comprehensive UI for editing team member roles and permissions.
 * Shows role-based defaults and allows custom permission overrides.
 *
 * Features:
 * - Visual role selector with descriptions
 * - Categorized permissions by type
 * - Indicators for role defaults vs custom overrides
 * - Easy toggle switches
 * - Save/reset functionality
 * - Real-time preview of changes
 */

import {
	AlertCircle,
	CheckCircle2,
	Eye,
	Lock,
	Settings,
	Shield,
	Trash2,
	UserCog,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type Permission, ROLES, type UserRole } from "@/lib/auth/permissions";

// Permission categories for organization
const PERMISSION_CATEGORIES = {
	view: {
		label: "View Permissions",
		description: "What the user can see and access",
		icon: Eye,
		permissions: [
			"view_customers",
			"view_jobs",
			"view_schedule",
			"view_reports",
			"view_tech_locations",
		] as Permission[],
	},
	manage: {
		label: "Management Permissions",
		description: "Administrative and team management capabilities",
		icon: UserCog,
		permissions: [
			"manage_team",
			"manage_schedule",
			"dispatch_jobs",
			"approve_estimates",
			"handle_escalations",
		] as Permission[],
	},
	actions: {
		label: "Action Permissions",
		description: "What actions the user can perform",
		icon: Settings,
		permissions: [
			"create_jobs",
			"update_job_status",
			"create_invoices",
			"schedule_appointments",
			"send_communications",
			"upload_photos",
		] as Permission[],
	},
	delete: {
		label: "Delete Permissions",
		description: "Destructive actions (use with caution)",
		icon: Trash2,
		permissions: ["delete_jobs", "delete_customers", "delete_team_members"] as Permission[],
	},
};

// Permission labels and descriptions
const PERMISSION_INFO: Record<Permission, { label: string; description: string }> = {
	// View permissions
	view_customers: {
		label: "View Customers",
		description: "Access customer list and profiles",
	},
	view_jobs: {
		label: "View Jobs",
		description: "View all jobs and work orders",
	},
	view_schedule: {
		label: "View Schedule",
		description: "Access company schedule and calendar",
	},
	view_reports: {
		label: "View Reports",
		description: "Access reports and analytics dashboards",
	},
	view_tech_locations: {
		label: "View Technician Locations",
		description: "See real-time technician GPS locations",
	},

	// Management permissions
	manage_team: {
		label: "Manage Team",
		description: "Add/remove team members and assign roles",
	},
	manage_schedule: {
		label: "Manage Schedule",
		description: "Create, edit, and delete schedule entries",
	},
	dispatch_jobs: {
		label: "Dispatch Jobs",
		description: "Assign jobs to technicians",
	},
	approve_estimates: {
		label: "Approve Estimates",
		description: "Review and approve customer estimates",
	},
	handle_escalations: {
		label: "Handle Escalations",
		description: "Manage customer complaints and issues",
	},

	// Action permissions
	create_jobs: {
		label: "Create Jobs",
		description: "Create new jobs and work orders",
	},
	update_job_status: {
		label: "Update Job Status",
		description: "Change job status and add updates",
	},
	create_invoices: {
		label: "Create Invoices",
		description: "Generate invoices for jobs",
	},
	schedule_appointments: {
		label: "Schedule Appointments",
		description: "Book appointments with customers",
	},
	send_communications: {
		label: "Send Communications",
		description: "Send emails and SMS to customers",
	},
	upload_photos: {
		label: "Upload Photos",
		description: "Upload job photos and documentation",
	},

	// Delete permissions
	delete_jobs: {
		label: "Delete Jobs",
		description: "Permanently delete jobs (use with caution)",
	},
	delete_customers: {
		label: "Delete Customers",
		description: "Permanently delete customers (use with caution)",
	},
	delete_team_members: {
		label: "Delete Team Members",
		description: "Remove team members from company (owner only)",
	},
};

type PermissionsEditorProps = {
	/** Current team member role */
	currentRole: UserRole;

	/** Current custom permissions (JSONB) */
	currentPermissions?: Record<string, boolean>;

	/** Callback when role changes */
	onRoleChange?: (role: UserRole) => void;

	/** Callback when permissions change */
	onPermissionsChange?: (permissions: Record<string, boolean>) => void;

	/** Whether changes are being saved */
	isSaving?: boolean;

	/** Whether this team member is the company owner (cannot change role/permissions) */
	isOwner?: boolean;
};

export function PermissionsEditor({
	currentRole,
	currentPermissions = {},
	onRoleChange,
	onPermissionsChange,
	isSaving = false,
	isOwner = false,
}: PermissionsEditorProps) {
	const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
	const [customPermissions, setCustomPermissions] =
		useState<Record<string, boolean>>(currentPermissions);

	// Get role configuration
	const roleConfig = ROLES[selectedRole];

	// Check if permission is enabled (from role or custom)
	const isPermissionEnabled = (permission: Permission): boolean => {
		// Check custom override first
		if (permission in customPermissions) {
			return customPermissions[permission];
		}
		// Fall back to role default
		return roleConfig.permissions.includes(permission);
	};

	// Check if permission is custom (overridden)
	const isPermissionCustom = (permission: Permission): boolean => permission in customPermissions;

	// Handle role change
	const handleRoleChange = (role: UserRole) => {
		setSelectedRole(role);
		// Clear custom permissions when role changes
		setCustomPermissions({});
		onRoleChange?.(role);
	};

	// Handle permission toggle
	const handlePermissionToggle = (permission: Permission, enabled: boolean) => {
		const roleDefault = ROLES[selectedRole].permissions.includes(permission);

		// If setting to role default, remove custom override
		if (enabled === roleDefault) {
			const { [permission]: _, ...rest } = customPermissions;
			setCustomPermissions(rest);
			onPermissionsChange?.(rest);
		} else {
			// Add custom override
			const updated = { ...customPermissions, [permission]: enabled };
			setCustomPermissions(updated);
			onPermissionsChange?.(updated);
		}
	};

	// Reset custom permissions
	const handleResetPermissions = () => {
		setCustomPermissions({});
		onPermissionsChange?.({});
	};

	const hasCustomPermissions = Object.keys(customPermissions).length > 0;

	return (
		<div className="space-y-6">
			{/* Owner Protection Warning */}
			{isOwner && (
				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<Lock className="text-primary mt-0.5 h-5 w-5 shrink-0" />
						<div className="flex-1 space-y-2">
							<p className="text-primary dark:text-primary text-sm font-medium">
								Company Owner - Protected Role
							</p>
							<p className="text-muted-foreground text-sm">
								This team member is the company owner. The owner role cannot be changed and the
								owner cannot be removed. To change ownership, use the "Transfer Ownership" option in
								the team member's action menu.
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Role Selector */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="text-primary h-5 w-5" />
						Role Assignment
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Select the primary role for this team member. Roles come with predefined permissions
						that can be customized below.
					</p>

					<RadioGroup
						className="space-y-3"
						disabled={isSaving || isOwner}
						onValueChange={(value) => handleRoleChange(value as UserRole)}
						value={selectedRole}
					>
						{(["owner", "admin", "manager", "dispatcher", "technician", "csr"] as UserRole[]).map(
							(role) => {
								const config = ROLES[role];
								const isSelected = selectedRole === role;
								const isCurrent = currentRole === role;

								return (
									<div
										className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
											isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
										}`}
										key={role}
									>
										<RadioGroupItem className="mt-1" id={role} value={role} />
										<div className="flex-1 space-y-2">
											<div className="flex items-center gap-2">
												<Label className="cursor-pointer text-base font-semibold" htmlFor={role}>
													{config.label}
												</Label>
												{isCurrent && (
													<Badge className="text-xs" variant="default">
														Current
													</Badge>
												)}
											</div>
											<p className="text-muted-foreground text-sm">{config.description}</p>
											{/* Show permission count */}
											<div className="flex items-center gap-2 text-xs">
												<Badge variant="outline">{config.permissions.length} permissions</Badge>
												{config.permissions.length > 10 && (
													<span className="text-muted-foreground">(Full access)</span>
												)}
											</div>
										</div>
									</div>
								);
							}
						)}
					</RadioGroup>
				</CardContent>
			</Card>

			{/* Custom Permissions Notice */}
			{hasCustomPermissions && (
				<Card className="border-warning/50 bg-warning/5">
					<CardContent className="flex items-start gap-3 pt-6">
						<AlertCircle className="text-warning mt-0.5 h-5 w-5 shrink-0" />
						<div className="flex-1 space-y-2">
							<p className="text-warning dark:text-warning text-sm font-medium">
								Custom Permissions Active
							</p>
							<p className="text-muted-foreground text-sm">
								This user has {Object.keys(customPermissions).length} custom permission override(s).
								Custom permissions take precedence over role defaults.
							</p>
							<Button onClick={handleResetPermissions} size="sm" type="button" variant="outline">
								Reset to Role Defaults
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Permissions Categories */}
			{Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => {
				const CategoryIcon = category.icon;

				return (
					<Card key={key}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CategoryIcon className="text-primary h-5 w-5" />
								{category.label}
							</CardTitle>
							<p className="text-muted-foreground text-sm">{category.description}</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{category.permissions.map((permission) => {
								const info = PERMISSION_INFO[permission];
								const isEnabled = isPermissionEnabled(permission);
								const isCustom = isPermissionCustom(permission);
								const roleHasPerm = roleConfig.permissions.includes(permission);

								return (
									<div
										className="flex items-start justify-between gap-4 rounded-lg border p-4"
										key={permission}
									>
										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<Label className="text-sm font-medium" htmlFor={permission}>
													{info.label}
												</Label>
												{isCustom && (
													<Tooltip>
														<TooltipTrigger>
															<Badge
																className="text-xs"
																variant={isEnabled ? "default" : "secondary"}
															>
																Custom
															</Badge>
														</TooltipTrigger>
														<TooltipContent>
															<p className="max-w-xs text-xs">
																This permission has been customized. Role default:{" "}
																{roleHasPerm ? "Enabled" : "Disabled"}
															</p>
														</TooltipContent>
													</Tooltip>
												)}
												{!isCustom && roleHasPerm && (
													<Tooltip>
														<TooltipTrigger>
															<CheckCircle2 className="text-success h-4 w-4" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-xs">Enabled by {roleConfig.label} role</p>
														</TooltipContent>
													</Tooltip>
												)}
											</div>
											<p className="text-muted-foreground text-xs">{info.description}</p>
										</div>
										<div className="flex items-center gap-2">
											{/* Show indicator if using role default */}
											{!isCustom && (
												<span className="text-muted-foreground text-xs">
													{roleHasPerm ? "Role default" : ""}
												</span>
											)}
											<Switch
												checked={isEnabled}
												disabled={isSaving || isOwner}
												id={permission}
												onCheckedChange={(checked) => handlePermissionToggle(permission, checked)}
											/>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				);
			})}

			{/* Permission Summary */}
			<Card className="border-primary/20 bg-primary/5">
				<CardContent className="pt-6">
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<Lock className="text-primary mt-0.5 h-5 w-5 shrink-0" />
							<div className="flex-1 space-y-2">
								<p className="text-sm font-medium">Permission Summary</p>
								<div className="grid gap-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Role:</span>
										<Badge>{roleConfig.label}</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Role Permissions:</span>
										<span className="font-medium">{roleConfig.permissions.length} granted</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Custom Overrides:</span>
										<span className="font-medium">
											{Object.keys(customPermissions).length} active
										</span>
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<span className="font-medium">Total Permissions:</span>
										<span className="text-primary font-bold">
											{
												Object.values(PERMISSION_CATEGORIES)
													.flatMap((c) => c.permissions)
													.filter((p) => isPermissionEnabled(p)).length
											}{" "}
											enabled
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Legend */}
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-3">
						<p className="text-sm font-medium">Legend:</p>
						<div className="grid gap-2 text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="text-success h-4 w-4" />
								<span className="text-muted-foreground">Permission enabled by role</span>
							</div>
							<div className="flex items-center gap-2">
								<Badge className="h-5 text-xs" variant="default">
									Custom
								</Badge>
								<span className="text-muted-foreground">Custom permission override</span>
							</div>
							<div className="flex items-center gap-2">
								<X className="text-muted-foreground h-4 w-4" />
								<span className="text-muted-foreground">Permission disabled</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
