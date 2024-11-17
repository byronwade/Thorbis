import * as tf from "@tensorflow/tfjs";
import { join } from "path";
import { mkdir, cp } from "fs/promises";

const MODEL_VERSION = "1.0.0";
const MODEL_PATHS = {
	registry: "/models/model-registry.json",
	behavior: "/models/user-behavior/model.json",
	attention: "/models/attention-pattern/model.json",
	sentiment: "/models/sentiment-analysis/model.json",
};

/**
 * Copy models to public directory
 */
export async function copyModelsToPublic() {
	if (typeof window !== "undefined") return;

	const srcDir = join(process.cwd(), "src/lib/analytics/models/trained");
	const destDir = join(process.cwd(), "public/models");

	try {
		// Create destination directory
		await mkdir(destDir, { recursive: true });

		// Copy model files and create fallback if needed
		try {
			await Promise.all([cp(join(srcDir, "user-behavior"), join(destDir, "user-behavior"), { recursive: true }), cp(join(srcDir, "attention-pattern"), join(destDir, "attention-pattern"), { recursive: true }), cp(join(srcDir, "sentiment-analysis"), join(destDir, "sentiment-analysis"), { recursive: true }), cp(join(srcDir, "model-registry.json"), join(destDir, "model-registry.json"))]);
		} catch (error) {
			console.warn("Error copying models, creating fallback:", error);
			// Create minimal fallback files
			await mkdir(join(destDir, "fallback"), { recursive: true });
		}

		console.log("Models directory setup complete");
	} catch (error) {
		console.error("Error setting up models directory:", error);
		throw error;
	}
}

/**
 * Add this to your build script or Next.js config
 */
export async function initializeModels() {
	await copyModelsToPublic();
}

// Run during build
if (process.env.NODE_ENV === "production") {
	copyModelsToPublic();
}
