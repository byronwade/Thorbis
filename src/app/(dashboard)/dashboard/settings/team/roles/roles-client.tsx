"use client";

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
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
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

type RoleRecord = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  permissions: string[];
  is_system: boolean;
  member_count?: number;
};

interface RolesClientProps {
  roles: RoleRecord[];
}

const DEFAULT_COLOR = "#3b82f6";

function getRoleIcon(role: RoleRecord) {
  if (!role.is_system) {
    return UserCog;
  }
  if (role.name.toLowerCase().includes("owner")) {
    return Crown;
  }
  if (role.name.toLowerCase().includes("admin")) {
    return ShieldCheck;
  }
  if (role.name.toLowerCase().includes("viewer")) {
    return Shield;
  }
  return User;
}

export function RolesClient({ roles }: RolesClientProps) {
  const totalMembers = roles.reduce(
    (sum, role) => sum + (role.member_count ?? 0),
    0
  );

  return (
    <SettingsPageLayout
      description="View every role in your workspace and how many teammates use it. Create custom roles to match the way your org operates."
      hasChanges={false}
      helpText="System roles cannot be edited or deleted. Create custom roles to fine-tune permissions."
      isPending={false}
      title="Roles & Permissions"
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
                <BreadcrumbPage>Roles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild variant="ghost">
            <Link href="/dashboard/settings/team">
              <ArrowLeft className="mr-2 size-4" />
              Back to team
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Role summary</CardTitle>
              <CardDescription>
                {roles.length
                  ? `${roles.length} roles • ${totalMembers.toLocaleString()} total members`
                  : "No roles found"}
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/settings/team/roles/new">
                <Plus className="mr-2 size-4" />
                Create role
              </Link>
            </Button>
          </CardHeader>
        </Card>

        {roles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Shield className="size-8 text-muted-foreground" />
              <div>
                <p className="font-semibold">No custom roles yet</p>
                <p className="text-muted-foreground text-sm">
                  Use system roles or create your own with tailored permissions.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/settings/team/roles/new">
                  Create role
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const RoleIcon = getRoleIcon(role);
              const color = role.color ?? DEFAULT_COLOR;
              const memberCount = role.member_count ?? 0;

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
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <RoleIcon className="h-6 w-6" style={{ color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="flex items-center gap-2 text-base">
                            {role.name}
                            {role.is_system && (
                              <Badge className="text-xs" variant="outline">
                                System
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {memberCount.toLocaleString()} member
                            {memberCount === 1 ? "" : "s"}
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
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!role.is_system && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/settings/team/roles/${role.id}`}
                                >
                                  Edit Role
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
                                Duplicate Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/settings/team/roles/${role.id}`}
                            >
                              View permissions
                            </Link>
                          </DropdownMenuItem>
                          {!role.is_system && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                disabled
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete role
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {role.description || "No description provided."}
                    </p>
                    <div className="mt-4">
                      <Link href={`/dashboard/settings/team/roles/${role.id}`}>
                        <Button className="w-full" size="sm" variant="outline">
                          {role.is_system
                            ? "View permissions"
                            : "Edit permissions"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SettingsPageLayout>
  );
}

export default RolesClient;
