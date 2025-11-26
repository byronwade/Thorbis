/**
 * Google Vision Service
 *
 * Provides image analysis using Google Cloud Vision API
 * - OCR for serial numbers, part numbers, labels
 * - Equipment identification and classification
 * - Document scanning and data extraction
 * - Logo/brand detection for parts identification
 * - Barcode/QR code scanning
 *
 * API: Google Cloud Vision API
 * Docs: https://cloud.google.com/vision/docs
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const BoundingPolySchema = z.object({
	vertices: z.array(
		z.object({
			x: z.number().optional(),
			y: z.number().optional(),
		}),
	),
});

const TextAnnotationSchema = z.object({
	description: z.string(),
	boundingPoly: BoundingPolySchema.optional(),
	locale: z.string().optional(),
});

const EntityAnnotationSchema = z.object({
	mid: z.string().optional(),
	locale: z.string().optional(),
	description: z.string(),
	score: z.number().optional(),
	confidence: z.number().optional(),
	topicality: z.number().optional(),
	boundingPoly: BoundingPolySchema.optional(),
});

const LabelAnnotationSchema = z.object({
	mid: z.string().optional(),
	description: z.string(),
	score: z.number(),
	topicality: z.number().optional(),
});

const LogoAnnotationSchema = z.object({
	mid: z.string().optional(),
	description: z.string(),
	score: z.number(),
	boundingPoly: BoundingPolySchema.optional(),
});

const ObjectAnnotationSchema = z.object({
	mid: z.string().optional(),
	name: z.string(),
	score: z.number(),
	boundingPoly: BoundingPolySchema.optional(),
});

const ColorInfoSchema = z.object({
	color: z.object({
		red: z.number(),
		green: z.number(),
		blue: z.number(),
		alpha: z.number().optional(),
	}),
	score: z.number(),
	pixelFraction: z.number(),
});

const SerialNumberSchema = z.object({
	value: z.string(),
	confidence: z.number(),
	type: z.enum(["serial", "model", "part", "unknown"]),
	boundingBox: BoundingPolySchema.optional(),
});

const EquipmentAnalysisSchema = z.object({
	// Equipment identification
	equipmentType: z.string().optional(),
	brand: z.string().optional(),
	model: z.string().optional(),

	// Extracted text/numbers
	serialNumbers: z.array(SerialNumberSchema),
	allText: z.string(),

	// Labels and objects
	labels: z.array(LabelAnnotationSchema),
	logos: z.array(LogoAnnotationSchema),
	objects: z.array(ObjectAnnotationSchema),

	// Colors (for equipment matching)
	dominantColors: z.array(ColorInfoSchema),

	// Condition assessment hints
	conditionHints: z.array(z.string()),

	// HVAC-specific
	hvacInfo: z
		.object({
			type: z.enum([
				"furnace",
				"air_conditioner",
				"heat_pump",
				"water_heater",
				"thermostat",
				"air_handler",
				"condenser",
				"ductwork",
				"other",
			]),
			manufacturer: z.string().optional(),
			estimatedAge: z.string().optional(),
			efficiency: z.string().optional(),
		})
		.optional(),
});

const DocumentScanSchema = z.object({
	text: z.string(),
	confidence: z.number(),
	blocks: z.array(
		z.object({
			text: z.string(),
			confidence: z.number(),
			boundingBox: BoundingPolySchema.optional(),
		}),
	),
	structuredData: z.record(z.string()).optional(),
});

const BarcodeSchema = z.object({
	format: z.string(),
	rawValue: z.string(),
	boundingBox: BoundingPolySchema.optional(),
});

export type TextAnnotation = z.infer<typeof TextAnnotationSchema>;
export type EntityAnnotation = z.infer<typeof EntityAnnotationSchema>;
export type LabelAnnotation = z.infer<typeof LabelAnnotationSchema>;
export type LogoAnnotation = z.infer<typeof LogoAnnotationSchema>;
export type ObjectAnnotation = z.infer<typeof ObjectAnnotationSchema>;
export type SerialNumber = z.infer<typeof SerialNumberSchema>;
export type EquipmentAnalysis = z.infer<typeof EquipmentAnalysisSchema>;
export type DocumentScan = z.infer<typeof DocumentScanSchema>;
export type Barcode = z.infer<typeof BarcodeSchema>;

// ============================================================================
// HVAC Equipment Patterns
// ============================================================================

const HVAC_BRANDS = [
	"carrier",
	"trane",
	"lennox",
	"rheem",
	"ruud",
	"goodman",
	"amana",
	"york",
	"bryant",
	"american standard",
	"daikin",
	"mitsubishi",
	"fujitsu",
	"lg",
	"samsung",
	"honeywell",
	"ecobee",
	"nest",
	"bosch",
	"navien",
	"rinnai",
	"ao smith",
	"bradford white",
	"state water heaters",
];

const SERIAL_PATTERNS = [
	// Standard serial patterns
	/\b[A-Z]{2,4}[\d]{6,12}\b/gi, // Standard alphanumeric
	/\b\d{10,14}\b/g, // All numeric (10-14 digits)
	/\bS\/N[:\s]*([A-Z0-9-]+)\b/gi, // S/N prefix
	/\bSERIAL[:\s#]*([A-Z0-9-]+)\b/gi, // Serial prefix

	// Model number patterns
	/\bMODEL[:\s#]*([A-Z0-9-]+)\b/gi,
	/\bM\/N[:\s]*([A-Z0-9-]+)\b/gi,
	/\bMDL[:\s]*([A-Z0-9-]+)\b/gi,

	// Part number patterns
	/\bPART[:\s#]*([A-Z0-9-]+)\b/gi,
	/\bP\/N[:\s]*([A-Z0-9-]+)\b/gi,
	/\bSKU[:\s]*([A-Z0-9-]+)\b/gi,
];

const HVAC_TYPE_KEYWORDS: Record<string, string[]> = {
	furnace: ["furnace", "heating", "blower", "heat exchanger", "combustion"],
	air_conditioner: [
		"air conditioner",
		"a/c",
		"ac unit",
		"cooling",
		"seer",
		"condenser",
	],
	heat_pump: ["heat pump", "hspf", "hybrid", "dual fuel"],
	water_heater: [
		"water heater",
		"tank",
		"tankless",
		"gallon",
		"gpm",
		"gas water",
		"electric water",
	],
	thermostat: [
		"thermostat",
		"programmable",
		"smart home",
		"wifi",
		"temperature control",
	],
	air_handler: ["air handler", "ahu", "blower coil"],
	condenser: ["condenser", "outdoor unit", "compressor"],
	ductwork: ["duct", "ductwork", "register", "grille", "vent"],
};

// ============================================================================
// Google Vision Service
// ============================================================================

class GoogleVisionService {
	private readonly apiKey: string | undefined;

	constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.GOOGLE_CLOUD_VISION_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
	}

	/**
	 * Check if service is available
	 */
	isAvailable(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Analyze equipment image for serial numbers, brand, model
	 */
	async analyzeEquipment(
		imageSource: string | Buffer,
	): Promise<EquipmentAnalysis | null> {
		if (!this.apiKey) {
			console.warn("Google Vision Service: No API key configured");
			return null;
		}

		try {
			// Prepare image content
			const imageContent = await this.prepareImageContent(imageSource);

			// Request all relevant features
			const response = await fetch(
				`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						requests: [
							{
								image: imageContent,
								features: [
									{ type: "TEXT_DETECTION", maxResults: 50 },
									{ type: "LABEL_DETECTION", maxResults: 20 },
									{ type: "LOGO_DETECTION", maxResults: 10 },
									{ type: "OBJECT_LOCALIZATION", maxResults: 20 },
									{ type: "IMAGE_PROPERTIES" },
								],
							},
						],
					}),
				},
			);

			if (!response.ok) {
				console.error(
					`Google Vision API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			const data = await response.json();
			const annotations = data.responses?.[0];

			if (!annotations) {
				return null;
			}

			// Extract all text
			const allText = annotations.textAnnotations?.[0]?.description || "";
			const textAnnotations: TextAnnotation[] =
				annotations.textAnnotations?.slice(1) || [];

			// Extract serial numbers and model numbers
			const serialNumbers = this.extractSerialNumbers(allText, textAnnotations);

			// Extract labels
			const labels: LabelAnnotation[] = (
				annotations.labelAnnotations || []
			).map(
				(l: {
					mid?: string;
					description?: string;
					score?: number;
					topicality?: number;
				}) => ({
					mid: l.mid,
					description: l.description || "",
					score: l.score || 0,
					topicality: l.topicality,
				}),
			);

			// Extract logos
			const logos: LogoAnnotation[] = (annotations.logoAnnotations || []).map(
				(l: {
					mid?: string;
					description?: string;
					score?: number;
					boundingPoly?: unknown;
				}) => ({
					mid: l.mid,
					description: l.description || "",
					score: l.score || 0,
					boundingPoly: l.boundingPoly,
				}),
			);

			// Extract objects
			const objects: ObjectAnnotation[] = (
				annotations.localizedObjectAnnotations || []
			).map(
				(o: {
					mid?: string;
					name?: string;
					score?: number;
					boundingPoly?: unknown;
				}) => ({
					mid: o.mid,
					name: o.name || "",
					score: o.score || 0,
					boundingPoly: o.boundingPoly,
				}),
			);

			// Extract dominant colors
			const dominantColors =
				annotations.imagePropertiesAnnotation?.dominantColors?.colors?.map(
					(c: {
						color?: {
							red?: number;
							green?: number;
							blue?: number;
							alpha?: number;
						};
						score?: number;
						pixelFraction?: number;
					}) => ({
						color: {
							red: c.color?.red || 0,
							green: c.color?.green || 0,
							blue: c.color?.blue || 0,
							alpha: c.color?.alpha,
						},
						score: c.score || 0,
						pixelFraction: c.pixelFraction || 0,
					}),
				) || [];

			// Identify brand from logos or text
			const brand = this.identifyBrand(logos, allText);

			// Identify equipment type
			const equipmentType = this.identifyEquipmentType(
				labels,
				objects,
				allText,
			);

			// HVAC-specific analysis
			const hvacInfo = this.analyzeHVACEquipment(
				equipmentType,
				brand,
				allText,
				labels,
			);

			// Condition hints from labels
			const conditionHints = this.extractConditionHints(labels, allText);

			return EquipmentAnalysisSchema.parse({
				equipmentType,
				brand,
				model: serialNumbers.find((s) => s.type === "model")?.value,
				serialNumbers,
				allText,
				labels,
				logos,
				objects,
				dominantColors: dominantColors.slice(0, 5),
				conditionHints,
				hvacInfo,
			});
		} catch (error) {
			console.error("Google Vision Service error:", error);
			return null;
		}
	}

	/**
	 * Scan document for text extraction (invoices, manuals, etc.)
	 */
	async scanDocument(
		imageSource: string | Buffer,
	): Promise<DocumentScan | null> {
		if (!this.apiKey) {
			console.warn("Google Vision Service: No API key configured");
			return null;
		}

		try {
			const imageContent = await this.prepareImageContent(imageSource);

			const response = await fetch(
				`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						requests: [
							{
								image: imageContent,
								features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
							},
						],
					}),
				},
			);

			if (!response.ok) {
				console.error(
					`Google Vision API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			const data = await response.json();
			const fullTextAnnotation = data.responses?.[0]?.fullTextAnnotation;

			if (!fullTextAnnotation) {
				return null;
			}

			// Extract blocks with confidence
			const blocks =
				fullTextAnnotation.pages?.[0]?.blocks?.map(
					(block: {
						paragraphs?: Array<{
							words?: Array<{
								symbols?: Array<{ text?: string }>;
							}>;
						}>;
						confidence?: number;
						boundingBox?: unknown;
					}) => {
						const text = block.paragraphs
							?.map((p) =>
								p.words
									?.map((w) => w.symbols?.map((s) => s.text).join(""))
									.join(" "),
							)
							.join("\n");
						return {
							text: text || "",
							confidence: block.confidence || 0,
							boundingBox: block.boundingBox,
						};
					},
				) || [];

			// Try to extract structured data
			const structuredData = this.extractStructuredData(
				fullTextAnnotation.text,
			);

			return DocumentScanSchema.parse({
				text: fullTextAnnotation.text || "",
				confidence: fullTextAnnotation.pages?.[0]?.confidence || 0,
				blocks,
				structuredData,
			});
		} catch (error) {
			console.error("Google Vision Service error:", error);
			return null;
		}
	}

	/**
	 * Detect barcodes and QR codes
	 */
	async detectBarcodes(imageSource: string | Buffer): Promise<Barcode[]> {
		if (!this.apiKey) {
			console.warn("Google Vision Service: No API key configured");
			return [];
		}

		try {
			const imageContent = await this.prepareImageContent(imageSource);

			const response = await fetch(
				`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						requests: [
							{
								image: imageContent,
								features: [
									{ type: "TEXT_DETECTION" }, // Can detect some barcodes
								],
							},
						],
					}),
				},
			);

			if (!response.ok) {
				return [];
			}

			const data = await response.json();
			const textAnnotations = data.responses?.[0]?.textAnnotations || [];

			// Look for barcode-like patterns in text
			const barcodes: Barcode[] = [];
			const barcodePatterns = [
				/\b\d{12,13}\b/g, // UPC-A, EAN-13
				/\b[A-Z0-9]{6,20}\b/g, // Code 39, Code 128
			];

			const allText = textAnnotations[0]?.description || "";
			for (const pattern of barcodePatterns) {
				const matches = allText.match(pattern) || [];
				for (const match of matches) {
					// Check if it looks like a valid barcode
					if (this.isValidBarcode(match)) {
						barcodes.push({
							format: this.detectBarcodeFormat(match),
							rawValue: match,
						});
					}
				}
			}

			return barcodes;
		} catch (error) {
			console.error("Google Vision Service error:", error);
			return [];
		}
	}

	/**
	 * Quick OCR - just extract text
	 */
	async extractText(imageSource: string | Buffer): Promise<string | null> {
		if (!this.apiKey) {
			return null;
		}

		try {
			const imageContent = await this.prepareImageContent(imageSource);

			const response = await fetch(
				`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						requests: [
							{
								image: imageContent,
								features: [{ type: "TEXT_DETECTION" }],
							},
						],
					}),
				},
			);

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			return data.responses?.[0]?.textAnnotations?.[0]?.description || null;
		} catch (error) {
			console.error("Google Vision Service error:", error);
			return null;
		}
	}

	// =========================================================================
	// Private Helpers
	// =========================================================================

	private async prepareImageContent(
		imageSource: string | Buffer,
	): Promise<{ content?: string; source?: { imageUri: string } }> {
		if (Buffer.isBuffer(imageSource)) {
			return { content: imageSource.toString("base64") };
		}

		// Check if it's a URL or base64
		if (
			imageSource.startsWith("http://") ||
			imageSource.startsWith("https://")
		) {
			return { source: { imageUri: imageSource } };
		}

		// Assume base64
		// Remove data URI prefix if present
		const base64Content = imageSource.replace(/^data:image\/\w+;base64,/, "");
		return { content: base64Content };
	}

	private extractSerialNumbers(
		allText: string,
		textAnnotations: TextAnnotation[],
	): SerialNumber[] {
		const serialNumbers: SerialNumber[] = [];
		const seen = new Set<string>();

		for (const pattern of SERIAL_PATTERNS) {
			const matches = allText.matchAll(pattern);
			for (const match of matches) {
				// Get the captured group or the full match
				const value = match[1] || match[0];
				const cleaned = value.replace(/[:\s]/g, "").toUpperCase();

				if (seen.has(cleaned)) continue;
				seen.add(cleaned);

				// Determine type based on pattern
				let type: SerialNumber["type"] = "unknown";
				const patternStr = pattern.source.toLowerCase();
				if (patternStr.includes("serial") || patternStr.includes("s/n")) {
					type = "serial";
				} else if (patternStr.includes("model") || patternStr.includes("m/n")) {
					type = "model";
				} else if (
					patternStr.includes("part") ||
					patternStr.includes("p/n") ||
					patternStr.includes("sku")
				) {
					type = "part";
				}

				// Find bounding box from annotations
				const annotation = textAnnotations.find(
					(t) =>
						t.description &&
						t.description.toUpperCase().includes(cleaned.substring(0, 6)),
				);

				serialNumbers.push({
					value: cleaned,
					confidence: annotation ? 0.9 : 0.7,
					type,
					boundingBox: annotation?.boundingPoly,
				});
			}
		}

		return serialNumbers;
	}

	private identifyBrand(
		logos: LogoAnnotation[],
		allText: string,
	): string | undefined {
		// First check detected logos
		if (logos.length > 0) {
			const bestLogo = logos.sort((a, b) => b.score - a.score)[0];
			return bestLogo.description;
		}

		// Check text for known brands
		const textLower = allText.toLowerCase();
		for (const brand of HVAC_BRANDS) {
			if (textLower.includes(brand)) {
				// Capitalize brand name
				return brand
					.split(" ")
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(" ");
			}
		}

		return undefined;
	}

	private identifyEquipmentType(
		labels: LabelAnnotation[],
		objects: ObjectAnnotation[],
		allText: string,
	): string | undefined {
		const allTerms = [
			...labels.map((l) => l.description.toLowerCase()),
			...objects.map((o) => o.name.toLowerCase()),
			allText.toLowerCase(),
		].join(" ");

		for (const [type, keywords] of Object.entries(HVAC_TYPE_KEYWORDS)) {
			for (const keyword of keywords) {
				if (allTerms.includes(keyword)) {
					return type
						.split("_")
						.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
						.join(" ");
				}
			}
		}

		// Check generic equipment types from labels
		const equipmentLabels = labels.filter(
			(l) =>
				l.score > 0.7 &&
				[
					"appliance",
					"machine",
					"equipment",
					"hvac",
					"heating",
					"cooling",
				].some((t) => l.description.toLowerCase().includes(t)),
		);

		if (equipmentLabels.length > 0) {
			return equipmentLabels[0].description;
		}

		return undefined;
	}

	private analyzeHVACEquipment(
		equipmentType: string | undefined,
		brand: string | undefined,
		allText: string,
		labels: LabelAnnotation[],
	): EquipmentAnalysis["hvacInfo"] {
		if (!equipmentType) {
			return undefined;
		}

		const textLower = allText.toLowerCase();

		// Map equipment type to enum
		let hvacType: NonNullable<EquipmentAnalysis["hvacInfo"]>["type"] = "other";
		const typeKeywords: Record<
			string,
			NonNullable<EquipmentAnalysis["hvacInfo"]>["type"]
		> = {
			furnace: "furnace",
			"air conditioner": "air_conditioner",
			"heat pump": "heat_pump",
			"water heater": "water_heater",
			thermostat: "thermostat",
			"air handler": "air_handler",
			condenser: "condenser",
			ductwork: "ductwork",
		};

		for (const [keyword, type] of Object.entries(typeKeywords)) {
			if (equipmentType.toLowerCase().includes(keyword)) {
				hvacType = type;
				break;
			}
		}

		// Try to extract efficiency ratings
		let efficiency: string | undefined;
		const seerMatch = textLower.match(/(\d{1,2}(?:\.\d)?)\s*seer/);
		const afueMatch = textLower.match(/(\d{2,3}(?:\.\d)?)\s*%?\s*afue/);
		const hspfMatch = textLower.match(/(\d{1,2}(?:\.\d)?)\s*hspf/);

		if (seerMatch) {
			efficiency = `${seerMatch[1]} SEER`;
		} else if (afueMatch) {
			efficiency = `${afueMatch[1]}% AFUE`;
		} else if (hspfMatch) {
			efficiency = `${hspfMatch[1]} HSPF`;
		}

		// Try to extract manufacture date
		let estimatedAge: string | undefined;
		const yearMatch = textLower.match(
			/(?:mfg|manufactured|date)[:\s]*(\d{4})/i,
		);
		if (yearMatch) {
			const mfgYear = parseInt(yearMatch[1]);
			const currentYear = new Date().getFullYear();
			if (mfgYear >= 1990 && mfgYear <= currentYear) {
				const age = currentYear - mfgYear;
				estimatedAge = `${age} years (Mfg ${mfgYear})`;
			}
		}

		return {
			type: hvacType,
			manufacturer: brand,
			estimatedAge,
			efficiency,
		};
	}

	private extractConditionHints(
		labels: LabelAnnotation[],
		allText: string,
	): string[] {
		const hints: string[] = [];
		const textLower = allText.toLowerCase();

		// Check for condition-related terms
		const conditionTerms: Record<string, string> = {
			rust: "Visible rust detected",
			corrosion: "Corrosion observed",
			damage: "Potential damage visible",
			leak: "Possible leak indicated",
			dirty: "Equipment appears dirty",
			clean: "Equipment appears clean",
			new: "Equipment appears new/recent",
			old: "Equipment appears aged",
		};

		for (const [term, hint] of Object.entries(conditionTerms)) {
			if (textLower.includes(term)) {
				hints.push(hint);
			}
		}

		// Check labels for condition indicators
		for (const label of labels) {
			if (label.score > 0.8) {
				const labelLower = label.description.toLowerCase();
				for (const [term, hint] of Object.entries(conditionTerms)) {
					if (labelLower.includes(term) && !hints.includes(hint)) {
						hints.push(hint);
					}
				}
			}
		}

		return hints;
	}

	private extractStructuredData(text: string): Record<string, string> {
		const data: Record<string, string> = {};

		// Common field patterns
		const patterns: Record<string, RegExp> = {
			date: /(?:date|dated?)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
			total: /(?:total|amount)[:\s]*\$?([\d,]+\.?\d*)/i,
			invoice: /(?:invoice|inv)[:\s#]*(\w+)/i,
			customer: /(?:customer|client|bill to)[:\s]*([\w\s]+?)(?:\n|$)/i,
			phone: /(?:phone|tel|ph)[:\s]*([\d\-()\s]+)/i,
			email: /[\w.-]+@[\w.-]+\.\w+/i,
			address:
				/(\d+[\w\s,]+(?:st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard)[\w\s,]*)/i,
		};

		for (const [field, pattern] of Object.entries(patterns)) {
			const match = text.match(pattern);
			if (match) {
				data[field] = match[1]?.trim() || match[0].trim();
			}
		}

		return Object.keys(data).length > 0 ? data : {};
	}

	private isValidBarcode(value: string): boolean {
		// Basic validation
		if (value.length < 6 || value.length > 20) {
			return false;
		}

		// UPC-A/EAN-13 checksum validation
		if (/^\d{12,13}$/.test(value)) {
			const digits = value.split("").map(Number);
			const checksum = digits.pop();
			let sum = 0;
			for (let i = 0; i < digits.length; i++) {
				sum += digits[i] * (i % 2 === 0 ? 1 : 3);
			}
			const calculated = (10 - (sum % 10)) % 10;
			return calculated === checksum;
		}

		return true; // Accept alphanumeric codes
	}

	private detectBarcodeFormat(value: string): string {
		if (/^\d{12}$/.test(value)) return "UPC-A";
		if (/^\d{13}$/.test(value)) return "EAN-13";
		if (/^\d{8}$/.test(value)) return "EAN-8";
		if (/^[A-Z0-9]+$/.test(value)) return "CODE39";
		return "UNKNOWN";
	}
}

// Singleton instance
export const googleVisionService = new GoogleVisionService();
