"use client";

import { ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { createRole, updateRole } from "@/actions/team";
import {
	SettingsInfoBanner,
	SettingsPageLayout,
} from "@/components/settings/settings-page-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type PermissionCategory = {
	id: string;
	label: string;
	description: string;
	permissions: {
		id: string;
		label: string;
		description: string;
	}[];
};

const PERMISSION_CATEGORIES: PermissionCategory[] = [
	{
		id: "jobs",
		label: "Jobs & Scheduling",
		description: "Manage work orders and schedules",
		permissions: [
			{
				id: "jobs.view",
				label: "View jobs",
				description: "View all jobs and schedules",
			},
			{
				id: "jobs.create",
				label: "Create jobs",
				description: "Create new work orders",
			},
			{
				id: "jobs.edit",
				label: "Edit jobs",
				description: "Modify existing jobs",
			},
			{ id: "jobs.delete", label: "Delete jobs", description: "Remove jobs" },
			{
				id: "jobs.assign",
				label: "Assign technicians",
				description: "Assign work to team members",
			},
		],
	},
	{
		id: "customers",
		label: "Customers",
		description: "Customer relationship management",
		permissions: [
			{
				id: "customers.view",
				label: "View customers",
				description: "Access customer information",
			},
			{
				id: "customers.create",
				label: "Create customers",
				description: "Add new customers",
			},
			{
				id: "customers.edit",
				label: "Edit customers",
				description: "Modify customer details",
			},
			{
				id: "customers.delete",
				label: "Delete customers",
				description: "Remove customers",
			},
		],
	},
	{
		id: "invoices",
		label: "Invoices & Payments",
		description: "Financial management",
		permissions: [
			{
				id: "invoices.view",
				label: "View invoices",
				description: "See all invoices and payments",
			},
			{
				id: "invoices.create",
				label: "Create invoices",
				description: "Generate new invoices",
			},
			{
				id: "invoices.edit",
				label: "Edit invoices",
				description: "Modify invoices",
			},
			{
				id: "invoices.delete",
				label: "Delete invoices",
				description: "Remove invoices",
			},
			{
				id: "invoices.process_payments",
				label: "Process payments",
				description: "Handle payment transactions",
			},
		],
	},
	{
		id: "team",
		label: "Team Management",
		description: "User and permission management",
		permissions: [
			{ id: "team.view", label: "View team", description: "See team members" },
			{
				id: "team.invite",
				label: "Invite members",
				description: "Add new team members",
			},
			{
				id: "team.edit",
				label: "Edit members",
				description: "Modify team member details",
			},
			{
				id: "team.remove",
				label: "Remove members",
				description: "Remove team members",
			},
			{
				id: "team.manage_roles",
				label: "Manage roles",
				description: "Create and edit custom roles",
			},
		],
	},
	{
		id: "reports",
		label: "Reports & Analytics",
		description: "Business insights and data",
		permissions: [
			{
				id: "reports.view",
				label: "View reports",
				description: "Access analytics and reports",
			},
			{
				id: "reports.export",
				label: "Export data",
				description: "Download reports and data",
			},
		],
	},
	{
		id: "settings",
		label: "Company Settings",
		description: "System configuration",
		permissions: [
			{
				id: "settings.view",
				label: "View settings",
				description: "Access company settings",
			},
			{
				id: "settings.edit",
				label: "Edit settings",
				description: "Modify company configuration",
			},
			{
				id: "settings.billing",
				label: "Manage billing",
				description: "Access billing and subscription",
			},
		],
	},
];

const DEFAULT_COLOR = "#3b82f6";

type PermissionMap = Record<string, boolean>;

const buildPermissionMap = (selected: string[]): PermissionMap => {
	const allPermissions = PERMISSION_CATEGORIES.flatMap((category) =>
		category.permissions.map((permission) => permission.id),
	);

	return allPermissions.reduce<PermissionMap>((acc, permissionId) => {
		acc[permissionId] = selected.includes(permissionId);
		return acc;
	}, {});
};

type RoleDetailClientProps = {
	initialRole: {
		id?: string;
		name: string;
		description?: string;
		color: string;
		permissions: string[];
		isSystem: boolean;
	};
	mode: "create" | "edit";
};

