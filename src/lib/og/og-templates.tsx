/* eslint-disable @next/next/no-img-element */
/**
 * OG Image Templates - CLEAN & PROFESSIONAL REDESIGN
 *
 * Simple, readable, professional design for contractor appeal.
 * White background, clear hierarchy, massive pricing.
 */

import { OG_CONFIG, OG_MESSAGING } from "./og-config";

const { colors, typography, padding } = OG_CONFIG;

/**
 * Logo component - uses actual Thorbis logo via HTTP fetch
 */
export async function getLogoDataUrl() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
	const response = await fetch(`${baseUrl}/ThorbisLogo.png`);
	const buffer = await response.arrayBuffer();
	const base64 = Buffer.from(buffer).toString("base64");
	return `data:image/png;base64,${base64}`;
}

/**
 * Clean Base Layout - Minimal & Professional
 */
export function OGBaseLayout({
	children,
	logoDataUrl,
}: {
	children: React.ReactNode;
	logoDataUrl?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				backgroundColor: colors.background,
				padding: `${padding * 1.5}px`,
				fontFamily: "Inter, sans-serif",
				position: "relative",
			}}
		>
			{/* Subtle accent line - thin & elegant */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: `${padding}px`,
					bottom: `${padding}px`,
					width: "4px",
					backgroundColor: colors.primary,
					borderRadius: "0 4px 4px 0",
				}}
			/>

			{/* Logo */}
			<div
				style={{
					display: "flex",
					marginBottom: `${padding}px`,
				}}
			>
				{logoDataUrl ? (
					<img
						src={logoDataUrl}
						alt="Thorbis"
						width="180"
						height="45"
						style={{ objectFit: "contain" }}
					/>
				) : (
					<span
						style={{
							color: colors.foreground,
							fontSize: "32px",
							fontWeight: 800,
							letterSpacing: "-0.5px",
						}}
					>
						THORBIS
					</span>
				)}
			</div>

			{/* Content area - centered vertically */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					justifyContent: "center",
					gap: `${padding}px`,
				}}
			>
				{children}
			</div>

			{/* Bottom tagline */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "16px",
					marginTop: `${padding}px`,
				}}
			>
				<span
					style={{
						color: colors.muted,
						fontSize: typography.small,
						fontWeight: 600,
					}}
				>
					thorbis.com
				</span>
			</div>
		</div>
	);
}

/**
 * Homepage Template - CLEAN & SIMPLE
 */
export function HomepageTemplate({ logoDataUrl }: { logoDataUrl?: string }) {
	const { homepage } = OG_MESSAGING;

	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{/* Headline */}
			<div>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						marginBottom: "16px",
					}}
				>
					{homepage.headline}
				</h1>
				<h2
					style={{
						color: colors.muted,
						fontSize: typography.title,
						fontWeight: 600,
						lineHeight: 1.2,
						margin: 0,
					}}
				>
					{homepage.subheadline}
				</h2>
			</div>

			{/* MASSIVE Pricing - Center Focus */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
				}}
			>
				<div
					style={{
						color: colors.accent,
						fontSize: typography.display,
						fontWeight: 800,
						lineHeight: 1,
						letterSpacing: "-4px",
					}}
				>
					{homepage.pricing}
				</div>
				<div
					style={{
						color: colors.muted,
						fontSize: typography.subtitle,
						fontWeight: 600,
					}}
				>
					{homepage.tagline}
				</div>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Pricing Template - SAVINGS FOCUS
 */
