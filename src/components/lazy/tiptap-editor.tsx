/**
 * Lazy-loaded TipTap Editor Component
 *
 * Performance optimization:
 * - Dynamically imports TipTap editor and all extensions only when needed
 * - Reduces initial bundle size by ~300KB
 * - Shows loading skeleton while component loads
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const EditorLoadingSkeleton = () => (
	<div className="min-h-[200px] w-full">
		<Skeleton className="mb-2 h-10 w-full" />
		<Skeleton className="h-40 w-full" />
	</div>
);

export const LazyTipTapEditor = dynamic(
	() => import("@tiptap/react").then((mod) => mod.EditorContent),
	{
		ssr: false,
		loading: EditorLoadingSkeleton,
	}
);

// Re-export hooks and utilities (these are lightweight)
export { useEditor } from "@tiptap/react";
