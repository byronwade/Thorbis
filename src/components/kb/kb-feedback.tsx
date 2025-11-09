/**
 * KB Feedback - Client Component
 *
 * Allows users to submit feedback (helpful/not helpful) on articles
 */

"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitKBFeedback } from "@/actions/kb";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface KBFeedbackProps {
  articleId: string;
  helpfulCount: number;
  notHelpfulCount: number;
  className?: string;
}

export function KBFeedback({
  articleId,
  helpfulCount,
  notHelpfulCount,
  className,
}: KBFeedbackProps) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFeedback = async (value: boolean) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const result = await submitKBFeedback({
      articleId,
      helpful: value,
    });

    if (result.success) {
      setHelpful(value);
      toast.success("Thank you! Your feedback helps us improve our documentation.");
    } else {
      toast.error(result.error || "Failed to submit feedback");
    }
    setIsSubmitting(false);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await submitKBFeedback({
      articleId,
      comment: comment.trim(),
    });

    if (result.success) {
      setComment("");
      toast.success("Thank you! Your comment has been submitted.");
    } else {
      toast.error(result.error || "Failed to submit comment");
    }
    setIsSubmitting(false);
  };

  return (
    <div className={cn("space-y-4 border-t pt-6", className)}>
      <div>
        <h3 className="font-semibold text-sm mb-2">Was this article helpful?</h3>
        <div className="flex items-center gap-4">
          <Button
            variant={helpful === true ? "default" : "outline"}
            size="sm"
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting || helpful === true}
          >
            <ThumbsUp className="mr-2 size-4" />
            Yes ({helpfulCount})
          </Button>
          <Button
            variant={helpful === false ? "default" : "outline"}
            size="sm"
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting || helpful === false}
          >
            <ThumbsDown className="mr-2 size-4" />
            No ({notHelpfulCount})
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-2">Have a comment or suggestion?</h3>
        <div className="space-y-2">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            size="sm"
            onClick={handleCommentSubmit}
            disabled={!comment.trim() || isSubmitting}
          >
            <MessageSquare className="mr-2 size-4" />
            Submit Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