export default function RoleDetailClient({
	initialRole,
	mode,
}: RoleDetailClientProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [formState, setFormState] = useState({
		name: initialRole.name,
		description: initialRole.description ?? "",
		color: initialRole.color || DEFAULT_COLOR,
		permissions: buildPermissionMap(initialRole.permissions),
	});
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		setFormState({
			name: initialRole.name,
			description: initialRole.description ?? "",
			color: initialRole.color || DEFAULT_COLOR,
			permissions: buildPermissionMap(initialRole.permissions),
		});
		setHasChanges(false);
	}, [initialRole]);

	const isEditable = mode === "create" || !initialRole.isSystem;
	const selectedPermissions = useMemo(
		() =>
			Object.entries(formState.permissions)
				.filter(([, enabled]) => enabled)
				.map(([permissionId]) => permissionId),
		[formState.permissions],
	);

	const updateForm = (updates: Partial<typeof formState>) => {
		setFormState((prev) => ({ ...prev, ...updates }));
		setHasChanges(true);
	};

	const handlePermissionToggle = (permissionId: string, checked: boolean) => {
		updateForm({
			permissions: {
				...formState.permissions,
				[permissionId]: checked,
			},
		});
	};

	const handleSave = () => {
		if (!isEditable) {
			return;
		}

		if (!formState.name.trim()) {
			toast.error("Role name is required");
			return;
		}

		if (selectedPermissions.length === 0) {
			toast.error("Select at least one permission");
			return;
		}

		startTransition(async () => {
			const formData = new FormData();
			formData.append("name", formState.name.trim());
			if (formState.description?.trim()) {
				formData.append("description", formState.description.trim());
			}
			formData.append("color", formState.color || DEFAULT_COLOR);
			formData.append("permissions", selectedPermissions.join(","));

			const result =
				mode === "create"
					? await createRole(formData)
					: await updateRole(initialRole.id as string, formData);

			if (!result.success) {
				toast.error(result.error ?? "Failed to save role");
				return;
			}

			toast.success(
				mode === "create"
					? "Role created successfully"
					: "Role updated successfully",
			);
			setHasChanges(false);

			if (mode === "create" && result.data) {
				router.replace(`/dashboard/settings/team/roles/${result.data}`);
				router.refresh();
				return;
			}

			router.refresh();
		});
	};

	const handleCancel = () => {
		setFormState({
			name: initialRole.name,
			description: initialRole.description ?? "",
			color: initialRole.color || DEFAULT_COLOR,
			permissions: buildPermissionMap(initialRole.permissions),
		});
		setHasChanges(false);
	};

	return (
		<SettingsPageLayout
			description="Create custom roles to align permissions with your team structure."
			hasChanges={isEditable && hasChanges}
			helpText={
				mode === "create"
					? "Roles control access to every area of Thorbis."
					: undefined
			}
			isPending={isPending}
			onCancel={handleCancel}
			onSave={isEditable ? handleSave : undefined}
			saveButtonText={mode === "create" ? "Create role" : "Save changes"}
			title={mode === "create" ? "Create Role" : "Role Details"}
		>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings">Settings</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings/team">
										Team & Permissions
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings/team/roles">Roles</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>
									{mode === "create" ? "New Role" : formState.name || "Role"}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild variant="ghost">
						<Link href="/dashboard/settings/team/roles">
							<ArrowLeft className="mr-2 size-4" />
							Back to roles
						</Link>
					</Button>
				</div>

				{!isEditable && (
					<SettingsInfoBanner
						description="System roles cannot be edited. Create a custom role if you need a different permission mix."
						icon={Palette}
						title="View only"
						variant="amber"
					/>
				)}

				<Card>
					<CardHeader>
						<CardTitle>Role details</CardTitle>
						<CardDescription>
							Basic information that appears in team settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="roleName">Role name</Label>
								<Input
									disabled={!isEditable}
									id="roleName"
									onChange={(event) => updateForm({ name: event.target.value })}
									placeholder="e.g., Field Supervisor"
									value={formState.name}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="roleColor">Color</Label>
								<div className="flex gap-2">
									<Input
										className="w-20"
										disabled={!isEditable}
										id="roleColor"
										onChange={(event) =>
											updateForm({ color: event.target.value })
										}
										type="color"
										value={formState.color}
									/>
									<div className="flex flex-1 items-center gap-2">
										<div
											className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
											style={{ backgroundColor: formState.color }}
										>
											<Palette className="h-4 w-4" />
										</div>
										<Input disabled value={formState.color} />
									</div>
								</div>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="roleDescription">Description</Label>
							<Textarea
								disabled={!isEditable}
								id="roleDescription"
								onChange={(event) =>
									updateForm({ description: event.target.value })
								}
								placeholder="What can this role do?"
								rows={3}
								value={formState.description}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Permissions</CardTitle>
						<CardDescription>
							Toggle the capabilities this role should have
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{PERMISSION_CATEGORIES.map((category, categoryIndex) => (
							<div key={category.id}>
								<div className="mb-4">
									<h3 className="font-medium text-sm">{category.label}</h3>
									<p className="text-muted-foreground text-xs">
										{category.description}
									</p>
								</div>
								<div className="space-y-3 pl-4">
									{category.permissions.map((permission) => (
										<div className="flex items-start gap-3" key={permission.id}>
											<Switch
												checked={formState.permissions[permission.id]}
												disabled={!isEditable}
												id={permission.id}
												onCheckedChange={(checked) =>
													handlePermissionToggle(permission.id, checked)
												}
											/>
											<div className="flex-1">
												<Label
													className={cn(
														"cursor-pointer font-medium text-sm",
														!isEditable && "cursor-not-allowed opacity-70",
													)}
													htmlFor={permission.id}
												>
													{permission.label}
												</Label>
												<p className="text-muted-foreground text-xs">
													{permission.description}
												</p>
											</div>
										</div>
									))}
								</div>
								{categoryIndex < PERMISSION_CATEGORIES.length - 1 && (
									<Separator className="mt-6" />
								)}
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</SettingsPageLayout>
	);
}
