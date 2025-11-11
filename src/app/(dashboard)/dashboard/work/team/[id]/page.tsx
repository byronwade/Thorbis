/**
 * Team Member Details Page - Server Component
 *
 * Displays individual team member information
 */

import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TeamMemberPermissionsAdvanced } from "@/components/work/team-member-permissions-advanced";
import { TeamMemberDetailToolbar } from "@/components/work/team-member-detail-toolbar";
import { Mail, Phone, Calendar, Clock, Briefcase, Building2, Archive } from "lucide-react";

export default async function TeamMemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: memberId } = await params;

  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get active company ID
  const companyId = await getActiveCompanyId();

  if (!companyId) {
    return notFound();
  }

  // Fetch team member details
  const { data: member, error } = await supabase
    .from("team_members")
    .select(
      `
      id,
      user_id,
      company_id,
      role_id,
      department_id,
      status,
      job_title,
      phone,
      invited_at,
      joined_at,
      last_active_at,
      created_at,
      archived_at
    `
    )
    .eq("id", memberId)
    .eq("company_id", companyId)
    .single();

  if (error || !member) {
    return notFound();
  }

  // Fetch user details
  const { data: userData } = await supabase
    .from("users")
    .select("id, name, email, avatar")
    .eq("id", member.user_id)
    .single();

  // Fetch role details
  const { data: roleData } = await supabase
    .from("custom_roles")
    .select("id, name, color")
    .eq("id", member.role_id)
    .single();

  // Fetch department details if exists
  let departmentData = null;
  if (member.department_id) {
    const { data } = await supabase
      .from("departments")
      .select("id, name, color")
      .eq("id", member.department_id)
      .single();
    departmentData = data;
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "invited":
        return "secondary";
      case "suspended":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60_000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const isArchived = Boolean(member.archived_at);
  const archivedDate = member.archived_at ? formatDate(member.archived_at) : null;

  return (
    <div className="h-full w-full overflow-auto">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Archive Notice */}
        {isArchived && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
            <div className="flex items-center gap-3">
              <Archive className="size-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  This team member has been archived
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Archived on {archivedDate}. This member no longer has access and doesn't count in team statistics.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex items-start gap-4 rounded-lg border bg-card p-6">
          <Avatar className="size-20">
            <AvatarImage alt={userData?.name || "User"} src={userData?.avatar} />
            <AvatarFallback className="text-xl">
              {getInitials(userData?.name || "Unknown")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{userData?.name || "Unknown"}</h1>
              {isArchived && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Archived
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{userData?.email}</p>
            <div className="mt-3 flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(member.status)}>
              {member.status === "active" ? "Active" : member.status === "invited" ? "Invited" : "Suspended"}
            </Badge>
            {roleData && (
              <Badge
                style={{
                  backgroundColor: roleData.color || undefined,
                }}
                variant={roleData.color ? "default" : "secondary"}
              >
                {roleData.name}
              </Badge>
            )}
            {departmentData && (
              <Badge
                style={{
                  backgroundColor: departmentData.color || undefined,
                }}
                variant={departmentData.color ? "default" : "outline"}
              >
                {departmentData.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <TeamMemberDetailToolbar />
        </div>
      </div>

      {/* Contact & Employment Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How to reach this team member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {userData?.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {member.phone || "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Role and department information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Job Title</p>
                <p className="text-sm text-muted-foreground">
                  {member.job_title || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">
                  {departmentData?.name || "Not assigned"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions & Access */}
      <TeamMemberPermissionsAdvanced />

      {/* Activity & Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Member activity and important dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Active</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(member.last_active_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Joined Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(member.joined_at)}
                </p>
              </div>
            </div>
          </div>
          {member.invited_at && (
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Invited Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(member.invited_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(member.created_at)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
