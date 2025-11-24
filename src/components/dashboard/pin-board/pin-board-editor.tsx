"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Pin, FileText, Paperclip } from "lucide-react";
import type { PinBoardCategory, PinBoardPost } from "@/lib/queries/pin-board";
import {
  createPinBoardPost,
  updatePinBoardPost,
  uploadPinBoardFile,
  addPinBoardAttachment,
} from "@/actions/pin-board";
import {
  PinBoardFileUpload,
  type UploadedFile,
} from "./pin-board-file-upload";

interface PinBoardEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PinBoardPost | null;
  categories: PinBoardCategory[];
}

export function PinBoardEditorDialog({
  open,
  onOpenChange,
  post,
  categories,
}: PinBoardEditorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("content");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // File upload state
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<
    { file: File; tempId: string }[]
  >([]);

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open) {
      if (post) {
        setTitle(post.title);
        setContent(post.content || "");
        setCategoryId(post.category_id);
        setIsPinned(post.is_pinned);
        setIsPublished(post.is_published);
        // Load existing attachments
        if (post.attachments && post.attachments.length > 0) {
          setFiles(
            post.attachments.map((att) => ({
              id: att.id,
              name: att.file_name,
              size: att.file_size || 0,
              type: att.file_type || "application/octet-stream",
              url: att.file_url,
              status: "success" as const,
              progress: 100,
            }))
          );
        } else {
          setFiles([]);
        }
      } else {
        setTitle("");
        setContent("");
        setCategoryId(null);
        setIsPinned(false);
        setIsPublished(true);
        setFiles([]);
      }
      setPendingFiles([]);
      setError(null);
      setActiveTab("content");
    }
  }, [open, post]);

  // Handle file upload
  const handleUpload = useCallback(
    async (file: File): Promise<{ url: string; id: string } | null> => {
      const formData = new FormData();
      formData.append("file", file);

      // If editing existing post, attach directly
      if (post?.id) {
        formData.append("postId", post.id);
      }

      const result = await uploadPinBoardFile(formData);

      if (result.success && result.data) {
        return { url: result.data.url, id: result.data.id };
      }

      throw new Error(result.error || "Upload failed");
    },
    [post?.id]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = {
        title,
        content,
        categoryId,
        isPinned,
        isPublished,
        priority: 0,
      };

      let postId = post?.id;
      let result;

      if (post) {
        result = await updatePinBoardPost(post.id, data);
      } else {
        result = await createPinBoardPost(data);
        if (result.success && result.data) {
          postId = result.data.id;
        }
      }

      if (!result.success) {
        setError(result.error || "Failed to save post");
        return;
      }

      // If creating a new post, link any uploaded files
      if (!post && postId) {
        const successfulFiles = files.filter((f) => f.status === "success");
        for (const file of successfulFiles) {
          // Re-upload or link the file to the post
          if (file.url && !file.id.startsWith("temp-")) {
            // Already has a real ID, just need to update post_id
            // This is handled in the upload if postId was provided
          } else if (file.url) {
            // Link the temporary upload to the new post
            await addPinBoardAttachment(postId, {
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              fileUrl: file.url,
            });
          }
        }
      }

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const successfulFilesCount = files.filter((f) => f.status === "success").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create New Post"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg mb-4">
              {error}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="attachments" className="gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
                {successfulFilesCount > 0 && (
                  <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                    {successfulFilesCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-y-auto space-y-4 mt-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={categoryId || "none"}
                  onValueChange={(value) =>
                    setCategoryId(value === "none" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content here... (Supports basic HTML)"
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use basic HTML like &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;,
                  &lt;li&gt;, &lt;a href=&quot;...&quot;&gt; for formatting.
                </p>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="pinned"
                    checked={isPinned}
                    onCheckedChange={setIsPinned}
                  />
                  <Label
                    htmlFor="pinned"
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pin className="h-3.5 w-3.5" />
                    Pin to top
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Published
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="flex-1 overflow-y-auto mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Upload Files</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add PDFs, images, Word documents, or spreadsheets to this post.
                    Files will be viewable and downloadable by all team members.
                  </p>
                </div>

                <PinBoardFileUpload
                  files={files}
                  onFilesChange={setFiles}
                  onUpload={handleUpload}
                  disabled={isSubmitting}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
