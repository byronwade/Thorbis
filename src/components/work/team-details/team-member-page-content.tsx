"use client";

/**
 * Team Member Page Content - Comprehensive Single Page View
 * All details visible with collapsible sections - matches Job Details pattern
 *
 * Features:
 * - Profile & Contact (editable)
 * - Assigned Jobs
 * - Schedule & Appointments
 * - Time Tracking
 * - Communications
 * - Permissions
 * - Performance Metrics
 * - Activity Log
 * - Notes
 * - Attachments
 */

import {
	Activity,
	Archive,
	Briefcase,
	Building2,
	Calendar,
	Clock,
	FileText,
	Mail,
	MessageSquare,
	Paperclip,
	Phone,
	UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { archiveTeamMember, restoreTeamMember, updateTeamMember } from "@/actions/team";
import { EmailDialog } from "@/components/communication/email-dialog";
import { SMSDialog } from "@/components/communication/sms-dialog";
import { DetailPageContentLayout, type DetailPageHeaderConfig } from "@/components/layout/detail-page-content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { UnifiedAccordionSection } from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";
import { AssignedJobsTable } from "./assigned-jobs-table";
import { TeamScheduleTable } from "./team-schedule-table";
import { TimeEntriesTable } from "./time-entries-table";

type TeamMemberPageContentProps = {
	memberData: {
		member: any;
		user: any;
		role: any;
		department: any;
		assignedJobs: any[];
		schedules: any[];
		timeEntries: any[];
		communications: any[];
		activities: any[];
		notes: any[];
		attachments: any[];
	};
	metrics: {
		activeJobsCount: number;
		hoursThisMonth: number;
		completionRate: number;
		availableHours: number;
		totalTasksCompleted: number;
		totalTasks: number;
		averageHoursPerMonth: number;
	};
};

export function TeamMemberPageContent({ memberData, metrics }: TeamMemberPageContentProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [mounted, setMounted] = useState(false);
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
	const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const {
		member,
		user,
		role,
		department,
		assignedJobs = [],
		schedules = [],
		timeEntries = [],
		communications = [],
		activities = [],
		notes = [],
		attachments = [],
	} = memberData;

	// Determine if member is archived
	const isArchived = Boolean(member.archived_at);

	// Get initials for avatar
	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();

	// Handle archive/unarchive
	const handleArchive = async () => {
		setIsArchiving(true);
		try {
			const result = isArchived ? await restoreTeamMember(member.id) : await archiveTeamMember(member.id);

			if (result.success) {
				toast.success(isArchived ? "Team member unarchived successfully" : "Team member archived successfully");
				router.refresh();
				setIsArchiveDialogOpen(false);
			} else {
				toast.error(result.error || "Failed to archive team member");
			}
		} catch (_error) {
    console.error("Error:", _error);
			toast.error("Failed to archive team member");
		} finally {
			setIsArchiving(false);
		}
	};

	// Group communications by type
	const emailCommunications = communications.filter((c: any) => c.type === "email");
	const smsCommunications = communications.filter((c: any) => c.type === "sms");
	const phoneCommunications = communications.filter((c: any) => c.type === "phone");

	// Header badges
	const headerBadges = [
		<Badge
			key="status"
			variant={member.status === "active" ? "default" : member.status === "invited" ? "secondary" : "destructive"}
		>
			{member.status}
		</Badge>,
		role && (
			<Badge
				key="role"
				style={{ backgroundColor: role.color || undefined }}
				variant={role.color ? "default" : "secondary"}
			>
				{role.name}
			</Badge>
		),
		department && (
			<Badge
				key="department"
				style={{ backgroundColor: department.color || undefined }}
				variant={department.color ? "default" : "outline"}
			>
				{department.name}
			</Badge>
		),
	].filter(Boolean);

	// Save handlers for inline editing
	const _handleSavePhone = async (newValue: string) => {
		const formData = new FormData();
		formData.append("phone", newValue);
		const result = await updateTeamMember(member.id, formData);
		if (result.success) {
			toast.success("Phone updated successfully");
			router.refresh();
			return true;
		}
		toast.error(result.error || "Failed to update phone");
		return false;
	};

	const _handleSaveJobTitle = async (newValue: string) => {
		const formData = new FormData();
		formData.append("job_title", newValue);
		const result = await updateTeamMember(member.id, formData);
		if (result.success) {
			toast.success("Job title updated successfully");
			router.refresh();
			return true;
		}
		toast.error(result.error || "Failed to update job title");
		return false;
	};

	// Metadata items for quick-glance data
	const metadataItems: DetailPageHeaderConfig["metadata"] = [
		{
			label: "Email",
			icon: <Mail className="h-3.5 w-3.5" />,
			value: user?.email || "Not provided",
		},
		{
			label: "Phone",
			icon: <Phone className="h-3.5 w-3.5" />,
			value: member.phone || "Not provided",
		},
		{
			label: "Job Title",
			icon: <Briefcase className="h-3.5 w-3.5" />,
			value: member.job_title || "Not specified",
		},
		{
			label: "Department",
			icon: <Building2 className="h-3.5 w-3.5" />,
			value: department?.name || "Not assigned",
		},
		{
			label: "Active Jobs",
			icon: <UserCheck className="h-3.5 w-3.5" />,
			value: metrics.activeJobsCount.toString(),
			helperText: `${metrics.totalTasks} total assignments`,
		},
		{
			label: "Hours This Month",
			icon: <Clock className="h-3.5 w-3.5" />,
			value: `${metrics.hoursThisMonth.toFixed(1)}h`,
			helperText: `${metrics.completionRate.toFixed(0)}% completion rate`,
		},
		{
			label: "Last Active",
			icon: <Activity className="h-3.5 w-3.5" />,
			value: member.last_active_at ? new Date(member.last_active_at).toLocaleDateString() : "Never",
			helperText: member.last_active_at
				? (() => {
						const diffDays = Math.floor(
							(Date.now() - new Date(member.last_active_at).getTime()) / (1000 * 60 * 60 * 24)
						);
						return diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
					})()
				: undefined,
		},
		{
			label: "Joined",
			icon: <Calendar className="h-3.5 w-3.5" />,
			value: member.joined_at
				? new Date(member.joined_at).toLocaleDateString()
				: member.invited_at
					? `Invited ${new Date(member.invited_at).toLocaleDateString()}`
					: "N/A",
		},
	];

	// Build action buttons
	const primaryActions: ReactNode[] = [];

	// Email button (if user has email and not archived)
	if (mounted && user?.email && !isArchived) {
		primaryActions.push(
			<Tooltip delayDuration={300} key="email">
				<TooltipTrigger asChild>
					<Button aria-label="Send Email" onClick={() => setIsEmailDialogOpen(true)} size="sm" variant="outline">
						<Mail className="size-4" />
						<span className="hidden sm:inline">Email</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent align="end" side="bottom">
					Send email to {user.name || "team member"}
				</TooltipContent>
			</Tooltip>
		);
	}

	// SMS button (if user has phone and not archived)
	if (mounted && member.phone && !isArchived) {
		primaryActions.push(
			<Tooltip delayDuration={300} key="sms">
				<TooltipTrigger asChild>
					<Button aria-label="Send SMS" onClick={() => setIsSMSDialogOpen(true)} size="sm" variant="outline">
						<MessageSquare className="size-4" />
						<span className="hidden sm:inline">SMS</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent align="end" side="bottom">
					Send SMS to {user?.name || "team member"}
				</TooltipContent>
			</Tooltip>
		);
	}

	// Secondary actions
	const secondaryActions: ReactNode[] = [
		<Tooltip delayDuration={300} key="archive">
			<TooltipTrigger asChild>
				<Button
					aria-label={isArchived ? "Unarchive" : "Archive"}
					className="border-destructive/40 text-destructive hover:bg-destructive/10"
					disabled={isArchiving}
					onClick={() => setIsArchiveDialogOpen(true)}
					size="sm"
					variant="outline"
				>
					<Archive className="size-4" />
					<span className="hidden sm:inline">{isArchived ? "Unarchive" : "Archive"}</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent align="end" side="bottom">
				{isArchived
					? "Restore team member access and include in statistics"
					: "Archive this team member and remove from active workflows"}
			</TooltipContent>
		</Tooltip>,
	];

	const headerConfig: DetailPageHeaderConfig = {
		title: user?.name || "Unknown Team Member",
		subtitle: member.job_title || role?.name || "Team Member",
		badges: headerBadges,
		metadata: metadataItems,
		leadingVisual: (
			<Avatar className="size-16 ring-2 ring-border">
				<AvatarImage alt={user?.name || "User"} src={user?.avatar} />
				<AvatarFallback className="text-xl">{getInitials(user?.name || "Unknown")}</AvatarFallback>
			</Avatar>
		),
		actions: mounted && primaryActions.length > 0 ? primaryActions : undefined,
		secondaryActions: mounted && secondaryActions.length > 0 ? secondaryActions : undefined,
	};

	const sections: UnifiedAccordionSection[] = [
		{
			id: "assigned-jobs",
			title: "Assigned Jobs",
			icon: <Briefcase className="size-4" />,
			count: assignedJobs.length,
			actions: (
				<Button onClick={() => toast.info("Assign job functionality coming soon")} size="sm" variant="outline">
					<Briefcase className="mr-2 size-4" />
					Assign Job
				</Button>
			),
			content: (
				<div className="space-y-4">
					{assignedJobs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Briefcase className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No jobs currently assigned</p>
						</div>
					) : (
						<AssignedJobsTable assignments={assignedJobs} />
					)}
				</div>
			),
		},
		{
			id: "schedule",
			title: "Schedule & Appointments",
			icon: <Calendar className="size-4" />,
			count: schedules.length,
			actions: (
				<Button size="sm" variant="outline">
					<Calendar className="mr-2 size-4" />
					New Appointment
				</Button>
			),
			content: (
				<div className="space-y-4">
					{schedules.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Calendar className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No upcoming appointments</p>
						</div>
					) : (
						<TeamScheduleTable schedules={schedules} />
					)}
				</div>
			),
		},
		{
			id: "time-tracking",
			title: "Time Tracking",
			icon: <Clock className="size-4" />,
			count: timeEntries.length,
			actions: (
				<Button size="sm" variant="outline">
					<Clock className="mr-2 size-4" />
					Clock In
				</Button>
			),
			content: (
				<div className="space-y-4">
					{timeEntries.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Clock className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No time entries recorded</p>
						</div>
					) : (
						<TimeEntriesTable timeEntries={timeEntries} />
					)}
				</div>
			),
		},
		{
			id: "communications",
			title: "Communications",
			icon: <MessageSquare className="size-4" />,
			count: communications.length,
			actions: (
				<div className="flex gap-2">
					<Button onClick={() => setIsEmailDialogOpen(true)} size="sm" variant="outline">
						<Mail className="mr-2 size-4" />
						Email
					</Button>
					{member.phone && (
						<Button onClick={() => setIsSMSDialogOpen(true)} size="sm" variant="outline">
							<MessageSquare className="mr-2 size-4" />
							SMS
						</Button>
					)}
				</div>
			),
			content: (
				<div className="space-y-4">
					{communications.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<MessageSquare className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No communications logged</p>
						</div>
					) : (
						<div className="space-y-4">
							{/* Communication Type Tabs */}
							<div className="flex gap-2">
								<Badge variant="outline">
									<Mail className="mr-1 size-3" />
									{emailCommunications.length} Emails
								</Badge>
								<Badge variant="outline">
									<MessageSquare className="mr-1 size-3" />
									{smsCommunications.length} SMS
								</Badge>
								<Badge variant="outline">
									<Phone className="mr-1 size-3" />
									{phoneCommunications.length} Calls
								</Badge>
							</div>

							{/* Recent Communications List */}
							<div className="space-y-2">
								{communications.slice(0, 10).map((comm: any, idx: number) => (
									<div className="flex items-start gap-3 rounded-lg border p-3" key={idx}>
										{comm.type === "email" && <Mail className="mt-0.5 size-4 text-muted-foreground" />}
										{comm.type === "sms" && <MessageSquare className="mt-0.5 size-4 text-muted-foreground" />}
										{comm.type === "phone" && <Phone className="mt-0.5 size-4 text-muted-foreground" />}
										<div className="flex-1 space-y-1">
											<div className="flex items-center justify-between">
												<p className="font-medium text-sm">
													{comm.type === "email" && comm.subject}
													{comm.type === "sms" && "SMS Message"}
													{comm.type === "phone" && "Phone Call"}
												</p>
												<Badge className="text-xs" variant="outline">
													{comm.direction}
												</Badge>
											</div>
											{comm.body && <p className="line-clamp-2 text-muted-foreground text-sm">{comm.body}</p>}
											<p className="text-muted-foreground text-xs">{new Date(comm.created_at).toLocaleString()}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			),
		},
		{
			id: "notes",
			title: "Notes",
			icon: <FileText className="size-4" />,
			count: notes.length,
			actions: (
				<Button size="sm" variant="outline">
					<FileText className="mr-2 size-4" />
					Add Note
				</Button>
			),
			content: (
				<div className="space-y-4">
					{notes.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<FileText className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No notes yet</p>
							<Button className="mt-4" size="sm" variant="outline">
								Add Note
							</Button>
						</div>
					) : (
						<div className="space-y-2">
							{notes.map((note: any, idx: number) => (
								<div className="rounded-lg border p-4" key={idx}>
									<p className="text-sm">{note.content || note.note}</p>
									<div className="mt-2 flex items-center justify-between">
										{note.user && (
											<p className="text-muted-foreground text-xs">by {note.user.name || note.user.email}</p>
										)}
										<p className="text-muted-foreground text-xs">{new Date(note.created_at).toLocaleString()}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			),
		},
		{
			id: "attachments",
			title: "Attachments",
			icon: <Paperclip className="size-4" />,
			count: attachments.length,
			actions: (
				<Button size="sm" variant="outline">
					<Paperclip className="mr-2 size-4" />
					Upload File
				</Button>
			),
			content: (
				<div className="space-y-4">
					{attachments.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Paperclip className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No attachments yet</p>
							<Button className="mt-4" size="sm" variant="outline">
								Upload File
							</Button>
						</div>
					) : (
						<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
							{attachments.map((attachment: any, idx: number) => (
								<div className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent" key={idx}>
									<Paperclip className="size-4 text-muted-foreground" />
									<div className="flex-1 overflow-hidden">
										<p className="truncate font-medium text-sm">{attachment.filename || "Untitled"}</p>
										<p className="text-muted-foreground text-xs">
											{attachment.file_size ? `${(attachment.file_size / 1024).toFixed(1)} KB` : "Unknown size"}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			),
		},
	];

	// Archive notice for beforeContent
	const beforeContent = isArchived ? (
		<div className="rounded-lg border border-warning bg-warning p-4 dark:border-warning dark:bg-warning/20">
			<div className="flex items-center gap-3">
				<Archive className="size-5 text-warning dark:text-warning" />
				<div>
					<p className="font-medium text-warning dark:text-warning">This team member has been archived</p>
					<p className="text-sm text-warning dark:text-warning">
						Archived on {new Date(member.archived_at).toLocaleDateString()}. This member no longer has access and
						doesn't count in team statistics.
					</p>
				</div>
			</div>
		</div>
	) : undefined;

	return (
		<>
			<DetailPageContentLayout
				activities={activities}
				attachments={[]}
				beforeContent={beforeContent}
				customSections={sections}
				defaultOpenSection="assigned-jobs"
				header={headerConfig}
				notes={[]}
				showStandardSections={{
					activities: true,
					notes: false, // Using custom section with action button
					attachments: false, // Using custom section with action button
					relatedItems: false,
				}}
			/>

			{/* Email Dialog */}
			{mounted && user?.email && (
				<EmailDialog
					companyId={member.company_id}
					customerEmail={user.email}
					customerId={member.id}
					customerName={user.name || "Team Member"}
					onOpenChange={setIsEmailDialogOpen}
					open={isEmailDialogOpen}
				/>
			)}

			{/* SMS Dialog */}
			{mounted && member.phone && (
				<SMSDialog
					companyId={member.company_id}
					companyPhones={[]}
					customerId={member.id}
					customerName={user?.name || "Team Member"}
					customerPhone={member.phone}
					onOpenChange={setIsSMSDialogOpen}
					open={isSMSDialogOpen}
				/>
			)}

			{/* Archive Confirmation Dialog */}
			{mounted && (
				<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{isArchived ? "Unarchive" : "Archive"} Team Member</DialogTitle>
							<DialogDescription>
								{isArchived
									? "This will restore the team member's access and include them in team statistics."
									: "This will remove the team member's access and exclude them from team statistics. They can be unarchived later."}
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button disabled={isArchiving} onClick={() => setIsArchiveDialogOpen(false)} variant="outline">
								Cancel
							</Button>
							<Button disabled={isArchiving} onClick={handleArchive} variant={isArchived ? "default" : "destructive"}>
								{isArchiving ? "Processing..." : isArchived ? "Unarchive" : "Archive"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
