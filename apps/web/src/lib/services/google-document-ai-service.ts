/**
 * Google Document AI Service
 *
 * Provides document processing, OCR, and data extraction using Google Document AI.
 * Supports processing invoices, receipts, permits, contracts, and equipment documents.
 *
 * Authentication: Service Account (GOOGLE_SERVICE_ACCOUNT_KEY)
 *
 * Setup:
 * 1. Enable Document AI API in Google Cloud Console
 * 2. Create a processor in Document AI
 * 3. Set GOOGLE_SERVICE_ACCOUNT_KEY with Document AI permissions
 * 4. Set GOOGLE_CLOUD_PROJECT_ID and GOOGLE_CLOUD_LOCATION
 * 5. Optionally set processor IDs for specific document types
 *
 * @see https://cloud.google.com/document-ai/docs
 */

// ============================================
// Types
// ============================================

export type ProcessorType =
	| "GENERAL"
	| "FORM_PARSER"
	| "INVOICE_PARSER"
	| "RECEIPT_PARSER"
	| "ID_PROOFING"
	| "DOCUMENT_OCR"
	| "CUSTOM";

export interface DocumentInput {
	/** Base64 encoded document content */
	content?: string;
	/** GCS URI (gs://bucket/path) */
	gcsUri?: string;
	/** MIME type of the document */
	mimeType: string;
}

export interface TextAnchor {
	textSegments: Array<{
		startIndex: string;
		endIndex: string;
	}>;
	content?: string;
}

export interface BoundingPoly {
	normalizedVertices: Array<{
		x: number;
		y: number;
	}>;
}

export interface EntityMention {
	text: string;
	type: string;
	confidence: number;
	boundingPoly?: BoundingPoly;
	pageNumber?: number;
}

export interface ExtractedEntity {
	type: string;
	mentionText: string;
	confidence: number;
	normalizedValue?: {
		text?: string;
		moneyValue?: {
			currencyCode: string;
			units: string;
			nanos?: number;
		};
		dateValue?: {
			year: number;
			month: number;
			day: number;
		};
	};
	properties?: ExtractedEntity[];
}

export interface PageInfo {
	pageNumber: number;
	width: number;
	height: number;
	blocks: Array<{
		text: string;
		confidence: number;
		boundingPoly: BoundingPoly;
	}>;
	paragraphs: Array<{
		text: string;
		confidence: number;
	}>;
	tables: Array<{
		headerRows: string[][];
		bodyRows: string[][];
		confidence: number;
	}>;
}

export interface ProcessedDocument {
	text: string;
	pages: PageInfo[];
	entities: ExtractedEntity[];
	mimeType: string;
	confidence: number;
}

// ============================================
// Field Service Specific Types
// ============================================

export interface VendorInvoiceData {
	vendorName: string | null;
	vendorAddress: string | null;
	invoiceNumber: string | null;
	invoiceDate: string | null;
	dueDate: string | null;
	subtotal: number | null;
	tax: number | null;
	total: number | null;
	currency: string;
	lineItems: Array<{
		description: string;
		quantity: number | null;
		unitPrice: number | null;
		amount: number | null;
		partNumber?: string;
	}>;
	paymentTerms: string | null;
	purchaseOrderNumber: string | null;
	rawText: string;
	confidence: number;
}

export interface EquipmentWarrantyData {
	manufacturer: string | null;
	modelNumber: string | null;
	serialNumber: string | null;
	purchaseDate: string | null;
	warrantyStartDate: string | null;
	warrantyEndDate: string | null;
	warrantyType: string | null;
	coverageDetails: string[];
	exclusions: string[];
	contactInfo: {
		phone: string | null;
		email: string | null;
		website: string | null;
	};
	rawText: string;
	confidence: number;
}

export interface PermitDocumentData {
	permitNumber: string | null;
	permitType: string | null;
	issueDate: string | null;
	expirationDate: string | null;
	propertyAddress: string | null;
	ownerName: string | null;
	contractorName: string | null;
	contractorLicense: string | null;
	scopeOfWork: string | null;
	inspectionRequirements: string[];
	fees: {
		permitFee: number | null;
		inspectionFee: number | null;
		total: number | null;
	};
	issuingAuthority: string | null;
	rawText: string;
	confidence: number;
}

