/**
 * Lazy-loaded Framer Motion Components
 *
 * Performance optimization:
 * - Dynamically imports framer-motion only when animations are needed
 * - Reduces initial bundle size by ~50KB
 * - Particularly useful for TV leaderboard and animated components
 */

"use client";

import type { HTMLMotionProps } from "framer-motion";
import dynamic from "next/dynamic";

// Loading placeholder (invisible, maintains layout)
const MotionLoadingPlaceholder = ({ children, ...props }: any) => (
	<div {...props}>{children}</div>
);

// Lazy load motion.div
export const LazyMotionDiv = dynamic<HTMLMotionProps<"div">>(
	() => import("framer-motion").then((mod) => mod.motion.div),
	{
		ssr: false,
		loading: () => <MotionLoadingPlaceholder />,
	},
);

// Lazy load motion.span
export const LazyMotionSpan = dynamic<HTMLMotionProps<"span">>(
	() => import("framer-motion").then((mod) => mod.motion.span),
	{
		ssr: false,
		loading: () => <MotionLoadingPlaceholder as="span" />,
	},
);

// Lazy load motion.button
export const LazyMotionButton = dynamic<HTMLMotionProps<"button">>(
	() => import("framer-motion").then((mod) => mod.motion.button),
	{
		ssr: false,
		loading: () => <MotionLoadingPlaceholder as="button" />,
	},
);

// Lazy load motion.svg
export const LazyMotionSvg = dynamic<any>(
	() => import("framer-motion").then((mod) => mod.motion.svg),
	{
		ssr: false,
		loading: () => <MotionLoadingPlaceholder as="svg" />,
	},
);

// Lazy load motion.path
export const LazyMotionPath = dynamic<any>(
	() => import("framer-motion").then((mod) => mod.motion.path),
	{
		ssr: false,
		loading: () => <MotionLoadingPlaceholder as="path" />,
	},
);

// Lazy load AnimatePresence
export const LazyAnimatePresence = dynamic(
	() => import("framer-motion").then((mod) => mod.AnimatePresence),
	{
		ssr: false,
	},
);

// Re-export lightweight hooks and utilities
export { useAnimation, useAnimationControls, useInView } from "framer-motion";
