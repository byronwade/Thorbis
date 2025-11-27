import { defineConfig } from "vitest/config";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		exclude: ["node_modules", ".next"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/lib/billing/**", "src/lib/analytics/**"],
		},
		setupFiles: ["./src/test/setup.ts"],
		testTimeout: 10000,
		alias: {
			"@/lib/supabase": resolve(__dirname, "../../packages/database/src"),
			"@/": resolve(__dirname, "./src") + "/",
		},
	},
	resolve: {
		alias: {
			"@/lib/supabase": resolve(__dirname, "../../packages/database/src"),
			"@": resolve(__dirname, "./src"),
		},
	},
});
