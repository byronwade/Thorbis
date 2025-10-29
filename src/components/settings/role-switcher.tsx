"use client";

import { Check, Shield } from "lucide-react";
import { useRoleStore } from "@/lib/stores/role-store";
import { ROLE_CONFIGS, type UserRole } from "@/types/roles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
              key={config.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setRole(config.id as UserRole)}
            >
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isActive ? "default" : "outline"}
                      className={`${
                        config.color === "purple"
                          ? "bg-purple-500"
                          : config.color === "blue"
                            ? "bg-blue-500"
                            : config.color === "green"
                              ? "bg-green-500"
                              : config.color === "orange"
                                ? "bg-orange-500"
                                : config.color === "pink"
                                  ? "bg-pink-500"
                                  : "bg-red-500"
                      } ${isActive ? "" : "bg-transparent"}`}
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
                  <p className="text-muted-foreground text-sm">{config.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                    Dashboard Features
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {config.dashboardFeatures.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature.replace(/-/g, " ")}
                      </Badge>
                    ))}
                    {config.dashboardFeatures.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
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

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
        <div className="flex gap-3">
          <div className="text-yellow-600 dark:text-yellow-400">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
              Development Mode Only
            </p>
            <p className="text-yellow-700 text-sm dark:text-yellow-300">
              This role switcher is for development testing only. In production, user roles
              will be determined by authentication and database permissions.
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
          variant="outline"
          size="sm"
          onClick={() => {
            localStorage.removeItem("stratos_dev_role");
            setRole("owner");
          }}
        >
          Reset to Owner
        </Button>
      </div>
    </div>
  );
}
