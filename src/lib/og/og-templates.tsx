/* eslint-disable @next/next/no-img-element */
/**
 * OG Image Templates
 *
 * Reusable JSX templates for OG image generation.
 * Dark mode first, bold & minimalistic design.
 */

import { OG_CONFIG, OG_MESSAGING } from "./og-config";

const { colors, typography, padding } = OG_CONFIG;

/**
 * Base layout wrapper for all OG images
 */
export function OGBaseLayout({
	children,
	showPricingBadge = true,
}: {
	children: React.ReactNode;
	showPricingBadge?: boolean;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				backgroundColor: colors.background,
				padding: padding,
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Subtle gradient overlay */}
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: "200px",
					background: `linear-gradient(to top, ${colors.primary}15, transparent)`,
				}}
			/>

			{/* Header row */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "32px",
				}}
			>
				{/* Logo */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
					}}
				>
					<div
						style={{
							width: "48px",
							height: "48px",
							backgroundColor: colors.primary,
							borderRadius: "12px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<span
							style={{
								color: colors.foreground,
								fontSize: "28px",
								fontWeight: 800,
							}}
						>
							T
						</span>
					</div>
					<span
						style={{
							color: colors.foreground,
							fontSize: "32px",
							fontWeight: 700,
							letterSpacing: "-0.5px",
						}}
					>
						Thorbis
					</span>
				</div>

				{/* Pricing badge */}
				{showPricingBadge && <PricingBadge />}
			</div>

			{/* Content area */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					justifyContent: "center",
					position: "relative",
					zIndex: 1,
				}}
			>
				{children}
			</div>
		</div>
	);
}

/**
 * Pricing badge component - "$200/mo"
 */
export function PricingBadge({ large = false }: { large?: boolean }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-end",
				gap: "4px",
			}}
		>
			<div
				style={{
					backgroundColor: colors.accent,
					color: colors.background,
					padding: large ? "12px 24px" : "8px 16px",
					borderRadius: "8px",
					fontSize: large ? typography.subtitle : typography.badge,
					fontWeight: 700,
				}}
			>
				{OG_CONFIG.pricingBadge.text}
			</div>
			<span
				style={{
					color: colors.muted,
					fontSize: typography.micro,
				}}
			>
				{OG_CONFIG.pricingBadge.subtitle}
			</span>
		</div>
	);
}

/**
 * Category badge component
 */
export function CategoryBadge({
	text,
	color = colors.primary,
}: {
	text: string;
	color?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "8px",
				backgroundColor: `${color}20`,
				color: color,
				padding: "8px 16px",
				borderRadius: "6px",
				fontSize: typography.small,
				fontWeight: 600,
				textTransform: "uppercase",
				letterSpacing: "0.5px",
			}}
		>
			{text}
		</div>
	);
}

/**
 * Homepage OG template
 */
export function HomepageTemplate() {
	const { homepage } = OG_MESSAGING;

	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						letterSpacing: "-2px",
					}}
				>
					{homepage.title}
				</h1>
				<h2
					style={{
						color: colors.primary,
						fontSize: typography.title,
						fontWeight: 700,
						margin: 0,
						letterSpacing: "-1px",
					}}
				>
					{homepage.subtitle}
				</h2>
				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
						marginTop: "8px",
						maxWidth: "800px",
					}}
				>
					{homepage.tagline}
				</p>
			</div>

			{/* Footer badges */}
			<div
				style={{
					display: "flex",
					gap: "16px",
					marginTop: "auto",
					paddingTop: "32px",
				}}
			>
				<CategoryBadge text="AI-Powered" />
				<CategoryBadge text="All-in-One" color={colors.accent} />
				<CategoryBadge text="No Per-User Fees" color={colors.mutedForeground} />
			</div>
		</OGBaseLayout>
	);
}

/**
 * Feature page OG template
 */
