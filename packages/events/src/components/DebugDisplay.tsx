import React, { useEffect, useState } from "react";

interface DebugDisplayProps {
	data: any;
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const DebugDisplay: React.FC<DebugDisplayProps> = ({ data, position = "bottom-right" }) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const positionStyles = {
		"top-left": { top: "1rem", left: "1rem" },
		"top-right": { top: "1rem", right: "1rem" },
		"bottom-left": { bottom: "1rem", left: "1rem" },
		"bottom-right": { bottom: "1rem", right: "1rem" },
	};

	return (
		<div
			style={{
				position: "fixed",
				zIndex: 9999,
				backgroundColor: "rgba(0, 0, 0, 0.8)",
				color: "#00ff00",
				padding: "1rem",
				borderRadius: "0.5rem",
				fontFamily: "monospace",
				fontSize: "12px",
				maxWidth: "300px",
				maxHeight: isCollapsed ? "40px" : "400px",
				overflow: "auto",
				transition: "all 0.3s ease",
				...positionStyles[position],
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "0.5rem",
					cursor: "pointer",
				}}
				onClick={() => setIsCollapsed(!isCollapsed)}
			>
				<span>Thorbis Debug</span>
				<span>{isCollapsed ? "▼" : "▲"}</span>
			</div>
			{!isCollapsed && <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>}
		</div>
	);
};
