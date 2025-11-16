import { SectionHeaderTooltip } from "./section-header-client";

type SectionHeaderProps = {
	title: string;
	description?: string;
	tooltip?: string;
};

/**
 * Server Component for section headers with optional tooltip
 */
export function SectionHeader({ title, description, tooltip }: SectionHeaderProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="flex-1">
				<h2 className="font-semibold text-xl">{title}</h2>
				{description && <p className="text-muted-foreground text-sm">{description}</p>}
			</div>
			{tooltip && <SectionHeaderTooltip tooltip={tooltip} />}
		</div>
	);
}
