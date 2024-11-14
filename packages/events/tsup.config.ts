import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"components/index": "src/components/index.ts",
	},
	format: ["esm", "cjs"],
	dts: {
		resolve: true,
		entry: "./src/index.ts",
	},
	splitting: false,
	sourcemap: true,
	clean: true,
	external: ["react", "next/script"],
	outDir: "dist",
	treeshake: true,
	esbuildOptions(options) {
		options.jsx = "automatic";
	},
});
