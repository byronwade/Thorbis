"use client";

export const dynamic = "force-dynamic";

import { ArrowLeft, Mail, Plus, Send, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { usePageLayout } from "@/hooks/use-page-layout";

type InviteForm = {
  email: string;
  roleId: string;
  departmentId: string;
  jobTitle: string;
};

type CustomRole = {
  id: string;
  name: string;
};

type Department = {
  id: string;
  name: string;
};

export default function InviteMemberPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [invites, setInvites] = useState<InviteForm[]>([
    { email: "", roleId: "", departmentId: "", jobTitle: "" },
  ]);

  const customRoles: CustomRole[] = [
    { id: "1", name: "Owner" },
    { id: "2", name: "Administrator" },
    { id: "3", name: "Field Supervisor" },
    { id: "4", name: "Technician" },
    { id: "5", name: "Office Manager" },
    { id: "6", name: "Viewer" },
  ];

  const departments: Department[] = [
    { id: "1", name: "Field Technicians" },
    { id: "2", name: "Office Staff" },
    { id: "3", name: "Management" },
    { id: "4", name: "Sales" },
  ];

  const addInviteRow = () => {
    setInvites([
      ...invites,
      { email: "", roleId: "", departmentId: "", jobTitle: "" },
    ]);
  };

  const removeInviteRow = (index: number) => {
    if (invites.length > 1) {
      setInvites(invites.filter((_, i) => i !== index));
    }
  };

  const updateInvite = (
    index: number,
    field: keyof InviteForm,
    value: string
  ) => {
    const newInvites = [...invites];
    newInvites[index][field] = value;
    setInvites(newInvites);
  };

  const handleSendInvites = () => {
    // Send invites logic here
  };

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
            <BreadcrumbPage>Invite Members</BreadcrumbPage>
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
            Invite Team Members
          </h1>
          <p className="mt-2 text-muted-foreground">
            Send email invitations to new team members
          </p>
        </div>
        <Button onClick={handleSendInvites}>
          <Send className="mr-2 h-4 w-4" />
          Send {invites.length} Invitation{invites.length !== 1 ? "s" : ""}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base">How invitations work</CardTitle>
              <CardDescription className="mt-1 text-xs">
                New members will receive an email with a link to create their
                account and set their password. They'll have access based on the
                role and department you assign.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Invite Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Team Member Details
          </CardTitle>
          <CardDescription>
            Enter the details for each person you want to invite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {invites.map((invite, index) => (
            <div key={index}>
              {index > 0 && <Separator className="my-6" />}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Member {index + 1}</h3>
                  {invites.length > 1 && (
                    <Button
                      onClick={() => removeInviteRow(index)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${index}`}>
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`email-${index}`}
                      onChange={(e) =>
                        updateInvite(index, "email", e.target.value)
                      }
                      placeholder="colleague@company.com"
                      type="email"
                      value={invite.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`jobTitle-${index}`}>
                      Job Title (Optional)
                    </Label>
                    <Input
                      id={`jobTitle-${index}`}
                      onChange={(e) =>
                        updateInvite(index, "jobTitle", e.target.value)
                      }
                      placeholder="e.g., Senior Technician"
                      value={invite.jobTitle}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-${index}`}>
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        updateInvite(index, "roleId", value)
                      }
                      value={invite.roleId}
                    >
                      <SelectTrigger id={`role-${index}`}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {customRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`department-${index}`}>
                      Department (Optional)
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        updateInvite(index, "departmentId", value)
                      }
                      value={invite.departmentId}
                    >
                      <SelectTrigger id={`department-${index}`}>
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
            </div>
          ))}

          <Button
            className="w-full"
            onClick={addInviteRow}
            type="button"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Member
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Link href="/dashboard/settings/team">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSendInvites}>
          <Send className="mr-2 h-4 w-4" />
          Send {invites.length} Invitation{invites.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
