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
import {
  Camera,
  Check,
  HelpCircle,
  Loader2,
  MapPin,
  Save,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
// Constants
const MIN_NAME_LENGTH = 2;
const MIN_PHONE_LENGTH = 10;
const MAX_BIO_LENGTH = 500;
const SIMULATED_API_DELAY = 1500;

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

export default function PersonalInformationPage() {  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      jobTitle: "Field Service Technician",
      company: "Thorbis Field Services",
      bio: "Experienced field service technician with over 5 years in HVAC repair and maintenance.",
      address: "123 Main Street",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
  });

  async function onSubmit(_values: PersonalInfoFormData) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    setHasChanges(false);
    setIsSubmitting(false);
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 py-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-4xl tracking-tight">
                Personal Information
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center justify-center rounded-full hover:bg-muted"
                    type="button"
                  >
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="font-semibold">Your profile information</p>
                  <p className="mt-2 text-sm">
                    This information is visible to team members and customers.
                    Keep it up to date for better communication.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            {hasChanges && (
              <Badge className="bg-amber-600" variant="default">
                Unsaved Changes
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Update your personal details and how you appear to others
          </p>
        </div>

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
                        src="/placeholder-avatar.jpg"
                      />
                      <AvatarFallback className="text-2xl">JD</AvatarFallback>
                    </Avatar>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="absolute right-0 bottom-0 h-10 w-10 rounded-full shadow-md"
                          size="icon"
                          type="button"
                        >
                          <Camera className="h-4 w-4" />
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
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Photo
                    </Button>
                    <Button type="button" variant="ghost">
                      <Trash2 className="mr-2 h-4 w-4" />
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
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
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

            {/* Action Bar - Sticky */}
            <div className="sticky bottom-0 z-10 rounded-xl border bg-card p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hasChanges ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Unsaved Changes</p>
                        <p className="text-muted-foreground text-xs">
                          Save your changes or cancel to discard
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">All Changes Saved</p>
                        <p className="text-muted-foreground text-xs">
                          Your profile is up to date
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    disabled={isSubmitting || !hasChanges}
                    onClick={() => {
                      form.reset();
                      setHasChanges(false);
                    }}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isSubmitting || !hasChanges} type="submit">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  );
}
