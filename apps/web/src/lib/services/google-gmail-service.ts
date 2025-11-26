/**
 * Google Gmail API Service
 *
 * Provides email operations through Gmail API.
 * - Send emails
 * - Read/search emails
 * - Manage labels and threads
 * - Watch for new emails
 *
 * NOTE: Gmail API requires OAuth 2.0 user authentication.
 * Access tokens must be obtained through OAuth flow and passed to methods.
 *
 * API: Gmail API v1
 * Docs: https://developers.google.com/gmail/api
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Email message
 */
export interface GmailMessage {
	id: string;
	threadId: string;
	labelIds: string[];
	snippet: string;
	payload?: {
		headers: { name: string; value: string }[];
		mimeType: string;
		body?: { data?: string; size: number };
		parts?: GmailMessagePart[];
	};
	sizeEstimate: number;
	historyId?: string;
	internalDate?: string;
}

/**
 * Message part
 */
export interface GmailMessagePart {
	partId: string;
	mimeType: string;
	filename?: string;
	headers?: { name: string; value: string }[];
	body?: { data?: string; size: number; attachmentId?: string };
	parts?: GmailMessagePart[];
}

/**
 * Email thread
 */
export interface GmailThread {
	id: string;
	historyId?: string;
	messages?: GmailMessage[];
	snippet?: string;
}

/**
 * Email label
 */
export interface GmailLabel {
	id: string;
	name: string;
	messageListVisibility?: "show" | "hide";
	labelListVisibility?: "labelShow" | "labelHide" | "labelShowIfUnread";
	type?: "system" | "user";
	messagesTotal?: number;
	messagesUnread?: number;
	threadsTotal?: number;
	threadsUnread?: number;
	color?: { textColor: string; backgroundColor: string };
}

/**
 * Parsed email for easier use
 */
export interface ParsedEmail {
	id: string;
	threadId: string;
	from: string;
	to: string[];
	cc?: string[];
	bcc?: string[];
	subject: string;
	date: Date;
	snippet: string;
	body: {
		text?: string;
		html?: string;
	};
	attachments: {
		id: string;
		filename: string;
		mimeType: string;
		size: number;
	}[];
	labels: string[];
	isUnread: boolean;
	isStarred: boolean;
	isImportant: boolean;
}

/**
 * Send email options
 */
export interface SendEmailOptions {
	to: string | string[];
	subject: string;
	body: string;
	isHtml?: boolean;
	cc?: string | string[];
	bcc?: string | string[];
	from?: string;
	replyTo?: string;
	inReplyTo?: string;
	references?: string;
	attachments?: {
		filename: string;
		content: string; // Base64 encoded
		mimeType: string;
	}[];
}

/**
 * Search options
 */
export interface SearchOptions {
	query: string;
	maxResults?: number;
	pageToken?: string;
	labelIds?: string[];
	includeSpamTrash?: boolean;
}

/**
 * Watch options
 */
export interface WatchOptions {
	topicName: string;
	labelIds?: string[];
	labelFilterAction?: "include" | "exclude";
}

/**
 * Watch response
 */
