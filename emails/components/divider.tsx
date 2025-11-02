/**
 * Email Divider Component - Visual separator
 *
 * Design:
 * - Subtle gray divider line
 * - Proper spacing above and below
 * - Matches dashboard separator styling
 */

import { Hr } from "@react-email/components";

interface DividerProps {
  style?: React.CSSProperties;
}

export function Divider({ style }: DividerProps) {
  return (
    <Hr
      style={{
        ...dividerStyle,
        ...style,
      }}
    />
  );
}

const dividerStyle = {
  border: "none",
  borderTop: "1px solid #e5e5e7",
  margin: "24px 0",
};
