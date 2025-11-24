/* eslint-disable @next/next/no-img-element */
/**
 * OG Image Templates - REDESIGNED FOR CONTRACTOR BREAKTHROUGH
 *
 * Aggressive pain-first approach with huge pricing and social proof.
 * Dark mode first, maximum information density.
 */

import { OG_CONFIG, OG_MESSAGING } from "./og-config";

const { colors, typography, padding, socialProof } = OG_CONFIG;

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
 * Social Proof Bar - displays at bottom of all OG images
 */
export function SocialProofBar() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "24px",
				backgroundColor: `${colors.border}`,
				padding: "16px 24px",
				borderRadius: "12px",
				position: "absolute",
				bottom: `${padding}px`,
				left: `${padding}px`,
				right: `${padding}px`,
			}}
		>
			<span
				style={{
					color: colors.foreground,
					fontSize: typography.small,
					fontWeight: 600,
				}}
			>
				{socialProof.customers}
			</span>
			<span
				style={{
					color: colors.accent,
					fontSize: typography.small,
					fontWeight: 700,
				}}
			>
				{socialProof.rating}
			</span>
			<span
				style={{
					color: colors.foreground,
					fontSize: typography.small,
					fontWeight: 600,
				}}
			>
				{socialProof.savings}
			</span>
		</div>
	);
}

/**
 * Base layout wrapper for all OG images
 * Now includes real logo and social proof bar
 */
export function OGBaseLayout({
	children,
	logoDataUrl,
	showSocialProof = true,
}: {
	children: React.ReactNode;
	logoDataUrl?: string;
	showSocialProof?: boolean;
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
			{/* Aggressive gradient overlay - more prominent */}
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: "300px",
					background: `linear-gradient(to top, ${colors.primary}25, transparent)`,
				}}
			/>

			{/* Electric blue accent bar - BOLD */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					width: "8px",
					backgroundColor: colors.primary,
				}}
			/>

			{/* Header row with logo */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "48px",
					position: "relative",
					zIndex: 1,
				}}
			>
				{/* Real Thorbis Logo */}
				{logoDataUrl ? (
					<img
						src={logoDataUrl}
						alt="Thorbis"
						width="200"
						height="50"
						style={{ objectFit: "contain" }}
					/>
				) : (
					// Fallback to text logo
					<span
						style={{
							color: colors.foreground,
							fontSize: "36px",
							fontWeight: 800,
							letterSpacing: "-1px",
						}}
					>
						THORBIS
					</span>
				)}
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
					paddingBottom: showSocialProof ? "80px" : "0", // Space for social proof bar
				}}
			>
				{children}
			</div>

			{/* Social Proof Bar */}
			{showSocialProof && <SocialProofBar />}
		</div>
	);
}

/**
 * HUGE pricing display - for homepage and pricing pages
 */
export function HugePricing({
	mainPrice = "$200/mo",
	comparePrice,
	annualComparison,
}: {
	mainPrice?: string;
	comparePrice?: string;
	annualComparison?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "16px",
				marginTop: "24px",
			}}
		>
			{/* MASSIVE pricing */}
			<div
				style={{
					color: colors.accent,
					fontSize: typography.pricing,
					fontWeight: 800,
					lineHeight: 1,
					letterSpacing: "-2px",
				}}
			>
				{mainPrice}
			</div>

			{/* Competitor comparison with strikethrough */}
			{comparePrice && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
					}}
				>
					<span
						style={{
							color: colors.destructive,
							fontSize: typography.title,
							fontWeight: 700,
							textDecoration: "line-through",
							opacity: 0.7,
						}}
					>
						{comparePrice}
					</span>
				</div>
			)}

			{/* Annual comparison */}
			{annualComparison && (
				<div
					style={{
						color: colors.mutedForeground,
						fontSize: typography.small,
						fontWeight: 600,
					}}
				>
					{annualComparison}
				</div>
			)}
		</div>
	);
}

/**
 * Stat Badge - large number with label
 */
export function StatBadge({ stat, label }: { stat: string; label: string }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				backgroundColor: `${colors.primary}15`,
				padding: "20px 32px",
				borderRadius: "12px",
				border: `2px solid ${colors.primary}40`,
			}}
		>
			<div
				style={{
					color: colors.accent,
					fontSize: typography.mega,
					fontWeight: 800,
					lineHeight: 1,
				}}
			>
				{stat}
			</div>
			<div
				style={{
					color: colors.mutedForeground,
					fontSize: typography.small,
					fontWeight: 600,
					marginTop: "8px",
				}}
			>
				{label}
			</div>
		</div>
	);
}

/**
 * Pricing Comparison - side by side
 */
