"use client";

/**
 * Settings > Team > Roles > [Id] Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { ArrowLeft, Palette, Save } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type PermissionCategory = {
  id: string;
  label: string;
  description: string;
  permissions: {
    id: string;
    label: string;
    description: string;
  }[];
};

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "jobs",
    label: "Jobs & Scheduling",
    description: "Manage work orders and schedules",
    permissions: [
      {
        id: "jobs.view",
        label: "View jobs",
        description: "View all jobs and schedules",
      },
      {
        id: "jobs.create",
        label: "Create jobs",
        description: "Create new work orders",
      },
      {
        id: "jobs.edit",
        label: "Edit jobs",
        description: "Modify existing jobs",
      },
      { id: "jobs.delete", label: "Delete jobs", description: "Remove jobs" },
      {
        id: "jobs.assign",
        label: "Assign technicians",
        description: "Assign work to team members",
      },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    description: "Customer relationship management",
    permissions: [
      {
        id: "customers.view",
        label: "View customers",
        description: "Access customer information",
      },
      {
        id: "customers.create",
        label: "Create customers",
        description: "Add new customers",
      },
      {
        id: "customers.edit",
        label: "Edit customers",
        description: "Modify customer details",
      },
      {
        id: "customers.delete",
        label: "Delete customers",
        description: "Remove customers",
      },
    ],
  },
  {
    id: "invoices",
    label: "Invoices & Payments",
    description: "Financial management",
    permissions: [
      {
        id: "invoices.view",
        label: "View invoices",
        description: "See all invoices and payments",
      },
      {
        id: "invoices.create",
        label: "Create invoices",
        description: "Generate new invoices",
      },
      {
        id: "invoices.edit",
        label: "Edit invoices",
        description: "Modify invoices",
      },
      {
        id: "invoices.delete",
        label: "Delete invoices",
        description: "Remove invoices",
      },
      {
        id: "invoices.process_payments",
        label: "Process payments",
        description: "Handle payment transactions",
      },
    ],
  },
  {
    id: "team",
    label: "Team Management",
    description: "User and permission management",
    permissions: [
      { id: "team.view", label: "View team", description: "See team members" },
      {
        id: "team.invite",
        label: "Invite members",
        description: "Add new team members",
      },
      {
        id: "team.edit",
        label: "Edit members",
        description: "Modify team member details",
      },
      {
        id: "team.remove",
        label: "Remove members",
        description: "Remove team members",
      },
      {
        id: "team.manage_roles",
        label: "Manage roles",
        description: "Create and edit custom roles",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    description: "Business insights and data",
    permissions: [
      {
        id: "reports.view",
        label: "View reports",
        description: "Access analytics and reports",
      },
      {
        id: "reports.export",
        label: "Export data",
        description: "Download reports and data",
      },
    ],
  },
  {
    id: "settings",
    label: "Company Settings",
    description: "System configuration",
    permissions: [
      {
        id: "settings.view",
        label: "View settings",
        description: "Access company settings",
      },
      {
        id: "settings.edit",
        label: "Edit settings",
        description: "Modify company configuration",
      },
      {
        id: "settings.billing",
        label: "Manage billing",
        description: "Access billing and subscription",
      },
    ],
  },
];

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const isNewRole = resolvedParams.id === "new";

  const [roleForm, setRoleForm] = useState({
    name: isNewRole ? "" : "Field Supervisor",
    description: isNewRole ? "" : "Manage jobs and field team schedules",
    color: "#10b981",
    permissions: {
      "jobs.view": true,
      "jobs.create": true,
      "jobs.edit": true,
      "jobs.assign": true,
      "customers.view": true,
      "team.view": true,
    } as Record<string, boolean>,
  });

  const handleSave = () => {
    // Save logic here
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
            <BreadcrumbLink asChild>
              <Link href="/dashboard/settings/team/roles">
                Roles & Permissions
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isNewRole ? "New Role" : roleForm.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-4">
            <Link href="/dashboard/settings/team/roles">
              <Button size="sm" type="button" variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Roles
              </Button>
            </Link>
          </div>
          <h1 className="font-bold text-3xl tracking-tight">
            {isNewRole ? "Create Custom Role" : `Edit ${roleForm.name}`}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isNewRole
              ? "Define a new role with custom permissions"
              : "Modify role permissions and settings"}
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Role Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
          <CardDescription>Basic information about this role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                onChange={(e) =>
                  setRoleForm({ ...roleForm, name: e.target.value })
                }
                placeholder="e.g., Field Supervisor"
                value={roleForm.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleColor">Color</Label>
              <div className="flex gap-2">
                <Input
                  className="w-20"
                  id="roleColor"
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, color: e.target.value })
                  }
                  type="color"
                  value={roleForm.color}
                />
                <div className="flex flex-1 items-center gap-2">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: roleForm.color }}
                  >
                    <Palette className="h-4 w-4 text-white" />
                  </div>
                  <Input disabled value={roleForm.color} />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleDescription">Description</Label>
            <Textarea
              id="roleDescription"
              onChange={(e) =>
                setRoleForm({ ...roleForm, description: e.target.value })
              }
              placeholder="What can this role do?"
              rows={3}
              value={roleForm.description}
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            Define what actions this role can perform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {PERMISSION_CATEGORIES.map((category) => (
            <div className="space-y-4" key={category.id}>
              <div>
                <h3 className="font-medium text-sm">{category.label}</h3>
                <p className="text-muted-foreground text-xs">
                  {category.description}
                </p>
              </div>
              <div className="space-y-3 pl-4">
                {category.permissions.map((permission) => (
                  <div className="flex items-start gap-3" key={permission.id}>
                    <Switch
                      checked={roleForm.permissions[permission.id]}
                      id={permission.id}
                      onCheckedChange={(checked) =>
                        setRoleForm({
                          ...roleForm,
                          permissions: {
                            ...roleForm.permissions,
                            [permission.id]: checked,
                          },
                        })
                      }
                    />
                    <div className="flex-1">
                      <Label
                        className="cursor-pointer font-medium text-sm"
                        htmlFor={permission.id}
                      >
                        {permission.label}
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end gap-2">
        <Link href="/dashboard/settings/team/roles">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {isNewRole ? "Create Role" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
