/**
 * Email Button Component - Matches dashboard button design
 *
 * Design:
 * - Primary variant with Thorbis Electric Blue
 * - Outline variant for secondary actions
 * - Responsive and accessible
 * - Supports both link and button styles
 */

import { Button as EmailButton } from "@react-email/components";
import { EMAIL_COLORS } from "../theme";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const baseStyle = {
    display: "inline-block",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    borderRadius: "8px",
    textAlign: "center" as const,
    transition: "all 0.2s ease",
  };

  const variantStyles = {
    primary: {
      backgroundColor: EMAIL_COLORS.primary, // Thorbis Electric Blue
      color: EMAIL_COLORS.primaryText,
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: EMAIL_COLORS.primary,
      border: `2px solid ${EMAIL_COLORS.primary}`,
    },
  };

  return (
    <EmailButton
      href={href}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
      }}
    >
      {children}
    </EmailButton>
  );
}
