import React from "react";
import { ThorbisScript } from "@thorbis/events";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
				<ThorbisScript debug={true} devServerUrl="http://localhost:3010" />
			</body>
		</html>
	);
}