export function FeatureTemplate({
	slug,
	title,
	subtitle,
}: {
	slug: string;
	title?: string;
	subtitle?: string;
}) {
	const featureData =
		OG_MESSAGING.features[slug as keyof typeof OG_MESSAGING.features];
	const displayTitle = title || featureData?.title || "Feature";
	const displaySubtitle = subtitle || featureData?.subtitle || "";

	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<CategoryBadge text="Feature" />

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-2px",
					}}
				>
					{displayTitle}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
						maxWidth: "800px",
					}}
				>
					{displaySubtitle}
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Industry page OG template
 */
export function IndustryTemplate({
	slug,
	title,
	subtitle,
}: {
	slug: string;
	title?: string;
	subtitle?: string;
}) {
	const industryData =
		OG_MESSAGING.industries[slug as keyof typeof OG_MESSAGING.industries];
	const displayTitle = title || industryData?.title || "Industry Software";
	const displaySubtitle = subtitle || industryData?.subtitle || "";
	const pain = industryData?.pain;

	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<CategoryBadge text="Industry Solution" color={colors.accent} />

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-2px",
					}}
				>
					{displayTitle}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
						maxWidth: "800px",
					}}
				>
					{displaySubtitle}
				</p>

				{pain && (
					<p
						style={{
							color: colors.primary,
							fontSize: typography.badge,
							fontWeight: 600,
							margin: 0,
							marginTop: "8px",
						}}
					>
						{pain}
					</p>
				)}
			</div>
		</OGBaseLayout>
	);
}

/**
 * Competitor comparison OG template - SNARKY
 */
export function CompetitorTemplate({
	slug,
	competitorName,
}: {
	slug: string;
	competitorName?: string;
}) {
	const competitorData =
		OG_MESSAGING.competitors[slug as keyof typeof OG_MESSAGING.competitors];

	const displayTitle =
		competitorData?.title || `Thorbis vs ${competitorName || "Competitor"}`;
	const displaySubtitle = competitorData?.subtitle || "The smarter choice";
	const ourPrice = competitorData?.ourPrice || "$200/mo";
	const theirPrice = competitorData?.theirPrice || "$$$/mo";
	const snark = competitorData?.snark;

	return (
		<OGBaseLayout showPricingBadge={false}>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<CategoryBadge text="Comparison" color={colors.destructive} />

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.title,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-1px",
					}}
				>
					{displayTitle}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
					}}
				>
					{displaySubtitle}
				</p>

				{/* Pricing comparison */}
				<div
					style={{
						display: "flex",
						gap: "32px",
						marginTop: "24px",
						alignItems: "center",
					}}
				>
					{/* Our price */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							backgroundColor: `${colors.accent}20`,
							padding: "20px 32px",
							borderRadius: "12px",
							border: `2px solid ${colors.accent}`,
						}}
					>
						<span
							style={{
								color: colors.accent,
								fontSize: typography.hero,
								fontWeight: 800,
							}}
						>
							{ourPrice}
						</span>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.small,
								fontWeight: 500,
							}}
						>
							Thorbis
						</span>
					</div>

					{/* VS */}
					<span
						style={{
							color: colors.muted,
							fontSize: typography.subtitle,
							fontWeight: 700,
						}}
					>
						vs
					</span>

					{/* Their price */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							backgroundColor: `${colors.destructive}10`,
							padding: "20px 32px",
							borderRadius: "12px",
							border: `2px solid ${colors.destructive}40`,
						}}
					>
						<span
							style={{
								color: colors.destructive,
								fontSize: typography.hero,
								fontWeight: 800,
								textDecoration: "line-through",
								textDecorationColor: colors.destructive,
							}}
						>
							{theirPrice}
						</span>
						<span
							style={{
								color: colors.muted,
								fontSize: typography.small,
								fontWeight: 500,
							}}
						>
							{competitorName || slug}
						</span>
					</div>
				</div>

				{/* Snarky tagline */}
				{snark && (
					<p
						style={{
							color: colors.primary,
							fontSize: typography.badge,
							fontWeight: 600,
							margin: 0,
							marginTop: "16px",
							fontStyle: "italic",
						}}
					>
						&quot;{snark}&quot;
					</p>
				)}
			</div>
		</OGBaseLayout>
	);
}

