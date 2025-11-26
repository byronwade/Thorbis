"use client";

import { AlertCircle, Download, File, Image as ImageIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EmailAttachment {
	id?: string;
	name?: string;
	filename?: string;
	path?: string;
	type?: string;
	content_type?: string;
	storage_url?: string;
	storage_path?: string;
	storage_bucket?: string;
}

interface EmailContentProps {
	html: string | null;
	text: string | null;
	attachments?: EmailAttachment[] | null;
	className?: string;
}

/**
 * Safely renders email content with HTML sanitization
 * Follows best practices for rendering received emails from Resend
 */
export function EmailContent({
	html,
	text,
	attachments,
	className,
}: EmailContentProps) {
	const [DOMPurify, setDOMPurify] = useState<
		typeof import("dompurify").default | null
	>(null);

	// Dynamically import DOMPurify only on client side (browser-only, no jsdom needed)
	useEffect(() => {
		if (typeof window !== "undefined") {
			import("dompurify").then((mod) => {
				setDOMPurify(() => mod.default);
			});
		}
	}, []);

	// Sanitize HTML to prevent XSS attacks while preserving email styles
	const safeHtml = useMemo(() => {
		if (!html) return null;
		if (!DOMPurify) return null; // Don't render unsanitized HTML - wait for DOMPurify to load

		// DOMPurify configuration for email HTML
		// Allows common email HTML patterns while removing dangerous scripts
		// Preserves inline styles, classes, and <style> tags for original email design
		const sanitized = DOMPurify.sanitize(html, {
			ALLOWED_TAGS: [
				"p",
				"br",
				"strong",
				"em",
				"u",
				"b",
				"i",
				"s",
				"strike",
				"a",
				"ul",
				"ol",
				"li",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"blockquote",
				"img",
				"table",
				"thead",
				"tbody",
				"tfoot",
				"tr",
				"th",
				"td",
				"div",
				"span",
				"hr",
				"pre",
				"code",
				"font",
				"center",
				"section",
				"article",
				"header",
				"footer",
				"main",
				"style", // Allow <style> tags for email CSS
			],
			ALLOWED_ATTR: [
				"href",
				"src",
				"alt",
				"title",
				"width",
				"height",
				"style", // Preserve inline styles
				"class", // Preserve classes
				"id",
				"align",
				"valign",
				"border",
				"cellpadding",
				"cellspacing",
				"bgcolor",
				"color",
				"face",
				"size",
				"colspan",
				"rowspan",
				"target",
				"rel",
			],
			ALLOW_DATA_ATTR: false,
			// Allow safe URLs (http, https, mailto, data URIs for images)
			ALLOWED_URI_REGEXP:
				/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
			// Keep relative URLs
			KEEP_CONTENT: true,
			// Allow <style> tags (they'll be sanitized but preserved)
			ADD_TAGS: ["style"],
			ADD_ATTR: ["media", "type"], // Allow style tag attributes
		});

		return sanitized;
	}, [html, DOMPurify]);

	// Convert text to paragraphs if no HTML
	const textContent = useMemo(() => {
		if (text) {
			// Split by double newlines for paragraphs, single newlines for line breaks
			return text.split(/\n\n+/).map((paragraph, i) => (
				<p key={i} className="mb-4 last:mb-0">
					{paragraph.split("\n").map((line, j, arr) => (
						<span key={j}>
							{line}
							{j < arr.length - 1 && <br />}
						</span>
					))}
				</p>
			));
		}
		return null;
	}, [text]);

	const hasAttachments = attachments && attachments.length > 0;

	return (
		<div className={cn("flex flex-col gap-4", className)}>
			{/* Email Body - Isolated container to preserve original email styles */}
			<div className="email-content-wrapper prose prose-sm dark:prose-invert max-w-none">
				{safeHtml ? (
					<div
						className="email-content-html text-sm leading-relaxed"
						style={{
							// Reset some aggressive email styles to ensure readability
							fontSize: "14px",
							lineHeight: "1.6",
							color: "inherit",
						}}
						dangerouslySetInnerHTML={{ __html: safeHtml }}
					/>
				) : html && !DOMPurify ? (
					// Show text fallback while DOMPurify loads
					textContent ? (
						<div className="text-sm leading-relaxed text-foreground">
							{textContent}
						</div>
					) : (
						<div className="flex items-center justify-center py-8">
							<div className="text-sm text-muted-foreground italic">
								Loading email content...
							</div>
						</div>
					)
				) : textContent ? (
					<div className="text-sm leading-relaxed text-foreground">
						{textContent}
					</div>
				) : (
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<svg
								width="64"
								height="64"
								viewBox="0 0 192 192"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="mx-auto mb-4 opacity-30"
							>
								<rect
									width="192"
									height="192"
									rx="96"
									fill="currentColor"
									fillOpacity="0.15"
								/>
							</svg>
							<p className="text-sm font-medium text-muted-foreground mb-1">
								No content available
							</p>
							<p className="text-xs text-muted-foreground">
								This email may have been deleted or expired
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Attachments */}
			{hasAttachments && (
				<div className="border-t border-border/50 pt-4">
					<h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
						<File className="h-4 w-4" />
						Attachments ({attachments.length})
					</h3>
					<div className="flex flex-col gap-2">
						{attachments.map((attachment, index) => (
							<AttachmentItem
								key={attachment.id || attachment.path || index}
								attachment={attachment}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function AttachmentItem({ attachment }: { attachment: EmailAttachment }) {
	const filename = attachment.filename || attachment.name || "attachment";
	const contentType = attachment.content_type || attachment.type || "";
	const isImage = contentType.startsWith("image/");

	// Check if we have a valid download URL
	const downloadUrl = attachment.storage_url || null;
	const hasDownloadUrl = !!downloadUrl && downloadUrl !== "#";

	// Handler for unavailable downloads
	const handleUnavailableDownload = useCallback(() => {
		toast.error("Attachment unavailable", {
			description:
				"This attachment cannot be downloaded. The file may have expired or been removed.",
		});
	}, []);

	return (
		<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
			<div className="flex-shrink-0">
				{isImage ? (
					<ImageIcon className="h-5 w-5 text-muted-foreground" />
				) : (
					<File className="h-5 w-5 text-muted-foreground" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">{filename}</p>
				<div className="flex items-center gap-1.5">
					{contentType && (
						<span className="text-xs text-muted-foreground">{contentType}</span>
					)}
					{!hasDownloadUrl && (
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="text-xs text-orange-500 flex items-center gap-0.5">
									<AlertCircle className="h-3 w-3" />
									Unavailable
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>This attachment cannot be downloaded</p>
							</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>
			{hasDownloadUrl ? (
				<Button variant="ghost" size="sm" className="flex-shrink-0" asChild>
					<a
						href={downloadUrl}
						download={filename}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Download className="h-4 w-4" />
						<span className="sr-only">Download {filename}</span>
					</a>
				</Button>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="flex-shrink-0 opacity-50"
							onClick={handleUnavailableDownload}
						>
							<Download className="h-4 w-4" />
							<span className="sr-only">Download {filename}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Attachment unavailable for download</p>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}
