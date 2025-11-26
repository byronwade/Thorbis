/**
 * Thorbis-Branded Email Layout
 *
 * For platform/system emails:
 * - Clean, full-width design (no cards)
 * - Thorbis logo image from CDN/env
 * - Thorbis Electric Blue branding
 * - Professional footer with Thorbis info
 *
 * Uses environment variables for:
 * - Logo URL
 * - App URL
 * - Support email
 * - Company info
 */

import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Img,
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

// Environment-based configuration
const THORBIS_LOGO_URL =
	process.env.NEXT_PUBLIC_THORBIS_LOGO_URL ||
	"https://thorbis.com/logo-white.png";
const THORBIS_APP_URL =
	process.env.NEXT_PUBLIC_APP_URL || "https://app.thorbis.com";
const THORBIS_WEBSITE =
	process.env.NEXT_PUBLIC_WEBSITE_URL || "https://thorbis.com";
const THORBIS_SUPPORT_EMAIL =
	process.env.THORBIS_SUPPORT_EMAIL || "support@thorbis.com";
const THORBIS_DOCS_URL = `${THORBIS_WEBSITE}/docs`;
const THORBIS_PRIVACY_URL = `${THORBIS_WEBSITE}/privacy`;
const THORBIS_TERMS_URL = `${THORBIS_WEBSITE}/terms`;

export function BaseLayout({ children, previewText }: BaseLayoutProps) {
	return (
		<Html>
			<Head>
				<style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          /* Reset email client styles */
          body { margin: 0; padding: 0; }
          table { border-collapse: collapse; }
          img { border: 0; }

          /* Responsive */
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 20px !important; }
            .mobile-text { font-size: 14px !important; }
            .mobile-heading { font-size: 24px !important; }
          }
        `}</style>
			</Head>
			{previewText && <Preview>{previewText}</Preview>}
			<Body style={main}>
				<Container style={container}>
					{/* Header with Thorbis logo on blue background */}
					<Section style={header}>
						<Img
							src={THORBIS_LOGO_URL}
							alt="Thorbis"
							width="160"
							height="40"
							style={logo}
						/>
					</Section>

					{/* Main content - full width, no cards */}
					<Section style={content} className="mobile-padding">
						{children}
					</Section>

					{/* Divider */}
					<Hr style={divider} />

					{/* Footer */}
					<Section style={footer} className="mobile-padding">
						{/* Support Links */}
						<Text style={footerText}>
							Need help?{" "}
							<Link href={`mailto:${THORBIS_SUPPORT_EMAIL}`} style={footerLink}>
								Contact Support
							</Link>
							{" • "}
							<Link href={THORBIS_DOCS_URL} style={footerLink}>
								Documentation
							</Link>
						</Text>

						{/* Legal Links */}
						<Text style={footerText}>
							<Link href={THORBIS_PRIVACY_URL} style={footerLink}>
								Privacy Policy
							</Link>
							{" • "}
							<Link href={THORBIS_TERMS_URL} style={footerLink}>
								Terms of Service
							</Link>
						</Text>

						{/* Company Info */}
						<Text style={footerCopyright}>
							© {new Date().getFullYear()} Thorbis. All rights reserved.
						</Text>

						<Text style={footerAddress}>
							Thorbis • 123 Innovation Drive, San Francisco, CA 94105
						</Text>

						{/* Unsubscribe - required for CAN-SPAM compliance */}
						<Text style={footerUnsubscribe}>
							You're receiving this email because you have an account with
							Thorbis.{" "}
							<Link href="{{unsubscribe_url}}" style={footerLink}>
								Unsubscribe from marketing emails
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

// Styles - Clean, full-width design
const main = {
	backgroundColor: EMAIL_COLORS.background,
	fontFamily:
		'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
	WebkitFontSmoothing: "antialiased" as const,
	MozOsxFontSmoothing: "grayscale" as const,
};

const container = {
	backgroundColor: EMAIL_COLORS.surface,
	maxWidth: "600px",
	margin: "0 auto",
};

const header = {
	backgroundColor: EMAIL_COLORS.primary, // Thorbis Electric Blue
	padding: "40px 0",
	textAlign: "center" as const,
};

const logo = {
	margin: "0 auto",
	display: "block",
};

const content = {
	padding: "48px 40px",
	color: EMAIL_COLORS.text,
	fontSize: "16px",
	lineHeight: "24px",
};

const divider = {
	borderColor: EMAIL_COLORS.border,
	borderWidth: "1px",
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
	fontWeight: "500",
};

const footerCopyright = {
	color: EMAIL_COLORS.muted,
	fontSize: "13px",
	margin: "16px 0 0 0",
	fontWeight: "600",
};

const footerAddress = {
	color: EMAIL_COLORS.muted,
	fontSize: "12px",
	margin: "8px 0",
};

const footerUnsubscribe = {
	color: EMAIL_COLORS.muted,
	fontSize: "11px",
	margin: "16px 0 0 0",
	lineHeight: "18px",
};
