/**
 * IndexedDB Wrapper for Offline Storage
 *
 * Provides a type-safe interface for storing and retrieving data offline.
 * Critical for field workers with spotty internet connections.
 *
 * Database: thorbis-offline
 * Version: 2 (Updated with comprehensive offline support)
 *
 * Stores:
 * - jobs: Offline job records
 * - invoices: Offline invoice records
 * - customers: Full customer records (not just cache)
 * - communications: Email/SMS/phone history
 * - payments: Payment transactions
 * - equipment: Equipment/asset tracking
 * - schedules: Appointments and scheduling
 * - tags: Tag management system
 * - attachments: File attachments metadata
 * - sync-queue: Pending sync operations
 */

const DB_NAME = "thorbis-offline";
const DB_VERSION = 2;

// Type definitions
export type OfflineJob = {
	id: string;
	customer_id: string;
	status: string;
	scheduled_date: string;
	notes: string;
	created_at: number;
	updated_at: number;
	synced: boolean;
};

export type OfflineInvoice = {
	id: string;
	customer_id: string;
	amount: number;
	status: string;
	line_items: any[];
	created_at: number;
	updated_at: number;
	synced: boolean;
};

export type OfflineCustomer = {
	id: string;
	company_id: string;
	user_id?: string | null;
	type: string;
	first_name: string;
	last_name: string;
	company_name?: string | null;
	email?: string | null;
	phone?: string | null;
	address?: string | null;
	city?: string | null;
	state?: string | null;
	zip?: string | null;
	status: string;
	total_revenue?: number;
	total_jobs?: number;
	outstanding_balance?: number;
	portal_enabled: boolean;
	created_at: number;
	updated_at: number;
	synced: boolean;
	deleted_at?: number | null;
};

export type OfflineCommunication = {
	id: string;
	company_id: string;
	customer_id?: string | null;
	job_id?: string | null;
	user_id?: string | null;
	type: string; // 'email' | 'sms' | 'phone' | 'chat' | 'note'
	direction: string; // 'inbound' | 'outbound'
	status: string;
	subject?: string | null;
	body?: string | null;
	from_email?: string | null;
	to_email?: string | null;
	from_phone?: string | null;
	to_phone?: string | null;
	thread_id?: string | null;
	parent_id?: string | null;
	read_at?: number | null;
	call_duration?: number | null;
	created_at: number;
	updated_at: number;
	synced: boolean;
	deleted_at?: number | null;
};

export type OfflinePayment = {
	id: string;
	company_id: string;
	customer_id: string;
	invoice_id?: string | null;
	job_id?: string | null;
	payment_number: string;
	amount: number; // In cents
	payment_method: string;
	payment_type: string;
	status: string;
	card_brand?: string | null;
	card_last4?: string | null;
	refunded_amount: number;
	is_reconciled: boolean;
	processed_at?: number | null;
	created_at: number;
	updated_at: number;
	synced: boolean;
	deleted_at?: number | null;
};

export type OfflineEquipment = {
	id: string;
	company_id: string;
	customer_id: string;
	property_id?: string | null;
	equipment_number: string;
	type: string;
	manufacturer?: string | null;
	model?: string | null;
	serial_number?: string | null;
	install_date?: number | null;
	warranty_expiration?: number | null;
	is_under_warranty: boolean;
	status: string;
	next_service_due?: number | null;
	created_at: number;
	updated_at: number;
	synced: boolean;
	deleted_at?: number | null;
};

export type OfflineSchedule = {
	id: string;
	company_id: string;
	customer_id?: string | null;
	job_id?: string | null;
	assigned_to?: string | null;
	type: string;
	title: string;
	start_time: number;
	end_time: number;
	duration: number;
	status: string;
	is_recurring: boolean;
	reminder_sent: boolean;
	created_at: number;
	updated_at: number;
	synced: boolean;
	deleted_at?: number | null;
};

export type OfflineTag = {
	id: string;
	company_id: string;
	name: string;
	slug: string;
	category?: string | null;
	color?: string | null;
	usage_count: number;
	is_system: boolean;
	created_at: number;
	updated_at: number;
	synced: boolean;
};

