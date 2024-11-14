import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		"cli/index": "src/cli/index.ts",
		"events/index": "src/events/index.ts",
		"events/components/index": "src/events/components/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	minify: true,
	external: ["react", "next", "next/script", "react-dom"],
	env: {
		NODE_ENV: process.env.NODE_ENV || "development",
	},
	esbuildOptions(options) {
		// Add "use client" directive for all event-related files
		options.banner = {
			js: Object.keys(options.entryPoints || {}).some((entry) => entry.includes("events/")) ? '"use client";\n' : "",
		};
	},
});
