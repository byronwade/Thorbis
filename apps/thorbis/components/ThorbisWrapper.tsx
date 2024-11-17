"use client";

import { Thorbis } from "@thorbis/events";

export function ThorbisWrapper({ debug }: { debug: boolean }) {
	return <Thorbis debug={debug} />;
}