export type OfflineAttachment = {
	id: string;
	company_id: string;
	entity_type: string; // 'job' | 'customer' | 'invoice' | 'equipment' | etc.
	entity_id: string;
	file_name: string;
	file_size: number;
	mime_type: string;
	storage_url: string;
	is_image: boolean;
	is_document: boolean;
	thumbnail_url?: string | null;
	created_at: number;
	updated_at: number;
	synced: boolean;
	deleted_at?: number | null;
};

export type SyncOperation = {
	id: string;
	operation: "INSERT" | "UPDATE" | "DELETE";
	table: string;
	data: any;
	timestamp: number;
	retry_count: number;
	error?: string;
};

export type StoreName =
	| "jobs"
	| "invoices"
	| "customers"
	| "communications"
	| "payments"
	| "equipment"
	| "schedules"
	| "tags"
	| "attachments"
	| "sync-queue";

/**
 * Initialize IndexedDB database and create object stores
 */
function openDatabase(): Promise<IDBDatabase> {
	// SSR guard - IndexedDB only exists in browser
	if (typeof window === "undefined" || typeof indexedDB === "undefined") {
		return Promise.reject(
			new Error("IndexedDB not available (server-side rendering)"),
		);
	}

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			reject(new Error("Failed to open IndexedDB"));
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const oldVersion = event.oldVersion;

			// Create object stores if they don't exist
			if (!db.objectStoreNames.contains("jobs")) {
				const jobsStore = db.createObjectStore("jobs", { keyPath: "id" });
				jobsStore.createIndex("synced", "synced", { unique: false });
				jobsStore.createIndex("updated_at", "updated_at", { unique: false });
				jobsStore.createIndex("company_id", "company_id", { unique: false });
			}

			if (!db.objectStoreNames.contains("invoices")) {
				const invoicesStore = db.createObjectStore("invoices", {
					keyPath: "id",
				});
				invoicesStore.createIndex("synced", "synced", { unique: false });
				invoicesStore.createIndex("updated_at", "updated_at", {
					unique: false,
				});
				invoicesStore.createIndex("company_id", "company_id", {
					unique: false,
				});
			}

			if (!db.objectStoreNames.contains("customers")) {
				const customersStore = db.createObjectStore("customers", {
					keyPath: "id",
				});
				customersStore.createIndex("synced", "synced", { unique: false });
				customersStore.createIndex("updated_at", "updated_at", {
					unique: false,
				});
				customersStore.createIndex("company_id", "company_id", {
					unique: false,
				});
				customersStore.createIndex("email", "email", { unique: false });
				customersStore.createIndex("phone", "phone", { unique: false });
				customersStore.createIndex("status", "status", { unique: false });
			} else if (oldVersion < 2) {
				// Migrate existing customers store from v1 to v2
				const transaction = (event.target as IDBOpenDBRequest).transaction!;
				const customersStore = transaction.objectStore("customers");

				// Add new indexes if they don't exist
				if (!customersStore.indexNames.contains("synced")) {
					customersStore.createIndex("synced", "synced", { unique: false });
				}
				if (!customersStore.indexNames.contains("company_id")) {
					customersStore.createIndex("company_id", "company_id", {
						unique: false,
					});
				}
				if (!customersStore.indexNames.contains("status")) {
					customersStore.createIndex("status", "status", { unique: false });
				}
			}

			// Version 2: Add new object stores
			if (oldVersion < 2) {
				// Communications store
				if (!db.objectStoreNames.contains("communications")) {
					const communicationsStore = db.createObjectStore("communications", {
						keyPath: "id",
					});
					communicationsStore.createIndex("synced", "synced", {
						unique: false,
					});
					communicationsStore.createIndex("updated_at", "updated_at", {
						unique: false,
					});
					communicationsStore.createIndex("company_id", "company_id", {
						unique: false,
					});
					communicationsStore.createIndex("customer_id", "customer_id", {
						unique: false,
					});
					communicationsStore.createIndex("type", "type", { unique: false });
					communicationsStore.createIndex("thread_id", "thread_id", {
						unique: false,
					});
					communicationsStore.createIndex("created_at", "created_at", {
						unique: false,
					});
				}

				// Payments store
				if (!db.objectStoreNames.contains("payments")) {
					const paymentsStore = db.createObjectStore("payments", {
						keyPath: "id",
					});
					paymentsStore.createIndex("synced", "synced", { unique: false });
					paymentsStore.createIndex("updated_at", "updated_at", {
						unique: false,
					});
					paymentsStore.createIndex("company_id", "company_id", {
						unique: false,
					});
					paymentsStore.createIndex("customer_id", "customer_id", {
						unique: false,
					});
					paymentsStore.createIndex("invoice_id", "invoice_id", {
						unique: false,
					});
					paymentsStore.createIndex("payment_number", "payment_number", {
						unique: true,
					});
					paymentsStore.createIndex("status", "status", { unique: false });
				}

				// Equipment store
				if (!db.objectStoreNames.contains("equipment")) {
					const equipmentStore = db.createObjectStore("equipment", {
						keyPath: "id",
					});
					equipmentStore.createIndex("synced", "synced", { unique: false });
					equipmentStore.createIndex("updated_at", "updated_at", {
						unique: false,
					});
					equipmentStore.createIndex("company_id", "company_id", {
						unique: false,
					});
					equipmentStore.createIndex("customer_id", "customer_id", {
						unique: false,
					});
					equipmentStore.createIndex("equipment_number", "equipment_number", {
						unique: true,
					});
					equipmentStore.createIndex("type", "type", { unique: false });
					equipmentStore.createIndex("status", "status", { unique: false });
				}

				// Schedules store
				if (!db.objectStoreNames.contains("schedules")) {
					const schedulesStore = db.createObjectStore("schedules", {
						keyPath: "id",
					});
					schedulesStore.createIndex("synced", "synced", { unique: false });
					schedulesStore.createIndex("updated_at", "updated_at", {
						unique: false,
					});
					schedulesStore.createIndex("company_id", "company_id", {
						unique: false,
					});
					schedulesStore.createIndex("customer_id", "customer_id", {
						unique: false,
					});
					schedulesStore.createIndex("job_id", "job_id", { unique: false });
					schedulesStore.createIndex("assigned_to", "assigned_to", {
						unique: false,
					});
					schedulesStore.createIndex("start_time", "start_time", {
						unique: false,
					});
					schedulesStore.createIndex("status", "status", { unique: false });
				}

				// Tags store
				if (!db.objectStoreNames.contains("tags")) {
					const tagsStore = db.createObjectStore("tags", { keyPath: "id" });
					tagsStore.createIndex("synced", "synced", { unique: false });
					tagsStore.createIndex("updated_at", "updated_at", { unique: false });
					tagsStore.createIndex("company_id", "company_id", { unique: false });
					tagsStore.createIndex("slug", "slug", { unique: false });
					tagsStore.createIndex("category", "category", { unique: false });
				}

				// Attachments store
				if (!db.objectStoreNames.contains("attachments")) {
					const attachmentsStore = db.createObjectStore("attachments", {
						keyPath: "id",
					});
					attachmentsStore.createIndex("synced", "synced", { unique: false });
					attachmentsStore.createIndex("updated_at", "updated_at", {
						unique: false,
					});
					attachmentsStore.createIndex("company_id", "company_id", {
						unique: false,
					});
					attachmentsStore.createIndex("entity_type", "entity_type", {
						unique: false,
					});
					attachmentsStore.createIndex("entity_id", "entity_id", {
						unique: false,
					});
					// Composite index for entity_type + entity_id
					attachmentsStore.createIndex("entity", ["entity_type", "entity_id"], {
						unique: false,
					});
				}
			}

			if (!db.objectStoreNames.contains("sync-queue")) {
				const syncQueueStore = db.createObjectStore("sync-queue", {
					keyPath: "id",
				});
				syncQueueStore.createIndex("timestamp", "timestamp", { unique: false });
				syncQueueStore.createIndex("retry_count", "retry_count", {
					unique: false,
				});
				syncQueueStore.createIndex("table", "table", { unique: false });
			}
		};
	});
}

