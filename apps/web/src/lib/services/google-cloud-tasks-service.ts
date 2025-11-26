/**
 * Google Cloud Tasks API Service
 *
 * Asynchronous task execution and scheduling.
 * Requires service account with Cloud Tasks permissions.
 *
 * Features:
 * - Create and manage task queues
 * - Schedule HTTP tasks
 * - Retry configuration
 * - Rate limiting
 * - Task dispatching
 *
 * @see https://cloud.google.com/tasks/docs/reference/rest
 */

// Types
export interface Queue {
	name: string;
	state?: "STATE_UNSPECIFIED" | "RUNNING" | "PAUSED" | "DISABLED";
	rateLimits?: RateLimits;
	retryConfig?: RetryConfig;
	stackdriverLoggingConfig?: {
		samplingRatio: number;
	};
	httpTarget?: HttpTarget;
}

export interface RateLimits {
	maxDispatchesPerSecond?: number;
	maxBurstSize?: number;
	maxConcurrentDispatches?: number;
}

export interface RetryConfig {
	maxAttempts?: number;
	maxRetryDuration?: string; // Duration in seconds, e.g., "3600s"
	minBackoff?: string;
	maxBackoff?: string;
	maxDoublings?: number;
}

export interface HttpTarget {
	uriOverride?: UriOverride;
	httpMethod?: HttpMethod;
	headerOverrides?: { header: { key: string; value: string } }[];
	oauthToken?: OAuthToken;
	oidcToken?: OidcToken;
}

export interface UriOverride {
	scheme?: "SCHEME_UNSPECIFIED" | "HTTP" | "HTTPS";
	host?: string;
	port?: string;
	pathOverride?: { path: string };
	queryOverride?: { queryParams: string };
	uriOverrideEnforceMode?:
		| "URI_OVERRIDE_ENFORCE_MODE_UNSPECIFIED"
		| "IF_NOT_EXISTS"
		| "ALWAYS";
}

export type HttpMethod =
	| "HTTP_METHOD_UNSPECIFIED"
	| "POST"
	| "GET"
	| "HEAD"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "OPTIONS";

export interface OAuthToken {
	serviceAccountEmail: string;
	scope?: string;
}

export interface OidcToken {
	serviceAccountEmail: string;
	audience?: string;
}

export interface Task {
	name?: string;
	httpRequest?: HttpRequest;
	scheduleTime?: string; // RFC3339 timestamp
	dispatchDeadline?: string;
	dispatchCount?: number;
	responseCount?: number;
	firstAttempt?: Attempt;
	lastAttempt?: Attempt;
	view?: "VIEW_UNSPECIFIED" | "BASIC" | "FULL";
}

export interface HttpRequest {
	url: string;
	httpMethod?: HttpMethod;
	headers?: Record<string, string>;
	body?: string; // Base64 encoded
	oauthToken?: OAuthToken;
	oidcToken?: OidcToken;
}

export interface Attempt {
	scheduleTime?: string;
	dispatchTime?: string;
	responseTime?: string;
	responseStatus?: {
		code: number;
		message?: string;
	};
}

export interface CreateTaskRequest {
	task: Task;
	responseView?: "VIEW_UNSPECIFIED" | "BASIC" | "FULL";
}

export interface ListQueuesResponse {
	queues?: Queue[];
	nextPageToken?: string;
}

export interface ListTasksResponse {
	tasks?: Task[];
	nextPageToken?: string;
}

