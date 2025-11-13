"use client";

/**
 * Settings > Schedule > Dispatch Rules Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { HelpCircle, Route, Save, Zap } from "lucide-react";
import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function DispatchRulesSettingsPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    autoAssignment: true,
    assignmentMethod: "balanced",
    considerLocation: true,
    locationWeight: 70,
    considerSkills: true,
    skillsWeight: 80,
    considerAvailability: true,
    availabilityWeight: 90,
    considerWorkload: true,
    workloadWeight: 60,
    maxJobsPerDay: 8,
    minTimeBetweenJobs: 30,
    allowOverbooking: false,
    overbookingLimit: 1,
    travelTimeBuffer: 15,
    autoOptimizeRoutes: true,
    optimizationPriority: "time",
    sendAutoAssignmentNotification: true,
    allowTechnicianSelfAssignment: false,
    requireManagerApproval: false,
    emergencyDispatchPriority: true,
  });

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Dispatch Rules
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure automatic job assignment and routing optimization
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 size-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4" />
              Automatic Assignment
            </CardTitle>
            <CardDescription>
              Configure how jobs are automatically assigned to technicians
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Auto-Assignment
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically assign new jobs to technicians based on
                        dispatch rules
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Automatically assign jobs when created
                </p>
              </div>
              <Switch
                checked={settings.autoAssignment}
                onCheckedChange={(checked) =>
                  updateSetting("autoAssignment", checked)
                }
              />
            </div>

            {settings.autoAssignment && (
              <>
                <Separator />

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Assignment Method
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How to distribute jobs among technicians
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("assignmentMethod", value)
                    }
                    value={settings.assignmentMethod}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">
                        Balanced Workload
                      </SelectItem>
                      <SelectItem value="efficiency">
                        Maximum Efficiency
                      </SelectItem>
                      <SelectItem value="proximity">
                        Nearest Available
                      </SelectItem>
                      <SelectItem value="roundRobin">Round Robin</SelectItem>
                      <SelectItem value="skills">Best Skills Match</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {settings.assignmentMethod === "balanced" &&
                      "Evenly distribute jobs across all technicians"}
                    {settings.assignmentMethod === "efficiency" &&
                      "Optimize for minimum travel time and maximum jobs"}
                    {settings.assignmentMethod === "proximity" &&
                      "Assign to closest available technician"}
                    {settings.assignmentMethod === "roundRobin" &&
                      "Rotate assignments equally among technicians"}
                    {settings.assignmentMethod === "skills" &&
                      "Prioritize technicians with matching skills"}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Send Assignment Notifications
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Notify technicians when jobs are auto-assigned
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendAutoAssignmentNotification}
                    onCheckedChange={(checked) =>
                      updateSetting("sendAutoAssignmentNotification", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Criteria</CardTitle>
            <CardDescription>
              Weight different factors when assigning jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Consider Location
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Factor in travel distance when assigning jobs
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Minimize travel distance
                  </p>
                </div>
                <Switch
                  checked={settings.considerLocation}
                  onCheckedChange={(checked) =>
                    updateSetting("considerLocation", checked)
                  }
                />
              </div>
              {settings.considerLocation && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Weight</Label>
                    <span className="font-medium text-sm">
                      {settings.locationWeight}%
                    </span>
                  </div>
                  <Slider
                    className="mt-2"
                    max={100}
                    min={0}
                    onValueChange={(value) =>
                      updateSetting("locationWeight", value[0])
                    }
                    step={10}
                    value={[settings.locationWeight]}
                  />
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Consider Skills
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Match technician skills to job requirements
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Match required skills
                  </p>
                </div>
                <Switch
                  checked={settings.considerSkills}
                  onCheckedChange={(checked) =>
                    updateSetting("considerSkills", checked)
                  }
                />
              </div>
              {settings.considerSkills && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Weight</Label>
                    <span className="font-medium text-sm">
                      {settings.skillsWeight}%
                    </span>
                  </div>
                  <Slider
                    className="mt-2"
                    max={100}
                    min={0}
                    onValueChange={(value) =>
                      updateSetting("skillsWeight", value[0])
                    }
                    step={10}
                    value={[settings.skillsWeight]}
                  />
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Consider Availability
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Check technician schedule and availability
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Check schedule availability
                  </p>
                </div>
                <Switch
                  checked={settings.considerAvailability}
                  onCheckedChange={(checked) =>
                    updateSetting("considerAvailability", checked)
                  }
                />
              </div>
              {settings.considerAvailability && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Weight</Label>
                    <span className="font-medium text-sm">
                      {settings.availabilityWeight}%
                    </span>
                  </div>
                  <Slider
                    className="mt-2"
                    max={100}
                    min={0}
                    onValueChange={(value) =>
                      updateSetting("availabilityWeight", value[0])
                    }
                    step={10}
                    value={[settings.availabilityWeight]}
                  />
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Consider Current Workload
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Balance jobs across team members
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Balance workload across team
                  </p>
                </div>
                <Switch
                  checked={settings.considerWorkload}
                  onCheckedChange={(checked) =>
                    updateSetting("considerWorkload", checked)
                  }
                />
              </div>
              {settings.considerWorkload && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Weight</Label>
                    <span className="font-medium text-sm">
                      {settings.workloadWeight}%
                    </span>
                  </div>
                  <Slider
                    className="mt-2"
                    max={100}
                    min={0}
                    onValueChange={(value) =>
                      updateSetting("workloadWeight", value[0])
                    }
                    step={10}
                    value={[settings.workloadWeight]}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity Management</CardTitle>
            <CardDescription>
              Control technician workload and scheduling limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Max Jobs Per Day
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Maximum number of jobs per technician per day
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  className="mt-2"
                  min="1"
                  onChange={(e) =>
                    updateSetting("maxJobsPerDay", Number(e.target.value))
                  }
                  type="number"
                  value={settings.maxJobsPerDay}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Min Time Between Jobs
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Minimum buffer time between consecutive jobs (minutes)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    min="0"
                    onChange={(e) =>
                      updateSetting(
                        "minTimeBetweenJobs",
                        Number(e.target.value)
                      )
                    }
                    type="number"
                    value={settings.minTimeBetweenJobs}
                  />
                  <span className="text-muted-foreground text-sm">min</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Overbooking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow scheduling beyond max jobs per day
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Exceed max jobs limit when necessary
                </p>
              </div>
              <Switch
                checked={settings.allowOverbooking}
                onCheckedChange={(checked) =>
                  updateSetting("allowOverbooking", checked)
                }
              />
            </div>

            {settings.allowOverbooking && (
              <div>
                <Label className="text-sm">Overbooking Limit</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min="1"
                    onChange={(e) =>
                      updateSetting("overbookingLimit", Number(e.target.value))
                    }
                    type="number"
                    value={settings.overbookingLimit}
                  />
                  <span className="text-muted-foreground text-sm">
                    extra jobs
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Route className="size-4" />
              Route Optimization
            </CardTitle>
            <CardDescription>
              Automatically optimize technician routes for efficiency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Auto-Optimize Routes
                </Label>
                <p className="text-muted-foreground text-xs">
                  Automatically reorder jobs for optimal routing
                </p>
              </div>
              <Switch
                checked={settings.autoOptimizeRoutes}
                onCheckedChange={(checked) =>
                  updateSetting("autoOptimizeRoutes", checked)
                }
              />
            </div>

            {settings.autoOptimizeRoutes && (
              <>
                <Separator />

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Optimization Priority
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          What to optimize for when routing
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("optimizationPriority", value)
                    }
                    value={settings.optimizationPriority}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Minimize Travel Time</SelectItem>
                      <SelectItem value="distance">
                        Minimize Distance
                      </SelectItem>
                      <SelectItem value="appointments">
                        Respect Appointment Times
                      </SelectItem>
                      <SelectItem value="balanced">
                        Balanced Approach
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Travel Time Buffer
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Extra time added to estimated travel time for safety
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="w-24"
                      min="0"
                      onChange={(e) =>
                        updateSetting(
                          "travelTimeBuffer",
                          Number(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.travelTimeBuffer}
                    />
                    <span className="text-muted-foreground text-sm">
                      minutes
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
            <CardDescription>
              Extra dispatch and assignment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Technician Self-Assignment
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let technicians assign themselves to available jobs
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Technicians can claim unassigned jobs
                </p>
              </div>
              <Switch
                checked={settings.allowTechnicianSelfAssignment}
                onCheckedChange={(checked) =>
                  updateSetting("allowTechnicianSelfAssignment", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Manager Approval
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Manager must approve auto-assignments before
                        notification
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Manager reviews assignments before confirmation
                </p>
              </div>
              <Switch
                checked={settings.requireManagerApproval}
                onCheckedChange={(checked) =>
                  updateSetting("requireManagerApproval", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Emergency Dispatch Priority
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Emergency jobs bypass normal dispatch rules
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Emergency jobs get immediate assignment
                </p>
              </div>
              <Switch
                checked={settings.emergencyDispatchPriority}
                onCheckedChange={(checked) =>
                  updateSetting("emergencyDispatchPriority", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-primary text-sm dark:text-primary">
                Dispatch Optimization Tips
              </p>
              <p className="text-muted-foreground text-sm">
                Start with balanced assignment method and adjust weights based
                on your business priorities. Monitor technician utilization
                weekly and fine-tune rules for optimal efficiency. Consider
                enabling route optimization during slower periods to minimize
                customer impact.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
