/**
 * Company-Branded Email Layout
 *
 * For tenant/company-specific emails like:
 * - Invoices
 * - Estimates
 * - Job notifications
 * - Appointment confirmations
 * - Payment receipts
 *
 * Uses the company's branding instead of Thorbis branding:
 * - Company name
 * - Company logo (if available)
 * - Company colors (if configured)
 * - Company contact information
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

export interface CompanyBranding {
  companyName: string;
  logoUrl?: string;
  primaryColor?: string; // Hex or HSL color
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  address?: string;
}

type CompanyLayoutProps = {
  children: ReactNode;
  company: CompanyBranding;
  previewText?: string;
  showPoweredBy?: boolean; // Show "Powered by Thorbis" in footer
};

export function CompanyLayout({
  children,
  company,
  previewText,
  showPoweredBy = true,
}: CompanyLayoutProps) {
  const primaryColor = company.primaryColor || EMAIL_COLORS.primary;

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
          {/* Header with company logo/name */}
          <Section style={{ ...header, backgroundColor: primaryColor }}>
            {company.logoUrl ? (
              <Img
                src={company.logoUrl}
                alt={company.companyName}
                width="180"
                height="60"
                style={logoImg}
              />
            ) : (
              <Text style={logo}>{company.companyName}</Text>
            )}
          </Section>

          {/* Main content */}
          <Section style={content}>{children}</Section>

          {/* Divider */}
          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            {/* Company Contact Info */}
            <Text style={footerText}>
              <strong>{company.companyName}</strong>
            </Text>

            {company.address && <Text style={footerText}>{company.address}</Text>}

            {(company.supportEmail || company.supportPhone) && (
              <Text style={footerText}>
                {company.supportEmail && (
                  <>
                    <Link href={`mailto:${company.supportEmail}`} style={footerLink}>
                      {company.supportEmail}
                    </Link>
                  </>
                )}
                {company.supportEmail && company.supportPhone && " • "}
                {company.supportPhone && (
                  <Link href={`tel:${company.supportPhone.replace(/\s/g, "")}`} style={footerLink}>
                    {company.supportPhone}
                  </Link>
                )}
              </Text>
            )}

            {company.websiteUrl && (
              <Text style={footerText}>
                <Link href={company.websiteUrl} style={footerLink}>
                  Visit our website
                </Link>
              </Text>
            )}

            {/* Powered by Thorbis */}
            {showPoweredBy && (
              <>
                <Hr style={{ ...divider, margin: "24px 0" }} />
                <Text style={poweredByText}>
                  Powered by{" "}
                  <Link href="https://thorbis.com" style={footerLink}>
                    Thorbis
                  </Link>
                </Text>
              </>
            )}

            <Text style={footerCopyright}>
              © {new Date().getFullYear()} {company.companyName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles matching dashboard design system
const main = {
  backgroundColor: EMAIL_COLORS.background,
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

const logoImg = {
  margin: "0 auto",
  display: "block",
  maxWidth: "100%",
  height: "auto",
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

const poweredByText = {
  color: EMAIL_COLORS.muted,
  fontSize: "12px",
  lineHeight: "20px",
  margin: "16px 0 0 0",
  fontStyle: "italic",
};

const footerCopyright = {
  color: EMAIL_COLORS.muted,
  fontSize: "12px",
  margin: "16px 0 0 0",
};
