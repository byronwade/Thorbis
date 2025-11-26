/**
 * Google Drive API Service
 *
 * File storage, upload, download, and sharing operations.
 * Requires OAuth 2.0 for user-specific operations.
 *
 * Features:
 * - File upload and download
 * - Folder creation and management
 * - File sharing and permissions
 * - Search and list files
 * - File metadata operations
 *
 * @see https://developers.google.com/drive/api/v3/reference
 */

// Types
export type MimeType =
	| "application/vnd.google-apps.folder"
	| "application/vnd.google-apps.document"
	| "application/vnd.google-apps.spreadsheet"
	| "application/vnd.google-apps.presentation"
	| "application/pdf"
	| "image/jpeg"
	| "image/png"
	| "text/plain"
	| "application/json"
	| string;

export interface DriveFile {
	id: string;
	name: string;
	mimeType: MimeType;
	size?: string;
	createdTime?: string;
	modifiedTime?: string;
	parents?: string[];
	webViewLink?: string;
	webContentLink?: string;
	iconLink?: string;
	thumbnailLink?: string;
	description?: string;
	starred?: boolean;
	trashed?: boolean;
	shared?: boolean;
	owners?: DriveUser[];
	permissions?: DrivePermission[];
}

export interface DriveUser {
	kind: string;
	displayName: string;
	photoLink?: string;
	emailAddress: string;
}

export interface DrivePermission {
	id: string;
	type: "user" | "group" | "domain" | "anyone";
	role:
		| "owner"
		| "organizer"
		| "fileOrganizer"
		| "writer"
		| "commenter"
		| "reader";
	emailAddress?: string;
	displayName?: string;
}

export interface FileListResponse {
	files: DriveFile[];
	nextPageToken?: string;
	incompleteSearch?: boolean;
}

export interface UploadOptions {
	name: string;
	mimeType?: MimeType;
	parents?: string[];
	description?: string;
}

export interface SearchOptions {
	query?: string;
	mimeType?: MimeType;
	folderId?: string;
	trashed?: boolean;
	starred?: boolean;
	pageSize?: number;
	pageToken?: string;
	orderBy?: "createdTime" | "modifiedTime" | "name" | "folder";
	fields?: string;
}

export interface ShareOptions {
	type: "user" | "group" | "domain" | "anyone";
	role:
		| "owner"
		| "organizer"
		| "fileOrganizer"
		| "writer"
		| "commenter"
		| "reader";
	emailAddress?: string;
	domain?: string;
	sendNotificationEmail?: boolean;
	emailMessage?: string;
}

// Service implementation
class GoogleDriveService {
	private readonly baseUrl = "https://www.googleapis.com/drive/v3";
	private readonly uploadUrl = "https://www.googleapis.com/upload/drive/v3";

	/**
	 * Check if service is configured (requires OAuth token at runtime)
	 */
	isConfigured(): boolean {
		// Drive API requires OAuth, so we always return true
		// Actual token validation happens at request time
		return true;
	}

