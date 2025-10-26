"use client";

import { HelpCircle, Save, Users } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

export default function TeamSchedulingSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    allowTechnicianScheduleView: true,
    allowTechnicianScheduleEdit: false,
    technicianCanSwapJobs: true,
    technicianCanRequestTimeOff: true,
    requireTimeOffApproval: true,
    timeOffLeadTime: 7,
    allowMultipleTechniciansPerJob: true,
    defaultCrewSize: 1,
    maxCrewSize: 4,
    enforceCrewSkillRequirements: true,
    shareJobNotesBetweenCrew: true,
    trackIndividualTimeForCrew: true,
    allowSplitCommission: true,
    showTeamCalendar: true,
    calendarDefaultView: "week",
    colorCodeByTechnician: true,
    showTechnicianPhoto: true,
    showJobDetails: true,
    enableDragDropRescheduling: true,
    sendRescheduleNotifications: true,
    allowOvertimeBooking: false,
    overtimeThreshold: 40,
    overtimeApprovalRequired: true,
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
            <h1 className="font-bold text-3xl tracking-tight">
              Team Scheduling
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure team calendar, crew management, and technician
              permissions
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Technician Permissions
            </CardTitle>
            <CardDescription>
              Control what technicians can see and do with schedules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  View Their Schedule
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow technicians to view their assigned jobs
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  See their assigned jobs and schedule
                </p>
              </div>
              <Switch
                checked={settings.allowTechnicianScheduleView}
                onCheckedChange={(checked) =>
                  updateSetting("allowTechnicianScheduleView", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Edit Their Schedule
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow technicians to modify their schedule
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Modify job times and dates
                </p>
              </div>
              <Switch
                checked={settings.allowTechnicianScheduleEdit}
                onCheckedChange={(checked) =>
                  updateSetting("allowTechnicianScheduleEdit", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Swap Jobs With Teammates
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow technicians to trade jobs with each other
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Trade jobs with other technicians
                </p>
              </div>
              <Switch
                checked={settings.technicianCanSwapJobs}
                onCheckedChange={(checked) =>
                  updateSetting("technicianCanSwapJobs", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Off Management</CardTitle>
            <CardDescription>
              Configure how technicians request and manage time off
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Time Off Requests
                </Label>
                <p className="text-muted-foreground text-xs">
                  Technicians can request vacation and PTO
                </p>
              </div>
              <Switch
                checked={settings.technicianCanRequestTimeOff}
                onCheckedChange={(checked) =>
                  updateSetting("technicianCanRequestTimeOff", checked)
                }
              />
            </div>

            {settings.technicianCanRequestTimeOff && (
              <>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Require Manager Approval
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Manager must approve time off requests
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireTimeOffApproval}
                    onCheckedChange={(checked) =>
                      updateSetting("requireTimeOffApproval", checked)
                    }
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Minimum Lead Time
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How far in advance requests must be submitted
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="w-24"
                      min="0"
                      onChange={(e) =>
                        updateSetting("timeOffLeadTime", Number(e.target.value))
                      }
                      type="number"
                      value={settings.timeOffLeadTime}
                    />
                    <span className="text-muted-foreground text-sm">
                      days notice
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crew Management</CardTitle>
            <CardDescription>
              Configure multi-technician job assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Multiple Technicians Per Job
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Enable assigning crews to jobs</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Assign crews to larger jobs
                </p>
              </div>
              <Switch
                checked={settings.allowMultipleTechniciansPerJob}
                onCheckedChange={(checked) =>
                  updateSetting("allowMultipleTechniciansPerJob", checked)
                }
              />
            </div>

            {settings.allowMultipleTechniciansPerJob && (
              <>
                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="font-medium text-sm">
                      Default Crew Size
                    </Label>
                    <Input
                      className="mt-2"
                      min="1"
                      onChange={(e) =>
                        updateSetting("defaultCrewSize", Number(e.target.value))
                      }
                      type="number"
                      value={settings.defaultCrewSize}
                    />
                  </div>

                  <div>
                    <Label className="font-medium text-sm">
                      Maximum Crew Size
                    </Label>
                    <Input
                      className="mt-2"
                      min="1"
                      onChange={(e) =>
                        updateSetting("maxCrewSize", Number(e.target.value))
                      }
                      type="number"
                      value={settings.maxCrewSize}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Enforce Crew Skill Requirements
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Ensure at least one crew member has required skills
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      At least one member must have required skills
                    </p>
                  </div>
                  <Switch
                    checked={settings.enforceCrewSkillRequirements}
                    onCheckedChange={(checked) =>
                      updateSetting("enforceCrewSkillRequirements", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Share Job Notes Between Crew
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      All crew members see the same notes
                    </p>
                  </div>
                  <Switch
                    checked={settings.shareJobNotesBetweenCrew}
                    onCheckedChange={(checked) =>
                      updateSetting("shareJobNotesBetweenCrew", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Track Individual Time For Crew
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Track time separately for each crew member
                    </p>
                  </div>
                  <Switch
                    checked={settings.trackIndividualTimeForCrew}
                    onCheckedChange={(checked) =>
                      updateSetting("trackIndividualTimeForCrew", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      Allow Split Commission
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Divide commission among crew members
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Divide commission among crew members
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowSplitCommission}
                    onCheckedChange={(checked) =>
                      updateSetting("allowSplitCommission", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Calendar Display</CardTitle>
            <CardDescription>Customize the team schedule view</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Show Team Calendar
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display combined view of all technician schedules
                </p>
              </div>
              <Switch
                checked={settings.showTeamCalendar}
                onCheckedChange={(checked) =>
                  updateSetting("showTeamCalendar", checked)
                }
              />
            </div>

            {settings.showTeamCalendar && (
              <>
                <Separator />

                <div>
                  <Label className="font-medium text-sm">
                    Default Calendar View
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting("calendarDefaultView", value)
                    }
                    value={settings.calendarDefaultView}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Color Code By Technician
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Use different colors for each technician
                    </p>
                  </div>
                  <Switch
                    checked={settings.colorCodeByTechnician}
                    onCheckedChange={(checked) =>
                      updateSetting("colorCodeByTechnician", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Show Technician Photo
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Display profile photos on calendar
                    </p>
                  </div>
                  <Switch
                    checked={settings.showTechnicianPhoto}
                    onCheckedChange={(checked) =>
                      updateSetting("showTechnicianPhoto", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Show Job Details
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Display customer name and job type on calendar
                    </p>
                  </div>
                  <Switch
                    checked={settings.showJobDetails}
                    onCheckedChange={(checked) =>
                      updateSetting("showJobDetails", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Management</CardTitle>
            <CardDescription>
              Configure rescheduling and overtime options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Drag-and-Drop Rescheduling
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow dragging jobs to reschedule on calendar
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Drag jobs on calendar to reschedule
                </p>
              </div>
              <Switch
                checked={settings.enableDragDropRescheduling}
                onCheckedChange={(checked) =>
                  updateSetting("enableDragDropRescheduling", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Send Reschedule Notifications
                </Label>
                <p className="text-muted-foreground text-xs">
                  Notify customers and technicians of changes
                </p>
              </div>
              <Switch
                checked={settings.sendRescheduleNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("sendRescheduleNotifications", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Overtime Booking
                </Label>
                <p className="text-muted-foreground text-xs">
                  Schedule jobs beyond regular hours
                </p>
              </div>
              <Switch
                checked={settings.allowOvertimeBooking}
                onCheckedChange={(checked) =>
                  updateSetting("allowOvertimeBooking", checked)
                }
              />
            </div>

            {settings.allowOvertimeBooking && (
              <>
                <div>
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Overtime Threshold
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Hours per week before overtime applies
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="w-24"
                      min="1"
                      onChange={(e) =>
                        updateSetting(
                          "overtimeThreshold",
                          Number(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.overtimeThreshold}
                    />
                    <span className="text-muted-foreground text-sm">
                      hours/week
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Require Overtime Approval
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Manager must approve overtime hours
                    </p>
                  </div>
                  <Switch
                    checked={settings.overtimeApprovalRequired}
                    onCheckedChange={(checked) =>
                      updateSetting("overtimeApprovalRequired", checked)
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="space-y-1">
              <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
                Team Scheduling Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Balance technician autonomy with manager oversight. Allow
                schedule viewing for transparency but limit editing to prevent
                conflicts. Configure time off lead times to ensure adequate
                coverage. Use crew assignments for complex jobs requiring
                multiple skill sets.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
