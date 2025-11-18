/**
 * Job Team Section
 * Displays team members assigned to this job
 */

"use client";

import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type JobTeamProps = {
	assignedUser?: any;
	teamAssignments: any[];
	jobId: string;
};

export function JobTeam({
	assignedUser,
	teamAssignments,
	jobId,
}: JobTeamProps) {
	const formatDate = (dateString: string | null) => {
		if (!dateString) {
			return "—";
		}
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (!assignedUser && teamAssignments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Users className="text-muted-foreground mb-4 size-12" />
				<h3 className="mb-2 text-lg font-semibold">No Team Assigned</h3>
				<p className="text-muted-foreground text-sm">
					Assign team members to this job to track who's working on it.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Primary Assigned User */}
			{assignedUser && (
				<>
					<div>
						<Label className="mb-3 block">Primary Assigned</Label>
						<div className="flex items-center gap-4 rounded-md border p-4">
							<Avatar className="size-12">
								<AvatarImage
									alt={`${assignedUser.first_name} ${assignedUser.last_name}`}
									src={assignedUser.avatar_url}
								/>
								<AvatarFallback>
									{assignedUser.first_name?.[0]}
									{assignedUser.last_name?.[0]}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<p className="font-medium">
									{assignedUser.first_name} {assignedUser.last_name}
								</p>
								{assignedUser.email && (
									<p className="text-muted-foreground text-sm">
										{assignedUser.email}
									</p>
								)}
							</div>
							{assignedUser.role && (
								<Badge variant="secondary">{assignedUser.role}</Badge>
							)}
						</div>
					</div>
					{teamAssignments.length > 0 && <Separator />}
				</>
			)}

			{/* Team Assignments */}
			{teamAssignments.length > 0 && (
				<div>
					<Label className="mb-3 block">Team Members</Label>
					<div className="space-y-3">
						{teamAssignments.map((assignment) => {
							const member = assignment.user || assignment.team_member;
							if (!member) {
								return null;
							}

							return (
								<div
									className="flex items-center gap-4 rounded-md border p-4"
									key={assignment.id}
								>
									<Avatar className="size-10">
										<AvatarImage
											alt={`${member.first_name} ${member.last_name}`}
											src={member.avatar_url}
										/>
										<AvatarFallback>
											{member.first_name?.[0]}
											{member.last_name?.[0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium">
											{member.first_name} {member.last_name}
										</p>
										<p className="text-muted-foreground text-xs">
											Assigned{" "}
											{formatDate(
												assignment.created_at || assignment.assigned_at,
											)}
										</p>
									</div>
									{(assignment.role || member.role) && (
										<Badge variant="outline">
											{assignment.role || member.role}
										</Badge>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Summary */}
			<div className="bg-muted/50 rounded-md p-4">
				<p className="text-sm font-medium">Total Team Members</p>
				<p className="text-muted-foreground text-xs">
					{(assignedUser ? 1 : 0) + teamAssignments.length} member
					{(assignedUser ? 1 : 0) + teamAssignments.length !== 1 ? "s" : ""}
				</p>
			</div>
		</div>
	);
}