export function PricingTemplate({ logoDataUrl }: { logoDataUrl?: string }) {
	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{/* Headline */}
			<div>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
					}}
				>
					Simple Pricing
				</h1>
			</div>

			{/* MASSIVE Pricing */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "24px",
				}}
			>
				<div
					style={{
						color: colors.accent,
						fontSize: typography.display,
						fontWeight: 800,
						lineHeight: 1,
						letterSpacing: "-4px",
					}}
				>
					$200
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
					}}
				>
					<div
						style={{
							color: colors.foreground,
							fontSize: typography.title,
							fontWeight: 700,
						}}
					>
						per month
					</div>
					<div
						style={{
							color: colors.muted,
							fontSize: typography.subtitle,
							fontWeight: 600,
						}}
					>
						All Features • No Per-User Fees
					</div>
				</div>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Feature Template - BENEFIT FOCUSED
 */
export function FeatureTemplate({
	feature,
	logoDataUrl,
}: {
	feature: keyof typeof OG_MESSAGING.features;
	logoDataUrl?: string;
}) {
	const featureData = OG_MESSAGING.features[feature];

	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{/* Feature Title */}
			<div>
				<div
					style={{
						display: "inline-block",
						backgroundColor: `${colors.primary}15`,
						color: colors.primary,
						padding: "12px 24px",
						borderRadius: "8px",
						fontSize: typography.body,
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						marginBottom: "32px",
					}}
				>
					Feature
				</div>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
					}}
				>
					{featureData.title}
				</h1>
			</div>

			{/* Solution */}
			<div
				style={{
					color: colors.muted,
					fontSize: typography.title,
					fontWeight: 600,
					lineHeight: 1.3,
				}}
			>
				{featureData.solution}
			</div>

			{/* Pricing Badge */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "16px",
				}}
			>
				<div
					style={{
						backgroundColor: colors.accent,
						color: "#FFFFFF",
						padding: "16px 32px",
						borderRadius: "12px",
						fontSize: typography.title,
						fontWeight: 800,
					}}
				>
					$200/mo
				</div>
				<div
					style={{
						color: colors.muted,
						fontSize: typography.subtitle,
						fontWeight: 600,
					}}
				>
					All Features Included
				</div>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Industry Template - CLEAN & PROFESSIONAL
 */
export function IndustryTemplate({
	industry,
	logoDataUrl,
}: {
	industry: keyof typeof OG_MESSAGING.industries;
	logoDataUrl?: string;
}) {
	const industryData = OG_MESSAGING.industries[industry];

	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{/* Industry Badge */}
			<div>
				<div
					style={{
						display: "inline-block",
						backgroundColor: `${colors.primary}15`,
						color: colors.primary,
						padding: "12px 24px",
						borderRadius: "8px",
						fontSize: typography.body,
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						marginBottom: "32px",
					}}
				>
					{industryData.title}
				</div>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
					}}
				>
					{industryData.subtitle}
				</h1>
			</div>

			{/* Solution */}
			<div
				style={{
					color: colors.muted,
					fontSize: typography.title,
					fontWeight: 600,
					lineHeight: 1.3,
				}}
			>
				{industryData.solution}
			</div>

			{/* Stats */}
			<div
				style={{
					display: "flex",
					gap: "24px",
					alignItems: "center",
				}}
			>
				<div
					style={{
						backgroundColor: colors.accent,
						color: "#FFFFFF",
						padding: "16px 32px",
						borderRadius: "12px",
						fontSize: typography.title,
						fontWeight: 800,
					}}
				>
					$200/mo
				</div>
				<div
					style={{
						color: colors.primary,
						fontSize: typography.title,
						fontWeight: 700,
					}}
				>
					{industryData.stat}
				</div>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Competitor Template - PRICE COMPARISON
 */
