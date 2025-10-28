"use client";

/**
 * Settings > Team > Departments Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  ArrowLeft,
  Building2,
  MoreVertical,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
type Department = {
  id: string;
  name: string;
  description?: string;
  color: string;
  memberCount: number;
};

export default function DepartmentsPage() {  const [showNewForm, setShowNewForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  });

  const departments: Department[] = [
    {
      id: "1",
      name: "Field Technicians",
      description: "Frontline service technicians working on-site",
      color: "#3b82f6",
      memberCount: 45,
    },
    {
      id: "2",
      name: "Office Staff",
      description: "Administrative and support personnel",
      color: "#10b981",
      memberCount: 12,
    },
    {
      id: "3",
      name: "Management",
      description: "Leadership and supervisory roles",
      color: "#f59e0b",
      memberCount: 5,
    },
    {
      id: "4",
      name: "Sales",
      description: "Business development and customer acquisition",
      color: "#8b5cf6",
      memberCount: 8,
    },
  ];

  const handleCreateDepartment = () => {
    // Save logic here
    setNewDepartment({ name: "", description: "", color: "#3b82f6" });
    setShowNewForm(false);
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
            <BreadcrumbPage>Departments</BreadcrumbPage>
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
          <h1 className="font-bold text-3xl tracking-tight">Departments</h1>
          <p className="mt-2 text-muted-foreground">
            Organize your team into departments for better management
          </p>
        </div>
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Department
        </Button>
      </div>

      {/* New Department Form */}
      {showNewForm && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Department</CardTitle>
                <CardDescription>
                  Add a new department to your organization
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowNewForm(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newName">Department Name</Label>
                <Input
                  id="newName"
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                  placeholder="e.g., Field Technicians"
                  value={newDepartment.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newColor">Color</Label>
                <div className="flex gap-2">
                  <Input
                    className="w-20"
                    id="newColor"
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        color: e.target.value,
                      })
                    }
                    type="color"
                    value={newDepartment.color}
                  />
                  <div className="flex flex-1 items-center gap-2">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: newDepartment.color }}
                    >
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <Input disabled value={newDepartment.color} />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDescription">Description (Optional)</Label>
              <Textarea
                id="newDescription"
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this department"
                rows={2}
                value={newDepartment.description}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateDepartment}>
                <Save className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Departments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Card className="group transition-all hover:shadow-md" key={dept.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${dept.color}20` }}
                  >
                    <Building2
                      className="h-6 w-6"
                      style={{ color: dept.color }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {dept.memberCount} member
                      {dept.memberCount !== 1 ? "s" : ""}
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
                    <DropdownMenuItem>Edit Department</DropdownMenuItem>
                    <DropdownMenuItem>View Members</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Department
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            {dept.description && (
              <>
                <Separator />
                <CardContent className="pt-4">
                  <p className="text-muted-foreground text-sm">
                    {dept.description}
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        ))}

        {/* Create New Department Card */}
        {!showNewForm && (
          <Card
            className="flex h-full min-h-[140px] cursor-pointer items-center justify-center border-2 border-dashed transition-all hover:border-primary hover:bg-muted/50"
            onClick={() => setShowNewForm(true)}
          >
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-base">Create Department</CardTitle>
              <CardDescription className="text-xs">
                Add a new organizational unit
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
