/**
 * Email Divider Component - Visual separator
 *
 * Design:
 * - Subtle gray divider line
 * - Proper spacing above and below
 * - Matches dashboard separator styling
 */

import { Hr } from "@react-email/components";
import { EMAIL_COLORS } from "../theme";

type DividerProps = {
	style?: React.CSSProperties;
};

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
	borderTop: `1px solid ${EMAIL_COLORS.border}`,
	margin: "24px 0",
};
