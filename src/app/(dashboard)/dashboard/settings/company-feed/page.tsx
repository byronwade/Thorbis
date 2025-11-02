"use client";

/**
 * Settings > Company Feed Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Archive,
  Award,
  Bell,
  Calendar,
  Eye,
  FileText,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Save,
  Share2,
  Shield,
  Tag,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { getCompanyFeedSettings, updateCompanyFeedSettings } from "@/actions/company";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const SIMULATED_API_DELAY = 1500;
const DEFAULT_POST_LENGTH = 5000;
const DEFAULT_RETENTION_DAYS = 365;

type CompanyFeedSettings = {
  // General Settings
  feedEnabled: boolean;
  feedName: string;
  feedDescription: string;
  feedVisibility: "all_employees" | "role_based" | "department_based";

  // Post Settings
  allowPosts: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  allowSharing: boolean;
  requireApproval: boolean;
  maxPostLength: number;

  // Content Types
  allowTextPosts: boolean;
  allowImageUploads: boolean;
  allowVideoUploads: boolean;
  allowDocumentUploads: boolean;
  allowLinkSharing: boolean;
  allowPolls: boolean;
  allowEvents: boolean;

  // Media Settings
  maxImageSize: number; // MB
  maxVideoSize: number; // MB
  maxDocumentSize: number; // MB
  allowedImageFormats: string[];
  allowedVideoFormats: string[];
  allowedDocumentFormats: string[];

  // Moderation
  enableModeration: boolean;
  moderatorRoles: string[];
  autoModerateKeywords: boolean;
  blockedKeywords: string[];
  flagThreshold: number;

  // Notifications
  notifyOnMention: boolean;
  notifyOnReply: boolean;
  notifyOnReaction: boolean;
  notifyOnNewPost: boolean;
  digestFrequency: "none" | "daily" | "weekly";

  // Content Portal
  enableContentPortal: boolean;
  portalCategories: string[];
  allowContentRating: boolean;
  allowContentBookmarking: boolean;
  featuredContentDuration: number; // days

  // Customer-Facing Content
  enableCustomerContent: boolean;
  customerContentApproval: boolean;
  customerContentCategories: string[];
  showCustomerTestimonials: boolean;

  // Analytics & Insights
  trackEngagement: boolean;
  showViewCounts: boolean;
  showLikeCounts: boolean;
  showShareCounts: boolean;
  enableLeaderboard: boolean;

  // Data Management
  archiveOldPosts: boolean;
  archiveAfterDays: number;
  allowPostEditing: boolean;
  editTimeLimit: number; // minutes
  allowPostDeletion: boolean;
  retainDeletedPosts: boolean;
  retentionPeriod: number; // days
};

export default function CompanyFeedSettingsPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings<CompanyFeedSettings>({
    getter: getCompanyFeedSettings,
    setter: updateCompanyFeedSettings,
    initialState: {
    // General Settings
    feedEnabled: true,
    feedName: "Company Feed",
    feedDescription:
      "Stay connected with your team through company-wide announcements, updates, and conversations",
    feedVisibility: "all_employees",

    // Post Settings
    allowPosts: true,
    allowComments: true,
    allowReactions: true,
    allowSharing: true,
    requireApproval: false,
    maxPostLength: DEFAULT_POST_LENGTH,

    // Content Types
    allowTextPosts: true,
    allowImageUploads: true,
    allowVideoUploads: true,
    allowDocumentUploads: true,
    allowLinkSharing: true,
    allowPolls: true,
    allowEvents: true,

    // Media Settings
    maxImageSize: 10,
    maxVideoSize: 100,
    maxDocumentSize: 25,
    allowedImageFormats: ["jpg", "jpeg", "png", "gif", "webp"],
    allowedVideoFormats: ["mp4", "mov", "avi", "webm"],
    allowedDocumentFormats: [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ],

    // Moderation
    enableModeration: true,
    moderatorRoles: ["Admin", "Manager"],
    autoModerateKeywords: true,
    blockedKeywords: [],
    flagThreshold: 3,

    // Notifications
    notifyOnMention: true,
    notifyOnReply: true,
    notifyOnReaction: false,
    notifyOnNewPost: false,
    digestFrequency: "daily",

    // Content Portal
    enableContentPortal: true,
    portalCategories: [
      "Announcements",
      "Training Materials",
      "Company Policies",
      "Best Practices",
      "Success Stories",
    ],
    allowContentRating: true,
    allowContentBookmarking: true,
    featuredContentDuration: 7,

    // Customer-Facing Content
    enableCustomerContent: true,
    customerContentApproval: true,
    customerContentCategories: [
      "Service Tips",
      "Maintenance Guides",
      "FAQ",
      "Testimonials",
    ],
    showCustomerTestimonials: true,

    // Analytics & Insights
    trackEngagement: true,
    showViewCounts: true,
    showLikeCounts: true,
    showShareCounts: true,
    enableLeaderboard: true,

    // Data Management
    archiveOldPosts: true,
    archiveAfterDays: 90,
    allowPostEditing: true,
    editTimeLimit: 30,
    allowPostDeletion: true,
    retainDeletedPosts: true,
    retentionPeriod: DEFAULT_RETENTION_DAYS,
    },
    settingsName: "company feed",
    transformLoad: (data) => ({
      feedEnabled: data.company_feed_enabled ?? true,
      feedVisibility: data.feed_visibility === "all_team" ? "all_employees" : "role_based",
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      formData.append("feedEnabled", settings.feedEnabled.toString());
      formData.append("feedVisibility", settings.feedVisibility === "all_employees" ? "all_team" : "role_based");
      return formData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-4xl tracking-tight">
            Company Feed Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure your internal social platform for company-wide
            communication and content sharing
          </p>
        </div>

        <Separator />

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              General Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Basic configuration for your company feed platform
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Enable and configure the company feed for internal communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Company Feed
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Turn the company feed on or off for all employees
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Make the feed visible and accessible to users
                </p>
              </div>
              <Switch
                checked={settings.feedEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("feedEnabled", checked)
                }
              />
            </div>

            {settings.feedEnabled && (
              <>
                <Separator />

                <div>
                  <Label className="font-medium text-sm">Feed Name</Label>
                  <Input
                    className="mt-2"
                    onChange={(e) => updateSetting("feedName", e.target.value)}
                    placeholder="Company Feed"
                    value={settings.feedName}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    This will appear as the title in the navigation
                  </p>
                </div>

                <div>
                  <Label className="font-medium text-sm">
                    Feed Description
                  </Label>
                  <Textarea
                    className="mt-2"
                    onChange={(e) =>
                      updateSetting("feedDescription", e.target.value)
                    }
                    placeholder="Describe the purpose of your company feed..."
                    rows={3}
                    value={settings.feedDescription}
                  />
                  <p className="mt-1 text-muted-foreground text-xs">
                    Help text shown to users when they first access the feed
                  </p>
                </div>

                <div>
                  <Label className="font-medium text-sm">Visibility</Label>
                  <Select
                    onValueChange={(value) =>
                      updateSetting(
                        "feedVisibility",
                        value as CompanyFeedSettings["feedVisibility"]
                      )
                    }
                    value={settings.feedVisibility}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_employees">
                        All Employees - Everyone can see all posts
                      </SelectItem>
                      <SelectItem value="role_based">
                        Role Based - Filter content by user role
                      </SelectItem>
                      <SelectItem value="department_based">
                        Department Based - Filter content by department
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Control who can see what content on the feed
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Post Settings */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="size-4" />
                Post Settings
              </CardTitle>
              <CardDescription>
                Configure what users can post and how they can interact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">Allow Posts</Label>
                    <p className="text-muted-foreground text-xs">
                      Users can create posts
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowPosts}
                    onCheckedChange={(checked) =>
                      updateSetting("allowPosts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Allow Comments
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Users can comment on posts
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowComments}
                    onCheckedChange={(checked) =>
                      updateSetting("allowComments", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Allow Reactions
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Users can react with emojis
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowReactions}
                    onCheckedChange={(checked) =>
                      updateSetting("allowReactions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">Allow Sharing</Label>
                    <p className="text-muted-foreground text-xs">
                      Users can share posts
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowSharing}
                    onCheckedChange={(checked) =>
                      updateSetting("allowSharing", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Require Approval
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          All posts must be approved by moderators before
                          appearing
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Posts need approval before publishing
                  </p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) =>
                    updateSetting("requireApproval", checked)
                  }
                />
              </div>

              <div>
                <Label className="font-medium text-sm">
                  Maximum Post Length
                </Label>
                <div className="relative mt-2">
                  <Input
                    min="100"
                    onChange={(e) =>
                      updateSetting("maxPostLength", Number(e.target.value))
                    }
                    type="number"
                    value={settings.maxPostLength}
                  />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    characters
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Limit how long posts can be (100-10,000 characters)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Types */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Content Types
              </CardTitle>
              <CardDescription>
                Choose what types of content users can share
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Text Posts
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowTextPosts}
                    onCheckedChange={(checked) =>
                      updateSetting("allowTextPosts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Image Uploads
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowImageUploads}
                    onCheckedChange={(checked) =>
                      updateSetting("allowImageUploads", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <Video className="h-3.5 w-3.5" />
                      Video Uploads
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowVideoUploads}
                    onCheckedChange={(checked) =>
                      updateSetting("allowVideoUploads", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <FileText className="h-3.5 w-3.5" />
                      Document Uploads
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowDocumentUploads}
                    onCheckedChange={(checked) =>
                      updateSetting("allowDocumentUploads", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <Globe className="h-3.5 w-3.5" />
                      Link Sharing
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowLinkSharing}
                    onCheckedChange={(checked) =>
                      updateSetting("allowLinkSharing", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Polls
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowPolls}
                    onCheckedChange={(checked) =>
                      updateSetting("allowPolls", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium text-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      Events
                    </Label>
                  </div>
                  <Switch
                    checked={settings.allowEvents}
                    onCheckedChange={(checked) =>
                      updateSetting("allowEvents", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Settings */}
        {settings.feedEnabled &&
          (settings.allowImageUploads ||
            settings.allowVideoUploads ||
            settings.allowDocumentUploads) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="size-4" />
                  Media Settings
                </CardTitle>
                <CardDescription>
                  Configure file size limits and allowed formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.allowImageUploads && (
                  <div>
                    <Label className="font-medium text-sm">
                      Maximum Image Size
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        min="1"
                        onChange={(e) =>
                          updateSetting("maxImageSize", Number(e.target.value))
                        }
                        type="number"
                        value={settings.maxImageSize}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        MB
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      Allowed formats: {settings.allowedImageFormats.join(", ")}
                    </p>
                  </div>
                )}

                {settings.allowVideoUploads && (
                  <div>
                    <Label className="font-medium text-sm">
                      Maximum Video Size
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        min="1"
                        onChange={(e) =>
                          updateSetting("maxVideoSize", Number(e.target.value))
                        }
                        type="number"
                        value={settings.maxVideoSize}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        MB
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      Allowed formats: {settings.allowedVideoFormats.join(", ")}
                    </p>
                  </div>
                )}

                {settings.allowDocumentUploads && (
                  <div>
                    <Label className="font-medium text-sm">
                      Maximum Document Size
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        min="1"
                        onChange={(e) =>
                          updateSetting(
                            "maxDocumentSize",
                            Number(e.target.value)
                          )
                        }
                        type="number"
                        value={settings.maxDocumentSize}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        MB
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      Allowed formats:{" "}
                      {settings.allowedDocumentFormats.join(", ")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        {/* Content Moderation */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4" />
                Content Moderation
              </CardTitle>
              <CardDescription>
                Manage content quality and enforce community guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Enable Moderation
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Allow designated moderators to review and remove
                          content
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Enable content moderation tools
                  </p>
                </div>
                <Switch
                  checked={settings.enableModeration}
                  onCheckedChange={(checked) =>
                    updateSetting("enableModeration", checked)
                  }
                />
              </div>

              {settings.enableModeration && (
                <>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Auto-Moderate Keywords
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Flag posts containing blocked keywords
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoModerateKeywords}
                      onCheckedChange={(checked) =>
                        updateSetting("autoModerateKeywords", checked)
                      }
                    />
                  </div>

                  <div>
                    <Label className="font-medium text-sm">
                      Flag Threshold
                    </Label>
                    <Input
                      className="mt-2"
                      min="1"
                      onChange={(e) =>
                        updateSetting("flagThreshold", Number(e.target.value))
                      }
                      type="number"
                      value={settings.flagThreshold}
                    />
                    <p className="mt-1 text-muted-foreground text-xs">
                      Number of flags before a post is hidden for review
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notifications */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure default notification preferences for users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Notify on Mention
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      When someone @mentions you
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifyOnMention}
                    onCheckedChange={(checked) =>
                      updateSetting("notifyOnMention", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Notify on Reply
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      When someone replies to your post
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifyOnReply}
                    onCheckedChange={(checked) =>
                      updateSetting("notifyOnReply", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Notify on Reaction
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      When someone reacts to your post
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifyOnReaction}
                    onCheckedChange={(checked) =>
                      updateSetting("notifyOnReaction", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium text-sm">
                      Notify on New Post
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      When new company posts are published
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifyOnNewPost}
                    onCheckedChange={(checked) =>
                      updateSetting("notifyOnNewPost", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="font-medium text-sm">Digest Frequency</Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting(
                      "digestFrequency",
                      value as CompanyFeedSettings["digestFrequency"]
                    )
                  }
                  value={settings.digestFrequency}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      None - No digest emails
                    </SelectItem>
                    <SelectItem value="daily">
                      Daily - Send daily summary
                    </SelectItem>
                    <SelectItem value="weekly">
                      Weekly - Send weekly summary
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-muted-foreground text-xs">
                  How often to send email summaries of feed activity
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Portal */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="size-4" />
                Content Portal
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Organized library of training materials, policies, and
                      resources
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                Structured content library for company resources and knowledge
                base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Enable Content Portal
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Separate organized section for training materials,
                          policies, and documents
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Create a structured knowledge base
                  </p>
                </div>
                <Switch
                  checked={settings.enableContentPortal}
                  onCheckedChange={(checked) =>
                    updateSetting("enableContentPortal", checked)
                  }
                />
              </div>

              {settings.enableContentPortal && (
                <>
                  <Separator />

                  <div>
                    <Label className="font-medium text-sm">
                      Portal Categories
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {settings.portalCategories.map((category, index) => (
                        <div
                          className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1"
                          key={index}
                        >
                          <Tag className="h-3 w-3" />
                          <span className="text-sm">{category}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Organize content into these categories
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="font-medium text-sm">
                          Allow Content Rating
                        </Label>
                        <p className="text-muted-foreground text-xs">
                          Users can rate content helpfulness
                        </p>
                      </div>
                      <Switch
                        checked={settings.allowContentRating}
                        onCheckedChange={(checked) =>
                          updateSetting("allowContentRating", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="font-medium text-sm">
                          Allow Bookmarking
                        </Label>
                        <p className="text-muted-foreground text-xs">
                          Users can save content for later
                        </p>
                      </div>
                      <Switch
                        checked={settings.allowContentBookmarking}
                        onCheckedChange={(checked) =>
                          updateSetting("allowContentBookmarking", checked)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium text-sm">
                      Featured Content Duration
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        min="1"
                        onChange={(e) =>
                          updateSetting(
                            "featuredContentDuration",
                            Number(e.target.value)
                          )
                        }
                        type="number"
                        value={settings.featuredContentDuration}
                      />
                      <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                        days
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">
                      How long content stays featured on the portal homepage
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Customer-Facing Content */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="size-4" />
                Customer-Facing Content
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Publish curated content for your customers to view
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                Share company-approved content with customers through your
                portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Enable Customer Content
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Publish service tips, guides, and resources for
                          customers
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Make content visible in customer portal
                  </p>
                </div>
                <Switch
                  checked={settings.enableCustomerContent}
                  onCheckedChange={(checked) =>
                    updateSetting("enableCustomerContent", checked)
                  }
                />
              </div>

              {settings.enableCustomerContent && (
                <>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Require Approval
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Review before publishing to customers
                      </p>
                    </div>
                    <Switch
                      checked={settings.customerContentApproval}
                      onCheckedChange={(checked) =>
                        updateSetting("customerContentApproval", checked)
                      }
                    />
                  </div>

                  <div>
                    <Label className="font-medium text-sm">
                      Customer Content Categories
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {settings.customerContentCategories.map(
                        (category, index) => (
                          <div
                            className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1"
                            key={index}
                          >
                            <Tag className="h-3 w-3" />
                            <span className="text-sm">{category}</span>
                          </div>
                        )
                      )}
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Organize customer-facing content into categories
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Show Customer Testimonials
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Display customer reviews and success stories
                      </p>
                    </div>
                    <Switch
                      checked={settings.showCustomerTestimonials}
                      onCheckedChange={(checked) =>
                        updateSetting("showCustomerTestimonials", checked)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Analytics & Insights */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4" />
                Analytics & Insights
              </CardTitle>
              <CardDescription>
                Track engagement and measure content performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Track Engagement
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Collect analytics on views, likes, shares, and
                          comments
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Enable engagement analytics
                  </p>
                </div>
                <Switch
                  checked={settings.trackEngagement}
                  onCheckedChange={(checked) =>
                    updateSetting("trackEngagement", checked)
                  }
                />
              </div>

              {settings.trackEngagement && (
                <>
                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="flex items-center gap-2 font-medium text-sm">
                          <Eye className="h-3.5 w-3.5" />
                          Show View Counts
                        </Label>
                      </div>
                      <Switch
                        checked={settings.showViewCounts}
                        onCheckedChange={(checked) =>
                          updateSetting("showViewCounts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="flex items-center gap-2 font-medium text-sm">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Show Like Counts
                        </Label>
                      </div>
                      <Switch
                        checked={settings.showLikeCounts}
                        onCheckedChange={(checked) =>
                          updateSetting("showLikeCounts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="flex items-center gap-2 font-medium text-sm">
                          <Share2 className="h-3.5 w-3.5" />
                          Show Share Counts
                        </Label>
                      </div>
                      <Switch
                        checked={settings.showShareCounts}
                        onCheckedChange={(checked) =>
                          updateSetting("showShareCounts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="flex items-center gap-2 font-medium text-sm">
                          <Award className="h-3.5 w-3.5" />
                          Enable Leaderboard
                        </Label>
                      </div>
                      <Switch
                        checked={settings.enableLeaderboard}
                        onCheckedChange={(checked) =>
                          updateSetting("enableLeaderboard", checked)
                        }
                      />
                    </div>
                  </div>

                  {settings.enableLeaderboard && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-medium text-sm">
                        <Award className="size-4" />
                        Leaderboard Features
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Leaderboard tracks top contributors based on posts,
                        helpful answers, and engagement. Visible to all users to
                        encourage participation.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Data Management */}
        {settings.feedEnabled && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="size-4" />
                Data Management
              </CardTitle>
              <CardDescription>
                Configure how posts are stored, edited, and archived
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="flex items-center gap-2 font-medium text-sm">
                    Archive Old Posts
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Move old posts to archive to keep feed relevant
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Automatically archive older posts
                  </p>
                </div>
                <Switch
                  checked={settings.archiveOldPosts}
                  onCheckedChange={(checked) =>
                    updateSetting("archiveOldPosts", checked)
                  }
                />
              </div>

              {settings.archiveOldPosts && (
                <div>
                  <Label className="font-medium text-sm">
                    Archive Posts After
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      min="30"
                      onChange={(e) =>
                        updateSetting(
                          "archiveAfterDays",
                          Number(e.target.value)
                        )
                      }
                      type="number"
                      value={settings.archiveAfterDays}
                    />
                    <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                      days
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Posts older than this will be moved to archive
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Allow Post Editing
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Users can edit their posts
                  </p>
                </div>
                <Switch
                  checked={settings.allowPostEditing}
                  onCheckedChange={(checked) =>
                    updateSetting("allowPostEditing", checked)
                  }
                />
              </div>

              {settings.allowPostEditing && (
                <div>
                  <Label className="font-medium text-sm">Edit Time Limit</Label>
                  <div className="relative mt-2">
                    <Input
                      min="5"
                      onChange={(e) =>
                        updateSetting("editTimeLimit", Number(e.target.value))
                      }
                      type="number"
                      value={settings.editTimeLimit}
                    />
                    <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                      minutes
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Users can edit posts within this time window
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium text-sm">
                    Allow Post Deletion
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Users can delete their own posts
                  </p>
                </div>
                <Switch
                  checked={settings.allowPostDeletion}
                  onCheckedChange={(checked) =>
                    updateSetting("allowPostDeletion", checked)
                  }
                />
              </div>

              {settings.allowPostDeletion && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium text-sm">
                        Retain Deleted Posts
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Keep deleted posts in database
                      </p>
                    </div>
                    <Switch
                      checked={settings.retainDeletedPosts}
                      onCheckedChange={(checked) =>
                        updateSetting("retainDeletedPosts", checked)
                      }
                    />
                  </div>

                  {settings.retainDeletedPosts && (
                    <div>
                      <Label className="font-medium text-sm">
                        Retention Period
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          min="30"
                          onChange={(e) =>
                            updateSetting(
                              "retentionPeriod",
                              Number(e.target.value)
                            )
                          }
                          type="number"
                          value={settings.retentionPeriod}
                        />
                        <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                          days
                        </span>
                      </div>
                      <p className="mt-1 text-muted-foreground text-xs">
                        Keep deleted posts for this long before permanent
                        removal
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button disabled={isPending} onClick={() => saveSettings()}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Company Feed Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
