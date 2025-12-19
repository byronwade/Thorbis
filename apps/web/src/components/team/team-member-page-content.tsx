/**
 * Team Member Page Content - Comprehensive Single Page View
 * Matches customer and job details page structure with collapsible sections
 */

"use client";

import type { LucideIcon } from "lucide-react";
import {
	Archive,
	Award,
	Briefcase,
	Building2,
	Calendar,
	Clock,
	DollarSign,
	Download,
	Home,
	Mail,
	MapPin,
	MoreVertical,
	Phone,
	Plus,
	Printer,
	Save,
	Settings,
	Share2,
	Shield,
	TrendingUp,
	User,
	UserCog,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { updateTeamMember } from "@/actions/team";
import {
	DetailPageContentLayout,
	type DetailPageHeaderConfig,
} from "@/components/layout/detail-page-content-layout";
import { DetailPageSurface } from "@/components/layout/detail-page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatters";
import { useToolbarActionsStore } from "@/lib/stores/toolbar-actions-store";
import { cn } from "@/lib/utils";

export type TeamMemberData = {
	teamMember: any;
	user?: any;
	assignedJobs?: any[];
	timeEntries?: any[];
	certifications?: any[];
	activities?: any[];
	attachments?: any[];
	permissions?: any[];
};

export type TeamMemberPageContentProps = {
	entityData: TeamMemberData;
	metrics: any;
};

export function TeamMemberPageContent({
	entityData,
	metrics,
}: TeamMemberPageContentProps) {
	const router = useRouter();
	const { toast } = useToast();
	const pathname = usePathname();
	const [localMember, setLocalMember] = useState(entityData.teamMember);
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);
	const setToolbarActions = useToolbarActionsStore((state) => state.setActions);

	// Prevent hydration mismatch by only rendering Radix components after mount
	// Extract data before hooks
	const {
		teamMember,
		user,
		assignedJobs = [],
		timeEntries = [],
		certifications = [],
		activities = [],
		attachments = [],
		permissions = [],
	} = entityData;

	// Handle field changes
	const handleFieldChange = (field: string, value: any) => {
		setLocalMember((prev: any) => ({
			...prev,
			[field]: value,
		}));
		setHasChanges(true);
	};

	const displayName = useMemo(
		() =>
			user?.name ||
			localMember?.name ||
			teamMember?.name ||
			`${user?.email || "Unknown User"}`,
		[user, localMember, teamMember],
	);

	const memberStatus = (
		localMember?.status ||
		teamMember?.status ||
		"active"
	)?.toLowerCase();

	const roleName =
		localMember?.role?.name ||
		teamMember?.role?.name ||
		localMember?.job_title ||
		teamMember?.job_title ||
		"Team Member";

	const departmentName =
		localMember?.department?.name || teamMember?.department?.name || null;

	const memberSince =
		localMember?.joined_at ??
		teamMember?.joined_at ??
		localMember?.created_at ??
		teamMember?.created_at ??
		null;

	const lastActive =
		localMember?.last_active_at ?? teamMember?.last_active_at ?? null;

	// Save changes
	const handleSave = async () => {
		setIsSaving(true);
		try {
			// Build FormData with team member fields
			const formData = new FormData();

			// Display name (updates user profile)
			if (localMember.name) {
				formData.append("name", localMember.name);
			}

			// Basic info
			if (localMember.phone !== undefined) {
				formData.append("phone", localMember.phone || "");
			}
			if (localMember.job_title !== undefined) {
				formData.append("job_title", localMember.job_title || "");
			}

			// Emergency Contact
			if (localMember.emergency_contact_name !== undefined) {
				formData.append(
					"emergency_contact_name",
					localMember.emergency_contact_name || "",
				);
			}
			if (localMember.emergency_contact_phone !== undefined) {
				formData.append(
					"emergency_contact_phone",
					localMember.emergency_contact_phone || "",
				);
			}
			if (localMember.emergency_contact_relationship !== undefined) {
				formData.append(
					"emergency_contact_relationship",
					localMember.emergency_contact_relationship || "",
				);
			}

			// Employment Details
			if (localMember.employee_id !== undefined) {
				formData.append("employee_id", localMember.employee_id || "");
			}
			if (localMember.hire_date !== undefined) {
				formData.append("hire_date", localMember.hire_date || "");
			}
			if (localMember.employment_type !== undefined) {
				formData.append("employment_type", localMember.employment_type || "");
			}
			if (localMember.work_schedule !== undefined) {
				formData.append("work_schedule", localMember.work_schedule || "");
			}
			if (localMember.work_location !== undefined) {
				formData.append("work_location", localMember.work_location || "");
			}

			// Notes
			if (localMember.notes !== undefined) {
				formData.append("notes", localMember.notes || "");
			}

			const result = await updateTeamMember(teamMember.id, formData);

			if (result.success) {
				toast.success("Team member updated successfully");
				setHasChanges(false);
				router.refresh();
			} else {
				toast.error(result.error || "Failed to update team member");
			}
		} catch (_error) {
			toast.error("Failed to update team member");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setLocalMember(teamMember);
		setHasChanges(false);
	};

	// Export team member data as CSV
	const handleExport = () => {
		const csv = [
			["Field", "Value"].join(","),
			["Name", user?.name || displayName].join(","),
			["Email", user?.email || ""].join(","),
			["Phone", teamMember?.phone || ""].join(","),
			["Role", roleName].join(","),
			["Department", departmentName || ""].join(","),
			["Status", memberStatus].join(","),
			["Job Title", teamMember?.job_title || ""].join(","),
			["Employee ID", teamMember?.employee_id || ""].join(","),
			["Hire Date", teamMember?.hire_date || ""].join(","),
			["Employment Type", teamMember?.employment_type || ""].join(","),
			["Work Location", teamMember?.work_location || ""].join(","),
		].join("\n");

		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `team-member-${teamMember.id}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("Team member data exported");
	};

	// Print team member profile
	const handlePrint = () => {
		window.print();
	};

	// Share team member link
	const handleShare = async () => {
		const url = `${window.location.origin}/dashboard/work/team/${teamMember.id}`;
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Profile link copied to clipboard");
		} catch (_error) {
			toast.error("Failed to copy link");
		}
	};

	// Execute archive team member
	const executeArchive = async () => {
		setShowArchiveDialog(false);
		try {
			const { archiveTeamMember } = await import("@/actions/team");
			const result = await archiveTeamMember(teamMember.id);
			if (result.success) {
				toast.success("Team member archived successfully");
				router.push("/dashboard/work/team");
			} else {
				toast.error(result.error || "Failed to archive team member");
			}
		} catch (_error) {
			toast.error("Failed to archive team member");
		}
	};

	// Archive team member - opens confirmation dialog
	const handleArchive = () => {
		setShowArchiveDialog(true);
	};

	// Get status badge variant
	const getStatusBadgeVariant = (
		status: string,
	): "default" | "secondary" | "destructive" => {
		switch (status) {
			case "active":
				return "default";
			case "invited":
				return "secondary";
			case "suspended":
			case "inactive":
				return "destructive";
			default:
				return "secondary";
		}
	};

	const headerBadges = [
		<Badge className="font-mono" key="identifier" variant="outline">
			#{teamMember?.id?.slice(0, 8).toUpperCase() || "MEMBER"}
		</Badge>,
		<Badge
			key="status"
			variant={getStatusBadgeVariant(memberStatus || "active")}
		>
			{memberStatus === "active"
				? "Active"
				: memberStatus === "invited"
					? "Invited"
					: memberStatus === "suspended"
						? "Suspended"
						: "Inactive"}
		</Badge>,
		localMember?.role?.name ? (
			<Badge
				key="role"
				style={{
					backgroundColor: localMember.role.color || undefined,
				}}
				variant={localMember.role.color ? "default" : "secondary"}
			>
				{localMember.role.name}
			</Badge>
		) : teamMember?.role?.name ? (
			<Badge
				key="role"
				style={{
					backgroundColor: teamMember.role.color || undefined,
				}}
				variant={teamMember.role.color ? "default" : "secondary"}
			>
				{teamMember.role.name}
			</Badge>
		) : null,
		departmentName ? (
			<Badge key="department" variant="outline">
				<Building2 className="mr-1 h-3 w-3" /> {departmentName}
			</Badge>
		) : null,
	].filter(Boolean);

	const quickActionConfigs = [
		{
			key: "assign-job",
			label: "Assign Job",
			icon: Wrench,
			onClick: () =>
				router.push(`/dashboard/work/new?teamMemberId=${teamMember.id}`),
		},
		{
			key: "view-schedule",
			label: "View Schedule",
			icon: Calendar,
			variant: "secondary" as const,
			onClick: () =>
				router.push(`/dashboard/schedule?teamMemberId=${teamMember.id}`),
		},
		{
			key: "edit-permissions",
			label: "Edit Permissions",
			icon: Shield,
			variant: "outline" as const,
			onClick: () =>
				router.push(`/dashboard/settings/team/${teamMember.id}#permissions`),
		},
	] as const;

	const renderQuickActions = () =>
		quickActionConfigs.map((config) => {
			const { key, label, icon: Icon, onClick } = config;
			const variant = "variant" in config ? config.variant : undefined;
			return (
				<Button
					key={key}
					onClick={onClick}
					size="sm"
					variant={variant ?? "default"}
				>
					<Icon className="mr-2 h-4 w-4" />
					{label}
				</Button>
			);
		});

	const getToolbarActions = useCallback(() => {
		if (hasChanges) {
			return (
				<div className="flex items-center gap-1.5">
					<Button disabled={isSaving} onClick={handleSave} size="sm">
						<Save className="mr-2 h-4 w-4" />
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
					<Button onClick={handleCancel} size="sm" variant="outline">
						Cancel
					</Button>
				</div>
			);
		}
		return (
			<div className="flex items-center gap-1.5">
				{renderQuickActions()}
				<Separator className="h-6" orientation="vertical" />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-8 w-8" size="icon" variant="outline">
							<MoreVertical className="size-4" />
							<span className="sr-only">More actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
							Actions
						</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={() =>
								router.push(`/dashboard/settings/team/${teamMember.id}`)
							}
						>
							<UserCog className="mr-2 size-3.5" />
							Edit Full Profile
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={handleExport}>
							<Download className="mr-2 size-3.5" />
							Export to CSV
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handlePrint}>
							<Printer className="mr-2 size-3.5" />
							Print Profile
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleShare}>
							<Share2 className="mr-2 size-3.5" />
							Share Profile Link
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={handleArchive}
						>
							<Archive className="mr-2 size-3.5" />
							Archive Member
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		);
	}, [
		hasChanges,
		isSaving,
		handleSave,
		handleCancel,
		handleExport,
		handlePrint,
		handleShare,
		handleArchive,
		renderQuickActions,
		router,
		teamMember.id,
	]);

	// Update toolbar actions when hasChanges or isSaving changes
	useEffect(() => {
		if (pathname) {
			setToolbarActions(pathname, getToolbarActions());
		}
	}, [pathname, setToolbarActions, getToolbarActions]);

	const metadataItems: DetailPageHeaderConfig["metadata"] = [
		{
			label: "Active Jobs",
			icon: <Wrench className="h-3.5 w-3.5" />,
			value: metrics?.activeJobs ?? 0,
			helperText: "Currently assigned",
		},
		{
			label: "Total Jobs",
			icon: <TrendingUp className="h-3.5 w-3.5" />,
			value: metrics?.totalJobs ?? assignedJobs.length,
			helperText: "All time",
		},
		{
			label: "Hours Worked",
			icon: <Clock className="h-3.5 w-3.5" />,
			value: `${Math.floor(metrics?.totalHours ?? 0)}h`,
		},
		{
			label: "Certifications",
			icon: <Award className="h-3.5 w-3.5" />,
			value: metrics?.activeCertifications ?? certifications.length,
			helperText: "Active",
		},
	];

	const subtitleContent = (
		<div className="flex flex-wrap items-center gap-2">
			<span className="inline-flex items-center gap-1">
				<Briefcase className="h-4 w-4" />
				{roleName}
			</span>
			{memberSince ? (
				<>
					<span aria-hidden="true">•</span>
					<span className="inline-flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Joined {formatDate(memberSince, "short")}
					</span>
				</>
			) : null}
			{lastActive ? (
				<>
					<span aria-hidden="true">•</span>
					<span className="text-muted-foreground inline-flex items-center gap-1">
						<Clock className="h-4 w-4" />
						Active {formatDate(lastActive, "relative")}
					</span>
				</>
			) : null}
		</div>
	);

	const avatarInitials = displayName
		.split(" ")
		.map((part: string) => part?.[0])
		.filter(Boolean)
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const headerConfig: DetailPageHeaderConfig = {
		title: displayName,
		subtitle: subtitleContent,
		badges: headerBadges,
		metadata: metadataItems,
		leadingVisual: (
			<Avatar className="h-12 w-12">
				<AvatarImage alt={displayName} src={user?.avatar ?? undefined} />
				<AvatarFallback>{avatarInitials || "TM"}</AvatarFallback>
			</Avatar>
		),
	};

	const contactTileData: Array<{
		key: string;
		icon: LucideIcon;
		label: string;
		value: ReactNode;
		href?: string;
	}> = [
		{
			key: "email",
			icon: Mail,
			label: "Email",
			value: user?.email ?? "Not provided",
			href: user?.email ? `mailto:${user.email}` : undefined,
		},
		{
			key: "phone",
			icon: Phone,
			label: "Phone",
			value: teamMember?.phone ?? user?.phone ?? "Not provided",
			href: teamMember?.phone ? `tel:${teamMember.phone}` : undefined,
		},
		{
			key: "role",
			icon: Briefcase,
			label: "Role",
			value: roleName,
		},
		{
			key: "department",
			icon: Building2,
			label: "Department",
			value: departmentName ?? "Not assigned",
		},
	];

	const metricTileData: Array<{
		key: string;
		icon: LucideIcon;
		label: string;
		value: ReactNode;
	}> = [
		{
			key: "active-jobs",
			icon: Wrench,
			label: "Active Jobs",
			value: metrics?.activeJobs ?? 0,
		},
		{
			key: "completed-jobs",
			icon: TrendingUp,
			label: "Completed",
			value: metrics?.completedJobs ?? 0,
		},
		{
			key: "hours",
			icon: Clock,
			label: "Hours Worked",
			value: `${Math.floor(metrics?.totalHours ?? 0)}h`,
		},
		{
			key: "certifications",
			icon: Award,
			label: "Certifications",
			value: `${metrics?.activeCertifications ?? 0}/${metrics?.totalCertifications ?? 0}`,
		},
	];

	const overviewSurface = (
		<DetailPageSurface padding="lg" variant="muted">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<Label className="text-muted-foreground text-xs font-medium uppercase">
						Display Name
					</Label>
					<Input
						className={cn(
							"border-border/40 bg-background focus-visible:ring-primary/50 h-12 rounded-lg border px-4 text-xl font-semibold shadow-none focus-visible:ring-2 sm:text-2xl",
						)}
						onChange={(e) => handleFieldChange("name", e.target.value)}
						placeholder="Enter member name..."
						value={displayName}
					/>
					<p className="text-muted-foreground text-xs">
						Update how this team member appears across Thorbis. Changes are
						saved when you select Save changes.
					</p>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					{contactTileData.map(({ key, icon: Icon, label, value, href }) => (
						<div
							className="border-border/40 bg-background rounded-lg border px-3 py-3"
							key={key}
						>
							<div className="flex items-center gap-3">
								<Icon className="text-muted-foreground h-4 w-4" />
								<div className="flex flex-col">
									<span className="text-muted-foreground text-xs font-medium uppercase">
										{label}
									</span>
									{href ? (
										<a
											className="text-sm font-semibold hover:underline"
											href={href}
										>
											{value}
										</a>
									) : (
										<span className="text-sm font-semibold">{value}</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{metricTileData.map(({ key, icon: Icon, label, value }) => (
						<div
							className="border-border/40 bg-background rounded-lg border px-3 py-3"
							key={key}
						>
							<div className="flex items-center gap-3">
								<Icon className="text-muted-foreground h-4 w-4" />
								<div className="flex flex-col">
									<span className="text-muted-foreground text-xs font-medium uppercase">
										{label}
									</span>
									<span className="text-sm font-semibold">{value}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</DetailPageSurface>
	);

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [
			{
				id: "personal-info",
				title: "Personal Information",
				icon: <User className="size-4" />,
				defaultOpen: true,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormRow cols={2}>
								<div className="space-y-4">
									<StandardFormField label="Email" htmlFor="email">
										<div className="flex gap-2">
											<Input
												id="email"
												readOnly
												type="email"
												value={user?.email || ""}
											/>
											{user?.email && (
												<Button asChild size="icon" variant="outline">
													<a href={`mailto:${user.email}`}>
														<Mail className="size-4" />
													</a>
												</Button>
											)}
										</div>
									</StandardFormField>

									<StandardFormField label="Phone" htmlFor="phone">
										<div className="flex gap-2">
											<Input
												id="phone"
												onChange={(e) =>
													handleFieldChange("phone", e.target.value)
												}
												type="tel"
												value={localMember.phone || ""}
											/>
											{localMember.phone && (
												<Button asChild size="icon" variant="outline">
													<a href={`tel:${localMember.phone}`}>
														<Phone className="size-4" />
													</a>
												</Button>
											)}
										</div>
									</StandardFormField>
								</div>

								<div className="space-y-4">
									<StandardFormField label="Job Title" htmlFor="job_title">
										<Input
											id="job_title"
											onChange={(e) =>
												handleFieldChange("job_title", e.target.value)
											}
											value={localMember.job_title || ""}
										/>
									</StandardFormField>

									<StandardFormField label="Notes" htmlFor="notes">
										<Textarea
											id="notes"
											onChange={(e) =>
												handleFieldChange("notes", e.target.value)
											}
											placeholder="Internal notes about this team member"
											rows={3}
											value={localMember.notes || ""}
										/>
									</StandardFormField>
								</div>
							</StandardFormRow>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "emergency-contact",
				title: "Emergency Contact",
				icon: <Phone className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormRow cols={3}>
								<StandardFormField
									label="Contact Name"
									htmlFor="emergency_contact_name"
								>
									<Input
										id="emergency_contact_name"
										onChange={(e) =>
											handleFieldChange(
												"emergency_contact_name",
												e.target.value,
											)
										}
										placeholder="Full name"
										value={localMember.emergency_contact_name || ""}
									/>
								</StandardFormField>

								<StandardFormField
									label="Contact Phone"
									htmlFor="emergency_contact_phone"
								>
									<Input
										id="emergency_contact_phone"
										onChange={(e) =>
											handleFieldChange(
												"emergency_contact_phone",
												e.target.value,
											)
										}
										placeholder="(555) 123-4567"
										type="tel"
										value={localMember.emergency_contact_phone || ""}
									/>
								</StandardFormField>

								<StandardFormField
									label="Relationship"
									htmlFor="emergency_contact_relationship"
								>
									<Input
										id="emergency_contact_relationship"
										onChange={(e) =>
											handleFieldChange(
												"emergency_contact_relationship",
												e.target.value,
											)
										}
										placeholder="Spouse, Parent, etc."
										value={localMember.emergency_contact_relationship || ""}
									/>
								</StandardFormField>
							</StandardFormRow>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "employment-details",
				title: "Employment Details",
				icon: <Briefcase className="size-4" />,
				defaultOpen: false,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormRow cols={2}>
								<StandardFormField label="Employee ID" htmlFor="employee_id">
									<Input
										id="employee_id"
										onChange={(e) =>
											handleFieldChange("employee_id", e.target.value)
										}
										placeholder="EMP-001"
										value={localMember.employee_id || ""}
									/>
								</StandardFormField>

								<StandardFormField label="Hire Date" htmlFor="hire_date">
									<Input
										id="hire_date"
										onChange={(e) =>
											handleFieldChange("hire_date", e.target.value)
										}
										type="date"
										value={localMember.hire_date || ""}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormRow cols={2}>
								<StandardFormField
									label="Employment Type"
									htmlFor="employment_type"
								>
									<Input
										id="employment_type"
										onChange={(e) =>
											handleFieldChange("employment_type", e.target.value)
										}
										placeholder="Full Time, Part Time, Contractor"
										value={localMember.employment_type || ""}
									/>
								</StandardFormField>

								<StandardFormField
									label="Work Location"
									htmlFor="work_location"
								>
									<Input
										id="work_location"
										onChange={(e) =>
											handleFieldChange("work_location", e.target.value)
										}
										placeholder="Office, Field, Remote"
										value={localMember.work_location || ""}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormField label="Work Schedule" htmlFor="work_schedule">
								<Textarea
									id="work_schedule"
									onChange={(e) =>
										handleFieldChange("work_schedule", e.target.value)
									}
									placeholder="Mon-Fri 8am-5pm, etc."
									rows={2}
									value={localMember.work_schedule || ""}
								/>
							</StandardFormField>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "compensation",
				title: "Compensation",
				icon: <DollarSign className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormRow cols={2}>
								<StandardFormField label="Pay Type" htmlFor="pay_type">
									<Input
										id="pay_type"
										onChange={(e) =>
											handleFieldChange("pay_type", e.target.value)
										}
										placeholder="Hourly, Salary, Commission"
										value={localMember.pay_type || ""}
									/>
								</StandardFormField>

								<StandardFormField label="Hourly Rate" htmlFor="hourly_rate">
									<Input
										id="hourly_rate"
										onChange={(e) =>
											handleFieldChange("hourly_rate", e.target.value)
										}
										placeholder="25.00"
										type="number"
										step="0.01"
										value={localMember.hourly_rate || ""}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormRow cols={2}>
								<StandardFormField
									label="Annual Salary"
									htmlFor="annual_salary"
								>
									<Input
										id="annual_salary"
										onChange={(e) =>
											handleFieldChange("annual_salary", e.target.value)
										}
										placeholder="50000.00"
										type="number"
										step="0.01"
										value={localMember.annual_salary || ""}
									/>
								</StandardFormField>

								<StandardFormField
									label="Commission Rate (%)"
									htmlFor="commission_rate"
								>
									<Input
										id="commission_rate"
										onChange={(e) =>
											handleFieldChange("commission_rate", e.target.value)
										}
										placeholder="5.00"
										type="number"
										step="0.01"
										value={localMember.commission_rate || ""}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormField
								label="Overtime Eligible"
								htmlFor="overtime_eligible"
							>
								<div className="flex items-center gap-2">
									<input
										id="overtime_eligible"
										type="checkbox"
										checked={localMember.overtime_eligible ?? true}
										onChange={(e) =>
											handleFieldChange("overtime_eligible", e.target.checked)
										}
										className="h-4 w-4"
									/>
									<Label htmlFor="overtime_eligible">
										Employee is eligible for overtime pay
									</Label>
								</div>
							</StandardFormField>

							<StandardFormField
								label="Commission Structure (JSON)"
								htmlFor="commission_structure"
							>
								<Textarea
									id="commission_structure"
									onChange={(e) =>
										handleFieldChange("commission_structure", e.target.value)
									}
									placeholder='{"tiers": [{"min": 0, "max": 10000, "rate": 5}]}'
									rows={3}
									value={
										localMember.commission_structure
											? JSON.stringify(
													localMember.commission_structure,
													null,
													2,
												)
											: ""
									}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									Advanced commission structure in JSON format
								</p>
							</StandardFormField>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "address",
				title: "Address",
				icon: <MapPin className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormField
								label="Street Address"
								htmlFor="street_address"
							>
								<Input
									id="street_address"
									onChange={(e) =>
										handleFieldChange("street_address", e.target.value)
									}
									placeholder="123 Main St"
									value={localMember.street_address || ""}
								/>
							</StandardFormField>

							<StandardFormRow cols={3}>
								<StandardFormField label="City" htmlFor="city">
									<Input
										id="city"
										onChange={(e) => handleFieldChange("city", e.target.value)}
										placeholder="San Francisco"
										value={localMember.city || ""}
									/>
								</StandardFormField>

								<StandardFormField label="State" htmlFor="state">
									<Input
										id="state"
										onChange={(e) => handleFieldChange("state", e.target.value)}
										placeholder="CA"
										value={localMember.state || ""}
									/>
								</StandardFormField>

								<StandardFormField label="Zip Code" htmlFor="postal_code">
									<Input
										id="postal_code"
										onChange={(e) =>
											handleFieldChange("postal_code", e.target.value)
										}
										placeholder="94102"
										value={localMember.postal_code || ""}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormField label="Country" htmlFor="country">
								<Input
									id="country"
									onChange={(e) => handleFieldChange("country", e.target.value)}
									placeholder="US"
									value={localMember.country || "US"}
								/>
							</StandardFormField>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "work-preferences",
				title: "Work Preferences",
				icon: <Settings className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormField label="Skills" htmlFor="skills">
								<Textarea
									id="skills"
									onChange={(e) =>
										handleFieldChange(
											"skills",
											e.target.value.split(",").map((s) => s.trim()),
										)
									}
									placeholder="HVAC, Plumbing, Electrical (comma separated)"
									rows={2}
									value={
										Array.isArray(localMember.skills)
											? localMember.skills.join(", ")
											: ""
									}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									Enter skills separated by commas
								</p>
							</StandardFormField>

							<StandardFormField label="Service Areas" htmlFor="service_areas">
								<Textarea
									id="service_areas"
									onChange={(e) =>
										handleFieldChange(
											"service_areas",
											e.target.value.split(",").map((s) => s.trim()),
										)
									}
									placeholder="San Francisco, Oakland, Berkeley (comma separated)"
									rows={2}
									value={
										Array.isArray(localMember.service_areas)
											? localMember.service_areas.join(", ")
											: ""
									}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									Enter service areas separated by commas
								</p>
							</StandardFormField>

							<StandardFormRow cols={2}>
								<StandardFormField
									label="Max Weekly Hours"
									htmlFor="max_weekly_hours"
								>
									<Input
										id="max_weekly_hours"
										onChange={(e) =>
											handleFieldChange("max_weekly_hours", e.target.value)
										}
										placeholder="40"
										type="number"
										value={localMember.max_weekly_hours || ""}
									/>
								</StandardFormField>

								<StandardFormField
									label="Preferred Job Types"
									htmlFor="preferred_job_types"
								>
									<Input
										id="preferred_job_types"
										onChange={(e) =>
											handleFieldChange(
												"preferred_job_types",
												e.target.value.split(",").map((s) => s.trim()),
											)
										}
										placeholder="Repair, Maintenance, Installation"
										value={
											Array.isArray(localMember.preferred_job_types)
												? localMember.preferred_job_types.join(", ")
												: ""
										}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormField
								label="Availability Schedule (JSON)"
								htmlFor="availability_schedule"
							>
								<Textarea
									id="availability_schedule"
									onChange={(e) =>
										handleFieldChange("availability_schedule", e.target.value)
									}
									placeholder='{"monday": {"start": "08:00", "end": "17:00"}}'
									rows={4}
									value={
										localMember.availability_schedule
											? JSON.stringify(
													localMember.availability_schedule,
													null,
													2,
												)
											: ""
									}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									Weekly availability in JSON format
								</p>
							</StandardFormField>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "performance-tracking",
				title: "Performance Tracking",
				icon: <TrendingUp className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-6">
							<StandardFormRow cols={2}>
								<StandardFormField
									label="Last Review Date"
									htmlFor="last_review_date"
								>
									<Input
										id="last_review_date"
										onChange={(e) =>
											handleFieldChange("last_review_date", e.target.value)
										}
										type="date"
										value={localMember.last_review_date || ""}
									/>
								</StandardFormField>

								<StandardFormField
									label="Next Review Date"
									htmlFor="next_review_date"
								>
									<Input
										id="next_review_date"
										onChange={(e) =>
											handleFieldChange("next_review_date", e.target.value)
										}
										type="date"
										value={localMember.next_review_date || ""}
									/>
								</StandardFormField>
							</StandardFormRow>

							<StandardFormField
								label="Performance Notes"
								htmlFor="performance_notes"
							>
								<Textarea
									id="performance_notes"
									onChange={(e) =>
										handleFieldChange("performance_notes", e.target.value)
									}
									placeholder="Internal performance notes and feedback..."
									rows={6}
									value={localMember.performance_notes || ""}
								/>
								<p className="text-muted-foreground mt-1 text-xs">
									Private notes for manager use only
								</p>
							</StandardFormField>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "certifications",
				title: "Skills & Certifications",
				icon: <Award className="size-4" />,
				count: certifications.length,
				actions: (
					<Button
						onClick={() =>
							toast.info(
								"Certification management is coming soon. This feature is under development.",
							)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> Add Certification
					</Button>
				),
				content: (
					<UnifiedAccordionContent>
						{certifications.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2">
								{certifications.map((cert: any) => (
									<div className="rounded-lg border p-4" key={cert.id}>
										<div className="flex items-center gap-3">
											<div className="bg-primary/10 rounded-md p-2">
												<Award className="text-primary h-4 w-4" />
											</div>
											<div>
												<p className="font-medium">{cert.name}</p>
												<p className="text-muted-foreground text-xs">
													{cert.issuing_organization || "Certification"}
												</p>
											</div>
										</div>
										<div className="mt-3 space-y-1 text-sm">
											{cert.issue_date && (
												<p className="text-muted-foreground">
													Issued: {formatDate(cert.issue_date, "short")}
												</p>
											)}
											{cert.expiry_date && (
												<p
													className={cn(
														"text-muted-foreground",
														new Date(cert.expiry_date) < new Date() &&
															"text-destructive",
													)}
												>
													{new Date(cert.expiry_date) < new Date()
														? "Expired"
														: "Expires"}
													: {formatDate(cert.expiry_date, "short")}
												</p>
											)}
											{cert.credential_id && (
												<p className="text-muted-foreground">
													ID: {cert.credential_id}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
								<Award className="text-muted-foreground h-6 w-6" />
								<p className="text-muted-foreground mt-2 text-sm">
									No certifications on record for this team member yet.
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			{
				id: "assigned-jobs",
				title: "Assigned Jobs",
				icon: <Wrench className="size-4" />,
				count: assignedJobs.length,
				actions: (
					<Button
						onClick={() =>
							router.push(`/dashboard/work/new?teamMemberId=${teamMember.id}`)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-2 h-4 w-4" /> Assign Job
					</Button>
				),
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="text-muted-foreground border-b px-6 py-4 text-sm">
							Jobs currently assigned to this team member.
						</div>
						{assignedJobs.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Job #</TableHead>
										<TableHead>Title</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Scheduled</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{assignedJobs.map((assignment: any) => {
										const job = assignment.job;
										if (!job) {
											return null;
										}

										const customerName =
											job.customer?.display_name ||
											job.customer?.company_name ||
											[job.customer?.first_name, job.customer?.last_name]
												.filter(Boolean)
												.join(" ") ||
											"Unknown Customer";

										return (
											<TableRow key={assignment.id}>
												<TableCell className="font-mono">
													#{job.job_number}
												</TableCell>
												<TableCell>{job.title || "Untitled Job"}</TableCell>
												<TableCell>{customerName}</TableCell>
												<TableCell>
													<Badge variant="outline">{job.status}</Badge>
												</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{job.scheduled_start
														? formatDate(job.scheduled_start, "short")
														: "Not scheduled"}
												</TableCell>
												<TableCell>
													<Button asChild size="sm" variant="ghost">
														<Link href={`/dashboard/work/${job.id}`}>View</Link>
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center">
								<Wrench className="text-muted-foreground/50 mb-3 size-12" />
								<p className="text-muted-foreground text-sm font-medium">
									No jobs currently assigned
								</p>
								<p className="text-muted-foreground mt-1 text-xs">
									Assign jobs to track this member's work
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			{
				id: "time-entries",
				title: "Time Entries",
				icon: <Clock className="size-4" />,
				count: timeEntries.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="text-muted-foreground border-b px-6 py-4 text-sm">
							Recent time entries and clock in/out history.
						</div>
						{timeEntries.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Job</TableHead>
										<TableHead>Clock In</TableHead>
										<TableHead>Clock Out</TableHead>
										<TableHead>Hours</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{timeEntries.slice(0, 20).map((entry: any) => (
										<TableRow key={entry.id}>
											<TableCell>
												{formatDate(entry.clock_in, "short")}
											</TableCell>
											<TableCell>
												{entry.job ? (
													<Link
														className="text-primary hover:underline"
														href={`/dashboard/work/${entry.job.id}`}
													>
														#{entry.job.job_number || "Unknown"}
													</Link>
												) : (
													"No job"
												)}
											</TableCell>
											<TableCell>
												{new Date(entry.clock_in).toLocaleTimeString()}
											</TableCell>
											<TableCell>
												{entry.clock_out ? (
													new Date(entry.clock_out).toLocaleTimeString()
												) : (
													<Badge variant="secondary">In progress</Badge>
												)}
											</TableCell>
											<TableCell>
												{entry.total_hours
													? `${entry.total_hours.toFixed(2)}h`
													: "—"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center">
								<Clock className="text-muted-foreground/50 mb-3 size-12" />
								<p className="text-muted-foreground text-sm font-medium">
									No time entries recorded
								</p>
								<p className="text-muted-foreground mt-1 text-xs">
									Time entries will appear here when work begins
								</p>
							</div>
						)}
					</UnifiedAccordionContent>
				),
			},
			{
				id: "performance",
				title: "Performance Metrics",
				icon: <TrendingUp className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="bg-card rounded-lg border p-4">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 rounded-md p-2">
										<Wrench className="text-primary h-4 w-4" />
									</div>
									<div>
										<p className="text-muted-foreground text-sm">
											Jobs Completed
										</p>
										<p className="mt-1 text-2xl font-bold">
											{metrics?.completedJobs ?? 0}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-card rounded-lg border p-4">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 rounded-md p-2">
										<Clock className="text-primary h-4 w-4" />
									</div>
									<div>
										<p className="text-muted-foreground text-sm">Total Hours</p>
										<p className="mt-1 text-2xl font-bold">
											{Math.floor(metrics?.totalHours ?? 0)}h
										</p>
									</div>
								</div>
							</div>
							<div className="bg-card rounded-lg border p-4">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 rounded-md p-2">
										<TrendingUp className="text-primary h-4 w-4" />
									</div>
									<div>
										<p className="text-muted-foreground text-sm">Active Jobs</p>
										<p className="mt-1 text-2xl font-bold">
											{metrics?.activeJobs ?? 0}
										</p>
									</div>
								</div>
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			},
			{
				id: "permissions",
				title: "Permissions & Access",
				icon: <Shield className="size-4" />,
				count: permissions?.length ?? 0,
				actions: (
					<Button
						onClick={() =>
							router.push(`/dashboard/settings/team/${teamMember.id}`)
						}
						size="sm"
						variant="outline"
					>
						Edit Permissions
					</Button>
				),
				content: (
					<UnifiedAccordionContent>
						<div className="rounded-lg border p-4">
							<p className="text-muted-foreground text-sm">
								Permissions are managed at the role level. This team member has
								the <strong>{roleName}</strong> role
								{departmentName ? (
									<>
										{" "}
										and is assigned to the <strong>{departmentName}</strong>{" "}
										department
									</>
								) : (
									""
								)}
								.
							</p>
							{permissions && permissions.length > 0 && (
								<div className="mt-4">
									<p className="mb-2 text-sm font-medium">
										Role Permissions ({permissions.length}):
									</p>
									<div className="flex flex-wrap gap-2">
										{permissions.slice(0, 10).map((perm: any) => (
											<Badge key={perm.id} variant="secondary">
												{perm.permission_name || perm.name || "Permission"}
											</Badge>
										))}
										{permissions.length > 10 && (
											<Badge variant="outline">
												+{permissions.length - 10} more
											</Badge>
										)}
									</div>
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			},
		];

		return sections;
	}, [
		user,
		localMember,
		teamMember,
		handleFieldChange,
		certifications,
		assignedJobs,
		timeEntries,
		permissions,
		metrics,
		roleName,
		departmentName,
		router,
	]);

	const relatedItems = useMemo(() => {
		const items: any[] = [];

		if (assignedJobs.length > 0) {
			const latestJob = assignedJobs[0]?.job;
			if (latestJob) {
				items.push({
					id: `job-${latestJob.id}`,
					type: "job",
					title: latestJob.title || `Job #${latestJob.job_number}`,
					subtitle: latestJob.status,
					href: `/dashboard/work/${latestJob.id}`,
					badge: latestJob.status
						? { label: latestJob.status, variant: "outline" as const }
						: undefined,
				});
			}
		}

		if (user?.email) {
			items.push({
				id: `user-${teamMember.id}`,
				type: "contact",
				title: "Primary Email",
				subtitle: user.email,
				href: `mailto:${user.email}`,
			});
		}

		return items;
	}, [assignedJobs, teamMember.id, user?.email]);

	return (
		<>
		<DetailPageContentLayout
			activities={activities}
			attachments={attachments}
			beforeContent={overviewSurface}
			customSections={customSections}
			defaultOpenSection="personal-info"
			enableReordering={true}
			header={headerConfig}
			notes={[]}
			relatedItems={relatedItems}
			showStandardSections={{
				notes: false,
			}}
			storageKey="team-member-details"
		/>

		{/* Archive Confirmation Dialog */}
		<AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Archive Team Member?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to archive this team member? They will no longer have access to the system.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						onClick={executeArchive}
					>
						Archive Team Member
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
		</>
	);
}