// Service implementation
class GoogleCloudTasksService {
	private readonly projectId = process.env.GOOGLE_CLOUD_PROJECT;
	private readonly location =
		process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
	private accessToken: string | null = null;
	private tokenExpiry: number = 0;
	private readonly clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
	private readonly privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(
		/\\n/g,
		"\n",
	);

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!(this.projectId && this.clientEmail && this.privateKey);
	}

	/**
	 * Get access token for service account
	 */
	private async getAccessToken(): Promise<string | null> {
		if (this.accessToken && Date.now() < this.tokenExpiry) {
			return this.accessToken;
		}

		if (!this.clientEmail || !this.privateKey) {
			console.error("Cloud Tasks credentials not configured");
			return null;
		}

		try {
			const now = Math.floor(Date.now() / 1000);
			const header = { alg: "RS256", typ: "JWT" };
			const payload = {
				iss: this.clientEmail,
				sub: this.clientEmail,
				aud: "https://oauth2.googleapis.com/token",
				iat: now,
				exp: now + 3600,
				scope: "https://www.googleapis.com/auth/cloud-tasks",
			};

			const base64Header = Buffer.from(JSON.stringify(header)).toString(
				"base64url",
			);
			const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
				"base64url",
			);
			const signatureInput = `${base64Header}.${base64Payload}`;

			const crypto = await import("crypto");
			const sign = crypto.createSign("RSA-SHA256");
			sign.update(signatureInput);
			const signature = sign.sign(this.privateKey, "base64url");

			const jwt = `${signatureInput}.${signature}`;

			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
					assertion: jwt,
				}),
			});

			if (!response.ok) {
				console.error("Cloud Tasks token error:", await response.text());
				return null;
			}

			const data = await response.json();
			this.accessToken = data.access_token;
			this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

			return this.accessToken;
		} catch (error) {
			console.error("Cloud Tasks get access token error:", error);
			return null;
		}
	}

	private get baseUrl(): string {
		return `https://cloudtasks.googleapis.com/v2/projects/${this.projectId}/locations/${this.location}`;
	}

	/**
	 * Create a queue
	 */
	async createQueue(
		queueId: string,
		config?: Partial<Queue>,
	): Promise<Queue | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const queue: Queue = {
				name: `${this.baseUrl}/queues/${queueId}`,
				...config,
			};

			const response = await fetch(
				`${this.baseUrl}/queues?queueId=${queueId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(queue),
				},
			);

			if (!response.ok) {
				console.error("Cloud Tasks create queue error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks create queue error:", error);
			return null;
		}
	}

	/**
	 * Get a queue
	 */
	async getQueue(queueId: string): Promise<Queue | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/queues/${queueId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("Cloud Tasks get queue error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks get queue error:", error);
			return null;
		}
	}

	/**
	 * List queues
	 */
	async listQueues(pageSize = 100): Promise<ListQueuesResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/queues?pageSize=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Cloud Tasks list queues error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks list queues error:", error);
			return null;
		}
	}

	/**
	 * Delete a queue
	 */
	async deleteQueue(queueId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(`${this.baseUrl}/queues/${queueId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			return response.ok;
		} catch (error) {
			console.error("Cloud Tasks delete queue error:", error);
			return false;
		}
	}

	/**
	 * Pause a queue
	 */
	async pauseQueue(queueId: string): Promise<Queue | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/queues/${queueId}:pause`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("Cloud Tasks pause queue error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks pause queue error:", error);
			return null;
		}
	}

	/**
	 * Resume a queue
	 */
	async resumeQueue(queueId: string): Promise<Queue | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/queues/${queueId}:resume`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("Cloud Tasks resume queue error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks resume queue error:", error);
			return null;
		}
	}

	/**
	 * Create a task
	 */
	async createTask(queueId: string, task: Task): Promise<Task | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/queues/${queueId}/tasks`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ task }),
			});

			if (!response.ok) {
				console.error("Cloud Tasks create task error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks create task error:", error);
			return null;
		}
	}

	/**
	 * Create an HTTP task
	 */
	async createHttpTask(
		queueId: string,
		options: {
			url: string;
			method?: HttpMethod;
			headers?: Record<string, string>;
			body?: unknown;
			scheduleTime?: Date;
			dispatchDeadline?: number; // seconds
		},
	): Promise<Task | null> {
		const task: Task = {
			httpRequest: {
				url: options.url,
				httpMethod: options.method || "POST",
				headers: {
					"Content-Type": "application/json",
					...options.headers,
				},
			},
		};

		if (options.body) {
			task.httpRequest!.body = Buffer.from(
				JSON.stringify(options.body),
			).toString("base64");
		}

		if (options.scheduleTime) {
			task.scheduleTime = options.scheduleTime.toISOString();
		}

		if (options.dispatchDeadline) {
			task.dispatchDeadline = `${options.dispatchDeadline}s`;
		}

		return this.createTask(queueId, task);
	}

	/**
	 * Get a task
	 */
	async getTask(queueId: string, taskId: string): Promise<Task | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/queues/${queueId}/tasks/${taskId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Cloud Tasks get task error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks get task error:", error);
			return null;
		}
	}

	/**
	 * List tasks in a queue
	 */
	async listTasks(
		queueId: string,
		pageSize = 100,
	): Promise<ListTasksResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/queues/${queueId}/tasks?pageSize=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Cloud Tasks list tasks error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks list tasks error:", error);
			return null;
		}
	}

	/**
	 * Delete a task
	 */
	async deleteTask(queueId: string, taskId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(
				`${this.baseUrl}/queues/${queueId}/tasks/${taskId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Cloud Tasks delete task error:", error);
			return false;
		}
	}

	/**
	 * Run a task immediately (for testing)
	 */
	async runTask(queueId: string, taskId: string): Promise<Task | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/queues/${queueId}/tasks/${taskId}:run`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Cloud Tasks run task error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Cloud Tasks run task error:", error);
			return null;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Schedule a job reminder notification
	 */
	async scheduleJobReminder(
		jobId: string,
		customerId: string,
		reminderTime: Date,
		webhookUrl: string,
	): Promise<Task | null> {
		return this.createHttpTask("job-reminders", {
			url: webhookUrl,
			body: {
				type: "job_reminder",
				jobId,
				customerId,
				scheduledFor: reminderTime.toISOString(),
			},
			scheduleTime: reminderTime,
		});
	}

	/**
	 * Schedule follow-up task
	 */
	async scheduleFollowUp(
		customerId: string,
		jobId: string,
		followUpDate: Date,
		webhookUrl: string,
		reason: string,
	): Promise<Task | null> {
		return this.createHttpTask("follow-ups", {
			url: webhookUrl,
			body: {
				type: "follow_up",
				customerId,
				jobId,
				reason,
			},
			scheduleTime: followUpDate,
		});
	}

	/**
	 * Queue invoice generation
	 */
	async queueInvoiceGeneration(
		jobId: string,
		webhookUrl: string,
	): Promise<Task | null> {
		return this.createHttpTask("invoicing", {
			url: webhookUrl,
			body: {
				type: "generate_invoice",
				jobId,
				timestamp: new Date().toISOString(),
			},
		});
	}

	/**
	 * Schedule maintenance reminder
	 */
	async scheduleMaintenanceReminder(
		customerId: string,
		equipmentId: string,
		dueDate: Date,
		webhookUrl: string,
	): Promise<Task | null> {
		// Schedule reminder 7 days before due date
		const reminderDate = new Date(dueDate);
		reminderDate.setDate(reminderDate.getDate() - 7);

		return this.createHttpTask("maintenance-reminders", {
			url: webhookUrl,
			body: {
				type: "maintenance_reminder",
				customerId,
				equipmentId,
				dueDate: dueDate.toISOString(),
			},
			scheduleTime: reminderDate,
		});
	}

	/**
	 * Queue report generation
	 */
	async queueReportGeneration(
		reportType: string,
		parameters: Record<string, unknown>,
		webhookUrl: string,
		scheduleFor?: Date,
	): Promise<Task | null> {
		return this.createHttpTask("reports", {
			url: webhookUrl,
			body: {
				type: "generate_report",
				reportType,
				parameters,
				requestedAt: new Date().toISOString(),
			},
			scheduleTime: scheduleFor,
			dispatchDeadline: 1800, // 30 minutes for reports
		});
	}

	/**
	 * Setup standard field service queues
	 */
	async setupFieldServiceQueues(): Promise<{
		jobReminders?: Queue;
		followUps?: Queue;
		invoicing?: Queue;
		maintenanceReminders?: Queue;
		reports?: Queue;
	}> {
		const queues: Record<string, Queue | undefined> = {};

		// Job reminders queue - high priority
		queues.jobReminders =
			(await this.createQueue("job-reminders", {
				rateLimits: {
					maxDispatchesPerSecond: 100,
					maxConcurrentDispatches: 100,
				},
				retryConfig: {
					maxAttempts: 5,
					minBackoff: "10s",
					maxBackoff: "300s",
				},
			})) || undefined;

		// Follow-ups queue - medium priority
		queues.followUps =
			(await this.createQueue("follow-ups", {
				rateLimits: {
					maxDispatchesPerSecond: 50,
					maxConcurrentDispatches: 50,
				},
				retryConfig: {
					maxAttempts: 3,
					minBackoff: "60s",
					maxBackoff: "600s",
				},
			})) || undefined;

		// Invoicing queue - high priority
		queues.invoicing =
			(await this.createQueue("invoicing", {
				rateLimits: {
					maxDispatchesPerSecond: 25,
					maxConcurrentDispatches: 25,
				},
				retryConfig: {
					maxAttempts: 5,
					minBackoff: "30s",
					maxBackoff: "600s",
				},
			})) || undefined;

		// Maintenance reminders - low priority
		queues.maintenanceReminders =
			(await this.createQueue("maintenance-reminders", {
				rateLimits: {
					maxDispatchesPerSecond: 10,
					maxConcurrentDispatches: 10,
				},
				retryConfig: {
					maxAttempts: 3,
					minBackoff: "300s",
					maxBackoff: "3600s",
				},
			})) || undefined;

		// Reports queue - low priority, long timeout
		queues.reports =
			(await this.createQueue("reports", {
				rateLimits: {
					maxDispatchesPerSecond: 5,
					maxConcurrentDispatches: 5,
				},
				retryConfig: {
					maxAttempts: 2,
					minBackoff: "60s",
					maxBackoff: "600s",
				},
			})) || undefined;

		return queues;
	}
}

// Export singleton instance
export const googleCloudTasksService = new GoogleCloudTasksService();
