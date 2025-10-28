"use client";

/**
 * Settings > Jobs Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Image,
  Loader2,
  MapPin,
  Save,
  Settings,
  Users,
} from "lucide-react";
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
// Constants
const MIN_JOB_NUMBER = 1000;
const MAX_JOB_NUMBER = 999_999;
const SIMULATED_API_DELAY = 1500;

type JobStatus =
  | "scheduled"
  | "in-progress"
  | "on-hold"
  | "completed"
  | "cancelled";

type JobSettings = {
  // Job Number Settings
  autoGenerateJobNumbers: boolean;
  jobNumberPrefix: string;
  nextJobNumber: number;
  includeYearInJobNumber: boolean;

  // Default Settings
  defaultJobStatus: JobStatus;
  defaultJobDuration: number;
  requireJobDescription: boolean;
  requireCustomerSignature: boolean;

  // Photo & Documentation
  requirePhotoBefore: boolean;
  requirePhotoAfter: boolean;
  maxPhotosPerJob: number;
  requireJobNotes: boolean;

  // Assignment & Scheduling
  autoAssignJobs: boolean;
  allowTechnicianSelfAssign: boolean;
  notifyTechnicianOnAssignment: boolean;
  requireArrivalConfirmation: boolean;

  // Completion Requirements
  requireTimeTracking: boolean;
  requireMaterialsList: boolean;
  requireCompletionNotes: boolean;
  autoGenerateInvoiceOnComplete: boolean;

  // Customer Communication
  sendJobConfirmationEmail: boolean;
  sendJobCompletionEmail: boolean;
  sendDayBeforeReminder: boolean;
  sendOnTheWayNotification: boolean;
};

export default function JobsSettingsPage() {  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<JobSettings>({
    // Job Numbers
    autoGenerateJobNumbers: true,
    jobNumberPrefix: "JOB",
    nextJobNumber: 10_234,
    includeYearInJobNumber: true,

    // Defaults
    defaultJobStatus: "scheduled",
    defaultJobDuration: 60,
    requireJobDescription: true,
    requireCustomerSignature: false,

    // Photos
    requirePhotoBefore: true,
    requirePhotoAfter: true,
    maxPhotosPerJob: 20,
    requireJobNotes: false,

    // Assignment
    autoAssignJobs: false,
    allowTechnicianSelfAssign: true,
    notifyTechnicianOnAssignment: true,
    requireArrivalConfirmation: true,

    // Completion
    requireTimeTracking: true,
    requireMaterialsList: true,
    requireCompletionNotes: true,
    autoGenerateInvoiceOnComplete: true,

    // Communication
    sendJobConfirmationEmail: true,
    sendJobCompletionEmail: true,
    sendDayBeforeReminder: true,
    sendOnTheWayNotification: true,
  });

  const updateSetting = <K extends keyof JobSettings>(
    key: K,
    value: JobSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSave() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    setIsSubmitting(false);
  }

  const getJobNumberExample = () => {
    const year = new Date().getFullYear();
    const prefix = settings.jobNumberPrefix || "JOB";
    const number = settings.nextJobNumber;

    if (settings.includeYearInJobNumber) {
      return `${prefix}-${year}-${number.toString().padStart(5, "0")}`;
    }
    return `${prefix}-${number.toString().padStart(5, "0")}`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Jobs Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Configure how jobs are created, assigned, and completed
          </p>
        </div>

        <Separator />

        {/* Job Number Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Job Numbers
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Job numbers help you identify and track each service job.
                    They appear on invoices, work orders, and in your system.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How job numbers are generated and formatted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Generate Job Numbers
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically create a unique number for each new job
                        instead of entering manually
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System assigns numbers automatically
                </p>
              </div>
              <Switch
                checked={settings.autoGenerateJobNumbers}
                onCheckedChange={(checked) =>
                  updateSetting("autoGenerateJobNumbers", checked)
                }
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Job Number Prefix
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Letters that appear before each job number (e.g., "JOB",
                        "WO", "SVC")
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  disabled={!settings.autoGenerateJobNumbers}
                  maxLength={6}
                  onChange={(e) =>
                    updateSetting(
                      "jobNumberPrefix",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="JOB"
                  value={settings.jobNumberPrefix}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Next Job Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The next number that will be assigned to a new job
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  disabled={!settings.autoGenerateJobNumbers}
                  max={MAX_JOB_NUMBER}
                  min={MIN_JOB_NUMBER}
                  onChange={(e) =>
                    updateSetting("nextJobNumber", Number(e.target.value))
                  }
                  type="number"
                  value={settings.nextJobNumber}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Include Year in Job Number
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Add the current year to job numbers (e.g.,
                        JOB-2024-00123)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Helps organize jobs by year
                </p>
              </div>
              <Switch
                checked={settings.includeYearInJobNumber}
                disabled={!settings.autoGenerateJobNumbers}
                onCheckedChange={(checked) =>
                  updateSetting("includeYearInJobNumber", checked)
                }
              />
            </div>

            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm dark:text-blue-100">
                    Example Job Number
                  </p>
                  <p className="mt-1 font-mono text-blue-800 text-lg dark:text-blue-200">
                    {getJobNumberExample()}
                  </p>
                  <p className="mt-1 text-blue-800 text-xs dark:text-blue-200">
                    This is how your next job number will look
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Job Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Default Job Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    These settings are automatically applied when creating new
                    jobs
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Default values for new jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Default Job Status
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Status assigned to new jobs when created
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("defaultJobStatus", value as JobStatus)
                  }
                  value={settings.defaultJobStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Scheduled
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="on-hold">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5" />
                        On Hold
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Default Job Duration
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        How long jobs are scheduled for by default
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("defaultJobDuration", Number(value))
                  }
                  value={String(settings.defaultJobDuration)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Job Description
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Force users to enter what work needs to be done before
                        saving a job
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must describe work to be done
                </p>
              </div>
              <Switch
                checked={settings.requireJobDescription}
                onCheckedChange={(checked) =>
                  updateSetting("requireJobDescription", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Customer Signature
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technicians must get customer signature before
                        completing job
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customer must sign on completion
                </p>
              </div>
              <Switch
                checked={settings.requireCustomerSignature}
                onCheckedChange={(checked) =>
                  updateSetting("requireCustomerSignature", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Photo & Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Image className="h-4 w-4" />
              Photos & Documentation
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Control what photos and notes technicians must provide for
                    each job
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Photo and note requirements for jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require "Before" Photos
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technicians must take photos before starting work (helps
                        with documentation and disputes)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Photos before work starts
                </p>
              </div>
              <Switch
                checked={settings.requirePhotoBefore}
                onCheckedChange={(checked) =>
                  updateSetting("requirePhotoBefore", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require "After" Photos
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technicians must take photos after completing work
                        (proves job was done properly)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Photos after work completed
                </p>
              </div>
              <Switch
                checked={settings.requirePhotoAfter}
                onCheckedChange={(checked) =>
                  updateSetting("requirePhotoAfter", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Maximum Photos Per Job
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Limit how many photos can be uploaded per job (helps
                      control storage costs)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                max={50}
                min={1}
                onChange={(e) =>
                  updateSetting("maxPhotosPerJob", Number(e.target.value))
                }
                type="number"
                value={settings.maxPhotosPerJob}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Job Notes
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technicians must write notes about what they did before
                        completing job
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must add notes on completion
                </p>
              </div>
              <Switch
                checked={settings.requireJobNotes}
                onCheckedChange={(checked) =>
                  updateSetting("requireJobNotes", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Job Assignment
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>How jobs are assigned to technicians</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              How technicians are assigned to jobs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Assign Jobs
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically assign jobs to available technicians based
                        on location and schedule
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  System assigns jobs automatically
                </p>
              </div>
              <Switch
                checked={settings.autoAssignJobs}
                onCheckedChange={(checked) =>
                  updateSetting("autoAssignJobs", checked)
                }
              />
            </div>

            <Separator />

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
                        Let technicians claim unassigned jobs themselves
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Technicians can claim jobs
                </p>
              </div>
              <Switch
                checked={settings.allowTechnicianSelfAssign}
                onCheckedChange={(checked) =>
                  updateSetting("allowTechnicianSelfAssign", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Notify Technician on Assignment
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Send push notification and email when job is assigned
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Alert technician immediately
                </p>
              </div>
              <Switch
                checked={settings.notifyTechnicianOnAssignment}
                onCheckedChange={(checked) =>
                  updateSetting("notifyTechnicianOnAssignment", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Arrival Confirmation
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technician must confirm they arrived at job site (helps
                        track time and location)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must confirm arrival at site
                </p>
              </div>
              <Switch
                checked={settings.requireArrivalConfirmation}
                onCheckedChange={(checked) =>
                  updateSetting("requireArrivalConfirmation", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Completion Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4" />
              Completion Requirements
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>What must be done before a job can be marked complete</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>What's required to complete a job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Time Tracking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Technicians must clock in/out to track how long job took
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must track start/end times
                </p>
              </div>
              <Switch
                checked={settings.requireTimeTracking}
                onCheckedChange={(checked) =>
                  updateSetting("requireTimeTracking", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Materials List
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        List all parts and materials used (helps with accurate
                        invoicing)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must list parts used
                </p>
              </div>
              <Switch
                checked={settings.requireMaterialsList}
                onCheckedChange={(checked) =>
                  updateSetting("requireMaterialsList", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Completion Notes
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Write summary of work performed before completing
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Must document work done
                </p>
              </div>
              <Switch
                checked={settings.requireCompletionNotes}
                onCheckedChange={(checked) =>
                  updateSetting("requireCompletionNotes", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-Generate Invoice
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically create invoice when job is marked complete
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Create invoice on completion
                </p>
              </div>
              <Switch
                checked={settings.autoGenerateInvoiceOnComplete}
                onCheckedChange={(checked) =>
                  updateSetting("autoGenerateInvoiceOnComplete", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Customer Communication
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Automatic notifications sent to customers about their jobs
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Automated customer notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Job Confirmation Email
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Email customer when job is scheduled with date, time,
                        and technician info
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Confirm appointment details
                </p>
              </div>
              <Switch
                checked={settings.sendJobConfirmationEmail}
                onCheckedChange={(checked) =>
                  updateSetting("sendJobConfirmationEmail", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Day-Before Reminder
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Remind customer 24 hours before scheduled appointment
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  24-hour advance reminder
                </p>
              </div>
              <Switch
                checked={settings.sendDayBeforeReminder}
                onCheckedChange={(checked) =>
                  updateSetting("sendDayBeforeReminder", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send "On The Way" Notification
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Alert customer when technician is heading to their
                        location
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Notify when tech is en route
                </p>
              </div>
              <Switch
                checked={settings.sendOnTheWayNotification}
                onCheckedChange={(checked) =>
                  updateSetting("sendOnTheWayNotification", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Job Completion Email
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Email customer when job is complete with summary and
                        invoice
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Confirm work completed
                </p>
              </div>
              <Switch
                checked={settings.sendJobCompletionEmail}
                onCheckedChange={(checked) =>
                  updateSetting("sendJobCompletionEmail", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave} type="button">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Jobs Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
