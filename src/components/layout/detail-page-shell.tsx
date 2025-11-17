import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DetailPageMetadataItem = {
	icon?: ReactNode;
	label: string;
	value: ReactNode;
	helperText?: ReactNode;
};

export type DetailPageHeaderConfig = {
	title?: ReactNode;
	subtitle?: ReactNode;
	description?: ReactNode;
	breadcrumbs?: ReactNode;
	leadingVisual?: ReactNode;
	badges?: ReactNode[];
	actions?: ReactNode[];
	secondaryActions?: ReactNode[];
	metadata?: DetailPageMetadataItem[];
};

type DetailPageShellProps = {
	header?: DetailPageHeaderConfig;
	customHeader?: ReactNode;
	metadata?: DetailPageMetadataItem[];
	beforeContent?: ReactNode;
	afterContent?: ReactNode;
	children?: ReactNode;
	className?: string;
	contentGapClassName?: string;
	statsBar?: ReactNode;
};

export function DetailPageShell({
	header,
	customHeader,
	metadata,
	beforeContent,
	afterContent,
	children,
	className,
	contentGapClassName,
	statsBar,
}: DetailPageShellProps) {
	const resolvedMetadata = metadata ?? header?.metadata ?? [];

	return (
		<div
			className={cn("flex w-full flex-col gap-4 pb-24 lg:gap-5", className)}
			data-detail-shell=""
		>
			{/* Stats bar rendered first, inside the max-w-7xl container */}
			{statsBar}
			{customHeader ?? (header ? <Header section={header} /> : null)}

			{resolvedMetadata.length > 0 ? <MetadataGrid items={resolvedMetadata} /> : null}

			{beforeContent}

			{children ? (
				<div className={cn("flex flex-col gap-4", contentGapClassName)}>{children}</div>
			) : null}

			{afterContent}
		</div>
	);
}

type SurfacePadding = "none" | "sm" | "md" | "lg";

type SurfaceVariant = "default" | "muted" | "subtle" | "ghost";

type DetailPageSurfaceProps = {
	children: ReactNode;
	className?: string;
	padding?: SurfacePadding;
	variant?: SurfaceVariant;
};

const SURFACE_PADDING_CLASSES: Record<SurfacePadding, string> = {
	none: "p-0",
	sm: "p-4",
	md: "p-6",
	lg: "p-8",
};

const SURFACE_VARIANT_CLASSES: Record<SurfaceVariant, string> = {
	default: "border border-border/60 bg-card shadow-sm",
	muted: "border border-border/60 bg-muted/40 shadow-sm",
	subtle: "border border-border/40 bg-card/80 shadow-sm",
	ghost: "border border-border/50 bg-transparent shadow-none",
};

export function DetailPageSurface({
	children,
	className,
	padding = "md",
	variant = "default",
}: DetailPageSurfaceProps) {
	return (
		<section className={cn("rounded-xl", SURFACE_VARIANT_CLASSES[variant], className)}>
			<div className={cn("flex flex-col gap-4", SURFACE_PADDING_CLASSES[padding])}>{children}</div>
		</section>
	);
}

function Header({ section }: { section: DetailPageHeaderConfig }) {
	const {
		breadcrumbs,
		leadingVisual,
		title,
		subtitle,
		description,
		badges,
		actions,
		secondaryActions,
	} = section;

	return (
		<header className="flex flex-col gap-4 lg:gap-6">
			{breadcrumbs ? <div className="text-muted-foreground text-sm">{breadcrumbs}</div> : null}

			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
								{leadingVisual ? (
									<div className="flex items-center justify-center">{leadingVisual}</div>
								) : null}
								<div className="flex flex-col gap-2">
									{renderTitle(title)}
									{subtitle ? (
										<div className="text-muted-foreground max-w-3xl text-sm md:text-base">
											{subtitle}
										</div>
									) : null}
								</div>
							</div>
							{description ? (
								<div className="text-muted-foreground max-w-3xl text-sm">{description}</div>
							) : null}
						</div>
					</div>

					{badges && badges.length > 0 ? (
						<div className="flex flex-wrap items-center gap-2">{badges}</div>
					) : null}
				</div>

				{hasAnyActions(actions, secondaryActions) ? (
					<div className="hidden flex-wrap items-center gap-2 lg:flex">
						{actions?.map((action, index) => (
							<span className="inline-flex" key={index}>
								{action}
							</span>
						))}
						{secondaryActions?.map((action, index) => (
							<span className="inline-flex" key={`secondary-${index}`}>
								{action}
							</span>
						))}
					</div>
				) : null}
			</div>

			{hasAnyActions(actions, secondaryActions) ? (
				<div className="flex flex-col gap-2 lg:hidden">
					{actions && actions.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{actions.map((action, index) => (
								<span className="flex-1" key={index}>
									{action}
								</span>
							))}
						</div>
					) : null}
					{secondaryActions && secondaryActions.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{secondaryActions.map((action, index) => (
								<span className="flex-1" key={`secondary-mobile-${index}`}>
									{action}
								</span>
							))}
						</div>
					) : null}
				</div>
			) : null}
		</header>
	);
}

function MetadataGrid({ items }: { items: DetailPageMetadataItem[] }) {
	return (
		<section className="@xl-page:grid-cols-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			{items.map((item, index) => (
				<div
					className="border-border/50 bg-card/60 flex flex-col gap-1 rounded-lg border px-4 py-3 shadow-sm"
					key={index}
				>
					<span className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
						{item.icon}
						{item.label}
					</span>
					<div className="text-foreground text-sm font-semibold">{item.value}</div>
					{item.helperText ? (
						<span className="text-muted-foreground text-xs">{item.helperText}</span>
					) : null}
				</div>
			))}
		</section>
	);
}

function hasAnyActions(actions?: ReactNode[] | null, secondaryActions?: ReactNode[] | null) {
	return Boolean(
		(actions && actions.length > 0) || (secondaryActions && secondaryActions.length > 0)
	);
}

function renderTitle(title?: ReactNode) {
	if (!title) {
		return null;
	}

	if (typeof title === "string") {
		return <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>;
	}

	return <div className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</div>;
}
