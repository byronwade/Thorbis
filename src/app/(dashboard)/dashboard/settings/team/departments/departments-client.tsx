"use client";

import { Building2, Loader2, MoreVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { createDepartment, deleteDepartment } from "@/actions/team";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Department = {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	member_count?: number;
};

type DepartmentsClientProps = {
	initialDepartments: Department[];
};

export function DepartmentsClient({ initialDepartments }: DepartmentsClientProps) {
	const [departments, setDepartments] = useState(initialDepartments);
	const [isCreating, startCreate] = useTransition();
	const [isDeleting, startDelete] = useTransition();
	const [showForm, setShowForm] = useState(false);
	const [newDepartment, setNewDepartment] = useState({
		name: "",
		description: "",
	});
	const { toast } = useToast();

	const totalMembers = departments.reduce((sum, dept) => sum + (dept.member_count ?? 0), 0);

	const handleCreateDepartment = () => {
		startCreate(async () => {
			if (!newDepartment.name.trim()) {
				toast.error("Department name is required");
				return;
			}

			const formData = new FormData();
			formData.append("name", newDepartment.name.trim());
			if (newDepartment.description.trim()) {
				formData.append("description", newDepartment.description.trim());
			}

			const result = await createDepartment(formData);

			if (!result.success) {
				toast.error(result.error || "Failed to create department");
				return;
			}

			if (!result.data) {
				toast.error("Failed to create department");
				return;
			}

			setDepartments((prev) => [
				...prev,
				{
					id: result.data,
					name: newDepartment.name.trim(),
					description: newDepartment.description.trim() || null,
					color: null,
					member_count: 0,
				},
			]);
			setNewDepartment({ name: "", description: "" });
			setShowForm(false);
			toast.success("Department created");
		});
	};

	const handleDelete = (departmentId: string) => {
		startDelete(async () => {
			const result = await deleteDepartment(departmentId);
			if (!result.success) {
				toast.error(result.error || "Failed to delete department");
				return;
			}
			setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
			toast.success("Department deleted");
		});
	};

	const renderDepartmentCard = (dept: Department) => (
		<Card className="group transition-all hover:shadow-md" key={dept.id}>
			<CardHeader>
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3">
						<div
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
							style={{ backgroundColor: `${dept.color ?? "#E4E7EC"}33` }}
						>
							<Building2 className="h-6 w-6" style={{ color: dept.color ?? "var(--primary)" }} />
						</div>
						<div className="min-w-0 flex-1">
							<CardTitle className="text-base">{dept.name}</CardTitle>
							<CardDescription className="text-xs">
								{(dept.member_count ?? 0).toLocaleString()} member
								{(dept.member_count ?? 0) === 1 ? "" : "s"}
							</CardDescription>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="opacity-0 group-hover:opacity-100" size="icon" type="button" variant="ghost">
								<MoreVertical className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem disabled>Edit Department</DropdownMenuItem>
							<DropdownMenuItem disabled>View Members</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								disabled={isDeleting}
								onClick={() => handleDelete(dept.id)}
							>
								<Trash2 className="mr-2 size-4" />
								Delete Department
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			{dept.description && (
				<>
					<Separator />
					<CardContent className="pt-4">
						<p className="text-muted-foreground text-sm">{dept.description}</p>
					</CardContent>
				</>
			)}
		</Card>
	);

	return (
		<SettingsPageLayout
			description="Organize team members into clearly defined departments for permissions, routing, and reporting."
			hasChanges={false}
			helpText="Departments help set approvers, managers, routing rules, and reporting groups."
			isPending={isCreating || isDeleting}
			title="Departments"
		>
			<div className="space-y-6">
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
								<Link href="/dashboard/settings/team">Team & Permissions</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Departments</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<Card>
					<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>Department summary</CardTitle>
							<CardDescription>
								{departments.length
									? `${departments.length} departments • ${totalMembers.toLocaleString()} total members`
									: "No departments yet"}
							</CardDescription>
						</div>
						<Button onClick={() => setShowForm(true)}>
							<Plus className="mr-2 size-4" />
							New Department
						</Button>
					</CardHeader>
					{showForm && (
						<>
							<Separator />
							<CardContent className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<p className="font-medium text-sm">Department name</p>
									<Input
										onChange={(event) =>
											setNewDepartment((prev) => ({
												...prev,
												name: event.target.value,
											}))
										}
										placeholder="e.g., Field Technicians"
										value={newDepartment.name}
									/>
								</div>
								<div className="space-y-2">
									<p className="font-medium text-sm">Description</p>
									<Textarea
										onChange={(event) =>
											setNewDepartment((prev) => ({
												...prev,
												description: event.target.value,
											}))
										}
										placeholder="Optional summary that appears across the workspace"
										rows={3}
										value={newDepartment.description}
									/>
								</div>
								<div className="flex items-center justify-end gap-3 md:col-span-2">
									<Button
										disabled={isCreating}
										onClick={() => {
											setShowForm(false);
											setNewDepartment({ name: "", description: "" });
										}}
										type="button"
										variant="ghost"
									>
										Cancel
									</Button>
									<Button disabled={isCreating} onClick={handleCreateDepartment} type="button">
										{isCreating ? (
											<>
												<Loader2 className="mr-2 size-4 animate-spin" />
												Saving...
											</>
										) : (
											"Create department"
										)}
									</Button>
								</div>
							</CardContent>
						</>
					)}
				</Card>

				{departments.length === 0 ? (
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center gap-3 py-12 text-center">
							<Building2 className="size-8 text-muted-foreground" />
							<div>
								<p className="font-semibold">No departments yet</p>
								<p className="text-muted-foreground text-sm">
									Create your first department to keep permissions and reporting organized.
								</p>
							</div>
							<Button onClick={() => setShowForm(true)}>
								<Plus className="mr-2 size-4" />
								Create Department
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{departments.map((dept) => renderDepartmentCard(dept))}
					</div>
				)}
			</div>
		</SettingsPageLayout>
	);
}

export default DepartmentsClient;
