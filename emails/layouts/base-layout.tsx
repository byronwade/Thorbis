/**
 * Base Email Layout - Shared layout for all email templates
 *
 * Design System:
 * - Thorbis Electric Blue primary color: hsl(217 91% 60%)
 * - Dark-first design with OKLCH colors
 * - Responsive mobile-first layout
 * - 600px max width for email compatibility
 * - Professional footer with company info
 */

import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { EMAIL_COLORS } from "../theme";

type BaseLayoutProps = {
	children: ReactNode;
	previewText?: string;
};

export function BaseLayout({ children, previewText }: BaseLayoutProps) {
	return (
		<Html>
			<Head>
				<style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
			</Head>
			{previewText && <Preview>{previewText}</Preview>}
			<Body style={main}>
				<Container style={container}>
					{/* Header with logo */}
					<Section style={header}>
						<Text style={logo}>Thorbis</Text>
					</Section>

					{/* Main content */}
					<Section style={content}>{children}</Section>

					{/* Divider */}
					<Hr style={divider} />

					{/* Footer */}
					<Section style={footer}>
						<Text style={footerText}>This email was sent by Thorbis</Text>
						<Text style={footerText}>
							Have questions?{" "}
							<Link href="mailto:support@thorbis.com" style={footerLink}>
								Contact Support
							</Link>
						</Text>
						<Text style={footerText}>
							<Link href="https://thorbis.com/privacy" style={footerLink}>
								Privacy Policy
							</Link>
							{" • "}
							<Link href="https://thorbis.com/terms" style={footerLink}>
								Terms of Service
							</Link>
							{" • "}
							<Link href="{{unsubscribe_url}}" style={footerLink}>
								Unsubscribe
							</Link>
						</Text>
						<Text style={footerCopyright}>
							© {new Date().getFullYear()} Thorbis. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

// Styles matching dashboard design system
const main = {
	backgroundColor: EMAIL_COLORS.background, // Light background
	fontFamily:
		'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
	padding: "40px 20px",
};

const container = {
	backgroundColor: EMAIL_COLORS.surface,
	maxWidth: "600px",
	margin: "0 auto",
	borderRadius: "12px",
	overflow: "hidden" as const,
	boxShadow: "0 2px 8px rgba(17, 24, 39, 0.08)",
};

const header = {
	backgroundColor: EMAIL_COLORS.primary,
	padding: "32px 40px",
	textAlign: "center" as const,
};

const logo = {
	color: EMAIL_COLORS.primaryText,
	fontSize: "28px",
	fontWeight: "700",
	margin: "0",
	letterSpacing: "-0.02em",
};

const content = {
	padding: "40px",
};

const divider = {
	borderColor: EMAIL_COLORS.border,
	margin: "0",
};

const footer = {
	padding: "32px 40px",
	textAlign: "center" as const,
	backgroundColor: EMAIL_COLORS.surfaceStrong,
};

const footerText = {
	color: EMAIL_COLORS.muted,
	fontSize: "14px",
	lineHeight: "24px",
	margin: "8px 0",
};

const footerLink = {
	color: EMAIL_COLORS.primary,
	textDecoration: "none",
};

const footerCopyright = {
	color: EMAIL_COLORS.muted,
	fontSize: "12px",
	margin: "16px 0 0 0",
};
