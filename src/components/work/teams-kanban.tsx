"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  type KanbanItemBase,
} from "@/components/ui/shadcn-io/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Building2, Shield, User } from "lucide-react";
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

const columnLabel = new Map(
  TEAM_COLUMNS.map((column) => [column.id, column.name])
);

function createItems(members: TeamMember[]): TeamsKanbanItem[] {
  return members.map((member) => ({
    id: member.id,
    columnId: member.status,
    member,
  }));
}

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
    <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="text-xs">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-medium text-sm">{member.name}</p>
              <p className="truncate text-muted-foreground text-xs">
                {member.email}
              </p>
            </div>
            <Link href={`/dashboard/work/team/${member.id}`}>
              <Button
                className="h-6 w-6"
                size="icon"
                type="button"
                variant="ghost"
              >
                <ArrowUpRight className="h-3 w-3" />
                <span className="sr-only">View member</span>
              </Button>
            </Link>
          </div>

          {member.jobTitle && (
            <p className="mt-1 text-muted-foreground text-xs">
              {member.jobTitle}
            </p>
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

          <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
            <User className="h-3 w-3" />
            <span>Joined {member.joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamsKanban({ members }: { members: TeamMember[] }) {
  const columns = useMemo(() => TEAM_COLUMNS, []);
  const [items, setItems] = useState<TeamsKanbanItem[]>(() =>
    createItems(members)
  );

  useEffect(() => {
    setItems(createItems(members));
  }, [members]);

  const handleDataChange = useCallback(
    (newItems: TeamsKanbanItem[]) => {
      setItems(newItems);
    },
    []
  );

  const columnMeta = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const columnId = item.columnId;
        acc[columnId] = (acc[columnId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [items]);

  return (
    <KanbanProvider<TeamsKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <MemberCard item={item} />
          </div>
        );
      }}
    >
      {columns.map((column) => {
        const count = columnMeta[column.id] ?? 0;
        return (
          <KanbanBoard
            className="min-h-[300px] flex-1"
            column={column}
            key={column.id}
          >
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: column.accentColor }}
                />
                <span className="font-semibold text-sm text-foreground">
                  {column.name}
                </span>
                <Badge
                  className="rounded-full bg-muted px-2 py-0 text-xs font-medium text-muted-foreground"
                  variant="secondary"
                >
                  {count} {count === 1 ? "member" : "members"}
                </Badge>
              </div>
            </KanbanHeader>
            <KanbanCards<TeamsKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No members in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <MemberCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
  );
}