export interface CustomerContractData {
	contractNumber: string | null;
	contractDate: string | null;
	customerName: string | null;
	customerAddress: string | null;
	serviceAddress: string | null;
	contractType: string | null;
	startDate: string | null;
	endDate: string | null;
	totalValue: number | null;
	paymentTerms: string | null;
	scopeOfWork: string[];
	signatures: Array<{
		name: string | null;
		date: string | null;
		role: string | null;
	}>;
	specialTerms: string[];
	rawText: string;
	confidence: number;
}

export interface EquipmentInfoExtraction {
	manufacturer: string | null;
	modelNumber: string | null;
	serialNumber: string | null;
	manufactureDate: string | null;
	specifications: Record<string, string>;
	ratings: {
		voltage: string | null;
		amperage: string | null;
		btu: string | null;
		seer: string | null;
		tonnage: string | null;
	};
	refrigerantType: string | null;
	rawText: string;
	confidence: number;
}

export interface ReceiptData {
	merchantName: string | null;
	merchantAddress: string | null;
	transactionDate: string | null;
	transactionTime: string | null;
	subtotal: number | null;
	tax: number | null;
	total: number | null;
	paymentMethod: string | null;
	cardLastFour: string | null;
	lineItems: Array<{
		description: string;
		quantity: number | null;
		unitPrice: number | null;
		amount: number | null;
	}>;
	rawText: string;
	confidence: number;
}

// ============================================
// Service Implementation
// ============================================

class GoogleDocumentAIService {
	private projectId: string | null;
	private location: string;
	private serviceAccountKey: string | null;
	private tokenCache: { token: string; expiry: number } | null = null;

	// Processor IDs for different document types
	private processors: {
		general: string | null;
		invoice: string | null;
		receipt: string | null;
		form: string | null;
		ocr: string | null;
	};

	constructor() {
		this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || null;
		this.location = process.env.GOOGLE_CLOUD_LOCATION || "us";
		this.serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || null;

		this.processors = {
			general: process.env.GOOGLE_DOCUMENT_AI_GENERAL_PROCESSOR_ID || null,
			invoice: process.env.GOOGLE_DOCUMENT_AI_INVOICE_PROCESSOR_ID || null,
			receipt: process.env.GOOGLE_DOCUMENT_AI_RECEIPT_PROCESSOR_ID || null,
			form: process.env.GOOGLE_DOCUMENT_AI_FORM_PROCESSOR_ID || null,
			ocr: process.env.GOOGLE_DOCUMENT_AI_OCR_PROCESSOR_ID || null,
		};
	}

	/**
	 * Check if the service is configured
	 */
	isConfigured(): boolean {
		return !!(
			this.projectId &&
			this.serviceAccountKey &&
			(this.processors.general || this.processors.ocr)
		);
	}