export interface WatchResponse {
	historyId: string;
	expiration: string;
}

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleGmailService {
	private readonly baseUrl = "https://gmail.googleapis.com/gmail/v1";

	/**
	 * Get headers for authenticated requests
	 */
	private getHeaders(accessToken: string): Record<string, string> {
		return {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			"User-Agent": USER_AGENT,
		};
	}

	/**
	 * Decode Base64 URL encoded string
	 */
	private decodeBase64Url(data: string): string {
		const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
		try {
			return Buffer.from(base64, "base64").toString("utf-8");
		} catch {
			return "";
		}
	}

	/**
	 * Encode to Base64 URL
	 */
	private encodeBase64Url(data: string): string {
		return Buffer.from(data)
			.toString("base64")
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");
	}

	/**
	 * Build raw email message
	 */
	private buildRawEmail(options: SendEmailOptions): string {
		const boundary = "boundary_" + Date.now().toString(36);
		const toAddresses = Array.isArray(options.to)
			? options.to.join(", ")
			: options.to;
		const ccAddresses = options.cc
			? Array.isArray(options.cc)
				? options.cc.join(", ")
				: options.cc
			: undefined;
		const bccAddresses = options.bcc
			? Array.isArray(options.bcc)
				? options.bcc.join(", ")
				: options.bcc
			: undefined;

		const headers = [
			`To: ${toAddresses}`,
			`Subject: ${options.subject}`,
			`MIME-Version: 1.0`,
		];

		if (options.from) {
			headers.push(`From: ${options.from}`);
		}
		if (ccAddresses) {
			headers.push(`Cc: ${ccAddresses}`);
		}
		if (bccAddresses) {
			headers.push(`Bcc: ${bccAddresses}`);
		}
		if (options.replyTo) {
			headers.push(`Reply-To: ${options.replyTo}`);
		}
		if (options.inReplyTo) {
			headers.push(`In-Reply-To: ${options.inReplyTo}`);
			headers.push(`References: ${options.references || options.inReplyTo}`);
		}

		if (options.attachments && options.attachments.length > 0) {
			headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
			const headerString = headers.join("\r\n");

			let body = `\r\n--${boundary}\r\n`;
			body += `Content-Type: ${options.isHtml ? "text/html" : "text/plain"}; charset="UTF-8"\r\n\r\n`;
			body += options.body;

			for (const attachment of options.attachments) {
				body += `\r\n--${boundary}\r\n`;
				body += `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"\r\n`;
				body += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
				body += `Content-Transfer-Encoding: base64\r\n\r\n`;
				body += attachment.content;
			}

			body += `\r\n--${boundary}--`;
			return headerString + body;
		} else {
			headers.push(
				`Content-Type: ${options.isHtml ? "text/html" : "text/plain"}; charset="UTF-8"`,
			);
			return headers.join("\r\n") + "\r\n\r\n" + options.body;
		}
	}

	/**
	 * Parse email headers
	 */
	private getHeader(
		headers: { name: string; value: string }[],
		name: string,
	): string {
		const header = headers.find(
			(h) => h.name.toLowerCase() === name.toLowerCase(),
		);
		return header?.value || "";
	}

	/**
	 * Parse email body from parts
	 */
	private parseEmailBody(payload: GmailMessage["payload"]): {
		text?: string;
		html?: string;
	} {
		if (!payload) return {};

		const body: { text?: string; html?: string } = {};

		if (payload.body?.data) {
			if (payload.mimeType === "text/plain") {
				body.text = this.decodeBase64Url(payload.body.data);
			} else if (payload.mimeType === "text/html") {
				body.html = this.decodeBase64Url(payload.body.data);
			}
		}

		if (payload.parts) {
			for (const part of payload.parts) {
				if (part.mimeType === "text/plain" && part.body?.data) {
					body.text = this.decodeBase64Url(part.body.data);
				} else if (part.mimeType === "text/html" && part.body?.data) {
					body.html = this.decodeBase64Url(part.body.data);
				} else if (part.parts) {
					// Nested parts (multipart/alternative)
					for (const subPart of part.parts) {
						if (subPart.mimeType === "text/plain" && subPart.body?.data) {
							body.text = this.decodeBase64Url(subPart.body.data);
						} else if (subPart.mimeType === "text/html" && subPart.body?.data) {
							body.html = this.decodeBase64Url(subPart.body.data);
						}
					}
				}
			}
		}

		return body;
	}

	/**
	 * Extract attachments from message
	 */
	private extractAttachments(
		payload: GmailMessage["payload"],
	): ParsedEmail["attachments"] {
		const attachments: ParsedEmail["attachments"] = [];

		if (!payload?.parts) return attachments;

		const extractFromParts = (parts: GmailMessagePart[]) => {
			for (const part of parts) {
				if (part.filename && part.body?.attachmentId) {
					attachments.push({
						id: part.body.attachmentId,
						filename: part.filename,
						mimeType: part.mimeType,
						size: part.body.size,
					});
				}
				if (part.parts) {
					extractFromParts(part.parts);
				}
			}
		};

		extractFromParts(payload.parts);
		return attachments;
	}

	/**
	 * Parse raw Gmail message to friendly format
	 */
	parseMessage(message: GmailMessage): ParsedEmail {
		const headers = message.payload?.headers || [];
		const body = this.parseEmailBody(message.payload);
		const attachments = this.extractAttachments(message.payload);

		const to = this.getHeader(headers, "to")
			.split(",")
			.map((e) => e.trim())
			.filter(Boolean);
		const cc = this.getHeader(headers, "cc")
			.split(",")
			.map((e) => e.trim())
			.filter(Boolean);
		const bcc = this.getHeader(headers, "bcc")
			.split(",")
			.map((e) => e.trim())
			.filter(Boolean);

		return {
			id: message.id,
			threadId: message.threadId,
			from: this.getHeader(headers, "from"),
			to,
			cc: cc.length > 0 ? cc : undefined,
			bcc: bcc.length > 0 ? bcc : undefined,
			subject: this.getHeader(headers, "subject"),
			date: new Date(Number.parseInt(message.internalDate || "0", 10)),
			snippet: message.snippet,
			body,
			attachments,
			labels: message.labelIds || [],
			isUnread: message.labelIds?.includes("UNREAD") || false,
			isStarred: message.labelIds?.includes("STARRED") || false,
			isImportant: message.labelIds?.includes("IMPORTANT") || false,
		};
	}

	// ============================================
	// Messages API
	// ============================================

	/**
	 * Send an email
	 */
	async sendEmail(
		accessToken: string,
		options: SendEmailOptions,
	): Promise<GmailMessage | null> {
		try {
			const rawEmail = this.buildRawEmail(options);
			const encodedEmail = this.encodeBase64Url(rawEmail);

			const url = `${this.baseUrl}/users/me/messages/send`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify({ raw: encodedEmail }),
			});

			if (!response.ok) {
				const error = await response.text();
				console.error("Gmail send error:", response.status, error);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail send error:", error);
			return null;
		}
	}

	/**
	 * Get a specific message
	 */
	async getMessage(
		accessToken: string,
		messageId: string,
		format: "minimal" | "full" | "raw" | "metadata" = "full",
	): Promise<GmailMessage | null> {
		try {
			const url = `${this.baseUrl}/users/me/messages/${messageId}?format=${format}`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail get message error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail get message error:", error);
			return null;
		}
	}

	/**
	 * List messages
	 */
	async listMessages(
		accessToken: string,
		options: SearchOptions = { query: "" },
	): Promise<{
		messages: { id: string; threadId: string }[];
		nextPageToken?: string;
	} | null> {
		try {
			const params = new URLSearchParams();
			if (options.query) params.append("q", options.query);
			if (options.maxResults)
				params.append("maxResults", options.maxResults.toString());
			if (options.pageToken) params.append("pageToken", options.pageToken);
			if (options.labelIds) {
				for (const labelId of options.labelIds) {
					params.append("labelIds", labelId);
				}
			}
			if (options.includeSpamTrash) params.append("includeSpamTrash", "true");

			const url = `${this.baseUrl}/users/me/messages?${params.toString()}`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail list messages error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail list messages error:", error);
			return null;
		}
	}

	/**
	 * Search emails with query and get full details
	 */
	async searchEmails(
		accessToken: string,
		query: string,
		options: { maxResults?: number; pageToken?: string } = {},
	): Promise<{ emails: ParsedEmail[]; nextPageToken?: string } | null> {
		const listResult = await this.listMessages(accessToken, {
			query,
			maxResults: options.maxResults || 20,
			pageToken: options.pageToken,
		});

		if (!listResult || !listResult.messages) {
			return { emails: [], nextPageToken: undefined };
		}

		const emails: ParsedEmail[] = [];
		for (const msg of listResult.messages) {
			const fullMessage = await this.getMessage(accessToken, msg.id);
			if (fullMessage) {
				emails.push(this.parseMessage(fullMessage));
			}
		}

		return {
			emails,
			nextPageToken: listResult.nextPageToken,
		};
	}

	/**
	 * Delete a message
	 */
	async deleteMessage(
		accessToken: string,
		messageId: string,
	): Promise<boolean> {
		try {
			const url = `${this.baseUrl}/users/me/messages/${messageId}`;
			const response = await fetch(url, {
				method: "DELETE",
				headers: this.getHeaders(accessToken),
			});

			return response.ok;
		} catch (error) {
			console.error("Gmail delete error:", error);
			return false;
		}
	}

	/**
	 * Trash a message
	 */
	async trashMessage(accessToken: string, messageId: string): Promise<boolean> {
		try {
			const url = `${this.baseUrl}/users/me/messages/${messageId}/trash`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
			});

			return response.ok;
		} catch (error) {
			console.error("Gmail trash error:", error);
			return false;
		}
	}

	/**
	 * Untrash a message
	 */
	async untrashMessage(
		accessToken: string,
		messageId: string,
	): Promise<boolean> {
		try {
			const url = `${this.baseUrl}/users/me/messages/${messageId}/untrash`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
			});

			return response.ok;
		} catch (error) {
			console.error("Gmail untrash error:", error);
			return false;
		}
	}

	/**
	 * Modify message labels
	 */
	async modifyLabels(
		accessToken: string,
		messageId: string,
		addLabels: string[],
		removeLabels: string[],
	): Promise<GmailMessage | null> {
		try {
			const url = `${this.baseUrl}/users/me/messages/${messageId}/modify`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify({
					addLabelIds: addLabels,
					removeLabelIds: removeLabels,
				}),
			});

			if (!response.ok) {
				console.error("Gmail modify labels error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail modify labels error:", error);
			return null;
		}
	}

	/**
	 * Mark message as read
	 */
	async markAsRead(accessToken: string, messageId: string): Promise<boolean> {
		const result = await this.modifyLabels(
			accessToken,
			messageId,
			[],
			["UNREAD"],
		);
		return result !== null;
	}

	/**
	 * Mark message as unread
	 */
	async markAsUnread(accessToken: string, messageId: string): Promise<boolean> {
		const result = await this.modifyLabels(
			accessToken,
			messageId,
			["UNREAD"],
			[],
		);
		return result !== null;
	}

	/**
	 * Star a message
	 */
	async starMessage(accessToken: string, messageId: string): Promise<boolean> {
		const result = await this.modifyLabels(
			accessToken,
			messageId,
			["STARRED"],
			[],
		);
		return result !== null;
	}

	/**
	 * Unstar a message
	 */
	async unstarMessage(
		accessToken: string,
		messageId: string,
	): Promise<boolean> {
		const result = await this.modifyLabels(
			accessToken,
			messageId,
			[],
			["STARRED"],
		);
		return result !== null;
	}

	// ============================================
	// Threads API
	// ============================================

	/**
	 * Get a thread
	 */
	async getThread(
		accessToken: string,
		threadId: string,
	): Promise<GmailThread | null> {
		try {
			const url = `${this.baseUrl}/users/me/threads/${threadId}`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail get thread error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail get thread error:", error);
			return null;
		}
	}

	/**
	 * List threads
	 */
	async listThreads(
		accessToken: string,
		options: SearchOptions = { query: "" },
	): Promise<{
		threads: { id: string; historyId: string; snippet: string }[];
		nextPageToken?: string;
	} | null> {
		try {
			const params = new URLSearchParams();
			if (options.query) params.append("q", options.query);
			if (options.maxResults)
				params.append("maxResults", options.maxResults.toString());
			if (options.pageToken) params.append("pageToken", options.pageToken);
			if (options.labelIds) {
				for (const labelId of options.labelIds) {
					params.append("labelIds", labelId);
				}
			}

			const url = `${this.baseUrl}/users/me/threads?${params.toString()}`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail list threads error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail list threads error:", error);
			return null;
		}
	}

	// ============================================
	// Labels API
	// ============================================

	/**
	 * List labels
	 */
	async listLabels(accessToken: string): Promise<GmailLabel[] | null> {
		try {
			const url = `${this.baseUrl}/users/me/labels`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail list labels error:", response.status);
				return null;
			}

			const data = await response.json();
			return data.labels || [];
		} catch (error) {
			console.error("Gmail list labels error:", error);
			return null;
		}
	}

	/**
	 * Create a label
	 */
	async createLabel(
		accessToken: string,
		name: string,
		options: {
			messageListVisibility?: "show" | "hide";
			labelListVisibility?: "labelShow" | "labelHide" | "labelShowIfUnread";
			backgroundColor?: string;
			textColor?: string;
		} = {},
	): Promise<GmailLabel | null> {
		try {
			const url = `${this.baseUrl}/users/me/labels`;
			const body: Record<string, unknown> = {
				name,
				messageListVisibility: options.messageListVisibility || "show",
				labelListVisibility: options.labelListVisibility || "labelShow",
			};

			if (options.backgroundColor && options.textColor) {
				body.color = {
					backgroundColor: options.backgroundColor,
					textColor: options.textColor,
				};
			}

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				console.error("Gmail create label error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail create label error:", error);
			return null;
		}
	}

	/**
	 * Delete a label
	 */
	async deleteLabel(accessToken: string, labelId: string): Promise<boolean> {
		try {
			const url = `${this.baseUrl}/users/me/labels/${labelId}`;
			const response = await fetch(url, {
				method: "DELETE",
				headers: this.getHeaders(accessToken),
			});

			return response.ok;
		} catch (error) {
			console.error("Gmail delete label error:", error);
			return false;
		}
	}

	// ============================================
	// Watch API (Push Notifications)
	// ============================================

	/**
	 * Start watching for new emails (requires Cloud Pub/Sub topic)
	 */
	async watch(
		accessToken: string,
		options: WatchOptions,
	): Promise<WatchResponse | null> {
		try {
			const url = `${this.baseUrl}/users/me/watch`;
			const body: Record<string, unknown> = {
				topicName: options.topicName,
			};

			if (options.labelIds) {
				body.labelIds = options.labelIds;
				body.labelFilterAction = options.labelFilterAction || "include";
			}

			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				console.error("Gmail watch error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail watch error:", error);
			return null;
		}
	}

	/**
	 * Stop watching for new emails
	 */
	async stopWatch(accessToken: string): Promise<boolean> {
		try {
			const url = `${this.baseUrl}/users/me/stop`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
			});

			return response.ok;
		} catch (error) {
			console.error("Gmail stop watch error:", error);
			return false;
		}
	}

	// ============================================
	// Attachments API
	// ============================================

	/**
	 * Get attachment data
	 */
	async getAttachment(
		accessToken: string,
		messageId: string,
		attachmentId: string,
	): Promise<{ data: string; size: number } | null> {
		try {
			const url = `${this.baseUrl}/users/me/messages/${messageId}/attachments/${attachmentId}`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail get attachment error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail get attachment error:", error);
			return null;
		}
	}

	// ============================================
	// Profile API
	// ============================================

	/**
	 * Get user profile
	 */
	async getProfile(accessToken: string): Promise<{
		emailAddress: string;
		messagesTotal: number;
		threadsTotal: number;
		historyId: string;
	} | null> {
		try {
			const url = `${this.baseUrl}/users/me/profile`;
			const response = await fetch(url, {
				headers: this.getHeaders(accessToken),
			});

			if (!response.ok) {
				console.error("Gmail get profile error:", response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Gmail get profile error:", error);
			return null;
		}
	}
}

export const googleGmailService = new GoogleGmailService();
