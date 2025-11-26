/**
 * Google Docs API Service
 *
 * Document creation and editing operations.
 * Requires OAuth 2.0 for user-specific operations.
 *
 * Features:
 * - Create documents
 * - Read document content
 * - Insert and format text
 * - Add tables and images
 * - Batch updates
 *
 * @see https://developers.google.com/docs/api/reference/rest
 */

// Types
export interface Document {
	documentId: string;
	title: string;
	body: Body;
	documentStyle?: DocumentStyle;
	revisionId?: string;
}

export interface Body {
	content: StructuralElement[];
}

export interface StructuralElement {
	startIndex: number;
	endIndex: number;
	paragraph?: Paragraph;
	sectionBreak?: SectionBreak;
	table?: Table;
	tableOfContents?: TableOfContents;
}

export interface Paragraph {
	elements: ParagraphElement[];
	paragraphStyle?: ParagraphStyle;
}

export interface ParagraphElement {
	startIndex: number;
	endIndex: number;
	textRun?: TextRun;
	inlineObjectElement?: InlineObjectElement;
}

export interface TextRun {
	content: string;
	textStyle?: TextStyle;
}

export interface TextStyle {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	fontSize?: Dimension;
	foregroundColor?: OptionalColor;
	backgroundColor?: OptionalColor;
	fontFamily?: string;
	link?: Link;
}

export interface Link {
	url?: string;
	bookmarkId?: string;
	headingId?: string;
}

export interface Dimension {
	magnitude: number;
	unit: "PT" | "UNIT_UNSPECIFIED";
}

export interface OptionalColor {
	color?: {
		rgbColor?: {
			red?: number;
			green?: number;
			blue?: number;
		};
	};
}

export interface ParagraphStyle {
	headingId?: string;
	namedStyleType?: NamedStyleType;
	alignment?: "START" | "CENTER" | "END" | "JUSTIFIED";
	lineSpacing?: number;
	direction?: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT";
	spaceAbove?: Dimension;
	spaceBelow?: Dimension;
	indentFirstLine?: Dimension;
	indentStart?: Dimension;
	indentEnd?: Dimension;
}

export type NamedStyleType =
	| "NORMAL_TEXT"
	| "TITLE"
	| "SUBTITLE"
	| "HEADING_1"
	| "HEADING_2"
	| "HEADING_3"
	| "HEADING_4"
	| "HEADING_5"
	| "HEADING_6";

export interface SectionBreak {
	sectionStyle?: {
		columnSeparatorStyle?: "NONE" | "BETWEEN_EACH_COLUMN";
		contentDirection?: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT";
	};
}

export interface Table {
	rows: number;
	columns: number;
	tableRows: TableRow[];
}

export interface TableRow {
	startIndex: number;
	endIndex: number;
	tableCells: TableCell[];
}

export interface TableCell {
	startIndex: number;
	endIndex: number;
	content: StructuralElement[];
}

export interface TableOfContents {
	content: StructuralElement[];
}

export interface InlineObjectElement {
	inlineObjectId: string;
}

export interface DocumentStyle {
	background?: {
		color?: OptionalColor;
	};
	pageSize?: {
		width: Dimension;
		height: Dimension;
	};
	marginTop?: Dimension;
	marginBottom?: Dimension;
	marginRight?: Dimension;
	marginLeft?: Dimension;
}

export interface Request {
	insertText?: {
		text: string;
		location?: { index: number };
		endOfSegmentLocation?: { segmentId?: string };
	};
	deleteContentRange?: {
		range: { startIndex: number; endIndex: number };
	};
	updateTextStyle?: {
		textStyle: TextStyle;
		range: { startIndex: number; endIndex: number };
		fields: string;
	};
	updateParagraphStyle?: {
		paragraphStyle: ParagraphStyle;
		range: { startIndex: number; endIndex: number };
		fields: string;
	};
	insertTable?: {
		rows: number;
		columns: number;
		location: { index: number };
	};
	insertInlineImage?: {
		uri: string;
		location: { index: number };
		objectSize?: {
			width?: Dimension;
			height?: Dimension;
		};
	};
	createNamedRange?: {
		name: string;
		range: { startIndex: number; endIndex: number };
	};
	replaceAllText?: {
		containsText: { text: string; matchCase?: boolean };
		replaceText: string;
	};
}

