"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pin,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import type { PinBoardPost } from "@/lib/queries/pin-board";
import { togglePinBoardPostPin, deletePinBoardPost, markPostAsViewed } from "@/actions/pin-board";
import { formatDistanceToNow } from "date-fns";
import { PinBoardFilePreview, AttachmentIndicator } from "./pin-board-file-preview";

// Color mapping for category badges
const CATEGORY_COLORS: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  red: "bg-red-500/10 text-red-500 border-red-500/20",
  yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

interface PinBoardPostCardProps {
  post: PinBoardPost;
  onEdit: () => void;
}

export function PinBoardPostCard({ post, onEdit }: PinBoardPostCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryColor = post.category?.color
    ? CATEGORY_COLORS[post.category.color] || CATEGORY_COLORS.blue
    : CATEGORY_COLORS.blue;

  const handleView = async () => {
    setIsViewOpen(true);
    // Track view
    await markPostAsViewed(post.id);
  };

  const handleTogglePin = async () => {
    await togglePinBoardPostPin(post.id);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(true);
    await deletePinBoardPost(post.id);
    setIsDeleting(false);
  };

  const formattedDate = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
    : formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <>
      <Card
        className={`group cursor-pointer hover:shadow-md transition-all ${
          post.is_pinned ? "ring-1 ring-primary/20" : ""
        }`}
        onClick={handleView}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {post.is_pinned && (
                  <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
                {post.category && (
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${categoryColor}`}>
                    {post.category.name}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base line-clamp-2">{post.title}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePin}>
                  <Pin className="h-4 w-4 mr-2" />
                  {post.is_pinned ? "Unpin" : "Pin to Top"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {post.excerpt && (
            <CardDescription className="line-clamp-2 mt-1">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            {post.attachments && post.attachments.length > 0 && (
              <AttachmentIndicator attachments={post.attachments} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {post.is_pinned && <Pin className="h-4 w-4 text-primary" />}
              {post.category && (
                <Badge variant="outline" className={`text-xs ${categoryColor}`}>
                  {post.category.name}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl">{post.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Content */}
            {post.content ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-muted-foreground italic">No content</p>
            )}

            {/* Attachments with Preview Support */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="border-t pt-4">
                <PinBoardFilePreview attachments={post.attachments} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { setIsViewOpen(false); onEdit(); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
