/**
 * Google Cloud Pub/Sub API Service
 *
 * Real-time messaging and event streaming.
 * Requires service account with Pub/Sub permissions.
 *
 * Features:
 * - Topics management
 * - Subscriptions
 * - Message publishing
 * - Message pulling
 * - Dead letter queues
 *
 * @see https://cloud.google.com/pubsub/docs/reference/rest
 */

// Types
export interface Topic {
	name: string;
	labels?: Record<string, string>;
	messageStoragePolicy?: MessageStoragePolicy;
	kmsKeyName?: string;
	schemaSettings?: SchemaSettings;
	satisfiesPzs?: boolean;
	messageRetentionDuration?: string;
}

export interface MessageStoragePolicy {
	allowedPersistenceRegions: string[];
}

export interface SchemaSettings {
	schema: string;
	encoding: "ENCODING_UNSPECIFIED" | "JSON" | "BINARY";
	firstRevisionId?: string;
	lastRevisionId?: string;
}

export interface Subscription {
	name: string;
	topic: string;
	pushConfig?: PushConfig;
	bigqueryConfig?: BigQueryConfig;
	ackDeadlineSeconds?: number;
	retainAckedMessages?: boolean;
	messageRetentionDuration?: string;
	labels?: Record<string, string>;
	enableMessageOrdering?: boolean;
	expirationPolicy?: ExpirationPolicy;
	filter?: string;
	deadLetterPolicy?: DeadLetterPolicy;
	retryPolicy?: RetryPolicy;
	detached?: boolean;
	enableExactlyOnceDelivery?: boolean;
}

export interface PushConfig {
	pushEndpoint: string;
	attributes?: Record<string, string>;
	oidcToken?: {
		serviceAccountEmail: string;
		audience?: string;
	};
}

export interface BigQueryConfig {
	table: string;
	useTopicSchema?: boolean;
	writeMetadata?: boolean;
	dropUnknownFields?: boolean;
}

export interface ExpirationPolicy {
	ttl: string;
}

export interface DeadLetterPolicy {
	deadLetterTopic: string;
	maxDeliveryAttempts?: number;
}

export interface RetryPolicy {
	minimumBackoff?: string;
	maximumBackoff?: string;
}

export interface PubsubMessage {
	data?: string; // Base64 encoded
	attributes?: Record<string, string>;
	messageId?: string;
	publishTime?: string;
	orderingKey?: string;
}

export interface ReceivedMessage {
	ackId: string;
	message: PubsubMessage;
	deliveryAttempt?: number;
}

export interface PublishResponse {
	messageIds: string[];
}

export interface PullResponse {
	receivedMessages?: ReceivedMessage[];
}

export interface ListTopicsResponse {
	topics?: Topic[];
	nextPageToken?: string;
}

export interface ListSubscriptionsResponse {
	subscriptions?: Subscription[];
	nextPageToken?: string;
}