	/**
	 * List files in Drive
	 */
	async listFiles(
		accessToken: string,
		options: SearchOptions = {},
	): Promise<FileListResponse | null> {
		try {
			const params = new URLSearchParams();

			// Build query
			const queryParts: string[] = [];
			if (options.query) {
				queryParts.push(`name contains '${options.query}'`);
			}
			if (options.mimeType) {
				queryParts.push(`mimeType = '${options.mimeType}'`);
			}
			if (options.folderId) {
				queryParts.push(`'${options.folderId}' in parents`);
			}
			if (options.trashed !== undefined) {
				queryParts.push(`trashed = ${options.trashed}`);
			}
			if (options.starred !== undefined) {
				queryParts.push(`starred = ${options.starred}`);
			}

			if (queryParts.length > 0) {
				params.set("q", queryParts.join(" and "));
			}

			params.set("pageSize", String(options.pageSize || 100));
			if (options.pageToken) {
				params.set("pageToken", options.pageToken);
			}
			if (options.orderBy) {
				params.set("orderBy", options.orderBy);
			}

			const fields =
				options.fields ||
				"files(id,name,mimeType,size,createdTime,modifiedTime,parents,webViewLink,thumbnailLink),nextPageToken";
			params.set("fields", fields);

			const response = await fetch(
				`${this.baseUrl}/files?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Drive list files error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive list files error:", error);
			return null;
		}
	}

	/**
	 * Get file metadata
	 */
	async getFile(
		accessToken: string,
		fileId: string,
	): Promise<DriveFile | null> {
		try {
			const fields =
				"id,name,mimeType,size,createdTime,modifiedTime,parents,webViewLink,webContentLink,thumbnailLink,description,starred,trashed,shared,owners,permissions";

			const response = await fetch(
				`${this.baseUrl}/files/${fileId}?fields=${encodeURIComponent(fields)}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Drive get file error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive get file error:", error);
			return null;
		}
	}

	/**
	 * Download file content
	 */
	async downloadFile(
		accessToken: string,
		fileId: string,
	): Promise<Blob | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/files/${fileId}?alt=media`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Drive download error:", await response.text());
				return null;
			}

			return await response.blob();
		} catch (error) {
			console.error("Drive download error:", error);
			return null;
		}
	}

	/**
	 * Upload a file
	 */
	async uploadFile(
		accessToken: string,
		content: Blob | string,
		options: UploadOptions,
	): Promise<DriveFile | null> {
		try {
			const metadata = {
				name: options.name,
				mimeType: options.mimeType,
				parents: options.parents,
				description: options.description,
			};

			// Simple upload for small files
			const form = new FormData();
			form.append(
				"metadata",
				new Blob([JSON.stringify(metadata)], { type: "application/json" }),
			);
			form.append(
				"file",
				typeof content === "string"
					? new Blob([content], { type: options.mimeType || "text/plain" })
					: content,
			);

			const response = await fetch(
				`${this.uploadUrl}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
					body: form,
				},
			);

			if (!response.ok) {
				console.error("Drive upload error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive upload error:", error);
			return null;
		}
	}

	/**
	 * Create a folder
	 */
	async createFolder(
		accessToken: string,
		name: string,
		parentId?: string,
	): Promise<DriveFile | null> {
		try {
			const metadata: Record<string, unknown> = {
				name,
				mimeType: "application/vnd.google-apps.folder",
			};

			if (parentId) {
				metadata.parents = [parentId];
			}

			const response = await fetch(`${this.baseUrl}/files`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(metadata),
			});

			if (!response.ok) {
				console.error("Drive create folder error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive create folder error:", error);
			return null;
		}
	}

	/**
	 * Delete a file (move to trash)
	 */
	async deleteFile(
		accessToken: string,
		fileId: string,
		permanent = false,
	): Promise<boolean> {
		try {
			if (permanent) {
				const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				return response.ok;
			} else {
				const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ trashed: true }),
				});
				return response.ok;
			}
		} catch (error) {
			console.error("Drive delete error:", error);
			return false;
		}
	}

	/**
	 * Update file metadata
	 */
	async updateFile(
		accessToken: string,
		fileId: string,
		metadata: Partial<Pick<DriveFile, "name" | "description" | "starred">>,
	): Promise<DriveFile | null> {
		try {
			const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(metadata),
			});

			if (!response.ok) {
				console.error("Drive update error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive update error:", error);
			return null;
		}
	}

	/**
	 * Share a file
	 */
	async shareFile(
		accessToken: string,
		fileId: string,
		options: ShareOptions,
	): Promise<DrivePermission | null> {
		try {
			const permission: Record<string, unknown> = {
				type: options.type,
				role: options.role,
			};

			if (options.emailAddress) {
				permission.emailAddress = options.emailAddress;
			}
			if (options.domain) {
				permission.domain = options.domain;
			}

			const params = new URLSearchParams();
			if (options.sendNotificationEmail !== undefined) {
				params.set(
					"sendNotificationEmail",
					String(options.sendNotificationEmail),
				);
			}
			if (options.emailMessage) {
				params.set("emailMessage", options.emailMessage);
			}

			const response = await fetch(
				`${this.baseUrl}/files/${fileId}/permissions?${params.toString()}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(permission),
				},
			);

			if (!response.ok) {
				console.error("Drive share error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive share error:", error);
			return null;
		}
	}

	/**
	 * Copy a file
	 */
	async copyFile(
		accessToken: string,
		fileId: string,
		name?: string,
		parentId?: string,
	): Promise<DriveFile | null> {
		try {
			const metadata: Record<string, unknown> = {};
			if (name) metadata.name = name;
			if (parentId) metadata.parents = [parentId];

			const response = await fetch(`${this.baseUrl}/files/${fileId}/copy`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(metadata),
			});

			if (!response.ok) {
				console.error("Drive copy error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive copy error:", error);
			return null;
		}
	}

	/**
	 * Move a file to a different folder
	 */
	async moveFile(
		accessToken: string,
		fileId: string,
		newParentId: string,
		removeParents?: string[],
	): Promise<DriveFile | null> {
		try {
			const params = new URLSearchParams();
			params.set("addParents", newParentId);
			if (removeParents && removeParents.length > 0) {
				params.set("removeParents", removeParents.join(","));
			}

			const response = await fetch(
				`${this.baseUrl}/files/${fileId}?${params.toString()}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Drive move error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Drive move error:", error);
			return null;
		}
	}

	/**
	 * Export Google Workspace file to different format
	 */
	async exportFile(
		accessToken: string,
		fileId: string,
		mimeType: string,
	): Promise<Blob | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/files/${fileId}/export?mimeType=${encodeURIComponent(mimeType)}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Drive export error:", await response.text());
				return null;
			}

			return await response.blob();
		} catch (error) {
			console.error("Drive export error:", error);
			return null;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Create a job documentation folder structure
	 */
	async createJobFolder(
		accessToken: string,
		jobNumber: string,
		customerName: string,
		parentFolderId?: string,
	): Promise<{
		mainFolder: DriveFile;
		subFolders: Record<string, DriveFile>;
	} | null> {
		try {
			// Create main job folder
			const mainFolder = await this.createFolder(
				accessToken,
				`Job ${jobNumber} - ${customerName}`,
				parentFolderId,
			);
			if (!mainFolder) return null;

			// Create subfolders
			const subFolderNames = [
				"Photos",
				"Documents",
				"Invoices",
				"Before-After",
			];
			const subFolders: Record<string, DriveFile> = {};

			for (const name of subFolderNames) {
				const folder = await this.createFolder(
					accessToken,
					name,
					mainFolder.id,
				);
				if (folder) {
					subFolders[name.toLowerCase().replace("-", "_")] = folder;
				}
			}

			return { mainFolder, subFolders };
		} catch (error) {
			console.error("Create job folder error:", error);
			return null;
		}
	}

	/**
	 * Upload job photo with metadata
	 */
	async uploadJobPhoto(
		accessToken: string,
		photo: Blob,
		options: {
			jobNumber: string;
			photoType: "before" | "after" | "progress" | "equipment";
			folderId: string;
			description?: string;
		},
	): Promise<DriveFile | null> {
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const fileName = `${options.jobNumber}_${options.photoType}_${timestamp}.jpg`;

		return this.uploadFile(accessToken, photo, {
			name: fileName,
			mimeType: "image/jpeg",
			parents: [options.folderId],
			description:
				options.description ||
				`${options.photoType} photo for job ${options.jobNumber}`,
		});
	}

	/**
	 * Search for job files
	 */
	async searchJobFiles(
		accessToken: string,
		jobNumber: string,
	): Promise<DriveFile[]> {
		const result = await this.listFiles(accessToken, {
			query: jobNumber,
			trashed: false,
		});

		return result?.files || [];
	}
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService();
