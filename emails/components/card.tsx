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

interface CardProps {
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

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
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e7",
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px 0",
};
