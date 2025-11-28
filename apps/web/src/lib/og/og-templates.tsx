/* eslint-disable @next/next/no-img-element */
/**
 * OG Image Templates v2.0 - STUNNING REDESIGN
 *
 * Eye-catching, unique designs for each page type.
 * Bold gradients, geometric patterns, strong visual hierarchy.
 */

import {
	type CompetitorSlug,
	type FeatureSlug,
	type IndustrySlug,
	OG_CONFIG,
	OG_MESSAGING,
} from "./og-config";

const { colors, typography } = OG_CONFIG;

/**
 * Logo loader - Edge Runtime compatible
 */
export async function getLogoDataUrl(): Promise<string | undefined> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
		const response = await fetch(`${baseUrl}/ThorbisLogo.png`);

		if (!response.ok) return undefined;

		const arrayBuffer = await response.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer);
		let binary = "";
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return `data:image/png;base64,${btoa(binary)}`;
	} catch {
		return undefined;
	}
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

/**
 * Gradient background with glow effects
 */
function GradientBackground({
	gradient,
	variant = "default",
}: {
	gradient: [string, string];
	variant?: "default" | "diagonal" | "radial" | "split";
}) {
	const [color1, color2] = gradient;

	return (
		<>
			{/* Base dark background */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: colors.background,
				}}
			/>

			{/* Primary gradient accent */}
			{variant === "default" && (
				<div
					style={{
						position: "absolute",
						top: 0,
						right: 0,
						width: "70%",
						height: "100%",
						background: `linear-gradient(135deg, ${color1}15 0%, ${color2}08 50%, transparent 100%)`,
					}}
				/>
			)}

			{variant === "diagonal" && (
				<div
					style={{
						position: "absolute",
						top: "-50%",
						right: "-20%",
						width: "100%",
						height: "200%",
						background: `linear-gradient(135deg, ${color1}20 0%, ${color2}10 100%)`,
						transform: "rotate(-15deg)",
					}}
				/>
			)}

			{variant === "radial" && (
				<div
					style={{
						position: "absolute",
						top: "-30%",
						right: "-10%",
						width: "80%",
						height: "160%",
						background: `radial-gradient(ellipse at center, ${color1}25 0%, ${color2}10 40%, transparent 70%)`,
					}}
				/>
			)}

			{variant === "split" && (
				<>
					<div
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							width: "100%",
							height: "40%",
							background: `linear-gradient(to top, ${color1}20 0%, transparent 100%)`,
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							width: "50%",
							height: "100%",
							background: `linear-gradient(to left, ${color2}15 0%, transparent 100%)`,
						}}
					/>
				</>
			)}

			{/* Accent glow orbs */}
			<div
				style={{
					position: "absolute",
					top: "10%",
					right: "5%",
					width: "400px",
					height: "400px",
					background: `radial-gradient(circle, ${color1}30 0%, transparent 60%)`,
					filter: "blur(60px)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "20%",
					left: "10%",
					width: "300px",
					height: "300px",
					background: `radial-gradient(circle, ${color2}20 0%, transparent 60%)`,
					filter: "blur(40px)",
				}}
			/>

			{/* Geometric accent line */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: "10%",
					bottom: "10%",
					width: "6px",
					background: `linear-gradient(to bottom, ${color1}, ${color2})`,
					borderRadius: "0 4px 4px 0",
				}}
			/>
		</>
	);
}

/**
 * Grid pattern overlay
 */