export function CompetitorTemplate({
	competitor,
	logoDataUrl,
}: {
	competitor: keyof typeof OG_MESSAGING.competitors;
	logoDataUrl?: string;
}) {
	const compData = OG_MESSAGING.competitors[competitor];

	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{/* Title */}
			<div>
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
					}}
				>
					{compData.title}
				</h1>
			</div>

			{/* Price Comparison - Side by Side */}
			<div
				style={{
					display: "flex",
					gap: "48px",
					alignItems: "center",
				}}
			>
				{/* Thorbis Price */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
					}}
				>
					<div
						style={{
							color: colors.accent,
							fontSize: typography.display,
							fontWeight: 800,
							lineHeight: 1,
							letterSpacing: "-4px",
						}}
					>
						$200
					</div>
					<div
						style={{
							color: colors.foreground,
							fontSize: typography.subtitle,
							fontWeight: 700,
						}}
					>
						per month
					</div>
				</div>

				{/* VS */}
				<div
					style={{
						color: colors.border,
						fontSize: typography.hero,
						fontWeight: 800,
					}}
				>
					VS
				</div>

				{/* Competitor Price */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
						opacity: 0.5,
					}}
				>
					<div
						style={{
							color: colors.destructive,
							fontSize: typography.display,
							fontWeight: 800,
							lineHeight: 1,
							letterSpacing: "-4px",
							textDecoration: "line-through",
						}}
					>
						{compData.theirPrice.replace("/mo", "")}
					</div>
					<div
						style={{
							color: colors.muted,
							fontSize: typography.subtitle,
							fontWeight: 700,
						}}
					>
						per month
					</div>
				</div>
			</div>

			{/* Savings */}
			<div
				style={{
					backgroundColor: `${colors.accent}15`,
					color: colors.accent,
					padding: "20px 32px",
					borderRadius: "12px",
					fontSize: typography.title,
					fontWeight: 700,
					display: "inline-block",
					alignSelf: "flex-start",
				}}
			>
				{compData.annualSavings}
			</div>
		</OGBaseLayout>
	);
}

/**
 * Blog Template - SIMPLE
 */
export function BlogTemplate({
	title,
	category,
	logoDataUrl,
}: {
	title: string;
	category?: string;
	logoDataUrl?: string;
}) {
	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{category && (
				<div
					style={{
						display: "inline-block",
						backgroundColor: `${colors.primary}15`,
						color: colors.primary,
						padding: "12px 24px",
						borderRadius: "8px",
						fontSize: typography.body,
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						marginBottom: "32px",
					}}
				>
					{category}
				</div>
			)}
			<h1
				style={{
					color: colors.foreground,
					fontSize: typography.hero,
					fontWeight: 800,
					lineHeight: 1.2,
					margin: 0,
				}}
			>
				{title}
			</h1>
		</OGBaseLayout>
	);
}

/**
 * Knowledge Base Template
 */
export function KBTemplate({
	title,
	category,
	logoDataUrl,
}: {
	title: string;
	category?: string;
	logoDataUrl?: string;
}) {
	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			{category && (
				<div
					style={{
						display: "inline-block",
						backgroundColor: `${colors.accent}15`,
						color: colors.accent,
						padding: "12px 24px",
						borderRadius: "8px",
						fontSize: typography.body,
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.5px",
						marginBottom: "32px",
					}}
				>
					{category}
				</div>
			)}
			<h1
				style={{
					color: colors.foreground,
					fontSize: typography.hero,
					fontWeight: 800,
					lineHeight: 1.2,
					margin: 0,
				}}
			>
				{title}
			</h1>
		</OGBaseLayout>
	);
}

/**
 * Default Template
 */
export function DefaultTemplate({
	title,
	subtitle,
	logoDataUrl,
}: {
	title: string;
	subtitle?: string;
	logoDataUrl?: string;
}) {
	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			<h1
				style={{
					color: colors.foreground,
					fontSize: typography.hero,
					fontWeight: 800,
					lineHeight: 1.2,
					margin: 0,
				}}
			>
				{title}
			</h1>
			{subtitle && (
				<p
					style={{
						color: colors.muted,
						fontSize: typography.title,
						fontWeight: 600,
						margin: 0,
					}}
				>
					{subtitle}
				</p>
			)}
		</OGBaseLayout>
	);
}

// Integration and Calculator templates
export const IntegrationTemplate = DefaultTemplate;
export const CalculatorTemplate = DefaultTemplate;