/**
 * Add a record to a store
 */
export async function addRecord<T>(
	storeName: StoreName,
	record: T,
): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readwrite");
		const store = transaction.objectStore(storeName);
		const request = store.add(record);

		request.onsuccess = () => {
			db.close();
			resolve();
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to add record to ${storeName}`));
		};
	});
}

/**
 * Update a record in a store
 */
export async function updateRecord<T>(
	storeName: StoreName,
	record: T,
): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readwrite");
		const store = transaction.objectStore(storeName);
		const request = store.put(record);

		request.onsuccess = () => {
			db.close();
			resolve();
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to update record in ${storeName}`));
		};
	});
}

/**
 * Get a record by ID
 */
export async function getRecord<T>(
	storeName: StoreName,
	id: string,
): Promise<T | null> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readonly");
		const store = transaction.objectStore(storeName);
		const request = store.get(id);

		request.onsuccess = () => {
			db.close();
			resolve(request.result || null);
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to get record from ${storeName}`));
		};
	});
}

/**
 * Get all records from a store
 */
export async function getAllRecords<T>(storeName: StoreName): Promise<T[]> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readonly");
		const store = transaction.objectStore(storeName);
		const request = store.getAll();

		request.onsuccess = () => {
			db.close();
			resolve(request.result || []);
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to get all records from ${storeName}`));
		};
	});
}

