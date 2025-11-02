"use client";

/**
 * Settings > Communications > Templates Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { FileText, HelpCircle, Plus, Save, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function TemplatesSettingsPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    useEmailTemplates: true,
    useSMSTemplates: true,
    allowCustomTemplates: true,
  });

  const updateSetting = (key: string, value: boolean) => {
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
              Message Templates
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create and manage pre-written message templates
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 size-4" />
              Create Template
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSave}>
                <Save className="mr-2 size-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Template Settings
            </CardTitle>
            <CardDescription>
              Configure template usage and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Use Email Templates
                </Label>
                <p className="text-muted-foreground text-xs">
                  Pre-written emails for common situations
                </p>
              </div>
              <Switch
                checked={settings.useEmailTemplates}
                onCheckedChange={(checked) =>
                  updateSetting("useEmailTemplates", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">Use SMS Templates</Label>
                <p className="text-muted-foreground text-xs">
                  Pre-written text messages
                </p>
              </div>
              <Switch
                checked={settings.useSMSTemplates}
                onCheckedChange={(checked) =>
                  updateSetting("useSMSTemplates", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Custom Templates
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let team members create their own templates
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Team can create custom templates
                </p>
              </div>
              <Switch
                checked={settings.allowCustomTemplates}
                onCheckedChange={(checked) =>
                  updateSetting("allowCustomTemplates", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Pre-written email templates for common scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">Job Confirmation</h3>
                    <p className="text-muted-foreground text-sm">
                      Sent when job is scheduled
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Variables: customer_name, job_date, job_time,
                      technician_name
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">Appointment Reminder</h3>
                    <p className="text-muted-foreground text-sm">
                      Sent 24 hours before appointment
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Variables: customer_name, appointment_date,
                      appointment_time
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">Invoice Sent</h3>
                    <p className="text-muted-foreground text-sm">
                      Sent with invoice after job completion
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Variables: customer_name, invoice_number, total_amount,
                      due_date
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">Payment Receipt</h3>
                    <p className="text-muted-foreground text-sm">
                      Sent when payment is received
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Variables: customer_name, payment_amount, payment_method,
                      invoice_number
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMS Templates</CardTitle>
            <CardDescription>
              Pre-written text message templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">On The Way</h3>
                    <p className="text-muted-foreground text-sm">
                      Sent when technician is en route
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Example: "Hi customer_name! technician_name is on the way
                      and will arrive in eta_minutes minutes."
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">Job Complete</h3>
                    <p className="text-muted-foreground text-sm">
                      Sent when job is finished
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Example: "Your service is complete! Thank you for choosing
                      us. Invoice #invoice_number sent to your email."
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">Appointment Confirmed</h3>
                    <p className="text-muted-foreground text-sm">
                      Confirmation after scheduling
                    </p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Example: "Your appointment is confirmed for
                      appointment_date at appointment_time. Reply CANCEL to
                      reschedule."
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />
            <div className="space-y-1">
              <p className="font-medium text-purple-700 text-sm dark:text-purple-400">
                Template Best Practices
              </p>
              <p className="text-muted-foreground text-sm">
                Use variables for personalization. Keep SMS templates under 160
                characters to avoid split messages. Test templates before use.
                Include clear calls-to-action. Maintain consistent brand voice
                across all templates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
