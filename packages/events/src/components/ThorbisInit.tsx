"use client";

import React, { useEffect } from "react";
import { initializeTrackers } from "../initialize";
import type { ThorbisEventOptions } from "../types";

interface ThorbisInitProps {
	debug?: boolean;
	devServerUrl?: string;
}

export function ThorbisInit({ debug = false, devServerUrl = "http://localhost:3001" }: ThorbisInitProps) {
	useEffect(() => {
		const options: ThorbisEventOptions = {
			debug,
			onEvent: (events) => {
				if (debug) {
					console.log("Thorbis Events:", events);
				}
			},
		};

		const { destroy } = initializeTrackers(options);

		return () => {
			destroy();
		};
	}, [debug]);

	return null;
}