/**
 * Get records by index
 */
export async function getRecordsByIndex<T>(
	storeName: StoreName,
	indexName: string,
	value: any,
): Promise<T[]> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readonly");
		const store = transaction.objectStore(storeName);
		const index = store.index(indexName);
		const request = index.getAll(value);

		request.onsuccess = () => {
			db.close();
			resolve(request.result || []);
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to get records by index from ${storeName}`));
		};
	});
}

/**
 * Delete a record by ID
 */
export async function deleteRecord(
	storeName: StoreName,
	id: string,
): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readwrite");
		const store = transaction.objectStore(storeName);
		const request = store.delete(id);

		request.onsuccess = () => {
			db.close();
			resolve();
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to delete record from ${storeName}`));
		};
	});
}

/**
 * Clear all records from a store
 */
export async function clearStore(storeName: StoreName): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readwrite");
		const store = transaction.objectStore(storeName);
		const request = store.clear();

		request.onsuccess = () => {
			db.close();
			resolve();
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to clear store ${storeName}`));
		};
	});
}

/**
 * Count records in a store
 */
export async function countRecords(storeName: StoreName): Promise<number> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([storeName], "readonly");
		const store = transaction.objectStore(storeName);
		const request = store.count();

		request.onsuccess = () => {
			db.close();
			resolve(request.result || 0);
		};

		request.onerror = () => {
			db.close();
			reject(new Error(`Failed to count records in ${storeName}`));
		};
	});
}

/**
 * Generate a temporary ID for offline records
 */
export function generateTempId(): string {
	return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an ID is a temporary offline ID
 */
export function isTempId(id: string): boolean {
	return id.startsWith("temp_");
}

/**
 * Get unsynced records from a store
 */
export async function getUnsyncedRecords<T extends { synced: boolean }>(
	storeName: StoreName,
): Promise<T[]> {
	return getRecordsByIndex<T>(storeName, "synced", false);
}

/**
 * Clear old cached data (older than 7 days) from all stores
 * Removes synced records that are stale to free up storage space
 */
export async function clearOldCache(): Promise<void> {
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	const db = await openDatabase();

	const storesToClear = [
		"customers",
		"communications",
		"payments",
		"equipment",
		"schedules",
		"tags",
		"attachments",
	];

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storesToClear, "readwrite");
		let completedStores = 0;

		const checkComplete = () => {
			completedStores++;
			if (completedStores === storesToClear.length) {
				db.close();
				resolve();
			}
		};

		storesToClear.forEach((storeName) => {
			const store = transaction.objectStore(storeName);
			const index = store.index("updated_at");
			const range = IDBKeyRange.upperBound(sevenDaysAgo);
			const request = index.openCursor(range);

			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest).result;
				if (cursor) {
					// Only delete if synced (don't delete unsynced offline records)
					const record = cursor.value;
					if (record.synced === true) {
						cursor.delete();
					}
					cursor.continue();
				} else {
					checkComplete();
				}
			};

			request.onerror = () => {
				db.close();
				reject(new Error(`Failed to clear old cache from ${storeName}`));
			};
		});
	});
}
