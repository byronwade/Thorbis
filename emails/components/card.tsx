/**
 * Email Card Component - Information card matching dashboard cards
 *
 * Design:
 * - Clean white background with subtle border
 * - Rounded corners
 * - Padding for content spacing
 * - Optional header and footer sections
 */

import { Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { EMAIL_COLORS } from "../theme";

type CardProps = {
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
};

export function Card({ children, title, style }: CardProps) {
  return (
    <Section
      style={{
        ...cardStyle,
        ...style,
      }}
    >
      {title && <Text style={titleStyle}>{title}</Text>}
      {children}
    </Section>
  );
}

const cardStyle = {
  backgroundColor: EMAIL_COLORS.surface,
  border: `1px solid ${EMAIL_COLORS.border}`,
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: EMAIL_COLORS.heading,
  margin: "0 0 16px 0",
};