export function PricingComparison({
	ourPrice,
	ourAnnual,
	theirPrice,
	theirAnnual,
	savings,
}: {
	ourPrice: string;
	ourAnnual: string;
	theirPrice: string;
	theirAnnual: string;
	savings: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				gap: "32px",
				alignItems: "center",
				justifyContent: "center",
				marginTop: "32px",
			}}
		>
			{/* Our Pricing - GREEN */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					backgroundColor: `${colors.accent}20`,
					padding: "24px 40px",
					borderRadius: "16px",
					border: `3px solid ${colors.accent}`,
				}}
			>
				<div
					style={{
						color: colors.accent,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1,
					}}
				>
					{ourPrice}
				</div>
				<div
					style={{
						color: colors.foreground,
						fontSize: typography.small,
						fontWeight: 600,
						marginTop: "8px",
					}}
				>
					{ourAnnual}
				</div>
				<div
					style={{
						color: colors.accent,
						fontSize: typography.micro,
						fontWeight: 700,
						marginTop: "12px",
						textTransform: "uppercase",
					}}
				>
					THORBIS
				</div>
			</div>

			{/* VS */}
			<div
				style={{
					color: colors.muted,
					fontSize: typography.title,
					fontWeight: 800,
				}}
			>
				VS
			</div>

			{/* Their Pricing - RED */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					backgroundColor: `${colors.destructive}15`,
					padding: "24px 40px",
					borderRadius: "16px",
					border: `3px solid ${colors.destructive}60`,
					opacity: 0.7,
				}}
			>
				<div
					style={{
						color: colors.destructive,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1,
						textDecoration: "line-through",
					}}
				>
					{theirPrice}
				</div>
				<div
					style={{
						color: colors.mutedForeground,
						fontSize: typography.small,
						fontWeight: 600,
						marginTop: "8px",
					}}
				>
					{theirAnnual}
				</div>
				<div
					style={{
						color: colors.destructive,
						fontSize: typography.micro,
						fontWeight: 700,
						marginTop: "12px",
						textTransform: "uppercase",
					}}
				>
					COMPETITOR
				</div>
			</div>

			{/* Savings callout */}
			{savings && (
				<div
					style={{
						position: "absolute",
						top: "-40px",
						backgroundColor: colors.warning,
						color: colors.background,
						padding: "12px 24px",
						borderRadius: "8px",
						fontSize: typography.badge,
						fontWeight: 800,
						textTransform: "uppercase",
					}}
				>
					{savings}
				</div>
			)}
		</div>
	);
}

/**
 * Homepage Template - AGGRESSIVE REDESIGN
 */
export function HomepageTemplate({ logoDataUrl }: { logoDataUrl?: string }) {
	const { homepage } = OG_MESSAGING;

	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "32px",
					alignItems: "center",
					textAlign: "center",
				}}
			>
				{/* PAIN POINT - Huge headline */}
				<h1
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						letterSpacing: "-1px",
					}}
				>
					{homepage.painPoint}
				</h1>

				{/* Solution */}
				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						fontWeight: 600,
						margin: 0,
						lineHeight: 1.4,
					}}
				>
					{homepage.solution}
				</p>

				{/* HUGE Pricing */}
				<HugePricing
					mainPrice="$200/mo"
					comparePrice="$3,100/mo"
					annualComparison="Save $34,600/year vs ServiceTitan"
				/>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Feature Template - PAIN-FIRST REDESIGN
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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "32px",
				}}
			>
				{/* Pain Point Headline */}
				<h1
					style={{
						color: colors.warning,
						fontSize: typography.title,
						fontWeight: 800,
						lineHeight: 1.2,
						margin: 0,
					}}
				>
					{featureData.painPoint}
				</h1>

				{/* Solution */}
				<h2
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						letterSpacing: "-1px",
					}}
				>
					{featureData.solution}
				</h2>

				{/* Stat Badge */}
				{featureData.stat && (
					<div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
						<StatBadge stat={featureData.stat} label="Average Result" />
					</div>
				)}
			</div>
		</OGBaseLayout>
	);
}

