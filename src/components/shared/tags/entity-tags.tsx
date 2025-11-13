/**
 * Entity Tags Component
 * Generic tag display and management for any entity type
 * Works across jobs, customers, properties, invoices, estimates, etc.
 */

"use client";

import { Plus, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ActionResult } from "@/lib/errors/with-error-handling";

export type TagWithColor = {
  label: string;
  color?: string;
};

export type EntityTag = string | TagWithColor;

type EntityTagsProps = {
  entityId: string;
  entityType:
    | "customer"
    | "job"
    | "property"
    | "invoice"
    | "estimate"
    | "equipment"
    | "appointment"
    | "material";
  tags: EntityTag[];
  onUpdateTags: (
    entityId: string,
    tags: EntityTag[]
  ) => Promise<ActionResult<unknown>>;
  readOnly?: boolean;
};

const PRESET_COLORS = [
  { name: "Red", value: "red", class: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" },
  { name: "Orange", value: "orange", class: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30" },
  { name: "Amber", value: "amber", class: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30" },
  { name: "Green", value: "green", class: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30" },
  { name: "Emerald", value: "emerald", class: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30" },
  { name: "Teal", value: "teal", class: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30" },
  { name: "Blue", value: "blue", class: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30" },
  { name: "Indigo", value: "indigo", class: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30" },
  { name: "Purple", value: "purple", class: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30" },
  { name: "Pink", value: "pink", class: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-900/30" },
  { name: "Gray", value: "gray", class: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/30" },
];

const COLOR_CLASSES: Record<string, string> = PRESET_COLORS.reduce(
  (acc, color) => ({ ...acc, [color.value]: color.class }),
  {}
);

export function EntityTags({
  entityId,
  entityType,
  tags,
  onUpdateTags,
  readOnly = false,
}: EntityTagsProps) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tagLabel, setTagLabel] = useState("");
  const [tagColor, setTagColor] = useState("blue");
  const [isSaving, setIsSaving] = useState(false);
  const [tagToRemove, setTagToRemove] = useState<EntityTag | null>(null);

  const getTagLabel = (tag: EntityTag): string => {
    return typeof tag === "string" ? tag : tag.label;
  };

  const getTagColor = (tag: EntityTag): string | undefined => {
    return typeof tag === "string" ? undefined : tag.color;
  };

  const handleAddTag = async () => {
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

      const updatedTags = [...tags, newTag];
      const result = await onUpdateTags(entityId, updatedTags);

      if (result.success) {
        toast.success("Tag added");
        router.refresh();
        setIsAddOpen(false);
        setTagLabel("");
        setTagColor("blue");
      } else {
        toast.error(result.error || "Failed to add tag");
      }
    } catch (error) {
      toast.error("Failed to add tag");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: EntityTag) => {
    try {
      const updatedTags = tags.filter((tag) => {
        const existingLabel = getTagLabel(tag);
        const removeLabel = getTagLabel(tagToRemove);
        return existingLabel !== removeLabel;
      });

      const result = await onUpdateTags(entityId, updatedTags);

      if (result.success) {
        toast.success("Tag removed");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to remove tag");
      }
    } catch (error) {
      toast.error("Failed to remove tag");
    } finally {
      setTagToRemove(null);
    }
  };

  const selectedColor = PRESET_COLORS.find((c) => c.value === tagColor);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Existing Tags */}
        {tags.map((tag, index) => {
          const label = getTagLabel(tag);
          const color = getTagColor(tag);
          const colorClass = color && COLOR_CLASSES[color] 
            ? COLOR_CLASSES[color]
            : COLOR_CLASSES.blue;

          return (
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${colorClass}`}
              key={`${label}-${index}`}
            >
              <Tag className="size-3" />
              <span>{label}</span>
              {!readOnly && (
                <Button
                  className="ml-1 size-4 p-0 hover:bg-black/10 dark:hover:bg-white/10"
                  onClick={() => setTagToRemove(tag)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Add Tag Button */}
        {!readOnly && (
          <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/60 bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5">
                <Plus className="size-3" />
                <span>Add Tag</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80" side="bottom">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">Create Custom Tag</h4>
                  <p className="text-muted-foreground text-xs">
                    Add a custom tag for this {entityType}
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
                        handleAddTag();
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

                {/* Preview */}
                {tagLabel && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${selectedColor?.class}`}
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
                    onClick={() => setIsAddOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={isSaving || !tagLabel.trim()}
                    onClick={handleAddTag}
                  >
                    {isSaving ? "Saving..." : "Add Tag"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!tagToRemove} onOpenChange={() => setTagToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the tag "{tagToRemove ? getTagLabel(tagToRemove) : ""}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => tagToRemove && handleRemoveTag(tagToRemove)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

