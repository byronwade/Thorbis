/**
 * Firebase Cloud Messaging (FCM) Service
 *
 * Push notification delivery to mobile and web applications.
 * Requires Firebase project setup and service account.
 *
 * Features:
 * - Send to individual devices
 * - Send to topics
 * - Send to device groups
 * - Notification and data messages
 * - Platform-specific configuration
 *
 * @see https://firebase.google.com/docs/cloud-messaging
 */

// Types
export interface Message {
	token?: string;
	topic?: string;
	condition?: string;
	notification?: Notification;
	data?: Record<string, string>;
	android?: AndroidConfig;
	webpush?: WebpushConfig;
	apns?: ApnsConfig;
	fcmOptions?: FcmOptions;
}

export interface Notification {
	title?: string;
	body?: string;
	image?: string;
}

export interface AndroidConfig {
	collapseKey?: string;
	priority?: "normal" | "high";
	ttl?: string;
	restrictedPackageName?: string;
	data?: Record<string, string>;
	notification?: AndroidNotification;
	fcmOptions?: AndroidFcmOptions;
}

export interface AndroidNotification {
	title?: string;
	body?: string;
	icon?: string;
	color?: string;
	sound?: string;
	tag?: string;
	clickAction?: string;
	bodyLocKey?: string;
	bodyLocArgs?: string[];
	titleLocKey?: string;
	titleLocArgs?: string[];
	channelId?: string;
	ticker?: string;
	sticky?: boolean;
	eventTime?: string;
	localOnly?: boolean;
	notificationPriority?:
		| "PRIORITY_UNSPECIFIED"
		| "PRIORITY_MIN"
		| "PRIORITY_LOW"
		| "PRIORITY_DEFAULT"
		| "PRIORITY_HIGH"
		| "PRIORITY_MAX";
	defaultSound?: boolean;
	defaultVibrateTimings?: boolean;
	defaultLightSettings?: boolean;
	vibrateTimings?: string[];
	visibility?: "VISIBILITY_UNSPECIFIED" | "PRIVATE" | "PUBLIC" | "SECRET";
	notificationCount?: number;
	image?: string;
}

export interface AndroidFcmOptions {
	analyticsLabel?: string;
}

export interface WebpushConfig {
	headers?: Record<string, string>;
	data?: Record<string, string>;
	notification?: WebpushNotification;
	fcmOptions?: WebpushFcmOptions;
}

export interface WebpushNotification {
	title?: string;
	body?: string;
	icon?: string;
	badge?: string;
	image?: string;
	tag?: string;
	requireInteraction?: boolean;
	renotify?: boolean;
	silent?: boolean;
	vibrate?: number[];
	timestamp?: number;
	actions?: { action: string; title: string; icon?: string }[];
}

export interface WebpushFcmOptions {
	link?: string;
	analyticsLabel?: string;
}

export interface ApnsConfig {
	headers?: Record<string, string>;
	payload?: ApnsPayload;
	fcmOptions?: ApnsFcmOptions;
}

export interface ApnsPayload {
	aps?: {
		alert?: string | { title?: string; body?: string; subtitle?: string };
		badge?: number;
		sound?: string | { critical?: number; name?: string; volume?: number };
		contentAvailable?: boolean;
		category?: string;
		threadId?: string;
		mutableContent?: boolean;
	};
	[key: string]: unknown;
}

export interface ApnsFcmOptions {
	analyticsLabel?: string;
	image?: string;
}

export interface FcmOptions {
	analyticsLabel?: string;
}

export interface MulticastMessage {
	tokens: string[];
	notification?: Notification;
	data?: Record<string, string>;
	android?: AndroidConfig;
	webpush?: WebpushConfig;
	apns?: ApnsConfig;
	fcmOptions?: FcmOptions;
}

export interface SendResponse {
	success: boolean;
	messageId?: string;
	error?: {
		code: string;
		message: string;
	};
}

export interface BatchResponse {
	responses: SendResponse[];
	successCount: number;
	failureCount: number;
}

export interface TopicResponse {
	messageId?: string;
	error?: {
		code: string;
		message: string;
	};
}

