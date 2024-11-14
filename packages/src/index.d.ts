declare module "thorbis/cli" {
	export * from "thorbis/dist/cli";
}

declare module "thorbis/events" {
	export * from "thorbis/dist/events";
}

declare module "thorbis/events/components" {
	export * from "thorbis/dist/events/components";
}

// Add internal module declarations
declare module "thorbis/dist/cli" {
	// Export your CLI types here
	export * from "./cli/types";
}

declare module "thorbis/dist/events" {
	// Export your events types here
	export * from "./events/types";
}

declare module "thorbis/dist/events/components" {
	// Export your component types here
	export * from "./events/components/types";
}
