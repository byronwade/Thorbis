"use client";

import { ArrowLeft, Mail, Plus, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { inviteTeamMember } from "@/actions/team";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type RoleOption = {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	member_count?: number;
};

type DepartmentOption = {
	id: string;
	name: string;
	description: string | null;
	member_count?: number;
};

type InviteRow = {
	email: string;
	firstName: string;
	lastName: string;
	roleName: string;
	departmentId: string;
	jobTitle: string;
};

const EMPTY_INVITE: InviteRow = {
	email: "",
	firstName: "",
	lastName: "",
	roleName: "",
	departmentId: "",
	jobTitle: "",
};

type InviteClientProps = {
	roles: RoleOption[];
	departments: DepartmentOption[];
};

export function InviteMembersClient({ roles, departments }: InviteClientProps) {
	const [invites, setInvites] = useState<InviteRow[]>([{ ...EMPTY_INVITE }]);
	const [hasChanges, setHasChanges] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const totalSeats = invites.length;

	const roleOptions = useMemo(() => roles.map((role) => role.name), [roles]);

	const addInviteRow = () => {
		setInvites((prev) => [...prev, { ...EMPTY_INVITE }]);
		setHasChanges(true);
	};

	const removeInviteRow = (index: number) => {
		setInvites((prev) => prev.filter((_, idx) => idx !== index));
		setHasChanges(true);
	};

	const updateInvite = <K extends keyof InviteRow>(
		index: number,
		field: K,
		value: InviteRow[K],
	) => {
		setInvites((prev) => {
			const next = [...prev];
			next[index] = { ...next[index], [field]: value };
			return next;
		});
		setHasChanges(true);
	};

	const resetInvites = () => {
		setInvites([{ ...EMPTY_INVITE }]);
		setHasChanges(false);
	};

	const handleSendInvites = () => {
		startTransition(async () => {
			if (!invites.length) {
				toast.error("Add at least one team member to invite.");
				return;
			}

			for (const invite of invites) {
				if (
					!(
						invite.email.trim() &&
						invite.firstName.trim() &&
						invite.lastName.trim() &&
						invite.roleName.trim()
					)
				) {
					toast.error("Email, first name, last name, and role are required.");
					return;
				}
			}

			let successCount = 0;
			let failureCount = 0;

			for (const invite of invites) {
				const formData = new FormData();
				formData.append("email", invite.email.trim());
				formData.append("firstName", invite.firstName.trim());
				formData.append("lastName", invite.lastName.trim());
				formData.append("role", invite.roleName);
				if (invite.departmentId) {
					formData.append("department", invite.departmentId);
				}

				const result = await inviteTeamMember(formData);
				if (result.success) {
					successCount += 1;
				} else {
					failureCount += 1;
				}
			}

			if (successCount) {
				toast.success(
					`Sent ${successCount} invitation${successCount > 1 ? "s" : ""}.`,
				);
				resetInvites();
			}
			if (failureCount) {
				toast.error(
					`Failed to send ${failureCount} invitation${failureCount > 1 ? "s" : ""}.`,
				);
			}
		});
	};

	return (
		<SettingsPageLayout
			description="Send secure invitations to new teammates and assign their starting permissions."
			hasChanges={hasChanges}
			helpText="Roles control access to features. Departments help with routing, reporting, and approvals."
			isPending={isPending}
			onCancel={resetInvites}
			onSave={handleSendInvites}
			saveButtonText={`Send ${totalSeats} Invitation${totalSeats === 1 ? "" : "s"}`}
			title="Invite Team Members"
		>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
								<BreadcrumbPage>Invite</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild size="sm" variant="ghost">
						<Link href="/dashboard/settings/team">
							<ArrowLeft className="mr-2 size-4" />
							Back to team
						</Link>
					</Button>
				</div>

				<Card className="border-primary/40 bg-primary/5">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
								<Mail className="text-primary h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-base">
									How invitations work
								</CardTitle>
								<CardDescription className="text-xs">
									Each teammate receives an email with a secure link to create
									their account. They start with the role and department you
									assign here.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserPlus className="h-5 w-5" />
							Team member details
						</CardTitle>
						<CardDescription>
							Add one or more teammates. Roles are required; departments are
							optional.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8">
						{invites.map((invite, index) => (
							<div key={`invite-${index}`}>
								{index > 0 && <Separator className="my-6" />}
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium">Member {index + 1}</p>
									{invites.length > 1 && (
										<Button
											onClick={() => removeInviteRow(index)}
											size="sm"
											type="button"
											variant="ghost"
										>
											<Trash2 className="mr-2 size-4" />
											Remove
										</Button>
									)}
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<p className="text-sm font-medium">
											Email address <span className="text-destructive">*</span>
										</p>
										<Input
											onChange={(event) =>
												updateInvite(index, "email", event.target.value)
											}
											placeholder="teammate@company.com"
											type="email"
											value={invite.email}
										/>
									</div>
									<div className="space-y-2">
										<p className="text-sm font-medium">Job title (optional)</p>
										<Input
											onChange={(event) =>
												updateInvite(index, "jobTitle", event.target.value)
											}
											placeholder="e.g., Senior Technician"
											value={invite.jobTitle}
										/>
									</div>
									<div className="space-y-2">
										<p className="text-sm font-medium">
											First name <span className="text-destructive">*</span>
										</p>
										<Input
											onChange={(event) =>
												updateInvite(index, "firstName", event.target.value)
											}
											placeholder="First name"
											value={invite.firstName}
										/>
									</div>
									<div className="space-y-2">
										<p className="text-sm font-medium">
											Last name <span className="text-destructive">*</span>
										</p>
										<Input
											onChange={(event) =>
												updateInvite(index, "lastName", event.target.value)
											}
											placeholder="Last name"
											value={invite.lastName}
										/>
									</div>
									<div className="space-y-2">
										<p className="text-sm font-medium">
											Role <span className="text-destructive">*</span>
										</p>
										<Select
											onValueChange={(value) =>
												updateInvite(index, "roleName", value)
											}
											value={invite.roleName}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
											<SelectContent>
												{roleOptions.map((roleName) => (
													<SelectItem key={roleName} value={roleName}>
														{roleName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<p className="text-sm font-medium">Department (optional)</p>
										<Select
											onValueChange={(value) =>
												updateInvite(index, "departmentId", value)
											}
											value={invite.departmentId}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a department" />
											</SelectTrigger>
											<SelectContent>
												{departments.map((dept) => (
													<SelectItem key={dept.id} value={dept.id}>
														{dept.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						))}
						<Button onClick={addInviteRow} type="button" variant="outline">
							<Plus className="mr-2 size-4" />
							Add another member
						</Button>
					</CardContent>
				</Card>
			</div>
		</SettingsPageLayout>
	);
}

export default InviteMembersClient;