// Service implementation
class GoogleFCMService {
	private accessToken: string | null = null;
	private tokenExpiry: number = 0;
	private readonly projectId = process.env.FIREBASE_PROJECT_ID;
	private readonly clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	private readonly privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
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
	 * Get OAuth access token for FCM
	 */
	private async getAccessToken(): Promise<string | null> {
		if (this.accessToken && Date.now() < this.tokenExpiry) {
			return this.accessToken;
		}

		if (!this.clientEmail || !this.privateKey) {
			console.error("Firebase credentials not configured");
			return null;
		}

		try {
			// Create JWT for service account
			const now = Math.floor(Date.now() / 1000);
			const header = { alg: "RS256", typ: "JWT" };
			const payload = {
				iss: this.clientEmail,
				sub: this.clientEmail,
				aud: "https://oauth2.googleapis.com/token",
				iat: now,
				exp: now + 3600,
				scope: "https://www.googleapis.com/auth/firebase.messaging",
			};

			const base64Header = Buffer.from(JSON.stringify(header)).toString(
				"base64url",
			);
			const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
				"base64url",
			);
			const signatureInput = `${base64Header}.${base64Payload}`;

			// Sign with private key (requires crypto)
			const crypto = await import("crypto");
			const sign = crypto.createSign("RSA-SHA256");
			sign.update(signatureInput);
			const signature = sign.sign(this.privateKey, "base64url");

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
				console.error("FCM token error:", await response.text());
				return null;
			}

			const data = await response.json();
			this.accessToken = data.access_token;
			this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

