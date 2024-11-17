import * as tf from "@tensorflow/tfjs";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODELS_DIR = join(process.cwd(), "public/models");

interface TrainingData {
	behaviorData: {
		mouseMovements: number[][];
		scrollPatterns: number[][];
		clickPatterns: number[][];
		timeOnPage: number[];
		interactions: number[][];
	};
	labels: {
		userTypes: string[];
		expertiseLevels: string[];
		intents: string[];
		engagementScores: number[];
	};
}

/**
 * Create and train behavior analysis model
 */
async function createBehaviorModel(data: TrainingData): Promise<tf.LayersModel> {
	try {
		// Prepare input features
		const inputFeatures = data.behaviorData.mouseMovements.map((movement, i) => [...movement, ...data.behaviorData.scrollPatterns[i], ...data.behaviorData.clickPatterns[i], data.behaviorData.timeOnPage[i], ...data.behaviorData.interactions[i]]);

		// Convert to tensor with explicit shape
		const features = tf.tensor2d(inputFeatures);

		// One-hot encode labels
		const uniqueUserTypes = Array.from(new Set(data.labels.userTypes));
		const oneHotLabels = data.labels.userTypes.map((type) => {
			const oneHot = new Array(uniqueUserTypes.length).fill(0);
			oneHot[uniqueUserTypes.indexOf(type)] = 1;
			return oneHot;
		});
		const labels = tf.tensor2d(oneHotLabels);

		// Create sequential model
		const model = tf.sequential({
			layers: [
				tf.layers.dense({
					inputShape: [features.shape[1]],
					units: 32,
					activation: "relu",
					kernelInitializer: "glorotNormal",
				}),
				tf.layers.dropout({ rate: 0.2 }),
				tf.layers.dense({
					units: uniqueUserTypes.length,
					activation: "softmax",
					kernelInitializer: "glorotNormal",
				}),
			],
		});

		// Compile model
		model.compile({
			optimizer: tf.train.adam(0.001),
			loss: "categoricalCrossentropy",
			metrics: ["accuracy"],
		});

		// Train model
		await model.fit(features, labels, {
			epochs: 50,
			batchSize: Math.min(32, features.shape[0]),
			validationSplit: 0.2,
			shuffle: true,
			callbacks: {
				onEpochEnd: (epoch, logs) => {
					console.log(`Epoch ${epoch + 1}: ` + `loss = ${logs?.loss?.toFixed(4) || "N/A"}, ` + `accuracy = ${logs?.acc?.toFixed(4) || "N/A"}`);
				},
			},
		});

		// Cleanup tensors
		tf.dispose([features, labels]);

		return model;
	} catch (error) {
		console.error("Error in createBehaviorModel:", error);
		throw error;
	}
}

/**
 * Save model to filesystem
 */
async function saveModel(model: tf.LayersModel, modelDir: string) {
	// Ensure directory exists
	await mkdir(modelDir, { recursive: true });

	// Save model architecture
	const modelJSON = model.toJSON();
	await writeFile(join(modelDir, "model.json"), JSON.stringify(modelJSON, null, 2));

	// Save weights
	const weightData = await model.getWeights();
	const weightSpecs = weightData.map((w) => ({
		name: w.name,
		shape: w.shape,
		dtype: w.dtype,
	}));

	// Create binary weight files
	for (let i = 0; i < weightData.length; i++) {
		const weight = weightData[i];
		const buffer = Buffer.from(await weight.data());
		await writeFile(join(modelDir, `weight.${i}.bin`), buffer);
	}

	// Save weight manifest
	await writeFile(join(modelDir, "weights_manifest.json"), JSON.stringify({ weights: weightSpecs }, null, 2));
}

/**
 * Train and save models
 */
export async function trainModels() {
	let model: tf.LayersModel | null = null;

	try {
		// Initialize TensorFlow.js
		await tf.ready();

		// Create simple training data
		const trainingData: TrainingData = {
			behaviorData: {
				mouseMovements: [
					[0.2, 0.3, 0.4],
					[0.5, 0.6, 0.7],
				],
				scrollPatterns: [
					[0.1, 0.2],
					[0.3, 0.4],
				],
				clickPatterns: [
					[0.1, 0.2],
					[0.3, 0.4],
				],
				timeOnPage: [60, 120],
				interactions: [
					[1, 2],
					[3, 4],
				],
			},
			labels: {
				userTypes: ["browser", "researcher"],
				expertiseLevels: ["beginner", "expert"],
				intents: ["reading", "buying"],
				engagementScores: [0.5, 0.8],
			},
		};

		console.log("Training data loaded successfully");

		// Create models directory
		await mkdir(MODELS_DIR, { recursive: true });
		const userBehaviorDir = join(MODELS_DIR, "user-behavior");
		await mkdir(userBehaviorDir, { recursive: true });

		console.log("Models directory created:", MODELS_DIR);

		// Train behavior model
		console.log("Training behavior model...");
		model = await createBehaviorModel(trainingData);

		// Save model
		console.log("Saving model...");
		await saveModel(model, userBehaviorDir);

		// Save registry
		const modelRegistry = {
			version: "1.0.0",
			models: {
				behavior: {
					path: "/models/behavior/model.json",
					version: "1.0.0",
				},
			},
			updatedAt: new Date().toISOString(),
		};

		await writeFile(join(MODELS_DIR, "model-registry.json"), JSON.stringify(modelRegistry, null, 2));

		console.log("Model trained and saved successfully!");
	} catch (error) {
		console.error("Error during model training:", error);
		throw error;
	} finally {
		// Cleanup
		if (model) {
			model.dispose();
		}
		tf.disposeVariables();
	}
}

// Run training if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	trainModels()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error("Fatal error:", error);
			process.exit(1);
		});
}