/**
 * Pricing page OG template
 */
export function PricingTemplate() {
	const { pricing } = OG_MESSAGING;

	return (
		<OGBaseLayout showPricingBadge={false}>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<CategoryBadge text="Pricing" color={colors.accent} />

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-2px",
					}}
				>
					{pricing.title}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
					}}
				>
					{pricing.subtitle}
				</p>

				{/* Large pricing display */}
				<div
					style={{
						display: "flex",
						alignItems: "baseline",
						gap: "12px",
						marginTop: "24px",
					}}
				>
					<span
						style={{
							color: colors.accent,
							fontSize: "120px",
							fontWeight: 800,
							lineHeight: 1,
						}}
					>
						$200
					</span>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.title,
							fontWeight: 500,
						}}
					>
						/month
					</span>
				</div>

				<p
					style={{
						color: colors.primary,
						fontSize: typography.badge,
						fontWeight: 600,
						margin: 0,
					}}
				>
					All features included. Unlimited users.
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Blog post OG template
 */
export function BlogTemplate({
	title,
	category,
	readTime,
}: {
	title: string;
	category?: string;
	readTime?: string;
}) {
	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<div style={{ display: "flex", gap: "12px" }}>
					<CategoryBadge text={category || "Blog"} />
					{readTime && (
						<CategoryBadge text={readTime} color={colors.mutedForeground} />
					)}
				</div>

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.title,
						fontWeight: 800,
						lineHeight: 1.2,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-1px",
						maxWidth: "900px",
					}}
				>
					{title}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.badge,
						fontWeight: 500,
						margin: 0,
						marginTop: "8px",
					}}
				>
					{OG_MESSAGING.blog.defaultSubtitle}
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Knowledge Base article OG template
 */
export function KBTemplate({
	title,
	category,
}: {
	title: string;
	category?: string;
}) {
	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<div style={{ display: "flex", gap: "12px" }}>
					<CategoryBadge text="Help Center" color={colors.primary} />
					{category && (
						<CategoryBadge text={category} color={colors.mutedForeground} />
					)}
				</div>

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.title,
						fontWeight: 800,
						lineHeight: 1.2,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-1px",
						maxWidth: "900px",
					}}
				>
					{title}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.badge,
						fontWeight: 500,
						margin: 0,
						marginTop: "8px",
					}}
				>
					{OG_MESSAGING.kb.defaultSubtitle}
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Integration page OG template
 */
export function IntegrationTemplate({
	name,
	description,
}: {
	name: string;
	description?: string;
}) {
	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<CategoryBadge text="Integration" color={colors.primary} />

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-2px",
					}}
				>
					{name} + Thorbis
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
						maxWidth: "800px",
					}}
				>
					{description || "Seamless integration for your workflow"}
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Calculator/Tool OG template
 */
export function CalculatorTemplate({
	name,
	description,
}: {
	name: string;
	description?: string;
}) {
	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<CategoryBadge text="Free Tool" color={colors.accent} />

				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginTop: "16px",
						letterSpacing: "-2px",
					}}
				>
					{name}
				</h1>

				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 500,
						margin: 0,
						maxWidth: "800px",
					}}
				>
					{description || "Free calculator for field service professionals"}
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Default/fallback OG template
 */
export function DefaultTemplate({
	title,
	subtitle,
}: {
	title: string;
	subtitle?: string;
}) {
	return (
		<OGBaseLayout>
			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						letterSpacing: "-2px",
					}}
				>
					{title}
				</h1>

				{subtitle && (
					<p
						style={{
							color: colors.mutedForeground,
							fontSize: typography.subtitle,
							fontWeight: 500,
							margin: 0,
							maxWidth: "800px",
						}}
					>
						{subtitle}
					</p>
				)}
			</div>
		</OGBaseLayout>
	);
}
