"use client";

/**
 * VoIP Setup Wizard - Guided onboarding for phone system
 *
 * Steps:
 * 1. Configure business phone number
 * 2. Set business hours
 * 3. Assign team member extensions
 * 4. Create first routing rule
 * 5. Test your setup
 */

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
  Route,
  Users,
} from "lucide-react";
import { useState, useTransition } from "react";
import { updatePhoneSettings } from "@/actions/settings";
import { createRoutingRule } from "@/actions/voip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const steps = [
  {
    id: 1,
    title: "Business Phone",
    description: "Configure your main business number",
    icon: Phone,
  },
  {
    id: 2,
    title: "Business Hours",
    description: "Set your operating hours",
    icon: Clock,
  },
  {
    id: 3,
    title: "Team Extensions",
    description: "Assign extensions to team members",
    icon: Users,
  },
  {
    id: 4,
    title: "Call Routing",
    description: "Create your first routing rule",
    icon: Route,
  },
  {
    id: 5,
    title: "Complete",
    description: "You're all set!",
    icon: CheckCircle2,
  },
];

type TeamMember = {
  id: string;
  full_name: string;
  email: string;
  extension: string;
  enabled: boolean;
};

export function VoIPSetupWizard() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Business Phone
  const [businessNumber, setBusinessNumber] = useState("");
  const [fallbackNumber, setFallbackNumber] = useState("");

  // Step 2: Business Hours
  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "17:00", enabled: true },
    tuesday: { open: "09:00", close: "17:00", enabled: true },
    wednesday: { open: "09:00", close: "17:00", enabled: true },
    thursday: { open: "09:00", close: "17:00", enabled: true },
    friday: { open: "09:00", close: "17:00", enabled: true },
    saturday: { open: "10:00", close: "14:00", enabled: false },
    sunday: { open: "10:00", close: "14:00", enabled: false },
  });

  // Step 3: Team Extensions
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      full_name: "Example User 1",
      email: "user1@example.com",
      extension: "101",
      enabled: true,
    },
    {
      id: "2",
      full_name: "Example User 2",
      email: "user2@example.com",
      extension: "102",
      enabled: true,
    },
  ]);

  // Step 4: Routing Rule
  const [routingStrategy, setRoutingStrategy] = useState("round_robin");

  function nextStep() {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function completeStep() {
    startTransition(async () => {
      try {
        if (currentStep === 1) {
          // Save business phone settings
          if (!businessNumber) {
            toast.error("Please enter a business phone number");
            return;
          }

          const formData = new FormData();
          formData.append("fallbackNumber", businessNumber);
          formData.append("routingStrategy", "round_robin");

          const result = await updatePhoneSettings(formData);
          if (!result.success) {
            toast.error(result.error || "Failed to save phone settings");
            return;
          }
        }

        if (currentStep === 4) {
          // Create routing rule
          const result = await createRoutingRule({
            name: "Main Routing Rule",
            routing_type: routingStrategy as any,
            ring_timeout: 30,
            voicemail_enabled: true,
            record_calls: false,
            enabled: true,
          });

          if (!result.success) {
            toast.error(result.error || "Failed to create routing rule");
            return;
          }
        }

        toast.success(`Step ${currentStep} completed`);

        nextStep();
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  function updateExtension(id: string, extension: string) {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, extension } : member
      )
    );
  }

  function toggleMemberEnabled(id: string) {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, enabled: !member.enabled } : member
      )
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div className="flex flex-1 items-center" key={step.id}>
            <div
              className={`flex flex-col items-center ${
                index < steps.length - 1 ? "w-full" : ""
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                  step.id < currentStep
                    ? "border-green-500 bg-green-500 text-white"
                    : step.id === currentStep
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`font-medium text-sm ${
                    step.id === currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 bg-border">
                <div
                  className={`h-full bg-primary transition-all ${
                    step.id < currentStep ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Business Phone */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessNumber">Business Phone Number *</Label>
                <Input
                  className="mt-2"
                  id="businessNumber"
                  onChange={(e) => setBusinessNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  value={businessNumber}
                />
                <p className="mt-1 text-muted-foreground text-sm">
                  This is your main business phone number displayed to customers
                </p>
              </div>

              <div>
                <Label htmlFor="fallbackNumber">
                  Fallback Number (Optional)
                </Label>
                <Input
                  className="mt-2"
                  id="fallbackNumber"
                  onChange={(e) => setFallbackNumber(e.target.value)}
                  placeholder="+1 (555) 987-6543"
                  type="tel"
                  value={fallbackNumber}
                />
                <p className="mt-1 text-muted-foreground text-sm">
                  Backup number when all team members are unavailable
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Business Hours */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div className="flex items-center gap-4" key={day}>
                  <Checkbox
                    checked={hours.enabled}
                    id={day}
                    onCheckedChange={(checked) =>
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...hours, enabled: !!checked },
                      })
                    }
                  />
                  <Label className="w-24 capitalize" htmlFor={day}>
                    {day}
                  </Label>
                  {hours.enabled ? (
                    <>
                      <Input
                        className="w-32"
                        onChange={(e) =>
                          setBusinessHours({
                            ...businessHours,
                            [day]: { ...hours, open: e.target.value },
                          })
                        }
                        type="time"
                        value={hours.open}
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        className="w-32"
                        onChange={(e) =>
                          setBusinessHours({
                            ...businessHours,
                            [day]: { ...hours, close: e.target.value },
                          })
                        }
                        type="time"
                        value={hours.close}
                      />
                    </>
                  ) : (
                    <Badge variant="secondary">Closed</Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Team Extensions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Assign unique extension numbers to each team member. Extensions
                are used for internal transfers and direct dialing.
              </p>

              {teamMembers.map((member) => (
                <div className="flex items-center gap-4" key={member.id}>
                  <Checkbox
                    checked={member.enabled}
                    onCheckedChange={() => toggleMemberEnabled(member.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{member.full_name}</div>
                    <div className="text-muted-foreground text-sm">
                      {member.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`ext-${member.id}`}>Ext:</Label>
                    <Input
                      className="w-20"
                      id={`ext-${member.id}`}
                      maxLength={4}
                      onChange={(e) =>
                        updateExtension(member.id, e.target.value)
                      }
                      placeholder="101"
                      type="text"
                      value={member.extension}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Call Routing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="routing">Routing Strategy</Label>
                <Select
                  onValueChange={setRoutingStrategy}
                  value={routingStrategy}
                >
                  <SelectTrigger className="mt-2" id="routing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round_robin">
                      Round Robin - Distribute evenly
                    </SelectItem>
                    <SelectItem value="simultaneous">
                      Simultaneous - Ring all at once
                    </SelectItem>
                    <SelectItem value="direct">
                      Direct - Route to specific person
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-muted-foreground text-sm">
                  {routingStrategy === "round_robin" &&
                    "Calls are distributed evenly across available team members"}
                  {routingStrategy === "simultaneous" &&
                    "All available team members receive the call at once"}
                  {routingStrategy === "direct" &&
                    "Calls are routed to a specific team member"}
                </p>
              </div>

              <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
                <p className="font-medium text-primary text-sm dark:text-blue-100">
                  Recommended for most businesses
                </p>
                <p className="text-primary text-sm dark:text-blue-300">
                  Round Robin ensures fair distribution and prevents any single
                  team member from being overwhelmed
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="space-y-6 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success dark:bg-green-900">
                <CheckCircle2 className="h-12 w-12 text-success dark:text-green-400" />
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-2xl">Setup Complete!</h3>
                <p className="text-muted-foreground">
                  Your VoIP system is configured and ready to use
                </p>
              </div>

              <div className="mx-auto max-w-md space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Business phone number configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Business hours set</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>
                    {teamMembers.filter((m) => m.enabled).length} team
                    extensions assigned
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Routing rule created</span>
                </div>
              </div>

              <Button asChild size="lg">
                <a href="/dashboard/settings/communications/phone">
                  Go to Phone Settings
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            disabled={currentStep === 1 || isPending}
            onClick={prevStep}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button disabled={isPending} onClick={completeStep}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : currentStep === 4 ? (
              "Complete Setup"
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