/**
 * Industry Template - AGGRESSIVE PAIN + STATS
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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "32px",
				}}
			>
				{/* Pain Point - RED WARNING */}
				<h1
					style={{
						color: colors.destructive,
						fontSize: typography.title,
						fontWeight: 800,
						lineHeight: 1.2,
						margin: 0,
						textTransform: "uppercase",
					}}
				>
					⚠️ {industryData.painPoint}
				</h1>

				{/* Solution */}
				<h2
					style={{
						color: colors.foreground,
						fontSize: typography.hero,
						fontWeight: 800,
						lineHeight: 1.1,
						margin: 0,
						letterSpacing: "-1px",
					}}
				>
					{industryData.solution}
				</h2>

				{/* Pricing */}
				<div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
					<div
						style={{
							backgroundColor: colors.accent,
							color: colors.background,
							padding: "16px 32px",
							borderRadius: "12px",
							fontSize: typography.subtitle,
							fontWeight: 800,
						}}
					>
						$200/mo
					</div>
					<div
						style={{
							backgroundColor: `${colors.border}`,
							color: colors.mutedForeground,
							padding: "16px 32px",
							borderRadius: "12px",
							fontSize: typography.small,
							fontWeight: 600,
							display: "flex",
							alignItems: "center",
						}}
					>
						{industryData.stat}
					</div>
				</div>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Competitor Template - WARNING STYLE with ANNUAL SAVINGS
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
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				backgroundColor: colors.background,
				position: "relative",
			}}
		>
			{/* WARNING BORDER - RED */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					border: `8px solid ${colors.destructive}`,
					borderRadius: "0",
					pointerEvents: "none",
				}}
			/>

			<OGBaseLayout logoDataUrl={logoDataUrl}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "32px",
						alignItems: "center",
						textAlign: "center",
					}}
				>
					{/* Title */}
					<h1
						style={{
							color: colors.foreground,
							fontSize: typography.title,
							fontWeight: 800,
							margin: 0,
							textTransform: "uppercase",
						}}
					>
						{compData.title}
					</h1>

					{/* HUGE Annual Savings */}
					<div
						style={{
							backgroundColor: colors.warning,
							color: colors.background,
							padding: "20px 48px",
							borderRadius: "16px",
							fontSize: typography.mega,
							fontWeight: 800,
							letterSpacing: "-1px",
							textTransform: "uppercase",
						}}
					>
						{compData.annualSavings}
					</div>

					{/* Price Comparison */}
					<PricingComparison
						ourPrice={compData.ourPrice}
						ourAnnual={compData.ourAnnual}
						theirPrice={compData.theirPrice}
						theirAnnual={compData.theirAnnual}
						savings={compData.annualSavings}
					/>

					{/* Snark */}
					<p
						style={{
							color: colors.mutedForeground,
							fontSize: typography.small,
							fontWeight: 600,
							margin: 0,
							fontStyle: "italic",
						}}
					>
						{compData.snark}
					</p>
				</div>
			</OGBaseLayout>
		</div>
	);
}

/**
 * Pricing Template - SAVINGS-FOCUSED
 */
export function PricingTemplate({ logoDataUrl }: { logoDataUrl?: string }) {
	const { pricing } = OG_MESSAGING;

	return (
		<OGBaseLayout logoDataUrl={logoDataUrl}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "32px",
					alignItems: "center",
					textAlign: "center",
				}}
			>
				{/* Main Headline - SAVINGS */}
				<h1
					style={{
						color: colors.accent,
						fontSize: typography.pricing,
						fontWeight: 800,
						lineHeight: 1,
						margin: 0,
						letterSpacing: "-2px",
					}}
				>
					{pricing.mainHeadline}
				</h1>

				{/* Comparison */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						alignItems: "center",
					}}
				>
					<div
						style={{
							color: colors.foreground,
							fontSize: typography.hero,
							fontWeight: 800,
						}}
					>
						{pricing.comparison}
					</div>
					<div
						style={{
							color: colors.destructive,
							fontSize: typography.title,
							fontWeight: 700,
							textDecoration: "line-through",
							opacity: 0.7,
						}}
					>
						{pricing.competitorPrice}
					</div>
				</div>

				{/* Guarantee badges */}
				<div
					style={{
						display: "flex",
						gap: "16px",
						flexWrap: "wrap",
						justifyContent: "center",
						marginTop: "16px",
					}}
				>
					{["Money-Back Guarantee", "No Per-User Fees", "Cancel Anytime"].map((text) => (
						<div
							key={text}
							style={{
								backgroundColor: `${colors.primary}20`,
								color: colors.primary,
								padding: "12px 20px",
								borderRadius: "8px",
								fontSize: typography.small,
								fontWeight: 700,
							}}
						>
							{text}
						</div>
					))}
				</div>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Blog Template
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
			<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
				{category && (
					<div
						style={{
							backgroundColor: `${colors.primary}20`,
							color: colors.primary,
							padding: "8px 16px",
							borderRadius: "6px",
							fontSize: typography.small,
							fontWeight: 700,
							textTransform: "uppercase",
							alignSelf: "flex-start",
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
				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						margin: 0,
					}}
				>
					{OG_MESSAGING.blog.defaultSubtitle}
				</p>
			</div>
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
			<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
				{category && (
					<div
						style={{
							backgroundColor: `${colors.accent}20`,
							color: colors.accent,
							padding: "8px 16px",
							borderRadius: "6px",
							fontSize: typography.small,
							fontWeight: 700,
							textTransform: "uppercase",
							alignSelf: "flex-start",
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
				<p
					style={{
						color: colors.mutedForeground,
						fontSize: typography.subtitle,
						margin: 0,
					}}
				>
					{OG_MESSAGING.kb.defaultSubtitle}
				</p>
			</div>
		</OGBaseLayout>
	);
}

/**
 * Default/Fallback Template
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
			<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
							color: colors.mutedForeground,
							fontSize: typography.subtitle,
							fontWeight: 600,
							margin: 0,
						}}
					>
						{subtitle}
					</p>
				)}
			</div>
		</OGBaseLayout>
	);
}

// Integration and Calculator templates (simplified versions)
export const IntegrationTemplate = DefaultTemplate;
export const CalculatorTemplate = DefaultTemplate;
