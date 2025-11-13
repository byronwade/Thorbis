"use client";

import { Check, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRoleStore } from "@/lib/stores/role-store";
import { ROLE_CONFIGS, type UserRole } from "@/types/roles";

/**
 * Role Switcher Component - Client Component
 *
 * Development tool for testing role-based dashboard views
 * Persists selection to localStorage
 * Uses Zustand for state management (no Context Provider needed)
 */

export function RoleSwitcher() {
  const currentRole = useRoleStore((state) => state.role);
  const setRole = useRoleStore((state) => state.setRole);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-muted-foreground" />
        <div>
          <h3 className="font-semibold text-lg">Development Role Switcher</h3>
          <p className="text-muted-foreground text-sm">
            Switch between user roles to test different dashboard views
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(ROLE_CONFIGS).map((config) => {
          const isActive = currentRole === config.id;

          return (
            <Card
              className={`cursor-pointer transition-all hover:border-primary ${
                isActive
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : ""
              }`}
              key={config.id}
              onClick={() => setRole(config.id as UserRole)}
            >
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        config.color === "purple"
                          ? "bg-accent"
                          : config.color === "blue"
                            ? "bg-primary"
                            : config.color === "green"
                              ? "bg-success"
                              : config.color === "orange"
                                ? "bg-warning"
                                : config.color === "pink"
                                  ? "bg-accent"
                                  : "bg-destructive"
                      } ${isActive ? "" : "bg-transparent"}`}
                      variant={isActive ? "default" : "outline"}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  {isActive && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    {config.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    Dashboard Features
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {config.dashboardFeatures.slice(0, 3).map((feature) => (
                      <Badge
                        className="text-xs"
                        key={feature}
                        variant="secondary"
                      >
                        {feature.replace(/-/g, " ")}
                      </Badge>
                    ))}
                    {config.dashboardFeatures.length > 3 && (
                      <Badge className="text-xs" variant="secondary">
                        +{config.dashboardFeatures.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border border-warning bg-warning p-4 dark:border-warning dark:bg-warning">
        <div className="flex gap-3">
          <div className="text-warning dark:text-warning">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium text-sm text-warning dark:text-warning">
              Development Mode Only
            </p>
            <p className="text-sm text-warning dark:text-warning">
              This role switcher is for development testing only. In production,
              user roles will be determined by authentication and database
              permissions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
        <div>
          <p className="font-medium text-sm">Current Active Role</p>
          <p className="text-muted-foreground text-sm">
            {ROLE_CONFIGS[currentRole].label} -{" "}
            {ROLE_CONFIGS[currentRole].description}
          </p>
        </div>
        <Button
          onClick={() => {
            localStorage.removeItem("stratos_dev_role");
            setRole("owner");
          }}
          size="sm"
          variant="outline"
        >
          Reset to Owner
        </Button>
      </div>
    </div>
  );
}