// Service implementation
class GooglePubSubService {
	private readonly projectId = process.env.GOOGLE_CLOUD_PROJECT;
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
			console.error("Pub/Sub credentials not configured");
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
				scope: "https://www.googleapis.com/auth/pubsub",
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
				console.error("Pub/Sub token error:", await response.text());
				return null;
			}

			const data = await response.json();
			this.accessToken = data.access_token;
			this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

			return this.accessToken;
		} catch (error) {
			console.error("Pub/Sub get access token error:", error);
			return null;
		}
	}

	private get baseUrl(): string {
		return `https://pubsub.googleapis.com/v1/projects/${this.projectId}`;
	}

	// ============================================
	// Topic Operations
	// ============================================

	/**
	 * Create a topic
	 */
	async createTopic(
		topicId: string,
		labels?: Record<string, string>,
	): Promise<Topic | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const body: Partial<Topic> = {};
			if (labels) body.labels = labels;

			const response = await fetch(`${this.baseUrl}/topics/${topicId}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				console.error("Pub/Sub create topic error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Pub/Sub create topic error:", error);
			return null;
		}
	}

	/**
	 * Get a topic
	 */
	async getTopic(topicId: string): Promise<Topic | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(`${this.baseUrl}/topics/${topicId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("Pub/Sub get topic error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Pub/Sub get topic error:", error);
			return null;
		}
	}

	/**
	 * List topics
	 */
	async listTopics(pageSize = 100): Promise<ListTopicsResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/topics?pageSize=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Pub/Sub list topics error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Pub/Sub list topics error:", error);
			return null;
		}
	}

	/**
	 * Delete a topic
	 */
	async deleteTopic(topicId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(`${this.baseUrl}/topics/${topicId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			return response.ok;
		} catch (error) {
			console.error("Pub/Sub delete topic error:", error);
			return false;
		}
	}

	// ============================================
	// Subscription Operations
	// ============================================

	/**
	 * Create a subscription
	 */
	async createSubscription(
		subscriptionId: string,
		topicId: string,
		config?: Partial<Subscription>,
	): Promise<Subscription | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const subscription: Partial<Subscription> = {
				topic: `projects/${this.projectId}/topics/${topicId}`,
				...config,
			};

			const response = await fetch(
				`${this.baseUrl}/subscriptions/${subscriptionId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(subscription),
				},
			);

			if (!response.ok) {
				console.error(
					"Pub/Sub create subscription error:",
					await response.text(),
				);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Pub/Sub create subscription error:", error);
			return null;
		}
	}

	/**
	 * Create a push subscription
	 */
	async createPushSubscription(
		subscriptionId: string,
		topicId: string,
		pushEndpoint: string,
	): Promise<Subscription | null> {
		return this.createSubscription(subscriptionId, topicId, {
			pushConfig: { pushEndpoint },
			ackDeadlineSeconds: 60,
		});
	}

	/**
	 * Get a subscription
	 */
	async getSubscription(subscriptionId: string): Promise<Subscription | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/subscriptions/${subscriptionId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Pub/Sub get subscription error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Pub/Sub get subscription error:", error);
			return null;
		}
	}

	/**
	 * List subscriptions
	 */
	async listSubscriptions(
		pageSize = 100,
	): Promise<ListSubscriptionsResponse | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/subscriptions?pageSize=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error(
					"Pub/Sub list subscriptions error:",
					await response.text(),
				);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Pub/Sub list subscriptions error:", error);
			return null;
		}
	}

	/**
	 * Delete a subscription
	 */
	async deleteSubscription(subscriptionId: string): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(
				`${this.baseUrl}/subscriptions/${subscriptionId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Pub/Sub delete subscription error:", error);
			return false;
		}
	}

	// ============================================
	// Message Operations
	// ============================================

	/**
	 * Publish a message to a topic
	 */
	async publish(
		topicId: string,
		data: unknown,
		attributes?: Record<string, string>,
	): Promise<string | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const message: PubsubMessage = {
				data: Buffer.from(JSON.stringify(data)).toString("base64"),
				attributes,
			};

			const response = await fetch(
				`${this.baseUrl}/topics/${topicId}:publish`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ messages: [message] }),
				},
			);

			if (!response.ok) {
				console.error("Pub/Sub publish error:", await response.text());
				return null;
			}

			const result: PublishResponse = await response.json();
			return result.messageIds[0];
		} catch (error) {
			console.error("Pub/Sub publish error:", error);
			return null;
		}
	}

	/**
	 * Publish multiple messages
	 */
	async publishBatch(
		topicId: string,
		messages: { data: unknown; attributes?: Record<string, string> }[],
	): Promise<string[] | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const pubsubMessages: PubsubMessage[] = messages.map((msg) => ({
				data: Buffer.from(JSON.stringify(msg.data)).toString("base64"),
				attributes: msg.attributes,
			}));

			const response = await fetch(
				`${this.baseUrl}/topics/${topicId}:publish`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ messages: pubsubMessages }),
				},
			);

			if (!response.ok) {
				console.error("Pub/Sub batch publish error:", await response.text());
				return null;
			}

			const result: PublishResponse = await response.json();
			return result.messageIds;
		} catch (error) {
			console.error("Pub/Sub batch publish error:", error);
			return null;
		}
	}

	/**
	 * Pull messages from a subscription
	 */
	async pull(
		subscriptionId: string,
		maxMessages = 10,
	): Promise<ReceivedMessage[] | null> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return null;

			const response = await fetch(
				`${this.baseUrl}/subscriptions/${subscriptionId}:pull`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ maxMessages }),
				},
			);

			if (!response.ok) {
				console.error("Pub/Sub pull error:", await response.text());
				return null;
			}

			const result: PullResponse = await response.json();
			return result.receivedMessages || [];
		} catch (error) {
			console.error("Pub/Sub pull error:", error);
			return null;
		}
	}

	/**
	 * Acknowledge messages
	 */
	async acknowledge(
		subscriptionId: string,
		ackIds: string[],
	): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(
				`${this.baseUrl}/subscriptions/${subscriptionId}:acknowledge`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ ackIds }),
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Pub/Sub acknowledge error:", error);
			return false;
		}
	}

	/**
	 * Modify ack deadline
	 */
	async modifyAckDeadline(
		subscriptionId: string,
		ackIds: string[],
		ackDeadlineSeconds: number,
	): Promise<boolean> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) return false;

			const response = await fetch(
				`${this.baseUrl}/subscriptions/${subscriptionId}:modifyAckDeadline`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ ackIds, ackDeadlineSeconds }),
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Pub/Sub modify ack deadline error:", error);
			return false;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Publish job event
	 */
	async publishJobEvent(
		eventType: "created" | "updated" | "completed" | "cancelled" | "assigned",
		jobData: {
			jobId: string;
			companyId: string;
			customerId?: string;
			technicianId?: string;
			status?: string;
		},
	): Promise<string | null> {
		return this.publish(
			"job-events",
			{
				eventType,
				timestamp: new Date().toISOString(),
				...jobData,
			},
			{
				eventType,
				jobId: jobData.jobId,
			},
		);
	}

	/**
	 * Publish customer event
	 */
	async publishCustomerEvent(
		eventType: "created" | "updated" | "contacted",
		customerData: {
			customerId: string;
			companyId: string;
			email?: string;
		},
	): Promise<string | null> {
		return this.publish(
			"customer-events",
			{
				eventType,
				timestamp: new Date().toISOString(),
				...customerData,
			},
			{
				eventType,
				customerId: customerData.customerId,
			},
		);
	}

	/**
	 * Publish payment event
	 */
	async publishPaymentEvent(
		eventType: "received" | "failed" | "refunded",
		paymentData: {
			paymentId: string;
			invoiceId: string;
			companyId: string;
			amount: number;
			customerId?: string;
		},
	): Promise<string | null> {
		return this.publish(
			"payment-events",
			{
				eventType,
				timestamp: new Date().toISOString(),
				...paymentData,
			},
			{
				eventType,
				paymentId: paymentData.paymentId,
			},
		);
	}

	/**
	 * Publish technician location update
	 */
	async publishTechnicianLocation(
		technicianId: string,
		location: { lat: number; lng: number },
		metadata?: { jobId?: string; status?: string },
	): Promise<string | null> {
		return this.publish(
			"technician-locations",
			{
				technicianId,
				location,
				timestamp: new Date().toISOString(),
				...metadata,
			},
			{
				technicianId,
			},
		);
	}

	/**
	 * Setup field service topics and subscriptions
	 */
	async setupFieldServiceMessaging(webhookBaseUrl: string): Promise<{
		topics: Record<string, Topic | null>;
		subscriptions: Record<string, Subscription | null>;
	}> {
		const topics: Record<string, Topic | null> = {};
		const subscriptions: Record<string, Subscription | null> = {};

		// Create topics
		topics.jobEvents = await this.createTopic("job-events", { type: "job" });
		topics.customerEvents = await this.createTopic("customer-events", {
			type: "customer",
		});
		topics.paymentEvents = await this.createTopic("payment-events", {
			type: "payment",
		});
		topics.technicianLocations = await this.createTopic(
			"technician-locations",
			{ type: "location" },
		);
		topics.notifications = await this.createTopic("notifications", {
			type: "notification",
		});

		// Create push subscriptions for webhooks
		if (topics.jobEvents) {
			subscriptions.jobEventsWebhook = await this.createPushSubscription(
				"job-events-webhook",
				"job-events",
				`${webhookBaseUrl}/api/webhooks/job-events`,
			);
		}

		if (topics.customerEvents) {
			subscriptions.customerEventsWebhook = await this.createPushSubscription(
				"customer-events-webhook",
				"customer-events",
				`${webhookBaseUrl}/api/webhooks/customer-events`,
			);
		}

		if (topics.paymentEvents) {
			subscriptions.paymentEventsWebhook = await this.createPushSubscription(
				"payment-events-webhook",
				"payment-events",
				`${webhookBaseUrl}/api/webhooks/payment-events`,
			);
		}

		return { topics, subscriptions };
	}

	/**
	 * Decode message data
	 */
	decodeMessageData<T>(message: PubsubMessage): T | null {
		try {
			if (!message.data) return null;
			const decoded = Buffer.from(message.data, "base64").toString("utf-8");
			return JSON.parse(decoded);
		} catch (error) {
			console.error("Message decode error:", error);
			return null;
		}
	}
}

// Export singleton instance
export const googlePubSubService = new GooglePubSubService();
