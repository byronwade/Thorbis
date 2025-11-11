"use client";

/**
 * Advanced Team Member Permissions Manager
 *
 * Comprehensive permission management with:
 * - Granular permission toggles
 * - Role presets with customization
 * - Permission categories and groups
 * - Visual indicators for critical permissions
 * - Change tracking and confirmation
 */

import {
  AlertCircle,
  Briefcase,
  Calendar,
  Check,
  DollarSign,
  Info,
  MessageSquare,
  Shield,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getTeamMemberPermissions,
  updateTeamMemberPermissions,
} from "@/actions/team";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Permission } from "@/lib/auth/permissions";
import {
  getRolePreset,
  PERMISSION_GROUPS,
  type PermissionDefinition,
} from "@/lib/team/permission-groups";

const ROLE_OPTIONS = [
  {
    value: "owner",
    label: "Owner",
    description: "Full system access and control",
    badge: "Full Access",
  },
  {
    value: "admin",
    label: "Admin",
    description: "System administration and configuration",
    badge: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Team and operations management",
    badge: "Manager",
  },
  {
    value: "dispatcher",
    label: "Dispatcher",
    description: "Schedule coordination and job dispatch",
    badge: "Dispatch",
  },
  {
    value: "technician",
    label: "Technician",
    description: "Field work and job updates",
    badge: "Tech",
  },
  {
    value: "csr",
    label: "Customer Service",
    description: "Customer communication and support",
    badge: "Support",
  },
];

const CATEGORY_ICONS = {
  team: Users,
  customers: User,
  jobs: Briefcase,
  schedule: Calendar,
  financial: DollarSign,
  communication: MessageSquare,
  reports: DollarSign,
};

export function TeamMemberPermissionsAdvanced() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [canManage, setCanManage] = useState(false);

  // Current state (from database)
  const [currentRole, setCurrentRole] = useState<string>("");
  const [currentPermissions, setCurrentPermissions] = useState<
    Record<string, boolean>
  >({});

  // Working state (for editing)
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customPermissions, setCustomPermissions] = useState<
    Record<string, boolean>
  >({});
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    async function loadPermissions() {
      setIsLoading(true);
      const result = await getTeamMemberPermissions(memberId);

      if (result.success && result.data) {
        const role = result.data.role || "technician"; // Default to technician if no role
        setCurrentRole(role);
        setSelectedRole(role);
        setCurrentPermissions(result.data.permissions || {});
        setCustomPermissions(result.data.permissions || {});
        setCanManage(result.data.canManage);

        // Check if permissions match role preset
        const preset = getRolePreset(role);
        const isCustom =
          preset &&
          JSON.stringify(result.data.permissions) !== JSON.stringify(preset);
        setIsCustomMode(isCustom || false);
      } else {
        toast.error("Failed to load permissions");
      }

      setIsLoading(false);
    }

    if (memberId) {
      loadPermissions();
    }
  }, [memberId]);

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    const preset = getRolePreset(newRole);
    if (preset) {
      setCustomPermissions(preset);
      setIsCustomMode(false);
    }
  };

  const handlePermissionToggle = (permission: Permission) => {
    setCustomPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
    setIsCustomMode(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateTeamMemberPermissions(memberId, selectedRole);

    if (result.success) {
      toast.success("Permissions updated successfully");
      setCurrentRole(selectedRole);
      setCurrentPermissions(customPermissions);
      setIsCustomMode(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update permissions");
    }

    setIsSaving(false);
  };

  const handleReset = () => {
    setSelectedRole(currentRole);
    setCustomPermissions(currentPermissions);
    setIsCustomMode(false);
  };

  const hasChanges =
    selectedRole !== currentRole ||
    JSON.stringify(customPermissions) !== JSON.stringify(currentPermissions);

  const enabledCount = Object.values(customPermissions).filter(Boolean).length;
  const criticalEnabled = PERMISSION_GROUPS.flatMap((g) => g.permissions)
    .filter((p) => p.critical && customPermissions[p.key])
    .length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions & Access</CardTitle>
          <CardDescription>Loading permissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!canManage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Permissions & Access
          </CardTitle>
          <CardDescription>View-only access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Current Role</p>
              <Badge className="capitalize" variant="secondary">
                {currentRole || "Not Set"}
              </Badge>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Active Permissions</p>
              <p className="text-muted-foreground text-sm">
                {enabledCount} permission{enabledCount !== 1 ? "s" : ""} enabled
              </p>
            </div>
            <Alert>
              <Info className="size-4" />
              <AlertDescription>
                Only owners and managers can modify team member permissions
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="size-5" />
          Advanced Permissions Manager
        </CardTitle>
        <CardDescription>
          Configure detailed access controls for this team member
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Role Preset</Label>
            {isCustomMode && (
              <Badge variant="outline">
                <AlertCircle className="mr-1 size-3" />
                Custom
              </Badge>
            )}
          </div>
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-auto">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div className="flex flex-col py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.label}</span>
                      <Badge className="text-xs" variant="secondary">
                        {role.badge}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {role.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Permission Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-600" />
              <span className="text-muted-foreground text-sm">Enabled</span>
            </div>
            <p className="mt-1 font-semibold text-2xl">{enabledCount}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <X className="size-4 text-gray-400" />
              <span className="text-muted-foreground text-sm">Disabled</span>
            </div>
            <p className="mt-1 font-semibold text-2xl">
              {PERMISSION_GROUPS.flatMap((g) => g.permissions).length -
                enabledCount}
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-400">
                Critical
              </span>
            </div>
            <p className="mt-1 font-semibold text-2xl text-red-700 dark:text-red-400">
              {criticalEnabled}
            </p>
          </div>
        </div>

        <Separator />

        {/* Permission Categories Tabs */}
        <Tabs defaultValue={PERMISSION_GROUPS[0]?.category} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {PERMISSION_GROUPS.map((group) => {
              const Icon = CATEGORY_ICONS[group.category];
              return (
                <TabsTrigger
                  key={group.category}
                  value={group.category}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="size-3.5" />
                  <span className="hidden sm:inline">{group.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {PERMISSION_GROUPS.map((group) => {
            const Icon = CATEGORY_ICONS[group.category];
            return (
              <TabsContent
                key={group.category}
                value={group.category}
                className="space-y-4"
              >
                <div>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{group.label}</h3>
                      <p className="text-muted-foreground text-sm">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {group.permissions.map((permission) => (
                      <div
                        key={permission.key}
                        className={`flex items-start justify-between rounded-lg border p-4 transition-colors ${
                          customPermissions[permission.key]
                            ? "border-primary/50 bg-primary/5"
                            : "hover:bg-muted/50"
                        } ${
                          permission.critical
                            ? "border-l-4 border-l-red-500"
                            : ""
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={permission.key}
                              className="cursor-pointer font-medium"
                            >
                              {permission.label}
                            </Label>
                            {permission.critical && (
                              <Badge
                                variant="destructive"
                                className="text-xs"
                              >
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {permission.description}
                          </p>
                        </div>
                        <Switch
                          id={permission.key}
                          checked={customPermissions[permission.key] || false}
                          onCheckedChange={() =>
                            handlePermissionToggle(permission.key)
                          }
                          className="ml-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Critical Permissions Warning */}
        {criticalEnabled > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Critical Permissions Enabled</AlertTitle>
            <AlertDescription>
              This team member has {criticalEnabled} critical permission
              {criticalEnabled !== 1 ? "s" : ""} that allow destructive actions.
              Ensure you trust this user with these capabilities.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="default"
              onClick={handleReset}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button size="default" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                "Save Permissions"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
