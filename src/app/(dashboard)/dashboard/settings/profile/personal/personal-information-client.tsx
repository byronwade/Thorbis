"use client";

/**
 * Settings > Profile > Personal Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, HelpCircle, MapPin, Trash2, Upload, User } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updatePersonalInfo } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Constants
const MIN_NAME_LENGTH = 2;
const MIN_PHONE_LENGTH = 10;
const MAX_BIO_LENGTH = 500;
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(
      MIN_NAME_LENGTH,
      `First name must be at least ${MIN_NAME_LENGTH} characters`
    ),
  lastName: z
    .string()
    .min(
      MIN_NAME_LENGTH,
      `Last name must be at least ${MIN_NAME_LENGTH} characters`
    ),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(
      MIN_PHONE_LENGTH,
      `Phone number must be at least ${MIN_PHONE_LENGTH} digits`
    ),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  bio: z
    .string()
    .max(MAX_BIO_LENGTH, `Bio must be less than ${MAX_BIO_LENGTH} characters`)
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export interface PersonalInformationClientProps {
  initialData: PersonalInfoFormData & { avatar?: string | null };
}

export function PersonalInformationClient({
  initialData,
}: PersonalInformationClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);
  const initialValuesRef = useRef(initialData);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    initialValuesRef.current = initialData;
    form.reset(initialData);
    setHasChanges(false);
  }, [form, initialData]);

  function onSubmit(values: PersonalInfoFormData) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", `${values.firstName} ${values.lastName}`);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("avatar", "");

      const result = await updatePersonalInfo(formData);

      if (result.success) {
        setHasChanges(false);
        toast.success("Personal information saved successfully");
      } else {
        toast.error(result.error || "Failed to save personal information");
      }
    });
  }

  const handleSave = () => form.handleSubmit(onSubmit)();
  const handleCancel = () => {
    form.reset(initialValuesRef.current);
    setHasChanges(false);
  };

  const avatarFallback = `${initialData.firstName?.charAt(0) ?? ""}${
    initialData.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <TooltipProvider>
      <SettingsPageLayout
        description="Update your personal details and how you appear to others"
        hasChanges={hasChanges}
        helpText="This information is visible to team members and customers. Keep it up to date for better communication."
        isLoading={false}
        isPending={isPending}
        onCancel={handleCancel}
        onSave={handleSave}
        saveButtonText="Save personal information"
        title="Personal Information"
      >
        <Form {...form}>
          <form
            className="space-y-8"
            onChange={() => setHasChanges(true)}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Profile Picture Section */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="flex items-start gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarImage
                        alt="Profile picture"
                        src={initialData.avatar ?? undefined}
                      />
                      <AvatarFallback className="text-2xl">
                        {avatarFallback || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="absolute right-0 bottom-0 h-10 w-10 rounded-full shadow-md"
                          size="icon"
                          type="button"
                        >
                          <Camera className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change photo</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-xl">Profile Picture</h2>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="flex items-center justify-center"
                            type="button"
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Your profile photo appears throughout the platform,
                            including in customer communications and team
                            directories.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Upload a professional photo that represents you well
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline">
                      <Upload className="mr-2 size-4" />
                      Upload New Photo
                    </Button>
                    <Button type="button" variant="ghost">
                      <Trash2 className="mr-2 size-4" />
                      Remove
                    </Button>
                  </div>

                  <p className="text-muted-foreground text-xs">
                    Recommended: JPG or PNG, max 2MB, at least 400x400 pixels
                    for best quality
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-xl">Basic Information</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center justify-center"
                        type="button"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Required information for your account and
                        communications.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-muted-foreground text-sm">
                  Essential details used across the platform
                </p>
              </div>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          First Name
                          <span className="text-destructive">*</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Your legal first name
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Last Name
                          <span className="text-destructive">*</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Your legal last name or surname
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Email Address
                          <span className="text-destructive">*</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Primary email for login, notifications, and
                                communication
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Used for account login and notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Phone Number
                          <span className="text-destructive">*</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Contact number for SMS notifications and voice
                                calls
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include country code for international
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Professional Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Job Title
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Your role or position in the organization
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Field Service Technician"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Company
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Organization or company name
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Thorbis Field Services"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bio Field */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Bio
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button">
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              Brief description of your background, experience,
                              and expertise
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px] resize-y"
                          placeholder="Tell us about your experience and expertise..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} / {MAX_BIO_LENGTH} characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold text-xl">Address</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center justify-center"
                        type="button"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Optional address information for shipping, billing, or
                        service location purposes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-muted-foreground text-sm">
                  Optional location information
                </p>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </SettingsPageLayout>
    </TooltipProvider>
  );
}

export default PersonalInformationClient;