			return this.accessToken;
		} catch (error) {
			console.error("FCM get access token error:", error);
			return null;
		}
	}

	/**
	 * Send a message to a device
	 */
	async send(message: Message): Promise<SendResponse> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) {
				return {
					success: false,
					error: { code: "auth_error", message: "Failed to get access token" },
				};
			}

			const response = await fetch(
				`https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message }),
				},
			);

			if (!response.ok) {
				const error = await response.json();
				return {
					success: false,
					error: {
						code: error.error?.code || "unknown",
						message: error.error?.message || "Unknown error",
					},
				};
			}

			const data = await response.json();
			return { success: true, messageId: data.name };
		} catch (error) {
			console.error("FCM send error:", error);
			return {
				success: false,
				error: {
					code: "internal",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	/**
	 * Send to multiple devices
	 */
	async sendMulticast(message: MulticastMessage): Promise<BatchResponse> {
		const responses: SendResponse[] = [];
		let successCount = 0;
		let failureCount = 0;

		// FCM v1 doesn't have native multicast, so we send individually
		for (const token of message.tokens) {
			const result = await this.send({
				token,
				notification: message.notification,
				data: message.data,
				android: message.android,
				webpush: message.webpush,
				apns: message.apns,
				fcmOptions: message.fcmOptions,
			});

			responses.push(result);
			if (result.success) successCount++;
			else failureCount++;
		}

		return { responses, successCount, failureCount };
	}

	/**
	 * Send to a topic
	 */
	async sendToTopic(
		topic: string,
		notification: Notification,
		data?: Record<string, string>,
	): Promise<SendResponse> {
		return this.send({
			topic,
			notification,
			data,
		});
	}

	/**
	 * Send with condition (multiple topics)
	 */
	async sendWithCondition(
		condition: string,
		notification: Notification,
		data?: Record<string, string>,
	): Promise<SendResponse> {
		// Example condition: "'topic1' in topics && 'topic2' in topics"
		return this.send({
			condition,
			notification,
			data,
		});
	}

	/**
	 * Subscribe device to topic (requires client SDK)
	 * Note: Topic management is typically done client-side
	 */
	async subscribeToTopic(
		tokens: string[],
		topic: string,
	): Promise<{ successCount: number; failureCount: number }> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) {
				return { successCount: 0, failureCount: tokens.length };
			}

			const response = await fetch(
				`https://iid.googleapis.com/iid/v1:batchAdd`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						to: `/topics/${topic}`,
						registration_tokens: tokens,
					}),
				},
			);

			if (!response.ok) {
				return { successCount: 0, failureCount: tokens.length };
			}

			const data = await response.json();
			const failureCount = (data.results || []).filter(
				(r: { error?: string }) => r.error,
			).length;
			return { successCount: tokens.length - failureCount, failureCount };
		} catch (error) {
			console.error("FCM subscribe error:", error);
			return { successCount: 0, failureCount: tokens.length };
		}
	}

	/**
	 * Unsubscribe device from topic
	 */
	async unsubscribeFromTopic(
		tokens: string[],
		topic: string,
	): Promise<{ successCount: number; failureCount: number }> {
		try {
			const accessToken = await this.getAccessToken();
			if (!accessToken) {
				return { successCount: 0, failureCount: tokens.length };
			}

			const response = await fetch(
				`https://iid.googleapis.com/iid/v1:batchRemove`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						to: `/topics/${topic}`,
						registration_tokens: tokens,
					}),
				},
			);

			if (!response.ok) {
				return { successCount: 0, failureCount: tokens.length };
			}

			const data = await response.json();
			const failureCount = (data.results || []).filter(
				(r: { error?: string }) => r.error,
			).length;
			return { successCount: tokens.length - failureCount, failureCount };
		} catch (error) {
			console.error("FCM unsubscribe error:", error);
			return { successCount: 0, failureCount: tokens.length };
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Send job assignment notification
	 */
	async notifyJobAssignment(
		technicianToken: string,
		job: {
			jobNumber: string;
			customerName: string;
			address: string;
			scheduledTime: string;
			serviceType: string;
		},
	): Promise<SendResponse> {
		return this.send({
			token: technicianToken,
			notification: {
				title: `New Job Assignment: ${job.jobNumber}`,
				body: `${job.serviceType} for ${job.customerName}\n${job.scheduledTime}`,
			},
			data: {
				type: "job_assignment",
				jobNumber: job.jobNumber,
				customerName: job.customerName,
				address: job.address,
				scheduledTime: job.scheduledTime,
				serviceType: job.serviceType,
			},
			android: {
				priority: "high",
				notification: {
					channelId: "job_assignments",
					clickAction: "OPEN_JOB_DETAILS",
				},
			},
			apns: {
				payload: {
					aps: {
						sound: "default",
						badge: 1,
					},
				},
			},
		});
	}

	/**
	 * Send customer arrival notification
	 */
	async notifyTechnicianArrival(
		customerToken: string,
		data: {
			technicianName: string;
			estimatedArrival: string;
			jobNumber: string;
		},
	): Promise<SendResponse> {
		return this.send({
			token: customerToken,
			notification: {
				title: "Technician On The Way!",
				body: `${data.technicianName} will arrive in approximately ${data.estimatedArrival}`,
			},
			data: {
				type: "technician_arrival",
				jobNumber: data.jobNumber,
				technicianName: data.technicianName,
				estimatedArrival: data.estimatedArrival,
			},
		});
	}

	/**
	 * Send job status update
	 */
	async notifyJobStatusUpdate(
		customerToken: string,
		data: {
			jobNumber: string;
			status:
				| "scheduled"
				| "en_route"
				| "arrived"
				| "in_progress"
				| "completed";
			message?: string;
		},
	): Promise<SendResponse> {
		const titles: Record<string, string> = {
			scheduled: "Job Scheduled",
			en_route: "Technician En Route",
			arrived: "Technician Arrived",
			in_progress: "Work In Progress",
			completed: "Job Completed",
		};

		return this.send({
			token: customerToken,
			notification: {
				title: titles[data.status] || "Job Update",
				body:
					data.message ||
					`Your service request #${data.jobNumber} has been updated.`,
			},
			data: {
				type: "job_status",
				jobNumber: data.jobNumber,
				status: data.status,
			},
		});
	}

	/**
	 * Send payment received notification
	 */
	async notifyPaymentReceived(
		customerToken: string,
		data: {
			invoiceNumber: string;
			amount: number;
			paymentMethod: string;
		},
	): Promise<SendResponse> {
		return this.send({
			token: customerToken,
			notification: {
				title: "Payment Received",
				body: `Thank you! Your payment of $${data.amount.toFixed(2)} for invoice #${data.invoiceNumber} has been received.`,
			},
			data: {
				type: "payment_received",
				invoiceNumber: data.invoiceNumber,
				amount: data.amount.toString(),
				paymentMethod: data.paymentMethod,
			},
		});
	}

	/**
	 * Send appointment reminder to topic
	 */
	async sendAppointmentReminders(
		appointments: {
			token: string;
			customerName: string;
			scheduledTime: string;
			jobNumber: string;
		}[],
	): Promise<BatchResponse> {
		const multicast: MulticastMessage = {
			tokens: appointments.map((a) => a.token),
			notification: {
				title: "Appointment Reminder",
				body: "You have an upcoming service appointment",
			},
		};

		return this.sendMulticast(multicast);
	}

	/**
	 * Send emergency dispatch notification
	 */
	async sendEmergencyDispatch(
		technicianTokens: string[],
		emergency: {
			address: string;
			description: string;
			priority: "urgent" | "emergency";
		},
	): Promise<BatchResponse> {
		return this.sendMulticast({
			tokens: technicianTokens,
			notification: {
				title: `${emergency.priority.toUpperCase()}: Emergency Dispatch`,
				body: `${emergency.description}\n${emergency.address}`,
			},
			data: {
				type: "emergency_dispatch",
				address: emergency.address,
				description: emergency.description,
				priority: emergency.priority,
			},
			android: {
				priority: "high",
				notification: {
					channelId: "emergency",
					sound: "emergency_sound",
				},
			},
			apns: {
				payload: {
					aps: {
						sound: { critical: 1, name: "emergency.caf", volume: 1.0 },
						badge: 1,
					},
				},
			},
		});
	}
}

// Export singleton instance
export const googleFCMService = new GoogleFCMService();
