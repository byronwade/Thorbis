import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	target: "es2020",
	external: ["react", "react-dom"],
	esbuildOptions(options) {
		options.jsx = "automatic";
		options.minify = true;
		options.platform = "browser";
		options.define = {
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		};
		options.mainFields = ["browser", "module", "main"];
		options.conditions = ["browser", "import"];
		options.alias = {
			"@core": resolve(__dirname, "./src/lib/analytics/core"),
			"@events": resolve(__dirname, "./src/lib/analytics/events"),
			"@services": resolve(__dirname, "./src/lib/analytics/services"),
			"@utils": resolve(__dirname, "./src/lib/analytics/utils"),
			"@types": resolve(__dirname, "./src/lib/analytics/types"),
			"@constants": resolve(__dirname, "./src/lib/analytics/utils/constants"),
		};
	},
	treeshake: true,
	minify: true,
	outExtension({ format }) {
		return {
			js: format === "esm" ? ".mjs" : ".cjs",
		};
	},
});
