/**
 * Email Heading Component - Typography for email headings
 *
 * Design:
 * - H1, H2, H3 variants
 * - Matches dashboard typography
 * - Proper spacing and hierarchy
 */

import { Heading as EmailHeading } from "@react-email/components";

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  style?: React.CSSProperties;
}

export function Heading({ children, level = 1, style }: HeadingProps) {
  const headingStyles = {
    1: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#111827",
      margin: "0 0 16px 0",
      lineHeight: "1.2",
    },
    2: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1f2937",
      margin: "0 0 12px 0",
      lineHeight: "1.3",
    },
    3: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#374151",
      margin: "0 0 8px 0",
      lineHeight: "1.4",
    },
  };

  return (
    <EmailHeading
      as={`h${level}` as any}
      style={{
        ...headingStyles[level],
        ...style,
      }}
    >
      {children}
    </EmailHeading>
  );
}