export interface BatchUpdateResponse {
	documentId: string;
	replies: Record<string, unknown>[];
	writeControl: { requiredRevisionId?: string };
}

// Service implementation
class GoogleDocsService {
	private readonly baseUrl = "https://docs.googleapis.com/v1/documents";

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return true; // Requires OAuth at runtime
	}

	/**
	 * Create a new document
	 */
	async createDocument(
		accessToken: string,
		title: string,
	): Promise<Document | null> {
		try {
			const response = await fetch(this.baseUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title }),
			});

			if (!response.ok) {
				console.error("Docs create error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Docs create error:", error);
			return null;
		}
	}

	/**
	 * Get document content
	 */
	async getDocument(
		accessToken: string,
		documentId: string,
	): Promise<Document | null> {
		try {
			const response = await fetch(`${this.baseUrl}/${documentId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("Docs get error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Docs get error:", error);
			return null;
		}
	}

	/**
	 * Batch update document
	 */
	async batchUpdate(
		accessToken: string,
		documentId: string,
		requests: Request[],
	): Promise<BatchUpdateResponse | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${documentId}:batchUpdate`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ requests }),
				},
			);

			if (!response.ok) {
				console.error("Docs batch update error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Docs batch update error:", error);
			return null;
		}
	}

	/**
	 * Insert text at a location
	 */
	async insertText(
		accessToken: string,
		documentId: string,
		text: string,
		index?: number,
	): Promise<boolean> {
		const request: Request = {
			insertText:
				index !== undefined
					? { text, location: { index } }
					: { text, endOfSegmentLocation: {} },
		};

		const result = await this.batchUpdate(accessToken, documentId, [request]);
		return result !== null;
	}

	/**
	 * Replace all occurrences of text
	 */
	async replaceAllText(
		accessToken: string,
		documentId: string,
		searchText: string,
		replaceText: string,
	): Promise<boolean> {
		const result = await this.batchUpdate(accessToken, documentId, [
			{
				replaceAllText: {
					containsText: { text: searchText, matchCase: false },
					replaceText,
				},
			},
		]);

		return result !== null;
	}

	/**
	 * Insert a table
	 */
	async insertTable(
		accessToken: string,
		documentId: string,
		rows: number,
		columns: number,
		index: number,
	): Promise<boolean> {
		const result = await this.batchUpdate(accessToken, documentId, [
			{
				insertTable: { rows, columns, location: { index } },
			},
		]);

		return result !== null;
	}

	/**
	 * Insert an image
	 */
	async insertImage(
		accessToken: string,
		documentId: string,
		imageUrl: string,
		index: number,
		width?: number,
		height?: number,
	): Promise<boolean> {
		const request: Request = {
			insertInlineImage: {
				uri: imageUrl,
				location: { index },
			},
		};

		if (width || height) {
			request.insertInlineImage!.objectSize = {};
			if (width)
				request.insertInlineImage!.objectSize.width = {
					magnitude: width,
					unit: "PT",
				};
			if (height)
				request.insertInlineImage!.objectSize.height = {
					magnitude: height,
					unit: "PT",
				};
		}

		const result = await this.batchUpdate(accessToken, documentId, [request]);
		return result !== null;
	}

	/**
	 * Apply text formatting
	 */
	async formatText(
		accessToken: string,
		documentId: string,
		startIndex: number,
		endIndex: number,
		style: TextStyle,
	): Promise<boolean> {
		const fields = Object.keys(style).join(",");

		const result = await this.batchUpdate(accessToken, documentId, [
			{
				updateTextStyle: {
					textStyle: style,
					range: { startIndex, endIndex },
					fields,
				},
			},
		]);

		return result !== null;
	}

	/**
	 * Apply paragraph style
	 */
	async formatParagraph(
		accessToken: string,
		documentId: string,
		startIndex: number,
		endIndex: number,
		style: ParagraphStyle,
	): Promise<boolean> {
		const fields = Object.keys(style).join(",");

		const result = await this.batchUpdate(accessToken, documentId, [
			{
				updateParagraphStyle: {
					paragraphStyle: style,
					range: { startIndex, endIndex },
					fields,
				},
			},
		]);

		return result !== null;
	}

	/**
	 * Get plain text from document
	 */
	getPlainText(document: Document): string {
		const extractText = (elements: StructuralElement[]): string => {
			let text = "";

			for (const element of elements) {
				if (element.paragraph) {
					for (const paragraphElement of element.paragraph.elements) {
						if (paragraphElement.textRun?.content) {
							text += paragraphElement.textRun.content;
						}
					}
				} else if (element.table) {
					for (const row of element.table.tableRows) {
						for (const cell of row.tableCells) {
							text += extractText(cell.content);
							text += "\t";
						}
						text += "\n";
					}
				}
			}

			return text;
		};

		return extractText(document.body.content);
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Create an estimate document
	 */
	async createEstimateDocument(
		accessToken: string,
		data: {
			companyName: string;
			customerName: string;
			customerAddress: string;
			jobDescription: string;
			lineItems: { description: string; quantity: number; unitPrice: number }[];
			notes?: string;
		},
	): Promise<Document | null> {
		const total = data.lineItems.reduce(
			(sum, item) => sum + item.quantity * item.unitPrice,
			0,
		);
		const estimateNumber = `EST-${Date.now()}`;

		const doc = await this.createDocument(
			accessToken,
			`Estimate ${estimateNumber} - ${data.customerName}`,
		);
		if (!doc) return null;

		// Build content
		const content = `
${data.companyName}
ESTIMATE #${estimateNumber}

Customer: ${data.customerName}
Address: ${data.customerAddress}
Date: ${new Date().toLocaleDateString()}

Job Description:
${data.jobDescription}

Line Items:
${data.lineItems.map((item) => `- ${item.description}: ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}`).join("\n")}

TOTAL: $${total.toFixed(2)}

${data.notes ? `Notes:\n${data.notes}` : ""}

This estimate is valid for 30 days.
`;

		await this.insertText(accessToken, doc.documentId, content, 1);

		return this.getDocument(accessToken, doc.documentId);
	}

	/**
	 * Create a service agreement document
	 */
	async createServiceAgreement(
		accessToken: string,
		data: {
			companyName: string;
			customerName: string;
			serviceDescription: string;
			terms: string;
			amount: number;
		},
	): Promise<Document | null> {
		const agreementNumber = `SA-${Date.now()}`;

		const doc = await this.createDocument(
			accessToken,
			`Service Agreement ${agreementNumber}`,
		);
		if (!doc) return null;

		const content = `
SERVICE AGREEMENT

Agreement Number: ${agreementNumber}
Date: ${new Date().toLocaleDateString()}

BETWEEN:
${data.companyName} ("Service Provider")

AND:
${data.customerName} ("Customer")

SERVICE DESCRIPTION:
${data.serviceDescription}

TERMS AND CONDITIONS:
${data.terms}

AMOUNT: $${data.amount.toFixed(2)}

SIGNATURES:

_______________________________
${data.companyName}
Date: _______________


_______________________________
${data.customerName}
Date: _______________
`;

		await this.insertText(accessToken, doc.documentId, content, 1);

		return this.getDocument(accessToken, doc.documentId);
	}

	/**
	 * Create a work order document
	 */
	async createWorkOrder(
		accessToken: string,
		data: {
			companyName: string;
			workOrderNumber: string;
			customerName: string;
			customerAddress: string;
			technician: string;
			scheduledDate: string;
			description: string;
			tasks: string[];
			notes?: string;
		},
	): Promise<Document | null> {
		const doc = await this.createDocument(
			accessToken,
			`Work Order ${data.workOrderNumber}`,
		);
		if (!doc) return null;

		const content = `
${data.companyName}
WORK ORDER #${data.workOrderNumber}

Customer: ${data.customerName}
Address: ${data.customerAddress}
Technician: ${data.technician}
Scheduled Date: ${data.scheduledDate}
Created: ${new Date().toLocaleDateString()}

DESCRIPTION:
${data.description}

TASKS:
${data.tasks.map((task, i) => `${i + 1}. [ ] ${task}`).join("\n")}

${data.notes ? `NOTES:\n${data.notes}` : ""}

TECHNICIAN SIGN-OFF:

Signature: _______________________________
Date/Time Completed: _______________

CUSTOMER SIGN-OFF:

Signature: _______________________________
Date: _______________
`;

		await this.insertText(accessToken, doc.documentId, content, 1);

		return this.getDocument(accessToken, doc.documentId);
	}
}

// Export singleton instance
export const googleDocsService = new GoogleDocsService();
