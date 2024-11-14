import React from "react";
import Script from "next/script";
import { ThorbisInit } from "./ThorbisInit";

interface ThorbisScriptProps {
	debug?: boolean;
	devServerUrl?: string;
}

export function ThorbisScript(props: ThorbisScriptProps) {
	return (
		<>
			<Script
				id="thorbis-script"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
						window.__THORBIS_DEBUG__ = ${props.debug ?? false};
						window.__THORBIS_DEV_SERVER__ = "${props.devServerUrl ?? "http://localhost:3001"}";
					`,
				}}
			/>
			<ThorbisInit {...props} />
		</>
	);
}