	/**
	 * Get service account access token
	 */
	private async getAccessToken(): Promise<string> {
		if (!this.serviceAccountKey) {
			throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
		}

		// Check cache
		if (this.tokenCache && Date.now() < this.tokenCache.expiry) {
			return this.tokenCache.token;
		}

		const credentials = JSON.parse(this.serviceAccountKey);
		const now = Math.floor(Date.now() / 1000);

		// Create JWT
		const header = { alg: "RS256", typ: "JWT" };
		const payload = {
			iss: credentials.client_email,
			scope: "https://www.googleapis.com/auth/cloud-platform",
			aud: "https://oauth2.googleapis.com/token",
			iat: now,
			exp: now + 3600,
		};

		const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
			"base64url",
		);
		const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
			"base64url",
		);
		const signatureInput = `${encodedHeader}.${encodedPayload}`;

		// Sign with private key
		const crypto = await import("crypto");
		const sign = crypto.createSign("RSA-SHA256");
		sign.update(signatureInput);
		const signature = sign.sign(credentials.private_key, "base64url");

		const jwt = `${signatureInput}.${signature}`;

		// Exchange JWT for access token
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
				assertion: jwt,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to get access token: ${response.statusText}`);
		}

		const data = await response.json();
		this.tokenCache = {
			token: data.access_token,
			expiry: Date.now() + (data.expires_in - 60) * 1000,
		};

		return data.access_token;
	}

	/**
	 * Get processor endpoint URL
	 */
	private getProcessorUrl(processorId: string): string {
		return `https://${this.location}-documentai.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/processors/${processorId}:process`;
	}

	/**
	 * Process a document with Document AI
	 */
	async processDocument(
		input: DocumentInput,
		processorId?: string,
	): Promise<ProcessedDocument> {
		const token = await this.getAccessToken();

		const processor =
			processorId || this.processors.general || this.processors.ocr;
		if (!processor) {
			throw new Error("No Document AI processor configured");
		}

		const requestBody: Record<string, unknown> = {
			skipHumanReview: true,
		};

		if (input.content) {
			requestBody.rawDocument = {
				content: input.content,
				mimeType: input.mimeType,
			};
		} else if (input.gcsUri) {
			requestBody.gcsDocument = {
				gcsUri: input.gcsUri,
				mimeType: input.mimeType,
			};
		} else {
			throw new Error("Either content or gcsUri must be provided");
		}

		const response = await fetch(this.getProcessorUrl(processor), {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Document AI error: ${error}`);
		}

		const result = await response.json();
		return this.parseDocumentResponse(result.document);
	}

	/**
	 * Parse Document AI response into structured format
	 */
	private parseDocumentResponse(
		document: Record<string, unknown>,
	): ProcessedDocument {
		const pages: PageInfo[] = [];

		if (document.pages && Array.isArray(document.pages)) {
			for (const page of document.pages) {
				const pageInfo: PageInfo = {
					pageNumber: (page.pageNumber as number) || 1,
					width: (page.dimension?.width as number) || 0,
					height: (page.dimension?.height as number) || 0,
					blocks: [],
					paragraphs: [],
					tables: [],
				};

				// Extract blocks
				if (page.blocks && Array.isArray(page.blocks)) {
					for (const block of page.blocks) {
						pageInfo.blocks.push({
							text: this.getTextFromLayout(
								block.layout,
								document.text as string,
							),
							confidence: block.layout?.confidence || 0,
							boundingPoly: block.layout?.boundingPoly || {
								normalizedVertices: [],
							},
						});
					}
				}

				// Extract paragraphs
				if (page.paragraphs && Array.isArray(page.paragraphs)) {
					for (const para of page.paragraphs) {
						pageInfo.paragraphs.push({
							text: this.getTextFromLayout(
								para.layout,
								document.text as string,
							),
							confidence: para.layout?.confidence || 0,
						});
					}
				}

				// Extract tables
				if (page.tables && Array.isArray(page.tables)) {
					for (const table of page.tables) {
						const headerRows: string[][] = [];
						const bodyRows: string[][] = [];

						if (table.headerRows && Array.isArray(table.headerRows)) {
							for (const row of table.headerRows) {
								const cells: string[] = [];
								if (row.cells && Array.isArray(row.cells)) {
									for (const cell of row.cells) {
										cells.push(
											this.getTextFromLayout(
												cell.layout,
												document.text as string,
											),
										);
									}
								}
								headerRows.push(cells);
							}
						}

						if (table.bodyRows && Array.isArray(table.bodyRows)) {
							for (const row of table.bodyRows) {
								const cells: string[] = [];
								if (row.cells && Array.isArray(row.cells)) {
									for (const cell of row.cells) {
										cells.push(
											this.getTextFromLayout(
												cell.layout,
												document.text as string,
											),
										);
									}
								}
								bodyRows.push(cells);
							}
						}

						pageInfo.tables.push({
							headerRows,
							bodyRows,
							confidence: table.layout?.confidence || 0,
						});
					}
				}

				pages.push(pageInfo);
			}
		}

		// Extract entities
		const entities: ExtractedEntity[] = [];
		if (document.entities && Array.isArray(document.entities)) {
			for (const entity of document.entities) {
				entities.push(this.parseEntity(entity));
			}
		}

		return {
			text: (document.text as string) || "",
			pages,
			entities,
			mimeType: (document.mimeType as string) || "application/pdf",
			confidence: this.calculateOverallConfidence(pages),
		};
	}

	/**
	 * Get text from layout text anchor
	 */
	private getTextFromLayout(
		layout: Record<string, unknown> | undefined,
		fullText: string,
	): string {
		if (!layout || !layout.textAnchor) return "";

		const textAnchor = layout.textAnchor as {
			textSegments?: Array<{ startIndex?: string; endIndex?: string }>;
		};
		if (!textAnchor.textSegments || textAnchor.textSegments.length === 0)
			return "";

		let text = "";
		for (const segment of textAnchor.textSegments) {
			const start = parseInt(segment.startIndex || "0", 10);
			const end = parseInt(segment.endIndex || "0", 10);
			text += fullText.substring(start, end);
		}

		return text.trim();
	}

	/**
	 * Parse entity from Document AI response
	 */
	private parseEntity(entity: Record<string, unknown>): ExtractedEntity {
		const result: ExtractedEntity = {
			type: (entity.type as string) || "unknown",
			mentionText: (entity.mentionText as string) || "",
			confidence: (entity.confidence as number) || 0,
		};

		if (entity.normalizedValue) {
			const nv = entity.normalizedValue as Record<string, unknown>;
			result.normalizedValue = {};

			if (nv.text) result.normalizedValue.text = nv.text as string;

			if (nv.moneyValue) {
				const mv = nv.moneyValue as Record<string, unknown>;
				result.normalizedValue.moneyValue = {
					currencyCode: (mv.currencyCode as string) || "USD",
					units: (mv.units as string) || "0",
					nanos: mv.nanos as number,
				};
			}

			if (nv.dateValue) {
				const dv = nv.dateValue as Record<string, unknown>;
				result.normalizedValue.dateValue = {
					year: (dv.year as number) || 0,
					month: (dv.month as number) || 0,
					day: (dv.day as number) || 0,
				};
			}
		}

		if (entity.properties && Array.isArray(entity.properties)) {
			result.properties = entity.properties.map((prop) =>
				this.parseEntity(prop as Record<string, unknown>),
			);
		}

		return result;
	}

	/**
	 * Calculate overall confidence score
	 */
	private calculateOverallConfidence(pages: PageInfo[]): number {
		if (pages.length === 0) return 0;

		let totalConfidence = 0;
		let count = 0;

		for (const page of pages) {
			for (const block of page.blocks) {
				totalConfidence += block.confidence;
				count++;
			}
		}

		return count > 0 ? totalConfidence / count : 0;
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Process a vendor invoice and extract structured data
	 */
	async processVendorInvoice(input: DocumentInput): Promise<VendorInvoiceData> {
		const processorId =
			this.processors.invoice ||
			this.processors.form ||
			this.processors.general;
		const doc = await this.processDocument(input, processorId || undefined);

		const result: VendorInvoiceData = {
			vendorName: null,
			vendorAddress: null,
			invoiceNumber: null,
			invoiceDate: null,
			dueDate: null,
			subtotal: null,
			tax: null,
			total: null,
			currency: "USD",
			lineItems: [],
			paymentTerms: null,
			purchaseOrderNumber: null,
			rawText: doc.text,
			confidence: doc.confidence,
		};

		// Extract from entities
		for (const entity of doc.entities) {
			const type = entity.type.toLowerCase();
			const value = entity.normalizedValue?.text || entity.mentionText;

			if (type.includes("supplier") || type.includes("vendor")) {
				result.vendorName = value;
			} else if (
				type.includes("invoice_id") ||
				type.includes("invoice_number")
			) {
				result.invoiceNumber = value;
			} else if (type.includes("invoice_date")) {
				result.invoiceDate = this.formatDate(entity.normalizedValue?.dateValue);
			} else if (type.includes("due_date") || type.includes("payment_due")) {
				result.dueDate = this.formatDate(entity.normalizedValue?.dateValue);
			} else if (type.includes("subtotal") || type.includes("net_amount")) {
				result.subtotal = this.extractMoneyValue(entity);
			} else if (type.includes("tax") || type.includes("vat")) {
				result.tax = this.extractMoneyValue(entity);
			} else if (type.includes("total") || type.includes("amount_due")) {
				result.total = this.extractMoneyValue(entity);
			} else if (type.includes("currency")) {
				result.currency = value || "USD";
			} else if (
				type.includes("purchase_order") ||
				type.includes("po_number")
			) {
				result.purchaseOrderNumber = value;
			} else if (type.includes("payment_terms")) {
				result.paymentTerms = value;
			} else if (type.includes("line_item") && entity.properties) {
				const lineItem = this.extractLineItem(entity);
				if (lineItem) {
					result.lineItems.push(lineItem);
				}
			}
		}

		// Extract line items from tables if not found in entities
		if (result.lineItems.length === 0 && doc.pages.length > 0) {
			for (const page of doc.pages) {
				for (const table of page.tables) {
					const items = this.extractLineItemsFromTable(table);
					result.lineItems.push(...items);
				}
			}
		}

		return result;
	}

	/**
	 * Process equipment warranty document
	 */
	async processEquipmentWarranty(
		input: DocumentInput,
	): Promise<EquipmentWarrantyData> {
		const doc = await this.processDocument(input);

		const result: EquipmentWarrantyData = {
			manufacturer: null,
			modelNumber: null,
			serialNumber: null,
			purchaseDate: null,
			warrantyStartDate: null,
			warrantyEndDate: null,
			warrantyType: null,
			coverageDetails: [],
			exclusions: [],
			contactInfo: {
				phone: null,
				email: null,
				website: null,
			},
			rawText: doc.text,
			confidence: doc.confidence,
		};

		// Extract using pattern matching on text
		const text = doc.text.toLowerCase();

		// Model number patterns
		const modelMatch = doc.text.match(
			/model\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
		);
		if (modelMatch) result.modelNumber = modelMatch[1];

		// Serial number patterns
		const serialMatch = doc.text.match(
			/serial\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
		);
		if (serialMatch) result.serialNumber = serialMatch[1];

		// Date patterns
		const warrantyPeriodMatch = doc.text.match(
			/warranty\s*(?:period|term)?\s*:?\s*(\d+)\s*(?:year|month)/i,
		);
		if (warrantyPeriodMatch) {
			result.warrantyType = `${warrantyPeriodMatch[1]} ${warrantyPeriodMatch[0].includes("month") ? "months" : "years"}`;
		}

		// Contact info
		const phoneMatch = doc.text.match(
			/(?:phone|tel|call)\s*:?\s*([\d-().\s]+)/i,
		);
		if (phoneMatch) result.contactInfo.phone = phoneMatch[1].trim();

		const emailMatch = doc.text.match(
			/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
		);
		if (emailMatch) result.contactInfo.email = emailMatch[1];

		const websiteMatch = doc.text.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
		if (websiteMatch) result.contactInfo.website = websiteMatch[1];

		// Coverage details (common warranty phrases)
		const coveragePatterns = [
			/parts\s+and\s+labor/i,
			/compressor/i,
			/heat\s+exchanger/i,
			/coil/i,
			/refrigerant/i,
			/electrical/i,
		];

		for (const pattern of coveragePatterns) {
			const match = text.match(pattern);
			if (match) {
				result.coverageDetails.push(match[0]);
			}
		}

		// Exclusions
		if (
			text.includes("exclusion") ||
			text.includes("not covered") ||
			text.includes("does not include")
		) {
			const exclusionSection = doc.text.match(
				/(?:exclusion|not covered|does not include)[:\s]*([\s\S]*?)(?:\n\n|$)/i,
			);
			if (exclusionSection) {
				const exclusionLines = exclusionSection[1]
					.split(/[•\-\n]/)
					.filter((line) => line.trim());
				result.exclusions = exclusionLines
					.map((line) => line.trim())
					.slice(0, 10);
			}
		}

		return result;
	}

	/**
	 * Process a building permit document
	 */
	async processPermitDocument(
		input: DocumentInput,
	): Promise<PermitDocumentData> {
		const doc = await this.processDocument(input);

		const result: PermitDocumentData = {
			permitNumber: null,
			permitType: null,
			issueDate: null,
			expirationDate: null,
			propertyAddress: null,
			ownerName: null,
			contractorName: null,
			contractorLicense: null,
			scopeOfWork: null,
			inspectionRequirements: [],
			fees: {
				permitFee: null,
				inspectionFee: null,
				total: null,
			},
			issuingAuthority: null,
			rawText: doc.text,
			confidence: doc.confidence,
		};

		// Extract permit number
		const permitMatch = doc.text.match(
			/permit\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
		);
		if (permitMatch) result.permitNumber = permitMatch[1];

		// Permit type
		const typePatterns = [
			"HVAC",
			"mechanical",
			"plumbing",
			"electrical",
			"building",
			"construction",
			"renovation",
		];
		for (const type of typePatterns) {
			if (doc.text.toLowerCase().includes(type.toLowerCase())) {
				result.permitType = type;
				break;
			}
		}

		// Address patterns
		const addressMatch = doc.text.match(
			/(?:property|site|job)\s*address\s*:?\s*([\s\S]*?)(?:\n|$)/i,
		);
		if (addressMatch) result.propertyAddress = addressMatch[1].trim();

		// License number
		const licenseMatch = doc.text.match(
			/(?:contractor|license)\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
		);
		if (licenseMatch) result.contractorLicense = licenseMatch[1];

		// Inspection requirements
		const inspectionPatterns = [
			/rough.?in\s*inspection/i,
			/final\s*inspection/i,
			/framing\s*inspection/i,
			/underground\s*inspection/i,
		];

		for (const pattern of inspectionPatterns) {
			const match = doc.text.match(pattern);
			if (match) {
				result.inspectionRequirements.push(match[0]);
			}
		}

		// Extract fees from entities or text
		for (const entity of doc.entities) {
			if (
				entity.type.toLowerCase().includes("fee") ||
				entity.type.toLowerCase().includes("amount")
			) {
				const amount = this.extractMoneyValue(entity);
				if (entity.type.toLowerCase().includes("permit")) {
					result.fees.permitFee = amount;
				} else if (entity.type.toLowerCase().includes("inspection")) {
					result.fees.inspectionFee = amount;
				} else if (entity.type.toLowerCase().includes("total")) {
					result.fees.total = amount;
				}
			}
		}

		return result;
	}

	/**
	 * Process a customer contract or service agreement
	 */
	async processCustomerContract(
		input: DocumentInput,
	): Promise<CustomerContractData> {
		const processorId = this.processors.form || this.processors.general;
		const doc = await this.processDocument(input, processorId || undefined);

		const result: CustomerContractData = {
			contractNumber: null,
			contractDate: null,
			customerName: null,
			customerAddress: null,
			serviceAddress: null,
			contractType: null,
			startDate: null,
			endDate: null,
			totalValue: null,
			paymentTerms: null,
			scopeOfWork: [],
			signatures: [],
			specialTerms: [],
			rawText: doc.text,
			confidence: doc.confidence,
		};

		// Contract number
		const contractMatch = doc.text.match(
			/contract\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
		);
		if (contractMatch) result.contractNumber = contractMatch[1];

		// Detect contract type
		const contractTypes = [
			"service agreement",
			"maintenance contract",
			"installation contract",
			"repair agreement",
			"annual service",
		];
		for (const type of contractTypes) {
			if (doc.text.toLowerCase().includes(type)) {
				result.contractType = type;
				break;
			}
		}

		// Extract from entities
		for (const entity of doc.entities) {
			const type = entity.type.toLowerCase();
			const value = entity.normalizedValue?.text || entity.mentionText;

			if (type.includes("customer") || type.includes("client")) {
				result.customerName = value;
			} else if (type.includes("address") && !result.customerAddress) {
				result.customerAddress = value;
			} else if (
				type.includes("service_address") ||
				type.includes("property")
			) {
				result.serviceAddress = value;
			} else if (
				type.includes("start_date") ||
				type.includes("effective_date")
			) {
				result.startDate = this.formatDate(entity.normalizedValue?.dateValue);
			} else if (type.includes("end_date") || type.includes("expiration")) {
				result.endDate = this.formatDate(entity.normalizedValue?.dateValue);
			} else if (type.includes("total") || type.includes("contract_value")) {
				result.totalValue = this.extractMoneyValue(entity);
			}
		}

		// Scope of work extraction
		const scopeMatch = doc.text.match(
			/scope\s*of\s*work\s*:?\s*([\s\S]*?)(?:terms|conditions|payment|\n\n)/i,
		);
		if (scopeMatch) {
			const scopeLines = scopeMatch[1]
				.split(/[•\-\n]/)
				.filter((line) => line.trim().length > 10);
			result.scopeOfWork = scopeLines.map((line) => line.trim()).slice(0, 20);
		}

		return result;
	}

	/**
	 * Extract equipment information from an image (nameplate, label, etc.)
	 */
	async extractEquipmentInfo(
		input: DocumentInput,
	): Promise<EquipmentInfoExtraction> {
		const processorId = this.processors.ocr || this.processors.general;
		const doc = await this.processDocument(input, processorId || undefined);

		const result: EquipmentInfoExtraction = {
			manufacturer: null,
			modelNumber: null,
			serialNumber: null,
			manufactureDate: null,
			specifications: {},
			ratings: {
				voltage: null,
				amperage: null,
				btu: null,
				seer: null,
				tonnage: null,
			},
			refrigerantType: null,
			rawText: doc.text,
			confidence: doc.confidence,
		};

		const text = doc.text;

		// Common HVAC manufacturers
		const manufacturers = [
			"Carrier",
			"Trane",
			"Lennox",
			"Rheem",
			"Goodman",
			"York",
			"Bryant",
			"Amana",
			"Daikin",
			"American Standard",
			"Ruud",
			"Heil",
			"Payne",
			"Coleman",
			"Maytag",
			"Frigidaire",
			"Mitsubishi",
			"Fujitsu",
			"LG",
			"Samsung",
		];

		for (const mfr of manufacturers) {
			if (text.toLowerCase().includes(mfr.toLowerCase())) {
				result.manufacturer = mfr;
				break;
			}
		}

		// Model number (various patterns)
		const modelPatterns = [
			/model\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
			/m\/n\s*:?\s*([A-Z0-9-]+)/i,
			/mod\s*:?\s*([A-Z0-9-]+)/i,
		];

		for (const pattern of modelPatterns) {
			const match = text.match(pattern);
			if (match) {
				result.modelNumber = match[1];
				break;
			}
		}

		// Serial number
		const serialPatterns = [
			/serial\s*(?:no\.?|number|#)?\s*:?\s*([A-Z0-9-]+)/i,
			/s\/n\s*:?\s*([A-Z0-9-]+)/i,
			/ser\s*:?\s*([A-Z0-9-]+)/i,
		];

		for (const pattern of serialPatterns) {
			const match = text.match(pattern);
			if (match) {
				result.serialNumber = match[1];
				break;
			}
		}

		// Electrical ratings
		const voltageMatch = text.match(/(\d{2,3})\s*(?:v|volt)/i);
		if (voltageMatch) result.ratings.voltage = `${voltageMatch[1]}V`;

		const ampMatch = text.match(/(\d+\.?\d*)\s*(?:a|amp)/i);
		if (ampMatch) result.ratings.amperage = `${ampMatch[1]}A`;

		// BTU rating
		const btuMatch = text.match(/(\d{2,3},?\d{3})\s*(?:btu|btuh)/i);
		if (btuMatch) result.ratings.btu = btuMatch[1].replace(",", "");

		// SEER rating
		const seerMatch = text.match(/seer\s*:?\s*(\d+\.?\d*)/i);
		if (seerMatch) result.ratings.seer = seerMatch[1];

		// Tonnage
		const tonnageMatch = text.match(/(\d\.?\d*)\s*ton/i);
		if (tonnageMatch) result.ratings.tonnage = tonnageMatch[1];

		// Refrigerant type
		const refrigerantPatterns = [
			/R-?410A/i,
			/R-?22/i,
			/R-?32/i,
			/R-?134a/i,
			/R-?404A/i,
			/R-?407C/i,
		];
		for (const pattern of refrigerantPatterns) {
			const match = text.match(pattern);
			if (match) {
				result.refrigerantType = match[0].toUpperCase();
				break;
			}
		}

		// Manufacture date (often encoded in serial number or explicitly stated)
		const dateMatch = text.match(
			/(?:mfg|manufactured|mfr)\s*(?:date)?\s*:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
		);
		if (dateMatch) result.manufactureDate = dateMatch[1];

		return result;
	}

	/**
	 * Process a receipt for parts/materials purchase
	 */
	async processReceipt(input: DocumentInput): Promise<ReceiptData> {
		const processorId = this.processors.receipt || this.processors.general;
		const doc = await this.processDocument(input, processorId || undefined);

		const result: ReceiptData = {
			merchantName: null,
			merchantAddress: null,
			transactionDate: null,
			transactionTime: null,
			subtotal: null,
			tax: null,
			total: null,
			paymentMethod: null,
			cardLastFour: null,
			lineItems: [],
			rawText: doc.text,
			confidence: doc.confidence,
		};

		// Extract from entities
		for (const entity of doc.entities) {
			const type = entity.type.toLowerCase();
			const value = entity.normalizedValue?.text || entity.mentionText;

			if (
				type.includes("merchant") ||
				type.includes("supplier") ||
				type.includes("store")
			) {
				result.merchantName = value;
			} else if (type.includes("address") && !result.merchantAddress) {
				result.merchantAddress = value;
			} else if (type.includes("date") && !result.transactionDate) {
				result.transactionDate = this.formatDate(
					entity.normalizedValue?.dateValue,
				);
			} else if (type.includes("time")) {
				result.transactionTime = value;
			} else if (type.includes("subtotal")) {
				result.subtotal = this.extractMoneyValue(entity);
			} else if (type.includes("tax")) {
				result.tax = this.extractMoneyValue(entity);
			} else if (type.includes("total")) {
				result.total = this.extractMoneyValue(entity);
			} else if (type.includes("payment") || type.includes("tender")) {
				result.paymentMethod = value;
			} else if (type.includes("line_item") && entity.properties) {
				const lineItem = this.extractLineItem(entity);
				if (lineItem) {
					result.lineItems.push(lineItem);
				}
			}
		}

		// Extract card last 4 digits
		const cardMatch = doc.text.match(
			/(?:card|visa|mastercard|amex|discover)[^\d]*(\d{4})\s*$/im,
		);
		if (cardMatch) result.cardLastFour = cardMatch[1];

		return result;
	}

	/**
	 * Simple OCR - extract text only
	 */
	async extractText(
		input: DocumentInput,
	): Promise<{ text: string; confidence: number }> {
		const processorId = this.processors.ocr || this.processors.general;
		const doc = await this.processDocument(input, processorId || undefined);

		return {
			text: doc.text,
			confidence: doc.confidence,
		};
	}

	// ============================================
	// Helper Methods
	// ============================================

	private formatDate(dateValue?: {
		year: number;
		month: number;
		day: number;
	}): string | null {
		if (!dateValue || !dateValue.year) return null;
		return `${dateValue.year}-${String(dateValue.month).padStart(2, "0")}-${String(dateValue.day).padStart(2, "0")}`;
	}

	private extractMoneyValue(entity: ExtractedEntity): number | null {
		if (entity.normalizedValue?.moneyValue) {
			const mv = entity.normalizedValue.moneyValue;
			const units = parseInt(mv.units || "0", 10);
			const nanos = (mv.nanos || 0) / 1_000_000_000;
			return units + nanos;
		}

		// Try to extract from mention text
		const match = entity.mentionText.match(/\$?\s*([\d,]+\.?\d*)/);
		if (match) {
			return parseFloat(match[1].replace(",", ""));
		}

		return null;
	}

	private extractLineItem(
		entity: ExtractedEntity,
	): VendorInvoiceData["lineItems"][0] | null {
		if (!entity.properties) return null;

		const item: VendorInvoiceData["lineItems"][0] = {
			description: "",
			quantity: null,
			unitPrice: null,
			amount: null,
		};

		for (const prop of entity.properties) {
			const type = prop.type.toLowerCase();
			if (type.includes("description") || type.includes("item")) {
				item.description = prop.mentionText;
			} else if (type.includes("quantity") || type.includes("qty")) {
				item.quantity = parseFloat(prop.mentionText) || null;
			} else if (type.includes("unit_price") || type.includes("price")) {
				item.unitPrice = this.extractMoneyValue(prop);
			} else if (type.includes("amount") || type.includes("total")) {
				item.amount = this.extractMoneyValue(prop);
			} else if (type.includes("part") || type.includes("sku")) {
				item.partNumber = prop.mentionText;
			}
		}

		return item.description ? item : null;
	}

	private extractLineItemsFromTable(
		table: PageInfo["tables"][0],
	): VendorInvoiceData["lineItems"] {
		const items: VendorInvoiceData["lineItems"] = [];

		// Try to identify columns from header
		const headers = table.headerRows[0] || [];
		let descIdx = -1,
			qtyIdx = -1,
			priceIdx = -1,
			amountIdx = -1;

		headers.forEach((header, idx) => {
			const h = header.toLowerCase();
			if (h.includes("desc") || h.includes("item") || h.includes("product"))
				descIdx = idx;
			else if (h.includes("qty") || h.includes("quantity")) qtyIdx = idx;
			else if (h.includes("price") || h.includes("unit")) priceIdx = idx;
			else if (h.includes("amount") || h.includes("total") || h.includes("ext"))
				amountIdx = idx;
		});

		// If no header identification, use heuristics
		if (descIdx === -1 && headers.length >= 4) {
			descIdx = 0;
			qtyIdx = 1;
			priceIdx = 2;
			amountIdx = 3;
		}

		for (const row of table.bodyRows) {
			if (row.length < 2) continue;

			const item: VendorInvoiceData["lineItems"][0] = {
				description: descIdx >= 0 && row[descIdx] ? row[descIdx] : row[0],
				quantity:
					qtyIdx >= 0 && row[qtyIdx] ? parseFloat(row[qtyIdx]) || null : null,
				unitPrice:
					priceIdx >= 0 && row[priceIdx]
						? parseFloat(row[priceIdx].replace(/[$,]/g, "")) || null
						: null,
				amount:
					amountIdx >= 0 && row[amountIdx]
						? parseFloat(row[amountIdx].replace(/[$,]/g, "")) || null
						: null,
			};

			if (item.description) {
				items.push(item);
			}
		}

		return items;
	}
}

// Export singleton instance
export const googleDocumentAIService = new GoogleDocumentAIService();
