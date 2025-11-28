"use client";

import dynamic from "next/dynamic";
import { DispatchMapSkeleton } from "./map-skeleton";

const DispatchMapEmbedded = dynamic(
	() =>
		import("./dispatch-map-embedded").then((mod) => ({
			default: mod.DispatchMapEmbedded,
		})),
	{
		loading: () => <DispatchMapSkeleton />,
		ssr: false,
	},
);

export function DispatchMapLazy() {
	return <DispatchMapEmbedded />;
}
