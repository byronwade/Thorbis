"use client";

import { ArrowUpRight, Building2, Shield, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import type { TeamMember } from "@/components/work/teams-table";

type TeamMemberStatus = "active" | "invited" | "suspended";

type TeamsKanbanItem = KanbanItemBase & {
	member: TeamMember;
};

const TEAM_COLUMNS: Array<{
	id: TeamMemberStatus;
	name: string;
	accentColor: string;
}> = [
	{ id: "active", name: "Active", accentColor: "#22C55E" },
	{ id: "invited", name: "Invited", accentColor: "#F59E0B" },
	{ id: "suspended", name: "Suspended", accentColor: "#EF4444" },
];

const _columnLabel = new Map(TEAM_COLUMNS.map((column) => [column.id, column.name]));

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

function MemberCard({ item }: { item: TeamsKanbanItem }) {
	const { member } = item;

	return (
		<div className="border-border/70 bg-background rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md">
			<div className="flex items-start gap-3">
				<Avatar className="h-10 w-10">
					<AvatarImage src={member.avatar} />
					<AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<p className="truncate text-sm font-medium">{member.name}</p>
							<p className="text-muted-foreground truncate text-xs">{member.email}</p>
						</div>
						<Link href={`/dashboard/work/team/${member.id}`}>
							<Button className="h-6 w-6" size="icon" type="button" variant="ghost">
								<ArrowUpRight className="h-3 w-3" />
								<span className="sr-only">View member</span>
							</Button>
						</Link>
					</div>

					{member.jobTitle && (
						<p className="text-muted-foreground mt-1 text-xs">{member.jobTitle}</p>
					)}

					<div className="mt-3 flex flex-wrap items-center gap-2">
						{member.roleName && (
							<Badge
								className="text-xs"
								style={{
									backgroundColor: member.roleColor || "#6b7280",
									color: "white",
								}}
								variant="secondary"
							>
								<Shield className="mr-1 h-3 w-3" />
								{member.roleName}
							</Badge>
						)}
						{member.departmentName && (
							<Badge
								className="text-xs"
								style={{
									backgroundColor: member.departmentColor || "#6b7280",
									color: "white",
								}}
								variant="outline"
							>
								<Building2 className="mr-1 h-3 w-3" />
								{member.departmentName}
							</Badge>
						)}
					</div>

					<div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
						<User className="h-3 w-3" />
						<span>Joined {member.joinedDate}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export function TeamsKanban({ members }: { members: TeamMember[] }) {
	return (
		<EntityKanban<TeamMember, TeamMemberStatus>
			columns={TEAM_COLUMNS}
			data={members}
			entityName="members"
			mapToKanbanItem={(member) => ({
				id: member.id,
				columnId: member.status,
				entity: member,
				member,
			})}
			renderCard={(item) => (
				<MemberCard item={{ ...item, member: item.entity } as TeamsKanbanItem} />
			)}
			renderDragOverlay={(item) => (
				<div className="border-border/70 bg-background/95 w-[280px] rounded-xl border p-4 shadow-lg">
					<MemberCard item={{ ...item, member: item.entity } as TeamsKanbanItem} />
				</div>
			)}
			updateEntityStatus={(member, newStatus) => ({
				...member,
				status: newStatus,
			})}
		/>
	);
}
