"use client";

export const dynamic = "force-dynamic";

import {
  ArrowLeft,
  Crown,
  MoreVertical,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePageLayout } from "@/hooks/use-page-layout";

type CustomRole = {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  memberCount: number;
};

export default function RolesPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const customRoles: CustomRole[] = [
    {
      id: "1",
      name: "Owner",
      description: "Full system access including billing and account deletion",
      color: "#fbbf24",
      isSystem: true,
      memberCount: 1,
    },
    {
      id: "2",
      name: "Administrator",
      description: "Manage team and settings (no billing access)",
      color: "#3b82f6",
      isSystem: true,
      memberCount: 3,
    },
    {
      id: "3",
      name: "Field Supervisor",
      description: "Manage jobs and field team schedules",
      color: "#10b981",
      isSystem: false,
      memberCount: 5,
    },
    {
      id: "4",
      name: "Technician",
      description: "Complete assigned jobs and update status",
      color: "#6b7280",
      isSystem: true,
      memberCount: 42,
    },
    {
      id: "5",
      name: "Office Manager",
      description: "Handle customer inquiries and scheduling",
      color: "#8b5cf6",
      isSystem: false,
      memberCount: 8,
    },
    {
      id: "6",
      name: "Viewer",
      description: "Read-only access to reports and data",
      color: "#ef4444",
      isSystem: true,
      memberCount: 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
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
            <BreadcrumbPage>Roles & Permissions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-4">
            <Link href="/dashboard/settings/team">
              <Button size="sm" type="button" variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Team
              </Button>
            </Link>
          </div>
          <h1 className="font-bold text-3xl tracking-tight">
            Roles & Permissions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage custom roles and their permissions
          </p>
        </div>
        <Link href="/dashboard/settings/team/roles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </Link>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customRoles.map((role) => {
          const RoleIcon = role.isSystem
            ? role.name === "Owner"
              ? Crown
              : role.name === "Administrator"
                ? ShieldCheck
                : role.name === "Viewer"
                  ? Shield
                  : User
            : UserCog;

          return (
            <Card
              className="group transition-all hover:shadow-md"
              key={role.id}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <RoleIcon
                        className="h-6 w-6"
                        style={{ color: role.color }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {role.name}
                        {role.isSystem && (
                          <Badge className="text-xs" variant="outline">
                            System
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {role.memberCount} member
                        {role.memberCount !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="opacity-0 group-hover:opacity-100"
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!role.isSystem && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/settings/team/roles/${role.id}`}
                            >
                              Edit Role
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate Role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/settings/team/roles/${role.id}`}
                        >
                          View Permissions
                        </Link>
                      </DropdownMenuItem>
                      {!role.isSystem && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Role
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {role.description}
                </p>
                <div className="mt-4">
                  <Link href={`/dashboard/settings/team/roles/${role.id}`}>
                    <Button className="w-full" size="sm" variant="outline">
                      {role.isSystem ? "View Permissions" : "Edit Permissions"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Create New Role Card */}
        <Link href="/dashboard/settings/team/roles/new">
          <Card className="flex h-full min-h-[200px] cursor-pointer items-center justify-center border-2 border-dashed transition-all hover:border-primary hover:bg-muted/50">
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-base">Create Custom Role</CardTitle>
              <CardDescription className="text-xs">
                Define a new role with custom permissions
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
