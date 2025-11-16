/**
 * Inspirational Quote Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Full quote with author and quote icon
 * - COMFORTABLE (200-400px): Shortened quote with author
 * - COMPACT (120-200px): Key phrase only
 * - TINY (<120px): Just quotation mark icon
 */

import { Quote, Sparkles } from "lucide-react";
import { truncateText } from "@/lib/utils/responsive-utils";
import {
	ResponsiveContent,
	ResponsiveIcon,
	ResponsiveText,
	ResponsiveWidgetWrapper,
	ShowAt,
} from "../responsive-widget-wrapper";

const INSPIRATIONAL_QUOTES = [
	{
		text: "Excellence is not a destination; it is a continuous journey that never ends.",
		author: "Brian Tracy",
		short: "Excellence is a journey",
	},
	{
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
		short: "Love what you do",
	},
	{
		text: "The difference between ordinary and extraordinary is that little extra.",
		author: "Jimmy Johnson",
		short: "That little extra",
	},
];

export function InspirationalQuoteWidget() {
	// Show first quote (can be randomized server-side if needed)
	const currentQuote = INSPIRATIONAL_QUOTES[0];

	return (
		<ResponsiveWidgetWrapper className="bg-gradient-to-br from-primary/20 via-primary/10 to-background/80">
			<ResponsiveContent className="flex flex-col gap-3">
				{/* Header - adapts across stages */}
				<div className="flex items-center gap-2">
					<ResponsiveIcon>
						<Quote className="text-primary" />
					</ResponsiveIcon>
					<ShowAt stage="full">
						<ResponsiveText variant="title">Daily Inspiration</ResponsiveText>
					</ShowAt>
					<ShowAt stage="comfortable">
						<ResponsiveText className="font-semibold" variant="body">
							Quote
						</ResponsiveText>
					</ShowAt>
				</div>

				{/* FULL Stage: Full quote with decorative elements */}
				<ShowAt stage="full">
					<div className="flex flex-1 flex-col justify-center gap-3">
						<div className="relative">
							<Sparkles className="-top-2 -left-2 absolute size-6 text-primary/30" />
							<blockquote className="font-medium text-foreground/90 italic leading-relaxed">
								<ResponsiveText variant="body">"{currentQuote.text}"</ResponsiveText>
							</blockquote>
						</div>
						<footer className="text-muted-foreground">
							<ResponsiveText variant="caption">— {currentQuote.author}</ResponsiveText>
						</footer>
					</div>
				</ShowAt>

				{/* COMFORTABLE Stage: Shortened quote with author */}
				<ShowAt stage="comfortable">
					<div className="flex flex-1 flex-col justify-center gap-2 overflow-hidden">
						<blockquote className="overflow-hidden italic">
							<ResponsiveText className="line-clamp-3 leading-snug" variant="body">
								"{truncateText(currentQuote.text, "comfortable")}"
							</ResponsiveText>
						</blockquote>
						<footer>
							<ResponsiveText className="text-muted-foreground" variant="caption">
								— {currentQuote.author}
							</ResponsiveText>
						</footer>
					</div>
				</ShowAt>

				{/* COMPACT Stage: Key phrase only */}
				<ShowAt stage="compact">
					<div className="flex flex-1 flex-col items-center justify-center text-center">
						<Quote className="mb-2 size-4 text-primary/50" />
						<ResponsiveText className="font-medium italic leading-tight" variant="body">
							{currentQuote.short}
						</ResponsiveText>
					</div>
				</ShowAt>

				{/* TINY Stage: Just quote icon */}
				<ShowAt stage="tiny">
					<div className="flex h-full items-center justify-center">
						<Quote className="size-8 text-primary" />
					</div>
				</ShowAt>
			</ResponsiveContent>
		</ResponsiveWidgetWrapper>
	);
}