function GridPattern({ opacity = 0.03 }: { opacity?: number }) {
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundImage: `linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
				backgroundSize: "60px 60px",
			}}
		/>
	);
}

/**
 * Logo and brand header
 */
function BrandHeader({ logoDataUrl }: { logoDataUrl?: string }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "16px",
			}}
		>
			{logoDataUrl && (
				<img
					src={logoDataUrl}
					alt="Thorbis"
					width="48"
					height="48"
					style={{ objectFit: "contain" }}
				/>
			)}
			<span
				style={{
					color: colors.foreground,
					fontSize: 32,
					fontWeight: 800,
					letterSpacing: "-0.5px",
				}}
			>
				Thorbis
			</span>
		</div>
	);
}

/**
 * Badge component
 */
function Badge({
	children,
	color = colors.primary,
}: {
	children: React.ReactNode;
	color?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				backgroundColor: `${color}20`,
				color: color,
				padding: "10px 20px",
				borderRadius: "8px",
				fontSize: 18,
				fontWeight: 700,
				textTransform: "uppercase",
				letterSpacing: "1px",
			}}
		>
			{children}
		</div>
	);
}

/**
 * Stat display with large number
 */
function StatDisplay({
	value,
	unit,
	label,
	color = colors.accent,
	size = "large",
}: {
	value: string;
	unit?: string;
	label: string;
	color?: string;
	size?: "large" | "medium" | "small";
}) {
	const sizes = {
		large: {
			value: typography.display,
			unit: typography.hero,
			label: typography.body,
		},
		medium: {
			value: typography.hero,
			unit: typography.title,
			label: typography.caption,
		},
		small: {
			value: typography.title,
			unit: typography.subtitle,
			label: typography.caption,
		},
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
			<div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
				<span
					style={{
						color: color,
						fontSize: sizes[size].value,
						fontWeight: 800,
						lineHeight: 1,
						letterSpacing: "-3px",
					}}
				>
					{value}
				</span>
				{unit && (
					<span
						style={{
							color: color,
							fontSize: sizes[size].unit,
							fontWeight: 700,
							lineHeight: 1,
						}}
					>
						{unit}
					</span>
				)}
			</div>
			<span
				style={{
					color: colors.mutedForeground,
					fontSize: sizes[size].label,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "1px",
				}}
			>
				{label}
			</span>
		</div>
	);
}

// ============================================================================
// PAGE TEMPLATES
// ============================================================================

/**
 * HOMEPAGE - Bold hero with stats
 */
export function HomepageTemplate({ logoDataUrl }: { logoDataUrl?: string }) {
	const { homepage } = OG_MESSAGING;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground gradient={["#4B7BF5", "#A855F7"]} variant="radial" />
			<GridPattern opacity={0.02} />

			{/* Content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				{/* Header */}
				<BrandHeader logoDataUrl={logoDataUrl} />

				{/* Main content */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "32px",
						marginTop: "-40px",
					}}
				>
					{/* Headline */}
					<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
							{homepage.headline}
						</h1>
						<h2
							style={{
								color: colors.accent,
								fontSize: typography.hero,
								fontWeight: 800,
								lineHeight: 1.1,
								margin: 0,
								letterSpacing: "-2px",
							}}
						>
							{homepage.subheadline}
						</h2>
					</div>

					{/* Tagline */}
					<p
						style={{
							color: colors.mutedForeground,
							fontSize: typography.subtitle,
							fontWeight: 500,
							margin: 0,
						}}
					>
						{homepage.tagline}
					</p>

					{/* Stats row */}
					<div style={{ display: "flex", gap: "48px", marginTop: "16px" }}>
						{homepage.stats.map((stat, i) => (
							<div
								key={i}
								style={{ display: "flex", flexDirection: "column", gap: "4px" }}
							>
								<span
									style={{
										color: colors.foreground,
										fontSize: typography.title,
										fontWeight: 800,
										letterSpacing: "-1px",
									}}
								>
									{stat.value}
								</span>
								<span
									style={{
										color: colors.mutedForeground,
										fontSize: typography.caption,
										fontWeight: 600,
										textTransform: "uppercase",
										letterSpacing: "1px",
									}}
								>
									{stat.label}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Footer */}
				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * PRICING - Dramatic savings focus
 */
export function PricingTemplate({ logoDataUrl }: { logoDataUrl?: string }) {
	const { pricing } = OG_MESSAGING;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={["#3D9B4F", "#4DB861"]}
				variant="diagonal"
			/>
			<GridPattern opacity={0.02} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "24px",
						marginTop: "-40px",
					}}
				>
					{/* Savings headline */}
					<Badge color={colors.accent}>Annual Savings</Badge>

					<h1
						style={{
							color: colors.accent,
							fontSize: typography.display,
							fontWeight: 800,
							lineHeight: 1,
							margin: 0,
							letterSpacing: "-4px",
						}}
					>
						{pricing.headline}
					</h1>

					{/* Price display */}
					<div
						style={{
							display: "flex",
							alignItems: "baseline",
							gap: "8px",
							marginTop: "8px",
						}}
					>
						<span
							style={{
								color: colors.foreground,
								fontSize: typography.hero,
								fontWeight: 800,
								letterSpacing: "-2px",
							}}
						>
							{pricing.price}
						</span>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.title,
								fontWeight: 700,
							}}
						>
							{pricing.period}
						</span>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.subtitle,
								fontWeight: 500,
								marginLeft: "16px",
							}}
						>
							{pricing.comparison}
						</span>
					</div>

					{/* Features */}
					<div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
						{pricing.features.slice(0, 4).map((feature, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									color: colors.mutedForeground,
									fontSize: typography.caption,
									fontWeight: 600,
								}}
							>
								<div
									style={{
										width: "8px",
										height: "8px",
										borderRadius: "50%",
										backgroundColor: colors.accent,
									}}
								/>
								{feature}
							</div>
						))}
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/pricing
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * FEATURE - Dynamic feature showcase
 */
export function FeatureTemplate({
	slug,
	logoDataUrl,
}: {
	slug: FeatureSlug;
	logoDataUrl?: string;
}) {
	const feature = OG_MESSAGING.features[slug];
	if (!feature)
		return <GenericTemplate title="Feature" logoDataUrl={logoDataUrl} />;

	const [color1, color2] = feature.gradient;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={feature.gradient as [string, string]}
				variant="split"
			/>
			<GridPattern opacity={0.02} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flex: 1,
						alignItems: "center",
						gap: "64px",
						marginTop: "-40px",
					}}
				>
					{/* Left side - Content */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							gap: "24px",
						}}
					>
						<Badge color={color1}>Feature</Badge>

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
							{feature.title}
						</h1>

						<h2
							style={{
								color: colors.mutedForeground,
								fontSize: typography.title,
								fontWeight: 600,
								margin: 0,
							}}
						>
							{feature.headline}
						</h2>

						{/* Price badge */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "16px",
								marginTop: "16px",
							}}
						>
							<div
								style={{
									backgroundColor: colors.accent,
									color: "#FFFFFF",
									padding: "12px 24px",
									borderRadius: "8px",
									fontSize: typography.body,
									fontWeight: 800,
								}}
							>
								$200/mo
							</div>
							<span
								style={{
									color: colors.mutedForeground,
									fontSize: typography.caption,
									fontWeight: 600,
								}}
							>
								All Features Included
							</span>
						</div>
					</div>

					{/* Right side - Stat */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							width: "280px",
							height: "280px",
							borderRadius: "24px",
							background: `linear-gradient(135deg, ${color1}20, ${color2}10)`,
							border: `2px solid ${color1}30`,
						}}
					>
						<StatDisplay
							value={feature.stat.value}
							unit={feature.stat.unit}
							label={feature.stat.label}
							color={color1}
							size="large"
						/>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/features/{slug}
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * INDUSTRY - Industry-specific showcase
 */
export function IndustryTemplate({
	slug,
	logoDataUrl,
}: {
	slug: IndustrySlug;
	logoDataUrl?: string;
}) {
	const industry = OG_MESSAGING.industries[slug];
	if (!industry)
		return (
			<GenericTemplate title="Industry Solution" logoDataUrl={logoDataUrl} />
		);

	const [color1, color2] = industry.gradient;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={industry.gradient as [string, string]}
				variant="radial"
			/>
			<GridPattern opacity={0.02} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "24px",
						marginTop: "-40px",
					}}
				>
					<Badge color={color1}>{industry.title}</Badge>

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
						{industry.headline}
					</h1>

					<p
						style={{
							color: colors.mutedForeground,
							fontSize: typography.subtitle,
							fontWeight: 500,
							margin: 0,
						}}
					>
						{industry.painPoint}
					</p>

					{/* Stats row */}
					<div style={{ display: "flex", gap: "48px", marginTop: "16px" }}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								padding: "20px 32px",
								borderRadius: "12px",
								background: `linear-gradient(135deg, ${color1}20, ${color2}10)`,
								border: `2px solid ${color1}30`,
							}}
						>
							<span
								style={{
									color: color1,
									fontSize: typography.title,
									fontWeight: 800,
									letterSpacing: "-1px",
								}}
							>
								{industry.stat.value}
							</span>
							<span
								style={{
									color: colors.mutedForeground,
									fontSize: typography.caption,
									fontWeight: 600,
									textTransform: "uppercase",
								}}
							>
								{industry.stat.label}
							</span>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								padding: "20px 32px",
								borderRadius: "12px",
								backgroundColor: colors.accent,
							}}
						>
							<span
								style={{
									color: "#FFFFFF",
									fontSize: typography.title,
									fontWeight: 800,
								}}
							>
								$200/mo
							</span>
							<span
								style={{
									color: "rgba(255,255,255,0.8)",
									fontSize: typography.caption,
									fontWeight: 600,
								}}
							>
								All Features
							</span>
						</div>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/industries/{slug}
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * COMPETITOR - VS Battle comparison
 */
export function CompetitorTemplate({
	slug,
	logoDataUrl,
}: {
	slug: CompetitorSlug;
	logoDataUrl?: string;
}) {
	const competitor = OG_MESSAGING.competitors[slug];
	if (!competitor)
		return <GenericTemplate title="Compare" logoDataUrl={logoDataUrl} />;

	const [color1, color2] = competitor.gradient;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={competitor.gradient as [string, string]}
				variant="split"
			/>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "32px",
						marginTop: "-40px",
					}}
				>
					{/* VS Header */}
					<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
						<span
							style={{
								color: colors.foreground,
								fontSize: typography.title,
								fontWeight: 800,
							}}
						>
							Thorbis
						</span>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.subtitle,
								fontWeight: 800,
							}}
						>
							VS
						</span>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.title,
								fontWeight: 800,
							}}
						>
							{competitor.name}
						</span>
					</div>

					{/* Price comparison */}
					<div style={{ display: "flex", alignItems: "flex-end", gap: "48px" }}>
						{/* Our price */}
						<div
							style={{ display: "flex", flexDirection: "column", gap: "8px" }}
						>
							<span
								style={{
									color: colors.accent,
									fontSize: typography.display,
									fontWeight: 800,
									lineHeight: 1,
									letterSpacing: "-4px",
								}}
							>
								{competitor.ourPrice}
							</span>
							<span
								style={{
									color: colors.foreground,
									fontSize: typography.subtitle,
									fontWeight: 700,
								}}
							>
								/month
							</span>
						</div>

						{/* Their price */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "8px",
								opacity: 0.5,
							}}
						>
							<span
								style={{
									color: colors.destructive,
									fontSize: typography.hero,
									fontWeight: 800,
									lineHeight: 1,
									letterSpacing: "-2px",
									textDecoration: "line-through",
								}}
							>
								{competitor.theirPrice}
							</span>
							<span
								style={{
									color: colors.mutedForeground,
									fontSize: typography.body,
									fontWeight: 600,
								}}
							>
								/month
							</span>
						</div>
					</div>

					{/* Savings callout */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							padding: "16px 32px",
							borderRadius: "12px",
							background: `linear-gradient(135deg, ${color1}20, ${color2}10)`,
							border: `2px solid ${color1}40`,
							alignSelf: "flex-start",
						}}
					>
						<span
							style={{
								color: color1,
								fontSize: typography.title,
								fontWeight: 800,
							}}
						>
							Save {competitor.savings}
						</span>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.body,
								fontWeight: 600,
							}}
						>
							{competitor.savingsPeriod}
						</span>
					</div>

					{/* Headline */}
					<p
						style={{
							color: colors.mutedForeground,
							fontSize: typography.subtitle,
							fontWeight: 600,
							margin: 0,
						}}
					>
						{competitor.headline}
					</p>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/vs/{slug}
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * BLOG - Clean editorial style
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
	const { blog } = OG_MESSAGING;
	const [color1, color2] = blog.gradient;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={blog.gradient as [string, string]}
				variant="default"
			/>
			<GridPattern opacity={0.015} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "24px",
						marginTop: "-40px",
					}}
				>
					<Badge color={color1}>{category || blog.defaultCategory}</Badge>

					<h1
						style={{
							color: colors.foreground,
							fontSize: title.length > 50 ? typography.title : typography.hero,
							fontWeight: 800,
							lineHeight: 1.2,
							margin: 0,
							letterSpacing: "-1px",
							maxWidth: "900px",
						}}
					>
						{title}
					</h1>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "24px",
							marginTop: "16px",
						}}
					>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.caption,
								fontWeight: 600,
							}}
						>
							Thorbis Blog
						</span>
						<div
							style={{
								width: "4px",
								height: "4px",
								borderRadius: "50%",
								backgroundColor: colors.mutedForeground,
							}}
						/>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.caption,
								fontWeight: 600,
							}}
						>
							Field Service Insights
						</span>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/blog
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * KNOWLEDGE BASE - Help center style
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
	const { kb } = OG_MESSAGING;
	const [color1] = kb.gradient;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={kb.gradient as [string, string]}
				variant="default"
			/>
			<GridPattern opacity={0.015} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "24px",
						marginTop: "-40px",
					}}
				>
					<Badge color={color1}>{category || kb.defaultCategory}</Badge>

					<h1
						style={{
							color: colors.foreground,
							fontSize: title.length > 50 ? typography.title : typography.hero,
							fontWeight: 800,
							lineHeight: 1.2,
							margin: 0,
							letterSpacing: "-1px",
							maxWidth: "900px",
						}}
					>
						{title}
					</h1>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							marginTop: "16px",
						}}
					>
						<div
							style={{
								backgroundColor: `${color1}20`,
								color: color1,
								padding: "8px 16px",
								borderRadius: "6px",
								fontSize: typography.caption,
								fontWeight: 700,
							}}
						>
							Help Center
						</div>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.caption,
								fontWeight: 600,
							}}
						>
							Step-by-step guides & tutorials
						</span>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/kb
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * GENERIC - Fallback template
 */
export function GenericTemplate({
	title,
	subtitle,
	logoDataUrl,
}: {
	title: string;
	subtitle?: string;
	logoDataUrl?: string;
}) {
	const { generic } = OG_MESSAGING;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={generic.gradient as [string, string]}
				variant="default"
			/>
			<GridPattern opacity={0.02} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "20px",
						marginTop: "-40px",
					}}
				>
					<h1
						style={{
							color: colors.foreground,
							fontSize: title.length > 40 ? typography.title : typography.hero,
							fontWeight: 800,
							lineHeight: 1.2,
							margin: 0,
							letterSpacing: "-1px",
							maxWidth: "900px",
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
								maxWidth: "700px",
							}}
						>
							{subtitle}
						</p>
					)}

					{/* Price badge */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							marginTop: "24px",
						}}
					>
						<div
							style={{
								backgroundColor: colors.accent,
								color: "#FFFFFF",
								padding: "12px 24px",
								borderRadius: "8px",
								fontSize: typography.body,
								fontWeight: 800,
							}}
						>
							$200/mo
						</div>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.caption,
								fontWeight: 600,
							}}
						>
							All Features Included
						</span>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * DEFAULT - Alias for GenericTemplate
 */
const DefaultTemplate = GenericTemplate;

/**
 * INTEGRATION - Integration showcase
 */
export function IntegrationTemplate({
	name,
	description,
	logoDataUrl,
}: {
	name: string;
	description?: string;
	logoDataUrl?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground gradient={["#4B7BF5", "#A855F7"]} variant="radial" />
			<GridPattern opacity={0.02} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "24px",
						marginTop: "-40px",
					}}
				>
					<Badge color="#4B7BF5">Integration</Badge>

					<h1
						style={{
							color: colors.foreground,
							fontSize: typography.hero,
							fontWeight: 800,
							lineHeight: 1.2,
							margin: 0,
							letterSpacing: "-1px",
						}}
					>
						{name}
					</h1>

					{description && (
						<p
							style={{
								color: colors.mutedForeground,
								fontSize: typography.subtitle,
								fontWeight: 500,
								margin: 0,
							}}
						>
							{description}
						</p>
					)}

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							marginTop: "16px",
						}}
					>
						<div
							style={{
								backgroundColor: colors.accent,
								color: "#FFFFFF",
								padding: "12px 24px",
								borderRadius: "8px",
								fontSize: typography.body,
								fontWeight: 800,
							}}
						>
							Connect in Minutes
						</div>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.caption,
								fontWeight: 600,
							}}
						>
							No Code Required
						</span>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/integrations
					</span>
				</div>
			</div>
		</div>
	);
}

/**
 * CALCULATOR - Tool showcase
 */
export function CalculatorTemplate({
	title,
	subtitle,
	logoDataUrl,
}: {
	title: string;
	subtitle?: string;
	logoDataUrl?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				padding: "56px 64px",
				fontFamily: "Inter, sans-serif",
				position: "relative",
				overflow: "hidden",
				backgroundColor: colors.background,
			}}
		>
			<GradientBackground
				gradient={["#F5C842", "#E64980"]}
				variant="diagonal"
			/>
			<GridPattern opacity={0.02} />

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "relative",
					zIndex: 1,
					height: "100%",
				}}
			>
				<BrandHeader logoDataUrl={logoDataUrl} />

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						justifyContent: "center",
						gap: "24px",
						marginTop: "-40px",
					}}
				>
					<Badge color="#F5C842">Free Tool</Badge>

					<h1
						style={{
							color: colors.foreground,
							fontSize: typography.hero,
							fontWeight: 800,
							lineHeight: 1.2,
							margin: 0,
							letterSpacing: "-1px",
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
							}}
						>
							{subtitle}
						</p>
					)}

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							marginTop: "16px",
						}}
					>
						<div
							style={{
								backgroundColor: "#F5C842",
								color: "#FFFFFF",
								padding: "12px 24px",
								borderRadius: "8px",
								fontSize: typography.body,
								fontWeight: 800,
							}}
						>
							Calculate Now
						</div>
						<span
							style={{
								color: colors.mutedForeground,
								fontSize: typography.caption,
								fontWeight: 600,
							}}
						>
							100% Free, No Signup
						</span>
					</div>
				</div>

				<div style={{ display: "flex" }}>
					<span
						style={{
							color: colors.mutedForeground,
							fontSize: typography.caption,
							fontWeight: 500,
						}}
					>
						thorbis.com/free-tools
					</span>
				</div>
			</div>
		</div>
	);
}
