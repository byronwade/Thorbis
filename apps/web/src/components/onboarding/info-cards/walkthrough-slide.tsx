"use client";

/**
 * Walkthrough Slide - Full-screen educational moment
 *
 * iPhone-style walkthrough slides shown between onboarding steps
 * to educate users about important concepts.
 */

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WalkthroughSlide {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	illustration?: React.ReactNode;
	bullets?: string[];
	accentColor?: string;
}

interface WalkthroughSlideProps {
	slides: WalkthroughSlide[];
	onComplete: () => void;
	onSkip?: () => void;
}

export function WalkthroughSlideshow({
	slides,
	onComplete,
	onSkip,
}: WalkthroughSlideProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentSlide = slides[currentIndex];
	const isLast = currentIndex === slides.length - 1;
	const isFirst = currentIndex === 0;

	const handleNext = () => {
		if (isLast) {
			onComplete();
		} else {
			setCurrentIndex((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (!isFirst) {
			setCurrentIndex((prev) => prev - 1);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
			<div className="relative w-full max-w-lg mx-4">
				{/* Skip button */}
				{onSkip && (
					<button
						onClick={onSkip}
						className="absolute -top-12 right-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Skip intro
						<X className="h-4 w-4" />
					</button>
				)}

				{/* Card */}
				<div className="rounded-2xl bg-card p-8 shadow-2xl">
					{/* Icon */}
					<div
						className={cn(
							"mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full",
							currentSlide.accentColor || "bg-primary/10 text-primary",
						)}
					>
						{currentSlide.icon}
					</div>

					{/* Illustration (optional) */}
					{currentSlide.illustration && (
						<div className="mb-6">{currentSlide.illustration}</div>
					)}

					{/* Content */}
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold mb-3">{currentSlide.title}</h2>
						<p className="text-muted-foreground">{currentSlide.description}</p>

						{/* Bullets */}
						{currentSlide.bullets && currentSlide.bullets.length > 0 && (
							<ul className="mt-4 space-y-2 text-left">
								{currentSlide.bullets.map((bullet, i) => (
									<li key={i} className="flex items-start gap-2 text-sm">
										<span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs flex-shrink-0 mt-0.5">
											{i + 1}
										</span>
										<span className="text-muted-foreground">{bullet}</span>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Progress dots */}
					{slides.length > 1 && (
						<div className="flex justify-center gap-2 mb-6">
							{slides.map((_, i) => (
								<button
									key={i}
									onClick={() => setCurrentIndex(i)}
									className={cn(
										"h-2 rounded-full transition-all",
										i === currentIndex
											? "w-6 bg-primary"
											: "w-2 bg-muted hover:bg-muted-foreground/30",
									)}
								/>
							))}
						</div>
					)}

					{/* Navigation */}
					<div className="flex items-center justify-between gap-3">
						<Button
							variant="ghost"
							onClick={handleBack}
							disabled={isFirst}
							className={cn(isFirst && "invisible")}
						>
							<ChevronLeft className="mr-1 h-4 w-4" />
							Back
						</Button>

						<Button onClick={handleNext} className="min-w-[120px]">
							{isLast ? "Got it!" : "Next"}
							{!isLast && <ChevronRight className="ml-1 h-4 w-4" />}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Single Walkthrough Card - Inline educational component
 */
interface InfoCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	bullets?: string[];
	variant?: "default" | "tip" | "warning" | "success";
	className?: string;
}

function InfoCard({
	icon,
	title,
	description,
	bullets,
	variant = "default",
	className,
}: InfoCardProps) {
	const variantStyles = {
		default: "bg-muted/30",
		tip: "bg-blue-500/10 border-blue-500/20",
		warning: "bg-amber-500/10 border-amber-500/20",
		success: "bg-green-500/10 border-green-500/20",
	};

	const iconStyles = {
		default: "bg-muted text-muted-foreground",
		tip: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
		warning: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
		success: "bg-green-500/20 text-green-600 dark:text-green-400",
	};

	return (
		<div
			className={cn("rounded-xl p-4 border", variantStyles[variant], className)}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
						iconStyles[variant],
					)}
				>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<h4 className="font-semibold mb-1">{title}</h4>
					<p className="text-sm text-muted-foreground">{description}</p>
					{bullets && bullets.length > 0 && (
						<ul className="mt-2 space-y-1">
							{bullets.map((bullet, i) => (
								<li
									key={i}
									className="text-sm text-muted-foreground flex items-start gap-2"
								>
									<span className="text-primary mt-1">•</span>
									{bullet}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * Expandable Info Section - "Why this matters" collapsible
 */
interface ExpandableInfoProps {
	title?: string;
	children: React.ReactNode;
	defaultExpanded?: boolean;
}

function ExpandableInfo({
	title = "Why this matters",
	children,
	defaultExpanded = false,
}: ExpandableInfoProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	return (
		<div className="rounded-xl bg-muted/30 overflow-hidden">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
			>
				<span className="text-sm font-medium">{title}</span>
				<ChevronRight
					className={cn(
						"h-4 w-4 transition-transform",
						isExpanded && "rotate-90",
					)}
				/>
			</button>
			{isExpanded && (
				<div className="px-4 pb-4 text-sm text-muted-foreground">
					{children}
				</div>
			)}
		</div>
	);
}
