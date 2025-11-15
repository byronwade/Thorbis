/**
 * Add Tag Badge Component
 * Quick inline tag creation with custom colors
 */

"use client";

import { Check, Plus, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  type TagWithColor,
  updateCustomerTags,
  updateJobTags,
} from "@/actions/job-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddTagBadgeProps = {
  customerId?: string;
  jobId?: string;
  customerTags?: TagWithColor[];
  jobTags?: TagWithColor[];
};

const PRESET_COLORS = [
  {
    name: "Red",
    value: "red",
    class:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
  },
  {
    name: "Orange",
    value: "orange",
    class:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30",
  },
  {
    name: "Amber",
    value: "amber",
    class:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
  },
  {
    name: "Yellow",
    value: "yellow",
    class:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30",
  },
  {
    name: "Green",
    value: "green",
    class:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30",
  },
  {
    name: "Emerald",
    value: "emerald",
    class:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
  },
  {
    name: "Teal",
    value: "teal",
    class:
      "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30",
  },
  {
    name: "Blue",
    value: "blue",
    class:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
  },
  {
    name: "Indigo",
    value: "indigo",
    class:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30",
  },
  {
    name: "Purple",
    value: "purple",
    class:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30",
  },
  {
    name: "Pink",
    value: "pink",
    class:
      "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-900/30",
  },
  {
    name: "Gray",
    value: "gray",
    class:
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/30",
  },
];

export function AddTagBadge({
  customerId,
  jobId,
  customerTags = [],
  jobTags = [],
}: AddTagBadgeProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [tagLabel, setTagLabel] = useState("");
  const [tagColor, setTagColor] = useState("blue");
  const [tagType, setTagType] = useState<"customer" | "job">(
    customerId ? "customer" : "job"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!tagLabel.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    setIsSaving(true);
    try {
      const newTag: TagWithColor = {
        label: tagLabel.trim(),
        color: tagColor,
      };

      if (tagType === "customer" && customerId) {
        const updatedTags = [...customerTags, newTag];
        const result = await updateCustomerTags(customerId, updatedTags);
        if (result.success) {
          toast.success("Customer tag added");
          router.refresh();
          setIsOpen(false);
          setTagLabel("");
          setTagColor("blue");
        } else {
          toast.error(result.error || "Failed to add tag");
        }
      } else if (tagType === "job" && jobId) {
        const updatedTags = [...jobTags, newTag];
        const result = await updateJobTags(jobId, updatedTags);
        if (result.success) {
          toast.success("Job tag added");
          router.refresh();
          setIsOpen(false);
          setTagLabel("");
          setTagColor("blue");
        } else {
          toast.error(result.error || "Failed to add tag");
        }
      }
    } catch (error) {
      toast.error("Failed to add tag");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedColor = PRESET_COLORS.find((c) => c.value === tagColor);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border/60 border-dashed bg-background px-3 py-1.5 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
          <Plus className="size-3" />
          <span>Add Tag</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80" side="bottom">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Create Custom Tag</h4>
            <p className="text-muted-foreground text-xs">
              Add a custom tag with your choice of color
            </p>
          </div>

          {/* Tag Label Input */}
          <div className="space-y-2">
            <Label htmlFor="tag-label">Tag Name</Label>
            <Input
              id="tag-label"
              onChange={(e) => setTagLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              placeholder="e.g., High Priority, VIP, etc."
              value={tagLabel}
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="tag-color">Color</Label>
            <Select onValueChange={setTagColor} value={tagColor}>
              <SelectTrigger id="tag-color">
                <SelectValue>
                  {selectedColor && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${selectedColor.class}`}
                      />
                      <span>{selectedColor.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PRESET_COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${color.class}`} />
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Type Selection (if both customer and job available) */}
          {customerId && jobId && (
            <div className="space-y-2">
              <Label htmlFor="tag-type">Apply To</Label>
              <Select
                onValueChange={(value) =>
                  setTagType(value as "customer" | "job")
                }
                value={tagType}
              >
                <SelectTrigger id="tag-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer (all jobs)</SelectItem>
                  <SelectItem value="job">Job (this job only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview */}
          {tagLabel && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-sm ${selectedColor?.class}`}
              >
                <Tag className="size-3" />
                <span>{tagLabel}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={isSaving || !tagLabel.trim()}
              onClick={handleSave}
            >
              {isSaving ? (
                <>
                  <Check className="mr-2 size-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Add Tag
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
