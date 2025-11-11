"use client";

/**
 * Development Settings Page - Client Component
 *
 * Developer tools for testing and debugging.
 * Includes role switcher for testing different user role dashboards.
 *
 * Client-side features:
 * - Role state management with Zustand
 * - Interactive role switcher
 * - Real-time role updates
 */

import { AlertTriangle, Code, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  SettingsInfoBanner,
  SettingsPageLayout,
} from "@/components/settings/settings-page-layout";
import { useRoleStore } from "@/lib/stores/role-store";
import { ROLE_CONFIGS, USER_ROLES, type UserRole } from "@/types/roles";

export default function DevelopmentSettingsPage() {
  const currentRole = useRoleStore((state) => state.role);
  const setRole = useRoleStore((state) => state.setRole);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle role selection
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setHasChanges(role !== currentRole);
  };

  // Apply role change
  const handleSave = () => {
    setRole(selectedRole);
    setHasChanges(false);
    // Reload page to trigger dashboard update
    window.location.reload();
  };

  // Cancel changes
  const handleCancel = () => {
    setSelectedRole(currentRole);
    setHasChanges(false);
  };

  // Get role config for display
  const currentRoleConfig = ROLE_CONFIGS[currentRole];
  const selectedRoleConfig = ROLE_CONFIGS[selectedRole];

  // Development-only roles for testing (exclude ADMIN)
  const testRoles: UserRole[] = [
    USER_ROLES.OWNER,
    USER_ROLES.MANAGER,
    USER_ROLES.DISPATCHER,
    USER_ROLES.TECHNICIAN,
    USER_ROLES.CSR,
  ];

  return (
    <SettingsPageLayout
      description="Developer tools for testing and debugging the application."
      hasChanges={hasChanges}
      helpText="These settings are for development and testing purposes only. Changes here do not affect production behavior."
      onCancel={handleCancel}
      onSave={handleSave}
      saveButtonText="Apply Role Change"
      title="Development Settings"
    >
      {/* Warning Banner */}
      <SettingsInfoBanner
        description="These settings are only available in development mode and should not be used in production. Role changes will reload the page to update the dashboard."
        icon={AlertTriangle}
        title="Development Mode Only"
        variant="amber"
      />

      {/* Current Role Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Role
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">
                  {currentRoleConfig.label}
                </p>
                <Badge
                  className="capitalize"
                  variant={currentRole === USER_ROLES.OWNER ? "default" : "secondary"}
                >
                  {currentRole}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {currentRoleConfig.description}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Dashboard Features Preview */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">
              Dashboard Features
            </Label>
            <div className="flex flex-wrap gap-2">
              {currentRoleConfig.dashboardFeatures.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Role Switcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Switch between different user roles to test the dashboard views and
            permissions. The page will reload to apply changes.
          </p>

          <RadioGroup
            className="space-y-3"
            onValueChange={(value) => handleRoleChange(value as UserRole)}
            value={selectedRole}
          >
            {testRoles.map((role) => {
              const config = ROLE_CONFIGS[role];
              const isSelected = selectedRole === role;
              const isCurrent = currentRole === role;

              return (
                <div
                  className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  key={role}
                >
                  <RadioGroupItem className="mt-1" id={role} value={role} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label
                        className="cursor-pointer font-semibold text-base"
                        htmlFor={role}
                      >
                        {config.label}
                      </Label>
                      {isCurrent && (
                        <Badge className="text-xs" variant="default">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {config.description}
                    </p>
                    {/* Dashboard Features for Selected Role */}
                    {isSelected && selectedRole !== currentRole && (
                      <div className="mt-3 space-y-2">
                        <Label className="text-muted-foreground text-xs">
                          Will switch to features:
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {config.dashboardFeatures.map((feature) => (
                            <Badge key={feature} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Additional Dev Tools Info */}
      <SettingsInfoBanner
        description="Role changes are persisted in localStorage under the key 'stratos_dev_role'. Clear your browser storage to reset to the default role."
        icon={Code}
        title="Technical Details"
        variant="blue"
      />
    </SettingsPageLayout>
  );
}
