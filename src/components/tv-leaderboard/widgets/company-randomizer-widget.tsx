/**
 * Company Randomizer Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Selected item with category and description
 * - COMFORTABLE (200-400px): Selected item with category
 * - COMPACT (120-200px): Selected item only
 * - TINY (<120px): Item icon only
 *
 * Note: Converted to Server Component. Interactive randomization removed for performance.
 */

import { Coffee, Shuffle, Trophy, Users } from "lucide-react";
import {
	ResponsiveContent,
	ResponsiveIcon,
	ResponsiveText,
	ResponsiveWidgetWrapper,
	ShowAt,
} from "../responsive-widget-wrapper";

type RandomizerOption = {
	id: string;
	label: string;
	category?: "team" | "food" | "activity";
	description?: string;
};

type CompanyRandomizerWidgetProps = {
	selected?: RandomizerOption;
};

const DEFAULT_SELECTED: RandomizerOption = {
	id: "1",
	label: "Team Building Game",
	category: "activity",
	description: "Outdoor team bonding activity",
};

function getCategoryIcon(category?: "team" | "food" | "activity") {
	switch (category) {
		case "team":
			return <Users className="text-primary" />;
		case "food":
			return <Coffee className="text-primary" />;
		case "activity":
			return <Trophy className="text-primary" />;
		default:
			return <Shuffle className="text-primary" />;
	}
}

function getCategoryLabel(category?: "team" | "food" | "activity") {
	switch (category) {
		case "team":
			return "Team Member";
		case "food":
			return "Lunch Spot";
		case "activity":
			return "Activity";
		default:
			return "Selection";
	}
}

export function CompanyRandomizerWidget({ selected = DEFAULT_SELECTED }: CompanyRandomizerWidgetProps) {
	return (
		<ResponsiveWidgetWrapper className="bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-background/80">
			<ResponsiveContent className="flex flex-col gap-3">
				{/* Header - adapts across stages */}
				<div className="flex items-center gap-2">
					<ResponsiveIcon>{getCategoryIcon(selected.category)}</ResponsiveIcon>
					<ShowAt stage="full">
						<ResponsiveText variant="title">Random {getCategoryLabel(selected.category)}</ResponsiveText>
					</ShowAt>
					<ShowAt stage="comfortable">
						<ResponsiveText className="font-semibold" variant="body">
							{getCategoryLabel(selected.category)}
						</ResponsiveText>
					</ShowAt>
				</div>

				{/* FULL Stage: Selected item with full details */}
				<ShowAt stage="full">
					<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
						{/* Icon */}
						<div className="flex size-16 items-center justify-center rounded-full bg-primary/20">
							{getCategoryIcon(selected.category)}
						</div>

						{/* Selected item */}
						<div>
							<ResponsiveText className="text-muted-foreground" variant="caption">
								Selected
							</ResponsiveText>
							<ResponsiveText className="font-bold" variant="title">
								{selected.label}
							</ResponsiveText>
						</div>

						{/* Description */}
						{selected.description && (
							<div className="rounded-lg bg-background/50 px-4 py-2">
								<ResponsiveText className="text-muted-foreground" variant="caption">
									{selected.description}
								</ResponsiveText>
							</div>
						)}
					</div>
				</ShowAt>

				{/* COMFORTABLE Stage: Selected item with category */}
				<ShowAt stage="comfortable">
					<div className="flex flex-1 flex-col justify-center gap-3">
						{/* Category */}
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
								{getCategoryIcon(selected.category)}
							</div>
							<ResponsiveText className="text-muted-foreground" variant="caption">
								{getCategoryLabel(selected.category)}
							</ResponsiveText>
						</div>

						{/* Selected */}
						<div className="rounded-lg bg-primary/10 p-3 text-center">
							<ResponsiveText className="font-bold" variant="body">
								{selected.label}
							</ResponsiveText>
						</div>
					</div>
				</ShowAt>

				{/* COMPACT Stage: Selected item only */}
				<ShowAt stage="compact">
					<div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
						<div className="flex size-6 items-center justify-center rounded-full bg-primary/20">
							{getCategoryIcon(selected.category)}
						</div>
						<ResponsiveText className="truncate font-bold" variant="body">
							{selected.label}
						</ResponsiveText>
					</div>
				</ShowAt>

				{/* TINY Stage: Icon only */}
				<ShowAt stage="tiny">
					<div className="flex h-full items-center justify-center">
						<div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
							{getCategoryIcon(selected.category)}
						</div>
					</div>
				</ShowAt>
			</ResponsiveContent>
		</ResponsiveWidgetWrapper>
	);
}
