import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"components/index": "src/components/index.ts",
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
		options.banner = {
			js: '"use client";\n',
		};
	},
});
